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
        darkColor: '#0f172a',
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
      // Fire celebration particles
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      // Automatically open badge preview for instant printing (FR-3.2)
      if (result.attendee) {
        setBadgeModalAttendee(result.attendee);
      }
    }
  };

  const handleCopyStaffLink = () => {
    navigator.clipboard.writeText(staffPortalLink);
    setCopiedStaffLink(true);
    setTimeout(() => setCopiedStaffLink(false), 2500);
  };

  // Mock tickets to test scan with 1 click
  const sampleTickets = eventRegistrations.slice(0, 5);

  // Overall Stats
  const attendedCount = eventRegistrations.filter(r => r.status === 'attended').length;
  const pendingCount = eventRegistrations.length - attendedCount;

  // Active Day Stats
  const eligibleTodayCount = eventRegistrations.filter(r => (r.selectedDays || []).includes(activeDayId)).length;
  const checkedInTodayCount = eventRegistrations.filter(r => (r.dailyAttendance?.[activeDayId]?.checkedIn || r.dailyAttendance?.[activeDayId]?.attended || !!r.dailyAttendance?.[activeDayId])).length;
  const pendingTodayCount = eligibleTodayCount - checkedInTodayCount;

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Multi-Staff Identity & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" /> High-Speed Check-In Station
            </span>
            <span className="text-xs text-slate-400">• {event?.title}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            On-Site Check-In & Badge Dispatch
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Supports multiple simultaneous entrance desks, mobile phone scanners, and instant badge printing.
          </p>
        </div>

        {/* Multi-Admin Station Coordinator & Offline Badge */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Active Event Day Selector (Multi-Day Gate Control) */}
          <div className="bg-slate-950/80 border border-indigo-500/40 rounded-2xl p-2 px-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
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
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                    {d.label} • {d.date}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Station Selector */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2 px-3 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Station Desk:
              </span>
              <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {STATION_PRESETS.map((preset) => (
                  <option key={preset} value={preset} className="bg-slate-900 text-white">
                    {preset}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Multiple Staff Devices Button */}
          <button
            onClick={() => setIsMultiStaffModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
            title="Add multiple check-in admins and open scanner on phones"
          >
            <Users className="w-4 h-4" />
            <span>Add Staff Scanners</span>
          </button>

          {/* Offline indicator if active */}
          {isOffline && (
            <div className="px-3 py-2 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-300 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <WifiOff className="w-4 h-4" />
              <span>Offline ({offlineQueue?.length || 0})</span>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Station & Multi-Day Live Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="px-3 py-1">
          <span className="text-slate-400 block text-[11px]">Total Event Registrants</span>
          <span className="text-base font-extrabold text-white">{eventRegistrations.length}</span>
        </div>
        <div className="px-3 py-1 border-l border-slate-800">
          <span className="text-indigo-400 block text-[11px] font-semibold">{currentDayObj.label} Passes</span>
          <span className="text-base font-extrabold text-indigo-300">{eligibleTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-slate-800">
          <span className="text-emerald-400 block text-[11px] font-semibold">{currentDayObj.label} Scanned In</span>
          <span className="text-base font-extrabold text-emerald-400">{checkedInTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-slate-800">
          <span className="text-amber-400 block text-[11px] font-semibold">{currentDayObj.label} Awaiting</span>
          <span className="text-base font-extrabold text-amber-400">{pendingTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-slate-800 hidden lg:flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px]">Active Day Status</span>
            <span className="text-xs font-bold text-cyan-400 truncate max-w-[120px]">
              {currentDayObj.name.split(' - ')[1] || currentDayObj.name}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        </div>
      </div>

      {/* Main Grid: QR Scanner & Manual Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: QR CODE SCANNER (FR-2.1) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              <span>Camera & Optical QR Scanner</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">FR-2.1 Target &lt; 1s</span>
          </div>

          {/* Scanner Viewport / Simulation */}
          <div className="relative aspect-video bg-slate-950 rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden flex flex-col items-center justify-center p-6 text-center group">
            
            {/* Visual target reticle */}
            <div className="w-44 h-44 border-2 border-emerald-500/60 rounded-2xl relative flex items-center justify-center shadow-lg">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 -mt-1 -ml-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 -mt-1 -mr-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 -mb-1 -ml-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 -mb-1 -mr-1" />
              
              {/* Laser scanning beam animation */}
              <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce" />

              <div className="text-center text-xs text-slate-400 pointer-events-none px-2">
                <QrCode className="w-8 h-8 text-slate-600 mx-auto mb-1 group-hover:text-emerald-400 transition-colors" />
                <span>Aim Camera at Delegate QR Ticket</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 font-mono">
              Hardware Barcode / Optical Camera Active
            </p>
          </div>

          {/* Input field for handheld physical barcode gun & quick tests */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
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
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleExecuteCheckIn(scanInput)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
              >
                Process
              </button>
            </div>

            {/* Quick 1-Click Test Scans */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
                Simulate Scans with Sample Attendee Tickets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleTickets.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleExecuteCheckIn(t.ticketCode)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <span>{t.name.split(' ')[0]}</span>
                    <span className="text-emerald-400 text-[10px]">({t.ticketCode.slice(-4)})</span>
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
                    <p className="font-bold text-white text-sm">
                      {lastScanResult.message}
                    </p>
                    {lastScanResult.attendee && (
                      <button
                        onClick={() => setBadgeModalAttendee(lastScanResult.attendee)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Badge</span>
                      </button>
                    )}
                  </div>

                  {lastScanResult.attendee && (
                    <div className="mt-2 text-[11px] text-slate-300 space-y-1">
                      <p><strong>Delegate:</strong> {lastScanResult.attendee.name} ({lastScanResult.attendee.organization})</p>
                      <p><strong>Pass Type:</strong> <span className="uppercase text-indigo-300 font-bold">{lastScanResult.attendee.passType?.replace('_', ' ') || 'Standard'}</span></p>
                      <p><strong>Station Operator:</strong> {lastScanResult.checkedInBy || staffName}</p>
                    </div>
                  )}

                  {/* Day Access Denied detail banner */}
                  {lastScanResult.notPermittedToday && lastScanResult.attendee && (
                    <div className="mt-2.5 p-2.5 bg-rose-950/60 border border-rose-800/60 rounded-xl text-[11px] text-rose-200 space-y-1">
                      <p className="font-bold flex items-center gap-1 text-rose-100">
                        <span>⛔ Gate Denial Reason:</span>
                        <span>This pass does NOT include access to {currentDayObj.label}.</span>
                      </p>
                      <div className="flex items-center gap-1 pt-1">
                        <span className="text-[10px] text-rose-300">Permitted days for this delegate:</span>
                        <div className="flex flex-wrap gap-1">
                          {(lastScanResult.attendee.selectedDays || []).map(dayId => {
                            const dObj = eventDays.find(d => d.id === dayId);
                            return (
                              <span key={dayId} className="px-1.5 py-0.2 bg-rose-500/30 text-white rounded font-mono text-[10px]">
                                {dObj?.label || dayId}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Duplicate warning detail banner (FR-2.4) */}
                  {lastScanResult.alreadyCheckedIn && (
                    <div className="mt-2 p-2 bg-black/30 rounded-xl text-[10px] text-amber-200">
                      ⚠️ Duplicate Entry Flagged: Previous check-in recorded at {new Date(lastScanResult.checkedInAt || lastScanResult.attendee?.checkedInAt).toLocaleTimeString()} by station {lastScanResult.checkedInBy || lastScanResult.attendee?.checkedInBy}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: MANUAL SEARCH FALLBACK (FR-2.2) */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <span>Manual Search Fallback (FR-2.2)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Search by delegate name, email, phone number, or ticket code if delegate forgot their ticket.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="Search attendee by name, email or phone..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Results dropdown list */}
            {searchResults.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Matching Registrants ({searchResults.length}):
                </p>
                {searchResults.map((attendee) => {
                  const isPermittedToday = (attendee.selectedDays || []).includes(activeDayId);
                  const isCheckedInToday = (attendee.dailyAttendance?.[activeDayId]?.checkedIn || attendee.dailyAttendance?.[activeDayId]?.attended || !!attendee.dailyAttendance?.[activeDayId]);
                  const isCheckedInAnyDay = attendee.status === 'attended';

                  return (
                    <div 
                      key={attendee.id}
                      className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={attendee.photoUrl} 
                          alt={attendee.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white text-xs leading-snug">{attendee.name}</p>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                              {attendee.passType === 'full_week' 
                                ? '5D Full' 
                                : attendee.passType === 'three_day'
                                ? '3D Pass'
                                : `${attendee.selectedDays?.length || 1}D Custom`}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">{attendee.organization} • {attendee.category}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-cyan-400">{attendee.ticketCode}</span>
                            <span className="text-[10px] text-slate-500">
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
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-md shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Check In</span>
                          </button>
                        )}
                        <button
                          onClick={() => setBadgeModalAttendee(attendee)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Print Delegate Badge"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {manualQuery.trim() !== '' && searchResults.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-3">
                No registrants found matching "{manualQuery}".
              </p>
            )}

          </div>

          {/* Recent Check-ins live audit feed */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Recently Checked-In Queue</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync
              </span>
            </h4>
            <div className="space-y-2">
              {eventRegistrations
                .filter(r => r.status === 'attended')
                .slice(0, 4)
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-white">{r.name}</span>
                      <span className="text-[10px] text-slate-400">({r.category})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">by {r.checkedInBy || 'Staff Desk A'}</span>
                      <span className="text-[10px] font-mono text-slate-500">
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
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100">
            <button
              onClick={() => setIsMultiStaffModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Multi-Admin Check-In Team Access</h3>
                <p className="text-xs text-slate-400">
                  Multiple staff can scan attendees simultaneously on phones, tablets, or laptops
                </p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* QR Code for Staff Mobile Phones */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
                <div className="p-3 bg-white rounded-2xl shadow-xl mb-3">
                  {staffQrDataUrl ? (
                    <img src={staffQrDataUrl} alt="Staff Portal QR" className="w-40 h-40 object-contain" />
                  ) : (
                    <div className="w-40 h-40 bg-slate-200 animate-pulse rounded-xl" />
                  )}
                </div>
                <span className="text-xs font-bold text-white mb-0.5">Scan with Staff Phone Camera</span>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Your event staff or ushers can point their phone camera here to instantly turn any mobile device into a check-in scanner station!
                </p>
              </div>

              {/* Direct Link Share */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Staff Check-in Direct URL:
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                  <span className="font-mono text-xs text-cyan-300 truncate flex-1">{staffPortalLink}</span>
                  <button
                    onClick={handleCopyStaffLink}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    {copiedStaffLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedStaffLink ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Multi-Desk Best Practices */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-Admin Coordination Guide:
                </p>
                <p>• <strong>Desk Naming:</strong> Set Desk 1, Desk 2, VIP Desk so each badge reprint & scan shows the staff actor.</p>
                <p>• <strong>Duplicate Prevention:</strong> If two admins accidentally scan the same attendee ticket, the system triggers a red duplicate warning banner with previous timestamp.</p>
                <p>• <strong>Real-time Sync:</strong> Attendance counts and badges update across all stations simultaneously.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMultiStaffModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
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
