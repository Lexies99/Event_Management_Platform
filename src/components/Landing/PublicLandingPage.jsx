import React, { useState } from 'react';
import { 
  Lock, 
  Sparkles, 
  Users, 
  Smartphone, 
  Check, 
  Database, 
  FileCheck2, 
  WifiOff, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  UserCheck, 
  QrCode, 
  Printer, 
  MessageSquare 
} from 'lucide-react';

/* Reusable Unifato Iridescent Asterisk / Flower Icon with User Palette */
function IridescentFlowerIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.7132 13.0549L18.4837 0.34996H11.1686L12.955 13.0549C13.4832 12.617 14.1477 12.3773 14.8339 12.3773C15.52 12.3773 16.1845 12.617 16.7127 13.0549H16.7132Z" fill="#354649"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.7132 17.7233L18.4837 30.4131H11.1686L12.955 17.7233C13.4874 18.1518 14.1504 18.3854 14.8339 18.3854C15.5173 18.3854 16.1803 18.1518 16.7127 17.7233H16.7132Z" fill="#354649"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M17.9567 15.0572L28.1826 7.32636L23.0233 2.15176L15.2925 12.393C15.9752 12.463 16.6129 12.7662 17.0982 13.2515C17.5835 13.7368 17.8867 14.3745 17.9567 15.0572Z" fill="#6C7A89"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M14.6919 18.3067L6.97614 28.5479L1.80206 23.3736L12.0433 15.6424C12.1074 16.3248 12.4066 16.9637 12.8898 17.4497C13.373 17.9357 14.0102 18.2387 14.6921 18.3067H14.6919Z" fill="#6C7A89"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M17.2946 17.2275L29.9998 19.0142V11.6988L17.2946 13.4722C17.7325 14.0003 17.9721 14.6648 17.9721 15.3509C17.9721 16.037 17.7325 16.7015 17.2946 17.2296V17.2275Z" fill="#E0E7E9"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.6898 17.2275L3.05176e-05 19.0153V11.6988L12.6898 13.4722C12.2613 14.0046 12.0277 14.6675 12.0277 15.3509C12.0277 16.0343 12.2613 16.6972 12.6898 17.2296V17.2275Z" fill="#E0E7E9"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.2925 18.3067L23.0233 28.5479L28.1826 23.3736L17.9567 15.6424C17.8893 16.3261 17.5869 16.9653 17.1011 17.4511C16.6153 17.9369 15.9762 18.2392 15.2925 18.3067Z" fill="#A3C6C4"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.043 15.0572L1.80206 7.32636L6.97614 2.15176L14.6919 12.393C13.2904 12.5315 12.1815 13.6557 12.043 15.0572Z" fill="#A3C6C4"/>
    </svg>
  );
}

/* Authentic Unifato Circular Monogram Logo */
function EventPlanLogo({ className = "" }) {
  return (
    <svg 
      viewBox="0 0 171 171" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
      style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}
    >
      <circle cx="85.5" cy="85.5" r="85" fill="#F3EFFF"/>
      <path d="M141.776 61.5093C143.944 68.2126 141.146 78.5468 140.517 79.8502C137.16 87.019 130.097 91.674 122.545 91.674C119.887 91.5809 117.23 91.1154 114.712 89.9982L114.013 89.7189C112.265 88.7879 110.447 88.3224 108.558 88.1362C106.67 88.1362 104.852 89.0672 103.453 90.743L103.034 91.2085V117.37H88.0685V52.3854H130.307C135.132 52.1061 139.678 55.737 141.776 61.5093ZM126.391 75.2882C126.95 71.2849 126.741 65.2333 124.083 61.6024C122.335 59.5542 120.027 58.5301 117.649 58.8094C114.153 58.8094 110.447 58.7163 106.6 58.7163H103.034V83.7604L104.642 83.0156C106.041 82.1777 107.649 81.8984 109.188 81.8984C110.936 81.9915 112.754 82.3639 114.433 83.0156L115.901 83.4811C117.16 83.9466 118.489 84.319 119.887 84.4121C123.803 84.4121 125.692 79.9433 126.391 75.2882Z" fill="#182224"/>
      <path d="M50.077 60.9507L49.2378 60.4852V80.3157H71.2663V88.1361H49.2378V109.549H78.7489V117.277H33.5033V52.3854H49.7274C51.7554 53.7819 53.9233 54.6198 56.231 54.7129C56.5807 54.806 56.9303 54.806 57.28 54.806C59.1681 54.7129 61.1262 54.4336 62.9444 53.7819C63.364 53.6888 63.9235 53.5026 64.5528 53.3164C66.441 52.6647 68.3991 52.1992 70.3572 52.013C70.9166 51.9199 71.546 51.9199 72.2453 51.9199C74.4132 51.9199 76.5811 52.1061 78.7489 52.4785V60.299C76.5811 59.9266 74.4132 59.7404 72.2453 59.7404C69.7977 59.7404 67.6298 60.299 65.2522 61.0438L64.0633 61.4162C63.9235 61.5093 63.7137 61.5093 63.5039 61.6024C61.4059 62.161 59.238 62.5334 57.0002 62.6265C54.6226 62.6265 52.3148 62.0679 50.077 60.9507Z" fill="#182224"/>
    </svg>
  );
}

export default function PublicLandingPage({
  onOpenLogin,
  onOpenRegisterCompany,
  tenants = []
}) {
  // Conversational booking form state
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    location: '',
    venue: '',
    date: '',
    guests: '',
    budget: '',
    email: '',
    phone: '',
    submitted: false
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, submitted: true }));
  };

  return (
    <div className="min-h-screen bg-[#182224] text-white flex flex-col font-sans selection:bg-[#6C7A89] selection:text-black">
      
      {/* =========================================================================
          1. HEADER (Directly from Unifato Reference)
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#182224]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            
            {/* Left: Navigation Links */}
            <nav className="flex items-center gap-8 text-base lg:text-lg font-normal text-white">
              <a href="#" className="hover:text-white/80 transition-colors">Home</a>
              <a href="#about" className="hover:text-white/80 transition-colors">About</a>
              <a href="#services" className="hover:text-white/80 transition-colors">Services</a>
              <a href="#process" className="hover:text-white/80 transition-colors hidden md:inline">Process</a>
              <a href="#highlights" className="hover:text-white/80 transition-colors hidden lg:inline">Highlights</a>
            </nav>

            {/* Center: Authentic Monogram Logo */}
            <a href="#" className="flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
              <EventPlanLogo className="w-13 h-13 sm:w-15 sm:h-15" />
            </a>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-sm sm:text-base font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#A3C6C4]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>

              {/* "Let's plan" Iridescent Gradient Button */}
              <button
                onClick={onOpenRegisterCompany}
                className="btn-unifato group cursor-pointer"
              >
                <div className="btn-unifato-inner py-3 px-6 sm:px-8 flex items-center gap-2">
                  <span className="text-white text-base sm:text-lg font-medium tracking-wide">
                    Let&apos;s plan
                  </span>
                </div>
              </button>
            </div>

          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* =========================================================================
            2. HERO SECTION (Full-bleed crowd backdrop + giant overlapping title)
            ========================================================================= */}
        <section className="relative pt-24 sm:pt-32 pb-32 sm:pb-48 lg:pb-60 overflow-hidden flex items-center">
          
          {/* Full-bleed crowd background with authentic vertical fades */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://unifato.com/eventplan/images/hero/hero-01.jpg" 
              alt="Auditorium Event Crowd" 
              className="w-full h-full object-cover absolute top-0 brightness-[0.7]"
            />
            {/* Top gradient fade into #182224 */}
            <div className="absolute top-0 inset-x-0 w-full h-80 bg-gradient-to-b from-[#182224] via-[#182224]/90 to-transparent" />
            {/* Subtle center wash */}
            <div className="absolute inset-0 w-full bg-[#182224]/45" />
            {/* Bottom gradient fade into #182224 */}
            <div className="absolute bottom-0 inset-x-0 w-full h-80 bg-gradient-to-t from-[#182224] via-[#182224]/85 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            
            {/* Top Editorial 2-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8 sm:mb-14">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold font-display text-white tracking-wide leading-[1.1]">
                  Precision planning for<br />perfect corporate events
                </h1>
              </div>
              <div className="flex lg:justify-end">
                <p className="text-white/80 text-base sm:text-lg font-normal max-w-xl leading-relaxed">
                  With our expert planning and seamless execution, we ensure every detail is perfect so that you can focus on your business goals.
                </p>
              </div>
            </div>

            {/* Giant Typographic Statement Overlapping Crowd */}
            <div className="relative w-full flex flex-col items-center justify-center">
              <h2 className="text-[68px] sm:text-[140px] md:text-[220px] lg:text-[300px] xl:text-[340px] leading-[0.8] tracking-wider font-bold font-display text-center text-palette-gradient w-full select-none mb-16 sm:mb-24">
                EventPlan
              </h2>

              {/* Overlapping Bottom Center Button */}
              <div className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-10 z-20">
                <button
                  onClick={onOpenRegisterCompany}
                  className="btn-unifato group shadow-2xl cursor-pointer"
                >
                  <div className="btn-unifato-inner py-3 sm:py-4 px-6 sm:px-8 flex items-center gap-3">
                    <IridescentFlowerIcon className="w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:rotate-45 transition-transform duration-500" />
                    <span className="text-white text-base sm:text-lg font-medium tracking-wide">
                      Request a Quote
                    </span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            3. "OUR EVENT PLANNING SERVICES" (Exact Bento Grid from Unifato)
            ========================================================================= */}
        <section id="services" className="py-24 sm:py-32 bg-[#182224] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-6xl lg:text-[80px] font-bold font-display text-white tracking-wider">
                Our event planning services
              </h2>
            </div>

            {/* 3-Column Bento Grid matching exact heights and hover reveal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              
              {/* Column 1: Team building (350px) + Gala dinners (474px) */}
              <div className="flex flex-col gap-8">
                
                {/* Team building events */}
                <div className="h-[350px]">
                  <div 
                    onClick={onOpenRegisterCompany}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-black transition-all h-full cursor-pointer shadow-xl border border-white/5"
                  >
                    <div className="relative w-full flex-1 min-h-0">
                      <img 
                        src="https://unifato.com/eventplan/images/Service/service-01.jpg" 
                        alt="Team building events" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-[#182224]/70 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="py-5 px-6 text-center bg-black">
                      <h3 className="text-2xl lg:text-3xl font-bold font-display text-white group-hover:text-[#A3C6C4] transition-colors">
                        Team building events
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Gala dinners */}
                <div className="h-[350px] lg:h-[474px]">
                  <div 
                    onClick={onOpenRegisterCompany}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-black transition-all h-full cursor-pointer shadow-xl border border-white/5"
                  >
                    <div className="relative w-full flex-1 min-h-0">
                      <img 
                        src="https://unifato.com/eventplan/images/Service/service-02.jpg" 
                        alt="Gala dinners" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-[#182224]/70 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="py-5 px-6 text-center bg-black">
                      <h3 className="text-2xl lg:text-3xl font-bold font-display text-white group-hover:text-[#A3C6C4] transition-colors">
                        Gala dinners
                      </h3>
                    </div>
                  </div>
                </div>

              </div>

              {/* Column 2: Conferences (524px centerpiece) + Virtual events (300px) */}
              <div className="flex flex-col gap-8">
                
                {/* Conferences */}
                <div className="h-[350px] lg:h-[524px]">
                  <div 
                    onClick={onOpenRegisterCompany}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-black transition-all h-full cursor-pointer shadow-2xl border border-white/5"
                  >
                    <div className="relative w-full flex-1 min-h-0">
                      <img 
                        src="https://unifato.com/eventplan/images/Service/service-03.jpg" 
                        alt="Conferences" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-[#182224]/70 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="py-5 px-6 text-center bg-black">
                      <h3 className="text-2xl lg:text-3xl font-bold font-display text-white group-hover:text-[#A3C6C4] transition-colors">
                        Conferences
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Virtual events */}
                <div className="h-[300px]">
                  <div 
                    onClick={onOpenRegisterCompany}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-black transition-all h-full cursor-pointer shadow-xl border border-white/5"
                  >
                    <div className="relative w-full flex-1 min-h-0">
                      <img 
                        src="https://unifato.com/eventplan/images/Service/service-04.jpg" 
                        alt="Virtual events" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-[#182224]/70 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="py-5 px-6 text-center bg-black">
                      <h3 className="text-2xl lg:text-3xl font-bold font-display text-white group-hover:text-[#A3C6C4] transition-colors">
                        Virtual events
                      </h3>
                    </div>
                  </div>
                </div>

              </div>

              {/* Column 3: Product launches (250px) + Seminars (250px) + Custom event (300px) */}
              <div className="flex flex-col gap-8">
                
                {/* Product launches */}
                <div className="h-[250px]">
                  <div 
                    onClick={onOpenRegisterCompany}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-black transition-all h-full cursor-pointer shadow-xl border border-white/5"
                  >
                    <div className="relative w-full flex-1 min-h-0">
                      <img 
                        src="https://unifato.com/eventplan/images/Service/service-05.jpg" 
                        alt="Product launches" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-[#182224]/70 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="py-4 px-6 text-center bg-black">
                      <h3 className="text-xl lg:text-2xl font-bold font-display text-white group-hover:text-[#A3C6C4] transition-colors">
                        Product launches
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Seminars */}
                <div className="h-[250px]">
                  <div 
                    onClick={onOpenRegisterCompany}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-black transition-all h-full cursor-pointer shadow-xl border border-white/5"
                  >
                    <div className="relative w-full flex-1 min-h-0">
                      <img 
                        src="https://unifato.com/eventplan/images/Service/service-06.jpg" 
                        alt="Seminars" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-[#182224]/70 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="py-4 px-6 text-center bg-black">
                      <h3 className="text-xl lg:text-2xl font-bold font-display text-white group-hover:text-[#A3C6C4] transition-colors">
                        Seminars
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Custom event */}
                <div className="h-[300px]">
                  <div 
                    onClick={onOpenRegisterCompany}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-black transition-all h-full cursor-pointer shadow-xl border border-white/5"
                  >
                    <div className="relative w-full flex-1 min-h-0">
                      <img 
                        src="https://unifato.com/eventplan/images/Service/service-07.jpg" 
                        alt="Custom event" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-[#182224]/70 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="py-5 px-6 text-center bg-black">
                      <h3 className="text-2xl lg:text-3xl font-bold font-display text-white group-hover:text-[#A3C6C4] transition-colors">
                        Custom event
                      </h3>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            4. "OUR WORK PROCESS" (Exact Unifato staggered stepping & hover dimmer)
            ========================================================================= */}
        <section id="process" className="py-24 sm:py-36 bg-black overflow-hidden scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-10">
              
              {/* Left Sticky Title */}
              <div className="lg:col-span-4">
                <h2 className="text-4xl md:text-6xl font-bold font-display text-white tracking-wider leading-[1.1] lg:sticky lg:top-36">
                  Our work <br className="hidden lg:inline" />process
                </h2>
              </div>

              {/* Right Steps with interactive sibling dimming */}
              <div className="lg:col-span-8 relative">
                <div className="group/steplist grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-12">
                  
                  {/* Step 01 (xl:pt-0) */}
                  <div className="group/step transition-opacity duration-500 group-hover/steplist:opacity-30 hover:!opacity-100 xl:pt-0">
                    <span className="text-7xl md:text-[85px] lg:text-[105px] font-bold font-display leading-none tracking-tighter text-palette-gradient select-none block mb-2">
                      01
                    </span>
                    <h3 className="text-xl font-bold font-display text-white group-hover/step:text-[#6C7A89] transition-colors mb-3">
                      Planning
                    </h3>
                    <p className="text-white/70 text-base leading-relaxed font-normal">
                      Understand client needs and develop a detailed event plan. Initial meetings, defining event goals, creating a proposal, and setting a timeline.
                    </p>
                  </div>

                  {/* Step 02 (xl:pt-[160px] with title on top!) */}
                  <div className="group/step transition-opacity duration-500 group-hover/steplist:opacity-30 hover:!opacity-100 xl:pt-[160px] flex flex-col">
                    <h3 className="text-xl font-bold font-display text-white group-hover/step:text-[#6C7A89] transition-colors mb-2 order-first xl:order-first">
                      Preparation
                    </h3>
                    <span className="text-7xl md:text-[85px] lg:text-[105px] font-bold font-display leading-none tracking-tighter text-palette-gradient select-none block mb-2">
                      02
                    </span>
                    <p className="text-white/70 text-base leading-relaxed font-normal">
                      Designing branding and promotional materials, selecting venues, and coordinating with vendors.
                    </p>
                  </div>

                  {/* Step 03 (xl:pt-[40px]) */}
                  <div className="group/step transition-opacity duration-500 group-hover/steplist:opacity-30 hover:!opacity-100 xl:pt-[40px]">
                    <span className="text-7xl md:text-[85px] lg:text-[105px] font-bold font-display leading-none tracking-tighter text-palette-gradient select-none block mb-2">
                      03
                    </span>
                    <h3 className="text-xl font-bold font-display text-white group-hover/step:text-[#6C7A89] transition-colors mb-3">
                      Execution
                    </h3>
                    <p className="text-white/70 text-base leading-relaxed font-normal">
                      On-site management, overseeing setup and breakdown, managing vendor coordination, and handling attendee logistics.
                    </p>
                  </div>

                  {/* Step 04 (xl:pt-[160px] with title on top!) */}
                  <div className="group/step transition-opacity duration-500 group-hover/steplist:opacity-30 hover:!opacity-100 xl:pt-[160px] flex flex-col">
                    <h3 className="text-xl font-bold font-display text-white group-hover/step:text-[#6C7A89] transition-colors mb-2 order-first xl:order-first">
                      Evaluation
                    </h3>
                    <span className="text-7xl md:text-[85px] lg:text-[105px] font-bold font-display leading-none tracking-tighter text-palette-gradient select-none block mb-2">
                      04
                    </span>
                    <p className="text-white/70 text-base leading-relaxed font-normal">
                      Collecting attendee and client feedback, conducting a post-event debrief, and providing a final report to the client.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            5. "VISIONARY PLANNING" (Exact 3-Column Layout from Unifato)
            ========================================================================= */}
        <section id="about" className="py-24 sm:py-36 bg-[#182224] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 lg:gap-10 md:gap-8 gap-8 items-stretch">
              
              {/* Left Column: Top Image + Bottom Text & "View more" Button */}
              <div className="lg:col-span-3 md:col-span-6 flex flex-col justify-between gap-6">
                <div className="relative w-full rounded-2xl overflow-hidden h-60 sm:h-72 border border-white/5">
                  <img 
                    src="https://unifato.com/eventplan/images/about/about-01.jpg" 
                    alt="Corporate Event Celebration" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#182224]/40" />
                </div>
                <div>
                  <p className="text-base lg:text-lg text-white/80 leading-relaxed mb-8">
                    We specialize in turning visions into reality. With a passion for perfection and a commitment to excellence, we bring your corporate event dreams to life with meticulous planning, innovative solutions, and flawless execution.
                  </p>
                  <button 
                    onClick={onOpenRegisterCompany}
                    className="btn-unifato group cursor-pointer"
                  >
                    <div className="btn-unifato-inner py-3 px-6 flex items-center gap-3">
                      <IridescentFlowerIcon className="w-6 h-6 object-contain group-hover:rotate-45 transition-transform duration-500" />
                      <span className="text-white text-base font-medium tracking-wide">View more</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Center Column: Giant Typographic Headline */}
              <div className="lg:col-span-6 md:col-span-12 flex items-center justify-center text-center py-6 order-first md:order-none">
                <h2 className="text-4xl sm:text-6xl lg:text-[76px] xl:text-[96px] leading-[1.02] font-bold font-display text-white tracking-wider">
                  Visionary <br className="hidden lg:inline" />planning for <br className="hidden lg:inline" />perfect <br className="hidden lg:inline" />corporate<br className="hidden lg:inline" /> events
                </h2>
              </div>

              {/* Right Column: 500+ Stat on Top + Team Photo on Bottom */}
              <div className="lg:col-span-3 md:col-span-6 flex flex-col justify-between gap-6">
                <div className="flex justify-start lg:justify-end">
                  <div className="text-left">
                    <h3 className="text-5xl lg:text-7xl font-bold font-display text-white mb-2">
                      500+
                    </h3>
                    <p className="text-base lg:text-lg text-white/70">
                      Successful events planned
                    </p>
                  </div>
                </div>
                <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/5] border border-white/5">
                  <img 
                    src="https://unifato.com/eventplan/images/about/about-02.jpg" 
                    alt="Outdoor Team Event" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#182224]/40" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            6. "EVENT HIGHLIGHTS" (Sticky Stacking Cards from Unifato)
            ========================================================================= */}
        <section id="highlights" className="py-24 sm:py-36 bg-black scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl md:text-6xl lg:text-[80px] font-bold font-display text-white tracking-wider">
                Event highlights
              </h2>
            </div>

            <div className="flex flex-col gap-12 lg:gap-16">
              
              {/* Event 1: Annual Global Leadership Summit */}
              <div 
                onClick={onOpenRegisterCompany}
                className="group block rounded-2xl overflow-hidden sticky top-28 shadow-2xl cursor-pointer border border-white/10"
              >
                {/* Custom Mauve / Plum Header Strip */}
                <div className="bg-[#354649] py-5 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-3 items-center gap-4 transition-colors">
                  <div className="text-sm sm:text-base text-black font-medium md:flex hidden items-center gap-2">
                    <span className="font-bold">GlobalTech Inc.</span>
                    <span className="w-1.5 h-1.5 bg-black/60 rounded-full" />
                    <span>28 Jun 2024</span>
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-black text-center md:whitespace-nowrap">
                    Annual global leadership summit
                  </h3>
                  <div className="text-sm sm:text-base text-black font-semibold text-right underline underline-offset-4 decoration-black/40 group-hover:decoration-black transition-colors">
                    View detail
                  </div>
                </div>
                <div className="relative w-full h-64 sm:h-96 lg:h-[460px] overflow-hidden">
                  <img 
                    src="https://unifato.com/eventplan/images/blog/big-event-01.jpg" 
                    alt="Annual global leadership summit" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              </div>

              {/* Event 2: Executive Board Meeting */}
              <div 
                onClick={onOpenRegisterCompany}
                className="group block rounded-2xl overflow-hidden sticky top-32 shadow-2xl cursor-pointer border border-white/10"
              >
                {/* Custom Champagne Gold Header Strip */}
                <div className="bg-[#A3C6C4] py-5 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-3 items-center gap-4 transition-colors">
                  <div className="text-sm sm:text-base text-black font-medium md:flex hidden items-center gap-2">
                    <span className="font-bold">TechCorp Solutions</span>
                    <span className="w-1.5 h-1.5 bg-black/60 rounded-full" />
                    <span>1 Jun 2024</span>
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-black text-center md:whitespace-nowrap">
                    Executive board meeting
                  </h3>
                  <div className="text-sm sm:text-base text-black font-semibold text-right underline underline-offset-4 decoration-black/40 group-hover:decoration-black transition-colors">
                    View detail
                  </div>
                </div>
                <div className="relative w-full h-64 sm:h-96 lg:h-[460px] overflow-hidden">
                  <img 
                    src="https://unifato.com/eventplan/images/blog/big-event-02.jpg" 
                    alt="Executive board meeting" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              </div>

              {/* Event 3: Student Leadership Conference */}
              <div 
                onClick={onOpenRegisterCompany}
                className="group block rounded-2xl overflow-hidden sticky top-36 shadow-2xl cursor-pointer border border-white/10"
              >
                {/* Custom Warm Coral Header Strip */}
                <div className="bg-[#6C7A89] py-5 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-3 items-center gap-4 transition-colors">
                  <div className="text-sm sm:text-base text-black font-medium md:flex hidden items-center gap-2">
                    <span className="font-bold">National Student Leaders</span>
                    <span className="w-1.5 h-1.5 bg-black/60 rounded-full" />
                    <span>10-12 Mar 2024</span>
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-black text-center md:whitespace-nowrap">
                    Student leadership conference
                  </h3>
                  <div className="text-sm sm:text-base text-black font-semibold text-right underline underline-offset-4 decoration-black/40 group-hover:decoration-black transition-colors">
                    View detail
                  </div>
                </div>
                <div className="relative w-full h-64 sm:h-96 lg:h-[460px] overflow-hidden">
                  <img 
                    src="https://unifato.com/eventplan/images/blog/big-event-03.jpg" 
                    alt="Student leadership conference" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            7. CONVERSATIONAL BOOKING FORM (Mad-Libs Style from Unifato)
            ========================================================================= */}
        <section className="relative py-24 sm:py-36 overflow-hidden bg-[#182224]">
          
          {/* Background image & dark overlays */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://unifato.com/eventplan/images/blog/event-book-01.avif" 
              alt="Event Booking Backdrop" 
              className="w-full h-full object-cover brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-[#182224]/75" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="mb-12 sm:mb-16">
              <h2 className="text-4xl md:text-6xl lg:text-[80px] font-bold font-display text-white tracking-wider leading-[1.1]">
                Book your event<br />with EventPlan
              </h2>
            </div>

            {formState.submitted ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-black/80 border border-[#A3C6C4]/40 max-w-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#A3C6C4] mx-auto" />
                <h3 className="text-2xl font-bold font-display text-white">Your Request Has Been Received!</h3>
                <p className="text-white/80 text-base">
                  Thank you, <strong className="text-[#A3C6C4]">{formState.name || 'Organizer'}</strong>. Our event architects will contact you within 24 hours with a comprehensive proposal.
                </p>
                <button
                  onClick={onOpenRegisterCompany}
                  className="mt-4 px-6 py-3 rounded-xl bg-[#A3C6C4] text-black font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Create Your Company Workspace Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-y-8 sm:gap-y-12 max-w-5xl">
                
                {/* Row 1: Hello I'm ___ from ___ based in ___ */}
                <div className="flex md:flex-row flex-col flex-wrap md:items-center items-start gap-4 text-white text-xl sm:text-2xl font-bold font-display">
                  <span>Hello I&apos;m</span>
                  <input 
                    type="text" 
                    placeholder="Frances Guerrero" 
                    required 
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#A3C6C4] focus:outline-none text-white placeholder-white/40 text-base font-normal px-4 py-2.5 min-w-[200px] transition-colors"
                  />
                  <span>from</span>
                  <input 
                    type="text" 
                    placeholder="ABC Tech Corp" 
                    required 
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#A3C6C4] focus:outline-none text-white placeholder-white/40 text-base font-normal px-4 py-2.5 min-w-[180px] transition-colors"
                  />
                  <span>based in</span>
                  <input 
                    type="text" 
                    placeholder="Accra / NYC" 
                    required 
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#A3C6C4] focus:outline-none text-white placeholder-white/40 text-base font-normal px-4 py-2.5 min-w-[140px] transition-colors"
                  />
                </div>

                {/* Row 2: and I'd like to book + checkboxes */}
                <div className="flex flex-col gap-4">
                  <span className="text-white text-xl sm:text-2xl font-bold font-display">
                    and I&apos;d like to book
                  </span>
                  <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
                    {[
                      "Team building events",
                      "Conferences",
                      "Gala dinners",
                      "Product launches",
                      "Seminars",
                      "Virtual events",
                      "Custom event"
                    ].map((type, idx) => (
                      <label key={idx} className="flex items-center gap-2 cursor-pointer bg-black/40 hover:bg-black/70 px-3.5 py-2 rounded-xl border border-white/10 transition-colors">
                        <input type="checkbox" name="event_type" defaultChecked={idx === 1} className="w-4 h-4 rounded accent-[#6C7A89]" />
                        <span className="text-white/90 font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Row 3: at ___ on ___ with ___ guests, */}
                <div className="flex md:flex-row flex-col flex-wrap md:items-center items-start gap-4 text-white text-xl sm:text-2xl font-bold font-display">
                  <span>at</span>
                  <input 
                    type="text" 
                    placeholder="Grand Hotel Ballroom" 
                    value={formState.venue}
                    onChange={(e) => setFormState({ ...formState, venue: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#A3C6C4] focus:outline-none text-white placeholder-white/40 text-base font-normal px-4 py-2.5 min-w-[220px] transition-colors"
                  />
                  <span>on</span>
                  <input 
                    type="text" 
                    placeholder="dd-mm-yyyy" 
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#A3C6C4] focus:outline-none text-white placeholder-white/40 text-base font-normal px-4 py-2.5 min-w-[140px] transition-colors"
                  />
                  <span>with</span>
                  <input 
                    type="text" 
                    placeholder="500+" 
                    value={formState.guests}
                    onChange={(e) => setFormState({ ...formState, guests: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#A3C6C4] focus:outline-none text-white placeholder-white/40 text-base font-normal px-4 py-2.5 min-w-[100px] transition-colors"
                  />
                  <span>guests,</span>
                </div>

                {/* Row 4: Reach me via email and phone */}
                <div className="flex md:flex-row flex-col flex-wrap md:items-center items-start gap-4 text-white text-xl sm:text-2xl font-bold font-display">
                  <span>reach me via email at</span>
                  <input 
                    type="email" 
                    placeholder="hello@example.com" 
                    required 
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#A3C6C4] focus:outline-none text-white placeholder-white/40 text-base font-normal px-4 py-2.5 min-w-[220px] transition-colors"
                  />
                  <span>or phone at</span>
                  <input 
                    type="tel" 
                    placeholder="+233 24 123 4567" 
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="bg-black/50 border border-white/20 rounded-xl focus:border-[#A3C6C4] focus:outline-none text-white placeholder-white/40 text-base font-normal px-4 py-2.5 min-w-[180px] transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="btn-unifato group cursor-pointer"
                  >
                    <div className="btn-unifato-inner py-4 px-10 flex items-center gap-3">
                      <IridescentFlowerIcon className="w-6 h-6 object-contain group-hover:rotate-45 transition-transform duration-500" />
                      <span className="text-white text-lg font-semibold tracking-wide">
                        Send Booking Request
                      </span>
                    </div>
                  </button>
                </div>

              </form>
            )}

          </div>
        </section>

        {/* =========================================================================
            8. MULTI-DESK CHECK-IN & HARDWARE (Restyled for warm luxury theme)
            ========================================================================= */}
        <section id="features" className="py-24 sm:py-32 bg-black border-t border-white/5 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div>
                <span className="text-xs font-bold font-display text-[#A3C6C4] uppercase tracking-widest block mb-2">
                  Multi-Desk Scanner Coordination
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight leading-tight">
                  Turn Every Smartphone into a Sub-Second Wireless Badge Scanner.
                </h2>
                <p className="text-base text-white/70 mt-4 leading-relaxed font-normal">
                  Large conferences cannot afford entrance bottlenecks. EventPlan coordinates unlimited mobile entrance desks with zero native apps to install.
                </p>

                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[#A3C6C4]/20 text-[#A3C6C4] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white/80">
                      <strong className="text-white">1-Scan Usher Camera Setup:</strong> Event staff scan the master QR code to turn their phone into an instant check-in camera.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[#6C7A89]/20 text-[#6C7A89] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white/80">
                      <strong className="text-white">Duplicate Scan Prevention:</strong> Reused tickets alert ushers immediately with the previous desk name and exact timestamp.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[#354649]/20 text-[#354649] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white/80">
                      <strong className="text-white">Offline Queueing:</strong> Scans continue locally in IndexedDB if on-site Wi-Fi drops, auto-syncing when reconnected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Station Monitor Card */}
              <div className="rounded-3xl p-7 bg-[#182224] border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#A3C6C4] animate-pulse" />
                    <span className="font-bold text-white text-sm">Simultaneous Desks Active</span>
                  </div>
                  <span className="text-xs font-mono text-[#6C7A89]">Live Attendance: 88%</span>
                </div>

                <div className="space-y-3 mt-5">
                  {[
                    { desk: "Desk 1 – Main Gate (Kofi)", count: "142 scans", status: "Active" },
                    { desk: "Desk 2 – General Admission (Ama)", count: "119 scans", status: "Active" },
                    { desk: "Desk 3 – VIP & Keynotes (Sarah)", count: "48 scans", status: "Active" },
                    { desk: "Desk 4 – Fast Track QR", count: "33 scans", status: "Active" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-black border border-white/5 text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-[#A3C6C4]" />
                        <span className="font-medium text-white">{item.desk}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white/60">{item.count}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#A3C6C4]/10 text-[#A3C6C4]">
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
            9. SECURITY & RLS SECTION
            ========================================================================= */}
        <section className="py-24 bg-[#182224] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold font-display text-[#354649] uppercase tracking-widest block mb-2">
                PostgreSQL Row-Level Security
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
                Enterprise Multi-Tenant Confidentiality
              </h2>
              <p className="text-sm sm:text-base text-white/70 mt-3 font-normal">
                Every organization operates in an isolated tenant workspace. Cryptographic boundary enforcement guarantees complete confidentiality for attendee records, photos, and badge data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-7 rounded-2xl bg-black border border-white/5 space-y-4">
                <Database className="w-8 h-8 text-[#A3C6C4]" />
                <h3 className="text-lg font-bold font-display text-white">PostgreSQL RLS Policies</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                  Every query is tagged with a cryptographic <code className="text-[#A3C6C4]">tenant_id</code>. Database engine policies reject cross-tenant data leakage.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-black border border-white/5 space-y-4">
                <FileCheck2 className="w-8 h-8 text-[#6C7A89]" />
                <h3 className="text-lg font-bold font-display text-white">Ghana Act 843 Data Compliance</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                  Statutory privacy standards. Every attendee explicitly consents to portrait badge capture and data handling with audit logs.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-black border border-white/5 space-y-4">
                <WifiOff className="w-8 h-8 text-[#354649]" />
                <h3 className="text-lg font-bold font-display text-white">Offline IndexedDB Sync</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                  Venues with spotty Wi-Fi never lose a scan. IndexedDB stores attendance locally and securely auto-synchronizes when connectivity restores.
                </p>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* =========================================================================
          10. FOOTER
          ========================================================================= */}
      <footer className="border-t border-white/10 bg-black py-16 text-xs sm:text-sm text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <EventPlanLogo className="w-10 h-10" />
                <span className="font-bold font-display text-white text-xl">EventPlan</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-normal">
                Precision planning for perfect corporate events. Cloud-hosted multi-tenant registration, badging, and multi-desk check-in platform.
              </p>
            </div>

            <div>
              <p className="font-bold font-display text-white text-base mb-4">Services</p>
              <ul className="space-y-2.5">
                <li><a href="#services" className="hover:text-white transition-colors">Team Building Events</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Conferences & Summits</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Product Launches</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Gala Dinners</a></li>
              </ul>
            </div>

            <div>
              <p className="font-bold font-display text-white text-base mb-4">Portals & Sign In</p>
              <ul className="space-y-2.5">
                <li>
                  <button onClick={onOpenLogin} className="hover:text-[#6C7A89] text-left transition-colors">
                    Company Organizer Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onOpenLogin} className="hover:text-[#A3C6C4] text-left transition-colors">
                    Platform Super-Admin Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onOpenRegisterCompany} className="hover:text-[#E0E7E9] text-left transition-colors">
                    Register a New Company Workspace
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold font-display text-white text-base mb-4">Compliance</p>
              <p className="text-xs text-white/70 leading-relaxed font-normal">
                Ghana Act 843 Data Protection Compliant. Row-Level Security guarantees cross-tenant isolation on all stored attendee photos and contact records.
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 EventPlan. All rights reserved.</p>
            <div className="flex items-center gap-4 text-white/60">
              <span className="text-[#A3C6C4]">Multi-Tenancy Architecture</span>
              <span>•</span>
              <span className="text-[#6C7A89]">PostgreSQL RLS Protected</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
