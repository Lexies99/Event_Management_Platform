import React, { useState, useEffect } from 'react';
import { Storage } from './data/storage';
import Navbar from './components/Navbar';
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard';
import OrganizerDashboard from './components/Organizer/OrganizerDashboard';
import CheckInStation from './components/CheckIn/CheckInStation';
import AttendeePortal from './components/Attendee/AttendeePortal';
import EventChat from './components/Chat/EventChat';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

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

  // URL query parameter parsing for private tenant links (e.g. ?tenant=acme or ?role=staff)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tenantSlug = params.get('tenant');
    const roleParam = params.get('role');

    if (tenantSlug) {
      const match = tenants.find(t => t.slug === tenantSlug);
      if (match) {
        Storage.setActiveTenantId(match.id);
        setActiveTenant(match);
      }
    }

    if (roleParam && ['super-admin', 'organizer', 'staff', 'attendee', 'chat'].includes(roleParam)) {
      setActiveRole(roleParam);
      Storage.setActiveRole(roleParam);
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
    setActiveRole(role);
    Storage.setActiveRole(role);
  };

  // CheckIn execution handler
  const handleCheckInByCode = (ticketCode, staffUser = "Staff", offlineFlag = isOffline) => {
    const result = Storage.checkInByCode(ticketCode, staffUser, offlineFlag);
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

  // Active event for the selected tenant
  const activeEvent = events.find(e => e.tenantId === activeTenant?.id) || events[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar & Role Switcher */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={handleRoleChange}
        tenants={tenants}
        activeTenant={activeTenant}
        onSelectTenant={handleSelectTenant}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        offlineQueueCount={offlineQueue.length}
        onSyncOffline={handleSyncOffline}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Role 1: Super-Admin Control Plane */}
        {activeRole === 'super-admin' && (
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

        {/* Role 2: Organizer Console */}
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

        {/* Role 4: Attendee Portal (Registration & Ticket) */}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">EventFlow Cloud Platform</span>
            <span>•</span>
            <span>Multi-Tenant Architecture</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">Row-Level Security Active</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Version 1.0 Production Architecture</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
