import React, { useState, useEffect } from 'react';
import { X, Award, Printer, CheckCircle } from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';
import TenantLogo from './TenantLogo';

export default function CertificateModal({ isOpen, onClose, attendee, event, tenant }) {
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    if (attendee?.ticketCode) {
      generateQrDataUrl(`https://events.manamatechnologies.com/#/${tenant?.slug || 'acme'}?verify=${attendee.ticketCode}`, {
        width: 140,
        darkColor: '#1a1d1a'
      }).then((url) => setQrUrl(url));
    }
  }, [attendee, tenant]);

  if (!isOpen || !attendee) return null;

  const handlePrint = () => {
    printElementCleanly('printable-certificate', `${attendee?.name || 'Attendee'} - Certificate`, {
      mode: 'certificate'
    });
  };

  const formattedDate = event?.endsAt
    ? new Date(event.endsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'November 24, 2026';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-transparent"
      style={{ background: 'rgba(15, 20, 14, 0.72)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="fp-card w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg-main)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between print:hidden"
          style={{ background: 'var(--bg-header)', borderColor: 'var(--border-header)', color: 'var(--header-text)' }}
        >
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-extrabold m-0" style={{ color: 'var(--header-text)' }}>
              Official Certificate of Attendance
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex justify-center">
          <div
            id="printable-certificate"
            className="w-full max-w-2xl bg-white text-slate-900 p-6 sm:p-10 rounded-xl border-8 border-double text-center"
            style={{ borderColor: tenant?.primaryColor || '#5A6552' }}
          >
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <TenantLogo tenant={tenant} size={36} className="rounded-lg" />
              <span className="font-extrabold text-xs uppercase tracking-widest text-slate-700 font-mono">
                {tenant?.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-950 uppercase mb-1">
              Certificate of Attendance
            </h1>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-5 font-mono">
              This is to proudly certify that
            </p>

            <div className="border-b-2 pb-2 mb-4 max-w-md mx-auto" style={{ borderColor: tenant?.primaryColor || '#5A6552' }}>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif m-0">
                {attendee.name}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed mb-5">
              representing <strong>{attendee.organization}</strong> has actively participated in all sessions, forums, and executive tracks at:
            </p>

            <h3 className="text-lg sm:text-xl font-bold text-slate-950 uppercase font-serif m-0 mb-1">
              {event?.title}
            </h3>
            <p className="text-xs text-slate-600 mb-8">
              Held at {event?.venue} · Issued on {formattedDate}
            </p>

            <div className="grid grid-cols-3 items-end pt-5 border-t border-slate-200 gap-2">
              <div className="text-center">
                <div className="font-serif italic text-sm sm:text-base text-slate-800 border-b border-slate-300 pb-1 mx-2">
                  {tenant?.organizer?.name || 'Event Director'}
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-600 mt-1 m-0">Event Organizer</p>
              </div>
              <div className="flex flex-col items-center">
                {qrUrl && <img src={qrUrl} alt="Verify QR" className="w-14 h-14 border border-slate-300 rounded p-0.5 bg-white" />}
                <span className="text-[8px] font-mono text-slate-500 mt-1">{attendee.ticketCode}</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto" style={{ borderColor: tenant?.primaryColor || '#5A6552' }}>
                  <Award className="w-6 h-6" style={{ color: tenant?.primaryColor || '#5A6552' }} />
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-600 mt-1 m-0">Verified Attendee</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 border-t flex flex-wrap items-center justify-between gap-2 print:hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <span className="text-xs inline-flex items-center gap-1.5" style={{ color: 'var(--fp-green)' }}>
            <CheckCircle className="w-4 h-4" /> Attendance verified
          </span>
          <div className="flex gap-2 ml-auto">
            <button type="button" onClick={onClose} className="btn-fp-outline px-4 py-2 text-xs">Close</button>
            <button type="button" onClick={handlePrint} className="btn-fp-olive px-4 py-2 text-xs inline-flex items-center gap-1.5">
              <Printer className="w-4 h-4" /> Print Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
