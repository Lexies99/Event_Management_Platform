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
  Zap,
  Globe,
  Palette,
  Upload
} from 'lucide-react';

const BRAND_PALETTES = [
  { name: "Indigo Tech", color: "#4f46e5" },
  { name: "Emerald Health", color: "#059669" },
  { name: "Amber FinTech", color: "#d97706" },
  { name: "Royal Purple", color: "#7c3aed" },
  { name: "Crimson Media", color: "#e11d48" },
  { name: "Ocean Cyan", color: "#0891b2" }
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
    setStep(5); // Success step
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
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-6 text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Register Your Company</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Instant Self-Service
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Launch your isolated corporate event workspace with automated photo registration, badge printing & live check-in.
            </p>
          </div>
        </div>

        {/* Stepper Progress Bar (Only during steps 1 to 4) */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-6 shrink-0 bg-slate-950/60 p-2 rounded-2xl border border-slate-800/80">
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
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  step === s.num
                    ? 'bg-indigo-600 text-white shadow-md'
                    : step > s.num
                    ? 'text-emerald-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num ? 'bg-white text-indigo-900' : step > s.num ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
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
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={handleCompanyNameChange}
                  placeholder="e.g. Apex Global Innovations"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Private Workspace Slug & URL
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-indigo-500">
                  <span className="px-3.5 text-xs text-slate-500 font-mono">https://eventflow.cloud/?tenant=</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                    placeholder="apex-innovations"
                    className="flex-1 bg-transparent py-3 pr-4 text-sm text-indigo-400 font-mono focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">This will be your company's dedicated isolated workspace domain.</p>
              </div>

              {/* Brand Palette */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" /> Company Brand Color Theme
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {BRAND_PALETTES.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setBrandColor(p.color)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                        brandColor === p.color
                          ? 'border-white bg-slate-800 text-white shadow-lg'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: p.color }} />
                      <span className="text-[10px] truncate max-w-full font-medium">{p.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Custom Company Icon / Logo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Company Icon / Logo *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">PNG, JPG, SVG up to 5MB</span>
                </div>

                {/* Upload Action Box */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                  {/* Current Icon Preview */}
                  <div className="relative group shrink-0">
                    <img 
                      src={logoUrl} 
                      alt="Company Logo Preview" 
                      className="w-16 h-16 rounded-2xl object-cover border-2 shadow-lg"
                      style={{ borderColor: brandColor }}
                    />
                    <div 
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow"
                      style={{ backgroundColor: brandColor }}
                    >
                      ✓
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <p className="text-xs font-bold text-white">
                      Upload your official company brand icon:
                    </p>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      This icon will appear on all attendee digital tickets, printed thermal name badges, and the company portal.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Icon File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload}
                          className="hidden" 
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">or pick a starter icon below</span>
                    </div>
                  </div>
                </div>

                {/* Preset Starter Icons */}
                <div className="pt-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Or select a starter icon preset:
                  </span>
                  <div className="grid grid-cols-4 gap-2.5">
                    {PRESET_LOGOS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLogoUrl(item.url)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                          logoUrl === item.url
                            ? 'border-indigo-500 bg-indigo-500/15'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <img src={item.url} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-[9px] text-slate-400 truncate max-w-full">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!companyName.trim()}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Continue to Event Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EVENT SETUP */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  First Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Apex Global Tech Summit 2026"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tagline / Theme
                </label>
                <input
                  type="text"
                  value={eventTagline}
                  onChange={(e) => setEventTagline(e.target.value)}
                  placeholder="e.g. Uniting Visionaries and Industry Pioneers"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="Accra International Conference Centre"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Expected Delegate Capacity
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="10"
                    max="5000"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Continue to Organizer Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORGANIZER ADMIN */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Lead Organizer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="e.g. Dr. Kwame Mensah"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="kwame.mensah@apex.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  You will receive access credentials and attendee check-in summaries here.
                </p>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-0.5">Strict Multi-Tenant Isolation Guarantee</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Your company workspace is completely segregated. No other tenant or third party can access your registrant lists, photos, or badges.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!organizerName.trim() || !organizerEmail.trim()}
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Choose Plan & Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PLAN & REVIEW */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs text-slate-300 font-semibold mb-2">
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
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      planId === p.id
                        ? 'border-indigo-500 bg-indigo-600/15 shadow-xl'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-xs">{p.name}</span>
                        {planId === p.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <p className="text-sm font-extrabold text-cyan-400 mb-2">{p.price}</p>
                      <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Review summary box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Company:</span>
                  <span className="font-bold text-white">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Event:</span>
                  <span className="font-bold text-indigo-300">{eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Organizer:</span>
                  <span className="font-bold text-slate-200">{organizerName} ({organizerEmail})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subdomain:</span>
                  <span className="font-mono text-cyan-400 font-bold">/{slug}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Provision & Launch Workspace</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REGISTRATION COMPLETE / SUCCESS */}
          {step === 5 && registeredTenant && (
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Workspace Successfully Provisioned!</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  <strong>{registeredTenant.name}</strong> is now live on EventFlow with isolated row-level security.
                </p>
              </div>

              {/* Private Links Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3 max-w-lg mx-auto">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Your Private Company Organizer Portal:
                  </p>
                  <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <span className="font-mono text-xs text-cyan-300 truncate">{companyPortalLink}</span>
                    <button
                      type="button"
                      onClick={copyCompanyLink}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold shrink-0 bg-slate-800 px-2.5 py-1 rounded-lg"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Public Attendee Registration URL:
                  </p>
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs font-mono text-emerald-400 truncate">
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
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
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
  );
}
