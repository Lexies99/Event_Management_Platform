import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Palette,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  Calendar,
} from 'lucide-react';
import {
  DEFAULT_BRANDING,
  PRESET_PALETTES,
  evaluatePaletteContrast,
  isValidHex,
} from '../../utils/branding';
import { Storage } from '../../data/storage';
import TenantLogo from '../Common/TenantLogo';

export default function WorkspaceBrandingSettings({ tenant, event, onUpdated }) {
  const [name, setName] = useState(tenant?.name || '');
  const [shortName, setShortName] = useState(tenant?.shortName || '');
  const [primaryColor, setPrimaryColor] = useState(tenant?.primaryColor || DEFAULT_BRANDING.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(tenant?.secondaryColor || DEFAULT_BRANDING.secondaryColor);
  const [accentColor, setAccentColor] = useState(tenant?.accentColor || DEFAULT_BRANDING.accentColor);
  const [neutralColor, setNeutralColor] = useState(tenant?.neutralColor || DEFAULT_BRANDING.neutralColor);
  const [logoUrl, setLogoUrl] = useState(tenant?.logoUrl || '');

  const [eventTitle, setEventTitle] = useState(event?.title || '');
  const [eventTagline, setEventTagline] = useState(event?.tagline || '');
  const [eventVenue, setEventVenue] = useState(event?.venue || '');
  const [capacity, setCapacity] = useState(event?.capacity || 500);

  const [notice, setNotice] = useState('');

  const contrast = useMemo(
    () => evaluatePaletteContrast({ primaryColor, secondaryColor, accentColor, neutralColor }),
    [primaryColor, secondaryColor, accentColor, neutralColor]
  );

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Logo must be 3 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!tenant?.id) return;

    await Storage.updateTenantAsync(
      tenant.id,
      {
        name: name.trim() || tenant.name,
        shortName: shortName.trim() || tenant.shortName,
        primaryColor: primaryColor.toUpperCase(),
        brandColor: primaryColor.toUpperCase(),
        secondaryColor: secondaryColor.toUpperCase(),
        accentColor: accentColor.toUpperCase(),
        neutralColor: neutralColor.toUpperCase(),
        logoUrl,
        updatedBy: tenant?.organizer?.name || 'Organizer',
      }
    );

    if (event?.id) {
      await Storage.updateEventAsync(
        event.id,
        {
          title: eventTitle.trim() || event.title,
          tagline: eventTagline.trim(),
          venue: eventVenue.trim() || event.venue,
          capacity: Number(capacity) || 500,
        }
      );
    }

    onUpdated?.();
    setNotice('Dedicated event website branding & settings saved across all devices!');
    setTimeout(() => setNotice(''), 4000);
  };

  const handleReset = () => {
    setPrimaryColor(DEFAULT_BRANDING.primaryColor);
    setSecondaryColor(DEFAULT_BRANDING.secondaryColor);
    setAccentColor(DEFAULT_BRANDING.accentColor);
    setNeutralColor(DEFAULT_BRANDING.neutralColor);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold m-0">Event Website Branding &amp; Settings</h2>
          <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
            Customize logo, colours, and event metadata for your dedicated portal (<code>/#/{tenant?.slug}</code>).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleReset} className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Palette</span>
          </button>
          <button type="submit" className="btn-fp-olive px-4 py-2 text-xs sm:text-sm inline-flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl border flex items-center gap-2 text-sm font-medium" style={{ background: 'var(--fp-sage)', borderColor: 'var(--fp-olive)', color: 'var(--fp-sage-text)' }}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Logo & Palette */}
      <section className="fp-card p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
          <h3 className="text-base font-bold m-0">Logo &amp; Colour Palette</h3>
        </div>

        <div className="flex flex-wrap items-center gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <TenantLogo tenant={{ ...tenant, logoUrl, primaryColor }} size={56} className="rounded-xl" />
          <div className="flex flex-wrap gap-2">
            <label className="btn-fp-sage px-3.5 py-2 text-xs inline-flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Logo</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl('')}
                className="btn-fp-outline px-3 py-2 text-xs inline-flex items-center gap-1.5"
                style={{ color: 'var(--fp-red)' }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPrimaryColor(p.primaryColor);
                setSecondaryColor(p.secondaryColor);
                setAccentColor(p.accentColor);
                setNeutralColor(p.neutralColor);
              }}
              className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
            >
              <span className="w-3 h-3 rounded-full" style={{ background: p.primaryColor }} />
              <span className="w-3 h-3 rounded-full" style={{ background: p.secondaryColor }} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Primary Colour', val: primaryColor, set: setPrimaryColor },
            { label: 'Header / Secondary', val: secondaryColor, set: setSecondaryColor },
            { label: 'Accent Colour', val: accentColor, set: setAccentColor },
            { label: 'Card Surface', val: neutralColor, set: setNeutralColor },
          ].map((c) => (
            <div key={c.label}>
              <label className="block text-xs font-semibold mb-1.5">{c.label}</label>
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

        <div className="p-3 rounded-lg border text-xs" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
          <strong>Contrast Audit:</strong> Primary {contrast.primaryRatio}:1 · Secondary {contrast.secondaryRatio}:1 · Accent {contrast.accentRatio}:1 —{' '}
          <span style={{ color: contrast.accessible ? 'var(--fp-green)' : 'var(--fp-amber)', fontWeight: 700 }}>
            {contrast.accessible ? 'Passes WCAG AA readability.' : contrast.warnings.join(' ')}
          </span>
        </div>
      </section>

      {/* Organization & Event Info */}
      <section className="fp-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
          <h3 className="text-base font-bold m-0">Organization &amp; Event Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Organization Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="fp-input w-full px-3.5 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Short Display Name</label>
            <input value={shortName} onChange={(e) => setShortName(e.target.value)} className="fp-input w-full px-3.5 py-2.5 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1.5">Event Title</label>
            <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="fp-input w-full px-3.5 py-2.5 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1.5">Event Tagline</label>
            <input value={eventTagline} onChange={(e) => setEventTagline(e.target.value)} className="fp-input w-full px-3.5 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Venue</label>
            <input value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} className="fp-input w-full px-3.5 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Max Capacity</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="fp-input w-full px-3.5 py-2.5 text-sm" />
          </div>
        </div>
      </section>
    </form>
  );
}
