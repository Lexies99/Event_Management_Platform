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
  X,
  UserPlus,
  Trash2,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import BadgeModal from '../Common/BadgeModal';
import { generateQrDataUrl } from '../../utils/qr';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';
import { Storage } from '../../data/storage';

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
  
  // Multi-Staff Management State
  const [isMultiStaffModalOpen, setIsMultiStaffModalOpen] = useState(false);
  const [staffModalTab, setStaffModalTab] = useState('roster'); // 'roster' | 'add' | 'qr'
  const [staffList, setStaffList] = useState(() => Storage.getStaffMembers(tenant?.id));
  const [selectedStaffForQr, setSelectedStaffForQr] = useState(null);
  const [staffQrDataUrl, setStaffQrDataUrl] = useState(null);
  const [copiedStaffLink, setCopiedStaffLink] = useState(false);

  // New staff form fields
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffStation, setNewStaffStation] = useState('Desk 1 - Main Entrance');
  const [newStaffRole, setNewStaffRole] = useState('Check-In Scanner');
  const [newStaffPin, setNewStaffPin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [staffSuccessNotice, setStaffSuccessNotice] = useState('');

  const videoRef = useRef(null);

  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;
  const currentDayObj = eventDays.find(d => d.id === activeDayId) || eventDays[0];

  const eventRegistrations = registrations.filter(r => r.eventId === event?.id);

  // Refresh staff roster when tenant changes
  useEffect(() => {
    setStaffList(Storage.getStaffMembers(tenant?.id));
  }, [tenant?.id]);

  // Compute active station options dynamically
  const stationOptions = staffList.length > 0 
    ? [...new Set([...staffList.map(s => s.station), ...STATION_PRESETS])]
    : STATION_PRESETS;

  // Compute staff portal link (with optional personalized station parameters)
  const baseStaffPortalLink = `${window.location.origin}/?tenant=${tenant?.slug || 'test'}&role=staff`;
  const activeStaffPortalLink = selectedStaffForQr 
    ? `${baseStaffPortalLink}&station=${encodeURIComponent(selectedStaffForQr.station)}&staffUser=${encodeURIComponent(selectedStaffForQr.name)}`
    : baseStaffPortalLink;

  // Generate QR code for mobile scanners
  useEffect(() => {
    if (activeStaffPortalLink) {
      generateQrDataUrl(activeStaffPortalLink, {
        width: 280,
        margin: 1,
        darkColor: '#121819',
        lightColor: '#ffffff'
      }).then(url => setStaffQrDataUrl(url));
    }
  }, [activeStaffPortalLink, selectedStaffForQr]);

  // Handle adding new staff member
  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const created = Storage.addStaffMember({
      tenantId: tenant?.id || 'tenant-test',
      name: newStaffName.trim(),
      email: newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@eventplan.cloud`,
      phone: newStaffPhone.trim() || '+233 24 000 0000',
      station: newStaffStation.trim(),
      role: newStaffRole,
      pin: newStaffPin.trim() || '1234'
    });

    const updated = Storage.getStaffMembers(tenant?.id);
    setStaffList(updated);
    setStaffName(created.station);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffPin(Math.floor(1000 + Math.random() * 9000).toString());
    setStaffSuccessNotice(`Staff scanner "${created.name}" successfully provisioned for ${created.station}!`);
    setTimeout(() => setStaffSuccessNotice(''), 3500);
  };

  // Handle removing staff member
  const handleRemoveStaff = (staffId) => {
    Storage.removeStaffMember(staffId);
    const updated = Storage.getStaffMembers(tenant?.id);
    setStaffList(updated);
    if (selectedStaffForQr?.id === staffId) {
      setSelectedStaffForQr(null);
    }
  };

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
    navigator.clipboard.writeText(activeStaffPortalLink);
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1a2325] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#A3C6C4]/15 text-[#E0E7E9] border border-[#A3C6C4]/30 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#6C7A89]" /> High-Speed Check-In Station
            </span>
            <span className="text-xs text-white/50">• {event?.title}</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            On-Site Check-In &amp; Badge Dispatch
          </h1>
          <p className="text-xs text-white/60 mt-1 max-w-xl">
            Supports multiple simultaneous entrance desks, mobile phone scanners, and instant badge printing.
          </p>
        </div>

        {/* Multi-Admin Station Coordinator & Offline Badge */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Active Event Day Selector (Multi-Day Gate Control) */}
          <div className="bg-[#121819] border border-white/15 rounded-2xl p-2 px-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#6C7A89] shrink-0" />
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E0E7E9] uppercase tracking-wider block">
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
                  <option key={d.id} value={d.id} className="bg-[#121819] text-white">
                    {d.label} • {d.date}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Station Selector */}
          <div className="bg-[#121819] border border-white/15 rounded-2xl p-2 px-3 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#A3C6C4] shrink-0" />
            <div>
              <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider block">
                Active Station Desk:
              </span>
              <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {stationOptions.map((preset) => (
                  <option key={preset} value={preset} className="bg-[#121819] text-white">
                    {preset}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add / Manage Staff Scanners Button */}
          <button
            onClick={() => {
              setStaffModalTab('roster');
              setIsMultiStaffModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold text-xs shadow-lg shadow-[#354649]/30 transition-all hover:opacity-95 cursor-pointer"
            title="Manage check-in staff team and issue mobile scanner passes"
          >
            <Users className="w-4 h-4 text-[#E0E7E9]" />
            <span>Manage Staff Scanners</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 bg-[#1a2325] p-3.5 rounded-2xl border border-white/10 text-xs shadow-lg">
        <div className="px-3 py-1">
          <span className="text-white/50 block text-[11px]">Total Event Registrants</span>
          <span className="font-heading text-lg font-extrabold text-white">{eventRegistrations.length}</span>
        </div>
        <div className="px-3 py-1 border-l border-white/10">
          <span className="text-[#E0E7E9] block text-[11px] font-semibold">{currentDayObj.label} Passes</span>
          <span className="font-heading text-lg font-extrabold text-[#E0E7E9]">{eligibleTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-white/10">
          <span className="text-emerald-400 block text-[11px] font-semibold">{currentDayObj.label} Scanned In</span>
          <span className="font-heading text-lg font-extrabold text-emerald-400">{checkedInTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-white/10">
          <span className="text-[#6C7A89] block text-[11px] font-semibold">{currentDayObj.label} Awaiting</span>
          <span className="font-heading text-lg font-extrabold text-[#6C7A89]">{pendingTodayCount}</span>
        </div>
        <div className="px-3 py-1 border-l border-white/10 hidden lg:block">
          <span className="text-white/50 block text-[11px]">Active Day Status</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1 mt-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {currentDayObj.title || "Check-In Live"}
          </span>
        </div>
      </div>

      {/* Main Check-In Workstation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Optical & Hardware Scanner Workstation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#1a2325] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Camera &amp; Optical QR Scanner</span>
              </h2>
              <span className="text-[11px] font-mono text-white/40">FR-2.1 Target &lt; 1s</span>
            </div>

            {/* Video Scanner Viewport Mockup */}
            <div className="relative aspect-video bg-[#121819] rounded-2xl border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-48 h-48 border-2 border-emerald-400 rounded-3xl relative flex items-center justify-center animate-pulse">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce"></div>
                <QrCode className="w-16 h-16 text-emerald-400/40" />
                <span className="absolute bottom-3 text-[10px] font-mono text-emerald-300 text-center">
                  Aim Camera at Delegate QR Ticket
                </span>
              </div>
              <span className="mt-4 text-xs font-mono text-emerald-400/70">
                Hardware Barcode / Optical Camera Active
              </span>
            </div>

            {/* Manual Scan Input Field (High-speed barcode scanner input) */}
            <form onSubmit={(e) => { e.preventDefault(); handleExecuteCheckIn(scanInput); }} className="space-y-2">
              <label className="block text-xs font-bold font-mono text-white/70 uppercase tracking-wider">
                Scan Input (Auto-Focus Barcode Reader or Ticket Code):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Scan or type ticket code (e.g. TKT-ACME-...)"
                  className="flex-1 px-4 py-3 bg-[#121819] border border-white/15 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-emerald-400 placeholder:text-white/30"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Process
                </button>
              </div>
            </form>

            {/* Quick One-Click Demo Scans */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-white/40 block mb-2 uppercase">
                Simulate Scans with Sample Attendee Tickets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sampleTickets.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleExecuteCheckIn(t.ticketCode)}
                    className="p-2 rounded-xl bg-[#121819] hover:bg-[#243033] border border-white/10 text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-white truncate group-hover:text-[#E0E7E9]">{t.name}</p>
                    <p className="text-[10px] font-mono text-[#6C7A89] truncate">{t.ticketCode}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Last Scan Result Feedback Card */}
          {lastScanResult && (
            <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
              lastScanResult.success 
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                : lastScanResult.alreadyCheckedIn
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {lastScanResult.success ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-white">
                      {lastScanResult.success ? "Check-In Approved & Verified" : "Scan Attention Required"}
                    </h3>
                    <p className="text-xs mt-0.5 leading-relaxed">
                      {lastScanResult.message}
                    </p>
                  </div>
                </div>

                {lastScanResult.attendee && (
                  <button
                    onClick={() => setBadgeModalAttendee(lastScanResult.attendee)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold text-xs shadow-md shrink-0 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Badge</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Manual Fallback Search & Live Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Manual Search Fallback (FR-2.2) */}
          <div className="bg-[#1a2325] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#A3C6C4]" />
                <span>Manual Search Fallback (FR-2.2)</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Search by delegate name, email, phone number, or ticket code if delegate forgot their ticket.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="Search attendee by name, email or phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#121819] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#A3C6C4] placeholder:text-white/30"
              />
            </div>

            {/* Search Results Dropdown List */}
            {searchResults.length > 0 && (
              <div className="space-y-2 pt-2">
                {searchResults.map(attendee => {
                  const isCheckedIn = (attendee.dailyAttendance?.[activeDayId]?.checkedIn || attendee.dailyAttendance?.[activeDayId]?.attended);
                  return (
                    <div 
                      key={attendee.id} 
                      className="p-3 bg-[#121819] rounded-xl border border-white/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{attendee.name}</p>
                        <p className="text-[10px] text-white/50 truncate">{attendee.organization} • {attendee.ticketCode}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isCheckedIn ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Checked In
                          </span>
                        ) : (
                          <button
                            onClick={() => handleExecuteCheckIn(attendee.ticketCode)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
                          >
                            Check In
                          </button>
                        )}
                        <button
                          onClick={() => setBadgeModalAttendee(attendee)}
                          className="p-1.5 rounded-lg bg-[#243033] hover:bg-[#2f3e42] text-white/80 hover:text-white transition-colors cursor-pointer"
                          title="Print Badge"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recently Checked-In Live Stream */}
          <div className="bg-[#1a2325] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-xs uppercase tracking-wider text-white/60">
                Recently Checked-In Queue
              </h2>
              <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Sync
              </span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {eventRegistrations
                .filter(r => (r.dailyAttendance?.[activeDayId]?.checkedIn || r.dailyAttendance?.[activeDayId]?.attended))
                .slice(-6)
                .reverse()
                .map(attendee => (
                  <div key={attendee.id} className="p-3 bg-[#121819] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{attendee.name}</p>
                      <p className="text-[10px] text-white/40 truncate">
                        {attendee.ticketCode} • {attendee.dailyAttendance?.[activeDayId]?.checkedInBy || staffName}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                      Verified
                    </span>
                  </div>
                ))}
              {eventRegistrations.filter(r => (r.dailyAttendance?.[activeDayId]?.checkedIn || r.dailyAttendance?.[activeDayId]?.attended)).length === 0 && (
                <div className="py-8 text-center text-xs text-white/40">
                  No attendees checked in yet for {currentDayObj.label}. Scan or search above to begin!
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          COMPREHENSIVE MULTI-STAFF MANAGEMENT & SCANNER ACCESS MODAL
          Tabs: 1. Team Roster & Add Staff | 2. Mobile QR & Fast Access
          ========================================================================= */}
      {isMultiStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          
          {/* Iridescent Gradient Border Container */}
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#354649] via-[#6C7A89] to-[#A3C6C4] p-[1.5px] rounded-3xl shadow-[0_0_60px_rgba(251,147,120,0.25)] my-6">
            
            <div className="relative w-full bg-[#182224] rounded-[22.5px] p-6 sm:p-8 text-white flex flex-col max-h-[92vh]">
              
              {/* Close Button */}
              <button
                onClick={() => setIsMultiStaffModalOpen(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3.5 mb-5 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] flex items-center justify-center shadow-lg shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-white">
                    Check-In Staff &amp; Scanner Team
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">
                    Provision station ushers, assign entry desks, and manage mobile scanning passes
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-white/10 gap-4 text-xs font-semibold mb-5 shrink-0">
                <button
                  type="button"
                  onClick={() => setStaffModalTab('roster')}
                  className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    staffModalTab === 'roster'
                      ? 'border-[#6C7A89] text-[#E0E7E9] font-extrabold'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#6C7A89]" />
                  <span>Team Roster &amp; Add Staff ({staffList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStaffModalTab('qr')}
                  className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    staffModalTab === 'qr'
                      ? 'border-[#6C7A89] text-[#E0E7E9] font-extrabold'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#A3C6C4]" />
                  <span>Mobile QR Fast Connect</span>
                </button>
              </div>

              {/* Success Notification Alert */}
              {staffSuccessNotice && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{staffSuccessNotice}</span>
                </div>
              )}

              {/* CONTENT AREA */}
              <div className="overflow-y-auto flex-1 pr-1 space-y-5">
                
                {/* =========================================================================
                    TAB 1: STAFF ROSTER & ADD NEW STAFF MEMBER
                    ========================================================================= */}
                {staffModalTab === 'roster' && (
                  <div className="space-y-5">
                    
                    {/* Add New Staff Form Card */}
                    <div className="bg-[#121819] border border-white/10 rounded-2xl p-4 sm:p-5">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E0E7E9] flex items-center gap-1.5 mb-3">
                        <UserPlus className="w-4 h-4 text-[#6C7A89]" />
                        <span>Provision New Staff Scanner</span>
                      </h4>

                      <form onSubmit={handleAddStaffSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          
                          {/* Name Input */}
                          <div>
                            <label className="block text-[11px] font-bold text-white/70 mb-1">
                              Staff Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={newStaffName}
                              onChange={(e) => setNewStaffName(e.target.value)}
                              placeholder="e.g. Kwame Mensah"
                              className="w-full px-3 py-2 bg-[#1a2325] border border-white/15 focus:border-[#6C7A89] rounded-xl text-xs text-white focus:outline-none"
                            />
                          </div>

                          {/* Email Input */}
                          <div>
                            <label className="block text-[11px] font-bold text-white/70 mb-1">
                              Staff Email (Optional)
                            </label>
                            <input
                              type="email"
                              value={newStaffEmail}
                              onChange={(e) => setNewStaffEmail(e.target.value)}
                              placeholder="e.g. kwame@eventplan.cloud"
                              className="w-full px-3 py-2 bg-[#1a2325] border border-white/15 focus:border-[#6C7A89] rounded-xl text-xs text-white focus:outline-none"
                            />
                          </div>

                          {/* Station Desk Selector */}
                          <div>
                            <label className="block text-[11px] font-bold text-white/70 mb-1">
                              Assigned Station / Desk
                            </label>
                            <input
                              type="text"
                              required
                              value={newStaffStation}
                              onChange={(e) => setNewStaffStation(e.target.value)}
                              placeholder="e.g. Desk 4 - Fast Track Gate"
                              className="w-full px-3 py-2 bg-[#1a2325] border border-white/15 focus:border-[#6C7A89] rounded-xl text-xs text-white focus:outline-none"
                            />
                          </div>

                          {/* Station Role & PIN */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-white/70 mb-1">
                                Role
                              </label>
                              <select
                                value={newStaffRole}
                                onChange={(e) => setNewStaffRole(e.target.value)}
                                className="w-full px-2.5 py-2 bg-[#1a2325] border border-white/15 focus:border-[#6C7A89] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                              >
                                <option value="Check-In Scanner">Scanner</option>
                                <option value="Lead Supervisor">Supervisor</option>
                                <option value="Badge Operator">Badge Operator</option>
                                <option value="Gate Usher">Gate Usher</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-white/70 mb-1">
                                Station PIN
                              </label>
                              <input
                                type="text"
                                maxLength={6}
                                value={newStaffPin}
                                onChange={(e) => setNewStaffPin(e.target.value)}
                                placeholder="PIN"
                                className="w-full px-2.5 py-2 bg-[#1a2325] border border-white/15 focus:border-[#6C7A89] rounded-xl text-xs text-center font-mono font-bold text-[#E0E7E9] focus:outline-none"
                              />
                            </div>
                          </div>

                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] hover:opacity-90 text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Add Staff Member</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Active Staff Roster List */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/50 px-1">
                        <span>Provisioned Staff Team ({staffList.length})</span>
                        <span>Multi-Desk Security</span>
                      </div>

                      {staffList.map((staff) => (
                        <div
                          key={staff.id}
                          className="p-3.5 bg-[#121819] border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Staff Initial Monogram */}
                            <div 
                              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-black shrink-0 shadow-inner"
                              style={{ 
                                background: 'linear-gradient(135deg, #354649 0%, #6C7A89 50%, #A3C6C4 100%)'
                              }}
                            >
                              {staff.name.charAt(0)}
                            </div>
                            <div className="truncate">
                              <div className="flex items-center gap-2">
                                <p className="font-heading font-extrabold text-xs text-white truncate">
                                  {staff.name}
                                </p>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#A3C6C4]/15 text-[#E0E7E9] border border-[#A3C6C4]/30 uppercase">
                                  {staff.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-white/50 truncate font-mono mt-0.5">
                                {staff.station} • PIN: <strong className="text-white">{staff.pin}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            {/* Fast QR Access Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStaffForQr(staff);
                                setStaffModalTab('qr');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#243033] hover:bg-[#2f3e42] text-xs font-semibold text-white/90 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Show personalized mobile scanner QR code"
                            >
                              <QrCode className="w-3.5 h-3.5 text-[#6C7A89]" />
                              <span>Mobile QR Pass</span>
                            </button>

                            {/* Remove Staff */}
                            <button
                              type="button"
                              onClick={() => handleRemoveStaff(staff.id)}
                              className="p-1.5 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Remove staff scanner"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {staffList.length === 0 && (
                        <div className="py-8 text-center text-xs text-white/40 bg-[#121819] rounded-2xl border border-white/5">
                          No staff members added yet. Fill out the form above to add your event check-in team!
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* =========================================================================
                    TAB 2: MOBILE SCANNER QR CODE & DIRECT LOGIN PASS
                    ========================================================================= */}
                {staffModalTab === 'qr' && (
                  <div className="space-y-4">
                    
                    {/* Staff Member Selector for QR */}
                    <div className="bg-[#121819] p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-white/70">
                        Station Pass For:
                      </span>
                      <select
                        value={selectedStaffForQr ? selectedStaffForQr.id : 'all'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'all') {
                            setSelectedStaffForQr(null);
                          } else {
                            const found = staffList.find(s => s.id === val);
                            setSelectedStaffForQr(found || null);
                          }
                        }}
                        className="bg-[#1a2325] border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-[#E0E7E9] focus:outline-none cursor-pointer"
                      >
                        <option value="all">★ All Staff (General Scanner Link)</option>
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.station})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* QR Code Card */}
                    <div className="bg-[#121819] p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                      <div className="p-3 bg-white rounded-2xl shadow-xl mb-3 border-2 border-[#A3C6C4]/30">
                        {staffQrDataUrl ? (
                          <img src={staffQrDataUrl} alt="Staff Portal QR" className="w-44 h-44 object-contain" />
                        ) : (
                          <div className="w-44 h-44 bg-stone-200 animate-pulse rounded-xl" />
                        )}
                      </div>
                      
                      <span className="text-sm font-heading font-extrabold text-white mb-0.5">
                        {selectedStaffForQr ? `${selectedStaffForQr.name}'s Station Pass` : "Scan with Staff Mobile Camera"}
                      </span>
                      <p className="text-xs text-white/60 max-w-sm mb-4 leading-relaxed">
                        Point any smartphone camera at this QR code to immediately launch the scanner desk pre-configured for{" "}
                        <strong className="text-[#E0E7E9]">{selectedStaffForQr ? selectedStaffForQr.station : "this event"}</strong>.
                      </p>

                      {/* Direct URL Share */}
                      <div className="w-full max-w-md bg-black/60 border border-white/10 p-2.5 rounded-xl flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-[#E0E7E9] truncate flex-1 text-left">
                          {activeStaffPortalLink}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyStaffLink}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#243033] hover:bg-[#2f3e42] text-white font-bold text-xs shrink-0 transition-colors border border-white/15 cursor-pointer"
                        >
                          {copiedStaffLink ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#6C7A89]" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
                <span>Multi-station check-in is active for <strong>{tenant?.name}</strong></span>
                <button
                  type="button"
                  onClick={() => setIsMultiStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#243033] hover:bg-[#2f3e42] text-white font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  Close Coordinator
                </button>
              </div>

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
