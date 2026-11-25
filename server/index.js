import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(String(password || ''), salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, keyHex] = storedHash.split(':');
  const derived = crypto.scryptSync(String(password || ''), salt, 64);
  const storedBuf = Buffer.from(keyHex, 'hex');
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

function buildDefaultReminders(event, tenant) {
  const title = event?.title || tenant?.name || 'our upcoming event';
  const venue = event?.venue || tenant?.address || 'the event venue';
  const dateStr = event?.startsAt
    ? new Date(event.startsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'the scheduled date';

  return [
    {
      id: `rem-${event.id}-7d`,
      eventId: event.id,
      tenantId: event.tenantId,
      offsetDays: 7,
      label: '1 Week Before',
      enabled: true,
      channels: ['in_app', 'email', 'sms'],
      target: 'ALL',
      subject: `1 Week to Go: ${title}`,
      message: `Hello! Just 7 days until ${title} on ${dateStr} at ${venue}. Keep your QR ticket code handy for fast check-in and 3.1-inch lanyard badge printing.`,
      sentAt: null,
      lastRecipientsCount: 0,
    },
    {
      id: `rem-${event.id}-1d`,
      eventId: event.id,
      tenantId: event.tenantId,
      offsetDays: 1,
      label: '1 Day Before',
      enabled: true,
      channels: ['in_app', 'email', 'sms'],
      target: 'ALL',
      subject: `Tomorrow: ${title} Check-In Details`,
      message: `Reminder: ${title} starts tomorrow (${dateStr}) at ${venue}. Doors open 45 minutes before the opening keynote — bring your digital QR pass or ticket code.`,
      sentAt: null,
      lastRecipientsCount: 0,
    },
    {
      id: `rem-${event.id}-0d`,
      eventId: event.id,
      tenantId: event.tenantId,
      offsetDays: 0,
      label: 'Event Day Morning',
      enabled: true,
      channels: ['in_app', 'email', 'sms'],
      target: 'ALL',
      subject: `Today Is the Day! Welcome to ${title}`,
      message: `Welcome to ${title}! Check-in desks at ${venue} are ready. Present your QR ticket code (or last 4 digits) to collect your lanyard tag and unlock live delegate chat.`,
      sentAt: null,
      lastRecipientsCount: 0,
    },
  ];
}

function seedOrganizerPasswords(tenants) {
  return tenants.map((t) => ({
    ...t,
    organizer: {
      ...t.organizer,
      passwordHash: t.organizer?.passwordHash || hashPassword('organizer123'),
    },
  }));
}

function ensureRemindersForEvents(events, tenants, existingReminders = []) {
  const list = [...existingReminders];
  for (const ev of events) {
    const hasForEvent = list.some((r) => r.eventId === ev.id);
    if (!hasForEvent) {
      const tenant = tenants.find((t) => t.id === ev.tenantId);
      list.push(...buildDefaultReminders(ev, tenant));
    }
  }
  return list;
}

function buildInitialMeetings() {
  return [
    {
      id: 'mtg-acme-board-1',
      tenantId: 'tenant-acme',
      title: 'Q4 Executive Strategy & Operations Board Meeting',
      date: '2026-11-26',
      time: '10:00',
      venue: 'Executive Boardroom A, Accra HQ',
      host: 'Dr. Nana Assyne',
      mode: 'hybrid', // 'roster' | 'open' | 'hybrid'
      createdAt: new Date().toISOString(),
      attendees: [
        {
          id: 'ma-1',
          name: 'Dr. Nana Assyne',
          department: 'Executive Office',
          role: 'Chairperson',
          email: 'nana.assyne@acmetech.io',
          phone: '+233 24 555 0192',
          signedIn: true,
          signedInAt: '2026-11-25T09:52:00Z',
          signatureDataUrl: '',
          isWalkIn: false,
        },
        {
          id: 'ma-2',
          name: 'Alexander Dela Tetteh',
          department: 'Systems Architecture',
          role: 'Lead Architect',
          email: 'alexander.dela@innovation.gh',
          phone: '+233 24 412 8901',
          signedIn: false,
          signedInAt: null,
          signatureDataUrl: '',
          isWalkIn: false,
        },
        {
          id: 'ma-3',
          name: 'Efua Mensah-Bonsu',
          department: 'Data & Analytics',
          role: 'Head of Analytics',
          email: 'efua.bonsu@strata-analytics.gh',
          phone: '+233 55 900 1123',
          signedIn: false,
          signedInAt: null,
          signatureDataUrl: '',
          isWalkIn: false,
        },
        {
          id: 'ma-4',
          name: 'Kojo Asare-Darko',
          department: 'Corporate Communications',
          role: 'Media Lead',
          email: 'kojo.darko@dailygraphic.com.gh',
          phone: '+233 27 555 4321',
          signedIn: false,
          signedInAt: null,
          signatureDataUrl: '',
          isWalkIn: false,
        },
      ],
    },
  ];
}

function ensureDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const tenants = seedOrganizerPasswords(structuredClone(INITIAL_TENANTS));
    const events = structuredClone(INITIAL_EVENTS);
    const initial = {
      tenants,
      events,
      registrations: structuredClone(INITIAL_REGISTRATIONS),
      chat: structuredClone(INITIAL_CHAT_MESSAGES),
      auditLogs: structuredClone(INITIAL_AUDIT_LOGS),
      staffMembers: structuredClone(INITIAL_STAFF_MEMBERS),
      reminders: ensureRemindersForEvents(events, tenants, []),
      broadcasts: [],
      feedback: [],
      meetings: buildInitialMeetings(),
      updatedAt: new Date().toISOString(),
    };
    saveDb(initial);
    return initial;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const tenants = seedOrganizerPasswords(Array.isArray(parsed.tenants) ? parsed.tenants : structuredClone(INITIAL_TENANTS));
    const events = Array.isArray(parsed.events) ? parsed.events : structuredClone(INITIAL_EVENTS);
    const hydrated = {
      tenants,
      events,
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : structuredClone(INITIAL_REGISTRATIONS),
      chat: Array.isArray(parsed.chat) ? parsed.chat : structuredClone(INITIAL_CHAT_MESSAGES),
      auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : structuredClone(INITIAL_AUDIT_LOGS),
      staffMembers: Array.isArray(parsed.staffMembers) ? parsed.staffMembers : structuredClone(INITIAL_STAFF_MEMBERS),
      reminders: ensureRemindersForEvents(events, tenants, Array.isArray(parsed.reminders) ? parsed.reminders : []),
      broadcasts: Array.isArray(parsed.broadcasts) ? parsed.broadcasts : [],
      feedback: Array.isArray(parsed.feedback) ? parsed.feedback : [],
      meetings: Array.isArray(parsed.meetings) ? parsed.meetings : buildInitialMeetings(),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
    return hydrated;
  } catch (err) {
    console.error('Failed reading db.json, recreating from defaults:', err);
    const tenants = seedOrganizerPasswords(structuredClone(INITIAL_TENANTS));
    const events = structuredClone(INITIAL_EVENTS);
    const fallback = {
      tenants,
      events,
      registrations: structuredClone(INITIAL_REGISTRATIONS),
      chat: structuredClone(INITIAL_CHAT_MESSAGES),
      auditLogs: structuredClone(INITIAL_AUDIT_LOGS),
      staffMembers: structuredClone(INITIAL_STAFF_MEMBERS),
      reminders: ensureRemindersForEvents(events, tenants, []),
      broadcasts: [],
      feedback: [],
      meetings: buildInitialMeetings(),
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

// Strip passwordHash before sending tenants to browser clients
function publicState() {
  return {
    ...db,
    tenants: db.tenants.map((t) => ({
      ...t,
      organizer: t.organizer
        ? {
            name: t.organizer.name,
            email: t.organizer.email,
            role: t.organizer.role,
            hasPassword: Boolean(t.organizer.passwordHash),
          }
        : undefined,
    })),
  };
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

function selectBroadcastRecipients(eventId, target = 'ALL') {
  const regs = db.registrations.filter((r) => r.eventId === eventId);
  if (target === 'ATTENDED') return regs.filter((r) => r.status === 'attended');
  if (target === 'NOSHOW') return regs.filter((r) => r.status === 'registered');
  if (target === 'WAITLIST') return regs.filter((r) => r.status === 'waitlisted');
  return regs;
}

async function dispatchBulkMessage({
  tenantId,
  eventId,
  subject,
  message,
  target = 'ALL',
  channels = ['in_app', 'email', 'sms'],
  senderName = 'Event Organizer',
  kind = 'manual',
  pinToChat = true,
  ip = 'scheduler',
}) {
  const recipients = selectBroadcastRecipients(eventId, target);
  const tenant = db.tenants.find((t) => t.id === tenantId);

  // Optional external webhook delivery if SMS/Email gateway env vars are configured
  const channelResults = {
    in_app: 'delivered',
    email: process.env.EMAIL_WEBHOOK_URL ? 'queued' : 'logged_ready_for_smtp',
    sms: process.env.SMS_WEBHOOK_URL ? 'queued' : 'logged_ready_for_sms_gateway',
  };

  if (channels.includes('email') && process.env.EMAIL_WEBHOOK_URL && recipients.length > 0) {
    try {
      await fetch(process.env.EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.EMAIL_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.EMAIL_WEBHOOK_TOKEN}` } : {}),
        },
        body: JSON.stringify({
          subject,
          message,
          recipients: recipients.map((r) => ({ name: r.name, email: r.email, ticketCode: r.ticketCode })),
        }),
      });
      channelResults.email = 'sent';
    } catch {
      channelResults.email = 'webhook_error';
    }
  }

  if (channels.includes('sms') && process.env.SMS_WEBHOOK_URL && recipients.length > 0) {
    try {
      await fetch(process.env.SMS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.SMS_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.SMS_WEBHOOK_TOKEN}` } : {}),
        },
        body: JSON.stringify({
          message: `${subject}: ${message}`,
          recipients: recipients.filter((r) => r.phone).map((r) => ({ name: r.name, phone: r.phone, ticketCode: r.ticketCode })),
        }),
      });
      channelResults.sms = 'sent';
    } catch {
      channelResults.sms = 'webhook_error';
    }
  }

  // Post into live Event Chat as a pinned official announcement when in_app enabled
  if (channels.includes('in_app') && pinToChat) {
    const chatAnnouncement = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      eventId,
      authorName: `${senderName} (${kind === 'auto_reminder' ? 'Auto Reminder' : 'Announcement'})`,
      authorRole: 'Organizer',
      authorPhoto: tenant?.logoUrl || '',
      isOrganizer: true,
      isPinned: true,
      text: `${subject} — ${message}`,
      timestamp: new Date().toISOString(),
    };
    db.chat = [...db.chat, chatAnnouncement];
  }

  const record = {
    id: `bcast-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    tenantId,
    eventId,
    kind,
    target,
    subject,
    message,
    channels,
    channelResults,
    recipientCount: recipients.length,
    recipientPreview: recipients.slice(0, 5).map((r) => `${r.name} (${r.email})`),
    sentBy: senderName,
    sentAt: new Date().toISOString(),
  };

  db.broadcasts = [record, ...db.broadcasts].slice(0, 200);
  appendAudit({
    tenantId,
    user: senderName,
    role: kind === 'auto_reminder' ? 'system' : 'organizer',
    action: kind === 'auto_reminder' ? 'AUTO_REMINDER_SENT' : 'BULK_BROADCAST_SENT',
    severity: 'success',
    target: `"${subject}" delivered to ${recipients.length} delegate(s) (${target}) via ${channels.join(', ')}`,
  }, ip);

  saveDb();
  return record;
}

// Background Reminder Scheduler (checks every 60 seconds for 7-day, 1-day, and event-day triggers)
async function runReminderScheduler() {
  const now = new Date();
  for (const rem of db.reminders) {
    if (!rem.enabled || rem.sentAt) continue;
    const ev = db.events.find((e) => e.id === rem.eventId);
    if (!ev?.startsAt) continue;
    const startMs = new Date(ev.startsAt).getTime();
    if (Number.isNaN(startMs)) continue;

    // Trigger window: between (start - offsetDays) and (start - offsetDays + 24h)
    const triggerAtMs = startMs - rem.offsetDays * 24 * 60 * 60 * 1000;
    const windowEndMs = triggerAtMs + 24 * 60 * 60 * 1000;

    if (now.getTime() >= triggerAtMs && now.getTime() <= windowEndMs) {
      const tenant = db.tenants.find((t) => t.id === rem.tenantId);
      const record = await dispatchBulkMessage({
        tenantId: rem.tenantId,
        eventId: rem.eventId,
        subject: rem.subject,
        message: rem.message,
        target: rem.target || 'ALL',
        channels: rem.channels || ['in_app', 'email', 'sms'],
        senderName: tenant?.organizer?.name || 'EventPlan Scheduler',
        kind: 'auto_reminder',
        pinToChat: true,
        ip: 'scheduler',
      });
      rem.sentAt = record.sentAt;
      rem.lastRecipientsCount = record.recipientCount;
      saveDb();
    }
  }
}

setInterval(() => {
  runReminderScheduler().catch((e) => console.error('Reminder scheduler error:', e));
}, 60 * 1000);

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
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
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
        reminders: db.reminders.length,
        broadcasts: db.broadcasts.length,
        feedback: db.feedback.length,
        updatedAt: db.updatedAt,
      });
    }

    // Full state snapshot (sanitized — no password hashes)
    if (req.method === 'GET' && p === '/api/state') {
      return sendJson(res, 200, publicState());
    }

    // Real Organizer Authentication
    if (req.method === 'POST' && p === '/api/auth/organizer') {
      const { tenantId, email, password } = await readJsonBody(req);
      const tenant = db.tenants.find((t) => t.id === tenantId);
      if (!tenant) return sendJson(res, 404, { ok: false, error: 'Event portal not found.' });

      const expectedEmail = String(tenant.organizer?.email || '').trim().toLowerCase();
      const inputEmail = String(email || '').trim().toLowerCase();
      if (!inputEmail || inputEmail !== expectedEmail) {
        appendAudit({
          tenantId,
          user: inputEmail || 'Unknown',
          role: 'organizer',
          action: 'ORGANIZER_LOGIN_FAILED',
          severity: 'warning',
          target: `Invalid organizer email attempted for /${tenant.slug}`,
        }, ip);
        saveDb();
        return sendJson(res, 401, { ok: false, error: `Email does not match the registered organizer for ${tenant.shortName || tenant.name}.` });
      }

      if (!password || !verifyPassword(password, tenant.organizer?.passwordHash)) {
        appendAudit({
          tenantId,
          user: tenant.organizer?.name || inputEmail,
          role: 'organizer',
          action: 'ORGANIZER_LOGIN_FAILED',
          severity: 'warning',
          target: `Incorrect password attempted for /${tenant.slug}`,
        }, ip);
        saveDb();
        return sendJson(res, 401, { ok: false, error: 'Incorrect organizer password. Please try again.' });
      }

      appendAudit({
        tenantId,
        user: tenant.organizer?.name || inputEmail,
        role: 'organizer',
        action: 'ORGANIZER_LOGIN',
        severity: 'info',
        target: `Signed into Organizer Console (/${tenant.slug})`,
      }, ip);
      saveDb();
      return sendJson(res, 200, {
        ok: true,
        organizer: {
          name: tenant.organizer.name,
          email: tenant.organizer.email,
          role: 'organizer',
        },
        state: publicState(),
      });
    }

    // Create registration (with Capacity & Automatic Waitlist Enforcement!)
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
      const event = db.events.find((e) => e.id === regData.eventId);
      const activeSeatsCount = db.registrations.filter(
        (r) => r.eventId === regData.eventId && r.status !== 'waitlisted'
      ).length;
      const capacity = Number(event?.capacity || 500);
      const isWaitlisted = activeSeatsCount >= capacity;
      const waitlistPosition = isWaitlisted
        ? db.registrations.filter((r) => r.eventId === regData.eventId && r.status === 'waitlisted').length + 1
        : null;

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
        status: isWaitlisted ? 'waitlisted' : 'registered',
        waitlistPosition,
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
        action: isWaitlisted ? 'REGISTRATION_WAITLISTED' : 'REGISTRATION_CREATED',
        severity: isWaitlisted ? 'warning' : 'success',
        target: `${newReg.name} (${ticketCode}) · ${newReg.category}${isWaitlisted ? ` · Waitlist #${waitlistPosition}` : ''} · Terms v1.0 accepted`,
      }, ip);
      saveDb();
      return sendJson(res, 201, { registration: newReg, state: publicState() });
    }

    // Promote waitlisted delegate to confirmed
    if (req.method === 'POST' && p.startsWith('/api/registrations/') && p.endsWith('/promote')) {
      const regId = decodeURIComponent(p.slice('/api/registrations/'.length, -'/promote'.length));
      const { actorName = 'Event Organizer' } = await readJsonBody(req);
      const idx = db.registrations.findIndex((r) => r.id === regId);
      if (idx === -1) return sendJson(res, 404, { error: 'Registration not found' });
      db.registrations[idx] = {
        ...db.registrations[idx],
        status: 'registered',
        waitlistPosition: null,
      };
      const target = db.registrations[idx];
      appendAudit({
        tenantId: target.tenantId,
        user: actorName,
        role: 'organizer',
        action: 'WAITLIST_PROMOTED',
        severity: 'success',
        target: `Promoted ${target.name} (${target.ticketCode}) from waitlist to confirmed seat`,
      }, ip);
      saveDb();
      return sendJson(res, 200, { registration: target, state: publicState() });
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

      if (target.status === 'waitlisted' && !forceOverride) {
        return sendJson(res, 200, {
          success: false,
          reason: 'WAITLISTED',
          attendee: target,
          message: `${target.name} (${target.ticketCode}) is currently on the Waitlist (#${target.waitlistPosition || '?'}). Promote them in Organizer Dashboard or use Supervisor Override.`,
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
        waitlistPosition: null,
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
        state: publicState(),
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
      return sendJson(res, 200, { registration: target, state: publicState() });
    }

    // Update automated reminder rule
    if (req.method === 'PATCH' && p.startsWith('/api/reminders/')) {
      const remId = decodeURIComponent(p.slice('/api/reminders/'.length));
      const patch = await readJsonBody(req);
      const idx = db.reminders.findIndex((r) => r.id === remId);
      if (idx === -1) return sendJson(res, 404, { error: 'Reminder not found' });
      db.reminders[idx] = {
        ...db.reminders[idx],
        enabled: patch.enabled !== undefined ? Boolean(patch.enabled) : db.reminders[idx].enabled,
        subject: patch.subject !== undefined ? String(patch.subject) : db.reminders[idx].subject,
        message: patch.message !== undefined ? String(patch.message) : db.reminders[idx].message,
        target: patch.target !== undefined ? String(patch.target) : db.reminders[idx].target,
        channels: Array.isArray(patch.channels) ? patch.channels : db.reminders[idx].channels,
        sentAt: patch.resetSent ? null : db.reminders[idx].sentAt,
      };
      saveDb();
      return sendJson(res, 200, { reminder: db.reminders[idx], state: publicState() });
    }

    // Trigger an automated reminder immediately ("Send Now")
    if (req.method === 'POST' && p.startsWith('/api/reminders/') && p.endsWith('/send')) {
      const remId = decodeURIComponent(p.slice('/api/reminders/'.length, -'/send'.length));
      const { senderName = 'Event Organizer' } = await readJsonBody(req);
      const rem = db.reminders.find((r) => r.id === remId);
      if (!rem) return sendJson(res, 404, { error: 'Reminder not found' });
      const record = await dispatchBulkMessage({
        tenantId: rem.tenantId,
        eventId: rem.eventId,
        subject: rem.subject,
        message: rem.message,
        target: rem.target || 'ALL',
        channels: rem.channels || ['in_app', 'email', 'sms'],
        senderName,
        kind: 'auto_reminder',
        pinToChat: true,
        ip,
      });
      rem.sentAt = record.sentAt;
      rem.lastRecipientsCount = record.recipientCount;
      saveDb();
      return sendJson(res, 200, { broadcast: record, reminder: rem, state: publicState() });
    }

    // Manual bulk broadcast
    if (req.method === 'POST' && p === '/api/broadcasts') {
      const body = await readJsonBody(req);
      if (!body.tenantId || !body.eventId || !body.subject || !body.message) {
        return sendJson(res, 400, { error: 'tenantId, eventId, subject, and message are required.' });
      }
      const record = await dispatchBulkMessage({
        tenantId: body.tenantId,
        eventId: body.eventId,
        subject: String(body.subject).trim(),
        message: String(body.message).trim(),
        target: body.target || 'ALL',
        channels: Array.isArray(body.channels) && body.channels.length > 0 ? body.channels : ['in_app', 'email', 'sms'],
        senderName: body.senderName || 'Event Organizer',
        kind: 'manual',
        pinToChat: body.pinToChat !== false,
        ip,
      });
      return sendJson(res, 201, { broadcast: record, state: publicState() });
    }

    // Post-Event Feedback Survey
    if (req.method === 'POST' && p === '/api/feedback') {
      const body = await readJsonBody(req);
      const rating = Number(body.rating);
      if (!body.tenantId || !body.eventId || !rating || rating < 1 || rating > 5) {
        return sendJson(res, 400, { error: 'Valid rating (1-5), tenantId, and eventId are required.' });
      }
      const existingIdx = db.feedback.findIndex(
        (f) => f.eventId === body.eventId && body.attendeeId && f.attendeeId === body.attendeeId
      );
      const entry = {
        id: existingIdx >= 0 ? db.feedback[existingIdx].id : `fb-${Date.now()}`,
        tenantId: body.tenantId,
        eventId: body.eventId,
        attendeeId: body.attendeeId || null,
        attendeeName: body.attendeeName || 'Verified Delegate',
        rating,
        comment: String(body.comment || '').trim(),
        submittedAt: new Date().toISOString(),
      };
      if (existingIdx >= 0) {
        db.feedback[existingIdx] = entry;
      } else {
        db.feedback = [entry, ...db.feedback];
      }
      appendAudit({
        tenantId: body.tenantId,
        user: entry.attendeeName,
        role: 'attendee',
        action: 'FEEDBACK_SUBMITTED',
        severity: 'info',
        target: `Rated event ${rating}/5 stars${entry.comment ? ` — "${entry.comment.slice(0, 60)}"` : ''}`,
      }, ip);
      saveDb();
      return sendJson(res, 201, { feedback: entry, state: publicState() });
    }

    // Create tenant + event + default staff + default automated reminders
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
          passwordHash: hashPassword(tenantData.organizerPassword || 'organizer123'),
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
        eventTerms: String(tenantData.eventTerms || '').trim(),
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
      db.reminders = [...buildDefaultReminders(newEvent, newTenant), ...db.reminders];

      appendAudit({
        tenantId,
        user: tenantData.organizerName || 'Platform Super-Admin',
        role: 'organizer',
        action: 'TENANT_CREATED',
        severity: 'success',
        target: `Dedicated event website /${cleanSlug} launched for ${newTenant.name} (${newTenant.planId} plan)`,
      }, ip);
      saveDb();
      return sendJson(res, 201, {
        tenant: publicState().tenants.find((t) => t.id === tenantId),
        event: newEvent,
        state: publicState(),
      });
    }

    // Update tenant (including optional organizer password update)
    if (req.method === 'PATCH' && p.startsWith('/api/tenants/')) {
      const tenantId = decodeURIComponent(p.slice('/api/tenants/'.length));
      const patch = await readJsonBody(req);
      const idx = db.tenants.findIndex((t) => t.id === tenantId);
      if (idx === -1) return sendJson(res, 404, { error: 'Tenant not found' });

      const current = db.tenants[idx];
      const nextOrganizer = {
        ...current.organizer,
        ...(patch.organizer || {}),
        passwordHash: patch.newOrganizerPassword
          ? hashPassword(patch.newOrganizerPassword)
          : current.organizer?.passwordHash,
      };
      const cleanPatch = { ...patch };
      delete cleanPatch.newOrganizerPassword;
      delete cleanPatch.organizer;

      db.tenants[idx] = { ...current, ...cleanPatch, organizer: nextOrganizer };
      appendAudit({
        tenantId,
        user: patch.updatedBy || nextOrganizer?.name || 'Organizer',
        role: 'organizer',
        action: patch.newOrganizerPassword ? 'ORGANIZER_PASSWORD_UPDATED' : 'TENANT_UPDATED',
        severity: 'info',
        target: `Updated workspace settings for ${db.tenants[idx].name}`,
      }, ip);
      saveDb();
      return sendJson(res, 200, { tenant: publicState().tenants[idx], state: publicState() });
    }

    // Update event
    if (req.method === 'PATCH' && p.startsWith('/api/events/')) {
      const eventId = decodeURIComponent(p.slice('/api/events/'.length));
      const patch = await readJsonBody(req);
      const idx = db.events.findIndex((e) => e.id === eventId);
      if (idx === -1) return sendJson(res, 404, { error: 'Event not found' });
      db.events[idx] = { ...db.events[idx], ...patch };
      saveDb();
      return sendJson(res, 200, { event: db.events[idx], state: publicState() });
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
      return sendJson(res, 201, { staff: newMember, state: publicState() });
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
      return sendJson(res, 200, { ok: true, state: publicState() });
    }

    // Chat messages
    if (req.method === 'POST' && p === '/api/chat') {
      const msgData = await readJsonBody(req);
      const newMsg = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        isPinned: false,
        ...msgData,
      };
      db.chat = [...db.chat, newMsg];
      saveDb();
      return sendJson(res, 201, { message: newMsg, state: publicState() });
    }

    if (req.method === 'DELETE' && p.startsWith('/api/chat/')) {
      const msgId = decodeURIComponent(p.slice('/api/chat/'.length));
      db.chat = db.chat.filter((m) => m.id !== msgId);
      saveDb();
      return sendJson(res, 200, { ok: true, state: publicState() });
    }

    if (req.method === 'POST' && p.startsWith('/api/chat/') && p.endsWith('/pin')) {
      const msgId = decodeURIComponent(p.slice('/api/chat/'.length, -'/pin'.length));
      db.chat = db.chat.map((m) => (m.id === msgId ? { ...m, isPinned: !m.isPinned } : m));
      saveDb();
      return sendJson(res, 200, { ok: true, state: publicState() });
    }

    // Audit log
    if (req.method === 'POST' && p === '/api/audit') {
      const entry = await readJsonBody(req);
      const log = appendAudit(entry, ip);
      saveDb();
      return sendJson(res, 201, { log, state: publicState() });
    }

    // ── MEETINGS & ATTENDANCE SIGN-IN MODULE ─────────────────────────────────
    if (req.method === 'POST' && p === '/api/meetings') {
      const body = await readJsonBody(req);
      if (!body.tenantId || !body.title) {
        return sendJson(res, 400, { error: 'tenantId and meeting title are required.' });
      }
      const rosterInput = Array.isArray(body.roster) ? body.roster : [];
      const attendees = rosterInput
        .filter((r) => String(r?.name || '').trim())
        .map((r, i) => ({
          id: `ma-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
          name: String(r.name).trim(),
          department: String(r.department || '').trim(),
          role: String(r.role || '').trim(),
          email: String(r.email || '').trim(),
          phone: String(r.phone || '').trim(),
          signedIn: false,
          signedInAt: null,
          signatureDataUrl: '',
          isWalkIn: false,
        }));

      const newMeeting = {
        id: `mtg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        tenantId: body.tenantId,
        title: String(body.title).trim(),
        date: body.date || new Date().toISOString().slice(0, 10),
        time: body.time || '09:00',
        venue: String(body.venue || 'Main Conference Room').trim(),
        host: String(body.host || 'Meeting Chair').trim(),
        mode: ['roster', 'open', 'hybrid'].includes(body.mode)
          ? body.mode
          : attendees.length > 0
          ? 'hybrid'
          : 'open',
        createdAt: new Date().toISOString(),
        attendees,
      };

      db.meetings = [newMeeting, ...(db.meetings || [])];
      appendAudit({
        tenantId: body.tenantId,
        user: newMeeting.host,
        role: 'organizer',
        action: 'MEETING_CREATED',
        severity: 'info',
        target: `Created meeting "${newMeeting.title}" (${newMeeting.mode}, ${attendees.length} pre-loaded attendees)`,
      }, ip);
      saveDb();
      return sendJson(res, 201, { meeting: newMeeting, state: publicState() });
    }

    // Bulk add/upload attendees to an existing meeting roster
    if (req.method === 'POST' && p.startsWith('/api/meetings/') && p.endsWith('/roster')) {
      const mtgId = decodeURIComponent(p.slice('/api/meetings/'.length, -'/roster'.length));
      const { roster = [], actorName = 'Organizer' } = await readJsonBody(req);
      const idx = (db.meetings || []).findIndex((m) => m.id === mtgId);
      if (idx === -1) return sendJson(res, 404, { error: 'Meeting not found' });

      const existing = db.meetings[idx].attendees || [];
      const added = (Array.isArray(roster) ? roster : [])
        .filter((r) => String(r?.name || '').trim())
        .map((r, i) => ({
          id: `ma-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
          name: String(r.name).trim(),
          department: String(r.department || '').trim(),
          role: String(r.role || '').trim(),
          email: String(r.email || '').trim(),
          phone: String(r.phone || '').trim(),
          signedIn: false,
          signedInAt: null,
          signatureDataUrl: '',
          isWalkIn: false,
        }));

      db.meetings[idx] = {
        ...db.meetings[idx],
        attendees: [...existing, ...added],
      };
      appendAudit({
        tenantId: db.meetings[idx].tenantId,
        user: actorName,
        role: 'organizer',
        action: 'MEETING_ROSTER_UPLOADED',
        severity: 'info',
        target: `Added ${added.length} attendee(s) to "${db.meetings[idx].title}"`,
      }, ip);
      saveDb();
      return sendJson(res, 200, { meeting: db.meetings[idx], addedCount: added.length, state: publicState() });
    }

    // Sign in to a meeting (either next to an existing roster name OR as a QR walk-in!)
    if (req.method === 'POST' && p.startsWith('/api/meetings/') && p.endsWith('/signin')) {
      const mtgId = decodeURIComponent(p.slice('/api/meetings/'.length, -'/signin'.length));
      const body = await readJsonBody(req);
      const idx = (db.meetings || []).findIndex((m) => m.id === mtgId);
      if (idx === -1) return sendJson(res, 404, { error: 'Meeting not found' });

      const mtg = db.meetings[idx];
      const now = new Date().toISOString();
      const sig = String(body.signatureDataUrl || '');

      if (body.attendeeId) {
        const aIdx = (mtg.attendees || []).findIndex((a) => a.id === body.attendeeId);
        if (aIdx === -1) return sendJson(res, 404, { error: 'Attendee not found on meeting list' });
        const updatedAttendee = {
          ...mtg.attendees[aIdx],
          email: body.email ? String(body.email).trim() : mtg.attendees[aIdx].email,
          phone: body.phone ? String(body.phone).trim() : mtg.attendees[aIdx].phone,
          signedIn: true,
          signedInAt: now,
          signatureDataUrl: sig,
        };
        mtg.attendees[aIdx] = updatedAttendee;
        appendAudit({
          tenantId: mtg.tenantId,
          user: updatedAttendee.name,
          role: 'attendee',
          action: 'MEETING_SIGNED_IN',
          severity: 'success',
          target: `${updatedAttendee.name} signed attendance for "${mtg.title}"`,
        }, ip);
        saveDb();
        return sendJson(res, 200, { attendee: updatedAttendee, meeting: mtg, state: publicState() });
      }

      // Open / Walk-in QR sign-in
      const name = String(body.name || '').trim();
      if (!name) return sendJson(res, 400, { error: 'Full name is required to sign in.' });
      if (mtg.mode === 'roster') {
        return sendJson(res, 403, { error: 'This meeting only allows sign-in from the pre-uploaded attendance list.' });
      }

      const walkIn = {
        id: `ma-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name,
        department: String(body.department || '').trim(),
        role: String(body.role || '').trim(),
        email: String(body.email || '').trim(),
        phone: String(body.phone || '').trim(),
        signedIn: true,
        signedInAt: now,
        signatureDataUrl: sig,
        isWalkIn: true,
      };
      mtg.attendees = [...(mtg.attendees || []), walkIn];
      appendAudit({
        tenantId: mtg.tenantId,
        user: walkIn.name,
        role: 'attendee',
        action: 'MEETING_QR_SIGNIN',
        severity: 'success',
        target: `${walkIn.name} (${walkIn.department || 'Guest'}) signed in via QR for "${mtg.title}"`,
      }, ip);
      saveDb();
      return sendJson(res, 201, { attendee: walkIn, meeting: mtg, state: publicState() });
    }

    if (req.method === 'DELETE' && p.startsWith('/api/meetings/')) {
      const mtgId = decodeURIComponent(p.slice('/api/meetings/'.length));
      const target = (db.meetings || []).find((m) => m.id === mtgId);
      db.meetings = (db.meetings || []).filter((m) => m.id !== mtgId);
      if (target) {
        appendAudit({
          tenantId: target.tenantId,
          user: 'Event Organizer',
          role: 'organizer',
          action: 'MEETING_DELETED',
          severity: 'warning',
          target: `Deleted meeting "${target.title}"`,
        }, ip);
      }
      saveDb();
      return sendJson(res, 200, { ok: true, state: publicState() });
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
