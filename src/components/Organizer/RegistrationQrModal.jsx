import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Building2,
  Share2,
  Smartphone
} from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';

export default function RegistrationQrModal({
  isOpen,
  onClose,
  tenant,
  event,
  registrationLink
}) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('sign'); // 'sign' | 'preview'

  useEffect(() => {
    if (isOpen && registrationLink) {
      generateQrDataUrl(registrationLink, {
        width: 400,
        margin: 1,
        darkColor: '#0f172a',
        lightColor: '#ffffff'
      }).then(url => setQrDataUrl(url));
    }
  }, [isOpen, registrationLink]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${(tenant?.slug || 'event')}-registration-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintFlyer = () => {
    printElementCleanly('registration-sign-print-area', `${event?.title || 'Event'} - Official Registration Sign`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-6 text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ backgroundColor: tenant?.brandColor || '#4f46e5' }}
          >
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Attendee Registration QR & Sign</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                Instant Scan
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Display at the venue entrance, add to flyers, or share with attendees to self-register
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('sign')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'sign' 
                ? 'border-indigo-500 text-white font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Printable Entrance Sign / Flyer</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'preview' 
                ? 'border-indigo-500 text-white font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Digital QR & Quick Links</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          
          {/* TAB 1: PRINTABLE ENTRANCE SIGN / FLYER */}
          {activeTab === 'sign' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-300">
                  Ready-to-print 8.5x11 / A4 event sign for attendee check-in desks & venue gates.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadQr}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download QR</span>
                  </button>
                  <button
                    onClick={handlePrintFlyer}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Entrance Sign</span>
                  </button>
                </div>
              </div>

              {/* The Actual Printable Sign Container (ID captured by printElementCleanly) */}
              <div 
                id="registration-sign-print-area" 
                className="bg-white text-slate-900 rounded-3xl p-8 border-4 border-slate-200 shadow-xl flex flex-col items-center text-center max-w-lg mx-auto"
                style={{ width: '100%', maxWidth: '480px' }}
              >
                {/* Brand Bar */}
                <div className="w-full flex items-center justify-between pb-4 border-b-2 border-slate-200 mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={tenant?.logoUrl} 
                      alt={tenant?.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="text-left">
                      <p className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">{tenant?.name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Official Event Portal</p>
                    </div>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider"
                    style={{ backgroundColor: tenant?.brandColor || '#4f46e5' }}
                  >
                    Official Pass
                  </span>
                </div>

                {/* Event Heading */}
                <span className="text-[11px] font-extrabold tracking-widest text-indigo-700 uppercase mb-1">
                  Welcome Attendees
                </span>
                <h1 className="text-2xl font-black text-slate-950 leading-tight mb-2">
                  {event?.title || 'Annual Technology Summit 2026'}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 mb-6 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {event?.venue || 'Main Auditorium'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(event?.startsAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Big QR Code Box */}
                <div className="relative p-4 bg-slate-50 rounded-3xl border-2 border-dashed border-indigo-200 mb-5 shadow-inner">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Attendee Registration QR" 
                      className="w-56 h-56 rounded-2xl mx-auto shadow-sm"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-2xl">
                      <span className="text-xs text-slate-400">Generating QR...</span>
                    </div>
                  )}
                  <div className="mt-2 text-[11px] font-mono text-slate-500">
                    SCAN WITH YOUR PHONE CAMERA
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Scan Here to Register & Check In
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Point your camera at this QR code to register in seconds, get your photo badge, and receive instant entry.
                  </p>
                </div>

                {/* Footer security note */}
                <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-between text-[10px] text-slate-400">
                  <span>Powered by EventFlow Platform</span>
                  <span>Ghana Act 843 Compliant</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL QR & QUICK LINKS */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* QR Display Card */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-xl mb-4">
                    {qrDataUrl && (
                      <img 
                        src={qrDataUrl} 
                        alt="Registration QR Code" 
                        className="w-44 h-44 object-contain"
                      />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white mb-1">Live Registration QR Code</span>
                  <p className="text-[11px] text-slate-400 mb-4">Encodes direct URL to {tenant?.name}'s attendee portal</p>
                  <button
                    onClick={handleDownloadQr}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>Download High-Res PNG</span>
                  </button>
                </div>

                {/* Link & Instructions */}
                <div className="flex flex-col justify-between space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-cyan-400" /> Shareable Registration Link
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Send this link via WhatsApp, email blast, LinkedIn or company Slack to invite attendees:
                    </p>
                    
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <p className="text-[11px] font-mono text-cyan-300 break-all select-all">
                        {registrationLink}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? "Registration Link Copied!" : "Copy Registration Link"}</span>
                    </button>

                    <a
                      href={registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Registration Page in New Tab</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Attendee responses are isolated to <strong>{tenant?.name}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
