import React, { useState, useEffect } from 'react';
import { X, Printer, Shield, CheckCircle2, RotateCw } from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';

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

  useEffect(() => {
    if (attendee?.ticketCode) {
      generateQrDataUrl(attendee.ticketCode, {
        width: 180,
        darkColor: '#0f172a'
      }).then(url => setQrUrl(url));
    }
  }, [attendee]);

  if (!isOpen || !attendee) return null;

  const handlePrint = () => {
    printElementCleanly('printable-badge', `${attendee?.name || 'Attendee'} - Badge`);
  };

  const handleReprintSubmit = () => {
    if (onReprint) {
      onReprint(attendee.id, staffUser, reprintReason || "Badge re-issue requested");
      setShowReasonBox(false);
      setReprintReason('');
      printElementCleanly('printable-badge', `${attendee?.name || 'Attendee'} - Badge`);
    }
  };

  const categoryColors = {
    VIP: "bg-purple-600 text-white",
    Speaker: "bg-indigo-600 text-white",
    Attendee: "bg-slate-700 text-white",
    Sponsor: "bg-amber-600 text-white",
    Press: "bg-rose-600 text-white"
  };

  const badgeCategoryColor = categoryColors[attendee.category] || "bg-indigo-600 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:bg-transparent print:p-0 print:static print:overflow-visible">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 my-8 text-slate-100 print:bg-transparent print:border-none print:shadow-none print:p-0 print:m-0">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 print:hidden">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-400" />
              <span>Badge Production & Print Preview</span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct browser thermal/lanyard badge print (FR-3.1 - FR-3.4)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE BADGE CONTAINER (Matches Standard 3.5in x 5in or Lanyard Badge) */}
        <div className="flex justify-center my-3">
          <div 
            id="printable-badge" 
            className="w-[320px] h-[460px] bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border-2 border-slate-200 relative"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {/* Top Lanyard Slot Guide */}
            <div className="pt-3 flex flex-col items-center">
              <div className="w-12 h-2 rounded-full bg-slate-200 mb-2" />
              
              {/* Event & Company Branding */}
              <div className="flex items-center gap-2 px-4">
                <img
                  src={tenant?.logoUrl}
                  alt={tenant?.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
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
            <div className="text-center px-4 my-auto">
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={attendee.photoUrl}
                  alt={attendee.name}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-slate-100 shadow-md mx-auto"
                />
                <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white shadow-sm flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {attendee.name}
              </h2>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {attendee.jobTitle}
              </p>
              <p className="text-xs font-bold text-indigo-700 mt-0.5">
                {attendee.organization}
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

              {/* Role / Category Ribbon */}
              <div className={`py-1.5 px-4 text-xs font-extrabold tracking-widest uppercase shadow-sm ${badgeCategoryColor}`}>
                {attendee.category || "ATTENDEE"}
              </div>
            </div>

          </div>
        </div>

        {/* Audit Print Count & Reprint options */}
        <div className="bg-slate-800/80 rounded-2xl p-4 my-4 text-xs space-y-2 border border-slate-700 print:hidden">
          <div className="flex justify-between items-center text-slate-300">
            <span>Badge Print History:</span>
            <span className="font-bold text-white px-2 py-0.5 bg-slate-700 rounded-lg">
              Printed {attendee.badgePrintedCount || 1} time(s)
            </span>
          </div>
          {attendee.badgePrintedCount > 1 && (
            <p className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              Note: This is a duplicate reprint. Action is recorded in the platform audit log.
            </p>
          )}

          {showReasonBox && (
            <div className="pt-2 border-t border-slate-700 space-y-2">
              <label className="block text-slate-300 font-semibold text-[11px]">
                Reason for Badge Reprint:
              </label>
              <input
                type="text"
                value={reprintReason}
                onChange={(e) => setReprintReason(e.target.value)}
                placeholder="e.g. Lost badge, typo correction, lanyard torn..."
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleReprintSubmit}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" /> Log Reprint & Print Badge
              </button>
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 print:hidden">
          {!showReasonBox && (
            <button
              type="button"
              onClick={() => setShowReasonBox(true)}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-medium underline"
            >
              <RotateCw className="w-3 h-3" /> Log Duplicate Reprint
            </button>
          )}
          
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
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
