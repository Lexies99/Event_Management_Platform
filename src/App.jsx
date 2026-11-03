import React, { useState, useEffect } from 'react';
import { LogOut, ChevronRight } from 'lucide-react';
import { Storage } from './data/storage';
import Sidebar from './components/Sidebar';
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard';
import OrganizerDashboard from './components/Organizer/OrganizerDashboard';
import CheckInStation from './components/CheckIn/CheckInStation';
import AttendeePortal from './components/Attendee/AttendeePortal';
import EventChat from './components/Chat/EventChat';
import CompanyRegistrationModal from './components/CompanyRegistration/CompanyRegistrationModal';
import LoginModal from './components/Auth/LoginModal';
import PublicLandingPage from './components/Landing/PublicLandingPage';

export default function App() {
  // Initialize storage defaults on first load
  useEffect(() => {
    Storage.init();
  }, []);

  const [tenants, setTenants] = useState(() => Storage.getTenants());
  const [activeTenant, setActiveTenant] = useState(() => Storage.getActiveTenant());
  const [activeRole, setActiveRole] = useState(() => Storage.getActiveRole());
  const [currentAttendeeId, setCurrentAttendeeId] = useState(() => Storage.getCurrentAttendeeId());
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState(() => Storage.getOfflineQueue());
  const [registrations, setRegistrations] = useState(() => Storage.getRegistrations());
  const [chatMessages, setChatMessages] = useState(() => Storage.getChatMessages());
  const [auditLogs, setAuditLogs] = useState(() => Storage.getAuditLogs());
  const [plans, setPlans] = useState(() => Storage.getPlans());
  const [events, setEvents] = useState(() => Storage.getEvents());

  // Top-Level View Mode:
  // 'landing' = Public Commercial Website (Default for website visitors)
  // 'app' = Internal System Dashboard (when signed in or using direct role/tenant links)
  const [viewMode, setViewMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tenant') || params.get('role') || params.get('operator') === 'true' || params.get('app') === 'true') {
      return 'app';
    }
    const saved = sessionStorage.getItem('emp_auth_session');
    return saved ? 'app' : 'landing';
  });

  const [authSession, setAuthSession] = useState(() => {
    const saved = sessionStorage.getItem('emp_auth_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCompanyRegOpen, setIsCompanyRegOpen] = useState(false);

  // Platform Operator PIN authentication state
  const [isOperatorUnlocked, setIsOperatorUnlocked] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('operator') === 'true' || authSession?.role === 'super-admin';
  });

  // Reload state from Storage
  const refreshState = () => {
    const freshTenants = Storage.getTenants();
    setTenants(freshTenants);
    const freshActiveTenant = Storage.getActiveTenant();
    setActiveTenant(freshActiveTenant);
    setRegistrations(Storage.getRegistrations());
    setChatMessages(Storage.getChatMessages());
    setAuditLogs(Storage.getAuditLogs());
    setOfflineQueue(Storage.getOfflineQueue());
    setEvents(Storage.getEvents());
  };

  // URL query parameter parsing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tenantSlug = params.get('tenant');
    const roleParam = params.get('role');
    const registerParam = params.get('register-company') || params.get('apply');
    const loginParam = params.get('login');
    const operatorParam = params.get('operator');

    if (tenantSlug) {
      const match = tenants.find(t => t.slug === tenantSlug);
      if (match) {
        Storage.setActiveTenantId(match.id);
        setActiveTenant(match);
      }
    }

    if (registerParam === 'true') {
      setIsCompanyRegOpen(true);
    }

    if (loginParam === 'true') {
      setIsLoginModalOpen(true);
    }

    if (operatorParam === 'true' || roleParam === 'super-admin') {
      setIsOperatorUnlocked(true);
      setActiveRole('super-admin');
      setViewMode('app');
    } else if (roleParam && ['organizer', 'staff', 'attendee', 'chat'].includes(roleParam)) {
      setActiveRole(roleParam);
      setViewMode('app');
    }
  }, [tenants]);

  // Subscribe to storage changes
  useEffect(() => {
    const handler = () => {
      refreshState();
    };
    window.addEventListener('emp_storage_updated', handler);
    return () => window.removeEventListener('emp_storage_updated', handler);
  }, []);

  // Update dynamic brand color in CSS root
  useEffect(() => {
    if (activeTenant?.brandColor) {
      document.documentElement.style.setProperty('--brand-500', activeTenant.brandColor);
    }
  }, [activeTenant]);

  const handleSelectTenant = (tenantId) => {
    Storage.setActiveTenantId(tenantId);
    const found = tenants.find(t => t.id === tenantId);
    if (found) {
      setActiveTenant(found);
    }
  };

  const handleRoleChange = (role) => {
    if (role === 'super-admin' && !isOperatorUnlocked) {
      alert("Platform Super-Admin view requires Operator PIN.");
      return;
    }
    setActiveRole(role);
    Storage.setActiveRole(role);
  };

  // Login as Company Organizer
  const handleLoginCompany = (tenant) => {
    const session = {
      role: 'company',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      user: tenant.organizer.name
    };
    setAuthSession(session);
    sessionStorage.setItem('emp_auth_session', JSON.stringify(session));

    Storage.setActiveTenantId(tenant.id);
    setActiveTenant(tenant);
    setActiveRole('organizer');
    Storage.setActiveRole('organizer');
    setIsOperatorUnlocked(false);
    setViewMode('app');
  };

  // Login as System Super-Admin
  const handleLoginSuperAdmin = () => {
    const session = {
      role: 'super-admin',
      user: 'Platform Administrator'
    };
    setAuthSession(session);
    sessionStorage.setItem('emp_auth_session', JSON.stringify(session));

    setIsOperatorUnlocked(true);
    setActiveRole('super-admin');
    Storage.setActiveRole('super-admin');
    setViewMode('app');
  };

  // Sign out back to public website
  const handleSignOut = () => {
    setAuthSession(null);
    sessionStorage.removeItem('emp_auth_session');
    setIsOperatorUnlocked(false);
    setViewMode('landing');
    window.history.pushState({}, '', window.location.pathname);
  };

  // 1-Click Launch Demo from public landing page
  const handleLaunchDemo = (slug = 'acme') => {
    const demoTenant = tenants.find(t => t.slug === slug) || tenants[0];
    handleLoginCompany(demoTenant);
  };

  // CheckIn execution handler with multi-day support
  const handleCheckInByCode = (
    ticketCode, 
    staffUser = "Staff", 
    offlineFlag = isOffline, 
    currentDayId = "day-1", 
    currentDayLabel = "Day 1"
  ) => {
    const result = Storage.checkInByCode(ticketCode, staffUser, offlineFlag, currentDayId, currentDayLabel);
    refreshState();
    return result;
  };

  // Offline queue sync handler
  const handleSyncOffline = () => {
    const synced = Storage.syncOfflineQueue();
    refreshState();
    alert(`Successfully synced ${synced} pending check-in records to the server database.`);
  };

  // Badge reprint handler
  const handleReprintBadge = (regId, staffUser, reason) => {
    const res = Storage.reprintBadge(regId, staffUser, reason);
    refreshState();
    return res;
  };

  // Self-Service Company Registration handler
  const handleCompanyRegistered = (tenantData) => {
    const newTenant = Storage.addTenant(tenantData);
    refreshState();
    handleLoginCompany(newTenant);
    return newTenant;
  };

  // Active event for the selected tenant
  const activeEvent = events.find(e => e.tenantId === activeTenant?.id) || events[0];

  // =========================================================================
  // VIEW MODE 1: PUBLIC COMMERCIAL WEBSITE
  // Rendered for any visitor at root before signing in
  // =========================================================================
  if (viewMode === 'landing') {
    return (
      <>
        <PublicLandingPage
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenRegisterCompany={() => setIsCompanyRegOpen(true)}
          onLaunchDemo={handleLaunchDemo}
          tenants={tenants}
        />

        {/* Global Modals */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          tenants={tenants}
          onLoginCompany={handleLoginCompany}
          onLoginSuperAdmin={handleLoginSuperAdmin}
          onOpenRegisterCompany={() => setIsCompanyRegOpen(true)}
        />

        <CompanyRegistrationModal
          isOpen={isCompanyRegOpen}
          onClose={() => setIsCompanyRegOpen(false)}
          onCompanyRegistered={handleCompanyRegistered}
          plans={plans}
        />
      </>
    );
  }

  // =========================================================================
  // VIEW MODE 2: LOGGED-IN SYSTEM DASHBOARDS (Company Section or Super-Admin Fleet)
  // Left-Sidebar layout on desktop, top-bar + drawer on mobile
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#141413] text-white flex flex-col lg:flex-row font-sans selection:bg-[#FB9378]/30">
      
      {/* Left-Sidebar Vertical Navigation */}
      <Sidebar
        activeRole={activeRole}
        setActiveRole={handleRoleChange}
        tenants={tenants}
        activeTenant={activeTenant}
        onSelectTenant={handleSelectTenant}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        offlineQueueCount={offlineQueue.length}
        onSyncOffline={handleSyncOffline}
        onOpenCompanyRegistration={() => setIsCompanyRegOpen(true)}
        isOperatorUnlocked={isOperatorUnlocked}
        setIsOperatorUnlocked={setIsOperatorUnlocked}
        onSignOut={handleSignOut}
        onGoToLanding={() => setViewMode('landing')}
      />

      {/* Main Content Area (Right Side on Desktop) */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#141413]">
        
        {/* TOP HEADER BAR: Section Breadcrumb & SIGN-OUT IN TOP RIGHT CORNER */}
        <header className="h-16 border-b border-white/10 px-4 sm:px-8 flex items-center justify-between bg-[#141413]/90 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white/40 hidden sm:inline">Workspace:</span>
            <span className="text-xs font-heading font-bold text-white bg-[#1c1c1b] px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-[130px] sm:max-w-none">
              {activeTenant?.name || 'Default Workspace'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <span className="text-xs font-bold text-[#FCF8B3] truncate">
              {activeRole === 'organizer' && 'Organizer Console'}
              {activeRole === 'staff' && 'Check-in Staff Station'}
              {activeRole === 'attendee' && 'Attendee Portal'}
              {activeRole === 'chat' && 'Event Community Chat'}
              {activeRole === 'super-admin' && 'Super-Admin Fleet'}
            </span>
          </div>

          {/* TOP RIGHT CORNER: Sign Out Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1c1c1b] hover:bg-rose-500/15 text-white/80 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all shadow-sm group active:scale-95 cursor-pointer"
              title="Sign Out of Workspace"
            >
              <LogOut className="w-3.5 h-3.5 text-white/50 group-hover:text-rose-400 transition-colors" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Role 1: Super-Admin Control Plane (System Admin only) */}
        {activeRole === 'super-admin' && isOperatorUnlocked && (
          <SuperAdminDashboard
            tenants={tenants}
            activeTenant={activeTenant}
            onSelectTenant={handleSelectTenant}
            onAddTenant={(data) => {
              const newT = Storage.addTenant(data);
              refreshState();
              return newT;
            }}
            onToggleTenantStatus={(id) => {
              Storage.toggleTenantStatus(id);
              refreshState();
            }}
            plans={plans}
            auditLogs={auditLogs}
            allRegistrations={registrations}
            allEvents={events}
          />
        )}

        {/* Role 2: Organizer Console (The Company's Section) */}
        {activeRole === 'organizer' && (
          <OrganizerDashboard
            tenant={activeTenant}
            event={activeEvent}
            registrations={registrations}
            onCheckInByCode={handleCheckInByCode}
            onReprintBadge={handleReprintBadge}
            activeRole={activeRole}
          />
        )}

        {/* Role 3: Check-in Staff Station */}
        {activeRole === 'staff' && (
          <CheckInStation
            tenant={activeTenant}
            event={activeEvent}
            registrations={registrations}
            onCheckInByCode={handleCheckInByCode}
            onReprintBadge={handleReprintBadge}
            isOffline={isOffline}
            offlineQueue={offlineQueue}
            onSyncOffline={handleSyncOffline}
          />
        )}

        {/* Role 4: Attendee Portal (Registration & Digital Ticket) */}
        {activeRole === 'attendee' && (
          <AttendeePortal
            tenant={activeTenant}
            event={activeEvent}
            registrations={registrations}
            onAddRegistration={(data) => {
              const reg = Storage.addRegistration(data);
              refreshState();
              return reg;
            }}
            currentAttendeeId={currentAttendeeId}
            setCurrentAttendeeId={(id) => {
              setCurrentAttendeeId(id);
              Storage.setCurrentAttendeeId(id);
            }}
            onNavigateToChat={() => handleRoleChange('chat')}
          />
        )}

        {/* Role 5: Real-Time Gated Event Chat */}
        {activeRole === 'chat' && (
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
              Storage.deleteChatMessage(id);
              refreshState();
            }}
            onTogglePinMessage={(id) => {
              Storage.togglePinMessage(id);
              refreshState();
            }}
            currentAttendeeId={currentAttendeeId}
            onCheckInByCode={handleCheckInByCode}
            activeRole={activeRole}
          />
        )}

        </main>

        {/* Authenticated Dashboard Footer */}
        <footer className="border-t border-white/10 bg-[#141413] py-6 text-xs text-white/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white">EventPlan Multi-Tenant Cloud</span>
              <span>•</span>
              <span>Workspace: {activeTenant?.name}</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">Row-Level Security Active</span>
            </div>
            <div className="flex items-center gap-3 text-white/50">
              <button
                onClick={() => setViewMode('landing')}
                className="text-[#E0C97E] hover:text-[#FCF8B3] underline font-medium"
              >
                Public Commercial Website
              </button>
              <span>•</span>
              <span>v1.0 Production Architecture</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        tenants={tenants}
        onLoginCompany={handleLoginCompany}
        onLoginSuperAdmin={handleLoginSuperAdmin}
        onOpenRegisterCompany={() => setIsCompanyRegOpen(true)}
      />

      <CompanyRegistrationModal
        isOpen={isCompanyRegOpen}
        onClose={() => setIsCompanyRegOpen(false)}
        onCompanyRegistered={handleCompanyRegistered}
        plans={plans}
      />

    </div>
  );
}
