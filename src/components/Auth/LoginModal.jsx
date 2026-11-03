import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  KeyRound, 
  AlertCircle 
} from 'lucide-react';

/* Authentic Circular Monogram Logo with Controlled Dimensions */
function EventPlanMonogram({ className = "" }) {
  return (
    <svg 
      viewBox="0 0 171 171" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
      style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}
    >
      <circle cx="85.5" cy="85.5" r="85" fill="#F3EFFF"/>
      <path d="M141.776 61.5093C143.944 68.2126 141.146 78.5468 140.517 79.8502C137.16 87.019 130.097 91.674 122.545 91.674C119.887 91.5809 117.23 91.1154 114.712 89.9982L114.013 89.7189C112.265 88.7879 110.447 88.3224 108.558 88.1362C106.67 88.1362 104.852 89.0672 103.453 90.743L103.034 91.2085V117.37H88.0685V52.3854H130.307C135.132 52.1061 139.678 55.737 141.776 61.5093ZM126.391 75.2882C126.95 71.2849 126.741 65.2333 124.083 61.6024C122.335 59.5542 120.027 58.5301 117.649 58.8094C114.153 58.8094 110.447 58.7163 106.6 58.7163H103.034V83.7604L104.642 83.0156C106.041 82.1777 107.649 81.8984 109.188 81.8984C110.936 81.9915 112.754 82.3639 114.433 83.0156L115.901 83.4811C117.16 83.9466 118.489 84.319 119.887 84.4121C123.803 84.4121 125.692 79.9433 126.391 75.2882Z" fill="#1A1A19"/>
      <path d="M50.077 60.9507L49.2378 60.4852V80.3157H71.2663V88.1361H49.2378V109.549H78.7489V117.277H33.5033V52.3854H49.7274C51.7554 53.7819 53.9233 54.6198 56.231 54.7129C56.5807 54.806 56.9303 54.806 57.28 54.806C59.1681 54.7129 61.1262 54.4336 62.9444 53.7819C63.364 53.6888 63.9235 53.5026 64.5528 53.3164C66.441 52.6647 68.3991 52.1992 70.3572 52.013C70.9166 51.9199 71.546 51.9199 72.2453 51.9199C74.4132 51.9199 76.5811 52.1061 78.7489 52.4785V60.299C76.5811 59.9266 74.4132 59.7404 72.2453 59.7404C69.7977 59.7404 67.6298 60.299 65.2522 61.0438L64.0633 61.4162C63.9235 61.5093 63.7137 61.5093 63.5039 61.6024C61.4059 62.161 59.238 62.5334 57.0002 62.6265C54.6226 62.6265 52.3148 62.0679 50.077 60.9507Z" fill="#1A1A19"/>
    </svg>
  );
}

export default function LoginModal({
  isOpen,
  onClose,
  tenants = [],
  onLoginCompany,
  onLoginSuperAdmin,
  onOpenRegisterCompany
}) {
  const [authType, setAuthType] = useState('company'); // 'company' | 'admin'

  // Company login state
  const [selectedTenantSlug, setSelectedTenantSlug] = useState(tenants[0]?.slug || 'acme');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');
  const [companyError, setCompanyError] = useState('');

  // System admin login state
  const [adminEmail, setAdminEmail] = useState('admin@eventflow.cloud');
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    setCompanyError('');

    const targetTenant = tenants.find(t => t.slug === selectedTenantSlug);
    if (!targetTenant) {
      setCompanyError("Company workspace not found. Please select a valid company.");
      return;
    }

    onLoginCompany(targetTenant);
    onClose();
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setAdminError('');

    if (adminPin === 'admin123' || adminPin === 'admin') {
      onLoginSuperAdmin();
      onClose();
    } else {
      setAdminError("Incorrect System Administrator PIN. (Hint: admin123)");
    }
  };

  const handleQuickTenantLogin = (tenant) => {
    onLoginCompany(tenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* Iridescent Border Container: Increased width to max-w-2xl */}
      <div className="relative w-full max-w-xl sm:max-w-2xl bg-gradient-to-br from-[#AB6088] via-[#FB9378] to-[#E0C97E] p-[1.5px] rounded-3xl shadow-[0_0_60px_rgba(251,147,120,0.3)] my-6">
        
        {/* Modal Interior with Warm #1a1a19 Editorial Background */}
        <div className="relative w-full bg-[#1a1a19] rounded-[22.5px] p-6 sm:p-10 text-white flex flex-col">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header with Controlled Monogram */}
          <div className="text-center mb-7">
            <div className="flex items-center justify-center mx-auto mb-3.5">
              <EventPlanMonogram />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              EventPlan Sign In
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-1 font-normal max-w-md mx-auto">
              Access your company&apos;s event workspace or the platform administrator fleet.
            </p>
          </div>

          {/* Dual Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/60 rounded-2xl border border-white/10 mb-7 max-w-md mx-auto w-full">
            <button
              type="button"
              onClick={() => {
                setAuthType('company');
                setCompanyError('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-display transition-all cursor-pointer ${
                authType === 'company'
                  ? 'bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black shadow-lg font-extrabold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthType('admin');
                setAdminError('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-display transition-all cursor-pointer ${
                authType === 'admin'
                  ? 'bg-gradient-to-r from-[#E0C97E] to-[#FCF8B3] text-black shadow-lg font-extrabold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>System Admin</span>
            </button>
          </div>

          {/* TAB 1: COMPANY / ORGANIZER LOGIN */}
          {authType === 'company' && (
            <form onSubmit={handleCompanySubmit} className="space-y-5">
              
              {/* Company Workspace Select */}
              <div>
                <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-2">
                  Select Your Company Workspace
                </label>
                <select
                  value={selectedTenantSlug}
                  onChange={(e) => setSelectedTenantSlug(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 focus:border-[#E0C97E] rounded-xl px-4 py-3.5 text-sm sm:text-base text-white focus:outline-none cursor-pointer transition-colors"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.slug} className="bg-[#1a1a19] text-white">
                      {t.name} (/{t.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Organizer Email */}
              <div>
                <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-2">
                  Organizer Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-4 top-4" />
                  <input
                    type="email"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    placeholder="e.g. alex.rivera@acme.com (or leave blank for demo)"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E0C97E] rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-white focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Password / Access PIN */}
              <div>
                <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-2">
                  Workspace Password or PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-white/40 absolute left-4 top-4" />
                  <input
                    type="password"
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    placeholder="•••••••• (Any password for demo)"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E0C97E] rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-white focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>
              </div>

              {companyError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{companyError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] hover:opacity-95 text-black font-extrabold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Enter Company Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Demo Accounts */}
              <div className="pt-5 border-t border-white/10">
                <span className="text-[10px] sm:text-xs font-bold font-display text-white/50 uppercase tracking-wider block mb-3 text-center">
                  Instant 1-Click Demo Accounts:
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {tenants.slice(0, 3).map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleQuickTenantLogin(t)}
                      className="p-3 rounded-xl bg-black/50 hover:bg-black/90 border border-white/10 hover:border-[#E0C97E]/50 text-left transition-all cursor-pointer group"
                    >
                      <p className="text-xs font-bold text-white group-hover:text-[#E0C97E] truncate transition-colors">
                        {t.name}
                      </p>
                      <p className="text-[10px] text-[#FB9378]/70 truncate font-mono mt-0.5">
                        /{t.slug}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center pt-2">
                <p className="text-xs sm:text-sm text-white/60">
                  New company?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRegisterCompany();
                    }}
                    className="text-[#E0C97E] hover:text-[#FCF8B3] font-bold underline cursor-pointer transition-colors"
                  >
                    Register your company workspace
                  </button>
                </p>
              </div>

            </form>
          )}

          {/* TAB 2: SYSTEM SUPER-ADMIN LOGIN */}
          {authType === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-5">
              
              <div className="p-4 bg-[#E0C97E]/10 border border-[#E0C97E]/25 rounded-2xl text-xs sm:text-sm text-[#E0C97E] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-0.5 font-display text-sm">Platform Operator Control Plane</p>
                  <p className="text-white/70 text-xs">
                    Restricted to platform administrators. Controls all rented corporate tenants, billing, and system fleet health.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-2">
                  Platform Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-4 top-4" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E0C97E] rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-2">
                  Super-Admin Master Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-white/40 absolute left-4 top-4" />
                  <input
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter security PIN (hint: admin123)"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E0C97E] rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-white focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>
              </div>

              {adminError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E0C97E] to-[#FCF8B3] hover:opacity-95 text-black font-extrabold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Authorize Operator Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-black/50 border border-white/10 rounded-xl text-center text-xs text-white/60">
                <span>Demo Super-Admin PIN: </span>
                <code className="text-[#E0C97E] font-mono font-bold">admin123</code>
              </div>

            </form>
          )}

        </div>
      </div>

    </div>
  );
}
