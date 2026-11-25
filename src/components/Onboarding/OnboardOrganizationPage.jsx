import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Globe,
  Moon,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sun,
  Upload,
} from 'lucide-react';
import {
  DEFAULT_BRANDING,
  PRESET_PALETTES,
  evaluatePaletteContrast,
  getAccessibleTextColor,
  isValidHex,
} from '../../utils/branding';

export default function OnboardOrganizationPage({
  tenants = [],
  plans = [],
  theme = 'light',
  onToggleTheme,
  onBack,
  onCompanyRegistered,
  onOpenEventSite,
  onOpenTerms,
}) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [eventTitle, setEventTitle] = useState('');
  const [eventTagline, setEventTagline] = useState('Connecting Leaders, Innovators & Delegates');
  const [eventVenue, setEventVenue] = useState('Accra International Conference Centre');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [capacity, setCapacity] = useState(350);

  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerPassword, setOrganizerPassword] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [planId, setPlanId] = useState('growth');

  const [primaryColor, setPrimaryColor] = useState(DEFAULT_BRANDING.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_BRANDING.secondaryColor);
  const [accentColor, setAccentColor] = useState(DEFAULT_BRANDING.accentColor);
  const [neutralColor, setNeutralColor] = useState(DEFAULT_BRANDING.neutralColor);
  const [logoPreview, setLogoPreview] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState('');
  const [createdTenant, setCreatedTenant] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (slugManuallyEdited) return;
    const src = shortName.trim() || name.trim();
    const auto = src
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
    setSlug(auto);
  }, [name, shortName, slugManuallyEdited]);

  useEffect(() => {
    if (name.trim() && !eventTitle) {
      setEventTitle(`${name.trim()} Annual Summit 2026`);
    }
  }, [name]);

  const slugTaken = useMemo(() => {
    const clean = slug.trim().toLowerCase();
    if (!clean) return false;
    return tenants.some((t) => t.slug.toLowerCase() === clean);
  }, [slug, tenants]);

  const contrast = useMemo(
    () => evaluatePaletteContrast({ primaryColor, secondaryColor, accentColor, neutralColor }),
    [primaryColor, secondaryColor, accentColor, neutralColor]
  );

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('Logo image must be 3 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const resetBranding = () => {
    setPrimaryColor(DEFAULT_BRANDING.primaryColor);
    setSecondaryColor(DEFAULT_BRANDING.secondaryColor);
    setAccentColor(DEFAULT_BRANDING.accentColor);
    setNeutralColor(DEFAULT_BRANDING.neutralColor);
    setLogoPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !slug.trim()) {
      setError('Please enter your Organization Name and Web Address Slug.');
      return;
    }
    if (slugTaken) {
      setError(`The web address "/${slug}" is already in use. Please choose another slug.`);
      return;
    }
    if (!organizerName.trim() || !organizerEmail.trim()) {
      setError('Please enter the Lead Organizer Name and Email.');
      return;
    }
    if (!isValidHex(primaryColor) || !isValidHex(secondaryColor) || !isValidHex(accentColor)) {
      setError('All brand colours must be valid 6-digit HEX codes (e.g. #5A6552).');
      return;
    }
    if (!termsAccepted) {
      setError('Please review and accept the Terms & Conditions before creating your event website.');
      return;
    }

    try {
      const tenant = await onCompanyRegistered({
        name: name.trim(),
        shortName: shortName.trim() || name.trim().slice(0, 24),
        slug: slug.trim().toLowerCase(),
        primaryColor: primaryColor.toUpperCase(),
        secondaryColor: secondaryColor.toUpperCase(),
        accentColor: accentColor.toUpperCase(),
        neutralColor: neutralColor.toUpperCase(),
        logoUrl: logoPreview,
        planId,
        organizerName: organizerName.trim(),
        organizerEmail: organizerEmail.trim(),
        organizerPassword: organizerPassword.trim() || 'organizer123',
        contactPhone: contactPhone.trim(),
        eventTitle: eventTitle.trim() || `${name.trim()} Annual Summit 2026`,
        eventTagline: eventTagline.trim(),
        eventVenue: eventVenue.trim(),
        eventDate,
        capacity: Number(capacity) || 350,
        termsAccepted: true,
      });
      setCreatedTenant(tenant);
    } catch (err) {
      setError(err.message || 'Could not create event workspace.');
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://events.manamatechnologies.com';
  const dedicatedUrl = createdTenant ? `${origin}/#/${createdTenant.slug}` : `${origin}/#/${slug || 'your-event'}`;
  const headerText = getAccessibleTextColor(secondaryColor);
  const primaryBtnText = getAccessibleTextColor(primaryColor);

  if (createdTenant) {
    return (
      <div className="min-h-screen px-4 py-10 sm:py-16" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <div className="fp-card max-w-xl mx-auto p-6 sm:p-10 text-center space-y-5">
          <CheckCircle2 className="w-14 h-14 mx-auto" style={{ color: 'var(--fp-green)' }} />
          <div>
            <span className="fp-tag-sage mb-2">Dedicated Event Website Live</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold m-0">
              {createdTenant.name} Is Ready!
            </h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Your isolated event portal has been provisioned with custom branding, attendee registration, check-in station (Default Staff PIN: <strong>1044</strong>), and audit logging.
            </p>
          </div>

          <div className="p-4 rounded-xl border text-left space-y-2 text-xs sm:text-sm" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
            <div>
              <strong>Dedicated Event Website:</strong>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 px-2.5 py-1.5 rounded border text-xs truncate" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                  {dedicatedUrl}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(dedicatedUrl);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1 shrink-0"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <div><strong>Organizer Admin:</strong> {createdTenant.organizer?.name} ({createdTenant.organizer?.email})</div>
            <div><strong>Default Staff Scanner PIN:</strong> <code>1044</code></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => onOpenEventSite(createdTenant.slug, 'organizer')}
              className="btn-fp-olive px-6 py-3 text-sm"
            >
              Enter My Event Dashboard
            </button>
            <button
              type="button"
              onClick={onBack}
              className="btn-fp-outline px-6 py-3 text-sm"
            >
              Back to Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 h-16 px-4 sm:px-8 flex items-center justify-between border-b"
        style={{ background: 'var(--bg-header)', borderColor: 'var(--border-header)', color: 'var(--header-text)' }}
      >
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold"
          style={{ background: 'none', border: 'none', color: 'var(--header-text)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="font-bold text-sm sm:text-base hidden sm:block">
          Event Onboarding &amp; Branding
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold m-0">Create Your Dedicated Event Website</h1>
          <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
            Configure your organization profile, custom brand logo &amp; colour palette, and launch your isolated event site immediately.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl border flex items-center gap-2.5 text-sm" style={{ background: 'rgba(201,59,43,0.1)', borderColor: 'var(--fp-red)', color: 'var(--fp-red)' }}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Organization & URL */}
            <section className="fp-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
                <h2 className="text-base sm:text-lg font-bold m-0">1. Organization &amp; Dedicated Web Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5">Organization / Host Name *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ghana HR Summit & Leadership Forum"
                    className="fp-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Short Display Name *</label>
                  <input
                    required
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="e.g. HR Café"
                    className="fp-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Preferred Event URL Slug *</label>
                  <input
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    }}
                    placeholder="e.g. hr-cafe-2026"
                    className="fp-input w-full px-3.5 py-2.5 text-sm font-mono"
                  />
                  <div className="text-xs mt-1" style={{ color: slugTaken ? 'var(--fp-red)' : 'var(--fp-green)' }}>
                    {slugTaken ? `/${slug} is already taken` : `Your site: ${origin}/#/${slug || 'your-event'}`}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Event Details */}
            <section className="fp-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
                <h2 className="text-base sm:text-lg font-bold m-0">2. Event Details &amp; Schedule</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5">Flagship Event Title *</label>
                  <input
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. 10th Annual HR Café International Summit"
                    className="fp-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5">Tagline / Theme</label>
                  <input
                    value={eventTagline}
                    onChange={(e) => setEventTagline(e.target.value)}
                    placeholder="Serve · Share · Build"
                    className="fp-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Venue &amp; City</label>
                  <input
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    className="fp-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="fp-input w-full px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Capacity</label>
                    <input
                      type="number"
                      min="10"
                      max="15000"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="fp-input w-full px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Lead Organizer */}
            <section className="fp-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
                <h2 className="text-base sm:text-lg font-bold m-0">3. Lead Organizer &amp; Subscription Plan</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Organizer Full Name *</label>
                  <input
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="Dr. Nana Assyne"
                    className="fp-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Work Email *</label>
                  <input
                    required
                    type="email"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    placeholder="organizer@company.com"
                    className="fp-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Phone Number</label>
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="fp-input w-full px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Organizer Console Password *</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={organizerPassword}
                  onChange={(e) => setOrganizerPassword(e.target.value)}
                  placeholder="Choose a secure password (min 6 characters)"
                  className="fp-input w-full px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    className="p-3.5 rounded-xl border text-left transition-all"
                    style={{
                      background: planId === p.id ? 'var(--fp-sage)' : 'var(--bg-main)',
                      borderColor: planId === p.id ? 'var(--fp-olive)' : 'var(--border-color)',
                      color: planId === p.id ? 'var(--fp-sage-text)' : 'var(--text-main)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{p.name}</span>
                      {planId === p.id && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--fp-olive)' }} />}
                    </div>
                    <div className="text-lg font-extrabold mt-1">${p.price}<span className="text-xs font-normal opacity-75">/{p.billingPeriod}</span></div>
                    <div className="text-xs mt-1 opacity-80">Up to {p.limits.attendees.toLocaleString()} attendees</div>
                  </button>
                ))}
              </div>
            </section>

            {/* 4. Branding & Colour Identity */}
            <section className="fp-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
                  <h2 className="text-base sm:text-lg font-bold m-0">4. Event Branding, Logo &amp; Colours</h2>
                </div>
                <button
                  type="button"
                  onClick={resetBranding}
                  className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>

              {/* Logo Upload */}
              <div className="flex flex-wrap items-center gap-3">
                <label className="btn-fp-sage px-4 py-2 text-xs inline-flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>{logoPreview ? 'Change Event Logo' : 'Upload Organization Logo'}</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="h-11 max-w-[120px] object-contain bg-white p-1 rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
                )}
              </div>

              {/* Preset Palettes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESET_PALETTES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primaryColor);
                      setSecondaryColor(preset.secondaryColor);
                      setAccentColor(preset.accentColor);
                      setNeutralColor(preset.neutralColor);
                    }}
                    className="p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-colors"
                    style={{
                      background: primaryColor === preset.primaryColor ? 'var(--fp-sage)' : 'var(--bg-main)',
                      borderColor: primaryColor === preset.primaryColor ? 'var(--fp-olive)' : 'var(--border-color)',
                    }}
                  >
                    <span className="w-4 h-4 rounded-full shrink-0 border border-black/10" style={{ background: preset.primaryColor }} />
                    <span className="w-4 h-4 rounded-full shrink-0 border border-black/10" style={{ background: preset.secondaryColor }} />
                    <span className="font-semibold truncate">{preset.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom HEX Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Primary Colour', val: primaryColor, set: setPrimaryColor },
                  { label: 'Header / Secondary', val: secondaryColor, set: setSecondaryColor },
                  { label: 'Accent Colour', val: accentColor, set: setAccentColor },
                ].map((c) => (
                  <div key={c.label}>
                    <label className="block text-xs font-semibold mb-1">{c.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={isValidHex(c.val) ? c.val : '#5A6552'}
                        onChange={(e) => c.set(e.target.value.toUpperCase())}
                        className="w-10 h-9 rounded border cursor-pointer p-0.5"
                      />
                      <input
                        value={c.val}
                        onChange={(e) => c.set(e.target.value.toUpperCase())}
                        maxLength={7}
                        className="fp-input flex-1 px-2.5 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg text-xs border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                <strong>WCAG Contrast Check:</strong> Primary {contrast.primaryRatio}:1 · Secondary {contrast.secondaryRatio}:1 —{' '}
                <span style={{ color: contrast.accessible ? 'var(--fp-green)' : 'var(--fp-amber)', fontWeight: 700 }}>
                  {contrast.accessible ? 'Passes WCAG AA readability' : 'Consider adjusting contrast'}
                </span>
              </div>
            </section>

            {/* 5. Terms & Submit */}
            <section className="fp-card p-5 sm:p-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#5A6552]"
                />
                <span className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                  I have read and accept the{' '}
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="font-bold underline inline-flex items-center gap-1"
                    style={{ color: 'var(--fp-olive)', background: 'none', border: 'none', padding: 0 }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Terms &amp; Conditions and Ghana Data Protection Act (Act 843) Policy
                  </button>{' '}
                  for hosting my organization&apos;s dedicated event website and attendee data.
                </span>
              </label>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={onBack} className="btn-fp-outline px-5 py-3 text-sm">
                  Cancel
                </button>
                <button type="submit" className="btn-fp-olive px-6 py-3 text-sm font-bold">
                  Launch Dedicated Event Website
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Live Preview */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            <div className="fp-card overflow-hidden">
              <div className="px-4 py-3 border-b text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                Live Dedicated Site Preview
              </div>
              {/* Simulated Branded Header */}
              <div className="p-4 flex items-center justify-between gap-2 border-b" style={{ background: secondaryColor, color: headerText, borderColor: 'rgba(0,0,0,0.08)' }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background: primaryColor, color: primaryBtnText }}>
                      {(shortName || name || 'EP').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="font-bold text-sm truncate">{shortName || name || 'Your Event Portal'}</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md" style={{ background: primaryColor, color: primaryBtnText }}>
                  Log in
                </span>
              </div>

              <div className="p-5 space-y-3" style={{ background: neutralColor, color: '#1a1d1a' }}>
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: secondaryColor, color: headerText }}>
                  /{slug || 'your-event'}
                </span>
                <div className="font-extrabold text-base leading-snug">
                  {eventTitle || 'Your Annual Summit 2026'}
                </div>
                <p className="text-xs opacity-75 m-0">{eventTagline}</p>
                <div className="text-xs opacity-70 pt-1">
                  {eventVenue} · {capacity} seats
                </div>
                <div className="pt-2 flex gap-2">
                  <div className="flex-1 py-2 rounded-lg text-center text-xs font-bold" style={{ background: primaryColor, color: primaryBtnText }}>
                    Register Now
                  </div>
                  <div className="px-3 py-2 rounded-lg text-xs font-bold border" style={{ borderColor: accentColor, color: accentColor }}>
                    My Ticket
                  </div>
                </div>
              </div>
            </div>

            <div className="fp-card p-4 text-xs space-y-2" style={{ color: 'var(--text-muted)' }}>
              <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                <Globe className="w-4 h-4" style={{ color: 'var(--fp-olive)' }} />
                What Your Attendees &amp; Team Receive
              </div>
              <ul className="list-disc pl-4 space-y-1 m-0">
                <li>Dedicated event URL (<code>/#/{slug || 'your-event'}</code>)</li>
                <li>Branded split-screen login for Organizers, Staff &amp; Attendees</li>
                <li>QR ticketing &amp; centered 3.1-inch lanyard badge printer</li>
                <li>Full Act 843 compliance &amp; real-time audit trail</li>
              </ul>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
