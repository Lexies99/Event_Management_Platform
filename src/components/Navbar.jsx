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
  Radio,
  Lock,
  Unlock,
  KeyRound,
  X,
  PlusCircle,
  Eye,
  LogOut
} from 'lucide-react';
import { Storage } from '../data/storage';

export default function Navbar({ 
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

  // Company roles (strict isolation: Super-Admin is hidden from normal company users)
  const companyNavItems = [
    {
      id: 'organizer',
      label: 'Organizer',
      icon: LayoutDashboard,
      color: 'text-indigo-400',
      activeBg: 'bg-indigo-500/15 text-indigo-200 border-indigo-500/30'
    },
    {
      id: 'staff',
      label: 'Check-in Staff',
      icon: QrCode,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'attendee',
      label: 'Attendee Portal',
      icon: UserCheck,
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-500/15 text-cyan-200 border-cyan-500/30'
    },
    {
      id: 'chat',
      label: 'Event Chat',
      icon: MessageSquare,
      color: 'text-purple-400',
      activeBg: 'bg-purple-500/15 text-purple-200 border-purple-500/30'
    }
  ];

  // Super-admin only item
  const superAdminNavItem = {
    id: 'super-admin',
    label: 'Super-Admin Fleet',
    icon: ShieldCheck,
    color: 'text-amber-400',
    activeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  };

  const navItems = isOperatorUnlocked
    ? [superAdminNavItem, ...companyNavItems]
    : companyNavItems;

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

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* LEFT SECTION: Platform Brand & Strict Tenant Workspace Scoping */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Platform Logo */}
            <button
              onClick={onGoToLanding}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left"
              title="Return to Public Website"
            >
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: activeTenant?.brandColor || '#4f46e5' }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-white text-base tracking-tight">EventFlow</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-slate-800 text-slate-300 border border-slate-700/60 uppercase">
                    v1.0
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Multi-Tenant Cloud</span>
              </div>
            </button>

            {/* Subtle Divider */}
            <div className="h-6 w-px bg-slate-800 hidden md:block" />

            {/* SCENARIO A: If Super-Admin is unlocked, show the full multi-tenant fleet switcher */}
            {isOperatorUnlocked ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-xs font-semibold text-amber-200 group shadow-sm"
                  title="Switch tenant workspace (Super-Admin Fleet View)"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="max-w-[130px] sm:max-w-[150px] truncate text-white">
                    {activeTenant?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-transform duration-200" />
                </button>

                {/* Dropdown Menu for Super-Admin */}
                {isTenantDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" 
                      onClick={() => setIsTenantDropdownOpen(false)} 
                    />
                    <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs backdrop-blur-xl">
                      <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800 mb-1">
                        <span>Fleet Workspaces</span>
                        <span className="text-slate-500">{tenants.length} Tenants</span>
                      </div>

                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {tenants.map(t => {
                          const isSelected = t.id === activeTenant?.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                onSelectTenant(t.id);
                                setIsTenantDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors text-left ${
                                isSelected 
                                  ? 'bg-amber-500/20 text-white border border-amber-500/30 font-bold' 
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <img
                                  src={t.logoUrl}
                                  alt={t.name}
                                  className="w-6 h-6 rounded-lg object-cover border border-slate-700 shrink-0"
                                />
                                <div className="truncate">
                                  <p className="truncate leading-tight">{t.name}</p>
                                  <p className="text-[10px] font-mono text-slate-400">/{t.slug}</p>
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1.5 mt-1.5 border-t border-slate-800 px-2 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Operator Fleet Switcher</span>
                        <span className="text-amber-400 font-bold">Full Access</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* SCENARIO B: STRICT COMPANY-ONLY ISOLATION
                 When viewing as a company, NO dropdown to other companies is shown.
                 Only this company's isolated, verified workspace badge is displayed. */
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-800 shadow-inner"
                title={`Strictly isolated workspace for ${activeTenant?.name}`}
              >
                <img
                  src={activeTenant?.logoUrl}
                  alt={activeTenant?.name}
                  className="w-5 h-5 rounded-md object-cover border border-slate-700 shrink-0"
                />
                <span className="max-w-[120px] sm:max-w-[150px] truncate text-white text-xs font-bold">
                  {activeTenant?.name}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Isolated
                </span>
              </div>
            )}
          </div>

          {/* CENTER SECTION: Company Scoped Role Navigation */}
          <nav className="flex items-center bg-slate-900/90 border border-slate-800/80 p-1 rounded-2xl shadow-inner gap-0.5 overflow-x-auto max-w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRole === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveRole(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? `${item.activeBg} border shadow-sm font-bold`
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? item.color : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT SECTION: Register Company, Operator Lock/Unlock & System Tools */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Primary Action: Self-Service Register Company Button */}
            <button
              onClick={onOpenCompanyRegistration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              title="Apply or Register a new Company Workspace"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Register Company</span>
              <span className="md:hidden">Register</span>
            </button>

            {/* Sign Out to Website Button */}
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-rose-200 border border-slate-800 transition-colors"
              title="Sign Out to Public Commercial Website"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Sign Out</span>
            </button>

            {/* Operator Lock/Unlock Toggle */}
            {isOperatorUnlocked ? (
              <button
                onClick={handleExitSuperAdmin}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors"
                title="Exit Super-Admin and lock view back to Company mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Exit Operator</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPinModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                title="Platform Operator Super-Admin Login (Protected with PIN)"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden xl:inline">Operator</span>
              </button>
            )}

            {/* Sync Badge if offline queue > 0 */}
            {offlineQueueCount > 0 && (
              <button
                onClick={onSyncOffline}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all animate-bounce"
                title="Sync offline cached check-in scans"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Sync ({offlineQueueCount})</span>
              </button>
            )}

            {/* Offline Mode Toggle */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isOffline
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-900/90 text-emerald-400 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
              }`}
              title={isOffline ? "Offline Check-in Mode Active - click to go online" : "Online - click to simulate offline check-in mode"}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden lg:inline font-bold">Offline</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden lg:inline text-slate-300 font-semibold">Online</span>
                </>
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (window.confirm("Reset all multi-tenant demo data to default?")) {
                  Storage.resetAll();
                }
              }}
              className="p-2 text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>

      {/* Operator PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100">
            <button
              onClick={() => {
                setIsPinModalOpen(false);
                setPinError('');
                setPinInput('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Platform Operator Access</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your administrative PIN to access the multi-tenant fleet control plane.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Enter Operator PIN (Hint: admin123)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-center font-mono text-sm text-white focus:outline-none tracking-widest"
                />
                {pinError && (
                  <p className="text-[11px] text-rose-400 mt-1.5 text-center font-medium">
                    {pinError}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Unlock Super-Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  );
}
