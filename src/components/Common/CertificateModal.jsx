import React, { useState, useEffect } from 'react';
import { X, Award, Printer, Download, CheckCircle, Shield } from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';

export default function CertificateModal({ isOpen, onClose, attendee, event, tenant }) {
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    if (attendee?.ticketCode) {
      generateQrDataUrl(`https://verify.eventflow.app/cert/${attendee.ticketCode}`, {
        width: 140,
        darkColor: '#1e293b'
      }).then(url => setQrUrl(url));
    }
  }, [attendee]);

  if (!isOpen || !attendee) return null;

  const handlePrint = () => {
    printElementCleanly('printable-certificate', `${attendee?.name || 'Attendee'} - Certificate`);
  };

  const formattedDate = event?.endsAt ? new Date(event.endsAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'October 25, 2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:bg-transparent print:p-0 print:static print:overflow-visible">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 print:bg-transparent print:border-none print:shadow-none print:p-0 print:m-0">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 print:hidden">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Official Certificate of Attendance</span>
            </h3>
            <p className="text-xs text-slate-400">
              Generated in accordance with FR-6.4 for attendees with verified check-in status
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Display Card */}
        <div className="flex justify-center my-2">
          <div 
            id="printable-certificate"
            className="w-full max-w-2xl bg-amber-50/95 text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl border-8 border-double border-amber-600 relative overflow-hidden text-center"
            style={{ fontFamily: "'Plus Jakarta Sans', serif" }}
          >
            {/* Background seal watermarks */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />

            {/* Top Company & Event Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src={tenant?.logoUrl}
                alt={tenant?.name}
                className="w-10 h-10 rounded-lg object-cover border border-amber-300"
              />
              <span className="font-extrabold text-xs uppercase tracking-widest text-amber-900">
                {tenant?.name}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-950 tracking-wide uppercase mb-2">
              Certificate of Attendance
            </h1>
            <p className="text-xs tracking-widest uppercase font-semibold text-amber-800 mb-6">
              This is to proudly certify that
            </p>

            {/* Recipient Name */}
            <div className="border-b-2 border-amber-700/60 pb-2 mb-4 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
                {attendee.name}
              </h2>
            </div>

            <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed mb-6">
              represented <strong>{attendee.organization}</strong> and has successfully participated in the sessions, keynote forums, and discussions at:
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-indigo-950 uppercase tracking-tight mb-1">
              {event?.title || 'Acme Global Tech Summit 2026'}
            </h3>
            <p className="text-xs text-slate-600 mb-8">
              Held at {event?.venue || 'Accra, Ghana'} • Issued on {formattedDate}
            </p>

            {/* Signatures & Verification QR code */}
            <div className="grid grid-cols-3 items-end pt-6 border-t border-amber-300">
              
              {/* Organizer signature */}
              <div className="text-center">
                <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 mx-4">
                  {tenant?.organizer?.name || 'Sarah Jenkins'}
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-600 mt-1">Event Organizer</p>
                <p className="text-[9px] text-slate-500">{tenant?.name}</p>
              </div>

              {/* Verification QR */}
              <div className="flex flex-col items-center">
                {qrUrl && (
                  <img src={qrUrl} alt="Verification QR" className="w-16 h-16 border border-amber-300 rounded p-0.5 bg-white shadow-sm" />
                )}
                <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">
                  Verify: {attendee.ticketCode}
                </span>
              </div>

              {/* Security Seal */}
              <div className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-amber-700 bg-amber-100 flex items-center justify-center mx-auto shadow-inner">
                  <Award className="w-7 h-7 text-amber-700" />
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-600 mt-1">Official Credential</p>
                <p className="text-[9px] text-slate-500">Verified On-Site Check-in</p>
              </div>

            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-4 print:hidden">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Attendance verified at {attendee.checkedInAt ? new Date(attendee.checkedInAt).toLocaleTimeString() : 'Check-in'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
