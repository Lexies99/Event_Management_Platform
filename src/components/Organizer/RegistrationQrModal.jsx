import React, { useState, useEffect } from 'react';
import { X, QrCode, Download, Printer, Copy, Check, Calendar, MapPin } from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';
import TenantLogo from '../Common/TenantLogo';

export default function RegistrationQrModal({ isOpen, onClose, tenant, event, registrationLink }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen && registrationLink) {
      generateQrDataUrl(registrationLink, {
        width: 380,
        margin: 1,
        darkColor: '#1a1d1a',
        lightColor: '#ffffff'
      }).then((url) => setQrDataUrl(url));
    }
  }, [isOpen, registrationLink]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${tenant?.slug || 'event'}-registration-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{ background: 'rgba(15, 20, 14, 0.72)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="fp-card w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg-main)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ background: 'var(--bg-header)', borderColor: 'var(--border-header)', color: 'var(--header-text)' }}>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <h3 className="text-base sm:text-lg font-extrabold m-0" style={{ color: 'var(--header-text)' }}>
              Event Registration QR &amp; Entrance Sign
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Printable Flyer Area */}
          <div
            id="registration-sign-print-area"
            className="bg-white text-slate-900 rounded-2xl p-6 border-2 border-slate-200 text-center max-w-md mx-auto space-y-4"
          >
            <div className="flex items-center justify-center gap-2.5 pb-3 border-b border-slate-200">
              <TenantLogo tenant={tenant} size={40} className="rounded-xl" />
              <div className="text-left">
                <p className="text-sm font-extrabold text-slate-950 m-0">{tenant?.name}</p>
                <p className="text-[10px] text-slate-500 font-mono m-0">/{tenant?.slug} · Official Event Portal</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950 m-0">{event?.title}</h2>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 mt-1.5">
                <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event?.venue}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(event?.startsAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block">
              {qrDataUrl && <img src={qrDataUrl} alt="Registration QR" className="w-48 h-48 mx-auto" />}
              <div className="text-[11px] font-mono font-bold text-slate-700 mt-2">SCAN TO REGISTER &amp; GET PASS</div>
            </div>

            <p className="text-xs text-slate-600 m-0">
              Point your phone camera at this QR code to open the dedicated event website and register in seconds.
            </p>
          </div>

          {/* Share URL Bar */}
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs p-2.5 rounded-lg border truncate" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {registrationLink}
            </code>
            <button type="button" onClick={handleCopy} className="btn-fp-outline px-3 py-2 text-xs inline-flex items-center gap-1 shrink-0">
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="px-5 py-3.5 border-t flex flex-wrap items-center justify-end gap-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <button type="button" onClick={handleDownloadQr} className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download PNG
          </button>
          <button
            type="button"
            onClick={() => printElementCleanly('registration-sign-print-area', `${event?.title} - Entrance Sign`)}
            className="btn-fp-olive px-4 py-2 text-xs inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Entrance Sign
          </button>
        </div>
      </div>
    </div>
  );
}
