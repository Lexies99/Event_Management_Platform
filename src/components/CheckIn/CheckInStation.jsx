import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  Search, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Wifi, 
  WifiOff, 
  UserCheck, 
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Users,
  Share2,
  Copy,
  Check,
  Smartphone,
  Plus,
  Monitor,
  Calendar,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import BadgeModal from '../Common/BadgeModal';
import { generateQrDataUrl } from '../../utils/qr';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';

const STATION_PRESETS = [
  "Desk 1 - Main Entrance (Kofi)",
  "Desk 2 - General Admission (Ama)",
  "Desk 3 - VIP & Speakers (Sarah)",
  "Desk 4 - Fast Track Scanner",
  "Desk 5 - Mobile Roaming Staff"
];

export default function CheckInStation({
  tenant,
  event,
  registrations,
  onCheckInByCode,
  onReprintBadge,
  isOffline,
  offlineQueue,
  onSyncOffline
}) {
  const [scanInput, setScanInput] = useState('');
  const [staffName, setStaffName] = useState(STATION_PRESETS[0]);
  const [activeDayId, setActiveDayId] = useState('day-1');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [badgeModalAttendee, setBadgeModalAttendee] = useState(null);
  const [manualQuery, setManualQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMultiStaffModalOpen, setIsMultiStaffModalOpen] = useState(false);
  const [staffQrDataUrl, setStaffQrDataUrl] = useState(null);
  const [copiedStaffLink, setCopiedStaffLink] = useState(false);
  const videoRef = useRef(null);

  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;
  const currentDayObj = eventDays.find(d => d.id === activeDayId) || eventDays[0];

  const eventRegistrations = registrations.filter(r => r.eventId === event?.id);
  const staffPortalLink = `${window.location.origin}/?tenant=${tenant?.slug}&role=staff`;

  // Generate QR code for other admins / staff to join on their phones
  useEffect(() => {
    if (staffPortalLink) {
      generateQrDataUrl(staffPortalLink, {
        width: 260,
        margin: 1,
        darkColor: '#141413',
        lightColor: '#ffffff'
      }).then(url => setStaffQrDataUrl(url));
    }
  }, [staffPortalLink]);

  // Manual search matching
  const searchResults = manualQuery.trim() === '' 
    ? [] 
    : eventRegistrations.filter(r => 
        r.name.toLowerCase().includes(manualQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(manualQuery.toLowerCase()) ||
        r.phone.includes(manualQuery) ||
        r.ticketCode.toLowerCase().includes(manualQuery.toLowerCase())
      ).slice(0, 5);

  const handleExecuteCheckIn = (ticketCode) => {
    if (!ticketCode.trim()) return;

    const result = onCheckInByCode(
      ticketCode.trim(), 
      staffName, 
      isOffline, 
      activeDayId, 
      currentDayObj.label
    );
    setLastScanResult(result);
    setScanInput('');

    if (result.success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleCopyStaffLink = () => {
    navigator.clipboard.writeText(staffPortalLink);
    setCopiedStaffLink(true);
    setTimeout(() => setCopiedStaffLink(false), 2500);
  };

  // Sample tickets for quick testing demo
  const sampleTickets = eventRegistrations.slice(0, 4);

  // Daily multi-day stats
  const eligibleTodayCount = eventRegistrations.filter(r => (r.selectedDays || []).includes(activeDayId)).length;
  const checkedInTodayCount = eventRegistrations.filter(r => (r.dailyAttendance?.[activeDayId]?.checkedIn || r.dailyAttendance?.[activeDayId]?.attended || !!r.dailyAttendance?.[activeDayId])).length;
  const pendingTodayCount = eligibleTodayCount - checkedInTodayCount;

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Multi-Staff Identity & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1c1c1b] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#E0C97E]/15 text-[#FCF8B3] border border-[#E0C97E]/30 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#FB9378]" /> High-Speed Check-In Station
            </span>
            <span className="text-xs text-white/50">• {event?.title}</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            On-Site Check-In & Badge Dispatch
          </h1>
          <p className="text-xs text-white/60 mt-1 max-w-xl">
            Supports multiple simultaneous entrance desks, mobile phone scanners, and instant badge printing.
          </p>
        </div>

        {/* Multi-Admin Station Coordinator & Offline Badge */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Active Event Day Selector (Multi-Day Gate Control) */}
          <div className="bg-[#141413] border border-white/15 rounded-2xl p-2 px-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FB9378] shrink-0" />
            <div>
              <span className="text-[10px] font-mono font-bold text-[#FCF8B3] uppercase tracking-wider block">
                Active Event Day:
              </span>
              <select
                value={activeDayId}
                onChange={(e) => {
                  setActiveDayId(e.target.value);
                  setLastScanResult(null);
                }}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {eventDays.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#141413] text-white">
                    {d.label} • {d.date}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Station Selector */}
          <div className="bg-[#141413] border border-white/15 rounded-2xl p-2 px-3 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#E0C97E] shrink-0" />
            <div>
              <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider block">
                Active Station Desk:
              </span>
              <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {STATION_PRESETS.map((preset) => (
                  <option key={preset} value={preset} className="bg-[#141413] text-white">
                    {preset}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Multiple Staff Devices Button */}
          <button
            onClick={() => setIsMultiStaffModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold text-xs shadow-lg shadow-[#FB9378]/20 transition-all hover:opacity-95"
            title="Add multiple check-in admins and open scanner on phones"
          >
            <Users className="w-4 h-4 text-black" />
            <span>Add Staff Scanners</span>
          </button>

          {/* Offline indicator if active */}
          {isOffline && (
            <div className="px-3 py-2 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-300 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <WifiOff className="w-4 h-4" />
              <span>Offline ({offlineQueue?.length || 0})</span>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Station & Multi-Day Live Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 bg-[#1c1c1b] p-3.5 rounded-2xl border border-white/10 text-xs shadow-lg">
        <div className="px-3 py-1">
          <span className="text-white/50 block text-[11px]">Total Event Registrants</span>
          <span className="font-heading text-lg font-extrabold text-white">{eventRegistrations.length}</span>
        </div>
        <div className="px-3 py-1 border-l border-white/10">
          <span className="text-[#FCF8B3] block text-[11px] font-semibold">{currentDayObj.label} Passes</span>
          <span className="font-heading text-lg font-extrabold text-[#FCF8B3]">{eligibleTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-white/10">
          <span className="text-[#FB9378] block text-[11px] font-semibold">{currentDayObj.label} Scanned In</span>
          <span className="font-heading text-lg font-extrabold text-[#FB9378]">{checkedInTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-white/10">
          <span className="text-[#E0C97E] block text-[11px] font-semibold">{currentDayObj.label} Awaiting</span>
          <span className="font-heading text-lg font-extrabold text-[#E0C97E]">{pendingTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-white/10 hidden lg:flex items-center justify-between">
          <div>
            <span className="text-white/50 block text-[11px]">Active Day Status</span>
            <span className="text-xs font-bold text-white truncate max-w-[120px]">
              {currentDayObj.name.split(' - ')[1] || currentDayObj.name}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        </div>
      </div>

      {/* Main Grid: QR Scanner & Manual Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: QR CODE SCANNER (FR-2.1) */}
        <div className="bg-[#1c1c1b] p-6 rounded-3xl border border-white/10 space-y-5 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#FB9378]" />
              <span>Camera & Optical QR Scanner</span>
            </h3>
            <span className="text-[11px] text-white/40 font-mono">FR-2.1 Target &lt; 1s</span>
          </div>

          {/* Scanner Viewport / Simulation */}
          <div className="relative aspect-video bg-[#141413] rounded-2xl border-2 border-dashed border-white/15 overflow-hidden flex flex-col items-center justify-center p-6 text-center group">
            
            {/* Visual target reticle */}
            <div className="w-44 h-44 border-2 border-[#FB9378]/60 rounded-2xl relative flex items-center justify-center shadow-lg">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FB9378] -mt-1 -ml-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FB9378] -mt-1 -mr-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FB9378] -mb-1 -ml-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FB9378] -mb-1 -mr-1" />
              
              {/* Laser scanning beam animation */}
              <div className="w-full h-0.5 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] shadow-[0_0_12px_#FB9378] animate-bounce" />

              <div className="text-center text-xs text-white/50 pointer-events-none px-2">
                <QrCode className="w-8 h-8 text-white/30 mx-auto mb-1 group-hover:text-[#FB9378] transition-colors" />
                <span>Aim Camera at Delegate QR Ticket</span>
              </div>
            </div>

            <p className="text-[11px] text-white/40 mt-3 font-mono">
              Hardware Barcode / Optical Camera Active
            </p>
          </div>

          {/* Input field for handheld physical barcode gun & quick tests */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white/80 uppercase tracking-wider block">
              Scan Input (Auto-Focus Barcode Reader or Ticket Code)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleExecuteCheckIn(scanInput);
                  }
                }}
                placeholder="Scan or type ticket code (e.g. TKT-ACME-...)"
                className="flex-1 bg-[#141413] border border-white/10 focus:border-[#FB9378] rounded-xl px-4 py-2.5 text-xs font-mono text-[#FCF8B3] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleExecuteCheckIn(scanInput)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#FB9378]/20 transition-all hover:opacity-95"
              >
                Process
              </button>
            </div>

            {/* Quick 1-Click Test Scans */}
            <div className="pt-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-1.5">
                Simulate Scans with Sample Attendee Tickets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleTickets.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleExecuteCheckIn(t.ticketCode)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#141413] hover:bg-[#252523] text-white/80 border border-white/10 transition-colors flex items-center gap-1"
                  >
                    <span>{t.name.split(' ')[0]}</span>
                    <span className="text-[#FB9378] text-[10px]">({t.ticketCode.slice(-4)})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Last Scan Result Banner (FR-2.3 & Multi-Day Validation) */}
          {lastScanResult && (
            <div className={`p-4 rounded-2xl text-xs border animate-fade-in ${
              lastScanResult.success 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                : lastScanResult.notPermittedToday
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : lastScanResult.alreadyCheckedIn
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-start gap-3">
                {lastScanResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : lastScanResult.notPermittedToday ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : lastScanResult.alreadyCheckedIn ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-white">
                      {lastScanResult.message}
                    </p>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/30">
                      {lastScanResult.success ? 'Verified' : 'Blocked'}
                    </span>
                  </div>

                  {lastScanResult.attendee && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={lastScanResult.attendee.photoUrl} 
                          alt={lastScanResult.attendee.name} 
                          className="w-8 h-8 rounded-lg object-cover border border-white/20"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{lastScanResult.attendee.name}</p>
                          <p className="text-[10px] text-white/60">{lastScanResult.attendee.organization} • {lastScanResult.attendee.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setBadgeModalAttendee(lastScanResult.attendee)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-white/20"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Badge
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: MANUAL SEARCH FALLBACK & RECENT QUEUE */}
        <div className="space-y-6">
          
          {/* Manual Search Fallback */}
          <div className="bg-[#1c1c1b] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <div>
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <Search className="w-4 h-4 text-[#E0C97E]" />
                <span>Manual Search Fallback (FR-2.2)</span>
              </h3>
              <p className="text-xs text-white/50">
                Search by delegate name, email, phone number, or ticket code if delegate forgot their ticket.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-white/40" />
              <input
                type="text"
                placeholder="Search attendee by name, email or phone..."
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                className="w-full bg-[#141413] border border-white/10 focus:border-[#FB9378] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Results dropdown list */}
            {searchResults.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">
                  Matching Registrants ({searchResults.length}):
                </p>
                {searchResults.map((attendee) => {
                  const isPermittedToday = (attendee.selectedDays || []).includes(activeDayId);
                  const isCheckedInToday = (attendee.dailyAttendance?.[activeDayId]?.checkedIn || attendee.dailyAttendance?.[activeDayId]?.attended || !!attendee.dailyAttendance?.[activeDayId]);

                  return (
                    <div 
                      key={attendee.id}
                      className="bg-[#141413] border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={attendee.photoUrl} 
                          alt={attendee.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/15 shrink-0 bg-[#1c1c1b]" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white text-xs leading-snug">{attendee.name}</p>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-[#E0C97E]/15 text-[#FCF8B3] rounded border border-[#E0C97E]/30">
                              {attendee.passType === 'full_week' 
                                ? '5D Full' 
                                : attendee.passType === 'three_day'
                                ? '3D Pass'
                                : `${attendee.selectedDays?.length || 1}D Custom`}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50">{attendee.organization} • {attendee.category}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-[#FB9378]">{attendee.ticketCode}</span>
                            <span className="text-[10px] text-white/40">
                              Valid: {(attendee.selectedDays || []).map(d => d.replace('day-', 'D')).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isPermittedToday ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            No Access Today
                          </span>
                        ) : isCheckedInToday ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Checked In
                          </span>
                        ) : (
                          <button
                            onClick={() => handleExecuteCheckIn(attendee.ticketCode)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold text-xs transition-colors flex items-center gap-1 shadow-md shadow-[#FB9378]/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                            <span>Check In</span>
                          </button>
                        )}
                        <button
                          onClick={() => setBadgeModalAttendee(attendee)}
                          className="p-1.5 rounded-xl bg-[#252523] hover:bg-white/10 text-white/80 transition-colors border border-white/10"
                          title="Print Delegate Badge"
                        >
                          <Printer className="w-4 h-4 text-[#E0C97E]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {manualQuery.trim() !== '' && searchResults.length === 0 && (
              <p className="text-xs text-white/40 text-center py-3">
                No registrants found matching "{manualQuery}".
              </p>
            )}

          </div>

          {/* Recent Check-ins live audit feed */}
          <div className="bg-[#1c1c1b] p-5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center justify-between font-mono">
              <span>Recently Checked-In Queue</span>
              <span className="text-[#FCF8B3] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync
              </span>
            </h4>
            <div className="space-y-2">
              {eventRegistrations
                .filter(r => r.status === 'attended')
                .slice(0, 4)
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-white">{r.name}</span>
                      <span className="text-[10px] text-white/50">({r.category})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/50 block">by {r.checkedInBy || 'Staff Desk A'}</span>
                      <span className="text-[10px] font-mono text-[#E0C97E]">
                        {r.checkedInAt ? new Date(r.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

      {/* Multi-Admin / Mobile Staff Join Modal */}
      {isMultiStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#1c1c1b] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
            <button
              onClick={() => setIsMultiStaffModalOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">Multi-Admin Check-In Team Access</h3>
                <p className="text-xs text-white/50">
                  Multiple staff can scan attendees simultaneously on phones, tablets, or laptops
                </p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* QR Code for Staff Mobile Phones */}
              <div className="bg-[#141413] p-5 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                <div className="p-3 bg-white rounded-2xl shadow-xl mb-3">
                  {staffQrDataUrl ? (
                    <img src={staffQrDataUrl} alt="Staff Portal QR" className="w-40 h-40 object-contain" />
                  ) : (
                    <div className="w-40 h-40 bg-slate-200 animate-pulse rounded-xl" />
                  )}
                </div>
                <span className="text-xs font-bold text-white mb-0.5">Scan with Staff Phone Camera</span>
                <p className="text-[11px] text-white/50 max-w-xs">
                  Your event staff or ushers can point their phone camera here to instantly turn any mobile device into a check-in scanner station!
                </p>
              </div>

              {/* Direct Link Share */}
              <div>
                <label className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider block mb-1">
                  Staff Check-in Direct URL:
                </label>
                <div className="flex items-center gap-2 bg-[#141413] border border-white/10 p-2.5 rounded-xl">
                  <span className="font-mono text-xs text-[#FCF8B3] truncate flex-1">{staffPortalLink}</span>
                  <button
                    onClick={handleCopyStaffLink}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#252523] hover:bg-[#2e2e2b] text-white font-bold text-xs shrink-0 transition-colors border border-white/15"
                  >
                    {copiedStaffLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#FB9378]" />}
                    <span>{copiedStaffLink ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMultiStaffModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#252523] hover:bg-[#2e2e2b] text-white font-bold text-xs transition-colors border border-white/15"
              >
                Close Coordinator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Print Modal */}
      <BadgeModal
        isOpen={!!badgeModalAttendee}
        onClose={() => setBadgeModalAttendee(null)}
        attendee={badgeModalAttendee}
        tenant={tenant}
        event={event}
        onReprint={onReprintBadge}
        staffUser={staffName}
      />

    </div>
  );
}
