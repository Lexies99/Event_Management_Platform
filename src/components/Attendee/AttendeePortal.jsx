import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Users,
  UserCheck,
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Camera, 
  Upload, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import confetti from 'canvas-confetti';
import CertificateModal from '../Common/CertificateModal';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
];

export default function AttendeePortal({
  tenant,
  event,
  registrations,
  onAddRegistration,
  currentAttendeeId,
  setCurrentAttendeeId,
  onNavigateToChat
}) {
  const [activeView, setActiveView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('register') === 'true' ? 'register' : 'ticket';
  });
  const [copiedRegLink, setCopiedRegLink] = useState(false);
  
  // Registration form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState(event?.categories?.[0] || 'Attendee');
  const [photoUrl, setPhotoUrl] = useState(PRESET_AVATARS[0]);
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [formError, setFormError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Active ticket QR code
  const [activeTicketQr, setActiveTicketQr] = useState(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const eventRegistrations = registrations.filter(r => r.eventId === event?.id);
  const currentAttendee = eventRegistrations.find(r => r.id === currentAttendeeId) || eventRegistrations[0];

  useEffect(() => {
    if (currentAttendee?.ticketCode) {
      generateQrDataUrl(currentAttendee.ticketCode, {
        width: 220,
        darkColor: '#0f172a'
      }).then(url => setActiveTicketQr(url));
    }
  }, [currentAttendee]);

  const handleRegister = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim()) {
      setFormError("Name and email are required.");
      return;
    }

    if (!consentAccepted) {
      setFormError("Please accept the data protection and photo consent.");
      return;
    }

    try {
      const newReg = onAddRegistration({
        tenantId: tenant.id,
        eventId: event.id,
        name,
        email,
        phone,
        organization,
        jobTitle,
        category,
        photoUrl,
        consentAccepted
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCurrentAttendeeId(newReg.id);
      setActiveView('ticket');

      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setJobTitle('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB.");
        return;
      }
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported by your browser or environment.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn("Video play error:", e);
        }
      }
    } catch (err) {
      console.error("Camera access error:", err);
      let msg = "Could not access webcam. Please verify camera permissions or upload a photo file instead.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = "Camera permission denied. Please allow camera permissions in your browser or upload a photo file.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = "No webcam device detected on your system. Please upload a photo file instead.";
      }
      setCameraError(msg);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      const videoWidth = video.videoWidth || 400;
      const videoHeight = video.videoHeight || 400;
      const size = Math.min(videoWidth, videoHeight);
      const startX = (videoWidth - size) / 2;
      const startY = (videoHeight - size) / 2;
      
      // Draw centered square crop
      ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPhotoUrl(dataUrl);
      stopCamera();
    } catch (err) {
      console.error("Failed to capture snapshot:", err);
      setCameraError("Failed to snap picture. Please try again or upload a photo file.");
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // When camera active state updates and video element is mounted, attach stream
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.warn("Video play exception:", e));
    }
  }, [isCameraActive]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Navigation: Register New vs View My Ticket Pass */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('ticket')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'ticket'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Digital Ticket Pass
          </button>
          <button
            onClick={() => setActiveView('register')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Public Registration Page (FR-1)
          </button>
        </div>

        {/* Quick attendee switcher for demo testing */}
        {activeView === 'ticket' && eventRegistrations.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Pass Preview:
            </span>
            <select
              value={currentAttendee?.id || ''}
              onChange={(e) => setCurrentAttendeeId(e.target.value)}
              className="bg-slate-800 text-xs text-white border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none font-semibold min-w-[190px] shadow-sm"
            >
              {eventRegistrations.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.status === 'attended' ? 'Attended' : 'Registered'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* EMPTY STATE IF 0 REGISTRATIONS (when viewing ticket pass) */}
      {activeView === 'ticket' && eventRegistrations.length === 0 && (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto space-y-4 my-6">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Registrations Yet for {tenant?.name}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            There are no registered delegates for this workspace yet. You can use the public registration page to sign up an attendee and generate an instant ticket pass.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveView('register')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
            >
              Open Public Registration Page (FR-1)
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: DIGITAL TICKET PASS (FR-1.7) */}
      {activeView === 'ticket' && currentAttendee && (
        <div className="space-y-6">
          
          {/* Ticket Card (Styled like high-end Apple Wallet / Conference Pass) */}
          <div className="max-w-md mx-auto bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden relative">
            
            {/* Top Brand Banner */}
            <div 
              className="p-5 text-white flex items-center justify-between"
              style={{ backgroundColor: tenant?.brandColor || '#4f46e5' }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={tenant?.logoUrl}
                  alt={tenant?.name}
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 bg-white"
                />
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">{tenant?.name}</h3>
                  <p className="text-[11px] text-white/80 uppercase tracking-wider font-semibold">Official Pass</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black/30 backdrop-blur-md uppercase tracking-wider border border-white/20">
                {currentAttendee.category}
              </span>
            </div>

            {/* Event Title & Details */}
            <div className="p-6 text-center border-b border-slate-700/60">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {event?.title}
              </h2>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {new Date(event?.startsAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {event?.venue?.split(',')[0]}
                </span>
              </div>
            </div>

            {/* Attendee Info & Photo */}
            <div className="p-6 text-center bg-slate-900/60">
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={currentAttendee.photoUrl}
                  alt={currentAttendee.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-700 shadow-lg mx-auto"
                />
                {currentAttendee.status === 'attended' && (
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white shadow-md flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> ATTENDED
                  </span>
                )}
              </div>

              <h3 className="text-lg font-extrabold text-white">{currentAttendee.name}</h3>
              <p className="text-xs text-slate-300 font-medium">{currentAttendee.jobTitle}</p>
              <p className="text-xs text-indigo-400 font-semibold">{currentAttendee.organization}</p>
            </div>

            {/* QR Code Ticket Section (Single use check-in) */}
            <div className="p-6 text-center bg-white text-slate-900">
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 inline-block mx-auto mb-2">
                {activeTicketQr && (
                  <img 
                    src={activeTicketQr} 
                    alt="Ticket QR" 
                    className="w-48 h-48 mx-auto" 
                  />
                )}
              </div>
              <p className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                {currentAttendee.ticketCode}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Show this barcode to staff at the check-in desk on event day
              </p>
            </div>

            {/* Status Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${currentAttendee.status === 'attended' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>Status: <strong className="text-white capitalize">{currentAttendee.status}</strong></span>
              </div>
              {currentAttendee.status === 'attended' && (
                <button
                  onClick={() => setIsCertificateOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" /> Certificate
                </button>
              )}
            </div>

          </div>

          {/* Attendee Actions */}
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Ticket</span>
            </button>

            {currentAttendee.status === 'attended' ? (
              <button
                onClick={onNavigateToChat}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
              >
                <span>Enter Event Chat (FR-5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex-1 py-2 px-3 bg-slate-800/60 rounded-xl text-center text-[11px] text-slate-400 border border-slate-700">
                Event Chat unlocks after on-site check-in
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: PUBLIC REGISTRATION FORM (FR-1.1 - FR-1.6) */}
      {activeView === 'register' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          
          {/* Header Banner */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <img
              src={tenant?.logoUrl}
              alt={tenant?.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-700 bg-slate-800"
            />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Official Event Registration
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {event?.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hosted by {tenant?.name} • Free Registration
              </p>
            </div>
          </div>

          {/* Shareable Public Registration Link bar */}
          <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Public Shareable Link for Attendees:</p>
                <p className="font-mono text-indigo-300 text-[11px] truncate max-w-xs sm:max-w-md">
                  {`${window.location.origin}/?tenant=${tenant?.slug}&role=attendee&register=true`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const link = `${window.location.origin}/?tenant=${tenant?.slug}&role=attendee&register=true`;
                navigator.clipboard.writeText(link);
                setCopiedRegLink(true);
                setTimeout(() => setCopiedRegLink(false), 2500);
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0 active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedRegLink ? "Link Copied!" : "Copy Link"}</span>
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
              {formError}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Identity details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ama Mensah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address * (Duplicate detection active)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ama.mensah@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone Number (For SMS ticket delivery)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g. +233 24 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Delegate Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {event?.categories?.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Organization / Company
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Bank of Ghana / Independent"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Job Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Photo Capture / Upload Section (FR-1.3) */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Attendee Photo (Required for Printed Name Badge - FR-1.3)</span>
                <span className="text-[11px] text-slate-400">Headshot with clear face</span>
              </label>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative group">
                    <img
                      src={photoUrl}
                      alt="Selected Avatar"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shrink-0 bg-slate-900"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold shadow">
                      Ready
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <button
                        type="button"
                        onClick={isCameraActive ? stopCamera : startCamera}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                          isCameraActive
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
                        }`}
                      >
                        <Camera className="w-4 h-4" />
                        <span>{isCameraActive ? 'Close Camera' : 'Take Picture'}</span>
                      </button>

                      <label className="cursor-pointer px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1.5">Or choose sample avatar:</span>
                      <div className="flex justify-center sm:justify-start gap-2">
                        {PRESET_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              stopCamera();
                              setPhotoUrl(url);
                            }}
                            className={`w-9 h-9 rounded-lg overflow-hidden border transition-all ${
                              photoUrl === url ? 'ring-2 ring-indigo-500 border-white scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Camera Viewfinder Inline Box */}
                {isCameraActive && (
                  <div className="p-4 bg-slate-900 border border-indigo-500/40 rounded-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between w-full max-w-sm px-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-200">Live Camera Viewfinder</span>
                      </div>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-indigo-500/60">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                      {/* Reticle / Face framing guide */}
                      <div className="absolute inset-4 border-2 border-dashed border-indigo-400/60 rounded-full pointer-events-none flex items-end justify-center pb-2">
                        <span className="bg-slate-950/80 backdrop-blur-md text-[10px] text-indigo-200 px-2.5 py-0.5 rounded-full font-medium border border-indigo-400/30">
                          Align face in circle
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105 active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Snap Picture</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Camera error feedback */}
                {cameraError && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-300">Camera Notice</p>
                      <p className="text-[11px] text-amber-200/90 mt-0.5">{cameraError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCameraError(null)}
                      className="text-amber-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy & Photo Consent (Ghana Act 843 compliant - PRD 10.2) */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 leading-relaxed">
                  I agree to the processing of my registration details and photograph for attendee verification, on-site badge printing, and event communication in compliance with Ghana's Data Protection Act, 2012 (Act 843).
                </span>
              </label>
            </div>

            {/* Submit Registration Button */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Registration & Issue Ticket Pass</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        attendee={currentAttendee}
        event={event}
        tenant={tenant}
      />

    </div>
  );
}
