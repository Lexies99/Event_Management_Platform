import React, { useState } from 'react';
import { X, Building2, Palette, User, Mail, Calendar, CheckCircle2, Copy, Sparkles, Upload } from 'lucide-react';

const BRAND_PALETTES = [
  { name: "Indigo Tech", color: "#4f46e5" },
  { name: "Emerald Health", color: "#059669" },
  { name: "Amber FinTech", color: "#d97706" },
  { name: "Royal Purple", color: "#7c3aed" },
  { name: "Crimson Media", color: "#e11d48" },
  { name: "Ocean Cyan", color: "#0891b2" }
];

const PRESET_LOGOS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&auto=format&fit=crop&q=80"
];

export default function NewTenantModal({ isOpen, onClose, onCreated, plans }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!createdTenant ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Onboard New Company Workspace</h3>
                <p className="text-xs text-slate-400">Step 1-4: Create isolated tenant, provision organizer account & generate invite link</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Company Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Zenith Global Technologies"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tenant Slug (Subdomain)
                  </label>
                  <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-400">
                    <span className="text-xs text-slate-500">https://</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      placeholder="zenith"
                      className="bg-transparent text-white px-1 focus:outline-none text-sm w-full font-mono"
                    />
                    <span className="text-xs text-slate-500">.eventflow.app</span>
                  </div>
                </div>
              </div>

              {/* Brand Color & Logo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" /> Brand Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    {BRAND_PALETTES.map((p) => (
                      <button
                        type="button"
                        key={p.color}
                        onClick={() => setBrandColor(p.color)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          brandColor === p.color ? 'scale-125 border-white ring-2 ring-indigo-500' : 'border-transparent hover:scale-110'
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-indigo-400" /> Company Logo
                  </label>
                  <div className="flex items-center gap-3">
                    <img 
                      src={logoUrl} 
                      alt="Preview" 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700" 
                    />
                    <div className="flex gap-1.5">
                      {PRESET_LOGOS.map((url, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setLogoUrl(url)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border ${logoUrl === url ? 'ring-2 ring-indigo-500 border-white' : 'border-slate-700 opacity-60 hover:opacity-100'}`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Organizer Assignment */}
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" /> Event Organizer (Tenant Admin)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Organizer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Organizer Business Email *</label>
                    <input
                      type="email"
                      required
                      value={organizerEmail}
                      onChange={(e) => setOrganizerEmail(e.target.value)}
                      placeholder="e.g. kwame@zenith.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Subscription Plan Selection */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Rental Subscription Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className={`cursor-pointer p-3 rounded-xl border text-left transition-all ${
                        planId === p.id 
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg' 
                          : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-white">{p.name}</span>
                        <span className="text-xs font-semibold text-indigo-400">${p.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-1.5">{p.limits.attendees} attendees max</p>
                      <span className="text-[10px] text-slate-500">{p.billingPeriod}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Provision Workspace & Generate Link
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Tenant Successfully Created Screen */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Company Workspace Created!</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                <strong className="text-white">{createdTenant.name}</strong> is now live with isolated database tenant space and custom branding.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-left space-y-3 max-w-lg mx-auto">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Private Organizer Link</span>
                <span className="text-emerald-400 font-semibold">Active & Secured</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={tenantLink}
                  className="bg-transparent text-xs text-white font-mono w-full focus:outline-none"
                />
                <button
                  onClick={copyLink}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedLink ? "Copied!" : "Copy Link"}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Send this link to <strong className="text-slate-200">{createdTenant.organizer.name}</strong> ({createdTenant.organizer.email}). They will use it to access their private event portal.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setCreatedTenant(null);
                  onClose();
                }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close & View Workspace
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
