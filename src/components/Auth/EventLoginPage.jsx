import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Moon,
  QrCode,
  ShieldCheck,
  Sun,
  Ticket,
  UserCheck,
} from 'lucide-react';
import { Storage } from '../../data/storage';
import TenantLogo from '../Common/TenantLogo';

/**
 * Dedicated Split-Screen Event Login Page
 * Directly modeled on Multi-School Thesis Repository's login.tsx!
 * Supports 3 login roles inside each dedicated event site:
 *   1. Attendee (Email or Ticket Code -> Digital Ticket, Badge, Certificate, Chat)
 *   2. Check-In Staff (4-digit Station PIN -> High-Speed Check-In Workstation)
 *   3. Event Organizer (Email + Password -> Full Organizer Console & Audit Trail)
 */
export default function EventLoginPage({
  tenant,
  event,
  theme = 'light',
  onToggleTheme,
  onLoginSuccess,
  onContinuePublic,
  onBackToDirectory,
  onOpenTerms,
}) {
  const [roleTab, setRoleTab] = useState('attendee'); // 'attendee' | 'staff' | 'organizer'
  const [attendeeInput, setAttendeeInput] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [orgEmail, setOrgEmail] = useState(tenant?.organizer?.email || '');
  const [orgPassword, setOrgPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const brandShort = tenant?.shortName || tenant?.name || 'EventPlan';
  const brandFull = event?.title || tenant?.name || 'Dedicated Event Portal';

  const sampleAttendees = Storage.getRegistrations(event?.id).slice(0, 3);
  const tenantStaff = Storage.getStaffMembers(tenant?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (roleTab === 'attendee') {
      if (!attendeeInput.trim()) {
        setError('Enter your registered email address or ticket code (e.g. TKT-ACM-1024).');
        return;
      }
      const match = Storage.findAttendeeForLogin(tenant.id, attendeeInput);
      if (!match) {
        setError(`No attendee found matching "${attendeeInput.trim()}" for ${brandShort}. Check your ticket code or register on the public event page.`);
        return;
      }
      Storage.addAuditLog({
        tenantId: tenant.id,
        user: match.name,
        role: 'attendee',
        action: 'ATTENDEE_LOGIN',
        severity: 'info',
        target: `Signed into /${tenant.slug} portal (${match.ticketCode})`,
      });
      onLoginSuccess({
        role: 'attendee',
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        user: match.name,
        email: match.email,
        attendeeId: match.id,
      });
      return;
    }

    if (roleTab === 'staff') {
      if (!staffPin.trim()) {
        setError('Please enter your assigned Check-In Staff PIN (e.g. 1044).');
        return;
      }
      const staffMatch = Storage.authenticateStaff(tenant.id, staffPin);
      if (!staffMatch && staffPin.trim() !== '1044') {
        setError('Invalid Check-In Staff PIN for this event. Ask your Event Organizer or use a demo PIN below.');
        return;
      }
      const resolvedStaff = staffMatch || {
        name: 'Check-In Staff',
        station: 'Desk 1 - Main Entrance',
        role: 'Check-In Scanner',
      };
      Storage.addAuditLog({
        tenantId: tenant.id,
        user: resolvedStaff.name,
        role: 'staff',
        action: 'STAFF_LOGIN',
        severity: 'info',
        target: `Opened Check-In Station (${resolvedStaff.station})`,
      });
      onLoginSuccess({
        role: 'staff',
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        user: resolvedStaff.name,
        station: resolvedStaff.station,
      });
      return;
    }

    // Real Organizer Password Verification via Server API
    if (!orgEmail.trim()) {
      setError('Please enter your organizer work email.');
      return;
    }
    if (!orgPassword.trim()) {
      setError('Please enter your organizer workspace password.');
      return;
    }
    const authRes = await Storage.verifyOrganizerLoginAsync(tenant.id, orgEmail.trim(), orgPassword);
    if (!authRes.ok) {
      setError(authRes.error || 'Invalid organizer email or password.');
      return;
    }
    onLoginSuccess({
      role: 'organizer',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      user: authRes.organizer?.name || tenant?.organizer?.name || orgEmail.trim(),
      email: authRes.organizer?.email || orgEmail.trim(),
    });
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row relative"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Top-right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--fp-sage)',
            color: 'var(--fp-sage-text)',
          }}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* ── LEFT BRANDED EVENT PANEL (44% Desktop, Compact Header on Phone) ── */}
      <div
        className="w-full lg:w-[44%] flex flex-col justify-between p-6 sm:p-8 lg:p-12 relative overflow-hidden lg:min-h-screen"
        style={{ background: 'var(--bg-header)', color: 'var(--header-text)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <TenantLogo tenant={tenant} size={40} className="rounded-xl" />
            <span className="text-base sm:text-lg font-bold tracking-tight truncate">
              {brandShort} Portal
            </span>
          </div>
          <button
            type="button"
            onClick={onContinuePublic}
            className="inline-flex items-center gap-1 text-xs font-semibold opacity-80 hover:opacity-100 shrink-0"
            style={{ background: 'none', border: 'none', color: 'inherit' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Event Page</span>
          </button>
        </div>

        {/* Center Brand Identity Showcase */}
        <div className="flex-1 flex flex-col items-center justify-center py-6 lg:py-8 text-center max-w-sm mx-auto">
          <div
            className="w-28 h-28 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-5 shadow-md overflow-hidden border-4"
            style={{
              background: '#ffffff',
              borderColor: 'rgba(255,255,255,0.85)',
            }}
          >
            {tenant?.logoUrl ? (
              <img src={tenant.logoUrl} alt={brandShort} className="w-full h-full object-contain p-4" />
            ) : (
              <img
                src={tenant?.heroImage && tenant.heroImage !== '/images/hero-summit.jpg' ? tenant.heroImage : '/images/hero-keynote.jpg'}
                alt={brandFull}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span
            className="text-xs font-mono font-bold px-3 py-1 rounded-full mb-2"
            style={{ background: 'rgba(0,0,0,0.08)' }}
          >
            /{tenant?.slug}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight m-0 mb-2" style={{ color: 'inherit' }}>
            {brandFull}
          </h2>
          <p className="text-xs sm:text-sm opacity-90 leading-relaxed m-0" style={{ color: 'inherit' }}>
            {event?.tagline || 'Dedicated event registration, digital ticket pass, check-in station, and delegate community.'}
          </p>
          {event?.venue && (
            <p className="text-xs opacity-75 mt-3 m-0 font-medium" style={{ color: 'inherit' }}>
              {event.venue}
            </p>
          )}
        </div>

        <div className="text-xs opacity-75 font-medium hidden lg:flex items-center justify-between">
          <span>{tenant?.name} · Dedicated Event Website</span>
          <Globe className="w-4 h-4" />
        </div>
      </div>

      {/* ── RIGHT CLEAN LOGIN PANEL ── */}
      <div
        className="flex-1 flex items-center justify-center px-5 py-8 sm:py-12 lg:px-14"
        style={{ background: 'var(--bg-main)' }}
      >
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-6">
            <span className="fp-tag-sage mb-2.5">
              {brandShort} Dedicated Site
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0">
              Sign in to Event
            </h1>
            <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
              Choose your role to access your portal inside <strong>/{tenant?.slug}</strong>.
            </p>
          </div>

          {/* 3-Way Role Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl border mb-6" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
            {[
              { id: 'attendee', label: 'Attendee', icon: Ticket },
              { id: 'staff', label: 'Staff', icon: QrCode },
              { id: 'organizer', label: 'Organizer', icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = roleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setRoleTab(tab.id);
                    setError('');
                  }}
                  className="py-2.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: active ? 'var(--fp-olive)' : 'transparent',
                    color: active ? 'var(--fp-olive-text, #ffffff)' : 'var(--text-muted)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <div
              className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl border text-xs sm:text-sm"
              style={{ background: 'rgba(201,59,43,0.08)', borderColor: 'var(--fp-red)', color: 'var(--fp-red)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {roleTab === 'attendee' && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Registered Email or Ticket Code
                  </label>
                  <input
                    type="text"
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    placeholder="e.g. TKT-ACM-1024 or nana.assyne@gimpa.edu.gh"
                    className="fp-input w-full h-11 px-3.5 text-sm"
                  />
                </div>

                {sampleAttendees.length > 0 && (
                  <div className="p-3 rounded-xl border space-y-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                      Quick Demo Attendee Sign-In:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleAttendees.map((att) => (
                        <button
                          key={att.id}
                          type="button"
                          onClick={() => setAttendeeInput(att.ticketCode)}
                          className="btn-fp-sage px-2.5 py-1 text-[11px] font-mono"
                        >
                          {att.name.split(' ')[0]} · {att.ticketCode}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {roleTab === 'staff' && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Check-In Staff Station PIN
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={staffPin}
                      onChange={(e) => setStaffPin(e.target.value)}
                      placeholder="Enter 4-digit PIN (e.g. 1044)"
                      className="fp-input w-full h-11 pl-10 pr-3.5 text-sm font-mono tracking-widest"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border space-y-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Provisioned Desks (Click to auto-fill PIN):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(tenantStaff.length > 0 ? tenantStaff.slice(0, 3) : [{ id: 'def', name: 'Lead Desk', pin: '1044' }]).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStaffPin(st.pin)}
                        className="btn-fp-sage px-2.5 py-1 text-[11px] font-mono"
                      >
                        {st.name} · PIN {st.pin}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {roleTab === 'organizer' && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Organizer Email Address</label>
                  <input
                    type="email"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder={tenant?.organizer?.email || 'organizer@event.org'}
                    className="fp-input w-full h-11 px-3.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Workspace Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={orgPassword}
                      onChange={(e) => setOrgPassword(e.target.value)}
                      placeholder="Enter workspace password (default: organizer123)"
                      className="fp-input w-full h-11 pl-3.5 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn-fp-olive w-full h-11 text-sm font-bold flex items-center justify-center gap-2 mt-2"
            >
              {roleTab === 'attendee' && <UserCheck className="w-4 h-4" />}
              {roleTab === 'staff' && <QrCode className="w-4 h-4" />}
              {roleTab === 'organizer' && <ShieldCheck className="w-4 h-4" />}
              <span>
                {roleTab === 'attendee' && `Access My ${brandShort} Ticket`}
                {roleTab === 'staff' && `Open Check-In Station`}
                {roleTab === 'organizer' && `Log in to ${brandShort} Console`}
              </span>
            </button>
          </form>

          {/* Public Event Site / Self-Registration Option */}
          <div className="mt-6 pt-5 border-t space-y-2.5 text-center" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={onContinuePublic}
              className="btn-fp-outline w-full h-10 text-xs sm:text-sm"
            >
              Continue to Public Event Page &amp; Register
            </button>
            <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
              By signing in, you agree to our{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="underline font-semibold"
                style={{ color: 'var(--fp-olive)', background: 'none', border: 'none', padding: 0 }}
              >
                Terms &amp; Conditions
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
