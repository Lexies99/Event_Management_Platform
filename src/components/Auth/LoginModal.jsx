import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  Sparkles,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function LoginModal({
  isOpen,
  onClose,
  tenants,
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

    // Authenticate and log in
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

  // Quick 1-click preset login
  const handleQuickTenantLogin = (tenant) => {
    onLoginCompany(tenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-6 text-slate-100 flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">EventFlow Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your company's event workspace or the platform administrator fleet.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthType('company');
              setCompanyError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authType === 'company'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
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
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authType === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>System Admin</span>
          </button>
        </div>

        {/* TAB 1: COMPANY / ORGANIZER LOGIN */}
        {authType === 'company' && (
          <form onSubmit={handleCompanySubmit} className="space-y-4">
            
            {/* Company Workspace Select */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Your Company Workspace
              </label>
              <select
                value={selectedTenantSlug}
                onChange={(e) => setSelectedTenantSlug(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-pointer"
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.slug} className="bg-slate-900 text-white">
                    {t.name} (/{t.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Organizer Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Organizer Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="e.g. alex.rivera@acme.com (or leave blank for demo)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Password / Access PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Workspace Password or PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={companyPassword}
                  onChange={(e) => setCompanyPassword(e.target.value)}
                  placeholder="•••••••• (Any password for demo)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {companyError && (
              <p className="text-xs text-rose-400 font-semibold">{companyError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Company Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 1-Click Demo Company Logins */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
                Instant 1-Click Demo Accounts:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {tenants.slice(0, 3).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleQuickTenantLogin(t)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
                  >
                    <p className="text-[11px] font-bold text-white truncate">{t.name}</p>
                    <p className="text-[9px] text-slate-400 truncate">/{t.slug}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Register link */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                New company?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegisterCompany();
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                >
                  Register your company workspace
                </button>
              </p>
            </div>

          </form>
        )}

        {/* TAB 2: SYSTEM SUPER-ADMIN LOGIN */}
        {authType === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Platform Operator Control Plane</p>
                <p className="text-slate-300 text-[11px]">
                  Restricted to platform administrators. Controls all rented corporate tenants, billing, and system fleet health.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                System Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Master Security Passcode / PIN *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  autoFocus
                  required
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter Master PIN (Hint: admin123)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            {adminError && (
              <p className="text-xs text-rose-400 font-semibold">{adminError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In to System Super-Admin</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
