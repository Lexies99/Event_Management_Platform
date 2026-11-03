import React, { useState } from 'react';
import { X, Building2, Palette, User, Mail, Calendar, CheckCircle2, Copy, Sparkles, Upload, Check } from 'lucide-react';

const BRAND_PALETTES = [
  { name: "Mauve Plum", color: "#AB6088" },
  { name: "Warm Coral", color: "#FB9378" },
  { name: "Champagne Gold", color: "#E0C97E" },
  { name: "Butter Vanilla", color: "#FCF8B3" },
  { name: "Emerald Pro", color: "#10b981" },
  { name: "Electric Navy", color: "#3b82f6" }
];

export default function NewTenantModal({ isOpen, onClose, onCreated, plans }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandColor, setBrandColor] = useState('#AB6088');
  const [logoUrl, setLogoUrl] = useState('');
  const [planId, setPlanId] = useState('growth');
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventVenue, setEventVenue] = useState('Accra International Conference Centre');
  const [createdTenant, setCreatedTenant] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSlug(autoSlug);
    if (!eventTitle) {
      setEventTitle(val ? `${val} Annual Summit 2026` : '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !organizerEmail.trim() || !organizerName.trim()) {
      alert("Please enter company name, organizer name, and organizer email.");
      return;
    }

    const tenant = onCreated({
      name,
      slug: slug || `company-${Date.now()}`,
      brandColor,
      logoUrl,
      planId,
      organizerName,
      organizerEmail,
      eventTitle,
      eventVenue
    });

    setCreatedTenant(tenant);
  };

  const tenantLink = createdTenant 
    ? `${window.location.origin}/?tenant=${createdTenant.slug}` 
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(tenantLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1c1c1b] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!createdTenant ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black rounded-2xl shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xl text-white">Onboard New Company Workspace</h3>
                <p className="text-xs text-white/50">Provision isolated tenant, organizer credentials & custom brand identity</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Company Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Zenith Global Technologies"
                    className="w-full bg-[#141413] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Tenant Slug (Subdomain)
                  </label>
                  <div className="flex items-center bg-[#141413] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/40">
                    <span className="text-xs text-white/40 font-mono">/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      placeholder="zenith"
                      className="bg-transparent text-[#FCF8B3] px-1 focus:outline-none text-xs w-full font-mono font-bold"
                    />
                    <span className="text-[11px] text-white/40 font-mono">• isolated</span>
                  </div>
                </div>
              </div>

              {/* Brand Color & Identity */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-semibold text-white/80 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#E0C97E]" /> Select Company Brand Accent
                </label>
                <div className="flex items-center gap-2">
                  {BRAND_PALETTES.map((p) => (
                    <button
                      type="button"
                      key={p.color}
                      onClick={() => setBrandColor(p.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        brandColor === p.color ? 'scale-125 border-white ring-2 ring-[#FB9378]' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: p.color }}
                      title={p.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Custom HEX Color"
                  />
                </div>
              </div>

              {/* Event Organizer Assignment */}
              <div className="pt-2 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold text-[#FCF8B3] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FB9378]" /> Event Organizer (Tenant Admin)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Organizer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full bg-[#141413] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Organizer Business Email *</label>
                    <input
                      type="email"
                      required
                      value={organizerEmail}
                      onChange={(e) => setOrganizerEmail(e.target.value)}
                      placeholder="e.g. kwame@zenith.com"
                      className="w-full bg-[#141413] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Event Setup */}
              <div className="pt-2 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold text-[#FCF8B3] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E0C97E]" /> Flagship Event Configuration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Event Title</label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="e.g. Zenith Annual Technology Summit 2026"
                      className="w-full bg-[#141413] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Venue / City</label>
                    <input
                      type="text"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      placeholder="e.g. Accra International Conference Centre"
                      className="w-full bg-[#141413] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
                    />
                  </div>
                </div>
              </div>

              {/* Subscription Plan Selection */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Select Subscription Plan Tier:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        planId === p.id 
                          ? 'border-[#FB9378] bg-[#FB9378]/15 shadow-md shadow-[#FB9378]/15' 
                          : 'border-white/10 bg-[#141413] hover:border-white/20'
                      }`}
                    >
                      <span className="font-heading font-bold text-xs text-white block">{p.name}</span>
                      <span className="font-extrabold text-[#FCF8B3] text-sm">${p.price}</span>
                      <span className="text-[10px] text-white/40">/{p.billingPeriod}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black shadow-lg shadow-[#FB9378]/25 hover:opacity-95 transition-all"
                >
                  Provision Workspace
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400">
                Workspace Provisioned
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-white mt-1">
                {createdTenant.name}
              </h3>
              <p className="text-xs text-white/50 mt-1 max-w-md mx-auto">
                Company workspace created with isolated row-level security. Organizer credentials generated for {organizerEmail}.
              </p>
            </div>

            <div className="bg-[#141413] border border-white/10 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between text-xs text-white/60">
                <span>Tenant Slug:</span>
                <span className="font-mono text-[#FCF8B3] font-bold">/{createdTenant.slug}</span>
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>Admin Organizer:</span>
                <span className="text-white font-medium">{organizerName}</span>
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>Direct Access Link:</span>
                <span className="font-mono text-[#FB9378] text-[11px] truncate max-w-[200px]">{tenantLink}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={copyLink}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#252523] hover:bg-[#2e2e2b] text-white border border-white/15 flex items-center gap-2 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E0C97E]" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Private Link"}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black shadow-lg shadow-[#FB9378]/20 hover:opacity-95 transition-all"
              >
                Close & Enter Fleet
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
