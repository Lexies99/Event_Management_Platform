import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Mail, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Palette,
  Upload
} from 'lucide-react';

/* Reusable Unifato Monogram Logo */
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
      <path d="M141.776 61.5093C143.944 68.2126 141.146 78.5468 140.517 79.8502C137.16 87.019 130.097 91.674 122.545 91.674C119.887 91.5809 117.23 91.1154 114.712 89.9982L114.013 89.7189C112.265 88.7879 110.447 88.3224 108.558 88.1362C106.67 88.1362 104.852 89.0672 103.453 90.743L103.034 91.2085V117.37H88.0685V52.3854H130.307C135.132 52.1061 139.678 55.737 141.776 61.5093ZM126.391 75.2882C126.95 71.2849 126.741 65.2333 124.083 61.6024C122.335 59.5542 120.027 58.5301 117.649 58.8094C114.153 58.8094 110.447 58.7163 106.6 58.7163H103.034V83.7604L104.642 83.0156C106.041 82.1777 107.649 81.8984 109.188 81.8984C110.936 81.9915 112.754 82.3639 114.433 83.0156L115.901 83.4811C117.16 83.9466 118.489 84.319 119.887 84.4121C123.803 84.4121 125.692 79.9433 126.391 75.2882Z" fill="#182224"/>
      <path d="M50.077 60.9507L49.2378 60.4852V80.3157H71.2663V88.1361H49.2378V109.549H78.7489V117.277H33.5033V52.3854H49.7274C51.7554 53.7819 53.9233 54.6198 56.231 54.7129C56.5807 54.806 56.9303 54.806 57.28 54.806C59.1681 54.7129 61.1262 54.4336 62.9444 53.7819C63.364 53.6888 63.9235 53.5026 64.5528 53.3164C66.441 52.6647 68.3991 52.1992 70.3572 52.013C70.9166 51.9199 71.546 51.9199 72.2453 51.9199C74.4132 51.9199 76.5811 52.1061 78.7489 52.4785V60.299C76.5811 59.9266 74.4132 59.7404 72.2453 59.7404C69.7977 59.7404 67.6298 60.299 65.2522 61.0438L64.0633 61.4162C63.9235 61.5093 63.7137 61.5093 63.5039 61.6024C61.4059 62.161 59.238 62.5334 57.0002 62.6265C54.6226 62.6265 52.3148 62.0679 50.077 60.9507Z" fill="#182224"/>
    </svg>
  );
}

const BRAND_PALETTES = [
  { name: "Champagne Gold", color: "#A3C6C4" },
  { name: "Warm Coral", color: "#6C7A89" },
  { name: "Mauve Plum", color: "#354649" },
  { name: "Butter Glow", color: "#E0E7E9" },
  { name: "Emerald Green", color: "#10B981" },
  { name: "Classic Navy", color: "#3B82F6" }
];

const PRESET_LOGOS = [
  { name: "Tech Wave", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80" },
  { name: "Global Pulse", url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=160&auto=format&fit=crop&q=80" },
  { name: "Modern Dynamics", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80" },
  { name: "Eco Sphere", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&auto=format&fit=crop&q=80" }
];

export default function CompanyRegistrationModal({
  isOpen,
  onClose,
  onCompanyRegistered,
  plans = []
}) {
  const [step, setStep] = useState(1); // 1: Company & Brand, 2: Event Details, 3: Organizer Contact, 4: Plan, 5: Success
  const [companyName, setCompanyName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandColor, setBrandColor] = useState(BRAND_PALETTES[0].color);
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0].url);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTagline, setEventTagline] = useState('');
  const [eventVenue, setEventVenue] = useState('Accra International Conference Centre');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [capacity, setCapacity] = useState(350);
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [planId, setPlanId] = useState('growth');
  
  // Completed result state
  const [registeredTenant, setRegisteredTenant] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyNameChange = (e) => {
    const val = e.target.value;
    setCompanyName(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
    if (!eventTitle) {
      setEventTitle(val ? `${val} Annual Summit 2026` : '');
    }
    if (!eventTagline) {
      setEventTagline("Innovating the Future Together");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert("Please provide a company name.");
      setStep(1);
      return;
    }
    if (!organizerName.trim() || !organizerEmail.trim()) {
      alert("Please provide the organizer's name and work email.");
      setStep(3);
      return;
    }

    const newTenant = onCompanyRegistered({
      name: companyName,
      slug: slug || `company-${Date.now()}`,
      brandColor,
      logoUrl,
      planId,
      organizerName,
      organizerEmail,
      eventTitle: eventTitle || `${companyName} Summit 2026`,
      eventTagline: eventTagline || "Connecting Pioneers",
      eventVenue,
      capacity: Number(capacity) || 300
    });

    setRegisteredTenant(newTenant);
    setStep(5);
  };

  const companyPortalLink = registeredTenant
    ? `${window.location.origin}/?tenant=${registeredTenant.slug}&role=organizer`
    : '';

  const attendeeRegLink = registeredTenant
    ? `${window.location.origin}/?tenant=${registeredTenant.slug}&role=attendee&register=true`
    : '';

  const copyCompanyLink = () => {
    navigator.clipboard.writeText(companyPortalLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* Iridescent Border Container using user's 4 colors */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#354649] via-[#6C7A89] to-[#A3C6C4] p-[1.5px] rounded-3xl shadow-[0_0_50px_rgba(251,147,120,0.25)] my-6">
        
        {/* Modal Interior with Warm #182224 Background */}
        <div className="relative w-full bg-[#182224] rounded-[22.5px] p-6 sm:p-8 text-white flex flex-col max-h-[92vh]">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 mb-6 shrink-0">
            <EventPlanMonogram className="w-12 h-12 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                  Register Your Company Workspace
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#A3C6C4]/15 text-[#A3C6C4] border border-[#A3C6C4]/30 uppercase tracking-wider font-display">
                  Instant Setup
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5 font-normal">
                Launch your isolated corporate event workspace with automated photo registration, badge printing & live check-in.
              </p>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {step < 5 && (
            <div className="flex items-center justify-between mb-6 shrink-0 bg-black/50 p-1.5 rounded-2xl border border-white/10">
              {[
                { num: 1, label: "Company & Brand" },
                { num: 2, label: "Event Setup" },
                { num: 3, label: "Organizer Admin" },
                { num: 4, label: "Plan & Launch" }
              ].map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold font-display transition-all cursor-pointer ${
                    step === s.num
                      ? 'bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] shadow-md font-bold'
                      : step > s.num
                      ? 'text-[#A3C6C4]'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step === s.num ? 'bg-black text-white' : step > s.num ? 'bg-[#A3C6C4]/20 text-[#A3C6C4]' : 'bg-white/10 text-white/50'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 pr-1 space-y-5">
            
            {/* STEP 1: COMPANY & BRAND */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-1.5">
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={handleCompanyNameChange}
                    placeholder="e.g. Apex Global Innovations"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#A3C6C4] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-1.5">
                    Private Workspace Slug & URL
                  </label>
                  <div className="flex items-center bg-black/60 border border-white/15 rounded-xl overflow-hidden focus-within:border-[#A3C6C4]">
                    <span className="px-3.5 text-xs text-white/40 font-mono">/?tenant=</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                      placeholder="apex-innovations"
                      className="flex-1 bg-transparent py-3 pr-4 text-sm text-[#A3C6C4] font-mono focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-white/50 mt-1 font-normal">
                    This will be your company&apos;s dedicated isolated workspace domain.
                  </p>
                </div>

                {/* Brand Palette */}
                <div>
                  <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#A3C6C4]" /> Company Brand Color Theme
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {BRAND_PALETTES.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setBrandColor(p.color)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                          brandColor === p.color
                            ? 'border-white bg-black/80 text-white shadow-lg'
                            : 'border-white/10 bg-black/40 text-white/60 hover:border-white/30'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full shadow-inner border border-white/20" style={{ backgroundColor: p.color }} />
                        <span className="text-[10px] truncate max-w-full font-medium">{p.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Custom Company Icon / Logo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider">
                      Company Icon / Logo *
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">PNG, JPG, SVG up to 5MB</span>
                  </div>

                  <div className="p-4 bg-black/50 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group shrink-0">
                      <img 
                        src={logoUrl} 
                        alt="Company Logo Preview" 
                        className="w-16 h-16 rounded-2xl object-cover border-2 shadow-lg"
                        style={{ borderColor: brandColor }}
                      />
                      <div 
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-black text-[10px] font-bold shadow"
                        style={{ backgroundColor: brandColor }}
                      >
                        ✓
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <p className="text-xs font-bold text-white font-display">
                        Upload your official company brand icon:
                      </p>
                      <p className="text-[11px] text-white/60 leading-snug font-normal">
                        This icon will appear on all attendee digital tickets, printed lanyard name badges, and the company portal.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold text-xs shadow-md transition-all active:scale-95">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Custom Icon File</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoUpload}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Preset Starter Icons */}
                  <div className="pt-2">
                    <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block mb-2 font-display">
                      Or select a starter icon preset:
                    </span>
                    <div className="grid grid-cols-4 gap-2.5">
                      {PRESET_LOGOS.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLogoUrl(item.url)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                            logoUrl === item.url
                              ? 'border-[#A3C6C4] bg-[#A3C6C4]/15'
                              : 'border-white/10 bg-black/40 hover:border-white/20'
                          }`}
                        >
                          <img src={item.url} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-[9px] text-white/60 truncate max-w-full font-medium">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    disabled={!companyName.trim()}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] hover:opacity-95 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-40"
                  >
                    <span>Continue to Event Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EVENT SETUP */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-1.5">
                    First Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Apex Global Tech Summit 2026"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#A3C6C4] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-1.5">
                    Tagline / Theme
                  </label>
                  <input
                    type="text"
                    value={eventTagline}
                    onChange={(e) => setEventTagline(e.target.value)}
                    placeholder="e.g. Uniting Visionaries and Industry Pioneers"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#A3C6C4] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-1.5">
                      Venue / Location
                    </label>
                    <input
                      type="text"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      placeholder="Accra International Conference Centre"
                      className="w-full bg-black/60 border border-white/15 focus:border-[#A3C6C4] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-1.5">
                      Expected Delegate Capacity
                    </label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      min="10"
                      max="5000"
                      className="w-full bg-black/60 border border-white/15 focus:border-[#A3C6C4] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white/80 hover:text-white font-semibold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] hover:opacity-95 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                  >
                    <span>Continue to Organizer Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORGANIZER ADMIN */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-1.5">
                    Lead Organizer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="e.g. Dr. Kwame Mensah"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#A3C6C4] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-display text-white/80 uppercase tracking-wider mb-1.5">
                    Official Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    placeholder="kwame.mensah@apex.com"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#A3C6C4] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-white/30"
                  />
                  <p className="text-[11px] text-white/50 mt-1 font-normal">
                    You will receive access credentials and attendee check-in summaries here.
                  </p>
                </div>

                <div className="bg-[#354649]/15 border border-[#354649]/30 rounded-2xl p-4 text-xs text-white/80 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#354649] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5 font-display">Strict Multi-Tenant Isolation Guarantee</p>
                    <p className="text-white/70 text-[11px] leading-relaxed font-normal">
                      Your company workspace is completely segregated with PostgreSQL Row-Level Security. No other tenant can view your registrant lists, photos, or badges.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white/80 hover:text-white font-semibold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!organizerName.trim() || !organizerEmail.trim()}
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] hover:opacity-95 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-40"
                  >
                    <span>Choose Plan & Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PLAN & REVIEW */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="text-xs text-white/80 font-bold font-display mb-2">
                  Select your company rental plan (free instant trial included):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'starter', name: 'Starter', price: '$99/mo', desc: 'Up to 200 attendees, optical QR scanner, badges' },
                    { id: 'growth', name: 'Growth (Popular)', price: '$199/mo', desc: 'Up to 1,000 attendees, sub-second scanning, live chat, CSV export' },
                    { id: 'enterprise', name: 'Enterprise', price: '$499/mo', desc: 'Unlimited capacity, SLA, VIP credentials, custom domains' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlanId(p.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        planId === p.id
                          ? 'border-[#A3C6C4] bg-[#A3C6C4]/15 shadow-xl'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-xs font-display">{p.name}</span>
                          {planId === p.id && <CheckCircle2 className="w-4 h-4 text-[#A3C6C4]" />}
                        </div>
                        <p className="text-sm font-extrabold text-[#A3C6C4] mb-2 font-display">{p.price}</p>
                        <p className="text-[11px] text-white/60 leading-snug font-normal">{p.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Review summary box */}
                <div className="bg-black/50 p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/50 font-normal">Company:</span>
                    <span className="font-bold text-white font-display">{companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-normal">Event:</span>
                    <span className="font-bold text-[#A3C6C4] font-display">{eventTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-normal">Lead Organizer:</span>
                    <span className="font-medium text-white/90">{organizerName} ({organizerEmail})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-normal">Subdomain:</span>
                    <span className="font-mono text-[#6C7A89] font-bold">/{slug}</span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white/80 hover:text-white font-semibold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] hover:opacity-95 text-black font-extrabold text-sm shadow-xl transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Provision & Launch Workspace</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REGISTRATION COMPLETE / SUCCESS */}
            {step === 5 && registeredTenant && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-[#A3C6C4]/20 border border-[#A3C6C4]/30 text-[#A3C6C4] flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Workspace Successfully Provisioned!
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-md mx-auto font-normal">
                    <strong className="text-white">{registeredTenant.name}</strong> is now live on EventPlan with isolated row-level security.
                  </p>
                </div>

                {/* Private Links Box */}
                <div className="bg-black/60 border border-white/10 rounded-2xl p-4 text-left space-y-3 max-w-lg mx-auto">
                  <div>
                    <p className="text-[11px] font-bold font-display text-white/60 uppercase tracking-wider mb-1">
                      Your Private Company Organizer Portal:
                    </p>
                    <div className="flex items-center justify-between gap-2 bg-[#182224] border border-white/10 p-2.5 rounded-xl">
                      <span className="font-mono text-xs text-[#A3C6C4] truncate">{companyPortalLink}</span>
                      <button
                        type="button"
                        onClick={copyCompanyLink}
                        className="text-xs text-white/80 hover:text-white flex items-center gap-1 font-bold shrink-0 bg-white/10 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedLink ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold font-display text-white/60 uppercase tracking-wider mb-1">
                      Public Attendee Registration URL:
                    </p>
                    <div className="bg-[#182224] border border-white/10 p-2 rounded-xl text-xs font-mono text-[#6C7A89] truncate">
                      {attendeeRegLink}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] hover:opacity-95 text-black font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Open Organizer Dashboard Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>
      </div>

    </div>
  );
}
