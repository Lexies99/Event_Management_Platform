import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {
  INITIAL_TENANTS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_STAFF_MEMBERS,
  DEFAULT_EVENT_DAYS,
} from '../src/data/mockData.js';

const PORT = Number(process.env.PORT || 4100);
const HOST = process.env.HOST || '127.0.0.1';
const DATA_DIR = process.env.EVENTFLOW_DATA_DIR || '/opt/eventflow/data';
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      tenants: structuredClone(INITIAL_TENANTS),
      events: structuredClone(INITIAL_EVENTS),
      registrations: structuredClone(INITIAL_REGISTRATIONS),
      chat: structuredClone(INITIAL_CHAT_MESSAGES),
      auditLogs: structuredClone(INITIAL_AUDIT_LOGS),
      staffMembers: structuredClone(INITIAL_STAFF_MEMBERS),
      updatedAt: new Date().toISOString(),
    };
    saveDb(initial);
    return initial;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    return {
      tenants: Array.isArray(parsed.tenants) ? parsed.tenants : structuredClone(INITIAL_TENANTS),
      events: Array.isArray(parsed.events) ? parsed.events : structuredClone(INITIAL_EVENTS),
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : structuredClone(INITIAL_REGISTRATIONS),
      chat: Array.isArray(parsed.chat) ? parsed.chat : structuredClone(INITIAL_CHAT_MESSAGES),
      auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : structuredClone(INITIAL_AUDIT_LOGS),
      staffMembers: Array.isArray(parsed.staffMembers) ? parsed.staffMembers : structuredClone(INITIAL_STAFF_MEMBERS),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed reading db.json, recreating from defaults:', err);
    const fallback = {
      tenants: structuredClone(INITIAL_TENANTS),
      events: structuredClone(INITIAL_EVENTS),
      registrations: structuredClone(INITIAL_REGISTRATIONS),
      chat: structuredClone(INITIAL_CHAT_MESSAGES),
      auditLogs: structuredClone(INITIAL_AUDIT_LOGS),
      staffMembers: structuredClone(INITIAL_STAFF_MEMBERS),
      updatedAt: new Date().toISOString(),
    };
    saveDb(fallback);
    return fallback;
  }
}

let db = ensureDb();

function saveDb(nextDb = db) {
  nextDb.updatedAt = new Date().toISOString();
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(nextDb, null, 2), 'utf8');
  fs.renameSync(tmp, DB_FILE);
}

function appendAudit(entry, ip = 'server') {
  const log = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ip,
    severity: 'info',
    role: 'system',
    ...entry,
  };
  db.auditLogs = [log, ...db.auditLogs].slice(0, 1000);
  return log;
}

function normalizeTicketInput(raw) {
  let text = String(raw || '').trim();
  if (!text) return '';
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const parsed = JSON.parse(text);
      text = String(parsed.ticketCode || parsed.ticket || parsed.code || text).trim();
    } catch {
      // keep raw
    }
  }
  if (/^https?:\/\//i.test(text) || text.includes('ticket=') || text.includes('code=')) {
    try {
      const parsedUrl = new URL(text.startsWith('http') ? text : `https://local.test/${text}`);
      const qCode = parsedUrl.searchParams.get('ticket') || parsedUrl.searchParams.get('code') || parsedUrl.searchParams.get('ticketCode');
      if (qCode) text = qCode.trim();
    } catch {
      // keep raw
    }
  }
  return text.replace(/^["']|["']$/g, '').trim();
}

function compactCode(str) {
  return String(str || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 10 * 1024 * 1024) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const p = url.pathname;
  const ip = String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || 'server').split(',')[0].trim();

  try {
    // Health
    if (req.method === 'GET' && p === '/api/health') {
      return sendJson(res, 200, {
        ok: true,
        tenants: db.tenants.length,
        registrations: db.registrations.length,
        updatedAt: db.updatedAt,
      });
    }

    // Full state snapshot
    if (req.method === 'GET' && p === '/api/state') {
      return sendJson(res, 200, db);
    }

    // Create registration
    if (req.method === 'POST' && p === '/api/registrations') {
      const regData = await readJsonBody(req);
      const emailNorm = String(regData.email || '').trim().toLowerCase();
      if (!regData.name || !emailNorm || !regData.eventId || !regData.tenantId) {
        return sendJson(res, 400, { error: 'Full name, email, tenantId, and eventId are required.' });
      }
      const existing = db.registrations.find(
        (r) => r.eventId === regData.eventId && String(r.email || '').toLowerCase() === emailNorm
      );
      if (existing) {
        return sendJson(res, 409, {
          error: `A registration with email ${regData.email} already exists for this event (Ticket: ${existing.ticketCode}).`,
          existing,
        });
      }

      const tenant = db.tenants.find((t) => t.id === regData.tenantId);
      const prefix = tenant ? tenant.slug.replace(/[^a-z0-9]/gi, '').substring(0, 3).toUpperCase() : 'EVT';
      let ticketCode = '';
      for (let attempt = 0; attempt < 20; attempt++) {
        const suffix = Math.floor(1000 + Math.random() * 9000);
        const candidate = `TKT-${prefix}-${suffix}`;
        if (!db.registrations.some((r) => r.ticketCode === candidate)) {
          ticketCode = candidate;
          break;
        }
      }
      if (!ticketCode) ticketCode = `TKT-${prefix}-${String(Date.now()).slice(-4)}`;

      const newReg = {
        id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        tenantId: regData.tenantId,
        eventId: regData.eventId,
        name: String(regData.name).trim(),
        title: regData.title || '',
        country: regData.country || 'Ghana',
        email: String(regData.email).trim(),
        phone: regData.phone || '',
        organization: regData.organization || 'Independent',
        jobTitle: regData.jobTitle || 'Attendee',
        category: regData.category || 'Attendee',
        passType: regData.passType || 'full_week',
        selectedDays: Array.isArray(regData.selectedDays) && regData.selectedDays.length > 0
          ? regData.selectedDays
          : DEFAULT_EVENT_DAYS.map((d) => d.id),
        dailyAttendance: regData.dailyAttendance || {},
        status: 'registered',
        ticketCode,
        photoUrl: regData.photoUrl || '',
        registeredAt: new Date().toISOString(),
        checkedInAt: null,
        checkedInBy: null,
        badgePrintedCount: 0,
        consentAccepted: Boolean(regData.consentAccepted),
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: 'v1.0',
      };

      db.registrations = [newReg, ...db.registrations];
      appendAudit({
        tenantId: regData.tenantId,
        user: newReg.name,
        role: 'attendee',
        action: 'REGISTRATION_CREATED',
        severity: 'success',
        target: `${newReg.name} (${ticketCode}) · ${newReg.category} · Terms v1.0 accepted`,
      }, ip);
      saveDb();
      return sendJson(res, 201, { registration: newReg, state: db });
    }

    // Check-in by ticket code / last 4 digits / email / QR payload
    if (req.method === 'POST' && p === '/api/checkin') {
      const body = await readJsonBody(req);
      const {
        ticketCode: rawTicketInput,
        staffName = 'Check-in Staff',
        currentDayId = 'day-1',
        currentDayLabel = 'Day 1',
        eventId = null,
        tenantId = null,
        forceOverride = false,
      } = body;

      const cleaned = normalizeTicketInput(rawTicketInput);
      const compactInput = compactCode(cleaned);
      const lowerInput = cleaned.toLowerCase();

      if (!cleaned) {
        return sendJson(res, 200, { success: false, reason: 'EMPTY', message: 'Please enter a ticket code, email, or scan a QR badge.' });
      }

      const activePool = eventId
        ? db.registrations.filter((r) => r.eventId === eventId)
        : tenantId
        ? db.registrations.filter((r) => r.tenantId === tenantId)
        : db.registrations;

      const findInPool = (pool) => {
        let match = pool.find((r) => String(r.ticketCode || '').trim().toLowerCase() === lowerInput);
        if (match) return match;
        match = pool.find((r) => compactCode(r.ticketCode) === compactInput);
        if (match) return match;
        if (/^\d{4}$/.test(cleaned)) {
          const suffixMatches = pool.filter((r) => compactCode(r.ticketCode).endsWith(cleaned));
          if (suffixMatches.length === 1) return suffixMatches[0];
        }
        match = pool.find((r) => String(r.email || '').trim().toLowerCase() === lowerInput);
        return match || null;
      };

      const target = findInPool(activePool);
      if (!target) {
        const otherMatch = findInPool(db.registrations);
        if (otherMatch) {
          const otherTenant = db.tenants.find((t) => t.id === otherMatch.tenantId);
          appendAudit({
            tenantId: tenantId || otherMatch.tenantId,
            user: staffName,
            role: 'staff',
            action: 'CHECKIN_WRONG_EVENT',
            severity: 'warning',
            target: `Code "${cleaned}" belongs to ${otherTenant?.name || 'another event'} (${otherMatch.name})`,
          }, ip);
          saveDb();
          return sendJson(res, 200, {
            success: false,
            reason: 'WRONG_EVENT',
            attendee: otherMatch,
            message: `Ticket ${otherMatch.ticketCode} (${otherMatch.name}) belongs to "${otherTenant?.name || 'another event'}", not this event.`,
          });
        }

        appendAudit({
          tenantId: tenantId || 'platform',
          user: staffName,
          role: 'staff',
          action: 'CHECKIN_NOT_FOUND',
          severity: 'warning',
          target: `Unrecognized ticket input: "${cleaned}" on ${currentDayLabel}`,
        }, ip);
        saveDb();
        return sendJson(res, 200, {
          success: false,
          reason: 'NOT_FOUND',
          message: `Ticket code "${cleaned}" was not found. Double-check the code or use Manual Search.`,
        });
      }

      const idx = db.registrations.findIndex((r) => r.id === target.id);
      const allowedDays = target.selectedDays || DEFAULT_EVENT_DAYS.map((d) => d.id);
      if (!forceOverride && !allowedDays.includes(currentDayId)) {
        appendAudit({
          tenantId: target.tenantId,
          user: staffName,
          role: 'staff',
          action: 'CHECKIN_DAY_DENIED',
          severity: 'warning',
          target: `${target.name} (${target.ticketCode}) not authorized for ${currentDayLabel}`,
        }, ip);
        saveDb();
        return sendJson(res, 200, {
          success: false,
          reason: 'DAY_NOT_ALLOWED',
          attendee: target,
          allowedDays,
          message: `Access denied for ${currentDayLabel}. Delegate pass only covers ${allowedDays.length} day(s).`,
        });
      }

      const dailyRecord = target.dailyAttendance?.[currentDayId];
      if (dailyRecord && (dailyRecord.checkedIn || dailyRecord.attended)) {
        appendAudit({
          tenantId: target.tenantId,
          user: staffName,
          role: 'staff',
          action: 'DUPLICATE_SCAN',
          severity: 'warning',
          target: `${target.name} (${target.ticketCode}) already checked in for ${currentDayLabel} by ${dailyRecord.checkedInBy}`,
        }, ip);
        saveDb();
        return sendJson(res, 200, {
          success: false,
          reason: 'ALREADY_CHECKED_IN_TODAY',
          attendee: target,
          previousTime: dailyRecord.timestamp,
          previousStaff: dailyRecord.checkedInBy,
          message: `Already checked in for ${currentDayLabel} at ${new Date(dailyRecord.timestamp).toLocaleTimeString()} by ${dailyRecord.checkedInBy}`,
        });
      }

      const now = new Date().toISOString();
      const updatedDaily = {
        ...(target.dailyAttendance || {}),
        [currentDayId]: {
          attended: true,
          checkedIn: true,
          timestamp: now,
          checkedInBy: staffName,
          override: Boolean(forceOverride),
        },
      };

      const updatedTarget = {
        ...target,
        status: 'attended',
        checkedInAt: now,
        checkedInBy: staffName,
        dailyAttendance: updatedDaily,
      };
      db.registrations[idx] = updatedTarget;

      appendAudit({
        tenantId: target.tenantId,
        user: staffName,
        role: 'staff',
        action: forceOverride ? 'CHECKIN_SUPERVISOR_OVERRIDE' : 'CHECKIN_RECORDED',
        severity: forceOverride ? 'warning' : 'success',
        target: `${target.name} (${target.ticketCode}) on ${currentDayLabel}`,
      }, ip);
      saveDb();

      return sendJson(res, 200, {
        success: true,
        attendee: updatedTarget,
        dayLabel: currentDayLabel,
        state: db,
      });
    }

    // Reprint badge
    if (req.method === 'POST' && p === '/api/reprint') {
      const { regId, staffName = 'Check-in Staff', reason = '3.1" Lanyard Badge Print' } = await readJsonBody(req);
      const idx = db.registrations.findIndex((r) => r.id === regId);
      if (idx === -1) return sendJson(res, 404, { error: 'Registration not found' });
      db.registrations[idx] = {
        ...db.registrations[idx],
        badgePrintedCount: (db.registrations[idx].badgePrintedCount || 0) + 1,
      };
      const target = db.registrations[idx];
      appendAudit({
        tenantId: target.tenantId,
        user: staffName,
        role: 'staff',
        action: 'BADGE_PRINTED',
        severity: 'info',
        target: `${target.name} (${target.ticketCode}) — Print #${target.badgePrintedCount} (${reason})`,
      }, ip);
      saveDb();
      return sendJson(res, 200, { registration: target, state: db });
    }

    // Create tenant + event + default staff
    if (req.method === 'POST' && p === '/api/tenants') {
      const tenantData = await readJsonBody(req);
      const cleanSlug = String(tenantData.slug || tenantData.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '') || `event-${Date.now()}`;
      if (db.tenants.some((t) => t.slug.toLowerCase() === cleanSlug)) {
        return sendJson(res, 409, { error: `The event URL slug "/${cleanSlug}" is already taken.` });
      }

      const tenantId = `tenant-${Date.now()}`;
      const eventId = `evt-${Date.now()}`;
      const newTenant = {
        id: tenantId,
        name: tenantData.name,
        shortName: tenantData.shortName || String(tenantData.name || '').split(' ').slice(0, 2).join(' '),
        slug: cleanSlug,
        brandColor: tenantData.primaryColor || tenantData.brandColor || '#5A6552',
        primaryColor: tenantData.primaryColor || tenantData.brandColor || '#5A6552',
        secondaryColor: tenantData.secondaryColor || '#DCE7D0',
        accentColor: tenantData.accentColor || '#3B7A57',
        neutralColor: tenantData.neutralColor || '#FAFBF8',
        defaultTheme: tenantData.defaultTheme || 'light',
        logoUrl: tenantData.logoUrl || '',
        heroImage: tenantData.heroImage || '/images/hero-keynote.jpg',
        website: tenantData.website || '',
        address: tenantData.venue || tenantData.address || 'Accra, Ghana',
        planId: tenantData.planId || 'growth',
        status: 'active',
        createdAt: new Date().toISOString(),
        organizer: {
          name: tenantData.organizerName || 'Event Organizer',
          email: tenantData.organizerEmail || `admin@${cleanSlug}.com`,
          role: 'organizer',
        },
        activeEventId: eventId,
      };

      const newEvent = {
        id: eventId,
        tenantId,
        title: tenantData.eventTitle || `${tenantData.name} Annual Conference 2026`,
        tagline: tenantData.eventTagline || 'Innovation, Leadership & Community Collaboration',
        description: tenantData.eventDescription || 'Dedicated event portal with self-registration, instant QR ticket passes, multi-desk check-in, and 3.1-inch lanyard badging.',
        venue: tenantData.venue || 'Main Convention Centre, Accra',
        startsAt: tenantData.startsAt || '2026-12-01T09:00',
        endsAt: tenantData.endsAt || '2026-12-05T17:00',
        capacity: Number(tenantData.capacity) || 350,
        registrationDeadline: '2026-11-30T23:59',
        currency: tenantData.currency || 'GHS',
        price: Number(tenantData.price) || 0,
        categories: ['Attendee', 'Participant', 'Speaker', 'VIP', 'Sponsor', 'Press'],
        eventDays: DEFAULT_EVENT_DAYS,
        badgeConfig: {
          badgeTitle: 'DELEGATE PASS',
          showQr: true,
          showPhoto: true,
          showOrg: true,
          showRole: true,
          customNote: 'Authorized Venue Entry',
        },
      };

      const defaultStaff = {
        id: `staff-${Date.now()}`,
        tenantId,
        name: `${tenantData.organizerName || 'Main'} Check-In Lead`,
        email: newTenant.organizer.email,
        phone: tenantData.phone || '',
        station: 'Desk 1 - Main Entrance',
        role: 'Lead Check-In Supervisor',
        pin: tenantData.staffPin || '1044',
        status: 'active',
        scansCount: 0,
        createdAt: new Date().toISOString(),
      };

      db.tenants = [newTenant, ...db.tenants];
      db.events = [newEvent, ...db.events];
      db.staffMembers = [defaultStaff, ...db.staffMembers];
      appendAudit({
        tenantId,
        user: tenantData.organizerName || 'Platform Super-Admin',
        role: 'organizer',
        action: 'TENANT_CREATED',
        severity: 'success',
        target: `Dedicated event website /${cleanSlug} launched for ${newTenant.name} (${newTenant.planId} plan)`,
      }, ip);
      saveDb();
      return sendJson(res, 201, { tenant: newTenant, event: newEvent, state: db });
    }

    // Update tenant
    if (req.method === 'PATCH' && p.startsWith('/api/tenants/')) {
      const tenantId = decodeURIComponent(p.slice('/api/tenants/'.length));
      const patch = await readJsonBody(req);
      const idx = db.tenants.findIndex((t) => t.id === tenantId);
      if (idx === -1) return sendJson(res, 404, { error: 'Tenant not found' });
      db.tenants[idx] = { ...db.tenants[idx], ...patch };
      appendAudit({
        tenantId,
        user: patch.updatedBy || db.tenants[idx].organizer?.name || 'Organizer',
        role: 'organizer',
        action: 'TENANT_UPDATED',
        severity: 'info',
        target: `Updated settings for ${db.tenants[idx].name}`,
      }, ip);
      saveDb();
      return sendJson(res, 200, { tenant: db.tenants[idx], state: db });
    }

    // Update event
    if (req.method === 'PATCH' && p.startsWith('/api/events/')) {
      const eventId = decodeURIComponent(p.slice('/api/events/'.length));
      const patch = await readJsonBody(req);
      const idx = db.events.findIndex((e) => e.id === eventId);
      if (idx === -1) return sendJson(res, 404, { error: 'Event not found' });
      db.events[idx] = { ...db.events[idx], ...patch };
      saveDb();
      return sendJson(res, 200, { event: db.events[idx], state: db });
    }

    // Staff management
    if (req.method === 'POST' && p === '/api/staff') {
      const staffData = await readJsonBody(req);
      const newMember = {
        id: `staff-${Date.now()}`,
        tenantId: staffData.tenantId,
        name: staffData.name,
        email: staffData.email || '',
        phone: staffData.phone || '',
        station: staffData.station || 'Desk 1 - General',
        role: staffData.role || 'Check-In Scanner',
        pin: staffData.pin || String(Math.floor(1000 + Math.random() * 9000)),
        status: 'active',
        scansCount: 0,
        createdAt: new Date().toISOString(),
      };
      db.staffMembers = [newMember, ...db.staffMembers];
      appendAudit({
        tenantId: staffData.tenantId,
        user: 'Event Organizer',
        role: 'organizer',
        action: 'STAFF_PROVISIONED',
        severity: 'info',
        target: `Provisioned ${newMember.name} for ${newMember.station}`,
      }, ip);
      saveDb();
      return sendJson(res, 201, { staff: newMember, state: db });
    }

    if (req.method === 'DELETE' && p.startsWith('/api/staff/')) {
      const staffId = decodeURIComponent(p.slice('/api/staff/'.length));
      const target = db.staffMembers.find((s) => s.id === staffId);
      db.staffMembers = db.staffMembers.filter((s) => s.id !== staffId);
      if (target) {
        appendAudit({
          tenantId: target.tenantId,
          user: 'Event Organizer',
          role: 'organizer',
          action: 'STAFF_REVOKED',
          severity: 'warning',
          target: `Revoked check-in access for ${target.name} (${target.station})`,
        }, ip);
      }
      saveDb();
      return sendJson(res, 200, { ok: true, state: db });
    }

    // Chat messages
    if (req.method === 'POST' && p === '/api/chat') {
      const msgData = await readJsonBody(req);
      const newMsg = {
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        isPinned: false,
        ...msgData,
      };
      db.chat = [...db.chat, newMsg];
      saveDb();
      return sendJson(res, 201, { message: newMsg, state: db });
    }

    if (req.method === 'DELETE' && p.startsWith('/api/chat/')) {
      const msgId = decodeURIComponent(p.slice('/api/chat/'.length));
      db.chat = db.chat.filter((m) => m.id !== msgId);
      saveDb();
      return sendJson(res, 200, { ok: true, state: db });
    }

    if (req.method === 'POST' && p.startsWith('/api/chat/') && p.endsWith('/pin')) {
      const msgId = decodeURIComponent(p.slice('/api/chat/'.length, -'/pin'.length));
      db.chat = db.chat.map((m) => (m.id === msgId ? { ...m, isPinned: !m.isPinned } : m));
      saveDb();
      return sendJson(res, 200, { ok: true, state: db });
    }

    // Audit log
    if (req.method === 'POST' && p === '/api/audit') {
      const entry = await readJsonBody(req);
      const log = appendAudit(entry, ip);
      saveDb();
      return sendJson(res, 201, { log, state: db });
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('API error:', err);
    return sendJson(res, 500, { error: err.message || 'Internal server error' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`EventFlow API listening on http://${HOST}:${PORT} (db: ${DB_FILE})`);
});
