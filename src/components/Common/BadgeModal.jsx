import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Shield, 
  CheckCircle2, 
  RotateCw, 
  Sliders, 
  RefreshCcw, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';

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
  const [badgeTemplate, setBadgeTemplate] = useState('lanyard'); // 'lanyard' | 'photo_id'
  const [showCustomizer, setShowCustomizer] = useState(false);

  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;

  // Detect title prefix if present in attendee name (e.g., Dr., Prof., Mr., Ms., Eng.)
  const detectTitleAndName = (fullName = '') => {
    const match = fullName.match(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Eng\.|Rev\.)\s+(.+)$/i);
    if (match) {
      return {
        title: match[1],
        name: match[2].toUpperCase()
      };
    }
    return {
      title: attendee?.title || "",
      name: fullName.toUpperCase()
    };
  };

  const initialParsed = detectTitleAndName(attendee?.name || "");

  // Editable badge fields state
  const [customTitle, setCustomTitle] = useState(initialParsed.title);
  const [customName, setCustomName] = useState(initialParsed.name);
  const [customCountry, setCustomCountry] = useState(attendee?.country || "Ghana");
  const [customOrg, setCustomOrg] = useState(attendee?.organization || "GIMPA");
  const [customCategory, setCustomCategory] = useState(attendee?.category || "PARTICIPANT");
  const [customEventTitle, setCustomEventTitle] = useState("10th HR Café");
  const [customEventSubtitle, setCustomEventSubtitle] = useState("GHANA • BURKINA FASO");
  const [customEventTagline, setCustomEventTagline] = useState("SERVE • SHARE • BUILD");
  const [customEdition, setCustomEdition] = useState("10th Edition | First International Edition");
  const [customDates, setCustomDates] = useState("6th - 13th September 2026");
  const [customVenue, setCustomVenue] = useState(
    event?.venue?.includes('Kofi Annan') 
      ? event.venue 
      : "Kofi Annan International Peacekeeping Training Centre, Accra, Ghana"
  );
  const [scanLabel, setScanLabel] = useState("SCAN FOR CONTACT");
  const [bannerPalette, setBannerPalette] = useState("pan_african"); // 'pan_african' | 'brand'

  // Sync state whenever active attendee changes
  useEffect(() => {
    if (attendee) {
      const parsed = detectTitleAndName(attendee.name || "");
      setCustomTitle(parsed.title);
      setCustomName(parsed.name);
      setCustomCountry(attendee.country || "Ghana");
      setCustomOrg(attendee.organization || "GIMPA");
      setCustomCategory((attendee.category || "PARTICIPANT").toUpperCase());
    }
  }, [attendee]);

  // Generate QR barcode
  useEffect(() => {
    if (attendee?.ticketCode) {
      generateQrDataUrl(attendee.ticketCode, {
        width: 220,
        darkColor: '#0f172a',
        lightColor: '#ffffff'
      }).then(url => setQrUrl(url));
    }
  }, [attendee]);

  if (!isOpen || !attendee) return null;

  const handlePrint = () => {
    printElementCleanly('printable-badge', `${customName || attendee?.name || 'Attendee'} - Badge`);
  };

  const handleReprintSubmit = () => {
    if (onReprint) {
      onReprint(attendee.id, staffUser, reprintReason || "Badge re-issue requested");
      setShowReasonBox(false);
      setReprintReason('');
      printElementCleanly('printable-badge', `${customName || attendee?.name || 'Attendee'} - Badge`);
    }
  };

  // Preset quick load: Dr. Nana Assyne from user's photo
  const handleLoadSampleFromPhoto = () => {
    setCustomTitle("Dr.");
    setCustomName("NANA ASSYNE");
    setCustomCountry("Ghana");
    setCustomOrg("GIMPA");
    setCustomCategory("PARTICIPANT");
    setCustomEventTitle("10th HR Café");
    setCustomEventSubtitle("GHANA • BURKINA FASO");
    setCustomEventTagline("SERVE • SHARE • BUILD");
    setCustomEdition("10th Edition | First International Edition");
    setCustomDates("6th - 13th September 2026");
    setCustomVenue("Kofi Annan International Peacekeeping Training Centre, Accra, Ghana");
    setScanLabel("SCAN FOR CONTACT");
    setBannerPalette("pan_african");
    setBadgeTemplate("lanyard");
  };

  const handleResetToAttendee = () => {
    const parsed = detectTitleAndName(attendee?.name || "");
    setCustomTitle(parsed.title);
    setCustomName(parsed.name);
    setCustomCountry(attendee?.country || "Ghana");
    setCustomOrg(attendee?.organization || "GIMPA");
    setCustomCategory((attendee?.category || "PARTICIPANT").toUpperCase());
    setCustomEventTitle(event?.title || tenant?.name || "10th HR Café");
    setCustomEventSubtitle("GHANA • BURKINA FASO");
    setCustomEventTagline(event?.tagline || "SERVE • SHARE • BUILD");
    setCustomEdition("10th Edition | First International Edition");
    setCustomDates("6th - 13th September 2026");
    setCustomVenue(event?.venue || "Kofi Annan International Peacekeeping Training Centre, Accra, Ghana");
    setScanLabel("SCAN FOR CONTACT");
  };

  const categoryColors = {
    VIP: "bg-purple-600 text-white",
    Speaker: "bg-indigo-600 text-white",
    Attendee: "bg-slate-700 text-white",
    Participant: "bg-slate-900 text-white",
    PARTICIPANT: "bg-slate-900 text-white",
    Sponsor: "bg-amber-600 text-white",
    Press: "bg-rose-600 text-white"
  };

  const badgeCategoryColor = categoryColors[customCategory] || "bg-indigo-600 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:bg-transparent print:p-0 print:static print:overflow-visible">
      <div className="relative w-full max-w-xl bg-[#1a1a19] border border-white/15 rounded-3xl shadow-2xl p-4 sm:p-6 my-4 text-white print:bg-transparent print:border-none print:shadow-none print:p-0 print:m-0">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FB9378]/15 text-[#FB9378] border border-[#FB9378]/30 uppercase tracking-wider font-mono">
                Official Convention Tag
              </span>
              <span className="text-xs text-white/50">• High-DPI Thermal & Lanyard Print</span>
            </div>
            <h3 className="text-lg font-heading font-extrabold text-white flex items-center gap-2 mt-1">
              <Printer className="w-5 h-5 text-[#FB9378]" />
              <span>Conference Badge Production</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Action & Template Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#141413] p-2.5 rounded-2xl border border-white/10 mb-4 print:hidden">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setBadgeTemplate('lanyard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                badgeTemplate === 'lanyard'
                  ? 'bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold shadow-md'
                  : 'bg-[#252523] text-white/60 hover:text-white'
              }`}
            >
              <span>🏷️ Conference Lanyard Tag (HR Café Style)</span>
            </button>

            <button
              type="button"
              onClick={() => setBadgeTemplate('photo_id')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                badgeTemplate === 'photo_id'
                  ? 'bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold shadow-md'
                  : 'bg-[#252523] text-white/60 hover:text-white'
              }`}
            >
              <span>🪪 Executive Photo ID Pass</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleFromPhoto}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#E0C97E]/15 hover:bg-[#E0C97E]/25 text-[#FCF8B3] border border-[#E0C97E]/30 flex items-center gap-1 transition-all"
              title="Instantly preview Dr. Nana Assyne badge exactly like the uploaded photo"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E0C97E]" />
              <span>Load Photo Sample (Nana Assyne)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                showCustomizer 
                  ? 'bg-[#FB9378] text-black border-[#FB9378]' 
                  : 'bg-[#252523] text-white/70 border-white/10 hover:bg-[#323230]'
              }`}
              title="Edit Badge Text Fields"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Badge Customizer Drawer */}
        {showCustomizer && (
          <div className="bg-[#141413] border border-white/10 rounded-2xl p-4 mb-4 space-y-3 text-xs animate-fade-in print:hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#FB9378]" />
                <span>Live Badge Text Customizer</span>
              </span>
              <button
                type="button"
                onClick={handleResetToAttendee}
                className="text-[11px] text-white/40 hover:text-white flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" /> Reset to Attendee Data
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Prefix / Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Dr. / Prof. / Mr."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name (Uppercase)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                  placeholder="e.g. NANA ASSYNE"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Country / Nationality</label>
                <input
                  type="text"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder="e.g. Ghana"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Institution / Company</label>
                <input
                  type="text"
                  value={customOrg}
                  onChange={(e) => setCustomOrg(e.target.value)}
                  placeholder="e.g. GIMPA"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Role / Badge Category</label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value.toUpperCase())}
                  placeholder="e.g. PARTICIPANT"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-extrabold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Event Edition Subtitle</label>
                <input
                  type="text"
                  value={customEdition}
                  onChange={(e) => setCustomEdition(e.target.value)}
                  placeholder="e.g. 10th Edition | First International Edition"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Venue & Location</label>
                <input
                  type="text"
                  value={customVenue}
                  onChange={(e) => setCustomVenue(e.target.value)}
                  placeholder="e.g. Kofi Annan Peacekeeping Centre, Accra"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PRINTABLE BADGE CONTAINER (Matches Standard 4in x 6in Convention Lanyard Tag)
            ========================================================================= */}
        <div className="flex justify-center my-3 overflow-visible">
          
          {/* TEMPLATE 1: EXACT MATCH TO USER'S UPLOADED PHOTO (HR Café Style Conference Lanyard Tag) */}
          {badgeTemplate === 'lanyard' && (
            <div 
              id="printable-badge" 
              className="w-[330px] min-h-[510px] bg-white text-slate-900 rounded-[28px] shadow-2xl overflow-hidden flex flex-col justify-between border-2 border-slate-200/90 relative select-none print:shadow-none print:border-none print:m-0"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {/* Dual Metallic Lanyard Hole Punches & Clips (Top Left & Top Right) */}
              <div className="absolute top-3 left-6 z-20 flex flex-col items-center pointer-events-none">
                {/* Silver Metal Eyelet Ring */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-400 border border-slate-400/80 shadow-sm flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
                </div>
                {/* Silver Metal Clip Hook Accent */}
                <div className="w-3.5 h-5 border-2 border-slate-400 rounded-b-md -mt-2 opacity-85" />
              </div>

              <div className="absolute top-3 right-6 z-20 flex flex-col items-center pointer-events-none">
                {/* Silver Metal Eyelet Ring */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-400 border border-slate-400/80 shadow-sm flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
                </div>
                {/* Silver Metal Clip Hook Accent */}
                <div className="w-3.5 h-5 border-2 border-slate-400 rounded-b-md -mt-2 opacity-85" />
              </div>

              {/* TOP HEADER: Celebratory Curved Pan-African / Conference Ribbon Banner (Red, Gold, Green) */}
              <div className="relative w-full h-[66px] overflow-hidden bg-white">
                <svg className="w-full h-full" viewBox="0 0 330 66" fill="none" preserveAspectRatio="none">
                  {/* Green Band */}
                  <path d="M0,0 L330,0 L330,28 C230,10 130,36 0,56 Z" fill="#059669" />
                  {/* Gold/Yellow Band */}
                  <path d="M0,0 L330,0 L330,20 C240,4 140,28 0,44 Z" fill="#f59e0b" />
                  {/* Red Band */}
                  <path d="M0,0 L330,0 L330,12 C260,2 170,18 0,30 Z" fill="#dc2626" />
                </svg>
              </div>

              {/* EVENT BRANDING & LOGO */}
              <div className="text-center px-4 -mt-3.5 z-10">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  {/* Distinctive Logo Icon */}
                  <div className="w-8 h-8 rounded-xl bg-white shadow-md border border-slate-200/90 flex items-center justify-center p-1">
                    {tenant?.logoUrl ? (
                      <img src={tenant.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <span className="text-sm">☕</span>
                    )}
                  </div>
                  <div className="text-left leading-none">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black tracking-tight text-rose-600">
                        {customEventTitle.split(' ')[0] || "10th"}
                      </span>
                      <span className="text-base font-black text-slate-800">
                        {customEventTitle.split(' ').slice(1).join(' ') || "HR Café"}
                      </span>
                    </div>
                    <p className="text-[7.5px] font-extrabold text-slate-500 uppercase tracking-wider mt-0.5">
                      {customEventSubtitle}
                    </p>
                  </div>
                </div>
                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">
                  {customEventTagline}
                </p>
              </div>

              {/* WHITE INSET STICKER / BADGE CARD (Exact Match to Photo's Central Insert) */}
              <div className="mx-4 my-2.5 bg-white rounded-2xl border border-slate-300/80 shadow-md p-4 text-center relative z-10 flex flex-col items-center justify-center">
                {/* SCAN FOR CONTACT Label */}
                <p className="text-[10px] font-black tracking-[0.16em] text-slate-800 uppercase mb-2">
                  {scanLabel}
                </p>

                {/* Centered High-Contrast QR Barcode */}
                <div className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs inline-block mb-2.5">
                  {qrUrl && (
                    <img 
                      src={qrUrl} 
                      alt="Attendee QR" 
                      className="w-24 h-24 object-contain" 
                    />
                  )}
                </div>

                {/* Title / Prefix (e.g. Dr., Prof., Mr.) */}
                {customTitle && (
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    {customTitle}
                  </p>
                )}

                {/* Full Name in bold uppercase typography */}
                <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-snug uppercase mt-0.5 max-w-[260px] mx-auto">
                  {customName}
                </h2>

                {/* Country / Nationality */}
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  {customCountry}
                </p>

                {/* Organization / Institution */}
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                  {customOrg}
                </p>

                {/* Category / Role in prominent bold uppercase */}
                <p className="text-sm font-black text-slate-950 tracking-wider mt-1.5 uppercase">
                  {customCategory}
                </p>

                {/* Multi-Day Pass Indicators Matrix */}
                <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t border-slate-100 w-full">
                  {eventDays.map((d, idx) => {
                    const isPermitted = (attendee.selectedDays || []).includes(d.id);
                    return (
                      <span
                        key={d.id}
                        className={`w-5 h-4.5 rounded text-[8px] font-black flex items-center justify-center border leading-none ${
                          isPermitted
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-300 border-slate-200 line-through'
                        }`}
                        title={`${d.label}: ${isPermitted ? 'Permitted' : 'Not Included'}`}
                      >
                        {`D${idx + 1}`}
                      </span>
                    );
                  })}
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase ml-1">
                    {attendee.passType === 'full_week' 
                      ? 'Full Pass' 
                      : attendee.passType === 'three_day' 
                      ? '3-Day' 
                      : `${attendee.selectedDays?.length || 1}D`}
                  </span>
                </div>
              </div>

              {/* BOTTOM CARD FOOTER (Event Edition, Dates & Venue) */}
              <div className="px-4 pb-3.5 pt-1 text-center border-t border-slate-100 bg-slate-50/60">
                <p className="text-[9px] font-bold text-slate-900 leading-tight">
                  {customEdition}
                </p>
                <p className="text-[8px] font-medium text-slate-600 mt-0.5">
                  {customDates}
                </p>
                <p className="text-[8px] font-semibold text-slate-700 leading-tight mt-0.5 max-w-[280px] mx-auto">
                  {customVenue}
                </p>
              </div>

            </div>
          )}

          {/* TEMPLATE 2: CLASSIC EXECUTIVE PHOTO ID PASS (With attendee headshot) */}
          {badgeTemplate === 'photo_id' && (
            <div 
              id="printable-badge" 
              className="w-[330px] min-h-[510px] bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border-2 border-slate-200 relative select-none print:shadow-none print:border-none print:m-0"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {/* Top Slot Guide */}
              <div className="pt-3 flex flex-col items-center">
                <div className="w-12 h-2 rounded-full bg-slate-200 mb-2" />
                
                {/* Event & Company Branding */}
                <div className="flex items-center gap-2 px-4">
                  <img
                    src={tenant?.logoUrl}
                    alt={tenant?.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-white"
                  />
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                      {tenant?.name}
                    </p>
                    <p className="text-xs font-extrabold text-slate-900 leading-tight truncate max-w-[200px]">
                      {event?.title || 'Global Tech Summit 2026'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Center: Attendee Photo & Identity */}
              <div className="text-center px-4 my-auto py-2">
                <div className="relative inline-block mx-auto mb-3">
                  <img
                    src={attendee.photoUrl}
                    alt={customName}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-slate-100 shadow-md mx-auto"
                  />
                  <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white shadow-sm flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>

                {customTitle && (
                  <p className="text-xs font-bold text-slate-600">{customTitle}</p>
                )}
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug uppercase">
                  {customName}
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {attendee.jobTitle}
                </p>
                <p className="text-xs font-bold text-indigo-700 mt-0.5">
                  {customOrg} • {customCountry}
                </p>
              </div>

              {/* Bottom: QR Ticket Code & Category Banner */}
              <div className="text-center bg-slate-50 border-t border-slate-200 pt-2 pb-3">
                <div className="flex items-center justify-center gap-3 px-4 mb-2">
                  {qrUrl && (
                    <img src={qrUrl} alt="QR Code" className="w-16 h-16 border border-slate-200 rounded-lg p-0.5 bg-white" />
                  )}
                  <div className="text-left font-mono">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Ticket Code</p>
                    <p className="text-sm font-bold text-slate-900">{attendee.ticketCode}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">
                      {event?.venue?.split(',')[0] || 'Conference Centre'}
                    </p>
                  </div>
                </div>

                {/* Multi-Day Attendance Access Matrix */}
                <div className="flex items-center justify-between px-4 py-1.5 mb-1.5 bg-slate-100 border-y border-slate-200">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">
                    {attendee.passType === 'full_week' 
                      ? '★ FULL WEEK PASS' 
                      : attendee.passType === 'three_day' 
                      ? '★ 3-DAY PASS' 
                      : `★ CUSTOM PASS (${attendee.selectedDays?.length || 1}D)`}
                  </span>
                  <div className="flex items-center gap-1">
                    {eventDays.map((d, idx) => {
                      const isPermitted = (attendee.selectedDays || []).includes(d.id);
                      return (
                        <span
                          key={d.id}
                          className={`w-5 h-4.5 rounded text-[9px] font-extrabold flex items-center justify-center border leading-none ${
                            isPermitted
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-300 border-slate-200 line-through'
                          }`}
                          title={`${d.label}: ${isPermitted ? 'Permitted' : 'Not Included'}`}
                        >
                          {`D${idx + 1}`}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Role / Category Ribbon */}
                <div className={`py-1.5 px-4 text-xs font-extrabold tracking-widest uppercase shadow-sm ${badgeCategoryColor}`}>
                  {customCategory}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Audit Print Count & Duplicate Handling */}
        <div className="bg-[#141413] rounded-2xl p-3.5 my-3 text-xs space-y-2 border border-white/10 print:hidden">
          <div className="flex justify-between items-center text-white/70">
            <span>Official Print Audit:</span>
            <span className="font-bold text-white px-2 py-0.5 bg-[#252523] rounded-lg border border-white/10">
              Printed {attendee.badgePrintedCount || 1} time(s)
            </span>
          </div>
          {attendee.badgePrintedCount > 1 && (
            <p className="text-[11px] text-[#FCF8B3] flex items-center gap-1 font-medium">
              <Shield className="w-3.5 h-3.5 shrink-0 text-[#E0C97E]" />
              Note: Duplicate reprint recorded in platform audit trail for security.
            </p>
          )}

          {showReasonBox && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <label className="block text-white/70 font-semibold text-[11px]">
                Reason for Badge Reprint:
              </label>
              <input
                type="text"
                value={reprintReason}
                onChange={(e) => setReprintReason(e.target.value)}
                placeholder="e.g. Lost lanyard, typo correction, delegate requested replacement..."
                className="w-full bg-[#1c1c1b] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FB9378]"
              />
              <button
                onClick={handleReprintSubmit}
                className="w-full py-2 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" /> Log Reprint & Print Badge
              </button>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 print:hidden">
          {!showReasonBox && (
            <button
              type="button"
              onClick={() => setShowReasonBox(true)}
              className="text-xs text-white/50 hover:text-[#FB9378] flex items-center gap-1 font-medium underline"
            >
              <RotateCw className="w-3 h-3" /> Log Duplicate Reprint
            </button>
          )}
          
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white rounded-xl bg-[#252523] hover:bg-[#323230] border border-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] hover:opacity-90 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-[#FB9378]/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Badge Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
