import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  FileText,
  Globe,
  KeyRound,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Palette,
  QrCode,
  Shield,
  ShieldCheck,
  Sun,
  Ticket,
  UserCheck,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { Storage } from './data/storage';
import { applyTenantBrandingCss } from './utils/branding';
import PublicLandingPage from './components/Landing/PublicLandingPage';
import OnboardOrganizationPage from './components/Onboarding/OnboardOrganizationPage';
import EventLoginPage from './components/Auth/EventLoginPage';
import EventOverviewPanel from './components/EventPortal/EventOverviewPanel';
import OrganizerDashboard from './components/Organizer/OrganizerDashboard';
import CheckInStation from './components/CheckIn/CheckInStation';
import AttendeePortal from './components/Attendee/AttendeePortal';
import EventChat from './components/Chat/EventChat';
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard';
import AuditTrailPanel from './components/Organizer/AuditTrailPanel';
import WorkspaceBrandingSettings from './components/Organizer/WorkspaceBrandingSettings';
import TermsModal from './components/Common/TermsModal';
import TenantLogo from './components/Common/TenantLogo';

/**
 * Parses current route cleanly from Hash (`#/acme/login`), Pathname (`/acme`),
 * OR legacy Query Params (`/?tenant=acme&role=attendee&register=true`).
 * Using hash URLs (`#/...`) guarantees zero 404s on static Nginx/HestiaCP hosting!
 */
function parseRouteFromWindow() {
  const hashRaw = window.location.hash.replace(/^#/, '');
  const [hashPathPart, hashQueryPart] = hashRaw.split('?');
  const searchParams = new URLSearchParams(hashQueryPart || window.location.search);

  // Legacy query-param support: /?tenant=acme&role=attendee&register=true
  const qTenant = searchParams.get('tenant');
  const qRole = searchParams.get('role');
  const qRegister = searchParams.get('register') === 'true';

  if (hashPathPart && hashPathPart !== '/') {
    const segs = hashPathPart.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    if (segs[0] === 'onboard') return { page: 'onboard', slug: null, sub: null, query: searchParams };
    if (segs[0] === 'platform') return { page: 'platform', slug: null, sub: null, query: searchParams };
    if (segs.length >= 1) {
      return {
        page: 'tenant',
        slug: segs[0].toLowerCase(),
        sub: segs[1] ? segs[1].toLowerCase() : null,
        query: searchParams,
      };
    }
  }

  // Support clean pathname if server supports SPA fallback
  const pathSegs = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (pathSegs.length >= 1 && pathSegs[0] !== 'index.html') {
    if (pathSegs[0] === 'onboard') return { page: 'onboard', slug: null, sub: null, query: searchParams };
    if (pathSegs[0] === 'platform') return { page: 'platform', slug: null, sub: null, query: searchParams };
    return {
      page: 'tenant',
      slug: pathSegs[0].toLowerCase(),
      sub: pathSegs[1] ? pathSegs[1].toLowerCase() : null,
      query: searchParams,
    };
  }

  if (qTenant) {
    return {
      page: 'tenant',
      slug: qTenant.toLowerCase(),
      sub: qRegister ? 'register' : qRole === 'staff' ? 'staff' : null,
      query: searchParams,
    };
  }

  return { page: 'landing', slug: null, sub: null, query: searchParams };
}

export default function App() {
  // Initialize & migrate storage once
  useState(() => {
    Storage.init();
  });

  const [tenants, setTenants] = useState(() => Storage.getTenants());
  const [events, setEvents] = useState(() => Storage.getEvents());
  const [registrations, setRegistrations] = useState(() => Storage.getRegistrations());
  const [chatMessages, setChatMessages] = useState(() => Storage.getChatMessages());
  const [auditLogs, setAuditLogs] = useState(() => Storage.getAuditLogs());
  const [plans] = useState(() => Storage.getPlans());
  const [offlineQueue, setOfflineQueue] = useState(() => Storage.getOfflineQueue());
  const [isOffline, setIsOffline] = useState(false);

  const [theme, setTheme] = useState(() => Storage.getTheme());
  const [route, setRoute] = useState(() => parseRouteFromWindow());
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Per-session authentication (stored in sessionStorage)
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem('emp_auth_session_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentAttendeeId, setCurrentAttendeeId] = useState(() => Storage.getCurrentAttendeeId());
  const [activeTab, setActiveTab] = useState('overview');

  // Platform Admin PIN gate
  const [isPlatformUnlocked, setIsPlatformUnlocked] = useState(() => authSession?.role === 'super-admin');
  const [platformPinInput, setPlatformPinInput] = useState('');
  const [platformPinError, setPlatformPinError] = useState('');

  const refreshState = useCallback(() => {
    setTenants(Storage.getTenants());
    setEvents(Storage.getEvents());
    setRegistrations(Storage.getRegistrations());
    setChatMessages(Storage.getChatMessages());
    setAuditLogs(Storage.getAuditLogs());
    setOfflineQueue(Storage.getOfflineQueue());
  }, []);

  useEffect(() => {
    const onUpdate = () => refreshState();
    window.addEventListener('emp_storage_updated', onUpdate);
    // Initial server sync + live 5s cross-device polling (phones <-> check-in laptops)
    Storage.syncFromServer();
    const timer = setInterval(() => {
      if (!isOffline && document.visibilityState === 'visible') {
        Storage.syncFromServer();
      }
    }, 5000);
    return () => {
      window.removeEventListener('emp_storage_updated', onUpdate);
      clearInterval(timer);
    };
  }, [refreshState, isOffline]);

  useEffect(() => {
    const onHashOrPop = () => {
      const next = parseRouteFromWindow();
      setRoute(next);
      setMobileDrawerOpen(false);
    };
    window.addEventListener('hashchange', onHashOrPop);
    window.addEventListener('popstate', onHashOrPop);
    return () => {
      window.removeEventListener('hashchange', onHashOrPop);
      window.removeEventListener('popstate', onHashOrPop);
    };
  }, []);

  const navigateHash = useCallback((hashPath) => {
    const normalized = hashPath.startsWith('#') ? hashPath : `#${hashPath}`;
    if (window.location.hash !== normalized) {
      window.location.hash = normalized;
    } else {
      setRoute(parseRouteFromWindow());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileDrawerOpen(false);
  }, []);

  // Resolve active tenant & event for tenant routes
  const activeTenant = route.page === 'tenant'
    ? tenants.find((t) => t.slug.toLowerCase() === (route.slug || '').toLowerCase()) || null
    : null;
  const activeEvent = activeTenant
    ? events.find((e) => e.tenantId === activeTenant.id) || events[0]
    : null;

  // Apply dynamic per-tenant branding (or default EventPlan Sage/Olive on root/onboard/platform)
  useEffect(() => {
    if (route.page === 'tenant' && activeTenant) {
      applyTenantBrandingCss(activeTenant, theme);
      document.title = `${activeTenant.shortName || activeTenant.name} | EventPlan Cloud`;
    } else {
      applyTenantBrandingCss(null, theme);
      document.title = 'EventPlan Cloud | Multi-Tenant Event Websites & Check-In Platform';
    }
  }, [route.page, activeTenant, theme]);

  // Sync default active tab when route or auth changes
  useEffect(() => {
    if (route.page !== 'tenant') return;
    if (route.sub === 'register') {
      setActiveTab('register');
    } else if (route.sub === 'staff') {
      setActiveTab('staff');
    } else if (authSession && authSession.tenantSlug === route.slug) {
      if (authSession.role === 'organizer') setActiveTab('organizer');
      else if (authSession.role === 'staff') setActiveTab('staff');
      else if (authSession.role === 'attendee') setActiveTab('ticket');
    } else {
      setActiveTab('overview');
    }
  }, [route.page, route.slug, route.sub, authSession]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    Storage.setTheme(next);
  };

  const saveSession = (session) => {
    setAuthSession(session);
    if (session) {
      sessionStorage.setItem('emp_auth_session_v2', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('emp_auth_session_v2');
    }
  };

  const handleEventLoginSuccess = (session) => {
    saveSession(session);
    if (session.attendeeId) {
      setCurrentAttendeeId(session.attendeeId);
      Storage.setCurrentAttendeeId(session.attendeeId);
    }
    navigateHash(`/${session.tenantSlug}`);
  };

  const handleSignOut = () => {
    saveSession(null);
    setIsPlatformUnlocked(false);
    if (route.page === 'tenant' && activeTenant) {
      navigateHash(`/${activeTenant.slug}/login`);
    } else {
      navigateHash('/');
    }
  };

  const handleCheckInByCode = async (ticketCode, staffUser, offlineFlag, dayId, dayLabel, options) => {
    const result = await Storage.checkInByCodeAsync(ticketCode, staffUser, offlineFlag, dayId, dayLabel, options);
    refreshState();
    return result;
  };

  const handleReprintBadge = (regId, staffUser, reason) => {
    const res = Storage.reprintBadge(regId, staffUser, reason);
    fetch('/api/reprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regId, staffName: staffUser, reason }),
    }).then((r) => r.ok && r.json()).then((d) => d?.state && Storage.applyServerState(d.state)).catch(() => {});
    refreshState();
    return res;
  };

  const handleSyncOffline = () => {
    const count = Storage.syncOfflineQueue();
    refreshState();
    alert(`Synced ${count} pending offline check-in record(s).`);
  };

  const handleCompanyRegistered = (data) => {
    const created = Storage.addTenant(data);
    refreshState();
    saveSession({
      role: 'organizer',
      tenantId: created.id,
      tenantSlug: created.slug,
      user: created.organizer.name,
      email: created.organizer.email,
    });
    return created;
  };

  // =========================================================================
  // ROUTE 1: CENTRAL PLATFORM DIRECTORY & LANDING PAGE (#/)
  // =========================================================================
  if (route.page === 'landing') {
    return (
      <>
        <PublicLandingPage
          tenants={tenants}
          events={events}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateToEvent={(slug) => navigateHash(`/${slug}`)}
          onNavigateToEventLogin={(slug) => navigateHash(`/${slug}/login`)}
          onNavigateToOnboard={() => navigateHash('/onboard')}
          onNavigateToPlatformAdmin={() => navigateHash('/platform')}
          onOpenTerms={() => setIsTermsOpen(true)}
        />
        <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      </>
    );
  }

  // =========================================================================
  // ROUTE 2: DEDICATED ORGANIZATION & EVENT ONBOARDING (#/onboard)
  // =========================================================================
  if (route.page === 'onboard') {
    return (
      <>
        <OnboardOrganizationPage
          tenants={tenants}
          plans={plans}
          theme={theme}
          onToggleTheme={toggleTheme}
          onBack={() => navigateHash('/')}
          onCompanyRegistered={handleCompanyRegistered}
          onOpenEventSite={(slug) => navigateHash(`/${slug}`)}
          onOpenTerms={() => setIsTermsOpen(true)}
        />
        <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      </>
    );
  }

  // =========================================================================
  // ROUTE 3: PLATFORM SUPER-ADMIN CONSOLE (#/platform)
  // =========================================================================
  if (route.page === 'platform') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <header
          className="sticky top-0 z-50 h-16 px-4 sm:px-8 flex items-center justify-between border-b"
          style={{ background: 'var(--bg-header)', borderColor: 'var(--border-header)', color: 'var(--header-text)' }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateHash('/')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
              style={{ background: 'none', border: 'none', color: 'var(--header-text)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Directory</span>
            </button>
            <span className="opacity-40">|</span>
            <span className="font-bold text-sm sm:text-base">Platform Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            {isPlatformUnlocked && (
              <button type="button" onClick={handleSignOut} className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {!isPlatformUnlocked ? (
            <div className="fp-card max-w-md mx-auto p-6 sm:p-8 space-y-5 mt-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)' }}>
                  <Shield className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-extrabold m-0">Platform Super-Admin Access</h1>
                <p className="text-xs sm:text-sm m-0" style={{ color: 'var(--text-muted)' }}>
                  Enter the operator security PIN to manage all event websites and global audit trails.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (platformPinInput === 'admin123' || platformPinInput === 'admin') {
                    setIsPlatformUnlocked(true);
                    setPlatformPinError('');
                    saveSession({ role: 'super-admin', user: 'Platform Administrator' });
                  } else {
                    setPlatformPinError('Incorrect PIN. Demo PIN: admin123');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Operator Security PIN</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      value={platformPinInput}
                      onChange={(e) => setPlatformPinInput(e.target.value)}
                      placeholder="Demo PIN: admin123"
                      className="fp-input w-full pl-9 pr-3 py-2.5 text-sm"
                      autoFocus
                    />
                  </div>
                  {platformPinError && <p className="text-xs mt-1.5 m-0" style={{ color: 'var(--fp-red)' }}>{platformPinError}</p>}
                </div>
                <button type="submit" className="btn-fp-olive w-full py-2.5 text-sm font-bold">
                  Unlock Platform Console
                </button>
              </form>
            </div>
          ) : (
            <SuperAdminDashboard
              tenants={tenants}
              plans={plans}
              auditLogs={auditLogs}
              allRegistrations={registrations}
              onNavigateToOnboard={() => navigateHash('/onboard')}
              onToggleTenantStatus={(id) => {
                Storage.toggleTenantStatus(id);
                refreshState();
              }}
              onOpenEventSite={(slug) => {
                const t = tenants.find((x) => x.slug === slug);
                if (t) {
                  saveSession({ role: 'organizer', tenantId: t.id, tenantSlug: t.slug, user: t.organizer?.name || 'Admin' });
                }
                navigateHash(`/${slug}`);
              }}
            />
          )}
        </main>
        <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      </div>
    );
  }

  // =========================================================================
  // ROUTE 4: DEDICATED EVENT WEBSITE NOT FOUND
  // =========================================================================
  if (!activeTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <div className="fp-card max-w-md w-full p-8 text-center space-y-4">
          <Globe className="w-10 h-10 mx-auto" style={{ color: 'var(--fp-olive)' }} />
          <h1 className="text-xl font-extrabold m-0">Event Website Not Found</h1>
          <p className="text-sm m-0" style={{ color: 'var(--text-muted)' }}>
            No event portal exists at <code>/{route.slug}</code>. Browse active event websites or create a new one.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <button type="button" onClick={() => navigateHash('/')} className="btn-fp-olive px-4 py-2 text-sm">
              Browse All Events
            </button>
            <button type="button" onClick={() => navigateHash('/onboard')} className="btn-fp-outline px-4 py-2 text-sm">
              Create Event Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ROUTE 5: DEDICATED SPLIT-SCREEN EVENT LOGIN (#/:slug/login)
  // =========================================================================
  if (route.sub === 'login') {
    return (
      <>
        <EventLoginPage
          tenant={activeTenant}
          event={activeEvent}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLoginSuccess={handleEventLoginSuccess}
          onContinuePublic={() => navigateHash(`/${activeTenant.slug}`)}
          onBackToDirectory={() => navigateHash('/')}
          onOpenTerms={() => setIsTermsOpen(true)}
        />
        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
          tenantName={activeTenant.name}
        />
      </>
    );
  }

  // =========================================================================
  // ROUTE 6: DEDICATED BRANDED EVENT WEBSITE SHELL (#/:slug)
  // Mirrors Multi-School Thesis Repository's home.tsx FinPlanner Shell!
  // =========================================================================
  const isAuthedForTenant = Boolean(
    authSession && (authSession.role === 'super-admin' || authSession.tenantSlug === activeTenant.slug)
  );
  const currentRole = isAuthedForTenant ? authSession.role : 'guest';
  const isSuperAdmin = currentRole === 'super-admin';
  const isOrganizer = currentRole === 'organizer' || isSuperAdmin;
  const isStaff = currentRole === 'staff' || isOrganizer;
  const isAttendeeUser = currentRole === 'attendee';

  const eventRegs = registrations.filter((r) => r.eventId === activeEvent?.id);
  const tenantAuditLogs = auditLogs.filter((l) => l.tenantId === activeTenant.id);

  const navItems = [
    { id: 'overview', label: 'Event Overview', icon: Calendar, show: true },
    { id: 'organizer', label: 'Organizer Dashboard', icon: BarChart3, show: isOrganizer },
    { id: 'staff', label: 'Check-In Station', icon: QrCode, show: isStaff },
    { id: 'ticket', label: isAttendeeUser ? 'My Ticket & Badge' : 'Digital Tickets', icon: Ticket, show: isAuthedForTenant },
    { id: 'register', label: 'Register for Event', icon: UserCheck, show: true },
    { id: 'chat', label: 'Event Chat', icon: MessageSquare, show: isAuthedForTenant },
    { id: 'audit', label: 'Audit Trail', icon: ShieldCheck, show: isOrganizer },
    { id: 'branding', label: 'Branding & Settings', icon: Palette, show: isOrganizer },
  ].filter((item) => item.show);

  const roleLabel =
    currentRole === 'super-admin' ? 'Platform Admin'
      : currentRole === 'organizer' ? 'Event Organizer'
      : currentRole === 'staff' ? 'Check-In Staff'
      : currentRole === 'attendee' ? 'Registered Attendee'
      : 'Public Visitor';

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* ─── SINGLE UNIFIED FULL-WIDTH TOP HEADER (64px, Zero Double Headers on Mobile!) ─── */}
      <header
        className="sticky top-0 z-[60] h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 border-b"
        style={{
          background: 'var(--bg-header)',
          borderColor: 'var(--border-header)',
          color: 'var(--header-text)',
        }}
      >
        {/* Left: Mobile Hamburger + Tenant Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="ep-mobile-menu-btn w-9 h-9 rounded-lg items-center justify-center shrink-0"
            style={{ background: 'rgba(0,0,0,0.08)', color: 'var(--header-text)', border: 'none' }}
            aria-label="Toggle navigation menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(isOrganizer ? 'organizer' : isStaff ? 'staff' : 'overview')}
            className="flex items-center gap-2.5 min-w-0 text-left"
            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--header-text)' }}
          >
            <TenantLogo tenant={activeTenant} size={36} className="rounded-lg" />
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base leading-tight truncate">
                {activeTenant.shortName || activeTenant.name}
              </div>
              <div className="text-[11px] opacity-75 hidden sm:block truncate font-mono">
                /{activeTenant.slug} · {roleLabel}
              </div>
            </div>
          </button>
        </div>

        {/* Right: Theme Toggle + Offline Indicator + Auth Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{ background: 'var(--fp-sage)', borderColor: 'var(--border-header)', color: 'var(--fp-sage-text)' }}
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {isAuthedForTenant ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateHash(`/${activeTenant.slug}/login`)}
              className="btn-fp-olive px-3.5 py-2 text-xs inline-flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in</span>
            </button>
          )}
        </div>
      </header>

      {/* ─── BODY: LEFT SIDEBAR + MAIN CANVAS ─── */}
      <div className="flex flex-1 min-h-[calc(100vh-64px)]">
        {/* Mobile Drawer Backdrop */}
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className={`ep-mobile-backdrop ${mobileDrawerOpen ? 'open' : ''}`}
        />

        {/* LEFT SIDEBAR (FinPlanner Style) */}
        <aside className={`ep-sidebar p-5 ${mobileDrawerOpen ? 'open' : ''}`}>
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-left transition-colors"
                  style={{
                    background: isActive ? 'var(--fp-sage)' : 'transparent',
                    color: isActive ? 'var(--fp-sage-text)' : 'var(--text-main)',
                    fontWeight: isActive ? 700 : 500,
                    border: 'none',
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            {!isAuthedForTenant && (
              <button
                type="button"
                onClick={() => navigateHash(`/${activeTenant.slug}/login`)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-left mt-2 font-bold"
                style={{ background: 'var(--fp-olive)', color: 'var(--fp-olive-text, #ffffff)', border: 'none' }}
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Sign In to Portal</span>
              </button>
            )}
          </nav>

          {/* Bottom Account & Connectivity Summary */}
          <div className="mt-6 pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
            {isStaff && (
              <div className="p-2.5 rounded-lg border text-xs flex items-center justify-between" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  {isOffline ? <WifiOff className="w-3.5 h-3.5" style={{ color: 'var(--fp-amber)' }} /> : <Wifi className="w-3.5 h-3.5" style={{ color: 'var(--fp-green)' }} />}
                  {isOffline ? 'Offline' : 'Online'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOffline(!isOffline)}
                  className="text-[11px] font-bold underline"
                  style={{ color: 'var(--fp-olive)', background: 'none', border: 'none' }}
                >
                  {isOffline ? 'Go Online' : 'Simulate'}
                </button>
              </div>
            )}

            <div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Active Role</div>
              <div className="text-lg font-extrabold leading-tight">{roleLabel}</div>
              {isAuthedForTenant && (
                <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {authSession.user}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t text-xs" style={{ borderColor: 'var(--border-color)' }}>
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => navigateHash('/platform')}
                  className="text-left font-semibold hover:underline"
                  style={{ color: 'var(--fp-olive)', background: 'none', border: 'none', padding: 0 }}
                >
                  ← Platform Admin Directory
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="text-left font-medium hover:underline inline-flex items-center gap-1"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', padding: 0 }}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Terms &amp; Conditions</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
            {activeTab === 'overview' && (
              <EventOverviewPanel
                tenant={activeTenant}
                event={activeEvent}
                registrationsCount={eventRegs.length}
                onGoToRegister={() => setActiveTab('register')}
                onGoToLogin={() => navigateHash(`/${activeTenant.slug}/login`)}
                onGoToTicket={() => setActiveTab('ticket')}
                isAuthenticated={isAuthedForTenant}
              />
            )}

            {activeTab === 'organizer' && isOrganizer && (
              <OrganizerDashboard
                tenant={activeTenant}
                event={activeEvent}
                registrations={registrations}
                auditLogs={auditLogs}
                onCheckInByCode={handleCheckInByCode}
                onReprintBadge={handleReprintBadge}
                onRefresh={refreshState}
              />
            )}

            {activeTab === 'staff' && isStaff && (
              <CheckInStation
                tenant={activeTenant}
                event={activeEvent}
                registrations={registrations}
                auditLogs={auditLogs}
                onCheckInByCode={handleCheckInByCode}
                onReprintBadge={handleReprintBadge}
                isOffline={isOffline}
                offlineQueue={offlineQueue}
                onSyncOffline={handleSyncOffline}
                initialStation={authSession?.station}
              />
            )}

            {(activeTab === 'ticket' || activeTab === 'register') && (
              <AttendeePortal
                tenant={activeTenant}
                event={activeEvent}
                registrations={registrations}
                onAddRegistration={async (data) => {
                  const reg = await Storage.addRegistrationAsync(data);
                  refreshState();
                  setCurrentAttendeeId(reg.id);
                  Storage.setCurrentAttendeeId(reg.id);
                  // Automatically sign in newly registered attendee to their personal ticket!
                  if (!isAuthedForTenant) {
                    saveSession({
                      role: 'attendee',
                      tenantId: activeTenant.id,
                      tenantSlug: activeTenant.slug,
                      user: reg.name,
                      email: reg.email,
                      attendeeId: reg.id,
                    });
                  }
                  if (route.sub === 'register') {
                    navigateHash(`/${activeTenant.slug}`);
                  }
                  setActiveTab('ticket');
                  return reg;
                }}
                currentAttendeeId={isAuthedForTenant ? currentAttendeeId : null}
                setCurrentAttendeeId={(id) => {
                  setCurrentAttendeeId(id);
                  Storage.setCurrentAttendeeId(id);
                }}
                onNavigateToChat={() => setActiveTab('chat')}
                onOpenTerms={() => setIsTermsOpen(true)}
                defaultView={activeTab === 'register' || !isAuthedForTenant ? 'register' : 'ticket'}
                isOrganizerOrAdmin={isOrganizer}
                isAuthenticated={isAuthedForTenant}
              />
            )}

            {activeTab === 'chat' && isAuthedForTenant && (
              <EventChat
                tenant={activeTenant}
                event={activeEvent}
                registrations={registrations}
                chatMessages={chatMessages}
                onSendMessage={(data) => {
                  const msg = Storage.sendChatMessage(data);
                  refreshState();
                  return msg;
                }}
                onDeleteMessage={(id) => {
                  Storage.deleteChatMessage(id, authSession?.user || 'Organizer', activeTenant.id);
                  refreshState();
                }}
                onTogglePinMessage={(id) => {
                  Storage.togglePinMessage(id);
                  refreshState();
                }}
                currentAttendeeId={currentAttendeeId}
                onCheckInByCode={handleCheckInByCode}
                activeRole={currentRole}
              />
            )}

            {activeTab === 'audit' && isOrganizer && (
              <AuditTrailPanel
                logs={tenantAuditLogs}
                title={`${activeTenant.shortName || activeTenant.name} Security & Operations Audit Trail`}
                tenantName={activeTenant.name}
              />
            )}

            {activeTab === 'branding' && isOrganizer && (
              <WorkspaceBrandingSettings
                tenant={activeTenant}
                event={activeEvent}
                onUpdated={refreshState}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t py-5 px-4 sm:px-8 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <strong style={{ color: 'var(--text-main)' }}>{activeTenant.name}</strong> · Powered by EventPlan Cloud · Ghana Act 843 Compliant
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="hover:underline font-semibold"
                  style={{ color: 'var(--fp-olive)', background: 'none', border: 'none' }}
                >
                  Terms &amp; Conditions
                </button>
                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => navigateHash('/platform')}
                    className="hover:underline"
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                  >
                    Platform Admin
                  </button>
                )}
              </div>
            </div>
          </footer>
        </div>
      </div>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        tenantName={activeTenant.name}
      />
    </div>
  );
}
