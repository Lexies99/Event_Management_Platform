import {
  INITIAL_PLANS,
  INITIAL_TENANTS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_STAFF_MEMBERS,
  DEFAULT_EVENT_DAYS,
  LOCAL_AVATARS,
} from './mockData.js';

const STORAGE_KEYS = {
  SCHEMA_VERSION: 'emp_schema_version',
  TENANTS: 'emp_tenants_v1',
  EVENTS: 'emp_events_v1',
  REGISTRATIONS: 'emp_registrations_v1',
  CHAT: 'emp_chat_v1',
  AUDIT: 'emp_audit_v1',
  OFFLINE_QUEUE: 'emp_offline_checkins_v1',
  ACTIVE_TENANT_ID: 'emp_active_tenant_id_v1',
  ACTIVE_ROLE: 'emp_active_role_v1',
  CURRENT_ATTENDEE_ID: 'emp_current_attendee_id_v1',
  STAFF_MEMBERS: 'emp_staff_members_v1',
  THEME: 'emp_theme_mode_v1',
};

const CURRENT_SCHEMA_VERSION = '2.0';

function safeGet(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error('Storage read error', e);
    return defaultVal;
  }
}

function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event('emp_storage_updated'));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

/**
 * Extracts a clean ticket code from raw scanner or typed input.
 * Handles plain codes ("TKT-ACM-3301"), lowercase, spaces, missing hyphens ("TKTACM3301"),
 * URL QR payloads ("https://.../?ticket=TKT-ACM-3301"), or JSON QR payloads.
 */
function normalizeTicketInput(raw) {
  let text = String(raw || '').trim();
  if (!text) return '';

  // Try JSON payload
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.ticketCode || parsed.ticket || parsed.code) {
        text = String(parsed.ticketCode || parsed.ticket || parsed.code).trim();
      }
    } catch {
      // Not valid JSON, continue
    }
  }

  // Try URL query param ?ticket=... or ?code=...
  if (text.includes('://') || text.includes('?')) {
    try {
      const u = new URL(text.startsWith('http') ? text : `https://example.com/${text.replace(/^\/+/, '')}`);
      const qCode = u.searchParams.get('ticket') || u.searchParams.get('ticketCode') || u.searchParams.get('code');
      if (qCode) text = qCode.trim();
    } catch {
      // Ignore URL parse error
    }
  }

  return text.replace(/^["']|["']$/g, '').trim();
}

function compactCode(str) {
  return String(str || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export const Storage = {
  init() {
    const prevVersion = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);

    if (!localStorage.getItem(STORAGE_KEYS.TENANTS)) {
      safeSet(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
    } else if (prevVersion !== CURRENT_SCHEMA_VERSION) {
      // Migrate existing tenants to include FinPlanner branding palette & remove old external Unsplash stock
      const existing = safeGet(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
      const migrated = existing.map((t) => {
        const seed = INITIAL_TENANTS.find((s) => s.id === t.id || s.slug === t.slug);
        const logoUrl = t.logoUrl && t.logoUrl.includes('unsplash.com') ? '' : (t.logoUrl || '');
        return {
          ...seed,
          ...t,
          shortName: t.shortName || seed?.shortName || t.name.split(' ').slice(0, 2).join(' '),
          primaryColor: t.primaryColor || seed?.primaryColor || '#5A6552',
          secondaryColor: t.secondaryColor || seed?.secondaryColor || '#DCE7D0',
          accentColor: t.accentColor || seed?.accentColor || '#3B7A57',
          neutralColor: t.neutralColor || seed?.neutralColor || '#FAFBF8',
          defaultTheme: t.defaultTheme || 'light',
          heroImage: (t.heroImage && t.heroImage !== '/images/hero-summit.jpg' ? t.heroImage : null) || seed?.heroImage || '/images/hero-keynote.jpg',
          logoUrl,
        };
      });
      safeSet(STORAGE_KEYS.TENANTS, migrated);
    }

    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    } else if (prevVersion !== CURRENT_SCHEMA_VERSION) {
      const existing = safeGet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      const migrated = existing.map((ev) => ({
        ...ev,
        eventDays: ev.eventDays && ev.eventDays.length > 0 ? ev.eventDays : DEFAULT_EVENT_DAYS,
      }));
      safeSet(STORAGE_KEYS.EVENTS, migrated);
    }

    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      safeSet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    } else {
      const current = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
      const migrated = current.map((r, idx) => {
        const seed = INITIAL_REGISTRATIONS.find((s) => s.id === r.id);
        const hasOldPhoto = !r.photoUrl || r.photoUrl.includes('unsplash.com');
        return {
          ...r,
          selectedDays: r.selectedDays && r.selectedDays.length > 0
            ? r.selectedDays
            : (seed?.selectedDays || DEFAULT_EVENT_DAYS.map((d) => d.id)),
          dailyAttendance: r.dailyAttendance || {},
          photoUrl: hasOldPhoto ? (seed?.photoUrl || LOCAL_AVATARS[idx % LOCAL_AVATARS.length]) : r.photoUrl,
          termsAccepted: r.termsAccepted ?? true,
        };
      });
      const missing = INITIAL_REGISTRATIONS.filter((init) => !migrated.some((c) => c.id === init.id));
      safeSet(STORAGE_KEYS.REGISTRATIONS, [...migrated, ...missing]);
    }

    if (!localStorage.getItem(STORAGE_KEYS.CHAT)) {
      safeSet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    } else if (prevVersion !== CURRENT_SCHEMA_VERSION) {
      const current = safeGet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
      const migrated = current.map((m, idx) => ({
        ...m,
        authorPhoto: m.authorPhoto && m.authorPhoto.includes('unsplash.com')
          ? LOCAL_AVATARS[idx % LOCAL_AVATARS.length]
          : m.authorPhoto,
      }));
      safeSet(STORAGE_KEYS.CHAT, migrated);
    }

    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      safeSet(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE)) {
      safeSet(STORAGE_KEYS.OFFLINE_QUEUE, []);
    }

    if (!localStorage.getItem(STORAGE_KEYS.STAFF_MEMBERS) || prevVersion !== CURRENT_SCHEMA_VERSION) {
      const currentStaff = safeGet(STORAGE_KEYS.STAFF_MEMBERS, []);
      const fixedStaff = currentStaff.map((s) => (
        s.tenantId === 'tenant-test' ? { ...s, tenantId: 'tenant-acme' } : s
      ));
      const missingStaff = INITIAL_STAFF_MEMBERS.filter((s) => !fixedStaff.some((c) => c.id === s.id));
      safeSet(STORAGE_KEYS.STAFF_MEMBERS, [...fixedStaff, ...missingStaff]);
    }

    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
  },

  // Theme getter/setter
  getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    } catch {
      return 'light';
    }
  },
  setTheme(mode) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch {
      // ignore
    }
  },

  // State Getters
  getTenants() {
    const list = safeGet(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
    return list.map((t) => ({
      ...t,
      shortName: t.shortName || t.name.split(' ').slice(0, 2).join(' '),
      primaryColor: t.primaryColor || t.brandColor || '#5A6552',
      secondaryColor: t.secondaryColor || '#DCE7D0',
      accentColor: t.accentColor || '#3B7A57',
      neutralColor: t.neutralColor || '#FAFBF8',
      logoUrl: t.logoUrl && t.logoUrl.includes('unsplash.com') ? '' : (t.logoUrl || ''),
    }));
  },

  getTenantBySlug(slug) {
    if (!slug) return null;
    const clean = slug.trim().toLowerCase();
    return this.getTenants().find((t) => t.slug.toLowerCase() === clean) || null;
  },

  getPlans() {
    return INITIAL_PLANS;
  },

  getActiveTenant() {
    const tenants = this.getTenants();
    const activeId = safeGet(STORAGE_KEYS.ACTIVE_TENANT_ID, tenants[0]?.id || "tenant-acme");
    return tenants.find((t) => t.id === activeId) || tenants[0];
  },

  setActiveTenantId(id) {
    safeSet(STORAGE_KEYS.ACTIVE_TENANT_ID, id);
  },

  getActiveRole() {
    return safeGet(STORAGE_KEYS.ACTIVE_ROLE, 'organizer');
  },

  setActiveRole(role) {
    safeSet(STORAGE_KEYS.ACTIVE_ROLE, role);
  },

  getCurrentAttendeeId() {
    return safeGet(STORAGE_KEYS.CURRENT_ATTENDEE_ID, 'reg-nana');
  },

  setCurrentAttendeeId(id) {
    safeSet(STORAGE_KEYS.CURRENT_ATTENDEE_ID, id);
  },

  getEvents(tenantId) {
    const events = safeGet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return tenantId ? events.filter((e) => e.tenantId === tenantId) : events;
  },

  getEventById(eventId) {
    const events = safeGet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return events.find((e) => e.id === eventId);
  },

  getRegistrations(eventId) {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    return eventId ? regs.filter((r) => r.eventId === eventId) : regs;
  },

  getRegistrationById(regId) {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    return regs.find((r) => r.id === regId);
  },

  getChatMessages(eventId) {
    const msgs = safeGet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    return eventId ? msgs.filter((m) => m.eventId === eventId) : msgs;
  },

  getAuditLogs(tenantId) {
    const logs = safeGet(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    return tenantId ? logs.filter((l) => l.tenantId === tenantId) : logs;
  },

  getOfflineQueue() {
    return safeGet(STORAGE_KEYS.OFFLINE_QUEUE, []);
  },

  // Tenant Mutations
  addTenant(tenantData) {
    const tenants = this.getTenants();
    const cleanSlug = (tenantData.slug || tenantData.name || `event-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (tenants.some((t) => t.slug.toLowerCase() === cleanSlug)) {
      throw new Error(`The event web address "/${cleanSlug}" is already taken. Please choose a different slug.`);
    }

    const newId = `tenant-${Date.now()}`;
    const newEventId = `evt-${cleanSlug}-${Date.now()}`;

    const newTenant = {
      id: newId,
      name: tenantData.name.trim(),
      shortName: (tenantData.shortName || tenantData.name).trim().slice(0, 28),
      slug: cleanSlug,
      brandColor: tenantData.primaryColor || tenantData.brandColor || "#5A6552",
      primaryColor: tenantData.primaryColor || tenantData.brandColor || "#5A6552",
      secondaryColor: tenantData.secondaryColor || "#DCE7D0",
      accentColor: tenantData.accentColor || "#3B7A57",
      neutralColor: tenantData.neutralColor || "#FAFBF8",
      defaultTheme: tenantData.defaultTheme || "light",
      logoUrl: tenantData.logoUrl || "",
      heroImage: tenantData.heroImage || "/images/hero-keynote.jpg",
      website: tenantData.website || "",
      address: tenantData.eventVenue || tenantData.address || "Accra International Conference Centre",
      planId: tenantData.planId || "growth",
      status: "active",
      termsAccepted: !!tenantData.termsAccepted,
      termsAcceptedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      organizer: {
        name: tenantData.organizerName || "Event Organizer",
        email: tenantData.organizerEmail || `admin@${cleanSlug}.org`,
        role: "organizer"
      },
      activeEventId: newEventId
    };

    const newEvent = {
      id: newEventId,
      tenantId: newId,
      title: tenantData.eventTitle || `${newTenant.name} Annual Conference 2026`,
      tagline: tenantData.eventTagline || "Connecting Leaders, Innovators & Delegates",
      description: tenantData.eventDescription || `Official dedicated event portal hosted by ${newTenant.name}.`,
      venue: tenantData.eventVenue || "Accra International Conference Centre",
      startsAt: tenantData.eventDate ? `${tenantData.eventDate}T09:00` : "2026-11-20T09:00",
      endsAt: "2026-11-24T18:00",
      capacity: Number(tenantData.capacity) || 350,
      registrationDeadline: "2026-11-19T23:59",
      currency: "USD",
      price: 0,
      categories: ["Attendee", "Participant", "VIP", "Speaker", "Sponsor", "Press"],
      eventDays: DEFAULT_EVENT_DAYS,
      badgeConfig: {
        badgeTitle: "CONFERENCE PASS",
        showQr: true,
        showPhoto: true,
        showOrg: true,
        showRole: true,
        customNote: "Official Conference Credential"
      }
    };

    const events = safeGet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    safeSet(STORAGE_KEYS.EVENTS, [newEvent, ...events]);
    safeSet(STORAGE_KEYS.TENANTS, [newTenant, ...tenants]);

    // Auto-provision default check-in staff account for new tenant
    const allStaff = safeGet(STORAGE_KEYS.STAFF_MEMBERS, INITIAL_STAFF_MEMBERS);
    const starterStaff = {
      id: `staff-${Date.now()}`,
      tenantId: newId,
      name: `${newTenant.organizer.name} (Lead Desk)`,
      email: newTenant.organizer.email,
      phone: tenantData.contactPhone || "+233 24 000 0000",
      station: "Desk 1 - Main Entrance",
      role: "Lead Check-In Supervisor",
      pin: "1044",
      status: "active",
      scansCount: 0,
      createdAt: new Date().toISOString()
    };
    safeSet(STORAGE_KEYS.STAFF_MEMBERS, [starterStaff, ...allStaff]);

    this.addAuditLog({
      tenantId: newId,
      user: newTenant.organizer.name,
      role: "organizer",
      action: "TENANT_CREATED",
      severity: "success",
      target: `${newTenant.name} (/${newTenant.slug}, ${newTenant.planId} plan) — Terms accepted`
    });

    return newTenant;
  },

  updateTenant(id, updates, actorName = "Organizer") {
    const tenants = this.getTenants();
    const updated = tenants.map((t) => (t.id === id ? { ...t, ...updates } : t));
    safeSet(STORAGE_KEYS.TENANTS, updated);
    this.addAuditLog({
      tenantId: id,
      user: actorName,
      role: "organizer",
      action: "BRANDING_UPDATED",
      severity: "info",
      target: `Workspace branding & settings updated (${Object.keys(updates).join(', ')})`
    });
    return updated.find((t) => t.id === id);
  },

  updateEvent(eventId, updates, actorName = "Organizer") {
    const events = safeGet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    let tenantId = "system";
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        tenantId = ev.tenantId;
        return { ...ev, ...updates };
      }
      return ev;
    });
    safeSet(STORAGE_KEYS.EVENTS, updated);
    this.addAuditLog({
      tenantId,
      user: actorName,
      role: "organizer",
      action: "EVENT_UPDATED",
      severity: "info",
      target: `Event configuration updated (${updates.title || eventId})`
    });
    return updated.find((ev) => ev.id === eventId);
  },

  toggleTenantStatus(id) {
    const tenants = this.getTenants();
    const tenant = tenants.find((t) => t.id === id);
    if (!tenant) return;
    const newStatus = tenant.status === "active" ? "suspended" : "active";
    const updated = tenants.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    safeSet(STORAGE_KEYS.TENANTS, updated);
    this.addAuditLog({
      tenantId: id,
      user: "Platform Super-Admin",
      role: "super-admin",
      action: newStatus === "active" ? "TENANT_ACTIVATED" : "TENANT_SUSPENDED",
      severity: newStatus === "active" ? "success" : "warning",
      target: `${tenant.name} (/${tenant.slug})`
    });
  },

  // Attendee Registration
  addRegistration(regData) {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);

    const existing = regs.find((r) =>
      r.eventId === regData.eventId &&
      r.email.toLowerCase() === regData.email.trim().toLowerCase()
    );

    if (existing) {
      throw new Error(`A registration with email ${regData.email} already exists for this event (Ticket: ${existing.ticketCode}).`);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const tenant = this.getTenants().find((t) => t.id === regData.tenantId);
    const prefix = tenant ? tenant.slug.replace(/[^a-z0-9]/gi, '').substring(0, 3).toUpperCase() : 'EVT';
    const ticketCode = `TKT-${prefix}-${randomSuffix}`;

    const newReg = {
      id: `reg-${Date.now()}`,
      tenantId: regData.tenantId,
      eventId: regData.eventId,
      name: regData.name,
      title: regData.title || "",
      country: regData.country || "Ghana",
      email: regData.email.trim(),
      phone: regData.phone || "",
      organization: regData.organization || "Independent",
      jobTitle: regData.jobTitle || "Attendee",
      category: regData.category || "Attendee",
      passType: regData.passType || "full_week",
      selectedDays: regData.selectedDays && regData.selectedDays.length > 0
        ? regData.selectedDays
        : DEFAULT_EVENT_DAYS.map((d) => d.id),
      dailyAttendance: regData.dailyAttendance || {},
      status: "registered",
      ticketCode,
      photoUrl: regData.photoUrl || LOCAL_AVATARS[0],
      registeredAt: new Date().toISOString(),
      checkedInAt: null,
      checkedInBy: null,
      badgePrintedCount: 0,
      consentAccepted: !!regData.consentAccepted,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: "v1.0"
    };

    safeSet(STORAGE_KEYS.REGISTRATIONS, [newReg, ...regs]);

    this.addAuditLog({
      tenantId: regData.tenantId,
      user: newReg.name,
      role: "attendee",
      action: "REGISTRATION_CREATED",
      severity: "success",
      target: `${newReg.name} (${ticketCode}) · ${newReg.category} · Terms v1.0 accepted`
    });

    return newReg;
  },

  /**
   * FIXED Check-In Engine:
   * - Normalizes scanned/typed codes (case-insensitive, trims, ignores extra spaces/hyphens, parses URL/JSON QR)
   * - Matches full ticket code, compact code (no dashes), 4-digit suffix within active event, or exact attendee email
   * - Enforces active event/tenant boundary with helpful error message
   * - Logs EVERY outcome (Success, Duplicate, Day Denied, Wrong Event, Not Found, Override) to the Audit Trail
   */
  checkInByCode(
    rawTicketInput,
    staffName = "Check-in Staff",
    isOffline = false,
    currentDayId = "day-1",
    currentDayLabel = "Day 1",
    options = {}
  ) {
    const { eventId = null, tenantId = null, forceOverride = false } = options || {};
    const cleaned = normalizeTicketInput(rawTicketInput);

    if (!cleaned) {
      return { success: false, reason: "EMPTY_INPUT", message: "Please enter or scan a valid ticket code." };
    }

    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const cleanedUpper = cleaned.toUpperCase();
    const cleanedCompact = compactCode(cleaned);

    // Helper to score & match a registration
    const matchesRegistration = (r) => {
      const rCode = (r.ticketCode || '').trim().toUpperCase();
      const rCompact = compactCode(r.ticketCode);
      const rEmail = (r.email || '').trim().toLowerCase();

      if (rCode === cleanedUpper) return true;
      if (rCompact && rCompact === cleanedCompact) return true;
      if (rEmail && rEmail === cleaned.toLowerCase()) return true;
      // Support typing just the 4-digit ticket suffix (e.g. "3301") or "ACM-3301"
      if (cleanedCompact.length >= 4 && rCompact.endsWith(cleanedCompact)) return true;
      return false;
    };

    // Prioritize matches in the currently active event first
    let regIndex = eventId
      ? regs.findIndex((r) => r.eventId === eventId && matchesRegistration(r))
      : -1;

    // If not in active event, check across all events to give an informative error
    if (regIndex === -1) {
      const anyIdx = regs.findIndex((r) => matchesRegistration(r));
      if (anyIdx !== -1 && eventId && regs[anyIdx].eventId !== eventId) {
        const otherAttendee = regs[anyIdx];
        const otherEvent = this.getEventById(otherAttendee.eventId);
        this.addAuditLog({
          tenantId: tenantId || otherAttendee.tenantId,
          user: staffName,
          role: "staff",
          action: "CHECKIN_WRONG_EVENT",
          severity: "warning",
          target: `Ticket ${otherAttendee.ticketCode} (${otherAttendee.name}) belongs to "${otherEvent?.title || 'another event'}"`
        });
        return {
          success: false,
          reason: "WRONG_EVENT",
          message: `Ticket ${otherAttendee.ticketCode} (${otherAttendee.name}) belongs to "${otherEvent?.title || 'another event'}", not this event.`,
          attendee: otherAttendee
        };
      }
      regIndex = anyIdx;
    }

    if (regIndex === -1) {
      this.addAuditLog({
        tenantId: tenantId || this.getActiveTenant()?.id || "system",
        user: staffName,
        role: "staff",
        action: "CHECKIN_FAILED_NOT_FOUND",
        severity: "error",
        target: `Unrecognized code "${cleaned}" attempted on ${currentDayLabel}`
      });
      return {
        success: false,
        reason: "NOT_FOUND",
        message: `Ticket code "${cleaned}" was not found. Double-check the code (e.g. TKT-ACM-3301) or use Manual Search.`
      };
    }

    const attendee = regs[regIndex];
    const permittedDays = attendee.selectedDays && attendee.selectedDays.length > 0
      ? attendee.selectedDays
      : DEFAULT_EVENT_DAYS.map((d) => d.id);

    // Multi-day pass validation
    if (!forceOverride && !permittedDays.includes(currentDayId)) {
      this.addAuditLog({
        tenantId: attendee.tenantId,
        user: staffName,
        role: "staff",
        action: "CHECKIN_DENIED_DAY",
        severity: "warning",
        target: `${attendee.name} (${attendee.ticketCode}) not permitted on ${currentDayLabel}`
      });
      return {
        success: false,
        notPermittedToday: true,
        canOverride: true,
        reason: "DAY_NOT_INCLUDED",
        message: `Access Denied for ${currentDayLabel}: ${attendee.name}'s pass is valid for ${permittedDays.join(', ')}.`,
        attendee
      };
    }

    // Duplicate check-in check for the selected day
    const daily = attendee.dailyAttendance || {};
    if (!forceOverride && daily[currentDayId]) {
      const existingScan = daily[currentDayId];
      this.addAuditLog({
        tenantId: attendee.tenantId,
        user: staffName,
        role: "staff",
        action: "CHECKIN_DUPLICATE_SCAN",
        severity: "warning",
        target: `${attendee.name} (${attendee.ticketCode}) already scanned for ${currentDayLabel} at ${new Date(existingScan.timestamp).toLocaleTimeString()}`
      });
      return {
        success: false,
        alreadyCheckedIn: true,
        reason: "ALREADY_CHECKED_IN_TODAY",
        message: `Already Checked In for ${currentDayLabel}: ${attendee.name} was scanned at ${new Date(existingScan.timestamp).toLocaleTimeString()} by ${existingScan.checkedInBy || 'Staff'}.`,
        attendee
      };
    }

    // Offline queuing
    if (isOffline) {
      const queue = this.getOfflineQueue();
      const offlineRecord = {
        id: `off-${Date.now()}`,
        ticketCode: attendee.ticketCode,
        attendeeName: attendee.name,
        staffName,
        currentDayId,
        currentDayLabel,
        timestamp: new Date().toISOString()
      };
      safeSet(STORAGE_KEYS.OFFLINE_QUEUE, [...queue, offlineRecord]);
      this.addAuditLog({
        tenantId: attendee.tenantId,
        user: staffName,
        role: "staff",
        action: "CHECKIN_QUEUED_OFFLINE",
        severity: "info",
        target: `${attendee.name} (${attendee.ticketCode}) queued offline for ${currentDayLabel}`
      });
      return {
        success: true,
        isOfflineQueue: true,
        reason: "OFFLINE_QUEUED",
        message: `Offline Mode: ${attendee.name} (${attendee.ticketCode}) queued for sync on ${currentDayLabel}.`,
        attendee: { ...attendee, status: "attended" }
      };
    }

    // Live check-in update
    const nowIso = new Date().toISOString();
    const updatedAttendee = {
      ...attendee,
      status: "attended",
      checkedInAt: nowIso,
      checkedInBy: staffName,
      dailyAttendance: {
        ...daily,
        [currentDayId]: {
          attended: true,
          checkedIn: true,
          timestamp: nowIso,
          checkedInBy: staffName,
          override: forceOverride || false
        }
      }
    };

    regs[regIndex] = updatedAttendee;
    safeSet(STORAGE_KEYS.REGISTRATIONS, [...regs]);

    // Increment staff scan count if matching station
    const staffMembers = safeGet(STORAGE_KEYS.STAFF_MEMBERS, INITIAL_STAFF_MEMBERS);
    const updatedStaff = staffMembers.map((s) =>
      s.station === staffName || s.name === staffName
        ? { ...s, scansCount: (s.scansCount || 0) + 1 }
        : s
    );
    safeSet(STORAGE_KEYS.STAFF_MEMBERS, updatedStaff);

    this.addAuditLog({
      tenantId: attendee.tenantId,
      user: staffName,
      role: "staff",
      action: forceOverride ? "CHECKIN_OVERRIDE_RECORDED" : "CHECKIN_RECORDED",
      severity: "success",
      target: `${attendee.name} (${attendee.ticketCode}) verified on ${currentDayLabel}`
    });

    return {
      success: true,
      reason: "SUCCESS",
      message: `Check-In Approved for ${currentDayLabel}! Welcome, ${attendee.name} (${attendee.ticketCode}).`,
      attendee: updatedAttendee
    };
  },

  // Sync Offline Queue
  syncOfflineQueue() {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return 0;

    let syncedCount = 0;
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);

    queue.forEach((item) => {
      const idx = regs.findIndex((r) => r.ticketCode === item.ticketCode);
      if (idx !== -1) {
        const dayKey = item.currentDayId || 'day-1';
        regs[idx].status = "attended";
        regs[idx].checkedInAt = item.timestamp;
        regs[idx].checkedInBy = `${item.staffName} (Synced Offline)`;
        regs[idx].dailyAttendance = {
          ...(regs[idx].dailyAttendance || {}),
          [dayKey]: {
            attended: true,
            checkedIn: true,
            timestamp: item.timestamp,
            checkedInBy: `${item.staffName} (Synced Offline)`
          }
        };
        syncedCount++;
      }
    });

    safeSet(STORAGE_KEYS.REGISTRATIONS, [...regs]);
    safeSet(STORAGE_KEYS.OFFLINE_QUEUE, []);

    if (syncedCount > 0) {
      this.addAuditLog({
        tenantId: this.getActiveTenant()?.id || "system",
        user: "Offline Sync Engine",
        role: "staff",
        action: "OFFLINE_QUEUE_SYNCED",
        severity: "success",
        target: `Synchronized ${syncedCount} offline check-in record(s)`
      });
    }

    return syncedCount;
  },

  // Log standard badge print
  logBadgePrint(registrationId, staffUser = "Staff", formatNote = "3.1in Badge") {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const idx = regs.findIndex((r) => r.id === registrationId);
    if (idx !== -1) {
      regs[idx].badgePrintedCount = (regs[idx].badgePrintedCount || 0) + 1;
      safeSet(STORAGE_KEYS.REGISTRATIONS, [...regs]);
      this.addAuditLog({
        tenantId: regs[idx].tenantId,
        user: staffUser,
        role: "staff",
        action: regs[idx].badgePrintedCount > 1 ? "BADGE_REPRINTED" : "BADGE_PRINTED",
        severity: "info",
        target: `${regs[idx].name} (${regs[idx].ticketCode}) — ${formatNote} (Print #${regs[idx].badgePrintedCount})`
      });
      return regs[idx];
    }
    return null;
  },

  // Badge Reprint with explicit reason
  reprintBadge(registrationId, staffUser = "Staff", reason = "Reprint requested") {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const idx = regs.findIndex((r) => r.id === registrationId);
    if (idx !== -1) {
      regs[idx].badgePrintedCount = (regs[idx].badgePrintedCount || 0) + 1;
      safeSet(STORAGE_KEYS.REGISTRATIONS, [...regs]);

      this.addAuditLog({
        tenantId: regs[idx].tenantId,
        user: staffUser,
        role: "staff",
        action: "BADGE_REPRINTED",
        severity: "warning",
        target: `${regs[idx].name} (${regs[idx].ticketCode}) — Reason: ${reason}`
      });
      return regs[idx];
    }
    return null;
  },

  // Attendee & Staff Authentication Helpers for Dedicated Event Login
  findAttendeeForLogin(tenantId, identifier) {
    const clean = String(identifier || '').trim();
    if (!clean) return null;
    const regs = this.getRegistrations().filter((r) => r.tenantId === tenantId);
    const cleanCompact = compactCode(clean);
    return regs.find((r) =>
      r.email.toLowerCase() === clean.toLowerCase() ||
      r.ticketCode.toUpperCase() === clean.toUpperCase() ||
      (cleanCompact.length >= 4 && compactCode(r.ticketCode).endsWith(cleanCompact))
    ) || null;
  },

  authenticateStaff(tenantId, pinInput) {
    const cleanPin = String(pinInput || '').trim();
    const members = this.getStaffMembers(tenantId);
    return members.find((m) => m.pin === cleanPin || m.email.toLowerCase() === cleanPin.toLowerCase()) || null;
  },

  // Chat APIs
  sendChatMessage({ tenantId, eventId, authorName, authorRole, authorPhoto, text, isOrganizer = false }) {
    const msgs = safeGet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    const newMsg = {
      id: `msg-${Date.now()}`,
      tenantId,
      eventId,
      authorName,
      authorRole: authorRole || "Attendee",
      authorPhoto: authorPhoto || null,
      isOrganizer,
      isPinned: false,
      text,
      timestamp: new Date().toISOString()
    };
    safeSet(STORAGE_KEYS.CHAT, [...msgs, newMsg]);
    return newMsg;
  },

  deleteChatMessage(msgId, actorName = "Organizer", tenantId = "system") {
    const msgs = safeGet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    const target = msgs.find((m) => m.id === msgId);
    const filtered = msgs.filter((m) => m.id !== msgId);
    safeSet(STORAGE_KEYS.CHAT, filtered);
    if (target) {
      this.addAuditLog({
        tenantId: target.tenantId || tenantId,
        user: actorName,
        role: "organizer",
        action: "CHAT_MESSAGE_DELETED",
        severity: "warning",
        target: `Removed message by ${target.authorName}`
      });
    }
  },

  togglePinMessage(msgId) {
    const msgs = safeGet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    const updated = msgs.map((m) => (m.id === msgId ? { ...m, isPinned: !m.isPinned } : m));
    safeSet(STORAGE_KEYS.CHAT, updated);
  },

  // Audit Logs
  addAuditLog({ tenantId, user, role = "system", action, severity = "info", target }) {
    const logs = safeGet(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    const newLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tenantId: tenantId || "system",
      user: user || "System",
      role,
      action,
      severity,
      target,
      timestamp: new Date().toISOString(),
      ip: "102.176.65.12"
    };
    safeSet(STORAGE_KEYS.AUDIT, [newLog, ...logs]);
    return newLog;
  },

  // Staff Team Management
  getStaffMembers(tenantId) {
    const all = safeGet(STORAGE_KEYS.STAFF_MEMBERS, INITIAL_STAFF_MEMBERS);
    if (!tenantId) return all;
    return all.filter((s) => s.tenantId === tenantId);
  },

  addStaffMember(staffData, actorName = "Organizer") {
    const all = safeGet(STORAGE_KEYS.STAFF_MEMBERS, INITIAL_STAFF_MEMBERS);
    const newStaff = {
      id: `staff-${Date.now()}`,
      scansCount: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      ...staffData
    };
    safeSet(STORAGE_KEYS.STAFF_MEMBERS, [newStaff, ...all]);
    this.addAuditLog({
      tenantId: staffData.tenantId,
      user: actorName,
      role: "organizer",
      action: "STAFF_PROVISIONED",
      severity: "info",
      target: `${newStaff.name} assigned to ${newStaff.station} (${newStaff.role})`
    });
    return newStaff;
  },

  removeStaffMember(staffId, actorName = "Organizer") {
    const all = safeGet(STORAGE_KEYS.STAFF_MEMBERS, INITIAL_STAFF_MEMBERS);
    const target = all.find((s) => s.id === staffId);
    const updated = all.filter((s) => s.id !== staffId);
    safeSet(STORAGE_KEYS.STAFF_MEMBERS, updated);
    if (target) {
      this.addAuditLog({
        tenantId: target.tenantId,
        user: actorName,
        role: "organizer",
        action: "STAFF_REMOVED",
        severity: "warning",
        target: `${target.name} removed from ${target.station}`
      });
    }
    return true;
  },

  // Reset to seed data
  resetAll() {
    safeSet(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
    safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    safeSet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    safeSet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    safeSet(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    safeSet(STORAGE_KEYS.STAFF_MEMBERS, INITIAL_STAFF_MEMBERS);
    safeSet(STORAGE_KEYS.OFFLINE_QUEUE, []);
    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
    window.location.reload();
  }
};
