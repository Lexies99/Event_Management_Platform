import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Database,
  FileCheck2,
  FileText,
  Globe,
  Lock,
  Menu,
  Moon,
  Printer,
  Shield,
  Smartphone,
  Sun,
  WifiOff,
  X,
} from 'lucide-react';
import { INITIAL_PLANS } from '../../data/mockData';

/* Reusable Geometric Asterisk Icon */
function EditorialAsterisk({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.7132 13.0549L18.4837 0.34996H11.1686L12.955 13.0549C13.4832 12.617 14.1477 12.3773 14.8339 12.3773C15.52 12.3773 16.1845 12.617 16.7127 13.0549H16.7132Z" fill="#5A6552" />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.7132 17.7233L18.4837 30.4131H11.1686L12.955 17.7233C13.4874 18.1518 14.1504 18.3854 14.8339 18.3854C15.5173 18.3854 16.1803 18.1518 16.7127 17.7233H16.7132Z" fill="#5A6552" />
      <path fillRule="evenodd" clipRule="evenodd" d="M17.9567 15.0572L28.1826 7.32636L23.0233 2.15176L15.2925 12.393C15.9752 12.463 16.6129 12.7662 17.0982 13.2515C17.5835 13.7368 17.8867 14.3745 17.9567 15.0572Z" fill="#8FA884" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.6919 18.3067L6.97614 28.5479L1.80206 23.3736L12.0433 15.6424C12.1074 16.3248 12.4066 16.9637 12.8898 17.4497C13.373 17.9357 14.0102 18.2387 14.6921 18.3067H14.6919Z" fill="#8FA884" />
      <path fillRule="evenodd" clipRule="evenodd" d="M17.2946 17.2275L29.9998 19.0142V11.6988L17.2946 13.4722C17.7325 14.0003 17.9721 14.6648 17.9721 15.3509C17.9721 16.037 17.7325 16.7015 17.2946 17.2296V17.2275Z" fill="#DCE7D0" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12.6898 17.2275L3.05176e-05 19.0153V11.6988L12.6898 13.4722C12.2613 14.0046 12.0277 14.6675 12.0277 15.3509C12.0277 16.0343 12.2613 16.6972 12.6898 17.2296V17.2275Z" fill="#DCE7D0" />
      <path fillRule="evenodd" clipRule="evenodd" d="M15.2925 18.3067L23.0233 28.5479L28.1826 23.3736L17.9567 15.6424C17.8893 16.3261 17.5869 16.9653 17.1011 17.4511C16.6153 17.9369 15.9762 18.2392 15.2925 18.3067Z" fill="#A3C6C4" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12.043 15.0572L1.80206 7.32636L6.97614 2.15176L14.6919 12.393C13.2904 12.5315 12.1815 13.6557 12.043 15.0572Z" fill="#A3C6C4" />
    </svg>
  );
}

/* Signature Circular EP Monogram Logo */
function EventPlanMonogram({ size = 44 }) {
  return (
    <svg
      viewBox="0 0 171 171"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}
    >
      <circle cx="85.5" cy="85.5" r="85" fill="#DCE7D0" />
      <path d="M141.776 61.5093C143.944 68.2126 141.146 78.5468 140.517 79.8502C137.16 87.019 130.097 91.674 122.545 91.674C119.887 91.5809 117.23 91.1154 114.712 89.9982L114.013 89.7189C112.265 88.7879 110.447 88.3224 108.558 88.1362C106.67 88.1362 104.852 89.0672 103.453 90.743L103.034 91.2085V117.37H88.0685V52.3854H130.307C135.132 52.1061 139.678 55.737 141.776 61.5093ZM126.391 75.2882C126.95 71.2849 126.741 65.2333 124.083 61.6024C122.335 59.5542 120.027 58.5301 117.649 58.8094C114.153 58.8094 110.447 58.7163 106.6 58.7163H103.034V83.7604L104.642 83.0156C106.041 82.1777 107.649 81.8984 109.188 81.8984C110.936 81.9915 112.754 82.3639 114.433 83.0156L115.901 83.4811C117.16 83.9466 118.489 84.319 119.887 84.4121C123.803 84.4121 125.692 79.9433 126.391 75.2882Z" fill="#182224" />
      <path d="M50.077 60.9507L49.2378 60.4852V80.3157H71.2663V88.1361H49.2378V109.549H78.7489V117.277H33.5033V52.3854H49.7274C51.7554 53.7819 53.9233 54.6198 56.231 54.7129C56.5807 54.806 56.9303 54.806 57.28 54.806C59.1681 54.7129 61.1262 54.4336 62.9444 53.7819C63.364 53.6888 63.9235 53.5026 64.5528 53.3164C66.441 52.6647 68.3991 52.1992 70.3572 52.013C70.9166 51.9199 71.546 51.9199 72.2453 51.9199C74.4132 51.9199 76.5811 52.1061 78.7489 52.4785V60.299C76.5811 59.9266 74.4132 59.7404 72.2453 59.7404C69.7977 59.7404 67.6298 60.299 65.2522 61.0438L64.0633 61.4162C63.9235 61.5093 63.7137 61.5093 63.5039 61.6024C61.4059 62.161 59.238 62.5334 57.0002 62.6265C54.6226 62.6265 52.3148 62.0679 50.077 60.9507Z" fill="#182224" />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'book', label: 'Book Now' },
];

export default function PublicLandingPage({
  tenants = [],
  theme = 'light',
  onToggleTheme,
  onNavigateToEventLogin,
  onNavigateToOnboard,
  onNavigateToPlatformAdmin,
  onOpenTerms,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [portalCode, setPortalCode] = useState('');
  const [portalError, setPortalError] = useState('');

  // Conversational booking form state (from the original official website)
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    location: '',
    venue: '',
    date: '',
    guests: '',
    email: '',
    phone: '',
    acceptedTerms: true,
    submitted: false,
  });

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePortalLookup = (e) => {
    e.preventDefault();
    setPortalError('');
    const raw = portalCode.trim().toLowerCase().replace(/^https?:\/\/[^/]+/, '').replace(/^\/?#?\/?/, '').split('/')[0];
    if (!raw) {
      setPortalError('Enter your organization portal code (e.g. acme) or email.');
      return;
    }
    const match = tenants.find(
      (t) =>
        t.slug.toLowerCase() === raw ||
        (t.organizer?.email || '').toLowerCase() === portalCode.trim().toLowerCase()
    );
    if (!match) {
      setPortalError(`No event portal found for "${portalCode.trim()}". Check the portal code provided by your event organizer.`);
      return;
    }
    setSignInModalOpen(false);
    setPortalCode('');
    onNavigateToEventLogin(match.slug);
  };

  const highlightCards = [
    {
      id: 'hl-1',
      org: 'GlobalTech Africa',
      date: '20–24 Nov 2026',
      title: 'Annual global leadership summit',
      img: '/images/hero-keynote.jpg',
      stripBg: '#DCE7D0',
      stripText: '#1F291E',
    },
    {
      id: 'hl-2',
      org: 'Pan-African Healthcare Council',
      date: '12–16 Nov 2026',
      title: 'Executive healthcare & biotech symposium',
      img: '/images/service-workshop.jpg',
      stripBg: '#A3C6C4',
      stripText: '#142022',
    },
    {
      id: 'hl-3',
      org: 'West Africa FinTech Alliance',
      date: '5–9 Dec 2026',
      title: 'Digital banking & executive gala expo',
      img: '/images/service-gala.jpg',
      stripBg: '#5A6552',
      stripText: '#FFFFFF',
    },
  ];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, submitted: true }));
  };

  return (
    <div className="min-h-screen bg-[#141D1F] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#DCE7D0] selection:text-[#182224]">
      {/* =========================================================================
          1. OFFICIAL HEADER (Responsive Desktop + Mobile Drawer)
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#141D1F]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Left: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/85">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="hover:text-[#DCE7D0] transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Hamburger + Brand */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                className="p-2 rounded-lg border border-white/15 text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="flex items-center gap-2 bg-transparent border-0 p-0"
              >
                <EventPlanMonogram size={36} />
                <span className="font-bold text-base tracking-tight text-white">EventPlan</span>
              </button>
            </div>

            {/* Center: Signature Circular Monogram Logo (Desktop) */}
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="hidden lg:flex items-center justify-center shrink-0 hover:scale-105 transition-transform bg-transparent border-0 p-0 cursor-pointer"
              aria-label="EventPlan Home"
            >
              <EventPlanMonogram size={48} />
            </button>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={onToggleTheme}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-white/15 bg-white/5 text-white/90 hover:bg-white/10 transition-colors"
                title={theme === 'dark' ? 'Switch portal theme to Light Mode' : 'Switch portal theme to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#DCE7D0]" /> : <Moon className="w-3.5 h-3.5 text-[#DCE7D0]" />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortalError('');
                  setSignInModalOpen(true);
                }}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-white/85 hover:text-white transition-colors inline-flex items-center gap-1.5 bg-transparent border-0 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#DCE7D0]" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToOnboard}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#DCE7D0] text-[#182224] hover:bg-[#e8f0df] transition-colors shadow-lg cursor-pointer border-0"
              >
                Let&apos;s plan
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#10181A] px-4 py-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 bg-white/5 border border-white/5"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-2 flex flex-wrap gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToPlatformAdmin();
                }}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold border border-white/15 text-white/85 bg-transparent"
              >
                Platform Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTerms();
                }}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold border border-white/15 text-white/85 bg-transparent"
              >
                Terms &amp; Conditions
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* =========================================================================
            2. HERO SECTION (Full-Bleed Black Corporate Summit + Giant EventPlan)
            ========================================================================= */}
        <section id="home" className="relative pt-14 sm:pt-24 pb-24 sm:pb-36 lg:pb-48 overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero-keynote.jpg"
              alt="Black keynote speaker addressing a corporate summit auditorium"
              className="w-full h-full object-cover object-center brightness-[0.65]"
            />
            <div className="absolute top-0 inset-x-0 h-56 bg-gradient-to-b from-[#141D1F] via-[#141D1F]/85 to-transparent" />
            <div className="absolute inset-0 bg-[#141D1F]/40" />
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#141D1F] via-[#141D1F]/85 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            {/* Top Editorial 2-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start mb-8 sm:mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCE7D0]/15 text-[#DCE7D0] border border-[#DCE7D0]/30 mb-4">
                  Official Corporate Event &amp; Multi-Tenant Check-In Platform
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.1] m-0">
                  Precision planning for<br />perfect corporate events
                </h1>
              </div>
              <div className="flex lg:justify-end lg:pt-8">
                <p className="text-white/85 text-sm sm:text-base lg:text-lg font-normal max-w-xl leading-relaxed m-0">
                  With our expert planning, dedicated branded event websites, sub-second QR check-in, and centered 3.1-inch lanyard badging, every detail is handled so you can focus on your business goals.
                </p>
              </div>
            </div>

            {/* Giant Typographic Statement (Responsive Clamp so Phones Never Overflow) */}
            <div className="relative w-full flex flex-col items-center justify-center pt-2 sm:pt-6">
              <h2
                className="font-extrabold text-center w-full select-none leading-[0.88] tracking-tight bg-gradient-to-b from-white via-[#DCE7D0] to-[#8FA884]/75 bg-clip-text text-transparent m-0 pb-10 sm:pb-16"
                style={{ fontSize: 'clamp(3.25rem, 14.5vw, 15.5rem)' }}
              >
                EventPlan
              </h2>

              {/* Overlapping CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto -mt-4 sm:-mt-8 z-20">
                <button
                  type="button"
                  onClick={() => scrollToSection('book')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-[#182224]/95 border border-[#DCE7D0]/40 hover:border-[#DCE7D0] text-white font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-2xl transition-all cursor-pointer group"
                >
                  <EditorialAsterisk className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                  <span>Request a Quote</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateToOnboard}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-2xl bg-[#DCE7D0] hover:bg-[#e7f0dd] text-[#182224] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-xl transition-colors cursor-pointer border-0"
                >
                  <span>Create Your Event Website</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. "OUR EVENT PLANNING SERVICES" (3-Column Staggered Bento Grid — Black Event Photos)
            ========================================================================= */}
        <section id="services" className="py-16 sm:py-24 bg-[#141D1F] scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DCE7D0] block mb-2">
                Full-Service Execution
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight m-0">
                Our event planning services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Column 1: Team Building + Gala Dinners */}
              <div className="flex flex-col gap-6 lg:gap-8">
                <div
                  onClick={onNavigateToOnboard}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D1315] h-[300px] sm:h-[340px] cursor-pointer shadow-xl border border-white/10"
                >
                  <div className="relative w-full flex-1 min-h-0">
                    <img
                      src="/images/service-workshop.jpg"
                      alt="Black corporate team collaborating in a leadership workshop"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#141D1F]/35 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="py-4 px-5 text-center bg-[#0D1315]">
                    <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#DCE7D0] transition-colors m-0">
                      Team building events
                    </h3>
                  </div>
                </div>

                <div
                  onClick={onNavigateToOnboard}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D1315] h-[320px] lg:h-[430px] cursor-pointer shadow-xl border border-white/10"
                >
                  <div className="relative w-full flex-1 min-h-0">
                    <img
                      src="/images/service-gala.jpg"
                      alt="Black executives networking at a corporate gala dinner"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#141D1F]/35 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="py-4 px-5 text-center bg-[#0D1315]">
                    <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#DCE7D0] transition-colors m-0">
                      Gala dinners
                    </h3>
                  </div>
                </div>
              </div>

              {/* Column 2: Conferences (Centerpiece) + Check-In & Badging */}
              <div className="flex flex-col gap-6 lg:gap-8">
                <div
                  onClick={onNavigateToOnboard}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D1315] h-[340px] lg:h-[470px] cursor-pointer shadow-2xl border border-white/10"
                >
                  <div className="relative w-full flex-1 min-h-0">
                    <img
                      src="/images/hero-keynote.jpg"
                      alt="Pan-African corporate conference keynote stage and audience"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#141D1F]/35 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="py-4 px-5 text-center bg-[#0D1315]">
                    <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#DCE7D0] transition-colors m-0">
                      Conferences &amp; summits
                    </h3>
                  </div>
                </div>

                <div
                  onClick={onNavigateToOnboard}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D1315] h-[300px] cursor-pointer shadow-xl border border-white/10"
                >
                  <div className="relative w-full flex-1 min-h-0">
                    <img
                      src="/images/service-checkin.jpg"
                      alt="Check-in staff scanning an attendee QR badge at a conference desk"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#141D1F]/35 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="py-4 px-5 text-center bg-[#0D1315]">
                    <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#DCE7D0] transition-colors m-0">
                      QR check-in &amp; 3.1&quot; badging
                    </h3>
                  </div>
                </div>
              </div>

              {/* Column 3: Product Launches + Seminars + Custom Branded Websites */}
              <div className="flex flex-col gap-6 lg:gap-8 md:col-span-2 lg:col-span-1">
                <div
                  onClick={onNavigateToOnboard}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D1315] h-[240px] cursor-pointer shadow-xl border border-white/10"
                >
                  <div className="relative w-full flex-1 min-h-0">
                    <img
                      src="/images/service-gala.jpg"
                      alt="Executive product launch evening reception"
                      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#141D1F]/40 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="py-3.5 px-5 text-center bg-[#0D1315]">
                    <h3 className="text-lg lg:text-xl font-bold text-white group-hover:text-[#DCE7D0] transition-colors m-0">
                      Product launches
                    </h3>
                  </div>
                </div>

                <div
                  onClick={onNavigateToOnboard}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D1315] h-[240px] cursor-pointer shadow-xl border border-white/10"
                >
                  <div className="relative w-full flex-1 min-h-0">
                    <img
                      src="/images/service-workshop.jpg"
                      alt="Executive seminar and roundtable breakout session"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#141D1F]/40 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="py-3.5 px-5 text-center bg-[#0D1315]">
                    <h3 className="text-lg lg:text-xl font-bold text-white group-hover:text-[#DCE7D0] transition-colors m-0">
                      Executive seminars
                    </h3>
                  </div>
                </div>

                <div
                  onClick={onNavigateToOnboard}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#0D1315] h-[260px] cursor-pointer shadow-xl border border-white/10"
                >
                  <div className="relative w-full flex-1 min-h-0">
                    <img
                      src="/images/service-checkin.jpg"
                      alt="Dedicated event portal registration desk"
                      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#141D1F]/40 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="py-3.5 px-5 text-center bg-[#0D1315]">
                    <h3 className="text-lg lg:text-xl font-bold text-white group-hover:text-[#DCE7D0] transition-colors m-0">
                      Dedicated event websites
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. "OUR WORK PROCESS" (Staggered Editorial Steps)
            ========================================================================= */}
        <section id="process" className="py-16 sm:py-28 bg-[#0C1214] border-y border-white/10 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-10">
              <div className="lg:col-span-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#DCE7D0] block mb-2">
                  How We Deliver
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1] lg:sticky lg:top-28 m-0">
                  Our work <br className="hidden lg:inline" />process
                </h2>
              </div>

              <div className="lg:col-span-8">
                <div className="group/steplist grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                  {[
                    {
                      num: '01',
                      title: 'Planning',
                      desc: 'Define event goals, attendee tiers, multi-day schedules, and provision your dedicated branded website.',
                      offset: 'xl:pt-0',
                    },
                    {
                      num: '02',
                      title: 'Preparation',
                      desc: 'Configure custom brand colors, registration QR posters, check-in staff PINs, and 3.1-inch lanyard templates.',
                      offset: 'xl:pt-24',
                    },
                    {
                      num: '03',
                      title: 'Execution',
                      desc: 'Run sub-second QR and ticket-code check-in across entrance desks with duplicate detection and instant badge printing.',
                      offset: 'xl:pt-8',
                    },
                    {
                      num: '04',
                      title: 'Evaluation',
                      desc: 'Export complete attendance analytics, verified certificates, and Ghana Act 843 compliant audit trails.',
                      offset: 'xl:pt-24',
                    },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className={`group/step transition-opacity duration-300 sm:group-hover/steplist:opacity-40 hover:!opacity-100 ${step.offset}`}
                    >
                      <span className="text-6xl sm:text-7xl font-extrabold leading-none tracking-tighter bg-gradient-to-b from-[#DCE7D0] to-[#5A6552] bg-clip-text text-transparent select-none block mb-3">
                        {step.num}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover/step:text-[#DCE7D0] transition-colors mb-2 m-0">
                        {step.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed m-0">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. "VISIONARY PLANNING" (3-Column Editorial Spread + 500+ Stat)
            ========================================================================= */}
        <section id="about" className="py-16 sm:py-28 bg-[#141D1F] scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left Column */}
              <div className="lg:col-span-3 md:col-span-6 flex flex-col justify-between gap-6">
                <div className="relative w-full rounded-2xl overflow-hidden h-56 sm:h-64 border border-white/10">
                  <img
                    src="/images/service-gala.jpg"
                    alt="Corporate gala celebration"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#141D1F]/25" />
                </div>
                <div>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6">
                    We specialize in turning visions into reality. With a passion for precision and a commitment to excellence, we bring your corporate events to life with dedicated portals, seamless check-in, and flawless on-site execution.
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateToOnboard}
                    className="px-5 py-3 rounded-xl bg-[#1C282B] border border-[#DCE7D0]/35 hover:border-[#DCE7D0] text-white font-semibold text-sm inline-flex items-center gap-2.5 cursor-pointer group transition-colors"
                  >
                    <EditorialAsterisk className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                    <span>Create Your Event Site</span>
                  </button>
                </div>
              </div>

              {/* Center Column */}
              <div className="lg:col-span-6 md:col-span-12 flex items-center justify-center text-center py-4 order-first md:order-none">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.04] font-extrabold text-white tracking-tight m-0">
                  Visionary <br className="hidden lg:inline" />planning for <br className="hidden lg:inline" />perfect <br className="hidden lg:inline" />corporate<br className="hidden lg:inline" /> events
                </h2>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-3 md:col-span-6 flex flex-col justify-between gap-6">
                <div className="flex justify-start lg:justify-end">
                  <div className="text-left lg:text-right">
                    <h3 className="text-5xl lg:text-6xl font-extrabold text-[#DCE7D0] mb-1 m-0">
                      500+
                    </h3>
                    <p className="text-sm sm:text-base text-white/75 m-0">
                      Successful events planned
                    </p>
                  </div>
                </div>
                <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/5] border border-white/10">
                  <img
                    src="/images/service-workshop.jpg"
                    alt="Executive team planning workshop"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#141D1F]/25" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. "EVENT HIGHLIGHTS" (Sticky Stacking Cards -> Opens Real Event Portals)
            ========================================================================= */}
        <section id="highlights" className="py-16 sm:py-28 bg-[#0C1214] border-t border-white/10 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DCE7D0] block mb-2">
                Featured Productions
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight m-0">
                Event highlights
              </h2>
            </div>

            <div className="flex flex-col gap-10 lg:gap-12">
              {highlightCards.map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => scrollToSection('book')}
                  className="group block rounded-2xl overflow-hidden shadow-2xl cursor-pointer border border-white/10 lg:sticky"
                  style={{ top: `${88 + index * 18}px` }}
                >
                  <div
                    className="py-4 px-5 sm:px-10 grid grid-cols-1 md:grid-cols-3 items-center gap-2 sm:gap-4"
                    style={{ background: card.stripBg, color: card.stripText }}
                  >
                    <div className="text-xs sm:text-sm font-medium hidden md:flex items-center gap-2">
                      <span className="font-bold truncate">{card.org}</span>
                      <span className="w-1.5 h-1.5 rounded-full opacity-60 shrink-0" style={{ background: card.stripText }} />
                      <span className="shrink-0">{card.date}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-left md:text-center m-0">
                      {card.title}
                    </h3>
                    <div className="text-xs sm:text-sm font-bold md:text-right underline underline-offset-4">
                      Plan a similar event &rarr;
                    </div>
                  </div>
                  <div className="relative w-full h-56 sm:h-80 lg:h-[420px] overflow-hidden bg-black">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. CONVERSATIONAL BOOKING FORM (Original Official Website Feature)
            ========================================================================= */}
        <section id="book" className="relative py-16 sm:py-28 overflow-hidden bg-[#141D1F] border-t border-white/10 scroll-mt-16">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/service-gala.jpg"
              alt="Event Booking Backdrop"
              className="w-full h-full object-cover brightness-[0.3]"
            />
            <div className="absolute inset-0 bg-[#141D1F]/80" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-10 sm:mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DCE7D0] block mb-2">
                Start Your Event
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] m-0">
                Book your event<br />with EventPlan
              </h2>
            </div>

            {formState.submitted ? (
              <div className="p-6 sm:p-10 rounded-2xl bg-[#0D1315]/95 border border-[#DCE7D0]/35 max-w-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#DCE7D0] mx-auto" />
                <h3 className="text-2xl font-bold text-white m-0">Your Request Has Been Received!</h3>
                <p className="text-white/80 text-sm sm:text-base m-0">
                  Thank you, <strong className="text-[#DCE7D0]">{formState.name || 'Organizer'}</strong>. Our event team will contact you within 24 hours, or you can launch your dedicated event website right now.
                </p>
                <button
                  type="button"
                  onClick={onNavigateToOnboard}
                  className="mt-2 px-6 py-3 rounded-xl bg-[#DCE7D0] text-[#182224] font-bold text-sm hover:opacity-90 transition-opacity border-0 cursor-pointer"
                >
                  Create Your Dedicated Event Website Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-y-6 sm:gap-y-8 max-w-5xl">
                <div className="flex flex-col md:flex-row flex-wrap md:items-center items-stretch gap-3 sm:gap-4 text-white text-lg sm:text-xl font-bold">
                  <span>Hello, I&apos;m</span>
                  <input
                    type="text"
                    placeholder="Kwame Mensah"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#DCE7D0] focus:outline-none text-white placeholder-white/40 text-sm sm:text-base font-normal px-4 py-2.5 md:min-w-[200px]"
                  />
                  <span>from</span>
                  <input
                    type="text"
                    placeholder="Acme Africa Corp"
                    required
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#DCE7D0] focus:outline-none text-white placeholder-white/40 text-sm sm:text-base font-normal px-4 py-2.5 md:min-w-[180px]"
                  />
                  <span>based in</span>
                  <input
                    type="text"
                    placeholder="Accra, Ghana"
                    required
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#DCE7D0] focus:outline-none text-white placeholder-white/40 text-sm sm:text-base font-normal px-4 py-2.5 md:min-w-[150px]"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-white text-lg sm:text-xl font-bold">
                    and I&apos;d like to plan
                  </span>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs sm:text-sm">
                    {[
                      'Conferences & Summits',
                      'Team Building Events',
                      'Gala Dinners',
                      'Product Launches',
                      'Executive Seminars',
                      'Dedicated Event Portal',
                    ].map((type, idx) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer bg-black/45 hover:bg-black/70 px-3.5 py-2 rounded-xl border border-white/15 transition-colors"
                      >
                        <input type="checkbox" name="event_type" defaultChecked={idx === 0} className="w-4 h-4 rounded accent-[#DCE7D0]" />
                        <span className="text-white/90 font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap md:items-center items-stretch gap-3 sm:gap-4 text-white text-lg sm:text-xl font-bold">
                  <span>at</span>
                  <input
                    type="text"
                    placeholder="Accra International Conference Centre"
                    value={formState.venue}
                    onChange={(e) => setFormState({ ...formState, venue: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#DCE7D0] focus:outline-none text-white placeholder-white/40 text-sm sm:text-base font-normal px-4 py-2.5 md:min-w-[240px]"
                  />
                  <span>on</span>
                  <input
                    type="text"
                    placeholder="dd-mm-yyyy"
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#DCE7D0] focus:outline-none text-white placeholder-white/40 text-sm sm:text-base font-normal px-4 py-2.5 md:min-w-[140px]"
                  />
                  <span>with</span>
                  <input
                    type="text"
                    placeholder="500+"
                    value={formState.guests}
                    onChange={(e) => setFormState({ ...formState, guests: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#DCE7D0] focus:outline-none text-white placeholder-white/40 text-sm sm:text-base font-normal px-4 py-2.5 md:min-w-[100px]"
                  />
                  <span>guests,</span>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap md:items-center items-stretch gap-3 sm:gap-4 text-white text-lg sm:text-xl font-bold">
                  <span>reach me via email at</span>
                  <input
                    type="email"
                    placeholder="hello@company.com"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#DCE7D0] focus:outline-none text-white placeholder-white/40 text-sm sm:text-base font-normal px-4 py-2.5 md:min-w-[220px]"
                  />
                  <span>or phone at</span>
                  <input
                    type="tel"
                    placeholder="+233 24 123 4567"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#DCE7D0] focus:outline-none text-white placeholder-white/40 text-sm sm:text-base font-normal px-4 py-2.5 md:min-w-[180px]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-xl bg-[#DCE7D0] text-[#182224] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 hover:bg-[#e7f0dd] transition-colors border-0 cursor-pointer"
                  >
                    <EditorialAsterisk className="w-5 h-5" />
                    <span>Send Booking Request</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="text-xs text-white/70 hover:text-white underline text-left bg-transparent border-0 cursor-pointer"
                  >
                    View Platform Terms &amp; Conditions (Ghana Act 843)
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* =========================================================================
            8. PACKAGES & PRICING (4 Tiers: Free, Starter, Growth, Enterprise)
            ========================================================================= */}
        <section id="pricing" className="py-16 sm:py-24 bg-[#141D1F] border-t border-white/10 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DCE7D0] block mb-2">
                Flexible Event Packages
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight m-0">
                Choose the package that fits your event
              </h2>
              <p className="text-sm sm:text-base text-white/70 mt-3 mb-0">
                Start free for registration &amp; list exports, or scale up to full check-in, custom badging, and turnkey on-site hardware + operators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {INITIAL_PLANS.map((plan) => {
                const isPopular = Boolean(plan.popular);
                const isEnterprise = plan.id === 'enterprise';
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-6 flex flex-col justify-between gap-6 border transition-all ${
                      isPopular
                        ? 'bg-[#1A2628] border-[#DCE7D0] shadow-2xl'
                        : 'bg-[#0D1315] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl font-extrabold text-white m-0">{plan.name}</h3>
                        {isPopular && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCE7D0] text-[#141D1F] uppercase">
                            Most Popular
                          </span>
                        )}
                        {isEnterprise && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCE7D0]/15 text-[#DCE7D0] border border-[#DCE7D0]/30 uppercase">
                            Printers + Staff
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-white">
                          {plan.priceLabel || `$${plan.price}`}
                        </span>
                        <span className="text-xs text-white/60 ml-1.5">/{plan.billingPeriod}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-white/70 m-0 leading-relaxed">
                        {plan.description}
                      </p>

                      <ul className="space-y-2.5 pt-3 border-t border-white/10 p-0 m-0 list-none text-xs sm:text-sm text-white/85">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#DCE7D0] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={isEnterprise ? () => scrollToSection('book') : onNavigateToOnboard}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-colors border-0 cursor-pointer ${
                        isPopular
                          ? 'bg-[#DCE7D0] text-[#182224] hover:bg-[#e7f0dd]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {plan.id === 'free'
                        ? 'Start Free'
                        : isEnterprise
                        ? 'Book Managed Team'
                        : `Choose ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. MULTI-DESK CHECK-IN & ENTERPRISE SECURITY
            ========================================================================= */}
        <section id="features" className="py-16 sm:py-24 bg-[#0C1214] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-bold text-[#DCE7D0] uppercase tracking-widest block mb-2">
                  Multi-Desk Scanner Coordination
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight m-0">
                  Turn Every Smartphone into a Sub-Second Badge Scanner &amp; 3.1&quot; Tag Station.
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-4 leading-relaxed">
                  Eliminate entrance bottlenecks with simultaneous check-in desks, instant ticket-code lookup, duplicate-entry alerts, and centered 3.1-inch lanyard printing.
                </p>

                <div className="space-y-3.5 mt-6">
                  {[
                    ['Camera QR & Ticket Code Entry:', 'Scan QR codes or enter full/short ticket codes (even the last 4 digits) with instant feedback.'],
                    ['Tamper-Evident Audit Trail:', 'Every check-in, duplicate alert, badge print, and organizer action is logged with timestamps and CSV export.'],
                    ['Offline Queueing & Auto-Sync:', 'Keep scanning if venue Wi-Fi drops; records sync automatically when back online.'],
                  ].map(([title, body]) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-[#DCE7D0]/15 text-[#DCE7D0] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-xs sm:text-sm text-white/80 m-0">
                        <strong className="text-white">{title}</strong> {body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl p-6 sm:p-7 bg-[#141D1F] border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DCE7D0] animate-pulse" />
                    <span className="font-bold text-white text-sm">Simultaneous Desks Active</span>
                  </div>
                  <span className="text-xs font-mono text-[#DCE7D0]">Live Attendance: 88%</span>
                </div>

                <div className="space-y-3 mt-5">
                  {[
                    { desk: 'Desk 1 – Main Gate (Kofi)', count: '142 scans', status: 'Active' },
                    { desk: 'Desk 2 – General Admission (Ama)', count: '119 scans', status: 'Active' },
                    { desk: 'Desk 3 – VIP & Keynotes (Sarah)', count: '48 scans', status: 'Active' },
                    { desk: 'Desk 4 – 3.1" Lanyard Print Desk', count: '33 tags', status: 'Ready' },
                  ].map((item) => (
                    <div key={item.desk} className="flex items-center justify-between gap-2 p-3.5 rounded-xl bg-[#0C1214] border border-white/5 text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Smartphone className="w-4 h-4 text-[#DCE7D0] shrink-0" />
                        <span className="font-medium text-white truncate">{item.desk}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-white/60 hidden sm:inline">{item.count}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#DCE7D0]/15 text-[#DCE7D0]">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-[#141D1F] border border-white/10 space-y-3">
                <Database className="w-7 h-7 text-[#DCE7D0]" />
                <h3 className="text-base font-bold text-white m-0">Isolated Tenant Portals</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed m-0">
                  Every organization receives its own branded event URL, staff roster, attendee registry, and isolated audit history.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-[#141D1F] border border-white/10 space-y-3">
                <FileCheck2 className="w-7 h-7 text-[#A3C6C4]" />
                <h3 className="text-base font-bold text-white m-0">Ghana Act 843 Compliance</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed m-0">
                  Built-in Terms &amp; Conditions and explicit delegate consent capture for attendee portraits, badges, and records.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-[#141D1F] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Printer className="w-7 h-7 text-[#DCE7D0]" />
                  <WifiOff className="w-5 h-5 text-white/50" />
                </div>
                <h3 className="text-base font-bold text-white m-0">3.1&quot; Tags &amp; Offline Sync</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed m-0">
                  Print centered 3.1-inch lanyard tags on thermal rolls or A4/Letter sheets, even during intermittent venue connectivity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          10. OFFICIAL 4-COLUMN FOOTER
          ========================================================================= */}
      <footer className="border-t border-white/10 bg-[#090E10] py-14 text-xs sm:text-sm text-white/65">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <EventPlanMonogram size={38} />
                <span className="font-bold text-white text-lg">EventPlan</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed m-0">
                Precision planning for perfect corporate events. Multi-tenant event websites, QR check-in, audit trails, and centered 3.1-inch badging.
              </p>
            </div>

            <div>
              <p className="font-bold text-white text-sm mb-3">Services</p>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-white bg-transparent border-0 p-0 text-inherit cursor-pointer">Team Building Events</button></li>
                <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-white bg-transparent border-0 p-0 text-inherit cursor-pointer">Conferences &amp; Summits</button></li>
                <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-white bg-transparent border-0 p-0 text-inherit cursor-pointer">Gala Dinners &amp; Launches</button></li>
                <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-white bg-transparent border-0 p-0 text-inherit cursor-pointer">QR Check-In &amp; 3.1&quot; Badging</button></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white text-sm mb-3">Portals &amp; Sign In</p>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setPortalError('');
                      setSignInModalOpen(true);
                    }}
                    className="hover:text-[#DCE7D0] text-left bg-transparent border-0 p-0 text-inherit cursor-pointer"
                  >
                    Sign In to Your Event Portal
                  </button>
                </li>
                <li>
                  <button type="button" onClick={onNavigateToOnboard} className="hover:text-[#DCE7D0] text-left bg-transparent border-0 p-0 text-inherit cursor-pointer">
                    Register a New Event Website
                  </button>
                </li>
                <li>
                  <button type="button" onClick={onNavigateToPlatformAdmin} className="hover:text-[#DCE7D0] text-left bg-transparent border-0 p-0 text-inherit cursor-pointer">
                    Platform Super-Admin Console
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white text-sm mb-3">Compliance &amp; Legal</p>
              <p className="text-xs text-white/70 leading-relaxed mb-3 mt-0">
                ManaMa Technologies · Ghana Data Protection Act 2012 (Act 843) compliant multi-tenant event infrastructure.
              </p>
              <button
                type="button"
                onClick={onOpenTerms}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DCE7D0] hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Terms &amp; Conditions</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="m-0">&copy; 2026 EventPlan · ManaMa Technologies. All rights reserved.</p>
            <div className="flex items-center gap-3 text-white/60">
              <span className="text-[#DCE7D0]">Dedicated Event Websites</span>
              <span>&bull;</span>
              <span>Act 843 Audit Trail</span>
            </div>
          </div>
        </div>
      </footer>
      {/* Private Portal Sign-In Modal (No public list of client portals exposed) */}
      {signInModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSignInModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#141D1F] border border-white/15 p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-white m-0">Access Your Event Portal</h3>
                <p className="text-xs text-white/65 mt-1 mb-0">
                  Enter your organization&apos;s private portal code or organizer email to sign in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSignInModalOpen(false)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 bg-transparent border-0 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePortalLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Event Portal Code or Organizer Email
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/45" />
                  <input
                    type="text"
                    value={portalCode}
                    onChange={(e) => setPortalCode(e.target.value)}
                    placeholder="e.g. acme or nana.assyne@acmetech.io"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#DCE7D0]"
                  />
                </div>
              </div>

              {portalError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200">
                  {portalError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#DCE7D0] text-[#182224] font-bold text-sm hover:bg-[#e7f0dd] transition-colors inline-flex items-center justify-center gap-2 border-0 cursor-pointer"
              >
                <span>Continue to Portal Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSignInModalOpen(false);
                  onNavigateToOnboard();
                }}
                className="text-[#DCE7D0] hover:underline font-semibold bg-transparent border-0 p-0 cursor-pointer"
              >
                Create New Event Website
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignInModalOpen(false);
                  onNavigateToPlatformAdmin();
                }}
                className="text-white/70 hover:text-white inline-flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Platform Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
