import React, { useState, useEffect } from 'react';
import { X, Award, Printer, Download, CheckCircle, Shield } from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';
import TenantLogo from './TenantLogo';

export default function CertificateModal({ isOpen, onClose, attendee, event, tenant }) {
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    if (attendee?.ticketCode) {
      generateQrDataUrl(`https://verify.eventplan.cloud/cert/${attendee.ticketCode}`, {
        width: 140,
        darkColor: '#121819'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:bg-transparent print:p-0 print:static print:overflow-visible">
      
      {/* Iridescent Border Container */}
      <div className="relative w-full max-w-3xl bg-gradient-to-br from-[#354649] via-[#6C7A89] to-[#A3C6C4] p-[1.5px] rounded-3xl shadow-[0_0_60px_rgba(251,147,120,0.25)] my-8 print:p-0 print:border-none print:shadow-none">
        
        <div className="relative w-full bg-[#182224] rounded-[22.5px] p-6 sm:p-8 text-white print:bg-transparent print:border-none print:shadow-none print:p-0 print:m-0">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 print:hidden">
            <div>
              <h3 className="text-lg font-heading font-extrabold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#A3C6C4]" />
                <span>Official Certificate of Attendance</span>
              </h3>
              <p className="text-xs text-white/50">
                Generated for verified attendees in accordance with platform security protocols
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Certificate Display Card */}
          <div className="flex justify-center my-2">
            <div 
              id="printable-certificate"
              className="w-full max-w-2xl bg-[#E0E7E9]/10 text-stone-900 bg-white p-8 sm:p-12 rounded-2xl shadow-xl border-8 border-double border-[#A3C6C4] relative overflow-hidden text-center"
              style={{ fontFamily: "'Plus Jakarta Sans', serif" }}
            >
              {/* Background seal watermarks */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#E0E7E9]/40 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#6C7A89]/20 blur-2xl pointer-events-none" />

              {/* Top Company & Event Header */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <TenantLogo 
                  tenant={tenant}
                  size="sm"
                  className="rounded-lg shadow-sm"
                />
                <span className="font-extrabold text-xs uppercase tracking-widest text-[#354649] font-mono">
                  {tenant?.name}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#121819] tracking-wide uppercase mb-2">
                Certificate of Attendance
              </h1>
              <p className="text-xs tracking-widest uppercase font-semibold text-[#354649] mb-6 font-mono">
                This is to proudly certify that
              </p>

              {/* Recipient Name */}
              <div className="border-b-2 border-[#A3C6C4] pb-2 mb-4 max-w-lg mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121819] tracking-tight font-serif">
                  {attendee.name}
                </h2>
              </div>

              <p className="text-xs text-stone-700 max-w-md mx-auto leading-relaxed mb-6">
                represented <strong>{attendee.organization}</strong> and has successfully participated in the sessions, keynote forums, and discussions at:
              </p>

              <h3 className="text-lg sm:text-xl font-bold text-[#121819] uppercase tracking-tight mb-1 font-serif">
                {event?.title || 'Global Tech Summit 2026'}
              </h3>
              <p className="text-xs text-stone-600 mb-8 font-medium">
                Held at {event?.venue || 'Accra, Ghana'} • Issued on {formattedDate}
              </p>

              {/* Signatures & Verification QR code */}
              <div className="grid grid-cols-3 items-end pt-6 border-t border-stone-200">
                
                {/* Organizer signature */}
                <div className="text-center">
                  <div className="font-serif italic text-base text-stone-800 border-b border-stone-300 pb-1 mx-4">
                    {tenant?.organizer?.name || 'Sarah Jenkins'}
                  </div>
                  <p className="text-[10px] uppercase font-bold text-stone-600 mt-1 font-mono">Event Organizer</p>
                  <p className="text-[9px] text-stone-500 font-mono">{tenant?.name}</p>
                </div>

                {/* Verification QR */}
                <div className="flex flex-col items-center">
                  {qrUrl && (
                    <img src={qrUrl} alt="Verification QR" className="w-16 h-16 border border-[#A3C6C4] rounded p-0.5 bg-white shadow-sm" />
                  )}
                  <span className="text-[8px] font-mono text-stone-500 mt-1 uppercase">
                    Verify: {attendee.ticketCode}
                  </span>
                </div>

                {/* Security Seal */}
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full border-2 border-[#A3C6C4] bg-[#E0E7E9]/30 flex items-center justify-center mx-auto shadow-inner">
                    <Award className="w-7 h-7 text-[#354649]" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-stone-600 mt-1 font-mono">Official Credential</p>
                  <p className="text-[9px] text-stone-500 font-mono">Verified On-Site Check-in</p>
                </div>

              </div>

            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10 mt-4 print:hidden">
            <div className="text-xs text-white/50 flex items-center gap-1.5 font-mono">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Attendance verified at {attendee.checkedInAt ? new Date(attendee.checkedInAt).toLocaleTimeString() : 'Check-in'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white rounded-xl bg-[#243033] hover:bg-[#2f3e42] border border-white/10 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] hover:opacity-90 text-black font-extrabold rounded-xl text-xs shadow-lg shadow-[#6C7A89]/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download Certificate</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
