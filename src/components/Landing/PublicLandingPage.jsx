import React from 'react';
import { 
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
  Lock, 
  Smartphone,
  ChevronRight,
  Database,
  FileCheck2,
  WifiOff,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function PublicLandingPage({
  onOpenLogin,
  onOpenRegisterCompany,
  tenants = []
}) {
  return (
    <div className="min-h-screen bg-[#090A0D] text-slate-100 flex flex-col font-sans selection:bg-[#FB9378] selection:text-black">
      
      {/* =========================================================================
          1. MINIMALIST LUXURY HEADER (Matching Reference Images 1 & 2)
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#090A0D]/85 backdrop-blur-xl border-b border-[#1E202B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Navigation Links */}
            <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-slate-300">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#process" className="hover:text-white transition-colors">Process</a>
              <a href="#features" className="hover:text-white transition-colors hidden md:inline">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors hidden md:inline">Pricing</a>
            </nav>

            {/* Center: Circular "EP" Logo Mark (Exact Reference) */}
            <a 
              href="#" 
              className="w-11 h-11 rounded-full bg-white text-black font-black text-base flex items-center justify-center tracking-tight shadow-lg shadow-white/10 hover:scale-105 transition-transform shrink-0"
              title="EventPlan - Return to top"
            >
              EP
            </a>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#E0C97E]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>

              {/* "Let's plan" Iridescent Gradient Border Button */}
              <button
                onClick={onOpenRegisterCompany}
                className="btn-gradient-border px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Let&apos;s plan
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* =========================================================================
          2. EDITORIAL HERO SECTION (Matching Reference Images 1 & 2)
          ========================================================================= */}
      <section className="relative pt-12 sm:pt-16 pb-20 overflow-hidden">
        
        {/* Subtle Ambient Vignettes */}
        <div className="absolute top-10 left-1/4 w-[450px] h-[300px] bg-[#AB6088]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-[#E0C97E]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top 2-Column Split: Headline & Editorial Paragraph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12 sm:mb-16">
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
                Precision planning for perfect corporate events
              </h1>
            </div>
            <div className="md:pl-8 flex flex-col justify-between h-full pt-1">
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-lg">
                With our expert planning and seamless execution, we ensure every detail is perfect so that you can focus on your business goals. Rent an isolated corporate workspace with sub-second optical badges and live analytics.
              </p>
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#1E202B]/80 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E0C97E]" />
                  <span>Sub-second optical badges</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FB9378]" />
                  <span>Multi-desk coordination</span>
                </div>
              </div>
            </div>
          </div>

          {/* Massive Typographic Hero: "EventPlan" with Palette Gradient */}
          <div className="relative my-4 select-none">
            <h2 className="text-6xl sm:text-8xl md:text-[11rem] lg:text-[13rem] font-black tracking-tighter leading-none text-center text-palette-gradient">
              EventPlan
            </h2>
          </div>

          {/* Auditorium Crowd Backdrop with Center Floating Pill CTA */}
          <div className="relative -mt-10 sm:-mt-20 rounded-3xl overflow-hidden border border-[#1E202B] shadow-2xl h-[320px] sm:h-[460px]">
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80" 
              alt="Auditorium corporate event crowd" 
              className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.1]"
            />
            
            {/* Dark Gradient Overlays for Atmospheric Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-[#090A0D]/30 to-[#090A0D]/80" />
            <div className="absolute inset-0 bg-radial-vignette opacity-60" />

            {/* Floating Centered CTA Pill (Request a Quote) */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <button
                onClick={onOpenRegisterCompany}
                className="btn-gradient-border px-7 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all group"
              >
                {/* 8-Petal Star / Flower Icon with Palette Gradient */}
                <span className="relative flex items-center justify-center w-5 h-5 text-[#FCF8B3] group-hover:rotate-45 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 text-[#FB9378]" />
                </span>
                <span>Request a Quote</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. "OUR EVENT PLANNING SERVICES" (Asymmetric Bento Grid - Ref Images 3 & 4)
          ========================================================================= */}
      <section id="services" className="py-24 border-t border-[#1E202B] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Our event planning services
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
              From intimate executive retreats to mega-scale international symposiums, explore our tailored service portfolio.
            </p>
          </div>

          {/* Asymmetric 3-Column Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            
            {/* Column 1: Team Building Events + Gala Dinners */}
            <div className="space-y-6">
              
              {/* Card 1: Team Building Events */}
              <div className="group rounded-3xl overflow-hidden bg-[#111217] border border-[#1E202B] hover:border-[#393C4E] transition-all shadow-xl">
                <div className="h-64 sm:h-72 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80" 
                    alt="Team building events" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="bg-[#0B0C10] py-4 px-6 text-center border-t border-[#1E202B]">
                  <h3 className="text-base sm:text-lg font-bold text-white">Team building events</h3>
                </div>
              </div>

              {/* Card 2: Gala Dinners */}
              <div className="group rounded-3xl overflow-hidden bg-[#111217] border border-[#1E202B] hover:border-[#393C4E] transition-all shadow-xl">
                <div className="h-80 sm:h-96 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80" 
                    alt="Gala dinners" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="bg-[#0B0C10] py-4 px-6 text-center border-t border-[#1E202B]">
                  <h3 className="text-base sm:text-lg font-bold text-white">Gala dinners</h3>
                </div>
              </div>

            </div>

            {/* Column 2: Conferences (Centerpiece Tall Card) + Virtual Events */}
            <div className="space-y-6">
              
              {/* Card 3: Conferences (Tall Centerpiece) */}
              <div className="group rounded-3xl overflow-hidden bg-[#111217] border border-[#1E202B] hover:border-[#AB6088]/50 transition-all shadow-2xl">
                <div className="h-[420px] sm:h-[480px] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80" 
                    alt="Conferences" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="bg-[#0B0C10] py-4 px-6 text-center border-t border-[#1E202B]">
                  <h3 className="text-base sm:text-lg font-bold text-[#E0C97E]">Conferences</h3>
                </div>
              </div>

              {/* Card 4: Virtual Events */}
              <div className="group rounded-3xl overflow-hidden bg-[#111217] border border-[#1E202B] hover:border-[#393C4E] transition-all shadow-xl">
                <div className="h-64 sm:h-72 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=900&q=80" 
                    alt="Virtual events" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="bg-[#0B0C10] py-4 px-6 text-center border-t border-[#1E202B]">
                  <h3 className="text-base sm:text-lg font-bold text-white">Virtual events</h3>
                </div>
              </div>

            </div>

            {/* Column 3: Product Launches + Seminars + Custom Event */}
            <div className="space-y-6">
              
              {/* Card 5: Product Launches */}
              <div className="group rounded-3xl overflow-hidden bg-[#111217] border border-[#1E202B] hover:border-[#393C4E] transition-all shadow-xl">
                <div className="h-56 sm:h-64 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80" 
                    alt="Product launches" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="bg-[#0B0C10] py-4 px-6 text-center border-t border-[#1E202B]">
                  <h3 className="text-base sm:text-lg font-bold text-white">Product launches</h3>
                </div>
              </div>

              {/* Card 6: Seminars */}
              <div className="group rounded-3xl overflow-hidden bg-[#111217] border border-[#1E202B] hover:border-[#393C4E] transition-all shadow-xl">
                <div className="h-56 sm:h-64 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=80" 
                    alt="Seminars" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="bg-[#0B0C10] py-4 px-6 text-center border-t border-[#1E202B]">
                  <h3 className="text-base sm:text-lg font-bold text-white">Seminars</h3>
                </div>
              </div>

              {/* Card 7: Custom Event */}
              <div className="group rounded-3xl overflow-hidden bg-[#111217] border border-[#1E202B] hover:border-[#393C4E] transition-all shadow-xl">
                <div className="h-56 sm:h-64 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80" 
                    alt="Custom event" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="bg-[#0B0C10] py-4 px-6 text-center border-t border-[#1E202B]">
                  <h3 className="text-base sm:text-lg font-bold text-white">Custom event</h3>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. "OUR WORK PROCESS" (Staggered Rhythmic Columns - Ref Image 5)
          ========================================================================= */}
      <section id="process" className="py-28 border-t border-[#1E202B] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Header */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Our work<br className="hidden lg:inline" /> process
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed max-w-xs">
                A disciplined four-phase methodology delivering precision from initial briefing to post-event executive debriefing.
              </p>
            </div>

            {/* Right: 4 Staggered Columns with Giant Gradient Numbers (Exact Image 5 Layout) */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* Step 01: Planning (Number on Top) */}
              <div className="flex flex-col">
                <div className="text-6xl sm:text-7xl font-black text-palette-gradient leading-none mb-4 select-none">
                  01
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Planning</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Understand client needs and develop a detailed event plan. Initial meetings, defining event goals, creating a proposal, and setting a timeline.
                </p>
              </div>

              {/* Step 02: Preparation (Title Above, Stepped Down) */}
              <div className="flex flex-col sm:mt-16 md:mt-24">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Preparation</h3>
                <div className="text-6xl sm:text-7xl font-black text-palette-gradient leading-none mb-4 select-none">
                  02
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Designing branding and promotional materials, selecting venues, and coordinating with vendors.
                </p>
              </div>

              {/* Step 03: Execution (Number on Top, Stepped Mid) */}
              <div className="flex flex-col sm:mt-6 md:mt-8">
                <div className="text-6xl sm:text-7xl font-black text-palette-gradient leading-none mb-4 select-none">
                  03
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Execution</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  On-site management, overseeing setup and breakdown, managing vendor coordination, and handling attendee logistics.
                </p>
              </div>

              {/* Step 04: Evaluation (Title Above, Stepped Down) */}
              <div className="flex flex-col sm:mt-20 md:mt-32">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Evaluation</h3>
                <div className="text-6xl sm:text-7xl font-black text-palette-gradient leading-none mb-4 select-none">
                  04
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Collecting attendee and client feedback, conducting a post-event debrief, and providing a final report to the client.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. FEATURES & WORKSPACE ARCHITECTURE (Tailored Midnight & Palette)
          ========================================================================= */}
      <section id="features" className="py-24 border-t border-[#1E202B] bg-[#0C0D12] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#E0C97E] uppercase tracking-widest block mb-2">
              Enterprise Event Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for Zero Latency and High Throughput
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From remote photo capture to instant badging and attendance-gated chat, everything runs in a single high-performance cloud deployment.
            </p>
          </div>

          {/* 6 Feature Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="card-luxury rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0C97E]/10 border border-[#E0C97E]/20 text-[#E0C97E] flex items-center justify-center mb-5">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Remote Attendee Registration</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Attendees register remotely from their phone or PC, upload their photo badge portrait, and receive an instant QR code entry ticket.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E202B] flex items-center justify-between text-[11px] font-mono text-[#E0C97E]">
                <span>Duplicate Email Detection</span>
                <span>Active</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card-luxury rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FB9378]/10 border border-[#FB9378]/20 text-[#FB9378] flex items-center justify-center mb-5">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sub-Second Optical QR Scanner</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Optical camera scanner targets under 0.85s processing time with immediate duplicate entry detection and acoustic confirmation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E202B] flex items-center justify-between text-[11px] font-mono text-[#FB9378]">
                <span>Target &lt; 0.85s Processing</span>
                <span>Verified</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card-luxury rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#AB6088]/15 border border-[#AB6088]/30 text-[#AB6088] flex items-center justify-center mb-5">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Lanyard Badge Printing</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clean badge printing stylesheets formatted for thermal and standard badge paper. Displays photo, category banner, QR, and company branding.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E202B] flex items-center justify-between text-[11px] font-mono text-[#AB6088]">
                <span>Conference Lanyard Formats</span>
                <span>Supported</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card-luxury rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FCF8B3]/10 border border-[#FCF8B3]/20 text-[#FCF8B3] flex items-center justify-center mb-5">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Attendance-Gated Live Chat</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time event community chat strictly gated to attendees who physically scanned into the venue. Pin announcements and moderate messages.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E202B] flex items-center justify-between text-[11px] font-mono text-[#FCF8B3]">
                <span>Physical Attendance Gate</span>
                <span>Enforced</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="card-luxury rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0C97E]/10 border border-[#E0C97E]/20 text-[#E0C97E] flex items-center justify-center mb-5">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live Hourly Arrival Analytics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time check-in velocity and turnout percentage gauges. Categorizes delegates, VIPs, speakers, sponsors, and press with 1-click CSV export.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E202B] flex items-center justify-between text-[11px] font-mono text-[#E0C97E]">
                <span>CSV / Excel Export</span>
                <span>1-Click</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="card-luxury rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FB9378]/10 border border-[#FB9378]/20 text-[#FB9378] flex items-center justify-center mb-5">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Registration QR Entrance Signs</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate print-ready 8.5x11 / A4 entrance flyers with high-contrast QR codes. Place on check-in tables so attendees scan to register in seconds.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E202B] flex items-center justify-between text-[11px] font-mono text-[#FB9378]">
                <span>Printable Flyer Generator</span>
                <span>Included</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. MULTI-DESK CHECK-IN COORDINATION
          ========================================================================= */}
      <section id="multidesk" className="py-24 border-t border-[#1E202B] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB9378]/10 border border-[#FB9378]/25 text-[#FB9378] text-xs font-bold mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>ON-SITE VOLUNTEER & ADMIN COORDINATION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Turn Every Smartphone into a High-Speed Wireless Badge Scanner.
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                Large events cannot afford entrance bottlenecks. EventPlan lets you coordinate multiple entrance desks (Desk 1, Desk 2, VIP Gate) with zero software to install.
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#E0C97E]/15 text-[#E0C97E] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">1-Scan Staff Mobile Onboarding:</strong> Event ushers scan the organizer&apos;s screen to open the camera scanner instantly on their personal phones.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#FB9378]/15 text-[#FB9378] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Duplicate Scan Alerts:</strong> If a delegate attempts to reuse a ticket at another desk, the system alerts the usher immediately with previous timestamp.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#AB6088]/20 text-[#AB6088] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Offline Check-In Queue:</strong> Continues scanning attendees even if on-site Wi-Fi drops, auto-syncing when internet restores.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Station Dashboard Box */}
            <div className="card-luxury rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E202B]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E0C97E] animate-pulse" />
                  <span className="font-bold text-white text-xs">Simultaneous Desks Active</span>
                </div>
                <span className="text-[11px] font-mono text-[#FB9378]">Live Attendance: 88%</span>
              </div>

              <div className="space-y-3 mt-4">
                {[
                  { desk: "Desk 1 – Main Gate (Kofi)", count: "142 scans", status: "Active" },
                  { desk: "Desk 2 – General Admission (Ama)", count: "119 scans", status: "Active" },
                  { desk: "Desk 3 – VIP & Keynotes (Sarah)", count: "48 scans", status: "Active" },
                  { desk: "Desk 4 – Fast Track QR", count: "33 scans", status: "Active" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#090A0D] border border-[#1E202B] text-xs">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-[#E0C97E]" />
                      <span className="font-bold text-white">{item.desk}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400">{item.count}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0C97E]/10 text-[#E0C97E]">
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

      {/* =========================================================================
          7. SECURITY & RLS SECTION
          ========================================================================= */}
      <section id="security" className="py-24 border-t border-[#1E202B] bg-[#0C0D12] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AB6088]/15 border border-[#AB6088]/30 text-[#AB6088] text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>STRICT MULTI-TENANT ISOLATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Enterprise Security & Row-Level Protection
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every company is an isolated tenant. Cryptographic boundary enforcement guarantees complete confidentiality for attendee records, photos, and badge data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="card-luxury p-7 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E0C97E]/10 border border-[#E0C97E]/20 text-[#E0C97E] flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">PostgreSQL Row-Level Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every tenant database query is cryptographically tagged with a unique <code className="text-[#E0C97E] font-mono">tenant_id</code>. RLS policies reject cross-tenant reads and writes at the engine level.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#E0C97E] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Cross-Tenant Leakage</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="card-luxury p-7 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FB9378]/10 border border-[#FB9378]/20 text-[#FB9378] flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Ghana Act 843 Data Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full legal compliance with statutory data privacy standards. Every attendee explicitly consents to portrait badge capture and data handling with verifiable audit logs.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#FB9378] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory Consent Logging</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="card-luxury p-7 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#AB6088]/15 border border-[#AB6088]/30 text-[#AB6088] flex items-center justify-center">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Offline Cache Resiliency & Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If the venue network fails or disconnects, check-in stations continue scanning locally in secure IndexedDB cache, automatically re-syncing when connectivity resumes.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#AB6088] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Data Loss Guarantee</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          8. PRICING PLANS
          ========================================================================= */}
      <section id="pricing" className="py-24 border-t border-[#1E202B] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#E0C97E] uppercase tracking-widest block mb-2">
              Transparent Workspace Rental
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Simple, Predictable Subscription Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Choose the tier that fits your conference, seminar, or corporate annual general meeting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Starter Plan */}
            <div className="card-luxury rounded-3xl p-8 flex flex-col justify-between">
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
                  <li className="flex items-center gap-2">✓ Direct thermal & lanyard badge printing</li>
                  <li className="flex items-center gap-2">✓ Attendee certificate generation</li>
                </ul>
              </div>
              <button
                onClick={onOpenRegisterCompany}
                className="w-full mt-8 py-3 rounded-xl bg-[#1A1C24] hover:bg-[#232632] text-white font-bold text-xs transition-colors"
              >
                Register as Starter
              </button>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="btn-gradient-border rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black shadow-md">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-bold text-[#E0C97E] uppercase tracking-wider block mb-1">Growth Tier</span>
                <h3 className="text-xl font-bold text-white mb-2">Corporate Conferences</h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-black text-palette-gradient">$199</span>
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
                className="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] hover:opacity-95 text-black font-extrabold text-xs shadow-lg transition-all"
              >
                Register as Growth
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="card-luxury rounded-3xl p-8 flex flex-col justify-between">
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
                className="w-full mt-8 py-3 rounded-xl bg-[#1A1C24] hover:bg-[#232632] text-white font-bold text-xs transition-colors"
              >
                Register as Enterprise
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          9. FOOTER
          ========================================================================= */}
      <footer className="mt-auto border-t border-[#1E202B] bg-[#07080B] py-14 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-black font-black text-sm flex items-center justify-center tracking-tight">
                  EP
                </div>
                <span className="font-bold text-white text-base">EventPlan</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cloud-hosted corporate event registration, badging, and multi-desk check-in platform with editorial excellence.
              </p>
            </div>

            <div>
              <p className="font-bold text-white mb-3">Navigation</p>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-slate-300">Services</a></li>
                <li><a href="#process" className="hover:text-slate-300">Work Process</a></li>
                <li><a href="#features" className="hover:text-slate-300">Feature Suite</a></li>
                <li><a href="#multidesk" className="hover:text-slate-300">Multi-Desk Scanners</a></li>
                <li><a href="#pricing" className="hover:text-slate-300">Subscription Plans</a></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-3">Portals & Sign In</p>
              <ul className="space-y-2">
                <li>
                  <button onClick={onOpenLogin} className="hover:text-[#FB9378] text-left">
                    Company Organizer Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onOpenLogin} className="hover:text-[#E0C97E] text-left">
                    Platform Super-Admin Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onOpenRegisterCompany} className="hover:text-[#FCF8B3] text-left">
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

          <div className="pt-6 border-t border-[#1E202B] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 EventPlan Platform. Precision corporate event management.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#E0C97E]">Multi-Tenancy Architecture</span>
              <span>•</span>
              <span className="text-[#FB9378]">PostgreSQL RLS Protected</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
