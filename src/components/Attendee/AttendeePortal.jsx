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
  Printer,
  Award,
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  Copy,
  Check,
  X,
  AlertCircle,
  FileText,
  Globe,
} from 'lucide-react';
import { generateQrDataUrl } from '../../utils/qr';
import confetti from 'canvas-confetti';
import BadgeModal from '../Common/BadgeModal';
import CertificateModal from '../Common/CertificateModal';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';
import { printElementCleanly } from '../../utils/print';

export default function AttendeePortal({
  tenant,
  event,
  registrations = [],
  onAddRegistration,
  currentAttendeeId,
  setCurrentAttendeeId,
  onNavigateToChat,
  onOpenTerms,
  defaultView = 'ticket',
  isOrganizerOrAdmin = false,
  isAuthenticated = false,
}) {
  const effectiveDefaultView = isAuthenticated ? defaultView : 'register';
  const [activeView, setActiveView] = useState(effectiveDefaultView);
  const [justRegisteredAttendee, setJustRegisteredAttendee] = useState(null);
  const [copiedRegLink, setCopiedRegLink] = useState(false);

  useEffect(() => {
    if (justRegisteredAttendee) return;
    setActiveView(isAuthenticated ? defaultView : 'register');
  }, [defaultView, isAuthenticated, justRegisteredAttendee]);

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
  const [passType, setPassType] = useState('full_week');
  const [selectedDays, setSelectedDays] = useState(() => (event?.eventDays || DEFAULT_EVENT_DAYS).map((d) => d.id));
  const [photoUrl, setPhotoUrl] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [formError, setFormError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [activeTicketQr, setActiveTicketQr] = useState(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  const eventRegistrations = registrations.filter((r) => r.eventId === event?.id);
  const currentAttendee =
    eventRegistrations.find((r) => r.id === currentAttendeeId) ||
    (justRegisteredAttendee && justRegisteredAttendee.eventId === event?.id ? justRegisteredAttendee : null) ||
    (isAuthenticated && isOrganizerOrAdmin ? eventRegistrations[0] : null);

  useEffect(() => {
    if (currentAttendee?.ticketCode) {
      generateQrDataUrl(currentAttendee.ticketCode, {
        width: 220,
        margin: 1,
        darkColor: '#1a1d1a',
        lightColor: '#ffffff'
      }).then((url) => setActiveTicketQr(url));
    }
  }, [currentAttendee]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim()) {
      setFormError('Full name and email address are required.');
      return;
    }
    if (!consentAccepted) {
      setFormError('Please accept the Terms & Conditions and Ghana Act 843 Data Protection Consent.');
      return;
    }
    if (!selectedDays || selectedDays.length === 0) {
      setFormError('Please select at least one event day to attend.');
      return;
    }

    try {
      const newReg = await onAddRegistration({
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
        photoUrl: photoUrl || '',
        consentAccepted: true,
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setJustRegisteredAttendee(newReg);
      setCurrentAttendeeId(newReg.id);
      setActiveView('ticket');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFormError(err.message || 'Failed to complete registration.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setFormError('Image must be smaller than 15MB.');
      return;
    }
    stopCamera();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rawDataUrl = String(ev.target.result || '');
      // Compress/resize mobile camera photos to max 360x360 JPEG so iOS/Android localStorage never overflows
      const img = new Image();
      img.onload = () => {
        const maxSide = 360;
        const scale = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        try {
          setPhotoUrl(canvas.toDataURL('image/jpeg', 0.78));
        } catch {
          setPhotoUrl(rawDataUrl);
        }
      };
      img.onerror = () => setPhotoUrl(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch {
      setCameraError('Could not access camera. Please allow camera permission or upload a photo file.');
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const vw = video.videoWidth || 400;
    const vh = video.videoHeight || 400;
    const sz = Math.min(vw, vh);
    ctx.drawImage(video, (vw - sz) / 2, (vh - sz) / 2, sz, sz, 0, 0, 400, 400);
    setPhotoUrl(canvas.toDataURL('image/jpeg', 0.9));
    stopCamera();
  };

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive]);

  const publicRegUrl = `${window.location.origin}/#/${tenant?.slug}/register`;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top Switcher Bar (Only show Ticket switcher for authenticated users) */}
      {isAuthenticated && (
        <div className="fp-card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('ticket')}
              className={`fp-subnav-pill text-xs py-2 px-3.5 ${activeView === 'ticket' ? 'active' : ''}`}
            >
              Digital Ticket Pass
            </button>
            <button
              type="button"
              onClick={() => setActiveView('register')}
              className={`fp-subnav-pill text-xs py-2 px-3.5 ${activeView === 'register' ? 'active' : ''}`}
            >
              Event Registration Form
            </button>
          </div>

          {activeView === 'ticket' && isOrganizerOrAdmin && eventRegistrations.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Users className="w-4 h-4 shrink-0" style={{ color: 'var(--fp-olive)' }} />
              <select
                value={currentAttendee?.id || ''}
                onChange={(e) => setCurrentAttendeeId(e.target.value)}
                className="fp-input flex-1 sm:w-56 px-2.5 py-1.5 text-xs font-semibold"
              >
                {eventRegistrations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.status === 'attended' ? 'Checked In' : 'Registered'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* EMPTY STATE */}
      {activeView === 'ticket' && !currentAttendee && (
        <div className="fp-card p-8 sm:p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)' }}>
            <UserCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold m-0">No Registrations Yet for {tenant?.name}</h3>
          <p className="text-xs sm:text-sm m-0" style={{ color: 'var(--text-muted)' }}>
            Register below to receive an instant QR ticket pass and printable 3.1-inch lanyard badge.
          </p>
          <button type="button" onClick={() => setActiveView('register')} className="btn-fp-olive px-5 py-2.5 text-xs sm:text-sm">
            Register for Event
          </button>
        </div>
      )}

      {/* VIEW 1: DIGITAL TICKET PASS */}
      {activeView === 'ticket' && currentAttendee && (
        <div className="space-y-5">
          <div id="printable-ticket-card" className="fp-card max-w-md mx-auto overflow-hidden shadow-md">
            {/* Branded Top Strip */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-2 border-b" style={{ background: 'var(--bg-header)', borderColor: 'var(--border-header)', color: 'var(--header-text)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <TenantLogo tenant={tenant} size={40} className="rounded-xl" />
                <div className="min-w-0">
                  <div className="font-extrabold text-sm truncate">{tenant?.shortName || tenant?.name}</div>
                  <div className="text-[11px] font-mono opacity-80">Official Event Pass</div>
                </div>
              </div>
              <span className="fp-tag-olive text-[11px] uppercase shrink-0">{currentAttendee.category}</span>
            </div>

            {/* Event Info */}
            <div className="p-5 text-center border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h2 className="text-lg sm:text-xl font-extrabold m-0">{event?.title}</h2>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(event?.startsAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {event?.venue?.split(',')[0]}
                </span>
              </div>
            </div>

            {/* Attendee Profile */}
            <div className="p-4 sm:p-5 flex items-center gap-3.5 border-b" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              {currentAttendee.photoUrl ? (
                <img
                  src={currentAttendee.photoUrl}
                  alt={currentAttendee.name}
                  className="w-16 h-16 rounded-2xl object-cover border shrink-0"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl border shrink-0 flex items-center justify-center font-extrabold text-lg"
                  style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)', borderColor: 'var(--border-color)' }}
                >
                  {(currentAttendee.name || 'DE').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-base truncate">{currentAttendee.name}</div>
                <div className="text-xs font-medium truncate" style={{ color: 'var(--text-sub)' }}>{currentAttendee.jobTitle}</div>
                <div className="text-xs truncate flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{currentAttendee.organization}</span>
                </div>
              </div>
            </div>

            {/* Multi-Day Access */}
            <div className="px-5 py-3 border-b flex flex-wrap items-center justify-between gap-2 text-xs" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
              <span className="font-bold">
                {currentAttendee.passType === 'full_week'
                  ? 'Full Week Access (5 Days)'
                  : currentAttendee.passType === 'three_day'
                  ? '3-Day Summit Pass'
                  : `Custom Pass (${currentAttendee.selectedDays?.length || 1} Days)`}
              </span>
              <div className="flex items-center gap-1">
                {eventDays.map((d, idx) => {
                  const ok = (currentAttendee.selectedDays || eventDays.map((x) => x.id)).includes(d.id);
                  return (
                    <span
                      key={d.id}
                      className="w-6 h-5 rounded text-[10px] font-bold flex items-center justify-center border"
                      style={{
                        background: ok ? 'var(--fp-olive)' : 'var(--bg-main)',
                        color: ok ? 'var(--fp-olive-text, #ffffff)' : 'var(--text-muted)',
                        borderColor: ok ? 'var(--fp-olive)' : 'var(--border-color)',
                      }}
                    >
                      D{idx + 1}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* High-Contrast QR */}
            <div className="p-6 text-center bg-white text-slate-900">
              <div className="inline-block p-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 mb-2">
                {activeTicketQr && <img src={activeTicketQr} alt="Ticket QR" className="w-44 h-44 mx-auto" />}
              </div>
              <p className="font-mono text-lg font-black text-slate-950 tracking-wider m-0">
                {currentAttendee.ticketCode}
              </p>
              <p className="text-xs text-slate-500 mt-1 m-0">
                Present this QR code or ticket code at the check-in desk
              </p>
            </div>

            {/* Status Footer */}
            <div className="px-5 py-3.5 border-t flex items-center justify-between text-xs" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: currentAttendee.status === 'attended' ? 'var(--fp-green)' : 'var(--fp-olive)' }} />
                <span>Status: <strong className="capitalize">{currentAttendee.status}</strong></span>
              </div>
              {currentAttendee.status === 'attended' && (
                <button
                  type="button"
                  onClick={() => setIsCertificateOpen(true)}
                  className="font-bold inline-flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--fp-olive)', background: 'none', border: 'none' }}
                >
                  <Award className="w-3.5 h-3.5" /> Certificate
                </button>
              )}
            </div>
          </div>

          {/* Responsive Attendee Actions */}
          <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setIsBadgeModalOpen(true)}
              className="btn-fp-olive py-2.5 px-3 text-xs inline-flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>3.1&quot; Lanyard Tag</span>
            </button>
            <button
              type="button"
              onClick={() => printElementCleanly('printable-ticket-card', `${currentAttendee.name} - Ticket`)}
              className="btn-fp-outline py-2.5 px-3 text-xs inline-flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Ticket</span>
            </button>
            {currentAttendee.status === 'attended' ? (
              <button
                type="button"
                onClick={onNavigateToChat}
                className="btn-fp-sage py-2.5 px-3 text-xs inline-flex items-center justify-center gap-1.5"
              >
                <span>Event Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="py-2.5 px-3 rounded-lg border text-center text-[11px] font-medium" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                Chat unlocks on check-in
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: PUBLIC REGISTRATION FORM */}
      {activeView === 'register' && (
        <div className="fp-card p-5 sm:p-8 space-y-6">
          <div className="flex items-center gap-3.5 pb-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <TenantLogo tenant={tenant} size={52} className="rounded-xl" />
            <div className="min-w-0">
              <span className="fp-tag-sage mb-1">Official Event Registration</span>
              <h2 className="text-lg sm:text-2xl font-extrabold m-0 leading-tight">{event?.title}</h2>
              <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Hosted by {tenant?.name} · {event?.venue}
              </p>
            </div>
          </div>

          {/* Shareable Link Strip */}
          <div className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
            <div className="min-w-0">
              <div className="font-bold">Dedicated Registration URL:</div>
              <code className="text-[11px] block truncate mt-0.5" style={{ color: 'var(--fp-olive)' }}>{publicRegUrl}</code>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(publicRegUrl);
                setCopiedRegLink(true);
                setTimeout(() => setCopiedRegLink(false), 2000);
              }}
              className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              {copiedRegLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRegLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2" style={{ background: 'rgba(201,59,43,0.08)', borderColor: 'var(--fp-red)', color: 'var(--fp-red)' }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Title &amp; Full Name *</label>
                <div className="flex gap-2">
                  <select value={title} onChange={(e) => setTitle(e.target.value)} className="fp-input w-24 px-2 py-2.5 text-xs">
                    <option value="">Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Eng.">Eng.</option>
                  </select>
                  <div className="relative flex-1">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ama Mensah" className="fp-input w-full pl-9 pr-3 py-2.5 text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ama.mensah@company.com" className="fp-input w-full pl-9 pr-3 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 24 000 0000" className="fp-input w-full pl-9 pr-3 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Country / Nationality</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ghana" className="fp-input w-full pl-9 pr-3 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Organization / Company</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. GIMPA / Bank of Ghana" className="fp-input w-full pl-9 pr-3 py-2.5 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Job Title</label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Role" className="fp-input w-full pl-8 pr-2.5 py-2.5 text-xs sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="fp-input w-full px-2.5 py-2.5 text-xs sm:text-sm">
                    {(event?.categories || ['Attendee', 'Participant', 'Speaker', 'VIP', 'Sponsor']).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Multi-Day Pass Selection */}
            <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--fp-olive)' }} />
                  <span>Multi-Day Pass Selection *</span>
                </label>
                <span className="fp-tag-sage text-[11px]">{selectedDays.length} of {eventDays.length} Days</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'full_week', title: 'Full Week Pass', desc: 'All 5 event days', action: () => { setPassType('full_week'); setSelectedDays(eventDays.map((d) => d.id)); } },
                  { id: 'three_day', title: '3-Day Pass', desc: 'Days 1 to 3 bundle', action: () => { setPassType('three_day'); setSelectedDays(['day-1', 'day-2', 'day-3']); } },
                  { id: 'custom', title: 'Custom Days', desc: 'Pick specific days', action: () => setPassType('custom') },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={tier.action}
                    className="p-3 rounded-xl border text-left transition-colors"
                    style={{
                      background: passType === tier.id ? 'var(--fp-sage)' : 'var(--bg-main)',
                      borderColor: passType === tier.id ? 'var(--fp-olive)' : 'var(--border-color)',
                      color: passType === tier.id ? 'var(--fp-sage-text)' : 'var(--text-main)',
                    }}
                  >
                    <div className="font-bold text-xs sm:text-sm">{tier.title}</div>
                    <div className="text-[11px] opacity-80">{tier.desc}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {eventDays.map((d) => {
                  const checked = selectedDays.includes(d.id);
                  return (
                    <label
                      key={d.id}
                      className="p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2"
                      style={{
                        background: checked ? 'var(--bg-card)' : 'var(--bg-main)',
                        borderColor: checked ? 'var(--fp-olive)' : 'var(--border-color)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...selectedDays, d.id]
                            : selectedDays.filter((id) => id !== d.id);
                          setSelectedDays(updated);
                          setPassType(updated.length === eventDays.length ? 'full_week' : 'custom');
                        }}
                        className="mt-0.5 accent-[#5A6552]"
                      />
                      <div className="leading-tight min-w-0">
                        <span className="font-bold block truncate">{d.label}</span>
                        <span className="text-[10px] font-mono block" style={{ color: 'var(--text-muted)' }}>{d.date}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Attendee Photo Capture / Upload (No pre-filled stock portrait) */}
            <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
              <label className="block text-xs sm:text-sm font-bold">
                Attendee Photo <span className="font-normal text-xs" style={{ color: 'var(--text-muted)' }}>(Optional — printed on your ID badge)</span>
              </label>

              <div className="p-4 rounded-xl border space-y-4" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Uploaded attendee portrait"
                      className="w-20 h-20 rounded-2xl object-cover border-2 shrink-0"
                      style={{ borderColor: 'var(--fp-olive)' }}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-2xl border-2 border-dashed shrink-0 flex flex-col items-center justify-center gap-1"
                      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}
                    >
                      <User className="w-7 h-7" />
                      <span className="text-[10px] font-semibold">No Photo</span>
                    </div>
                  )}

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={isCameraActive ? stopCamera : startCamera}
                        className="btn-fp-olive px-3.5 py-2 text-xs inline-flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isCameraActive ? 'Close Camera' : 'Take Photo'}</span>
                      </button>

                      <label className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>

                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="btn-fp-outline px-3 py-2 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                      Capture a live portrait with your camera or upload a headshot from your device for your 3.1-inch lanyard badge.
                    </p>
                  </div>
                </div>

                {isCameraActive && (
                  <div className="pt-3 border-t flex flex-col items-center gap-3" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="w-60 h-60 rounded-2xl overflow-hidden bg-black border-2" style={{ borderColor: 'var(--fp-olive)' }}>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={capturePhoto} className="btn-fp-olive px-4 py-2 text-xs inline-flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" /> Snap Picture
                      </button>
                      <button type="button" onClick={stopCamera} className="btn-fp-outline px-4 py-2 text-xs">Cancel</button>
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div className="p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2" style={{ borderColor: 'var(--fp-amber)', color: 'var(--fp-amber)' }}>
                    <span>{cameraError}</span>
                    <button type="button" onClick={() => setCameraError(null)}><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Mandatory Terms & Conditions + Ghana Act 843 Consent */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#5A6552]"
                />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="font-bold underline inline-flex items-center gap-1"
                    style={{ color: 'var(--fp-olive)', background: 'none', border: 'none', padding: 0 }}
                  >
                    <FileText className="w-3 h-3" />
                    Terms &amp; Conditions
                  </button>{' '}
                  and consent to processing my registration details and photo for badge printing and event verification under Ghana&apos;s Data Protection Act, 2012 (Act 843).
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-fp-olive w-full sm:w-auto px-7 py-3 text-sm font-bold inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Registration &amp; Issue Ticket Pass</span>
              </button>
            </div>
          </form>
        </div>
      )}

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
