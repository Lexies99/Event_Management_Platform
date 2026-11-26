import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  LogIn,
  MapPin,
  QrCode,
  ShieldCheck,
  Ticket,
  Users,
} from 'lucide-react';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';
import { generateQrDataUrl } from '../../utils/qr';
import { getPlanEntitlements } from '../../utils/plans';
import TenantLogo from '../Common/TenantLogo';

/**
 * Dedicated Event Website Home / Overview Screen (inside /#/:slug)
 * Gives every registered organization a crisp branded public portal
 * with a live scannable Registration QR Code right on their event website.
 */
export default function EventOverviewPanel({
  tenant,
  event,
  registrationsCount = 0,
  onGoToRegister,
  onGoToLogin,
  onGoToTicket,
  isAuthenticated,
}) {
  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;
  const plan = getPlanEntitlements(tenant?.planId);
  const registrationUrl = `${window.location.origin}/#/${tenant?.slug}/register`;
  const [regQrUrl, setRegQrUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tenant?.slug) return;
    generateQrDataUrl(registrationUrl, {
      width: 240,
      margin: 1,
      darkColor: '#1a1d1a',
      lightColor: '#ffffff',
    }).then((url) => setRegQrUrl(url));
  }, [registrationUrl, tenant?.slug]);

  const heroSrc =
    tenant?.heroImage && tenant.heroImage !== '/images/hero-summit.jpg'
      ? tenant.heroImage
      : '/images/hero-keynote.jpg';

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!regQrUrl) return;
    const a = document.createElement('a');
    a.href = regQrUrl;
    a.download = `${tenant?.slug || 'event'}-register-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6">
      {/* Branded Event Hero Card */}
      <div className="fp-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <TenantLogo tenant={tenant} size={46} className="rounded-xl" />
                <div>
                  <span className="fp-tag-sage text-[11px]">Dedicated Event Website · /{tenant?.slug}</span>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Hosted by {tenant?.name}
                  </div>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold m-0 leading-tight">
                {event?.title}
              </h1>
              <p className="text-sm sm:text-base m-0 leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                {event?.tagline}
              </p>
              <p className="text-xs sm:text-sm m-0 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {event?.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={onGoToRegister}
                className="btn-fp-olive px-5 py-3 text-sm inline-flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Register for This Event</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isAuthenticated ? (
                plan.canIssueDigitalTickets && (
                  <button
                    type="button"
                    onClick={onGoToTicket}
                    className="btn-fp-sage px-5 py-3 text-sm inline-flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Open My Digital Ticket</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="btn-fp-outline px-5 py-3 text-sm inline-flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In (Attendee / Staff / Organizer)</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[220px] lg:min-h-full relative border-t lg:border-t-0 lg:border-l" style={{ borderColor: 'var(--border-color)' }}>
            <img
              src={heroSrc}
              alt={event?.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Key Logistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="fp-card p-4 sm:p-5 flex items-start gap-3">
          <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--fp-olive)' }} />
          <div>
            <div className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Venue</div>
            <div className="text-sm font-bold mt-0.5">{event?.venue}</div>
          </div>
        </div>
        <div className="fp-card p-4 sm:p-5 flex items-start gap-3">
          <Calendar className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--fp-olive)' }} />
          <div>
            <div className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Dates</div>
            <div className="text-sm font-bold mt-0.5">
              {new Date(event?.startsAt || '2026-11-20T09:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — {eventDays.length} Days
            </div>
          </div>
        </div>
        <div className="fp-card p-4 sm:p-5 flex items-start gap-3">
          <Users className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--fp-olive)' }} />
          <div>
            <div className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Delegates &amp; Capacity</div>
            <div className="text-sm font-bold mt-0.5">
              {registrationsCount} registered · {event?.capacity || 500} max seats
            </div>
          </div>
        </div>
      </div>

      {/* Scan to Register QR Code Section (Directly on Event Website) */}
      <div className="fp-card p-5 sm:p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="p-3 bg-white rounded-2xl border-2 border-dashed shrink-0 text-center" style={{ borderColor: 'var(--border-color)' }}>
          {regQrUrl ? (
            <img src={regQrUrl} alt={`Scan to register for ${event?.title}`} className="w-36 h-36 sm:w-40 sm:h-40 mx-auto" />
          ) : (
            <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
              <QrCode className="w-10 h-10 opacity-30" />
            </div>
          )}
          <div className="text-[10px] font-mono font-bold text-slate-700 mt-1.5">SCAN TO REGISTER</div>
        </div>

        <div className="flex-1 min-w-0 space-y-2.5 text-center md:text-left">
          <span className="fp-tag-sage text-[11px]">Instant Mobile Registration</span>
          <h2 className="text-lg sm:text-xl font-extrabold m-0">
            Scan QR Code to Register on Your Phone
          </h2>
          <p className="text-xs sm:text-sm m-0 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Point any smartphone camera at this QR code to open the {tenant?.shortName || tenant?.name} registration form, receive your instant QR ticket code, and print your 3.1-inch lanyard tag at check-in.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Registration Link Copied' : 'Copy Registration Link'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadQr}
              className="btn-fp-sage px-3.5 py-2 text-xs inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR PNG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Day Program Schedule */}
      <div className="fp-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold m-0">Event Program &amp; Multi-Day Schedule</h2>
            <p className="text-xs sm:text-sm m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Choose a Full Week Pass, 3-Day Bundle, or Custom Days when you register.
            </p>
          </div>
          <span className="fp-tag-sage">{eventDays.length} Scheduled Days</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {eventDays.map((day, idx) => (
            <div key={day.id} className="p-3.5 rounded-xl border space-y-1.5" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <span className="fp-tag-olive text-[10px] py-0.5 px-2">Day {idx + 1}</span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{day.date}</span>
              </div>
              <div className="font-bold text-xs sm:text-sm leading-snug pt-1">
                {day.name.split(' - ')[1] || day.name}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{day.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What Delegates Get */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: QrCode, title: 'Instant QR Ticket Pass', desc: 'Get a digital QR code pass immediately upon registration for fast gate entry.' },
          { icon: CheckCircle2, title: 'Centered 3.1" Lanyard Tag', desc: 'Print-ready 3.1-inch lanyard tags produced on-site at our multi-desk check-in stations.' },
          { icon: ShieldCheck, title: 'Ghana Act 843 Protected', desc: 'Your details and photo stay strictly inside this event workspace with full audit logging.' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="fp-card p-4 space-y-1.5">
              <Icon className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
              <div className="font-bold text-sm">{item.title}</div>
              <p className="text-xs m-0 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
