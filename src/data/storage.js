import {
  INITIAL_PLANS,
  INITIAL_TENANTS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_AUDIT_LOGS
} from './mockData';

const STORAGE_KEYS = {
  TENANTS: 'emp_tenants_v1',
  EVENTS: 'emp_events_v1',
  REGISTRATIONS: 'emp_registrations_v1',
  CHAT: 'emp_chat_v1',
  AUDIT: 'emp_audit_v1',
  OFFLINE_QUEUE: 'emp_offline_checkins_v1',
  ACTIVE_TENANT_ID: 'emp_active_tenant_id_v1',
  ACTIVE_ROLE: 'emp_active_role_v1',
  CURRENT_ATTENDEE_ID: 'emp_current_attendee_id_v1'
};

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

// Storage API
export const Storage = {
  // Initialize default data if not present
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.TENANTS)) {
      safeSet(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      safeSet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    } else {
      // Ensure any newly added seed registrations (for other tenants) are merged
      const current = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
      const missing = INITIAL_REGISTRATIONS.filter(init => !current.some(c => c.id === init.id));
      if (missing.length > 0) {
        safeSet(STORAGE_KEYS.REGISTRATIONS, [...current, ...missing]);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHAT)) {
      safeSet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      safeSet(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE)) {
      safeSet(STORAGE_KEYS.OFFLINE_QUEUE, []);
    }
  },

  // State Getters
  getTenants() {
    return safeGet(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
  },

  getPlans() {
    return INITIAL_PLANS;
  },

  getActiveTenant() {
    const tenants = this.getTenants();
    const activeId = safeGet(STORAGE_KEYS.ACTIVE_TENANT_ID, tenants[0]?.id || "tenant-acme");
    return tenants.find(t => t.id === activeId) || tenants[0];
  },

  setActiveTenantId(id) {
    safeSet(STORAGE_KEYS.ACTIVE_TENANT_ID, id);
  },

  getActiveRole() {
    return safeGet(STORAGE_KEYS.ACTIVE_ROLE, 'organizer'); // 'super-admin' | 'organizer' | 'staff' | 'attendee'
  },

  setActiveRole(role) {
    safeSet(STORAGE_KEYS.ACTIVE_ROLE, role);
  },

  getCurrentAttendeeId() {
    return safeGet(STORAGE_KEYS.CURRENT_ATTENDEE_ID, 'reg-1');
  },

  setCurrentAttendeeId(id) {
    safeSet(STORAGE_KEYS.CURRENT_ATTENDEE_ID, id);
  },

  getEvents(tenantId) {
    const events = safeGet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return tenantId ? events.filter(e => e.tenantId === tenantId) : events;
  },

  getEventById(eventId) {
    const events = safeGet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return events.find(e => e.id === eventId);
  },

  getRegistrations(eventId) {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    return eventId ? regs.filter(r => r.eventId === eventId) : regs;
  },

  getRegistrationById(regId) {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    return regs.find(r => r.id === regId);
  },

  getChatMessages(eventId) {
    const msgs = safeGet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    return eventId ? msgs.filter(m => m.eventId === eventId) : msgs;
  },

  getAuditLogs(tenantId) {
    const logs = safeGet(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    return tenantId ? logs.filter(l => l.tenantId === tenantId) : logs;
  },

  getOfflineQueue() {
    return safeGet(STORAGE_KEYS.OFFLINE_QUEUE, []);
  },

  // State Mutations
  addTenant(tenantData) {
    const tenants = this.getTenants();
    const newId = `tenant-${Date.now()}`;
    const newEventId = `evt-${tenantData.slug}-${Date.now()}`;

    const newTenant = {
      id: newId,
      name: tenantData.name,
      slug: tenantData.slug,
      brandColor: tenantData.brandColor || "#4f46e5",
      logoUrl: tenantData.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80",
      planId: tenantData.planId || "growth",
      status: "active",
      createdAt: new Date().toISOString(),
      organizer: {
        name: tenantData.organizerName,
        email: tenantData.organizerEmail,
        role: "organizer"
      },
      activeEventId: newEventId
    };

    // Auto-create initial event for company
    const newEvent = {
      id: newEventId,
      tenantId: newId,
      title: tenantData.eventTitle || `${tenantData.name} Annual Conference 2026`,
      tagline: tenantData.eventTagline || "Connecting Industry Leaders and Pioneers",
      description: tenantData.eventDescription || `Official annual gathering hosted by ${tenantData.name}.`,
      venue: tenantData.eventVenue || "Accra International Conference Centre",
      startsAt: "2026-11-20T09:00",
      endsAt: "2026-11-21T18:00",
      capacity: 300,
      registrationDeadline: "2026-11-19T23:59",
      currency: "USD",
      price: 0,
      categories: ["Attendee", "VIP", "Speaker", "Sponsor"],
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

    this.addAuditLog({
      tenantId: newId,
      user: "Platform Super-Admin",
      action: "TENANT_CREATED",
      target: `${newTenant.name} (${newTenant.planId} plan)`
    });

    return newTenant;
  },

  updateTenant(id, updates) {
    const tenants = this.getTenants();
    const updated = tenants.map(t => t.id === id ? { ...t, ...updates } : t);
    safeSet(STORAGE_KEYS.TENANTS, updated);
  },

  toggleTenantStatus(id) {
    const tenants = this.getTenants();
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;
    const newStatus = tenant.status === "active" ? "suspended" : "active";
    this.updateTenant(id, { status: newStatus });
    this.addAuditLog({
      tenantId: id,
      user: "Platform Super-Admin",
      action: newStatus === "active" ? "TENANT_ACTIVATED" : "TENANT_SUSPENDED",
      target: tenant.name
    });
  },

  addRegistration(regData) {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    
    // Duplicate check
    const existing = regs.find(r => 
      r.eventId === regData.eventId && 
      (r.email.toLowerCase() === regData.email.toLowerCase() || (regData.phone && r.phone === regData.phone))
    );

    if (existing) {
      throw new Error(`A registration with email ${regData.email} already exists for this event.`);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const tenant = this.getTenants().find(t => t.id === regData.tenantId);
    const prefix = tenant ? tenant.slug.substring(0, 3).toUpperCase() : 'EVT';
    const ticketCode = `TKT-${prefix}-${randomSuffix}`;

    const newReg = {
      id: `reg-${Date.now()}`,
      tenantId: regData.tenantId,
      eventId: regData.eventId,
      name: regData.name,
      email: regData.email,
      phone: regData.phone || "",
      organization: regData.organization || "Independent",
      jobTitle: regData.jobTitle || "Attendee",
      category: regData.category || "Attendee",
      status: "registered",
      ticketCode,
      photoUrl: regData.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      registeredAt: new Date().toISOString(),
      checkedInAt: null,
      checkedInBy: null,
      badgePrintedCount: 0,
      consentAccepted: !!regData.consentAccepted
    };

    safeSet(STORAGE_KEYS.REGISTRATIONS, [newReg, ...regs]);

    this.addAuditLog({
      tenantId: regData.tenantId,
      user: "Self-Service Attendee",
      action: "REGISTRATION_CREATED",
      target: `${newReg.name} (${ticketCode})`
    });

    return newReg;
  },

  // Check-In Logic
  checkInByCode(ticketCode, staffName = "Check-in Staff", isOffline = false) {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const regIndex = regs.findIndex(r => r.ticketCode.trim().toUpperCase() === ticketCode.trim().toUpperCase());

    if (regIndex === -1) {
      return { success: false, reason: "NOT_FOUND", message: `Ticket code ${ticketCode} was not found.` };
    }

    const attendee = regs[regIndex];

    // Duplicate Check warning
    if (attendee.status === "attended") {
      return {
        success: false,
        reason: "ALREADY_CHECKED_IN",
        message: `DUPLICATE SCAN: ${attendee.name} was already checked in at ${new Date(attendee.checkedInAt).toLocaleTimeString()} by ${attendee.checkedInBy || 'Staff'}.`,
        attendee
      };
    }

    if (isOffline) {
      // Queue offline
      const queue = this.getOfflineQueue();
      const offlineRecord = {
        ticketCode,
        staffName,
        timestamp: new Date().toISOString()
      };
      safeSet(STORAGE_KEYS.OFFLINE_QUEUE, [...queue, offlineRecord]);
      return {
        success: true,
        isOfflineQueue: true,
        message: `Offline mode: ${attendee.name} queued for sync.`,
        attendee: { ...attendee, status: "attended" }
      };
    }

    // Live update
    const updatedAttendee = {
      ...attendee,
      status: "attended",
      checkedInAt: new Date().toISOString(),
      checkedInBy: staffName,
      badgePrintedCount: (attendee.badgePrintedCount || 0) + 1
    };

    regs[regIndex] = updatedAttendee;
    safeSet(STORAGE_KEYS.REGISTRATIONS, [...regs]);

    this.addAuditLog({
      tenantId: attendee.tenantId,
      user: staffName,
      action: "CHECKIN_RECORDED",
      target: `${attendee.name} (${attendee.ticketCode})`
    });

    return {
      success: true,
      reason: "SUCCESS",
      message: `Check-in successful! Welcome, ${attendee.name}.`,
      attendee: updatedAttendee
    };
  },

  // Sync Offline Queue
  syncOfflineQueue() {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return 0;

    let syncedCount = 0;
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);

    queue.forEach(item => {
      const idx = regs.findIndex(r => r.ticketCode === item.ticketCode);
      if (idx !== -1 && regs[idx].status !== "attended") {
        regs[idx].status = "attended";
        regs[idx].checkedInAt = item.timestamp;
        regs[idx].checkedInBy = `${item.staffName} (Synced Offline)`;
        regs[idx].badgePrintedCount = (regs[idx].badgePrintedCount || 0) + 1;
        syncedCount++;
      }
    });

    safeSet(STORAGE_KEYS.REGISTRATIONS, [...regs]);
    safeSet(STORAGE_KEYS.OFFLINE_QUEUE, []);

    return syncedCount;
  },

  // Badge Reprint
  reprintBadge(registrationId, staffUser = "Staff", reason = "Reprint requested") {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const idx = regs.findIndex(r => r.id === registrationId);
    if (idx !== -1) {
      regs[idx].badgePrintedCount = (regs[idx].badgePrintedCount || 0) + 1;
      safeSet(STORAGE_KEYS.REGISTRATIONS, [...regs]);

      this.addAuditLog({
        tenantId: regs[idx].tenantId,
        user: staffUser,
        action: "BADGE_REPRINTED",
        target: `${regs[idx].name} (${regs[idx].ticketCode}) - ${reason}`
      });
      return regs[idx];
    }
    return null;
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

  deleteChatMessage(msgId) {
    const msgs = safeGet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    const filtered = msgs.filter(m => m.id !== msgId);
    safeSet(STORAGE_KEYS.CHAT, filtered);
  },

  togglePinMessage(msgId) {
    const msgs = safeGet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    const updated = msgs.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m);
    safeSet(STORAGE_KEYS.CHAT, updated);
  },

  // Audit Logs
  addAuditLog({ tenantId, user, action, target }) {
    const logs = safeGet(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    const newLog = {
      id: `audit-${Date.now()}`,
      tenantId: tenantId || "system",
      user: user || "System",
      action,
      target,
      timestamp: new Date().toISOString(),
      ip: "102.176.65.12"
    };
    safeSet(STORAGE_KEYS.AUDIT, [newLog, ...logs]);
  },

  // Reset to seed data
  resetAll() {
    safeSet(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
    safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    safeSet(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    safeSet(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
    safeSet(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    safeSet(STORAGE_KEYS.OFFLINE_QUEUE, []);
    window.location.reload();
  }
};
