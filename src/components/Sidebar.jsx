import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  LayoutDashboard, 
  QrCode, 
  UserCheck, 
  MessageSquare, 
  Wifi, 
  WifiOff, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  Check,
  Lock,
  Unlock,
  KeyRound,
  X,
  PlusCircle,
  LogOut,
  ArrowUpRight,
  Menu,
  ChevronRight
} from 'lucide-react';

function EventPlanMonogram({ size = 38, className = "" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}
      className={`shrink-0 ${className}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48" fill="#F4F4F3" />
      <text 
        x="50" 
        y="62" 
        textAnchor="middle" 
        fontFamily="'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, sans-serif" 
        fontWeight="900" 
        fontSize="44" 
        letterSpacing="-2" 
        fill="#141413"
      >
        EP
      </text>
    </svg>
  );
}

export default function Sidebar({ 
  activeRole, 
  setActiveRole, 
  tenants, 
  activeTenant, 
  onSelectTenant,
  isOffline,
  setIsOffline,
  offlineQueueCount,
  onSyncOffline,
  onOpenCompanyRegistration,
  isOperatorUnlocked,
  setIsOperatorUnlocked,
  onSignOut,
  onGoToLanding
}) {
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTenantDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation items for Company Workspace
  const companyNavItems = [
    {
      id: 'organizer',
      label: 'Organizer Console',
      badge: 'Admin',
      icon: LayoutDashboard,
      description: 'Analytics, badges & reports'
    },
    {
      id: 'staff',
      label: 'Check-in Staff',
      badge: 'Live',
      icon: QrCode,
      description: 'Optical scanner & desk'
    },
    {
      id: 'attendee',
      label: 'Attendee Portal',
      badge: 'Self',
      icon: UserCheck,
      description: 'Registration & pass'
    },
    {
      id: 'chat',
      label: 'Event Community Chat',
      badge: 'Live',
      icon: MessageSquare,
      description: 'Real-time attendee room'
    }
  ];

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === 'admin') {
      setIsOperatorUnlocked(true);
      setActiveRole('super-admin');
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Incorrect Operator PIN. Hint: admin123');
    }
  };

  const handleExitSuperAdmin = () => {
    setIsOperatorUnlocked(false);
    setActiveRole('organizer');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* TOP SECTION: BRAND & WORKSPACE */}
      <div className="space-y-5">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onGoToLanding();
            }}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left group"
            title="Return to Public Website"
          >
            <EventPlanMonogram size={38} className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-white text-lg tracking-tight">EventPlan</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-white/10 text-[#FCF8B3] uppercase border border-[#E0C97E]/30">
                  v1.0
                </span>
              </div>
              <span className="text-[11px] text-white/50 flex items-center gap-1 group-hover:text-[#FB9378] transition-colors">
                Public Website <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </button>

          {/* Mobile close button */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Tenant / Workspace Selector */}
        <div className="relative" ref={dropdownRef}>
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5 px-1">
            Active Workspace
          </div>
          <button
            onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#1c1c1b] hover:bg-[#252523] border border-white/10 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner"
                style={{ backgroundColor: activeTenant?.brandColor || '#AB6088' }}
              >
                {activeTenant?.name?.charAt(0) || 'T'}
              </div>
              <div className="truncate">
                <div className="text-xs font-heading font-bold text-white truncate flex items-center gap-1.5">
                  {activeTenant?.name || 'Default Workspace'}
                </div>
                <div className="text-[10px] text-white/50 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  /{activeTenant?.slug || 'test'} • Isolated
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${isTenantDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Tenant Switcher Dropdown */}
          {isTenantDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1c1c1b] border border-white/15 rounded-xl shadow-2xl overflow-hidden py-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10">
                Switch Company Fleet
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-white/5">
                {tenants.map(t => {
                  const isSelected = t.id === activeTenant?.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTenant(t);
                        setIsTenantDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors ${
                        isSelected ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ backgroundColor: t.brandColor || '#AB6088' }}
                        >
                          {t.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold truncate">{t.name}</p>
                          <p className="text-[10px] text-white/40 font-mono">/{t.slug}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#FB9378] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-white/10 bg-[#141413]">
                <button
                  onClick={() => {
                    setIsTenantDropdownOpen(false);
                    onOpenCompanyRegistration();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black hover:opacity-90 transition-opacity"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Register New Company
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Navigation Links */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2 px-1">
            Workspace Views
          </div>

          {/* Super Admin Tab if unlocked */}
          {isOperatorUnlocked && (
            <button
              onClick={() => {
                setActiveRole('super-admin');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                activeRole === 'super-admin'
                  ? 'bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold shadow-lg shadow-[#FB9378]/20'
                  : 'text-amber-300 hover:text-white hover:bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-4 h-4 shrink-0 ${activeRole === 'super-admin' ? 'text-black' : 'text-amber-400'}`} />
                <span className="truncate">Super-Admin Fleet</span>
              </div>
              <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                activeRole === 'super-admin' ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-300'
              }`}>
                Platform
              </span>
            </button>
          )}

          {/* Standard Company Roles */}
          {companyNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeRole === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveRole(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold shadow-lg shadow-[#FB9378]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-white/50'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                  isActive ? 'text-black translate-x-0.5' : 'text-white/20'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Quick Actions Card */}
        <div className="p-3 rounded-xl bg-[#1c1c1b] border border-white/10 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">
            Quick Actions
          </div>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenCompanyRegistration();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#E0C97E]" />
            <span>+ Register New Company</span>
          </button>

          {/* Operator Mode PIN Unlock/Relock */}
          {isOperatorUnlocked ? (
            <button
              onClick={handleExitSuperAdmin}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-amber-300 hover:bg-amber-500/10 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>Operator Active</span>
              </div>
              <span className="text-[10px] text-amber-400/80 hover:underline">Lock</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <Lock className="w-3.5 h-3.5 text-white/40" />
              <span>Operator PIN Unlock</span>
            </button>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: NETWORK STATUS & USER PROFILE */}
      <div className="pt-4 mt-6 border-t border-white/10 space-y-3">
        {/* Offline / Online Sync Controller */}
        <div className="p-2.5 rounded-xl bg-[#1c1c1b] border border-white/10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOffline(!isOffline)}
              className="flex items-center gap-2 text-left"
              title="Toggle network simulation (FR-3 Offline Mode)"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
              <span className="text-xs font-semibold text-white">
                {isOffline ? 'Offline Mode' : 'Cloud Online'}
              </span>
            </button>
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isOffline ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {isOffline ? 'Go Online' : 'Simulate'}
            </button>
          </div>

          {/* Pending Sync Queue */}
          {offlineQueueCount > 0 && (
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-amber-300 font-mono">
                {offlineQueueCount} record{offlineQueueCount > 1 ? 's' : ''} queued
              </span>
              <button
                onClick={onSyncOffline}
                className="flex items-center gap-1 text-[10px] font-bold text-[#E0C97E] hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Sync Now
              </button>
            </div>
          )}
        </div>

        {/* User Sign Out */}
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Workspace</span>
        </button>
      </div>

      {/* Operator PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1c1b] border border-white/15 rounded-2xl max-w-sm w-full p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => {
                setIsPinModalOpen(false);
                setPinError('');
                setPinInput('');
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#AB6088] via-[#FB9378] to-[#E0C97E] flex items-center justify-center text-black shadow-lg">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-white">Operator PIN</h3>
                <p className="text-xs text-white/50">Multi-tenant fleet admin access</p>
              </div>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Master Security PIN
                </label>
                <input 
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Enter PIN (demo: admin123)"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141413] border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FB9378]"
                />
                {pinError && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">{pinError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black hover:opacity-90"
                >
                  Unlock Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* MOBILE TOP BAR (visible on < lg screens) */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#141413]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-[#1c1c1b] border border-white/10 text-white hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <EventPlanMonogram size={28} />
            <span className="font-heading font-extrabold text-white text-base">EventPlan</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[11px] font-mono px-2 py-1 rounded-lg bg-[#1c1c1b] border border-white/10 text-white/80">
            /{activeTenant?.slug || 'test'}
          </div>
          <button
            onClick={onSignOut}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-[#141413] border-r border-white/15 p-5 shadow-2xl z-10 overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* DESKTOP STICKY LEFT SIDEBAR (visible on >= lg screens) */}
      <aside className="hidden lg:flex w-72 shrink-0 h-screen sticky top-0 bg-[#141413] border-r border-white/10 p-5 z-30 flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
