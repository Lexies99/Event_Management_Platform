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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import BadgeModal from '../Common/BadgeModal';

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
  const [staffName, setStaffName] = useState('Staff Desk A');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [badgeModalAttendee, setBadgeModalAttendee] = useState(null);
  const [manualQuery, setManualQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  const eventRegistrations = registrations.filter(r => r.eventId === event?.id);

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

    const result = onCheckInByCode(ticketCode.trim(), staffName, isOffline);
    setLastScanResult(result);
    setScanInput('');

    if (result.success) {
      // Fire festive celebration
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

  // Mock tickets to test scan with 1 click
  const sampleTickets = eventRegistrations.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
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
          <p className="text-xs text-slate-400 mt-1">
            Sub-second QR scanning, duplicate scan prevention, and automated badge printing (FR-2, FR-3).
          </p>
        </div>

        {/* Staff Identity & Offline Sync status */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <label className="text-[10px] text-slate-500 block">Operator Station:</label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-semibold text-white px-2.5 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {isOffline && (
            <div className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              <span>Offline Cache Active ({offlineQueue?.length || 0})</span>
            </div>
          )}
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
            </div>

            <p className="text-xs text-slate-400 mt-3 font-medium">
              Align attendee's mobile QR ticket inside the frame
            </p>
          </div>

          {/* Direct Ticket Code Input (Barcode Gun / Manual Entry) */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteCheckIn(scanInput);
            }} 
            className="space-y-2"
          >
            <label className="block text-xs font-semibold text-slate-300">
              Scan Barcode / Ticket Code Gun:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <QrCode className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. TKT-ACM-8891 (or scan from gun)"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
              >
                <span>Check In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick 1-Click Test Scanners */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">
              Demo Quick Scan Shortcuts:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleTickets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleExecuteCheckIn(t.ticketCode)}
                  className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5"
                  title={`Test scan ${t.name} (${t.status})`}
                >
                  <span className={`w-2 h-2 rounded-full ${t.status === 'attended' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{t.ticketCode}</span>
                  <span className="text-[10px] text-slate-400 font-sans">({t.name.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RESULT FEEDBACK & MANUAL SEARCH FALLBACK (FR-2.2 & FR-2.4) */}
        <div className="space-y-6">
          
          {/* Scan Result Feedback Banner */}
          {lastScanResult && (
            <div className={`p-5 rounded-3xl border shadow-xl transition-all ${
              lastScanResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-start gap-3">
                {lastScanResult.success ? (
                  <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-wider">
                      {lastScanResult.success 
                        ? (lastScanResult.isOfflineQueue ? "Offline Check-In Cached" : "Check-In Approved")
                        : (lastScanResult.reason === "ALREADY_CHECKED_IN" ? "DUPLICATE SCAN WARNING (FR-2.4)" : "TICKET INVALID")}
                    </h4>
                  </div>
                  <p className="text-xs font-semibold mt-1">
                    {lastScanResult.message}
                  </p>

                  {lastScanResult.attendee && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={lastScanResult.attendee.photoUrl} 
                          alt="Photo" 
                          className="w-8 h-8 rounded-lg object-cover border border-slate-600" 
                        />
                        <span className="text-xs text-white font-bold">{lastScanResult.attendee.name}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                          {lastScanResult.attendee.category}
                        </span>
                      </div>

                      <button
                        onClick={() => setBadgeModalAttendee(lastScanResult.attendee)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Badge</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Manual Search Fallback (FR-2.2) */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                <span>Manual Search Fallback (FR-2.2)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Search by delegate name, email, or phone if attendee cannot display their QR code.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Type attendee name, email or phone..."
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Results list */}
            {searchResults.length > 0 && (
              <div className="space-y-2 mt-2">
                {searchResults.map((r) => {
                  const isAttended = r.status === 'attended';
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={r.photoUrl}
                          alt={r.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.organization} • <span className="font-mono text-indigo-400">{r.ticketCode}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAttended ? (
                          <button
                            onClick={() => setBadgeModalAttendee(r)}
                            className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Printer className="w-3 h-3 text-indigo-300" />
                            <span>Reprint</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleExecuteCheckIn(r.ticketCode)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Check In
                          </button>
                        )}
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
              <span className="text-emerald-400 font-semibold">Station Live</span>
            </h4>
            <div className="space-y-2">
              {eventRegistrations
                .filter(r => r.status === 'attended')
                .slice(0, 3)
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-white">{r.name}</span>
                      <span className="text-[10px] text-slate-400">({r.category})</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(r.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

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
