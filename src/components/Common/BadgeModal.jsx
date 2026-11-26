import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  X,
  Printer,
  Shield,
  CheckCircle2,
  RotateCw,
  Sliders,
  RefreshCcw,
  Ruler,
  Camera,
  User,
} from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';
import { Storage } from '../../data/storage';

const LENGTH_PRESETS = [
  { id: 'auto', label: 'Auto (Fit)', value: 'auto' },
  { id: '3.5', label: '3.5 in', value: 3.5 },
  { id: '4.0', label: '4.0 in', value: 4.0 },
  { id: '4.5', label: '4.5 in', value: 4.5 },
  { id: '5.0', label: '5.0 in', value: 5.0 },
  { id: '5.5', label: '5.5 in', value: 5.5 },
  { id: '6.0', label: '6.0 in', value: 6.0 },
];

const BADGE_VARIANTS = [
  { id: 'lanyard_standard', group: 'Conference Lanyard Tag', label: 'Lanyard · No Photo', hasPhoto: false },
  { id: 'lanyard_photo', group: 'Conference Lanyard Tag', label: 'Lanyard · With Photo', hasPhoto: true },
  { id: 'exec_photo', group: 'Executive Photo ID', label: 'Executive · With Photo', hasPhoto: true },
  { id: 'exec_standard', group: 'Executive Photo ID', label: 'Executive · No Photo', hasPhoto: false },
];

export default function BadgeModal({
  isOpen,
  onClose,
  attendee,
  tenant,
  event,
  onReprint,
  staffUser = "Staff"
}) {
  const [qrUrl, setQrUrl] = useState(null);
  const [reprintReason, setReprintReason] = useState('');
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [badgeTemplate, setBadgeTemplate] = useState('lanyard_standard');
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Exact 3.1-inch width + customizable print length & paper mode
  const TAG_WIDTH_IN = 3.1;
  const [tagLengthMode, setTagLengthMode] = useState('auto'); // 'auto' | '3.5' | ... | '6.0' | 'custom'
  const [customLengthIn, setCustomLengthIn] = useState('4.5');
  const [paperMode, setPaperMode] = useState('thermal'); // 'thermal' (3.1in stock) | 'sheet' (centered on A4/Letter)

  // Auto-fit scale so shorter / custom stock lengths NEVER clip content
  const innerBadgeRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);

  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;

  const detectTitleAndName = (fullName = '') => {
    const match = fullName.match(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Eng\.|Rev\.)\s+(.+)$/i);
    if (match) {
      return { title: match[1], name: match[2].toUpperCase() };
    }
    return { title: attendee?.title || '', name: fullName.toUpperCase() };
  };

  const initialParsed = detectTitleAndName(attendee?.name || '');

  const [customTitle, setCustomTitle] = useState(initialParsed.title);
  const [customName, setCustomName] = useState(initialParsed.name);
  const [customCountry, setCustomCountry] = useState(attendee?.country || 'Ghana');
  const [customOrg, setCustomOrg] = useState(attendee?.organization || '');
  const [customCategory, setCustomCategory] = useState((attendee?.category || 'PARTICIPANT').toUpperCase());
  const [customEventTitle, setCustomEventTitle] = useState(event?.title || tenant?.name || 'Event Summit 2026');
  const [customEventSubtitle, setCustomEventSubtitle] = useState(tenant?.shortName || tenant?.name || 'OFFICIAL EVENT PASS');
  const [customEventTagline, setCustomEventTagline] = useState(event?.tagline || 'CONNECT · INNOVATE · LEAD');
  const [customVenue, setCustomVenue] = useState(event?.venue || 'Accra International Conference Centre');
  const [scanLabel] = useState('SCAN FOR VERIFICATION');

  useEffect(() => {
    if (attendee) {
      const parsed = detectTitleAndName(attendee.name || '');
      setCustomTitle(parsed.title);
      setCustomName(parsed.name);
      setCustomCountry(attendee.country || 'Ghana');
      setCustomOrg(attendee.organization || 'Independent');
      setCustomCategory((attendee.category || 'PARTICIPANT').toUpperCase());
      setCustomEventTitle(event?.title || tenant?.name || 'Event Summit 2026');
      setCustomEventSubtitle(tenant?.shortName || tenant?.name || 'OFFICIAL EVENT PASS');
      setCustomEventTagline(event?.tagline || 'CONNECT · INNOVATE · LEAD');
      setCustomVenue(event?.venue || 'Accra International Conference Centre');
    }
  }, [attendee, event, tenant]);

  useEffect(() => {
    if (attendee?.ticketCode) {
      generateQrDataUrl(attendee.ticketCode, {
        width: 220,
        darkColor: '#0f172a',
        lightColor: '#ffffff'
      }).then((url) => setQrUrl(url));
    }
  }, [attendee]);

  const parsedCustom = parseFloat(customLengthIn);
  const resolvedHeightIn = tagLengthMode === 'auto'
    ? 'auto'
    : tagLengthMode === 'custom'
    ? Math.max(2.0, Math.min(11.0, Number.isFinite(parsedCustom) ? parsedCustom : 4.5))
    : parseFloat(tagLengthMode);

  // Measure natural inner badge height and compute proportional fit scale when a fixed height is selected
  useLayoutEffect(() => {
    if (!isOpen || !attendee) return;
    if (resolvedHeightIn === 'auto') {
      setFitScale(1);
      return;
    }
    const el = innerBadgeRef.current;
    if (!el) return;
    // Measure unscaled natural height (scrollHeight is independent of CSS transform)
    const naturalHeightPx = el.scrollHeight;
    const availableHeightPx = Math.max(120, resolvedHeightIn * 96 - 4);
    if (naturalHeightPx > availableHeightPx) {
      const nextScale = Math.max(0.32, Math.min(1, availableHeightPx / naturalHeightPx));
      setFitScale(Number(nextScale.toFixed(4)));
    } else {
      setFitScale(1);
    }
  }, [
    isOpen,
    attendee,
    badgeTemplate,
    resolvedHeightIn,
    qrUrl,
    customTitle,
    customName,
    customCountry,
    customOrg,
    customCategory,
    customEventTitle,
    customEventSubtitle,
    customEventTagline,
    customVenue,
  ]);

  if (!isOpen || !attendee) return null;

  const isLanyard = badgeTemplate === 'lanyard_standard' || badgeTemplate === 'lanyard_photo';
  const showPhoto = badgeTemplate === 'lanyard_photo' || badgeTemplate === 'exec_photo';

  const outerHeightStyle = resolvedHeightIn === 'auto'
    ? { minHeight: '4.4in' }
    : { height: `${resolvedHeightIn}in`, minHeight: `${resolvedHeightIn}in`, maxHeight: `${resolvedHeightIn}in` };

  const innerScaleStyle = fitScale < 1
    ? {
        width: '3.1in',
        transform: `scale(${fitScale})`,
        transformOrigin: 'top center',
      }
    : {
        width: '100%',
        minHeight: resolvedHeightIn === 'auto' ? '4.4in' : '100%',
      };

  const handlePrint = () => {
    const variantMeta = BADGE_VARIANTS.find((v) => v.id === badgeTemplate);
    const formatNote = `3.1in x ${resolvedHeightIn === 'auto' ? 'Auto' : `${resolvedHeightIn}in`} · ${variantMeta?.label || badgeTemplate} (${paperMode === 'thermal' ? '3.1" Thermal Roll' : 'Centered Sheet'})`;
    Storage.logBadgePrint(attendee.id, staffUser, formatNote);
    printElementCleanly('printable-badge', `${customName || attendee?.name || 'Attendee'} - 3.1in Badge`, {
      mode: 'badge',
      widthIn: TAG_WIDTH_IN,
      heightIn: resolvedHeightIn,
      paperMode,
    });
  };

  const handleReprintSubmit = () => {
    if (onReprint) {
      onReprint(attendee.id, staffUser, reprintReason || 'Badge re-issue requested');
    } else {
      Storage.reprintBadge(attendee.id, staffUser, reprintReason || 'Badge re-issue requested');
    }
    setShowReasonBox(false);
    setReprintReason('');
    printElementCleanly('printable-badge', `${customName || attendee?.name || 'Attendee'} - 3.1in Badge`, {
      mode: 'badge',
      widthIn: TAG_WIDTH_IN,
      heightIn: resolvedHeightIn,
      paperMode,
    });
  };

  const handleResetToAttendee = () => {
    const parsed = detectTitleAndName(attendee?.name || '');
    setCustomTitle(parsed.title);
    setCustomName(parsed.name);
    setCustomCountry(attendee?.country || 'Ghana');
    setCustomOrg(attendee?.organization || '');
    setCustomCategory((attendee?.category || 'PARTICIPANT').toUpperCase());
    setCustomEventTitle(event?.title || tenant?.name || 'Event Summit 2026');
    setCustomVenue(event?.venue || 'Accra International Conference Centre');
  };

  const brandPrimary = tenant?.primaryColor || '#5A6552';
  const initials = (customName || 'DE')
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:bg-transparent print:p-0 print:static"
      style={{ background: 'rgba(15, 20, 14, 0.72)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="fp-card relative w-full max-w-2xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl print:border-none print:shadow-none"
        style={{ background: 'var(--bg-main)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-2 print:hidden"
          style={{ background: 'var(--bg-header)', borderColor: 'var(--border-header)', color: 'var(--header-text)' }}
        >
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold m-0 flex items-center gap-2 truncate" style={{ color: 'var(--header-text)' }}>
              <Printer className="w-5 h-5 shrink-0" />
              <span>Centered 3.1&quot; Event Tag Printer</span>
            </h3>
            <p className="text-xs m-0 opacity-80 truncate" style={{ color: 'var(--header-text)' }}>
              Exact 3.1 inches wide · 4 badge designs · Auto-fits any stock length
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/10 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* 4 Badge Style Selector + Text Editor Toggle */}
          <div className="p-3.5 rounded-xl border space-y-2.5 print:hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold">Badge Design Style</span>
              <button
                type="button"
                onClick={() => setShowCustomizer(!showCustomizer)}
                className="btn-fp-outline px-2.5 py-1 text-[11px] inline-flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showCustomizer ? 'Hide Text Editor' : 'Edit Tag Text'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BADGE_VARIANTS.map((v) => {
                const active = badgeTemplate === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setBadgeTemplate(v.id)}
                    className={`px-2.5 py-2 rounded-lg border text-[11px] font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      active ? 'btn-fp-olive' : 'btn-fp-outline'
                    }`}
                  >
                    {v.hasPhoto ? <Camera className="w-3.5 h-3.5 shrink-0" /> : <User className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EXACT 3.1-INCH PRINT DIMENSIONS & STOCK CONTROLS */}
          <div className="p-3.5 rounded-xl border space-y-3 print:hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <Ruler className="w-4 h-4" style={{ color: 'var(--fp-olive)' }} />
                <span>Print Size &amp; Stock Length</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="fp-tag-sage font-mono text-[11px]">
                  3.1 in × {resolvedHeightIn === 'auto' ? 'Auto' : `${resolvedHeightIn} in`}
                </span>
                {fitScale < 1 && (
                  <span className="fp-tag-olive font-mono text-[10px]">
                    Auto-fit {Math.round(fitScale * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Tag Stock Length (inches)</label>
                <div className="flex flex-wrap gap-1.5">
                  {LENGTH_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTagLengthMode(p.id)}
                      className={`px-2 py-1 rounded-md border text-[11px] font-semibold ${tagLengthMode === p.id ? 'btn-fp-olive' : 'btn-fp-outline'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTagLengthMode('custom')}
                    className={`px-2 py-1 rounded-md border text-[11px] font-semibold ${tagLengthMode === 'custom' ? 'btn-fp-olive' : 'btn-fp-outline'}`}
                  >
                    Custom
                  </button>
                </div>
                {tagLengthMode === 'custom' && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      step="0.1"
                      min="2.0"
                      max="11.0"
                      value={customLengthIn}
                      onChange={(e) => setCustomLengthIn(e.target.value)}
                      className="fp-input w-24 px-2.5 py-1 text-xs font-mono"
                    />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>inches tall (2.0 – 11.0)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Printer Feed Alignment</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaperMode('thermal')}
                    className={`px-2.5 py-1.5 rounded-md border text-[11px] font-semibold ${paperMode === 'thermal' ? 'btn-fp-olive' : 'btn-fp-outline'}`}
                  >
                    3.1&quot; Thermal / Tag Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperMode('sheet')}
                    className={`px-2.5 py-1.5 rounded-md border text-[11px] font-semibold ${paperMode === 'sheet' ? 'btn-fp-olive' : 'btn-fp-outline'}`}
                  >
                    Centered on A4 / Letter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Customizer Drawer */}
          {showCustomizer && (
            <div className="p-4 rounded-xl border space-y-3 text-xs print:hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <span className="font-bold">Edit Printed Badge Fields</span>
                <button type="button" onClick={handleResetToAttendee} className="inline-flex items-center gap-1 underline" style={{ color: 'var(--fp-olive)', background: 'none', border: 'none' }}>
                  <RefreshCcw className="w-3 h-3" /> Reset
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} placeholder="Title (Dr./Mr.)" className="fp-input px-2.5 py-1.5 text-xs" />
                <input value={customName} onChange={(e) => setCustomName(e.target.value.toUpperCase())} placeholder="Full Name" className="fp-input sm:col-span-2 px-2.5 py-1.5 text-xs font-bold" />
                <input value={customCountry} onChange={(e) => setCustomCountry(e.target.value)} placeholder="Country" className="fp-input px-2.5 py-1.5 text-xs" />
                <input value={customOrg} onChange={(e) => setCustomOrg(e.target.value)} placeholder="Organization" className="fp-input px-2.5 py-1.5 text-xs" />
                <input value={customCategory} onChange={(e) => setCustomCategory(e.target.value.toUpperCase())} placeholder="Role / Category" className="fp-input px-2.5 py-1.5 text-xs font-bold" />
                <input value={customEventTitle} onChange={(e) => setCustomEventTitle(e.target.value)} placeholder="Event Name" className="fp-input sm:col-span-2 px-2.5 py-1.5 text-xs" />
                <input value={customVenue} onChange={(e) => setCustomVenue(e.target.value)} placeholder="Venue" className="fp-input px-2.5 py-1.5 text-xs" />
              </div>
            </div>
          )}

          {/* =========================================================================
              CENTERED 3.1-INCH PRINTABLE BADGE PREVIEW (Auto-scales to fit any length!)
              ========================================================================= */}
          <div className="flex justify-center py-1 overflow-x-auto">
            <div
              id="printable-badge"
              className="bg-white text-slate-900 rounded-2xl border-2 border-slate-300 shadow-lg overflow-hidden flex flex-col items-center justify-start relative select-none shrink-0"
              style={{
                width: '3.1in',
                maxWidth: '3.1in',
                margin: '0 auto',
                ...outerHeightStyle,
                fontFamily: "'Outfit', 'Inter', sans-serif",
              }}
            >
              <div
                ref={innerBadgeRef}
                className="flex flex-col justify-between bg-white"
                style={innerScaleStyle}
              >
                {isLanyard ? (
                  /* ── CONFERENCE LANYARD TAG (Standard OR With Photo) ── */
                  <>
                    {/* Top Curved Pan-African / Brand Ribbon */}
                    <div className="relative w-full h-[46px] overflow-hidden bg-white shrink-0">
                      <svg className="w-full h-full" viewBox="0 0 300 48" fill="none" preserveAspectRatio="none">
                        <path d="M0,0 L300,0 L300,22 C210,8 120,28 0,42 Z" fill="#059669" />
                        <path d="M0,0 L300,0 L300,15 C220,3 130,22 0,33 Z" fill="#f59e0b" />
                        <path d="M0,0 L300,0 L300,9 C235,2 155,14 0,22 Z" fill="#dc2626" />
                      </svg>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-white/90 border border-slate-400" />
                    </div>

                    {/* Event Branding Header */}
                    <div className="text-center px-3 pt-1 shrink-0">
                      <div className="flex items-center justify-center gap-2">
                        {tenant?.logoUrl && (
                          <img src={tenant.logoUrl} alt="Logo" className="w-7 h-7 rounded-md object-contain bg-white border border-slate-200 p-0.5" />
                        )}
                        <div className="text-center">
                          <div className="text-sm font-black leading-tight text-slate-900">
                            {customEventTitle}
                          </div>
                          <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
                            {customEventSubtitle}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Centered Main Delegate Identity & QR Card */}
                    <div className="mx-3 my-2 bg-white rounded-xl border border-slate-300 p-3 text-center flex flex-col items-center justify-center flex-1">
                      {showPhoto ? (
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <div className="relative shrink-0">
                            {attendee.photoUrl ? (
                              <img
                                src={attendee.photoUrl}
                                alt={customName}
                                className="w-[78px] h-[78px] rounded-xl object-cover border-2 border-slate-200 shadow-sm"
                              />
                            ) : (
                              <div
                                className="w-[78px] h-[78px] rounded-xl border-2 border-slate-200 shadow-sm flex items-center justify-center font-black text-xl"
                                style={{ background: '#DCE7D0', color: '#3F4B3B' }}
                              >
                                {initials}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="p-1 bg-white border border-slate-200 rounded-lg">
                              {qrUrl && (
                                <img src={qrUrl} alt="Attendee QR" className="w-[68px] h-[68px] object-contain" />
                              )}
                            </div>
                            <p className="text-[8px] font-mono font-bold text-slate-500 m-0 mt-1">
                              {attendee.ticketCode}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-[8.5px] font-black tracking-[0.14em] text-slate-700 uppercase m-0 mb-1.5">
                            {scanLabel}
                          </p>
                          <div className="p-1 bg-white border border-slate-200 rounded-lg inline-block mb-1.5">
                            {qrUrl && (
                              <img src={qrUrl} alt="Attendee QR" className="w-[82px] h-[82px] object-contain mx-auto" />
                            )}
                          </div>
                          <p className="text-[9px] font-mono font-bold text-slate-500 m-0 mb-1">
                            {attendee.ticketCode}
                          </p>
                        </>
                      )}

                      {customTitle && (
                        <p className="text-xs font-bold text-slate-700 leading-tight m-0">{customTitle}</p>
                      )}

                      <h2 className="text-base font-black text-slate-950 tracking-tight leading-tight uppercase m-0 mt-0.5 break-words w-full">
                        {customName}
                      </h2>

                      <p className="text-[11px] font-semibold text-slate-600 m-0 mt-0.5">{customCountry}</p>
                      <p className="text-xs font-extrabold text-slate-900 m-0 mt-0.5 break-words w-full">{customOrg}</p>

                      <div
                        className="mt-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-white"
                        style={{ backgroundColor: brandPrimary }}
                      >
                        {customCategory}
                      </div>

                      {/* Permitted Days Strip */}
                      <div className="flex items-center justify-center gap-1 mt-2 pt-2 border-t border-slate-200 w-full">
                        {eventDays.map((d, idx) => {
                          const permitted = (attendee.selectedDays || eventDays.map((x) => x.id)).includes(d.id);
                          return (
                            <span
                              key={d.id}
                              className={`w-5 h-4 rounded text-[7.5px] font-black flex items-center justify-center border ${
                                permitted ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-300 border-slate-200 line-through'
                              }`}
                            >
                              D{idx + 1}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Venue & Tagline */}
                    <div className="px-3 pb-2.5 pt-1.5 text-center border-t border-slate-200 bg-slate-50 shrink-0">
                      <p className="text-[8px] font-bold text-slate-800 m-0 leading-tight">{customVenue}</p>
                      <p className="text-[7px] font-semibold text-slate-500 uppercase tracking-wider m-0 mt-0.5">
                        {customEventTagline}
                      </p>
                    </div>
                  </>
                ) : (
                  /* ── EXECUTIVE PHOTO ID (With Photo OR No Photo) ── */
                  <>
                    <div
                      className="pt-2.5 pb-2 px-3 text-center border-b border-slate-200 shrink-0"
                      style={{ backgroundColor: tenant?.secondaryColor || '#DCE7D0' }}
                    >
                      <div className="w-10 h-1.5 rounded-full bg-white/80 mx-auto mb-1.5 border border-slate-300" />
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-700 m-0">{tenant?.name}</p>
                      <p className="text-xs font-black text-slate-950 m-0 leading-tight">{customEventTitle}</p>
                    </div>

                    <div className="text-center px-3 py-3 my-auto flex-1 flex flex-col items-center justify-center">
                      {showPhoto ? (
                        <div className="relative inline-block mb-2">
                          {attendee.photoUrl ? (
                            <img
                              src={attendee.photoUrl}
                              alt={customName}
                              className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 shadow-sm mx-auto"
                            />
                          ) : (
                            <div
                              className="w-24 h-24 rounded-2xl border-4 border-slate-100 shadow-sm mx-auto flex items-center justify-center font-black text-2xl"
                              style={{ background: '#DCE7D0', color: '#3F4B3B' }}
                            >
                              {initials}
                            </div>
                          )}
                          <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-emerald-600 text-white flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                          </span>
                        </div>
                      ) : (
                        <div className="mb-2.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-600 text-white tracking-wider uppercase">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED DELEGATE
                          </span>
                        </div>
                      )}

                      {customTitle && <p className="text-[11px] font-bold text-slate-600 m-0">{customTitle}</p>}
                      <h2 className={`${showPhoto ? 'text-base' : 'text-lg'} font-black text-slate-950 uppercase m-0 leading-tight break-words w-full`}>
                        {customName}
                      </h2>
                      <p className="text-[11px] font-semibold text-slate-600 m-0 mt-0.5">{attendee.jobTitle}</p>
                      <p className="text-[11px] font-extrabold text-slate-900 m-0 mt-0.5 break-words w-full">
                        {customOrg} · {customCountry}
                      </p>

                      {!showPhoto && (
                        <div className="mt-3 p-1.5 bg-white border border-slate-200 rounded-xl inline-block">
                          {qrUrl && <img src={qrUrl} alt="QR" className="w-[88px] h-[88px] object-contain mx-auto" />}
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 border-t border-slate-200 pt-2 shrink-0">
                      {showPhoto ? (
                        <div className="flex items-center justify-center gap-2.5 px-3 pb-2">
                          {qrUrl && <img src={qrUrl} alt="QR" className="w-14 h-14 border border-slate-200 rounded bg-white p-0.5" />}
                          <div className="text-left font-mono">
                            <p className="text-[8px] text-slate-500 uppercase m-0">Ticket Code</p>
                            <p className="text-xs font-black text-slate-950 m-0">{attendee.ticketCode}</p>
                            <p className="text-[8px] text-slate-500 m-0 mt-0.5 truncate max-w-[140px]">{customVenue}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center px-3 pb-2 font-mono">
                          <p className="text-xs font-black text-slate-950 m-0">{attendee.ticketCode}</p>
                          <p className="text-[8px] text-slate-500 m-0 mt-0.5 truncate">{customVenue}</p>
                        </div>
                      )}
                      <div
                        className="py-1.5 text-center text-[11px] font-black tracking-widest uppercase text-white"
                        style={{ backgroundColor: brandPrimary }}
                      >
                        {customCategory}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Print Audit Status & Reprint Logging */}
          <div className="p-3.5 rounded-xl border text-xs space-y-2 print:hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--text-muted)' }}>Badge Print Audit Count:</span>
              <span className="fp-tag-sage font-mono">Printed {attendee.badgePrintedCount || 0} time(s)</span>
            </div>
            {attendee.badgePrintedCount > 1 && (
              <p className="text-[11px] m-0 flex items-center gap-1" style={{ color: 'var(--fp-olive)' }}>
                <Shield className="w-3.5 h-3.5 shrink-0" />
                All prints and reprints are permanently recorded in the event audit trail.
              </p>
            )}

            {showReasonBox && (
              <div className="pt-2 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <input
                  type="text"
                  value={reprintReason}
                  onChange={(e) => setReprintReason(e.target.value)}
                  placeholder="Reason for reprint (e.g. Lanyard damaged, spelling update)..."
                  className="fp-input w-full px-3 py-2 text-xs"
                />
                <button type="button" onClick={handleReprintSubmit} className="btn-fp-olive w-full py-2 text-xs inline-flex items-center justify-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Log Reprint &amp; Print 3.1&quot; Tag</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="px-4 sm:px-6 py-3.5 border-t flex flex-wrap items-center justify-between gap-2 print:hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {!showReasonBox && (
            <button
              type="button"
              onClick={() => setShowReasonBox(true)}
              className="text-xs font-semibold underline inline-flex items-center gap-1"
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Log Duplicate Reprint</span>
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button type="button" onClick={onClose} className="btn-fp-outline px-4 py-2 text-xs">
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-fp-olive px-5 py-2 text-xs sm:text-sm inline-flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print 3.1&quot; Centered Tag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
