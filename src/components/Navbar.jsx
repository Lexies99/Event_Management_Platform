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
  Radio
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
  onSyncOffline
}) {
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
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

  const navItems = [
    {
      id: 'super-admin',
      label: 'Super-Admin',
      icon: ShieldCheck,
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
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

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* LEFT SECTION: Platform Brand & Tenant Workspace Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Platform Logo */}
            <div className="flex items-center gap-2.5">
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
            </div>

            {/* Subtle Divider */}
            <div className="h-6 w-px bg-slate-800 hidden md:block" />

            {/* Tenant Workspace Dropdown (Custom sleek design) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-slate-200 group shadow-sm"
                title="Switch active company workspace"
              >
                <img
                  src={activeTenant?.logoUrl}
                  alt={activeTenant?.name}
                  className="w-5 h-5 rounded-md object-cover border border-slate-700 shrink-0"
                />
                <span className="max-w-[130px] sm:max-w-[160px] truncate text-white">
                  {activeTenant?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200" />
              </button>

              {/* Dropdown Menu */}
              {isTenantDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" 
                    onClick={() => setIsTenantDropdownOpen(false)} 
                  />
                  <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs backdrop-blur-xl">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800 mb-1">
                      <span>Company Workspaces</span>
                      <span className="text-slate-500">{tenants.length} Tenants</span>
                    </div>

                    <div className="space-y-1">
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
                                ? 'bg-indigo-600/20 text-white border border-indigo-500/30 font-bold' 
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
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 mt-1.5 border-t border-slate-800 px-2 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Multi-tenant data isolated</span>
                      <span className="text-emerald-400">RLS Active</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CENTER SECTION: Unified Role Navigation Pill Container */}
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

          {/* RIGHT SECTION: Online/Offline Mode, Sync Badge & Demo Reset */}
          <div className="flex items-center gap-2 shrink-0">
            
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

            {/* Offline Simulation toggle */}
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
    </header>
  );
}
