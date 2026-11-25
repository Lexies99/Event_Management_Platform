import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Globe,
  MapPin,
  Moon,
  Palette,
  PlusCircle,
  Printer,
  QrCode,
  Search,
  ShieldCheck,
  Sun,
  Users,
} from 'lucide-react';
import { getAccessibleTextColor } from '../../utils/branding';
import TenantLogo from '../Common/TenantLogo';

export default function PublicLandingPage({
  tenants = [],
  events = [],
  theme = 'light',
  onToggleTheme,
  onNavigateToEvent,
  onNavigateToEventLogin,
  onNavigateToOnboard,
  onNavigateToPlatformAdmin,
  onOpenTerms,
}) {
  const [search, setSearch] = useState('');

  const filteredTenants = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter((t) => {
      const ev = events.find((e) => e.tenantId === t.id);
      return (
        t.name.toLowerCase().includes(q) ||
        (t.shortName || '').toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        (ev?.title || '').toLowerCase().includes(q) ||
        (ev?.venue || '').toLowerCase().includes(q)
      );
    });
  }, [tenants, events, search]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* ── TOP HEADER (FinPlanner Sage Bar, Fully Responsive on Phones) ── */}
      <header
        className="sticky top-0 z-50 h-16 px-4 sm:px-8 flex items-center justify-between gap-2 border-b"
        style={{
          background: 'var(--bg-header)',
          borderColor: 'var(--border-header)',
          color: 'var(--header-text)',
        }}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
            style={{ background: 'var(--fp-olive)', color: 'var(--fp-olive-text, #ffffff)' }}
          >
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-bold leading-tight truncate" style={{ color: 'var(--header-text)' }}>
              EventPlan Cloud
            </div>
            <div className="text-[11px] hidden sm:block truncate opacity-75" style={{ color: 'var(--header-text)' }}>
              Multi-Tenant Corporate Event Websites &amp; Check-In SaaS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToPlatformAdmin}
            className="btn-fp-outline px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Platform Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToOnboard}
            className="btn-fp-olive px-3 sm:px-4 py-2 text-xs sm:text-sm inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Register Your Event</span>
            <span className="sm:hidden">Register</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* ── HERO SECTION (FinPlanner Card + Authentic Black Event Photography) ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6">
          <div className="fp-card p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="fp-tag-sage">
                Multi-Tenant Event Cloud Platform
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight m-0">
                One Shared Cloud Platform. A Dedicated Event Website for Every Organization.
              </h1>
              <p className="text-sm sm:text-base leading-relaxed m-0" style={{ color: 'var(--text-muted)' }}>
                Launch a custom-branded portal for your conference, summit, or gala with its own unique web address,
                attendee self-registration, instant QR ticketing, multi-desk check-in, centered 3.1-inch badge printing,
                and full security audit trails.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToOnboard}
                  className="btn-fp-olive px-5 py-3 text-sm inline-flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Your Event Website</span>
                </button>
                {tenants[0] && (
                  <button
                    type="button"
                    onClick={() => onNavigateToEvent(tenants[0].slug)}
                    className="btn-fp-sage px-5 py-3 text-sm inline-flex items-center justify-center gap-2"
                  >
                    <span>Explore {tenants[0].shortName || tenants[0].name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-xl overflow-hidden border aspect-[16/10]" style={{ borderColor: 'var(--border-color)' }}>
                <img
                  src="/images/hero-summit.jpg"
                  alt="African corporate summit keynote speaker and executive audience"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <ShieldCheck className="w-5 h-5 mb-1.5" style={{ color: 'var(--fp-olive)' }} />
                  <div className="font-bold text-xs sm:text-sm">Isolated Portals</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Dedicated tenant data &amp; audit logs
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <Palette className="w-5 h-5 mb-1.5" style={{ color: 'var(--fp-olive)' }} />
                  <div className="font-bold text-xs sm:text-sm">Custom Branding</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Logo, colors &amp; WCAG contrast checks
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <Printer className="w-5 h-5 mb-1.5" style={{ color: 'var(--fp-olive)' }} />
                  <div className="font-bold text-xs sm:text-sm">3.1&quot; Tag Printing</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Centered thermal &amp; lanyard badges
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACTIVE DEDICATED EVENT WEBSITES DIRECTORY (Exact Thesis-Repo Pattern!) ── */}
        <section id="directory" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold m-0">Active Event Websites &amp; Portals</h2>
              <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
                Select an event to open its dedicated branded website, register as a delegate, or sign in as organizer, staff, or attendee.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events or organizations..."
                className="fp-input w-full pl-9 pr-3 py-2.5 text-sm"
              />
            </div>
          </div>

          {filteredTenants.length === 0 ? (
            <div className="fp-card p-10 text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <div className="font-bold text-base">No matching event portals found</div>
              <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Want to host your event on EventPlan Cloud? Create your dedicated website in under 2 minutes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTenants.map((tenant) => {
                const ev = events.find((e) => e.tenantId === tenant.id);
                const primary = tenant.primaryColor || tenant.brandColor || '#5A6552';
                const secondary = tenant.secondaryColor || '#DCE7D0';
                const accent = tenant.accentColor || '#3B7A57';
                const primaryText = getAccessibleTextColor(primary);
                const secondaryText = getAccessibleTextColor(secondary);

                return (
                  <div
                    key={tenant.id}
                    className="fp-card overflow-hidden flex flex-col justify-between"
                  >
                    {/* Branded Top Banner Strip */}
                    <div
                      className="p-4 border-b flex items-center gap-3.5"
                      style={{
                        background: secondary,
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <TenantLogo tenant={tenant} size={44} className="rounded-xl" />
                      <div className="min-w-0 flex-1">
                        <div
                          className="font-extrabold text-base truncate"
                          style={{ color: secondaryText }}
                        >
                          {tenant.shortName || tenant.name}
                        </div>
                        <div
                          className="text-xs font-mono truncate opacity-80"
                          style={{ color: secondaryText }}
                        >
                          /{tenant.slug}
                        </div>
                      </div>
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0"
                        style={{
                          background: primary,
                          color: primaryText,
                        }}
                      >
                        {tenant.status === 'active' ? 'Live' : 'Paused'}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
                      <div>
                        <div className="font-bold text-sm sm:text-base leading-snug">
                          {ev?.title || tenant.name}
                        </div>
                        <div className="text-xs mt-1 space-y-1" style={{ color: 'var(--text-muted)' }}>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{ev?.venue || tenant.address || 'Conference Centre'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {ev?.startsAt
                                ? new Date(ev.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Upcoming 2026'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Brand Palette Dots */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ background: primary }} title={`Primary ${primary}`} />
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ background: secondary }} title={`Secondary ${secondary}`} />
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ background: accent }} title={`Accent ${accent}`} />
                        <span className="text-[11px] ml-1 truncate" style={{ color: 'var(--text-muted)' }}>
                          Host: {tenant.organizer?.name}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto pt-2">
                        <button
                          type="button"
                          onClick={() => onNavigateToEvent(tenant.slug)}
                          className="flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                          style={{
                            background: primary,
                            color: primaryText,
                            border: 'none',
                          }}
                        >
                          <span>Open Event Site</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigateToEventLogin(tenant.slug)}
                          className="btn-fp-outline py-2.5 px-3.5 text-xs sm:text-sm shrink-0"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── VISUAL EVENT SOLUTIONS GALLERY (Featuring Authentic Black Corporate Photography) ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-6">
            <span className="fp-tag-sage mb-2">Built for Modern African &amp; Global Events</span>
            <h2 className="text-xl sm:text-2xl font-extrabold m-0">
              End-to-End Event Execution From Registration to Badge Print
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                img: '/images/service-checkin.jpg',
                icon: QrCode,
                title: 'Sub-Second QR Check-In & 3.1" Badges',
                desc: 'Enter ticket codes or scan delegate QR passes across multiple entrance desks with instant duplicate detection and centered 3.1-inch lanyard tags.',
              },
              {
                img: '/images/service-gala.jpg',
                icon: Users,
                title: 'Executive Galas & VIP Summits',
                desc: 'Deliver a white-labelled event portal with multi-day pass tiers, attendance-gated community chat, and verified certificates of attendance.',
              },
              {
                img: '/images/service-workshop.jpg',
                icon: CheckCircle2,
                title: 'Leadership Workshops & Audit Trails',
                desc: 'Every registration, scan, badge print, and staff action is recorded in a tamper-evident audit trail compliant with Ghana Data Protection Act 843.',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="fp-card overflow-hidden flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--fp-olive)' }} />
                      <h3 className="text-base font-bold m-0">{card.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed m-0" style={{ color: 'var(--text-muted)' }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── CLEAN FINPLANNER FOOTER WITH TERMS & CONDITIONS ── */}
      <footer className="border-t py-8 px-4 sm:px-6" style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-bold" style={{ color: 'var(--text-main)' }}>EventPlan Cloud</span>
            <span>·</span>
            <span>ManaMa Technologies · Ghana Act 843 Compliant</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onNavigateToOnboard}
              className="hover:underline font-medium"
              style={{ color: 'var(--fp-olive)', background: 'none', border: 'none' }}
            >
              Register Event
            </button>
            <button
              type="button"
              onClick={onNavigateToPlatformAdmin}
              className="hover:underline font-medium"
              style={{ color: 'var(--fp-olive)', background: 'none', border: 'none' }}
            >
              Platform Admin
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              className="hover:underline font-semibold inline-flex items-center gap-1"
              style={{ color: 'var(--text-main)', background: 'none', border: 'none' }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms &amp; Conditions</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
