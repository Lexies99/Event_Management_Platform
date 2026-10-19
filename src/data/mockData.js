export const INITIAL_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 199,
    billingPeriod: "per event",
    description: "Ideal for single conferences, workshops, and company retreats.",
    limits: {
      events: 1,
      attendees: 250,
      storage: "5 GB",
      chatEnabled: false,
      customDomain: false
    },
    features: [
      "Custom branded registration page",
      "QR code ticketing & email confirmations",
      "Camera & manual QR check-in station",
      "Standard badge print templates",
      "Post-event CSV export"
    ]
  },
  {
    id: "growth",
    name: "Growth",
    price: 499,
    billingPeriod: "monthly",
    description: "For active organizers, enterprises, and regional event producers.",
    limits: {
      events: 5,
      attendees: 1500,
      storage: "25 GB",
      chatEnabled: true,
      customDomain: false
    },
    popular: true,
    features: [
      "Everything in Starter",
      "Live real-time attendee chat (attendance-gated)",
      "Organizer broadcast announcements & pinned alerts",
      "Multi-station check-in with offline sync",
      "Custom badge designer with attendee photo",
      "Certificate of Attendance generation"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 1299,
    billingPeriod: "monthly",
    description: "Unlimited scale with dedicated tenant infrastructure and SLA.",
    limits: {
      events: 999,
      attendees: 15000,
      storage: "250 GB",
      chatEnabled: true,
      customDomain: true
    },
    features: [
      "Everything in Growth",
      "Custom tenant subdomains & white-label domain",
      "Unlimited simultaneous check-in staff logins",
      "Direct API & Webhook integrations (Paystack/Flutterwave)",
      "Dedicated account manager & 99.9% uptime SLA",
      "Full row-level security audit logs & compliance"
    ]
  }
];

export const INITIAL_TENANTS = [
  {
    id: "tenant-acme",
    name: "Acme Global Tech",
    slug: "acme",
    brandColor: "#4f46e5", // Indigo
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80",
    planId: "growth",
    status: "active",
    createdAt: "2026-09-01T10:00:00Z",
    organizer: {
      name: "Sarah Jenkins",
      email: "sarah.jenkins@acmetech.io",
      role: "organizer"
    },
    activeEventId: "evt-acme-1"
  },
  {
    id: "tenant-apex",
    name: "Apex Health & Biotech",
    slug: "apex-health",
    brandColor: "#059669", // Emerald
    logoUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=160&auto=format&fit=crop&q=80",
    planId: "enterprise",
    status: "active",
    createdAt: "2026-09-15T14:30:00Z",
    organizer: {
      name: "Dr. Kwesi Mensah",
      email: "kwesi@apexhealth.org",
      role: "organizer"
    },
    activeEventId: "evt-apex-1"
  },
  {
    id: "tenant-fintech",
    name: "FinTech West Africa",
    slug: "fintech-wa",
    brandColor: "#d97706", // Amber
    logoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80",
    planId: "starter",
    status: "active",
    createdAt: "2026-10-01T09:15:00Z",
    organizer: {
      name: "Alexander Dela Tetteh (Kojo)",
      email: "alexander@fintechwa.africa",
      role: "organizer"
    },
    activeEventId: "evt-fintech-1"
  }
];

export const INITIAL_EVENTS = [
  {
    id: "evt-acme-1",
    tenantId: "tenant-acme",
    title: "Acme Global Tech Summit 2026",
    tagline: "Frontiers in AI, Cloud Architecture & Scalable Platforms",
    description: "Join over 500 technologists, enterprise architects, and product innovators for two immersive days of keynotes, breakout tracks, and hands-on demonstrations.",
    venue: "Grand Ballroom, Accra International Conference Centre & Virtual",
    startsAt: "2026-10-24T09:00",
    endsAt: "2026-10-25T18:00",
    capacity: 500,
    registrationDeadline: "2026-10-23T23:59",
    currency: "USD",
    price: 0, // Free / RSVP
    categories: ["Attendee", "Speaker", "VIP", "Sponsor", "Press"],
    badgeConfig: {
      badgeTitle: "SUMMIT PASS",
      showQr: true,
      showPhoto: true,
      showOrg: true,
      showRole: true,
      customNote: "Authorized access to All Tracks & VIP Lounge"
    }
  },
  {
    id: "evt-apex-1",
    tenantId: "tenant-apex",
    title: "Pan-African Healthcare & Biotech Symposium",
    tagline: "Precision Medicine, Genomics & Digital Clinical Trials",
    description: "Convening medical practitioners, clinical researchers, and biotech pioneers across Africa and the global diaspora.",
    venue: "Kempinski Hotel Gold Coast City, Accra",
    startsAt: "2026-11-12T08:30",
    endsAt: "2026-11-14T17:00",
    capacity: 350,
    registrationDeadline: "2026-11-10T23:59",
    currency: "USD",
    price: 45,
    categories: ["Physician", "Researcher", "Student", "Delegate", "Keynote"],
    badgeConfig: {
      badgeTitle: "SYMPOSIUM CREDENTIAL",
      showQr: true,
      showPhoto: true,
      showOrg: true,
      showRole: true,
      customNote: "CME Accredited Event"
    }
  },
  {
    id: "evt-fintech-1",
    tenantId: "tenant-fintech",
    title: "West Africa Digital Banking & FinTech Expo 2026",
    tagline: "The Next Era of Cross-Border Payments & CBDCs",
    description: "The premier gathering of central bankers, fintech unicorns, and venture capital investors in West Africa.",
    venue: "Labadi Beach Hotel Convention Centre",
    startsAt: "2026-12-05T09:00",
    endsAt: "2026-12-06T18:00",
    capacity: 600,
    registrationDeadline: "2026-12-03T23:59",
    currency: "GHS",
    price: 150,
    categories: ["Delegate", "Founder", "Investor", "Speaker", "Exhibitor"],
    badgeConfig: {
      badgeTitle: "EXPO DELEGATE",
      showQr: true,
      showPhoto: true,
      showOrg: true,
      showRole: true,
      customNote: "Access to Expo Floor & Deal Room"
    }
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: "reg-1",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    name: "Alexander Dela Tetteh",
    email: "alexander.dela@innovation.gh",
    phone: "+233 24 412 8901",
    organization: "CloudSphere Africa",
    jobTitle: "Lead Systems Architect",
    category: "Speaker",
    status: "attended",
    ticketCode: "TKT-ACM-8891",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-10T14:22:00Z",
    checkedInAt: "2026-10-24T08:45:12Z",
    checkedInBy: "Kofi Boateng (Staff #04)",
    badgePrintedCount: 1,
    consentAccepted: true
  },
  {
    id: "reg-2",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    name: "Eleni Gebre-Egziabher",
    email: "eleni@addisventures.com",
    phone: "+251 91 123 4567",
    organization: "Addis Ventures",
    jobTitle: "Managing Partner",
    category: "VIP",
    status: "attended",
    ticketCode: "TKT-ACM-9104",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-12T09:14:00Z",
    checkedInAt: "2026-10-24T09:05:30Z",
    checkedInBy: "Ama Serwah (Staff #01)",
    badgePrintedCount: 1,
    consentAccepted: true
  },
  {
    id: "reg-3",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    name: "Marcus Aurelius Vance",
    email: "marcus.vance@nebula.io",
    phone: "+1 415 555 0192",
    organization: "Nebula AI Labs",
    jobTitle: "VP of Engineering",
    category: "Speaker",
    status: "attended",
    ticketCode: "TKT-ACM-7032",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-14T11:45:00Z",
    checkedInAt: "2026-10-24T09:12:15Z",
    checkedInBy: "Ama Serwah (Staff #01)",
    badgePrintedCount: 2,
    consentAccepted: true
  },
  {
    id: "reg-4",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    name: "Abena Osei-Bonsu",
    email: "abena.osei@databank.gh",
    phone: "+233 20 882 1099",
    organization: "DataBank Capital",
    jobTitle: "Senior FinTech Analyst",
    category: "Attendee",
    status: "attended",
    ticketCode: "TKT-ACM-5519",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-15T16:30:00Z",
    checkedInAt: "2026-10-24T09:28:44Z",
    checkedInBy: "Kofi Boateng (Staff #04)",
    badgePrintedCount: 1,
    consentAccepted: true
  },
  {
    id: "reg-5",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    name: "David Chen",
    email: "david.chen@horizonpay.hk",
    phone: "+852 9123 4567",
    organization: "Horizon Payments Asia",
    jobTitle: "Head of Cross-Border Infra",
    category: "Sponsor",
    status: "registered", // No show yet
    ticketCode: "TKT-ACM-3301",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-16T18:02:00Z",
    checkedInAt: null,
    checkedInBy: null,
    badgePrintedCount: 0,
    consentAccepted: true
  },
  {
    id: "reg-6",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    name: "Fatima Al-Mansoor",
    email: "fatima.mansoor@gulftech.ae",
    phone: "+971 50 123 4567",
    organization: "Emirates Future Institute",
    jobTitle: "Director of Digital Policy",
    category: "VIP",
    status: "registered", // No show yet
    ticketCode: "TKT-ACM-4412",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-17T08:15:00Z",
    checkedInAt: null,
    checkedInBy: null,
    badgePrintedCount: 0,
    consentAccepted: true
  },
  {
    id: "reg-7",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    name: "Kojo Asare-Darko",
    email: "kojo.darko@dailygraphic.com.gh",
    phone: "+233 27 555 4321",
    organization: "Daily Graphic Media",
    jobTitle: "Technology Editor",
    category: "Press",
    status: "attended",
    ticketCode: "TKT-ACM-6190",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-17T12:00:00Z",
    checkedInAt: "2026-10-24T09:40:10Z",
    checkedInBy: "Ama Serwah (Staff #01)",
    badgePrintedCount: 1,
    consentAccepted: true
  },
  {
    id: "reg-8",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    name: "Jessica Taylor",
    email: "j.taylor@strata-analytics.co.uk",
    phone: "+44 7700 900123",
    organization: "Strata Analytics London",
    jobTitle: "Data Ethics Researcher",
    category: "Attendee",
    status: "registered", // No show
    ticketCode: "TKT-ACM-1188",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-18T10:11:00Z",
    checkedInAt: null,
    checkedInBy: null,
    badgePrintedCount: 0,
    consentAccepted: true
  },
  // Apex Health & Biotech Registrations
  {
    id: "reg-apex-1",
    tenantId: "tenant-apex",
    eventId: "evt-apex-1",
    name: "Dr. Kwesi Mensah",
    email: "kwesi@apexhealth.org",
    phone: "+233 24 991 2233",
    organization: "Korle Bu Teaching Hospital",
    jobTitle: "Chief Medical Officer",
    category: "Keynote",
    status: "attended",
    ticketCode: "TKT-APX-1044",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-05T09:00:00Z",
    checkedInAt: "2026-11-12T08:15:20Z",
    checkedInBy: "Desk Staff B",
    badgePrintedCount: 1,
    consentAccepted: true
  },
  {
    id: "reg-apex-2",
    tenantId: "tenant-apex",
    eventId: "evt-apex-1",
    name: "Dr. Amina Diallo",
    email: "amina.diallo@pasteur.sn",
    phone: "+221 77 123 4567",
    organization: "Institut Pasteur de Dakar",
    jobTitle: "Director of Genomics",
    category: "Researcher",
    status: "attended",
    ticketCode: "TKT-APX-8821",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-08T11:20:00Z",
    checkedInAt: "2026-11-12T08:24:10Z",
    checkedInBy: "Desk Staff B",
    badgePrintedCount: 1,
    consentAccepted: true
  },
  {
    id: "reg-apex-3",
    tenantId: "tenant-apex",
    eventId: "evt-apex-1",
    name: "Prof. Kofi Boateng",
    email: "kofi.boateng@ug.edu.gh",
    phone: "+233 20 445 6789",
    organization: "University of Ghana Medical School",
    jobTitle: "Professor of Molecular Pathology",
    category: "Physician",
    status: "registered",
    ticketCode: "TKT-APX-4512",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-12T14:00:00Z",
    checkedInAt: null,
    checkedInBy: null,
    badgePrintedCount: 0,
    consentAccepted: true
  },
  // FinTech West Africa Registrations
  {
    id: "reg-fintech-1",
    tenantId: "tenant-fintech",
    eventId: "evt-fintech-1",
    name: "Alexander Dela Tetteh (Kojo)",
    email: "alexander@fintechwa.africa",
    phone: "+233 24 412 8901",
    organization: "FinTech West Africa",
    jobTitle: "Chief Executive Officer",
    category: "Speaker",
    status: "attended",
    ticketCode: "TKT-FIN-9901",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-02T10:00:00Z",
    checkedInAt: "2026-12-05T08:30:00Z",
    checkedInBy: "Expo Desk 01",
    badgePrintedCount: 1,
    consentAccepted: true
  },
  {
    id: "reg-fintech-2",
    tenantId: "tenant-fintech",
    eventId: "evt-fintech-1",
    name: "Nana Yaa Akuffo",
    email: "nana.akuffo@paystack.com",
    phone: "+233 27 881 2345",
    organization: "Paystack Ghana",
    jobTitle: "Country Manager",
    category: "Founder",
    status: "attended",
    ticketCode: "TKT-FIN-7714",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80",
    registeredAt: "2026-10-04T12:30:00Z",
    checkedInAt: "2026-12-05T08:45:00Z",
    checkedInBy: "Expo Desk 01",
    badgePrintedCount: 1,
    consentAccepted: true
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: "msg-pin-1",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    authorName: "Sarah Jenkins (Organizer)",
    authorRole: "Organizer",
    isOrganizer: true,
    isPinned: true,
    text: "📢 Welcome to Acme Global Tech Summit 2026! Opening Keynote by Alexander Dela Tetteh begins at 10:00 AM sharp in Main Hall A. Wi-Fi SSID: AcmeSummit2026 | Passcode: InnovateGH2026",
    timestamp: "2026-10-24T08:30:00Z"
  },
  {
    id: "msg-apex-pin",
    tenantId: "tenant-apex",
    eventId: "evt-apex-1",
    authorName: "Dr. Kwesi Mensah (Organizer)",
    authorRole: "Organizer",
    isOrganizer: true,
    isPinned: true,
    text: "🩺 Welcome to the Pan-African Healthcare & Biotech Symposium! CME accreditation desk is open in the main lobby.",
    timestamp: "2026-11-12T08:00:00Z"
  },
  {
    id: "msg-fintech-pin",
    tenantId: "tenant-fintech",
    eventId: "evt-fintech-1",
    authorName: "Alexander Dela Tetteh (Organizer)",
    authorRole: "Organizer",
    isOrganizer: true,
    isPinned: true,
    text: "⚡ Welcome to the West Africa Digital Banking & FinTech Expo 2026! Deal room appointments open at 11:00 AM.",
    timestamp: "2026-12-05T08:00:00Z"
  },
  {
    id: "msg-1",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    authorName: "Alexander Dela Tetteh",
    authorRole: "Speaker",
    authorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    isOrganizer: false,
    isPinned: false,
    text: "Good morning everyone! Looking forward to sharing our research on low-latency multi-tenant event infrastructures at 10:00 AM.",
    timestamp: "2026-10-24T08:52:10Z"
  },
  {
    id: "msg-2",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    authorName: "Eleni Gebre-Egziabher",
    authorRole: "VIP",
    authorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    isOrganizer: false,
    isPinned: false,
    text: "Wonderful venue setup! Anyone from the FinTech / Seed Venture circle around for a quick chat at the networking lounge?",
    timestamp: "2026-10-24T09:10:45Z"
  },
  {
    id: "msg-3",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    authorName: "Marcus Aurelius Vance",
    authorRole: "Speaker",
    authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    isOrganizer: false,
    isPinned: false,
    text: "The check-in badge printing took literally 3 seconds. Kudos to the organizers for such a smooth queue!",
    timestamp: "2026-10-24T09:18:22Z"
  },
  {
    id: "msg-4",
    tenantId: "tenant-acme",
    eventId: "evt-acme-1",
    authorName: "Abena Osei-Bonsu",
    authorRole: "Attendee",
    authorPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80",
    isOrganizer: false,
    isPinned: false,
    text: "Heading to the VIP lounge now, Eleni! Would love to connect regarding digital payments across ECOWAS.",
    timestamp: "2026-10-24T09:32:00Z"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "audit-1",
    tenantId: "tenant-acme",
    user: "Platform Super-Admin",
    action: "TENANT_CREATED",
    target: "Acme Global Tech (growth plan)",
    timestamp: "2026-09-01T10:00:00Z",
    ip: "102.176.65.12"
  },
  {
    id: "audit-2",
    tenantId: "tenant-acme",
    user: "Sarah Jenkins",
    action: "EVENT_PUBLISHED",
    target: "Acme Global Tech Summit 2026",
    timestamp: "2026-09-05T14:10:00Z",
    ip: "154.160.22.4"
  },
  {
    id: "audit-3",
    tenantId: "tenant-acme",
    user: "Ama Serwah (Staff)",
    action: "CHECKIN_RECORDED",
    target: "Alexander Dela Tetteh (TKT-ACM-8891)",
    timestamp: "2026-10-24T08:45:12Z",
    ip: "192.168.1.104"
  },
  {
    id: "audit-4",
    tenantId: "tenant-acme",
    user: "Ama Serwah (Staff)",
    action: "BADGE_REPRINTED",
    target: "Marcus Aurelius Vance (TKT-ACM-7032) - Reason: Lanyard tear",
    timestamp: "2026-10-24T09:20:00Z",
    ip: "192.168.1.104"
  }
];
