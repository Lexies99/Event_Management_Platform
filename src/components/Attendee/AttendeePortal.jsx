import React, { useState, useRef, useEffect } from 'react';
import TenantLogo from '../Common/TenantLogo';
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
import BadgeModal from '../Common/BadgeModal';
import CertificateModal from '../Common/CertificateModal';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';

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
  
  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;

  // Registration form state
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState(event?.categories?.[0] || 'Attendee');
  const [passType, setPassType] = useState('full_week'); // 'full_week' | 'three_day' | 'custom'
  const [selectedDays, setSelectedDays] = useState(() => (event?.eventDays || DEFAULT_EVENT_DAYS).map(d => d.id));
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
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  const eventRegistrations = registrations.filter(r => r.eventId === event?.id);
  const currentAttendee = eventRegistrations.find(r => r.id === currentAttendeeId) || eventRegistrations[0];

  useEffect(() => {
    if (currentAttendee?.ticketCode) {
      generateQrDataUrl(currentAttendee.ticketCode, {
        width: 220,
        margin: 1,
        darkColor: '#121819',
        lightColor: '#ffffff'
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

    if (!selectedDays || selectedDays.length === 0) {
      setFormError("Please select at least one event day to attend.");
      return;
    }

    try {
      const newReg = onAddRegistration({
        tenantId: tenant.id,
        eventId: event.id,
        name: title && !name.startsWith(title) ? `${title} ${name.trim()}` : name.trim(),
        title,
        country,
        email: email.trim(),
        phone: phone.trim(),
        organization: organization.trim() || 'Independent Delegate',
        jobTitle: jobTitle.trim() || 'Summit Delegate',
        category,
        passType,
        selectedDays,
        photoUrl: photoUrl || PRESET_AVATARS[0]
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCurrentAttendeeId(newReg.id);
      setActiveView('ticket');
    } catch (err) {
      setFormError(err.message || "Failed to complete registration.");
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
      <div className="flex items-center justify-between bg-[#1a2325] border border-white/10 rounded-2xl p-2.5 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('ticket')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'ticket'
                ? 'bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold shadow-md shadow-[#6C7A89]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Digital Ticket Pass
          </button>
          <button
            onClick={() => setActiveView('register')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'register'
                ? 'bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold shadow-md shadow-[#6C7A89]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Public Registration Page (FR-1)
          </button>
        </div>

        {/* Quick attendee switcher for demo testing */}
        {activeView === 'ticket' && eventRegistrations.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/50 hidden sm:inline flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-[#A3C6C4]" /> Pass Preview:
            </span>
            <select
              value={currentAttendee?.id || ''}
              onChange={(e) => setCurrentAttendeeId(e.target.value)}
              className="bg-[#121819] text-xs text-white border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none font-semibold min-w-[190px] shadow-sm"
            >
              {eventRegistrations.map(r => (
                <option key={r.id} value={r.id} className="bg-[#121819] text-white">
                  {r.name} ({r.status === 'attended' ? 'Attended' : 'Registered'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* EMPTY STATE IF 0 REGISTRATIONS (when viewing ticket pass) */}
      {activeView === 'ticket' && eventRegistrations.length === 0 && (
        <div className="bg-[#1a2325] p-8 sm:p-12 rounded-3xl border border-white/10 text-center max-w-lg mx-auto space-y-4 my-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#A3C6C4]/10 border border-[#A3C6C4]/30 text-[#A3C6C4] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-white">No Registrations Yet for {tenant?.name}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            There are no registered delegates for this workspace yet. You can use the public registration page to sign up an attendee and generate an instant ticket pass.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveView('register')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold rounded-xl text-xs shadow-lg shadow-[#6C7A89]/20 transition-all hover:opacity-95"
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
          <div className="max-w-md mx-auto bg-[#1a2325] rounded-3xl border border-white/15 shadow-2xl overflow-hidden relative">
            
            {/* Top Brand Banner with Warm Palette Gradient */}
            <div className="p-5 text-black flex items-center justify-between bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4]">
              <div className="flex items-center gap-3">
                <TenantLogo tenant={tenant} size={40} className="rounded-xl shadow-md" />
                <div>
                  <h3 className="font-heading font-extrabold text-sm leading-tight text-[#121819]">{tenant?.name}</h3>
                  <p className="text-[10px] text-black/70 uppercase tracking-wider font-mono font-bold">Official Pass</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black/20 text-[#121819] uppercase tracking-wider border border-black/15 font-mono">
                {currentAttendee.category}
              </span>
            </div>

            {/* Event Title & Details */}
            <div className="p-6 text-center border-b border-white/10">
              <h2 className="font-heading font-extrabold text-xl text-white tracking-tight">
                {event?.title}
              </h2>
              <div className="flex items-center justify-center gap-3 text-xs text-white/60 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#A3C6C4]" />
                  {new Date(event?.startsAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin className="w-3.5 h-3.5 text-[#6C7A89]" />
                  {event?.venue?.split(',')[0]}
                </span>
              </div>
            </div>

            {/* Attendee Profile Section */}
            <div className="p-6 flex items-center gap-4 bg-[#121819] border-b border-white/10">
              <img
                src={currentAttendee.photoUrl}
                alt={currentAttendee.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#A3C6C4]/50 shadow-md shrink-0 bg-[#1a2325]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-base text-white truncate">
                  {currentAttendee.name}
                </h4>
                <p className="text-xs text-white/80 font-medium truncate">{currentAttendee.jobTitle}</p>
                <p className="text-[11px] text-white/50 truncate flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-[#A3C6C4]" /> {currentAttendee.organization}
                </p>
              </div>
            </div>

            {/* Multi-Day Pass Tier Tag */}
            <div className="px-6 py-3 bg-[#181817] border-b border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Tier:</span>
                <span className="font-bold text-[#E0E7E9] uppercase text-[11px]">
                  {currentAttendee.passType === 'full_week' 
                    ? 'Full Week Access (5 Days)' 
                    : currentAttendee.passType === 'three_day' 
                    ? '3-Day Summit Bundle' 
                    : `Custom Schedule (${currentAttendee.selectedDays?.length || 1} Days)`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {eventDays.map((d, idx) => {
                  const isPermitted = (currentAttendee.selectedDays || []).includes(d.id);
                  return (
                    <span
                      key={d.id}
                      className={`w-4 h-4 rounded text-[8px] font-black flex items-center justify-center border ${
                        isPermitted 
                          ? 'bg-[#A3C6C4]/20 text-[#E0E7E9] border-[#A3C6C4]/50' 
                          : 'bg-[#121819] text-white/20 border-white/5 line-through'
                      }`}
                      title={`${d.label}: ${isPermitted ? 'Permitted' : 'No Access'}`}
                    >
                      {`D${idx + 1}`}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Barcode & High-Resolution QR */}
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
            <div className="p-4 bg-[#121819] border-t border-white/10 text-xs flex items-center justify-between text-white/60">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${currentAttendee.status === 'attended' ? 'bg-emerald-400' : 'bg-[#A3C6C4]'}`} />
                <span>Status: <strong className="text-white capitalize">{currentAttendee.status}</strong></span>
              </div>
              {currentAttendee.status === 'attended' && (
                <button
                  onClick={() => setIsCertificateOpen(true)}
                  className="text-[#A3C6C4] hover:text-[#E0E7E9] font-semibold flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" /> Certificate
                </button>
              )}
            </div>

          </div>

          {/* Attendee Actions */}
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <button
              onClick={() => setIsBadgeModalOpen(true)}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#6C7A89]/20 transition-all hover:opacity-95 active:scale-95"
            >
              <span>🏷️ View Lanyard Tag Badge</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 bg-[#243033] hover:bg-[#2e2e2b] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-white/15 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#A3C6C4]" />
              <span>Print Ticket</span>
            </button>

            {currentAttendee.status === 'attended' ? (
              <button
                onClick={onNavigateToChat}
                className="flex-1 py-2.5 bg-[#243033] hover:bg-[#2e2e2b] text-[#E0E7E9] rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#A3C6C4]/30 transition-all"
              >
                <span>Enter Chat</span>
                <ArrowRight className="w-4 h-4 text-[#6C7A89]" />
              </button>
            ) : (
              <div className="flex-1 py-2 px-3 bg-[#1a2325] rounded-xl text-center text-[11px] text-white/50 border border-white/10">
                Chat unlocks on-site
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: PUBLIC REGISTRATION FORM (FR-1.1 - FR-1.6) */}
      {activeView === 'register' && (
        <div className="bg-[#1a2325] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          
          {/* Header Banner */}
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            <TenantLogo tenant={tenant} size={56} className="rounded-2xl" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#A3C6C4] bg-[#A3C6C4]/10 px-2.5 py-0.5 rounded-full border border-[#A3C6C4]/30">
                Official Event Registration
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-1.5">
                {event?.title}
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Hosted by {tenant?.name} • Free Registration
              </p>
            </div>
          </div>

          {/* Shareable Public Registration Link bar */}
          <div className="bg-[#121819] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-inner">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Public Shareable Link for Attendees:</p>
                <p className="font-mono text-[#E0E7E9] text-[11px] truncate max-w-xs sm:max-w-md">
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
              className="px-3.5 py-1.5 bg-[#243033] hover:bg-[#2e2e2b] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-all shrink-0 active:scale-95"
            >
              {copiedRegLink ? (
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

          {formError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
              {formError}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Identity details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ama Mensah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121819] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#6C7A89]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Email Address * (Duplicate detection active)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ama.mensah@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121819] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#6C7A89]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Phone Number (For SMS ticket delivery)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-white/40" />
                  <input
                    type="tel"
                    placeholder="e.g. +233 24 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#121819] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#6C7A89]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Delegate Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#121819] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6C7A89]"
                >
                  {event?.categories?.map(c => (
                    <option key={c} value={c} className="bg-[#121819] text-white">{c}</option>
                  )) || (
                    <>
                      <option value="Attendee">Attendee</option>
                      <option value="VIP">VIP</option>
                      <option value="Speaker">Speaker</option>
                      <option value="Media">Media</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Organization / Company
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="e.g. Bank of Ghana / Independent"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-[#121819] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#6C7A89]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Job Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-[#121819] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#6C7A89]"
                  />
                </div>
              </div>
            </div>

            {/* Multi-Day Pass Selection Section */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#6C7A89]" />
                    <span>Select Multi-Day Pass & Attendance Schedule *</span>
                  </label>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    Choose whether you will attend all 5 days, a 3-day bundle, or custom days.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#E0E7E9] bg-[#A3C6C4]/15 px-2.5 py-0.5 rounded-full border border-[#A3C6C4]/30">
                  {selectedDays.length} of {eventDays.length} Days Selected
                </span>
              </div>

              {/* Pass Tier Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Full Week Pass */}
                <div
                  onClick={() => {
                    setPassType('full_week');
                    setSelectedDays(eventDays.map(d => d.id));
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    passType === 'full_week'
                      ? 'bg-[#6C7A89]/15 border-[#6C7A89] shadow-md shadow-[#6C7A89]/10'
                      : 'bg-[#121819] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-white">Full Week Pass</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      passType === 'full_week' ? 'border-[#6C7A89] bg-[#6C7A89]' : 'border-white/30'
                    }`}>
                      {passType === 'full_week' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    All-access to all 5 event days (Mon - Fri) including gala.
                  </p>
                  <span className="mt-2 inline-block text-[10px] font-bold text-[#E0E7E9] bg-white/10 px-2 py-0.5 rounded">
                    5 Days Included
                  </span>
                </div>

                {/* 2. Three Day Pass */}
                <div
                  onClick={() => {
                    setPassType('three_day');
                    setSelectedDays(['day-1', 'day-2', 'day-3']);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    passType === 'three_day'
                      ? 'bg-[#A3C6C4]/15 border-[#A3C6C4] shadow-md shadow-[#A3C6C4]/10'
                      : 'bg-[#121819] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-white">3-Day Pass</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      passType === 'three_day' ? 'border-[#A3C6C4] bg-[#A3C6C4]' : 'border-white/30'
                    }`}>
                      {passType === 'three_day' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    Access to Day 1 to Day 3 (Opening Summit & Masterclasses).
                  </p>
                  <span className="mt-2 inline-block text-[10px] font-bold text-[#A3C6C4] bg-[#A3C6C4]/20 px-2 py-0.5 rounded">
                    Days 1, 2, 3 Bundle
                  </span>
                </div>

                {/* 3. Custom Individual Days */}
                <div
                  onClick={() => {
                    setPassType('custom');
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    passType === 'custom'
                      ? 'bg-[#354649]/20 border-[#354649] shadow-md shadow-[#354649]/10'
                      : 'bg-[#121819] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-white">Custom Days</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      passType === 'custom' ? 'border-[#354649] bg-[#354649]' : 'border-white/30'
                    }`}>
                      {passType === 'custom' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    Pick and choose specific individual days according to schedule.
                  </p>
                  <span className="mt-2 inline-block text-[10px] font-bold text-[#E0E7E9] bg-white/10 px-2 py-0.5 rounded">
                    Custom Schedule
                  </span>
                </div>
              </div>

              {/* Day Checkboxes */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-white/70 block mb-2">
                  Select Days to Attend:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {eventDays.map((d) => {
                    const isChecked = selectedDays.includes(d.id);
                    return (
                      <label
                        key={d.id}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2 transition-all ${
                          isChecked 
                            ? 'bg-[#1a2325] border-[#6C7A89] text-white shadow-sm' 
                            : 'bg-[#121819] border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const updated = [...selectedDays, d.id];
                              setSelectedDays(updated);
                              if (updated.length === eventDays.length) setPassType('full_week');
                              else setPassType('custom');
                            } else {
                              const updated = selectedDays.filter(id => id !== d.id);
                              setSelectedDays(updated);
                              setPassType('custom');
                            }
                          }}
                          className="mt-0.5 rounded accent-[#6C7A89]"
                        />
                        <div className="leading-tight">
                          <span className="font-bold block text-white">{d.label}</span>
                          <span className="text-[10px] text-white/50 block">{d.name.split(' - ')[1] || d.name}</span>
                          <span className="text-[10px] text-[#A3C6C4] font-mono">{d.date}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Photo Capture / Upload Section (FR-1.3) */}
            <div className="pt-2 border-t border-white/10">
              <label className="block text-xs font-semibold text-white/80 mb-2 flex items-center justify-between">
                <span>Attendee Photo (Required for Printed Name Badge - FR-1.3)</span>
                <span className="text-[11px] text-white/40">Headshot with clear face</span>
              </label>

              <div className="bg-[#121819] border border-white/10 rounded-2xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative group">
                    <img
                      src={photoUrl}
                      alt="Selected Avatar"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#A3C6C4]/60 shadow-md shrink-0 bg-[#1a2325]"
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
                            ? 'bg-rose-600 hover:bg-rose-500 text-white'
                            : 'bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold hover:opacity-95'
                        }`}
                      >
                        <Camera className="w-4 h-4 text-black" />
                        <span>{isCameraActive ? 'Close Camera' : 'Take Picture'}</span>
                      </button>

                      <label className="cursor-pointer px-3.5 py-2 bg-[#243033] hover:bg-[#2e2e2b] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/15 shadow-sm">
                        <Upload className="w-4 h-4 text-[#A3C6C4]" />
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
                      <span className="text-[10px] text-white/40 block mb-1.5">Or choose sample avatar:</span>
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
                              photoUrl === url ? 'ring-2 ring-[#6C7A89] border-white scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Webcam Preview Window */}
                {isCameraActive && (
                  <div className="pt-3 border-t border-white/10 flex flex-col items-center gap-3">
                    <div className="flex items-center justify-between w-full max-w-xs">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        Live Webcam View
                      </span>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-[#6C7A89]/60">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                      {/* Reticle / Face framing guide */}
                      <div className="absolute inset-4 border-2 border-dashed border-[#A3C6C4]/60 rounded-full pointer-events-none flex items-end justify-center pb-2">
                        <span className="bg-black/80 backdrop-blur-md text-[10px] text-[#E0E7E9] px-2.5 py-0.5 rounded-full font-medium border border-[#A3C6C4]/30">
                          Align face in circle
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#6C7A89]/20 transition-all hover:scale-105 active:scale-95"
                      >
                        <Camera className="w-4 h-4 text-black" />
                        <span>Snap Picture</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2.5 bg-[#243033] hover:bg-white/10 text-white rounded-xl text-xs font-medium transition-colors border border-white/10"
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
            <div className="pt-2 border-t border-white/10">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 rounded accent-[#6C7A89]"
                />
                <span className="text-[11px] text-white/50 leading-relaxed">
                  I agree to the processing of my registration details and photograph for attendee verification, on-site badge printing, and event communication in compliance with Ghana's Data Protection Act, 2012 (Act 843).
                </span>
              </label>
            </div>

            {/* Submit Registration Button */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#354649] via-[#6C7A89] to-[#A3C6C4] text-[#E0E7E9] rounded-2xl font-extrabold text-xs shadow-xl shadow-[#6C7A89]/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-black" />
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

      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        attendee={currentAttendee}
        tenant={tenant}
        event={event}
      />

    </div>
  );
}
