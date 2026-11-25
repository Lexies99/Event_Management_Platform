import React, { useState, useRef, useEffect } from 'react';
import {
  QrCode,
  Search,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Printer,
  WifiOff,
  Users,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Calendar,
  X,
  UserPlus,
  Trash2,
  ShieldAlert,
  VideoOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import BadgeModal from '../Common/BadgeModal';
import AuditTrailPanel from '../Organizer/AuditTrailPanel';
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
  registrations = [],
  auditLogs = [],
  onCheckInByCode,
  onReprintBadge,
  isOffline,
  offlineQueue,
  onSyncOffline,
  initialStation,
}) {
  const [scanInput, setScanInput] = useState('');
  const [staffList, setStaffList] = useState(() => Storage.getStaffMembers(tenant?.id));
  const [staffName, setStaffName] = useState(initialStation || STATION_PRESETS[0]);
  const [activeDayId, setActiveDayId] = useState('day-1');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [badgeModalAttendee, setBadgeModalAttendee] = useState(null);
  const [manualQuery, setManualQuery] = useState('');

  // Real camera scanner state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanLoopRef = useRef(null);
  const scanInputRef = useRef(null);

  // Multi-Staff Management Modal
  const [isMultiStaffModalOpen, setIsMultiStaffModalOpen] = useState(false);
  const [staffModalTab, setStaffModalTab] = useState('roster');
  const [selectedStaffForQr, setSelectedStaffForQr] = useState(null);
  const [staffQrDataUrl, setStaffQrDataUrl] = useState(null);
  const [copiedStaffLink, setCopiedStaffLink] = useState(false);

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffStation, setNewStaffStation] = useState('Desk 1 - Main Entrance');
  const [newStaffRole, setNewStaffRole] = useState('Check-In Scanner');
  const [newStaffPin, setNewStaffPin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [staffSuccessNotice, setStaffSuccessNotice] = useState('');

  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;
  const currentDayObj = eventDays.find((d) => d.id === activeDayId) || eventDays[0];
  const eventRegistrations = registrations.filter((r) => r.eventId === event?.id);
  const tenantAuditLogs = auditLogs.filter((l) => l.tenantId === tenant?.id);

  useEffect(() => {
    const members = Storage.getStaffMembers(tenant?.id);
    setStaffList(members);
    if (initialStation) {
      setStaffName(initialStation);
    } else if (members.length > 0) {
      setStaffName(members[0].station);
    }
  }, [tenant?.id, initialStation]);

  const stationOptions = staffList.length > 0
    ? [...new Set([...staffList.map((s) => s.station), ...STATION_PRESETS])]
    : STATION_PRESETS;

  const baseStaffPortalLink = `${window.location.origin}/#/${tenant?.slug || 'acme'}/login`;
  const activeStaffPortalLink = selectedStaffForQr
    ? `${baseStaffPortalLink}?role=staff&station=${encodeURIComponent(selectedStaffForQr.station)}`
    : `${baseStaffPortalLink}?role=staff`;

  useEffect(() => {
    if (activeStaffPortalLink) {
      generateQrDataUrl(activeStaffPortalLink, {
        width: 260,
        margin: 1,
        darkColor: '#1a1d1a',
        lightColor: '#ffffff'
      }).then((url) => setStaffQrDataUrl(url));
    }
  }, [activeStaffPortalLink]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraStatus('');
  };

  const startCamera = async () => {
    setCameraStatus('Requesting camera access...');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('Camera API unavailable on this device. Use ticket code entry or USB scanner below.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setCameraStatus('Camera active. Point at attendee QR ticket.');

      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(() => {});
        }
      }, 100);

      // Use native BarcodeDetector if available (Chrome/Edge/Android)
      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128'] });
        let lastDetected = '';
        let lastDetectedAt = 0;

        const tick = async () => {
          if (!streamRef.current) return;
          if (videoRef.current && videoRef.current.readyState === 4) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const rawVal = barcodes[0].rawValue;
                const now = Date.now();
                if (rawVal && (rawVal !== lastDetected || now - lastDetectedAt > 3500)) {
                  lastDetected = rawVal;
                  lastDetectedAt = now;
                  handleExecuteCheckIn(rawVal);
                }
              }
            } catch {
              // ignore frame decode error
            }
          }
          scanLoopRef.current = requestAnimationFrame(tick);
        };
        scanLoopRef.current = requestAnimationFrame(tick);
      } else {
        setCameraStatus('Live camera preview on. Auto-QR decode requires Chrome/Edge — or enter ticket code below.');
      }
    } catch {
      setCameraStatus('Camera permission denied or no camera found. Enter the ticket code manually below.');
      stopCamera();
    }
  };

  const handleExecuteCheckIn = async (ticketCode, forceOverride = false) => {
    const trimmed = String(ticketCode || '').trim();
    if (!trimmed) return;

    const result = await onCheckInByCode(
      trimmed,
      staffName,
      isOffline,
      activeDayId,
      currentDayObj.label,
      { eventId: event?.id, tenantId: tenant?.id, forceOverride }
    );
    setLastScanResult(result);
    setScanInput('');
    scanInputRef.current?.focus();

    if (result?.success) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.78 }
      });
    }
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const created = Storage.addStaffMember(
      {
        tenantId: tenant?.id,
        name: newStaffName.trim(),
        email: newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@${tenant?.slug || 'event'}.org`,
        phone: newStaffPhone.trim() || '+233 24 000 0000',
        station: newStaffStation.trim(),
        role: newStaffRole,
        pin: newStaffPin.trim() || '1234'
      },
      staffName
    );

    const updated = Storage.getStaffMembers(tenant?.id);
    setStaffList(updated);
    setStaffName(created.station);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffPin(Math.floor(1000 + Math.random() * 9000).toString());
    setStaffSuccessNotice(`Staff scanner "${created.name}" provisioned (PIN: ${created.pin}) for ${created.station}.`);
    setTimeout(() => setStaffSuccessNotice(''), 4000);
  };

  const handleRemoveStaff = (staffId) => {
    Storage.removeStaffMember(staffId, staffName);
    setStaffList(Storage.getStaffMembers(tenant?.id));
    if (selectedStaffForQr?.id === staffId) setSelectedStaffForQr(null);
  };

  // Manual search matching (name, email, phone, org, or ticket code)
  const searchResults = manualQuery.trim() === ''
    ? []
    : eventRegistrations
        .filter((r) => {
          const q = manualQuery.trim().toLowerCase();
          return (
            r.name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            (r.phone || '').toLowerCase().includes(q) ||
            (r.organization || '').toLowerCase().includes(q) ||
            r.ticketCode.toLowerCase().includes(q)
          );
        })
        .slice(0, 6);

  // Split quick-test tickets so staff see unchecked tickets first!
  const awaitingTickets = eventRegistrations.filter(
    (r) => !(r.dailyAttendance?.[activeDayId]?.checkedIn || r.dailyAttendance?.[activeDayId]?.attended)
  );
  const checkedInTodayList = eventRegistrations.filter(
    (r) => r.dailyAttendance?.[activeDayId]?.checkedIn || r.dailyAttendance?.[activeDayId]?.attended
  );
  const quickTestTickets = [...awaitingTickets.slice(0, 3), ...checkedInTodayList.slice(0, 1)].slice(0, 4);

  const eligibleTodayCount = eventRegistrations.filter((r) => {
    const days = r.selectedDays && r.selectedDays.length > 0 ? r.selectedDays : eventDays.map((d) => d.id);
    return days.includes(activeDayId);
  }).length;
  const checkedInTodayCount = checkedInTodayList.length;
  const pendingTodayCount = Math.max(0, eligibleTodayCount - checkedInTodayCount);

  return (
    <div className="space-y-6">
      {/* Top Station Control Header */}
      <div className="fp-card p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="fp-tag-sage">
              <QrCode className="w-3.5 h-3.5" />
              <span>Check-In Workstation</span>
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {event?.title}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold m-0">
            On-Site Check-In &amp; 3.1&quot; Badge Dispatch
          </h1>
          <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
            Enter any ticket code (full code, last 4 digits, or email) or scan QR passes. Every scan is logged to the audit trail.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
          {/* Active Day Selector */}
          <div className="p-2 px-3 rounded-lg border flex items-center gap-2" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
            <Calendar className="w-4 h-4 shrink-0" style={{ color: 'var(--fp-olive)' }} />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase block" style={{ color: 'var(--text-muted)' }}>Active Event Day</span>
              <select
                value={activeDayId}
                onChange={(e) => {
                  setActiveDayId(e.target.value);
                  setLastScanResult(null);
                }}
                className="bg-transparent text-xs font-bold w-full focus:outline-none cursor-pointer"
                style={{ color: 'var(--text-main)' }}
              >
                {eventDays.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label} · {d.date}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Station Desk */}
          <div className="p-2 px-3 rounded-lg border flex items-center gap-2" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
            <Monitor className="w-4 h-4 shrink-0" style={{ color: 'var(--fp-olive)' }} />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase block" style={{ color: 'var(--text-muted)' }}>Active Desk</span>
              <select
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="bg-transparent text-xs font-bold w-full focus:outline-none cursor-pointer"
                style={{ color: 'var(--text-main)' }}
              >
                {stationOptions.map((preset) => (
                  <option key={preset} value={preset}>{preset}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStaffModalTab('roster');
              setIsMultiStaffModalOpen(true);
            }}
            className="btn-fp-olive px-4 py-2.5 text-xs inline-flex items-center justify-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Staff &amp; PINs</span>
          </button>

          {isOffline && (
            <button
              type="button"
              onClick={onSyncOffline}
              className="px-3 py-2 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 border"
              style={{ background: 'rgba(180,83,9,0.12)', borderColor: 'var(--fp-amber)', color: 'var(--fp-amber)' }}
            >
              <WifiOff className="w-4 h-4" />
              <span>Offline ({offlineQueue?.length || 0} queued)</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="fp-card p-4">
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Total Registrants</div>
          <div className="text-2xl font-extrabold mt-1">{eventRegistrations.length}</div>
        </div>
        <div className="fp-card p-4">
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{currentDayObj.label} Eligible</div>
          <div className="text-2xl font-extrabold mt-1">{eligibleTodayCount}</div>
        </div>
        <div className="fp-card p-4">
          <div className="text-xs font-medium" style={{ color: 'var(--fp-green)' }}>Checked In Today</div>
          <div className="text-2xl font-extrabold mt-1" style={{ color: 'var(--fp-green)' }}>{checkedInTodayCount}</div>
        </div>
        <div className="fp-card p-4">
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Awaiting Arrival</div>
          <div className="text-2xl font-extrabold mt-1">{pendingTodayCount}</div>
        </div>
      </div>

      {/* Main 2-Column Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Ticket Code Entry & Camera Scanner (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="fp-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-bold m-0 flex items-center gap-2">
                <QrCode className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
                <span>Ticket Code Entry &amp; QR Scanner</span>
              </h2>
              <button
                type="button"
                onClick={isCameraActive ? stopCamera : startCamera}
                className={isCameraActive ? 'btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5' : 'btn-fp-sage px-3 py-1.5 text-xs inline-flex items-center gap-1.5'}
              >
                {isCameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                <span>{isCameraActive ? 'Stop Camera' : 'Start Camera QR'}</span>
              </button>
            </div>

            {/* Ticket Code Input Form — ALWAYS VISIBLE & FOCUSED */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteCheckIn(scanInput);
              }}
              className="space-y-2"
            >
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Enter Ticket Code, Last 4 Digits, Email, or Scan Barcode:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  ref={scanInputRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder={`e.g. ${awaitingTickets[0]?.ticketCode || 'TKT-ACM-3301'} or 3301`}
                  className="fp-input flex-1 px-4 py-3 font-mono text-sm sm:text-base"
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn-fp-olive px-6 py-3 text-sm font-bold shrink-0"
                >
                  Check In Ticket
                </button>
              </div>
              <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                Tip: Works with full ticket codes (e.g. <code>TKT-ACM-3301</code>), lowercase, without dashes, last 4 digits (<code>3301</code>), or attendee email.
              </p>
            </form>

            {/* Optional Live Webcam QR Viewport */}
            {isCameraActive && (
              <div className="rounded-xl overflow-hidden border bg-black relative aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-44 h-44 border-2 border-emerald-400 rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.4)]" />
                </div>
              </div>
            )}
            {cameraStatus && (
              <div className="text-xs px-3 py-2 rounded-lg border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)', color: 'var(--text-sub)' }}>
                {cameraStatus}
              </div>
            )}

            {/* Quick One-Click Test Tickets */}
            {quickTestTickets.length > 0 && (
              <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
                  Quick Test Tickets (Click to scan immediately):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickTestTickets.map((t) => {
                    const done = Boolean(t.dailyAttendance?.[activeDayId]);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleExecuteCheckIn(t.ticketCode)}
                        className="p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between gap-2"
                        style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{t.name}</div>
                          <div className="text-[11px] font-mono" style={{ color: 'var(--fp-olive)' }}>{t.ticketCode}</div>
                        </div>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: done ? 'var(--fp-sage)' : 'var(--bg-subtle)',
                            color: done ? 'var(--fp-sage-text)' : 'var(--text-muted)',
                          }}
                        >
                          {done ? 'Checked In' : 'Awaiting'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Scan Result Feedback Card */}
          {lastScanResult && (
            <div
              className="fp-card p-5 border-2 space-y-3"
              style={{
                borderColor: lastScanResult.success
                  ? 'var(--fp-green)'
                  : lastScanResult.alreadyCheckedIn || lastScanResult.notPermittedToday
                  ? 'var(--fp-amber)'
                  : 'var(--fp-red)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {lastScanResult.success ? (
                    <CheckCircle2 className="w-7 h-7 shrink-0 mt-0.5" style={{ color: 'var(--fp-green)' }} />
                  ) : lastScanResult.alreadyCheckedIn || lastScanResult.notPermittedToday ? (
                    <AlertTriangle className="w-7 h-7 shrink-0 mt-0.5" style={{ color: 'var(--fp-amber)' }} />
                  ) : (
                    <ShieldAlert className="w-7 h-7 shrink-0 mt-0.5" style={{ color: 'var(--fp-red)' }} />
                  )}
                  <div>
                    <h3 className="text-base font-extrabold m-0">
                      {lastScanResult.success
                        ? 'Check-In Approved & Logged'
                        : lastScanResult.alreadyCheckedIn
                        ? 'Duplicate Scan Detected'
                        : lastScanResult.notPermittedToday
                        ? 'Pass Not Valid for Selected Day'
                        : 'Ticket Not Verified'}
                    </h3>
                    <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-sub)' }}>
                      {lastScanResult.message}
                    </p>
                  </div>
                </div>

                {lastScanResult.attendee && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {lastScanResult.canOverride && (
                      <button
                        type="button"
                        onClick={() => handleExecuteCheckIn(lastScanResult.attendee.ticketCode, true)}
                        className="btn-fp-outline px-3 py-2 text-xs"
                      >
                        Supervisor Override
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setBadgeModalAttendee(lastScanResult.attendee)}
                      className="btn-fp-olive px-3.5 py-2 text-xs inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print 3.1&quot; Badge</span>
                    </button>
                  </div>
                )}
              </div>

              {lastScanResult.attendee && (
                <div className="pt-3 border-t flex items-center gap-3" style={{ borderColor: 'var(--border-color)' }}>
                  {lastScanResult.attendee.photoUrl ? (
                    <img
                      src={lastScanResult.attendee.photoUrl}
                      alt={lastScanResult.attendee.name}
                      className="w-11 h-11 rounded-xl object-cover border shrink-0"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                  ) : (
                    <div
                      className="w-11 h-11 rounded-xl border shrink-0 flex items-center justify-center font-bold text-xs"
                      style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)', borderColor: 'var(--border-color)' }}
                    >
                      {(lastScanResult.attendee.name || 'DE').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                  )}
                  <div className="text-xs min-w-0">
                    <div className="font-bold truncate">{lastScanResult.attendee.name}</div>
                    <div className="truncate" style={{ color: 'var(--text-muted)' }}>
                      {lastScanResult.attendee.organization} · {lastScanResult.attendee.category} · <code>{lastScanResult.attendee.ticketCode}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Manual Search Fallback & Live Checked-In Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Manual Search */}
          <div className="fp-card p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold m-0 flex items-center gap-2">
                <Search className="w-4 h-4" style={{ color: 'var(--fp-olive)' }} />
                <span>Manual Attendee Lookup</span>
              </h2>
              <p className="text-xs mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
                Search by delegate name, email, phone, company, or ticket code.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="Search attendee name, email, phone, or code..."
                className="fp-input w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm"
              />
            </div>

            {manualQuery.trim() !== '' && (
              <div className="space-y-2">
                {searchResults.length === 0 ? (
                  <div className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>
                    No delegates match &quot;{manualQuery}&quot;.
                  </div>
                ) : (
                  searchResults.map((att) => {
                    const isChecked = Boolean(att.dailyAttendance?.[activeDayId]?.checkedIn || att.dailyAttendance?.[activeDayId]?.attended);
                    return (
                      <div
                        key={att.id}
                        className="p-3 rounded-xl border flex items-center justify-between gap-2.5"
                        style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {att.photoUrl ? (
                            <img src={att.photoUrl} alt={att.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div
                              className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-bold text-[11px]"
                              style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)' }}
                            >
                              {(att.name || 'DE').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{att.name}</div>
                            <div className="text-[11px] truncate font-mono" style={{ color: 'var(--text-muted)' }}>
                              {att.ticketCode} · {att.organization}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isChecked ? (
                            <span className="fp-tag-sage text-[10px]">Verified</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleExecuteCheckIn(att.ticketCode)}
                              className="btn-fp-olive px-2.5 py-1.5 text-xs"
                            >
                              Check In
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setBadgeModalAttendee(att)}
                            className="btn-fp-outline p-1.5"
                            title="Print 3.1in Badge"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Recently Checked-In Queue */}
          <div className="fp-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold m-0">Checked-In Today ({checkedInTodayList.length})</h3>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--fp-green)' }}>● Live Sync</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {checkedInTodayList.slice().reverse().map((att) => (
                <div
                  key={att.id}
                  className="p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs"
                  style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                >
                  <div className="min-w-0">
                    <div className="font-bold truncate">{att.name}</div>
                    <div className="text-[11px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                      {att.ticketCode} · {att.dailyAttendance?.[activeDayId]?.checkedInBy || staffName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBadgeModalAttendee(att)}
                    className="btn-fp-sage px-2.5 py-1 text-[11px] inline-flex items-center gap-1 shrink-0"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Tag</span>
                  </button>
                </div>
              ))}
              {checkedInTodayList.length === 0 && (
                <div className="py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  No attendees checked in yet for {currentDayObj.label}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Station Audit Trail */}
      <AuditTrailPanel
        logs={tenantAuditLogs}
        title="Live Check-In & Station Audit Trail"
        compact
        tenantName={tenant?.name || 'Event'}
      />

      {/* Multi-Staff Provisioning Modal */}
      {isMultiStaffModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          style={{ background: 'rgba(15, 20, 14, 0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsMultiStaffModalOpen(false)}
        >
          <div
            className="fp-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-main)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ background: 'var(--bg-header)', borderColor: 'var(--border-header)', color: 'var(--header-text)' }}>
              <div>
                <h3 className="text-base sm:text-lg font-bold m-0" style={{ color: 'var(--header-text)' }}>Check-In Staff &amp; Scanner PINs</h3>
                <p className="text-xs m-0 opacity-80" style={{ color: 'var(--header-text)' }}>Provision entrance desks and mobile QR logins</p>
              </div>
              <button type="button" onClick={() => setIsMultiStaffModalOpen(false)} className="p-1.5 rounded-lg hover:bg-black/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-4 flex gap-2 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <button type="button" onClick={() => setStaffModalTab('roster')} className={`fp-subnav-pill text-xs ${staffModalTab === 'roster' ? 'active' : ''}`}>
                <Users className="w-3.5 h-3.5" /> Team Roster ({staffList.length})
              </button>
              <button type="button" onClick={() => setStaffModalTab('qr')} className={`fp-subnav-pill text-xs ${staffModalTab === 'qr' ? 'active' : ''}`}>
                <Smartphone className="w-3.5 h-3.5" /> Mobile QR Connect
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {staffSuccessNotice && (
                <div className="p-3 rounded-lg text-xs font-semibold border" style={{ background: 'var(--fp-sage)', borderColor: 'var(--fp-olive)', color: 'var(--fp-sage-text)' }}>
                  {staffSuccessNotice}
                </div>
              )}

              {staffModalTab === 'roster' ? (
                <>
                  <form onSubmit={handleAddStaffSubmit} className="fp-card p-4 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--fp-olive)' }}>
                      <UserPlus className="w-4 h-4" /> Add Check-In Staff Member
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input required value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} placeholder="Staff Full Name *" className="fp-input px-3 py-2 text-xs" />
                      <input value={newStaffStation} onChange={(e) => setNewStaffStation(e.target.value)} placeholder="Assigned Station / Desk *" required className="fp-input px-3 py-2 text-xs" />
                      <input type="email" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} placeholder="Staff Email (optional)" className="fp-input px-3 py-2 text-xs" />
                      <div className="grid grid-cols-2 gap-2">
                        <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="fp-input px-2.5 py-2 text-xs">
                          <option value="Check-In Scanner">Scanner</option>
                          <option value="Lead Supervisor">Supervisor</option>
                          <option value="Badge Operator">Badge Printer</option>
                        </select>
                        <input value={newStaffPin} onChange={(e) => setNewStaffPin(e.target.value)} maxLength={6} placeholder="PIN" className="fp-input px-2.5 py-2 text-xs font-mono text-center font-bold" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="btn-fp-olive px-4 py-2 text-xs">Provision Staff</button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {staffList.map((st) => (
                      <div key={st.id} className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                        <div>
                          <div className="text-xs font-bold">{st.name} <span className="fp-tag-sage text-[10px] ml-1">{st.role}</span></div>
                          <div className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {st.station} · PIN: <strong>{st.pin}</strong>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button type="button" onClick={() => { setSelectedStaffForQr(st); setStaffModalTab('qr'); }} className="btn-fp-sage px-2.5 py-1.5 text-xs">QR Pass</button>
                          <button type="button" onClick={() => handleRemoveStaff(st.id)} className="btn-fp-outline p-1.5" style={{ color: 'var(--fp-red)' }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="fp-card p-5 flex flex-col items-center text-center space-y-3">
                  {staffQrDataUrl && <img src={staffQrDataUrl} alt="Staff QR" className="w-44 h-44 bg-white p-2 rounded-xl border" />}
                  <div className="font-bold text-sm">{selectedStaffForQr ? `${selectedStaffForQr.name} — ${selectedStaffForQr.station}` : 'General Staff Login QR'}</div>
                  <div className="w-full max-w-md flex items-center gap-2">
                    <code className="flex-1 text-[11px] p-2 rounded-lg border truncate" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>{activeStaffPortalLink}</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeStaffPortalLink);
                        setCopiedStaffLink(true);
                        setTimeout(() => setCopiedStaffLink(false), 2000);
                      }}
                      className="btn-fp-olive px-3 py-2 text-xs inline-flex items-center gap-1"
                    >
                      {copiedStaffLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedStaffLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Centered 3.1-Inch Badge Modal */}
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
