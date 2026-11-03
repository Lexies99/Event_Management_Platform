import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Percent, 
  Download, 
  Search, 
  Filter, 
  Printer, 
  Award, 
  Send, 
  Clock, 
  Calendar, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Mail,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Copy,
  Share2,
  ExternalLink,
  QrCode,
  Smartphone,
  Upload,
  Check
} from 'lucide-react';
import { exportAttendeesToCSV } from '../../utils/export';
import { generateQrDataUrl } from '../../utils/qr';
import { Storage } from '../../data/storage';
import BadgeModal from '../Common/BadgeModal';
import CertificateModal from '../Common/CertificateModal';
import RegistrationQrModal from './RegistrationQrModal';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';

export default function OrganizerDashboard({
  tenant,
  event,
  registrations,
  onCheckInByCode,
  onReprintBadge,
  activeRole
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendees' | 'communication'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPassType, setSelectedPassType] = useState('ALL'); // 'ALL' | 'full_week' | 'three_day' | 'custom'
  const [selectedAttendeeForBadge, setSelectedAttendeeForBadge] = useState(null);
  const [selectedAttendeeForCert, setSelectedAttendeeForCert] = useState(null);

  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;

  // Communication message broadcast state
  const [broadcastTarget, setBroadcastTarget] = useState('ALL'); // 'ALL' | 'ATTENDED' | 'NOSHOW'
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSentNotice, setBroadcastSentNotice] = useState(null);

  // Filtered registrations
  const eventRegistrations = registrations.filter(r => r.eventId === event?.id);
  const totalRegistered = eventRegistrations.length;
  const attendedCount = eventRegistrations.filter(r => r.status === 'attended').length;
  const noShowCount = totalRegistered - attendedCount;
  const attendanceRate = totalRegistered > 0 ? Math.round((attendedCount / totalRegistered) * 100) : 0;

  // Hourly check-in activity mock aggregation for today
  const hourlyActivity = [
    { hour: "08:00 - 09:00", count: 2, label: "Early Arrivals" },
    { hour: "09:00 - 10:00", count: 4, label: "Keynote Rush" },
    { hour: "10:00 - 11:00", count: 1, label: "Breakout 1" },
    { hour: "11:00 - 12:00", count: 0, label: "Midday" },
    { hour: "12:00 - 13:00", count: 0, label: "Lunch" }
  ];

  // Category breakdown
  const categoryCounts = eventRegistrations.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  // Search & filter
  const filteredAttendees = eventRegistrations.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ticketCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    const matchesPassType = selectedPassType === 'ALL' || r.passType === selectedPassType;

    return matchesSearch && matchesCategory && matchesStatus && matchesPassType;
  });

  const [exportNotice, setExportNotice] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [miniQrUrl, setMiniQrUrl] = useState(null);

  const registrationLink = `${window.location.origin}/?tenant=${tenant?.slug}&role=attendee&register=true`;

  useEffect(() => {
    if (registrationLink) {
      generateQrDataUrl(registrationLink, {
        width: 140,
        margin: 1,
        darkColor: '#141413',
        lightColor: '#ffffff'
      }).then(url => setMiniQrUrl(url));
    }
  }, [registrationLink]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleExportCSV = (listToExport = eventRegistrations) => {
    const list = listToExport && listToExport.length > 0 ? listToExport : eventRegistrations;
    if (!list || list.length === 0) {
      alert("No attendee records available to export for this event.");
      return;
    }
    const success = exportAttendeesToCSV(list, event?.title || 'Attendees');
    if (success) {
      setExportNotice({
        count: list.length,
        filename: `${(event?.title || 'Attendees').toLowerCase().replace(/[^a-z0-9]/g, "_")}_attendees.csv`
      });
      setTimeout(() => setExportNotice(null), 5000);
    }
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return;

    let targetCount = totalRegistered;
    if (broadcastTarget === 'ATTENDED') targetCount = attendedCount;
    if (broadcastTarget === 'NOSHOW') targetCount = noShowCount;

    setBroadcastSentNotice({
      count: targetCount,
      target: broadcastTarget,
      subject: broadcastSubject
    });

    setBroadcastSubject('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSentNotice(null), 5000);
  };

  const handleUpdateLogo = (e) => {
    const file = e.target.files?.[0];
    if (file && tenant?.id) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        Storage.updateTenant(tenant.id, { logoUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Export Success Notification Banner */}
      {exportNotice && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">CSV Export Generated Successfully!</p>
              <p className="text-[11px] text-emerald-300/80">
                Downloaded <strong>{exportNotice.count}</strong> attendee records as <code className="bg-[#141413] px-1.5 py-0.5 rounded font-mono text-white border border-white/10">{exportNotice.filename}</code>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-white/60 hover:text-white text-xs px-2 py-1 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Event Header Banner with Tenant Branding */}
      <div className="relative rounded-3xl bg-[#1c1c1b] border border-white/10 p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
        {/* Subtle iridescent gradient rim on top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E]" />
        
        {/* Background glow orb */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#AB6088]/10 via-[#FB9378]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-3.5 mb-3">
              <div className="relative group shrink-0">
                <img 
                  src={tenant?.logoUrl} 
                  alt={tenant?.name} 
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-[#E0C97E]/40 shadow-lg bg-[#141413]"
                  style={{ width: '52px', height: '52px' }}
                />
                <label 
                  className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white" 
                  title="Upload new company icon / logo"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <input type="file" accept="image/*" onChange={handleUpdateLogo} className="hidden" />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0C97E]/15 text-[#FCF8B3] border border-[#E0C97E]/30 uppercase tracking-wider">
                    Organizer Console
                  </span>
                  <span className="text-xs text-white/60">• {tenant?.name}</span>
                </div>
                <label className="text-[11px] text-white/50 hover:text-[#FB9378] underline cursor-pointer flex items-center gap-1 mt-0.5 font-medium transition-colors">
                  <Upload className="w-3 h-3 text-[#FB9378]" />
                  <span>Upload Company Icon</span>
                  <input type="file" accept="image/*" onChange={handleUpdateLogo} className="hidden" />
                </label>
              </div>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {event?.title || 'Annual Global Leadership Summit 2026'}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#E0C97E]" />
              <span>{event?.venue} • {new Date(event?.startsAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </p>

            {/* Public Registration Shareable Link display */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[11px] text-white/50 font-medium">Public Registration Link:</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-[#141413] hover:bg-[#252523] border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-mono text-[#FCF8B3] flex items-center gap-2 transition-all group shadow-inner"
                title="Click to copy registration link"
              >
                <span className="truncate max-w-[260px] sm:max-w-md">{registrationLink}</span>
                <Copy className="w-3.5 h-3.5 text-white/50 group-hover:text-white shrink-0" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold text-xs shadow-lg shadow-[#FB9378]/20 transition-all hover:opacity-95 active:scale-95"
              title="View Attendee Registration QR Code & Printable Entrance Sign"
            >
              <QrCode className="w-4 h-4 text-black" />
              <span>Registration QR & Sign</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#252523] hover:bg-[#2e2e2b] text-white font-bold text-xs border border-white/15 shadow-md transition-all active:scale-95"
              title="Copy public attendee registration link to share"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#FB9378]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleExportCSV(eventRegistrations)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#252523] hover:bg-[#2e2e2b] text-white font-semibold text-xs border border-white/15 transition-all shadow-md active:scale-95"
              title="Export all registrant records to CSV / Excel (FR-4.5)"
            >
              <Download className="w-4 h-4 text-[#E0C97E]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Attendee Registration QR Code & Entrance Sign Hub */}
      <div className="bg-[#1c1c1b] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-5">
          {/* QR Thumbnail */}
          <div 
            onClick={() => setIsQrModalOpen(true)}
            className="cursor-pointer group relative p-2.5 bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 shrink-0"
            title="Click to expand Registration QR Code & Print Sign"
          >
            {miniQrUrl ? (
              <img src={miniQrUrl} alt="Registration QR Preview" className="w-20 h-20 object-contain rounded-lg" />
            ) : (
              <div className="w-20 h-20 bg-slate-200 animate-pulse rounded-lg" />
            )}
            <div className="absolute inset-0 bg-[#141413]/85 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#FCF8B3] text-[10px] font-bold">
              Expand
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#E0C97E]/15 text-[#FCF8B3] border border-[#E0C97E]/30">
                Attendee Self-Registration Active
              </span>
              <span className="text-xs text-white/50">• Mobile Optical Scan Ready</span>
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-white">
              Where Attendees Register: Scannable QR Code & Public Link
            </h3>
            <p className="text-xs text-white/60 mt-1 max-w-xl leading-relaxed">
              Delegates can scan this QR code with their mobile cameras or click the link to submit their details, upload a photo, and receive their instant digital ticket badge.
            </p>
            <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-[#FB9378]">
              <span className="text-white/40 font-sans">Public URL:</span>
              <span className="bg-[#141413] px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-[260px] sm:max-w-md text-white/80">
                {registrationLink}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold text-xs shadow-lg shadow-[#FB9378]/20 transition-all hover:opacity-95"
          >
            <Printer className="w-4 h-4 text-black" />
            <span>Print Entrance Sign / Flyer</span>
          </button>

          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#252523] hover:bg-[#2e2e2b] text-white font-semibold text-xs border border-white/15 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E0C97E]" />
            <span>Test Registration Page</span>
          </a>
        </div>
      </div>

      {/* Headline KPI Metric Cards (FR-4.1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Registered */}
        <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl hover:border-[#E0C97E]/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-semibold">Total Registered</span>
            <div className="w-8 h-8 rounded-xl bg-[#E0C97E]/10 flex items-center justify-center text-[#E0C97E]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">{totalRegistered}</span>
            <span className="text-xs text-white/40">/ {event?.capacity || 500} cap</span>
          </div>
          <div className="w-full bg-[#141413] h-1.5 rounded-full mt-3 overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-[#AB6088] to-[#E0C97E] h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (totalRegistered / (event?.capacity || 500)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Attended (Checked In) */}
        <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl hover:border-[#FB9378]/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-semibold">Checked In (Attended)</span>
            <div className="w-8 h-8 rounded-xl bg-[#FB9378]/10 flex items-center justify-center text-[#FB9378]">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FB9378]">{attendedCount}</span>
            <span className="text-xs text-[#FB9378]/80 font-medium">on-site</span>
          </div>
          <p className="text-[11px] text-white/50 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Badges printed & verified
          </p>
        </div>

        {/* Did Not Attend (No-Show) */}
        <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl hover:border-[#FCF8B3]/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-semibold">Pending / No-Show</span>
            <div className="w-8 h-8 rounded-xl bg-[#FCF8B3]/10 flex items-center justify-center text-[#FCF8B3]">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FCF8B3]">{noShowCount}</span>
            <span className="text-xs text-white/40">awaiting</span>
          </div>
          <p className="text-[11px] text-white/50 mt-2">
            Registered but not checked in yet
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl hover:border-[#AB6088]/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-semibold">Attendance Rate</span>
            <div className="w-8 h-8 rounded-xl bg-[#AB6088]/10 flex items-center justify-center text-[#AB6088]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">{attendanceRate}%</span>
            <span className="text-xs text-[#AB6088] font-medium">turnout</span>
          </div>
          <div className="w-full bg-[#141413] h-1.5 rounded-full mt-3 overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] h-full rounded-full transition-all duration-500" 
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

      </div>

      {/* Tabs: Overview & Charts | Registrants Directory | Broadcast & Comms */}
      <div className="flex border-b border-white/10 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-[#FB9378] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#FB9378]' : 'text-white/40'}`} />
          <span>Analytics & Trends (FR-4.2 - FR-4.4)</span>
        </button>
        <button
          onClick={() => setActiveTab('attendees')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'attendees'
              ? 'border-[#FB9378] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'attendees' ? 'text-[#FB9378]' : 'text-white/40'}`} />
          <span>Attendee Directory & Badges ({eventRegistrations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('communication')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'communication'
              ? 'border-[#FB9378] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Mail className={`w-4 h-4 ${activeTab === 'communication' ? 'text-[#FB9378]' : 'text-white/40'}`} />
          <span>Communication & Surveys (FR-6)</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Check-in Activity by Hour (FR-4.3) */}
          <div className="bg-[#1c1c1b] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FB9378]" /> Check-in Activity by Hour (Live Counter)
                </h3>
                <p className="text-xs text-white/50">Peak arrival distribution on event day</p>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E0C97E]/15 text-[#FCF8B3] border border-[#E0C97E]/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Sync
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {hourlyActivity.map((slot, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">{slot.hour} ({slot.label})</span>
                    <span className="font-bold text-[#FCF8B3]">{slot.count} check-ins</span>
                  </div>
                  <div className="w-full bg-[#141413] h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] h-full rounded-full transition-all duration-500"
                      style={{ width: `${slot.count > 0 ? (slot.count / 5) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#141413] rounded-xl p-3 text-xs text-white/50 border border-white/10 flex items-center justify-between">
              <span>Avg. Check-in Processing Speed:</span>
              <span className="text-[#FCF8B3] font-bold">0.85 sec (Sub-second target achieved)</span>
            </div>
          </div>

          {/* Attendee Category Breakdown (FR-4.4) */}
          <div className="bg-[#1c1c1b] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#E0C97E]" /> Delegate Category Breakdown
                </h3>
                <p className="text-xs text-white/50">Distribution across passes & VIP credentials</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percent = Math.round((count / (totalRegistered || 1)) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white/80">{cat}</span>
                      <span className="text-white/50 font-medium">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-[#141413] h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-[#FB9378] to-[#E0C97E] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#141413] rounded-xl p-3 text-xs text-white/50 border border-white/10 flex items-center justify-between">
              <span>Target Capacity:</span>
              <span className="text-[#E0C97E] font-bold">{totalRegistered} of {event?.capacity || 500} seats filled</span>
            </div>
          </div>

          {/* Multi-Day Turnout Breakdown Section */}
          <div className="lg:col-span-2 bg-[#1c1c1b] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FB9378]" />
                  <span>Multi-Day Turnout & Attendance Breakdown</span>
                </h3>
                <p className="text-xs text-white/50">
                  Daily tracking for week-long summit (Full Week vs 3-Day vs Custom Passes)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E0C97E]/15 text-[#FCF8B3] border border-[#E0C97E]/30">
                5 Scheduled Days
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {eventDays.map((d) => {
                const dayPermitted = eventRegistrations.filter(r => (r.selectedDays || []).includes(d.id)).length;
                const dayCheckedIn = eventRegistrations.filter(r => (r.dailyAttendance?.[d.id]?.checkedIn || r.dailyAttendance?.[d.id]?.attended || !!r.dailyAttendance?.[d.id])).length;
                const dayRate = dayPermitted > 0 ? Math.round((dayCheckedIn / dayPermitted) * 100) : 0;

                return (
                  <div key={d.id} className="bg-[#141413] border border-white/10 rounded-xl p-3.5 space-y-2 hover:border-[#E0C97E]/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{d.label}</span>
                      <span className="text-[10px] font-mono text-[#E0C97E]">{d.date.slice(5)}</span>
                    </div>
                    <p className="text-[11px] text-white/50 truncate" title={d.name}>
                      {d.name.split(' - ')[1] || d.name}
                    </p>
                    <div className="pt-1 flex items-baseline justify-between text-xs">
                      <span className="text-[#FB9378] font-extrabold">{dayCheckedIn} checked</span>
                      <span className="text-white/40 font-medium">/ {dayPermitted} valid</span>
                    </div>
                    <div className="w-full bg-[#1c1c1b] h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] h-full rounded-full transition-all duration-500"
                        style={{ width: `${dayRate}%` }}
                      />
                    </div>
                    <div className="text-right text-[10px] font-bold text-white/40">
                      {dayRate}% Turnout
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ATTENDEE DIRECTORY & BADGES (FR-4.5) */}
      {activeTab === 'attendees' && (
        <div className="bg-[#1c1c1b] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          
          {/* Controls: Search, Filters & Export */}
          <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
            
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/40" />
              <input
                type="text"
                placeholder="Search attendee name, email, company, or ticket code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#141413] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#141413] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FB9378]"
              >
                <option value="ALL">All Categories</option>
                {event?.categories?.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#141413] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FB9378]"
              >
                <option value="ALL">All Statuses</option>
                <option value="attended">Attended (Checked-in)</option>
                <option value="registered">Registered (No-show)</option>
              </select>

              <select
                value={selectedPassType}
                onChange={(e) => setSelectedPassType(e.target.value)}
                className="bg-[#141413] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FB9378]"
              >
                <option value="ALL">All Pass Types</option>
                <option value="full_week">Full Week Pass (5 Days)</option>
                <option value="three_day">3-Day Pass (Days 1–3)</option>
                <option value="custom">Custom Day Pass</option>
              </select>

              <button
                onClick={() => handleExportCSV(filteredAttendees)}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-[#252523] hover:bg-[#2e2e2b] text-[#FCF8B3] rounded-xl text-xs font-semibold border border-white/15 transition-colors active:scale-95 shadow-sm"
                title="Export currently filtered attendees to CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#E0C97E]" />
                <span>Export CSV ({filteredAttendees.length})</span>
              </button>
            </div>

          </div>

          {/* Registrant Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-[#141413] text-white/50 uppercase text-[10px] tracking-wider border-b border-white/10 font-bold">
                <tr>
                  <th className="py-3.5 px-3">Attendee</th>
                  <th className="py-3.5 px-3">Organization & Role</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Pass & Permitted Days</th>
                  <th className="py-3.5 px-3">Ticket Code</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Check-in Details</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-white/40">
                      No registrants match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map((att) => {
                    const isAttended = att.status === 'attended';
                    return (
                      <tr key={att.id} className="hover:bg-white/[0.03] transition-colors">
                        
                        {/* Attendee Photo + Name + Email */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={att.photoUrl}
                              alt={att.name}
                              className="w-9 h-9 rounded-xl object-cover border border-white/15 shrink-0 bg-[#141413]"
                            />
                            <div>
                              <p className="font-bold text-white text-xs">{att.name}</p>
                              <p className="text-[11px] text-white/50">{att.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Organization & Job Title */}
                        <td className="py-3 px-3">
                          <p className="font-semibold text-white/90">{att.organization}</p>
                          <p className="text-[11px] text-white/50">{att.jobTitle}</p>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-[#E0C97E]/15 text-[#FCF8B3] border border-[#E0C97E]/30">
                            {att.category}
                          </span>
                        </td>

                        {/* Pass & Permitted Days */}
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded font-black text-[9px] uppercase bg-white/10 text-white border border-white/15">
                              {att.passType === 'full_week' 
                                ? 'Full Week' 
                                : att.passType === 'three_day' 
                                ? '3-Day' 
                                : `Custom (${att.selectedDays?.length || 1}D)`}
                            </span>
                            <div className="flex items-center gap-1">
                              {eventDays.map((d, idx) => {
                                const isPermitted = (att.selectedDays || []).includes(d.id);
                                const isChecked = (att.dailyAttendance?.[d.id]?.checkedIn || att.dailyAttendance?.[d.id]?.attended || !!att.dailyAttendance?.[d.id]);
                                return (
                                  <span
                                    key={d.id}
                                    className={`w-4 h-4 rounded text-[8px] font-black flex items-center justify-center border ${
                                      isPermitted
                                        ? isChecked
                                          ? 'bg-emerald-500 text-white border-emerald-400'
                                          : 'bg-[#252523] text-[#FCF8B3] border-[#E0C97E]/40'
                                        : 'bg-[#141413] text-white/20 border-white/5 line-through'
                                    }`}
                                    title={`${d.label}: ${isPermitted ? (isChecked ? 'Checked In' : 'Valid') : 'No Access'}`}
                                  >
                                    {`D${idx + 1}`}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </td>

                        {/* Ticket Code */}
                        <td className="py-3 px-3 font-mono text-[11px] text-[#FCF8B3]">
                          {att.ticketCode}
                        </td>

                        {/* Status Pill */}
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAttended 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-amber-500/15 text-[#FCF8B3] border border-amber-500/25'
                          }`}>
                            {isAttended ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Attended
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-400" /> No-Show
                              </>
                            )}
                          </span>
                        </td>

                        {/* Check-in Info */}
                        <td className="py-3 px-3 text-[11px] text-white/50">
                          {isAttended ? (
                            <div>
                              <p className="text-white font-medium">
                                {new Date(att.checkedInAt).toLocaleTimeString()}
                              </p>
                              <p className="text-[10px] text-white/40 truncate max-w-[130px]">
                                by {att.checkedInBy || 'Staff'}
                              </p>
                            </div>
                          ) : (
                            <span className="text-white/30 italic">Not checked in</span>
                          )}
                        </td>

                        {/* Action buttons: Badge Print, Certificate, Manual Check-in */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Badge Print */}
                            <button
                              onClick={() => setSelectedAttendeeForBadge(att)}
                              className="p-1.5 bg-[#252523] hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors border border-white/10"
                              title="Print / Preview Badge (FR-3.1)"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* Certificate of Attendance (available if attended) */}
                            {isAttended && (
                              <button
                                onClick={() => setSelectedAttendeeForCert(att)}
                                className="p-1.5 bg-[#252523] hover:bg-white/10 text-[#E0C97E] hover:text-[#FCF8B3] rounded-lg transition-colors border border-white/10"
                                title="Certificate of Attendance (FR-6.4)"
                              >
                                <Award className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Manual Checkin Fallback */}
                            {!isAttended && (
                              <button
                                onClick={() => onCheckInByCode(att.ticketCode, "Organizer Manual")}
                                className="px-2.5 py-1 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold rounded-lg text-[10px] transition-all hover:opacity-90 shadow-sm"
                                title="Manually Mark Attended (FR-2.2)"
                              >
                                Check In
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: COMMUNICATION & SURVEYS (FR-6) */}
      {activeTab === 'communication' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bulk Broadcast Composer (FR-6.2) */}
          <div className="lg:col-span-2 bg-[#1c1c1b] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#FB9378]" />
                <span>Segmented Message Broadcast (FR-6.2)</span>
              </h3>
              <p className="text-xs text-white/50">
                Send targeted announcements or updates to all registrants, verified attendees only, or no-shows.
              </p>
            </div>

            {broadcastSentNotice && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  Broadcast "{broadcastSentNotice.subject}" queued successfully to <strong>{broadcastSentNotice.count}</strong> {broadcastSentNotice.target.toLowerCase()} recipients!
                </span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Target Recipient Segment:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('ALL')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      broadcastTarget === 'ALL'
                        ? 'border-[#FB9378] bg-[#FB9378]/15 text-white'
                        : 'border-white/10 bg-[#141413] text-white/50 hover:bg-white/5'
                    }`}
                  >
                    All Registrants ({totalRegistered})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('ATTENDED')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      broadcastTarget === 'ATTENDED'
                        ? 'border-[#E0C97E] bg-[#E0C97E]/15 text-white'
                        : 'border-white/10 bg-[#141413] text-white/50 hover:bg-white/5'
                    }`}
                  >
                    Attended Only ({attendedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastTarget('NOSHOW')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      broadcastTarget === 'NOSHOW'
                        ? 'border-[#AB6088] bg-[#AB6088]/20 text-white'
                        : 'border-white/10 bg-[#141413] text-white/50 hover:bg-white/5'
                    }`}
                  >
                    No-Shows Only ({noShowCount})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Broadcast Subject:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session Slides Available / Post-Event Networking Details"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full bg-[#141413] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Message Content (Email & SMS Channel):
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Type announcement message to broadcast to delegates..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-[#141413] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold rounded-xl text-xs shadow-lg shadow-[#FB9378]/20 flex items-center gap-2 hover:opacity-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>Send Broadcast Notification</span>
                </button>
              </div>
            </form>
          </div>

          {/* Post-Event Survey & Certificates (FR-6.3, FR-6.4) */}
          <div className="space-y-4">
            
            {/* Feedback Survey Preview */}
            <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl space-y-3 shadow-xl">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FB9378]" />
                <span>Post-Event Feedback Survey (FR-6.3)</span>
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Automatically triggered 2 hours after event closing. Captures NPS, keynote ratings, and venue feedback.
              </p>
              <div className="bg-[#141413] rounded-xl p-3.5 border border-white/10 text-xs space-y-2">
                <p className="text-[#FCF8B3] font-semibold">Survey Status: Ready for dispatch</p>
                <div className="flex items-center justify-between text-white/50 text-[11px]">
                  <span>Survey Link:</span>
                  <span className="font-mono text-[#FB9378]">eventplan.app/s/{tenant?.slug}</span>
                </div>
              </div>
            </div>

            {/* Batch Certificate Generation */}
            <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl space-y-3 shadow-xl">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#E0C97E]" />
                <span>Certificates of Attendance (FR-6.4)</span>
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                High-resolution verifiable credentials for the <strong>{attendedCount}</strong> verified attendees.
              </p>
              <button
                onClick={() => {
                  const firstAttended = eventRegistrations.find(r => r.status === 'attended');
                  if (firstAttended) {
                    setSelectedAttendeeForCert(firstAttended);
                  } else {
                    alert("No attendees have checked in yet.");
                  }
                }}
                className="w-full py-2.5 bg-[#252523] hover:bg-[#2e2e2b] text-[#FCF8B3] font-bold rounded-xl text-xs border border-[#E0C97E]/30 transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-[#E0C97E]" /> Preview First Certificate
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Common Modals */}
      <BadgeModal
        isOpen={!!selectedAttendeeForBadge}
        onClose={() => setSelectedAttendeeForBadge(null)}
        attendee={selectedAttendeeForBadge}
        tenant={tenant}
        event={event}
        onReprint={onReprintBadge}
        staffUser="Organizer Admin"
      />

      <CertificateModal
        isOpen={!!selectedAttendeeForCert}
        onClose={() => setSelectedAttendeeForCert(null)}
        attendee={selectedAttendeeForCert}
        event={event}
        tenant={tenant}
      />

      <RegistrationQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        tenant={tenant}
        event={event}
        registrationLink={registrationLink}
      />

    </div>
  );
}
