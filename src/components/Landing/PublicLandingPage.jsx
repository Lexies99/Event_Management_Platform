import React from 'react';
import { 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  QrCode, 
  Users, 
  UserCheck, 
  Printer, 
  Clock, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Zap, 
  Lock, 
  Globe, 
  Smartphone,
  ChevronRight,
  ExternalLink,
  Laptop,
  Check,
  Database,
  FileCheck2,
  KeyRound,
  WifiOff
} from 'lucide-react';

export default function PublicLandingPage({
  onOpenLogin,
  onOpenRegisterCompany,
  tenants = []
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. PUBLIC WEBSITE HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xl tracking-tight">EventFlow</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase">
                    Cloud
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Enterprise Event Management Platform</span>
              </div>
            </a>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#multidesk" className="hover:text-white transition-colors">Multi-Desk Check-In</a>
              <a href="#security" className="hover:text-white transition-colors">Security & RLS</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a>
            </nav>

            {/* Auth Actions: Log In & Register Company */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={onOpenRegisterCompany}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Register Company</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow backdrop circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 shadow-inner animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>CLOUD-HOSTED MULTI-TENANT EVENT SYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Run Flawless Conferences with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">Sub-Second Check-In.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Rent an isolated corporate event workspace. Empower attendees to register remotely with photos, deploy multiple mobile check-in desks, and print photo badges automatically on arrival.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={onOpenRegisterCompany}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-sm shadow-2xl shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Register Your Company Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Changed from demo launcher to direct scroll to #pricing */}
            <a
              href="#pricing"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>View Pricing Plans</span>
            </a>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-10 border-t border-slate-800/80">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">&lt; 0.85s</p>
              <p className="text-xs text-slate-400 mt-0.5">Average Optical Scan Speed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Row-Level Security Isolation</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">Unlimited</p>
              <p className="text-xs text-slate-400 mt-0.5">Simultaneous Check-In Desks</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400">Act 843</p>
              <p className="text-xs text-slate-400 mt-0.5">Data Privacy Compliant</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURES SECTION (with id="features" for smooth scroll) */}
      <section id="features" className="py-20 bg-slate-950/70 border-y border-slate-800/60 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">
              End-to-End Conference Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powerful Features Engineered for Event Success
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From remote photo capture to instant badging and attendance-gated chat, everything runs in a single high-performance cloud deployment.
            </p>
          </div>

          {/* 6 Feature Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 shadow-inner">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Remote Attendee Registration</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Attendees register remotely from their phone or PC, take or upload their photo badge portrait, and receive an instant QR code entry ticket.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>Duplicate Email Detection</span>
                <span>Active</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 shadow-inner">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sub-Second Optical QR Scanner</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Optical camera scanner targets under 0.85s processing time with immediate duplicate entry detection and acoustic confirmation.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span>Target &lt; 0.85s Processing</span>
                <span>Verified</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 shadow-inner">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Thermal Badge Printing</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clean badge printing stylesheets formatted for thermal and standard badge paper. Displays photo, category banner, QR, and company branding.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-indigo-400">
                <span>Thermal & A4 Formats</span>
                <span>Supported</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 shadow-inner">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Attendance-Gated Live Chat</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time event community chat strictly gated to attendees who physically scanned into the venue. Pin announcements and moderate messages.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-purple-400">
                <span>Physical Attendance Gate</span>
                <span>Enforced</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 shadow-inner">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live Hourly Arrival Analytics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time check-in velocity and turnout percentage gauges. Categorizes general attendees, VIPs, speakers, sponsors, and press with 1-click CSV export.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-amber-400">
                <span>CSV / Excel Export</span>
                <span>1-Click</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 shadow-inner">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Registration QR Entrance Signs</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate print-ready 8.5x11 / A4 entrance flyers with high-contrast QR codes. Place on check-in tables so attendees scan to register in seconds.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>Printable Flyer Generator</span>
                <span>Included</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. MULTI-DESK CHECK-IN EXPLAINER (with id="multidesk") */}
      <section id="multidesk" className="py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>ON-SITE VOLUNTEER & ADMIN COORDINATION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Turn Every Smartphone into a High-Speed Wireless Badge Scanner.
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                Large events cannot afford entrance bottlenecks. EventFlow lets you coordinate multiple entrance desks (Desk 1, Desk 2, VIP Gate) with zero software to install.
              </p>

              <div className="space-y-3.5 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>1-Scan Staff Mobile Onboarding:</strong> Event ushers scan the organizer's screen to open the camera scanner instantly on their personal phones.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Duplicate Scan Alerts:</strong> If a delegate attempts to reuse a ticket at another desk, the system alerts the usher immediately with previous timestamp.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Offline Check-In Queue:</strong> Continues scanning attendees even if on-site Wi-Fi drops, auto-syncing when internet restores.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Station Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white text-xs">Simultaneous Desks Active</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">Live Attendance: 88%</span>
              </div>

              <div className="space-y-3 mt-4">
                {[
                  { desk: "Desk 1 – Main Gate (Kofi)", count: "142 scans", status: "Active" },
                  { desk: "Desk 2 – General Admission (Ama)", count: "119 scans", status: "Active" },
                  { desk: "Desk 3 – VIP & Keynotes (Sarah)", count: "48 scans", status: "Active" },
                  { desk: "Desk 4 – Fast Track QR", count: "33 scans", status: "Active" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">{item.desk}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400">{item.count}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECURITY & RLS SECTION (with id="security" for smooth scroll) */}
      <section id="security" className="py-20 bg-slate-900/50 border-t border-slate-800/60 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>STRICT MULTI-TENANT ISOLATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Security & Row-Level Protection
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every company is an isolated tenant. Cryptographic boundary enforcement guarantees complete confidentiality for attendee records, photos, and badge data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Security Pillar 1 */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">PostgreSQL Row-Level Security (RLS)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every tenant database query is cryptographically tagged with a unique <code className="text-cyan-400 font-mono">tenant_id</code>. RLS policies reject cross-tenant reads and writes at the engine level.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Cross-Tenant Leakage</span>
              </div>
            </div>

            {/* Security Pillar 2 */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Ghana Act 843 Data Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full legal compliance with statutory data privacy standards. Every attendee explicitly consents to portrait badge capture and data handling with verifiable audit logs.
              </p>
              <div className="pt-2 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory Consent Logging</span>
              </div>
            </div>

            {/* Security Pillar 3 */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Offline Cache Resiliency & Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If the venue network fails or disconnects, check-in stations continue scanning locally in secure IndexedDB cache, automatically re-syncing when connectivity resumes.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Data Loss Guarantee</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. PRICING PLANS (with id="pricing" for smooth scroll) */}
      <section id="pricing" className="py-20 bg-slate-950/70 border-t border-slate-800/60 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">
              Transparent Workspace Rental
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simple, Predictable Subscription Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Choose the tier that fits your conference or corporate annual general meeting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Starter Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Starter Tier</span>
                <h3 className="text-xl font-bold text-white mb-2">Single Event Workshop</h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-black text-white">$99</span>
                  <span className="text-xs text-slate-400">/ event</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mt-6">
                  <li className="flex items-center gap-2">✓ Up to 200 registered delegates</li>
                  <li className="flex items-center gap-2">✓ Optical QR scanner & manual fallback</li>
                  <li className="flex items-center gap-2">✓ Direct thermal badge printing</li>
                  <li className="flex items-center gap-2">✓ Attendee certificate generation</li>
                </ul>
              </div>
              <button
                onClick={onOpenRegisterCompany}
                className="w-full mt-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Register as Starter
              </button>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-indigo-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/20">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-md">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Growth Tier</span>
                <h3 className="text-xl font-bold text-white mb-2">Corporate Conferences</h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-black text-cyan-400">$199</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mt-6">
                  <li className="flex items-center gap-2">✓ Up to 1,000 registered delegates</li>
                  <li className="flex items-center gap-2">✓ Unlimited simultaneous mobile ushers</li>
                  <li className="flex items-center gap-2">✓ Sub-second optical check-in processing</li>
                  <li className="flex items-center gap-2">✓ Attendance-gated live attendee chat</li>
                  <li className="flex items-center gap-2">✓ Real-time turnout analytics & CSV export</li>
                </ul>
              </div>
              <button
                onClick={onOpenRegisterCompany}
                className="w-full mt-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                Register as Growth
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Enterprise Tier</span>
                <h3 className="text-xl font-bold text-white mb-2">Multi-Day Expos & Summits</h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-black text-white">$499</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mt-6">
                  <li className="flex items-center gap-2">✓ Unlimited delegate capacity</li>
                  <li className="flex items-center gap-2">✓ Custom subdomain & white-label branding</li>
                  <li className="flex items-center gap-2">✓ Dedicated on-site engineering SLA</li>
                  <li className="flex items-center gap-2">✓ VIP pass designs & holographic credentials</li>
                  <li className="flex items-center gap-2">✓ PostgreSQL Row-Level Security isolation</li>
                </ul>
              </div>
              <button
                onClick={onOpenRegisterCompany}
                className="w-full mt-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Register as Enterprise
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-extrabold text-white text-base">EventFlow Cloud</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cloud-hosted multi-tenant event registration, badging, and check-in system for modern organizations.
              </p>
            </div>

            <div>
              <p className="font-bold text-white mb-3">Product</p>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-slate-300">Feature Suite</a></li>
                <li><a href="#multidesk" className="hover:text-slate-300">Multi-Desk Scanners</a></li>
                <li><a href="#security" className="hover:text-slate-300">Security & RLS</a></li>
                <li><a href="#pricing" className="hover:text-slate-300">Subscription Plans</a></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-3">Portals & Sign In</p>
              <ul className="space-y-2">
                <li>
                  <button onClick={onOpenLogin} className="hover:text-indigo-400 text-left">
                    Company Organizer Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onOpenLogin} className="hover:text-amber-400 text-left">
                    Platform Super-Admin Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onOpenRegisterCompany} className="hover:text-emerald-400 text-left">
                    Register a New Company
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-3">Legal & Compliance</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ghana Act 843 Data Protection Compliant. Row-Level Security guarantees cross-tenant isolation on all stored attendee photos and contact records.
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 EventFlow Cloud Platform. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Cloud Multi-Tenancy Architecture</span>
              <span>•</span>
              <span className="text-emerald-400">PostgreSQL RLS Protected</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
