import React, { useState, useEffect } from 'react';
import TenantLogo from '../Common/TenantLogo';
import { DonutChart, BarGraph } from '../Common/Charts';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
  Download,
  Search,
  Printer,
  Award,
  Send,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Mail,
  BarChart3,
  Copy,
  QrCode,
  Check,
  ShieldCheck,
  Palette,
  ExternalLink,
  Bell,
  Clock,
  Star,
  ArrowUpCircle,
  Paperclip,
  X,
  FileText,
  Loader2,
} from 'lucide-react';
import { exportAttendeesToCSV } from '../../utils/export';
import { generateQrDataUrl } from '../../utils/qr';
import BadgeModal from '../Common/BadgeModal';
import CertificateModal from '../Common/CertificateModal';
import AttachmentList, { ATTACHMENT_ACCEPT, formatFileSize } from '../Common/AttachmentList';
import RegistrationQrModal from './RegistrationQrModal';
import AuditTrailPanel from './AuditTrailPanel';
import WorkspaceBrandingSettings from './WorkspaceBrandingSettings';
import { DEFAULT_EVENT_DAYS } from '../../data/mockData';
import { Storage } from '../../data/storage';

export default function OrganizerDashboard({
  tenant,
  event,
  registrations = [],
  auditLogs = [],
  reminders = [],
  broadcasts = [],
  feedbackList = [],
  onCheckInByCode,
  onReprintBadge,
  onRefresh,
  initialTab = 'overview',
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAttendeeForBadge, setSelectedAttendeeForBadge] = useState(null);
  const [selectedAttendeeForCert, setSelectedAttendeeForCert] = useState(null);

  const [broadcastTarget, setBroadcastTarget] = useState('ALL');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAttachments, setBroadcastAttachments] = useState([]);
  const [broadcastUploading, setBroadcastUploading] = useState(false);
  const [broadcastPinToChat, setBroadcastPinToChat] = useState(true);
  const [broadcastBusy, setBroadcastBusy] = useState(false);
  const [broadcastSentNotice, setBroadcastSentNotice] = useState(null);
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [reminderDraft, setReminderDraft] = useState({ subject: '', message: '', attachments: [] });
  const [reminderUploading, setReminderUploading] = useState(false);
  const [reminderBusyId, setReminderBusyId] = useState(null);

  const [exportNotice, setExportNotice] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [miniQrUrl, setMiniQrUrl] = useState(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const eventDays = event?.eventDays || DEFAULT_EVENT_DAYS;
  const eventRegistrations = registrations.filter((r) => r.eventId === event?.id);
  const tenantAuditLogs = auditLogs.filter((l) => l.tenantId === tenant?.id);
  const eventReminders = reminders.filter((r) => r.eventId === event?.id);
  const eventBroadcasts = broadcasts.filter((b) => b.eventId === event?.id);
  const eventFeedback = feedbackList.filter((f) => f.eventId === event?.id);
  const avgRating = eventFeedback.length > 0
    ? (eventFeedback.reduce((sum, f) => sum + Number(f.rating || 0), 0) / eventFeedback.length).toFixed(1)
    : null;

  const totalRegistered = eventRegistrations.length;
  const waitlistedCount = eventRegistrations.filter((r) => r.status === 'waitlisted').length;
  const attendedCount = eventRegistrations.filter((r) => r.status === 'attended').length;
  const noShowCount = Math.max(0, totalRegistered - attendedCount - waitlistedCount);
  const attendanceRate = totalRegistered > 0 ? Math.round((attendedCount / totalRegistered) * 100) : 0;

  const dedicatedSiteLink = `${window.location.origin}/#/${tenant?.slug}`;
  const registrationLink = `${window.location.origin}/#/${tenant?.slug}/register`;

  useEffect(() => {
    if (registrationLink) {
      generateQrDataUrl(registrationLink, {
        width: 140,
        margin: 1,
        darkColor: '#1a1d1a',
        lightColor: '#ffffff'
      }).then((url) => setMiniQrUrl(url));
    }
  }, [registrationLink]);

  const categoryCounts = eventRegistrations.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryCounts).map(([cat, count], idx) => {
    const colors = ['#5A6552', '#3B7A57', '#7D8F69', '#9CAF88', '#46503F'];
    return { label: cat, value: count, color: colors[idx % colors.length] };
  });

  const turnoutChartData = [
    { label: 'Checked In', value: attendedCount, color: '#3B7A57' },
    { label: 'Awaiting Check-In', value: noShowCount, color: '#9CAF88' },
    { label: 'Open Capacity', value: Math.max(0, (event?.capacity || 500) - totalRegistered), color: '#DCE7D0' },
  ];

  const dayBarData = eventDays.map((d) => ({
    label: d.label.split(' ')[0] + ' ' + (d.label.split(' ')[1] || ''),
    value: eventRegistrations.filter((r) => Boolean(r.dailyAttendance?.[d.id])).length,
    unit: 'checked in',
  }));

  const filteredAttendees = eventRegistrations.filter((r) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q ||
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.organization || '').toLowerCase().includes(q) ||
      r.ticketCode.toLowerCase().includes(q);
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportCSV = (list = eventRegistrations) => {
    if (!list.length) return;
    exportAttendeesToCSV(list, event?.title || tenant?.name || 'Attendees');
    Storage.addAuditLog({
      tenantId: tenant?.id,
      user: tenant?.organizer?.name || 'Organizer',
      role: 'organizer',
      action: 'ATTENDEES_EXPORTED_CSV',
      severity: 'info',
      target: `Exported ${list.length} attendee record(s) to CSV`,
    });
    onRefresh?.();
    setExportNotice(`Exported ${list.length} attendee records to CSV.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleBroadcastFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setBroadcastUploading(true);
    try {
      const remaining = Math.max(0, 6 - broadcastAttachments.length);
      const uploaded = [];
      for (const file of files.slice(0, remaining)) {
        const att = await Storage.uploadFileAsync(file);
        uploaded.push(att);
      }
      setBroadcastAttachments((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setBroadcastSentNotice(err.message || 'Failed to upload attachment.');
    } finally {
      setBroadcastUploading(false);
    }
  };

  const handleReminderFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setReminderUploading(true);
    try {
      const current = reminderDraft.attachments || [];
      const remaining = Math.max(0, 6 - current.length);
      const uploaded = [];
      for (const file of files.slice(0, remaining)) {
        const att = await Storage.uploadFileAsync(file);
        uploaded.push(att);
      }
      setReminderDraft((d) => ({ ...d, attachments: [...(d.attachments || []), ...uploaded] }));
    } catch (err) {
      setBroadcastSentNotice(err.message || 'Failed to upload reminder attachment.');
    } finally {
      setReminderUploading(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim() || broadcastBusy || broadcastUploading) return;
    setBroadcastBusy(true);
    try {
      const record = await Storage.sendBroadcastAsync({
        tenantId: tenant?.id,
        eventId: event?.id,
        target: broadcastTarget,
        subject: broadcastSubject.trim(),
        message: broadcastMessage.trim(),
        attachments: broadcastAttachments,
        channels: ['in_app', 'email', 'sms'],
        senderName: tenant?.organizer?.name || 'Organizer',
        pinToChat: broadcastPinToChat,
      });
      onRefresh?.();
      setBroadcastSentNotice(
        `Broadcast "${record.subject}" dispatched to ${record.recipientCount} delegate(s)${
          broadcastAttachments.length ? ` with ${broadcastAttachments.length} attachment(s)` : ''
        } and pinned to live Event Chat.`
      );
      setBroadcastSubject('');
      setBroadcastMessage('');
      setBroadcastAttachments([]);
      setTimeout(() => setBroadcastSentNotice(null), 6000);
    } catch (err) {
      setBroadcastSentNotice(err.message || 'Failed to send broadcast.');
    } finally {
      setBroadcastBusy(false);
    }
  };

  const handleToggleReminder = async (rem) => {
    setReminderBusyId(rem.id);
    try {
      await Storage.updateReminderAsync(rem.id, { enabled: !rem.enabled });
      onRefresh?.();
    } finally {
      setReminderBusyId(null);
    }
  };

  const handleSaveReminderEdit = async (remId) => {
    setReminderBusyId(remId);
    try {
      await Storage.updateReminderAsync(remId, {
        subject: reminderDraft.subject,
        message: reminderDraft.message,
        attachments: reminderDraft.attachments || [],
      });
      setEditingReminderId(null);
      onRefresh?.();
    } finally {
      setReminderBusyId(null);
    }
  };

  const handleSendReminderNow = async (rem) => {
    setReminderBusyId(rem.id);
    try {
      const res = await Storage.sendReminderNowAsync(rem.id, tenant?.organizer?.name || 'Organizer');
      onRefresh?.();
      setBroadcastSentNotice(`Reminder "${rem.label}" sent now to ${res.broadcast?.recipientCount || 0} delegate(s) and pinned in Event Chat.`);
      setTimeout(() => setBroadcastSentNotice(null), 6000);
    } catch (err) {
      setBroadcastSentNotice(err.message || 'Failed to dispatch reminder.');
    } finally {
      setReminderBusyId(null);
    }
  };

  const handlePromoteWaitlist = async (att) => {
    try {
      await Storage.promoteWaitlistedAsync(att.id, tenant?.organizer?.name || 'Organizer');
      onRefresh?.();
    } catch (err) {
      alert(err.message || 'Failed to promote delegate');
    }
  };

  return (
    <div className="space-y-6">
      {exportNotice && (
        <div className="p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between" style={{ background: 'var(--fp-sage)', borderColor: 'var(--fp-olive)', color: 'var(--fp-sage-text)' }}>
          <span className="inline-flex items-center gap-2 font-semibold"><CheckCircle2 className="w-4 h-4" /> {exportNotice}</span>
          <button type="button" onClick={() => setExportNotice(null)} className="text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Event Header Card */}
      <div className="fp-card p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <TenantLogo tenant={tenant} size={52} className="rounded-xl shrink-0" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="fp-tag-sage text-[11px]">Organizer Console</span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>/{tenant?.slug}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold m-0 leading-tight">{event?.title}</h1>
            <p className="text-xs sm:text-sm mt-1 m-0 flex flex-wrap items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{event?.venue} · {new Date(event?.startsAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button type="button" onClick={() => setIsQrModalOpen(true)} className="btn-fp-olive px-3.5 py-2 text-xs inline-flex items-center gap-1.5">
            <QrCode className="w-4 h-4" />
            <span>Registration QR</span>
          </button>
          <button type="button" onClick={handleCopyLink} className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center gap-1.5">
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied!' : 'Copy Reg URL'}</span>
          </button>
          <button type="button" onClick={() => handleExportCSV(eventRegistrations)} className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Dedicated Event Website Share Hub */}
      <div className="fp-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
          <div onClick={() => setIsQrModalOpen(true)} className="p-2 bg-white rounded-xl border cursor-pointer shrink-0" style={{ borderColor: 'var(--border-color)' }}>
            {miniQrUrl ? <img src={miniQrUrl} alt="Event QR" className="w-16 h-16" /> : <div className="w-16 h-16 bg-slate-100 rounded" />}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm">Dedicated Event Website &amp; Attendee Self-Registration</div>
            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Share your event portal link or QR flyer so attendees can register and sign in to view their tickets.
            </p>
            <code className="text-[11px] block truncate mt-1 font-mono" style={{ color: 'var(--fp-olive)' }}>{dedicatedSiteLink}</code>
          </div>
        </div>
        <a
          href={registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fp-sage px-4 py-2 text-xs inline-flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Public Form</span>
        </a>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="fp-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            <span>Total Registered</span>
            <Users className="w-4 h-4" style={{ color: 'var(--fp-olive)' }} />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold mt-2">{totalRegistered} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/ {event?.capacity || 500}</span></div>
        </div>
        <div className="fp-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            <span>Checked In</span>
            <UserCheck className="w-4 h-4" style={{ color: 'var(--fp-green)' }} />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold mt-2" style={{ color: 'var(--fp-green)' }}>{attendedCount}</div>
        </div>
        <div className="fp-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            <span>Awaiting Arrival</span>
            <UserX className="w-4 h-4" style={{ color: 'var(--fp-olive)' }} />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold mt-2">{noShowCount}</div>
        </div>
        <div className="fp-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            <span>Turnout Rate</span>
            <Percent className="w-4 h-4" style={{ color: 'var(--fp-olive)' }} />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold mt-2">{attendanceRate}%</div>
        </div>
      </div>

      {/* FinPlanner Horizontal Sub-Navigation Pills (Scrollable on Phones!) */}
      <div className="fp-subnav">
        {[
          { id: 'overview', label: 'Analytics & Turnout', icon: BarChart3 },
          { id: 'attendees', label: `Attendees & Badges (${eventRegistrations.length})`, icon: Users },
          { id: 'audit', label: `Audit Trail (${tenantAuditLogs.length})`, icon: ShieldCheck },
          { id: 'communication', label: 'Broadcast & Comms', icon: Mail },
          { id: 'branding', label: 'Branding & Settings', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`fp-subnav-pill ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="fp-card p-5 space-y-4">
              <h3 className="text-base font-bold m-0">Delegate Category Breakdown</h3>
              <DonutChart data={categoryChartData} title="Categories" centerLabel="Delegates" />
            </div>
            <div className="fp-card p-5 space-y-4">
              <h3 className="text-base font-bold m-0">Attendance &amp; Capacity Ratio</h3>
              <DonutChart data={turnoutChartData} title="Turnout" centerLabel="Capacity" />
            </div>
          </div>

          <div className="fp-card p-5 space-y-4">
            <h3 className="text-base font-bold m-0">Daily Check-In Turnout Across Event Days</h3>
            <BarGraph data={dayBarData} height={150} />
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDEE DIRECTORY */}
      {activeTab === 'attendees' && (
        <div className="fp-card p-4 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search attendee name, email, company, or ticket code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="fp-input w-full pl-9 pr-3 py-2 text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="fp-input px-3 py-2 text-xs">
                <option value="ALL">All Categories</option>
                {(event?.categories || []).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="fp-input px-3 py-2 text-xs">
                <option value="ALL">All Statuses</option>
                <option value="attended">Checked In</option>
                <option value="registered">Registered</option>
              </select>
              <button type="button" onClick={() => handleExportCSV(filteredAttendees)} className="btn-fp-outline px-3 py-2 text-xs inline-flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV ({filteredAttendees.length})</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
            <table className="fp-table">
              <thead>
                <tr>
                  <th>Attendee</th>
                  <th>Organization</th>
                  <th>Category</th>
                  <th>Ticket Code</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                      No registrants match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map((att) => (
                    <tr key={att.id}>
                      <td>
                        <div className="flex items-center gap-2.5 min-w-[180px]">
                          {att.photoUrl ? (
                            <img src={att.photoUrl} alt={att.name} className="w-9 h-9 rounded-lg object-cover shrink-0 border" style={{ borderColor: 'var(--border-color)' }} />
                          ) : (
                            <div className="w-9 h-9 rounded-lg shrink-0 border flex items-center justify-center font-bold text-xs" style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)', borderColor: 'var(--border-color)' }}>
                              {(att.name || 'DE').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-xs sm:text-sm truncate">{att.name}</div>
                            <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{att.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs sm:text-sm">
                        <div className="font-medium">{att.organization}</div>
                        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{att.jobTitle}</div>
                      </td>
                      <td>
                        <span className="fp-tag-sage text-[11px]">{att.category}</span>
                      </td>
                      <td className="font-mono font-bold text-xs whitespace-nowrap">{att.ticketCode}</td>
                      <td>
                        {att.status === 'attended' ? (
                          <span className="fp-tag-olive text-[11px]">Attended</span>
                        ) : att.status === 'waitlisted' ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(217,119,6,0.15)', color: 'var(--fp-amber)' }}>
                            Waitlist #{att.waitlistPosition || '?'}
                          </span>
                        ) : (
                          <span className="fp-tag-sage text-[11px]">Registered</span>
                        )}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {att.status === 'waitlisted' && (
                            <button
                              type="button"
                              onClick={() => handlePromoteWaitlist(att)}
                              className="btn-fp-outline px-2.5 py-1 text-[11px] inline-flex items-center gap-1"
                              title="Promote from Waitlist"
                            >
                              <ArrowUpCircle className="w-3.5 h-3.5" />
                              <span>Promote</span>
                            </button>
                          )}
                          {att.status !== 'attended' && att.status !== 'waitlisted' && (
                            <button
                              type="button"
                              onClick={() => onCheckInByCode(att.ticketCode, tenant?.organizer?.name || 'Organizer', false, 'day-1', 'Day 1', { eventId: event?.id, tenantId: tenant?.id })}
                              className="btn-fp-olive px-2.5 py-1 text-[11px]"
                            >
                              Check In
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedAttendeeForBadge(att)}
                            className="btn-fp-sage px-2.5 py-1 text-[11px] inline-flex items-center gap-1"
                            title="Print 3.1in Badge"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>3.1&quot; Tag</span>
                          </button>
                          {att.status === 'attended' && (
                            <button
                              type="button"
                              onClick={() => setSelectedAttendeeForCert(att)}
                              className="btn-fp-outline p-1.5"
                              title="Certificate of Attendance"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <AuditTrailPanel
          logs={tenantAuditLogs}
          title={`${tenant?.shortName || tenant?.name} Audit Trail`}
          tenantName={tenant?.name || 'Event'}
        />
      )}

      {/* TAB 4: AUTOMATED REMINDERS & BULK BROADCAST */}
      {activeTab === 'communication' && (
        <div className="space-y-6">
          {broadcastSentNotice && (
            <div className="p-3.5 rounded-xl border text-xs sm:text-sm font-semibold" style={{ background: 'var(--fp-sage)', borderColor: 'var(--fp-olive)', color: 'var(--fp-sage-text)' }}>
              {broadcastSentNotice}
            </div>
          )}

          {/* Automated Event Reminders (7 Days Before, 1 Day Before, Event Day) */}
          <div className="fp-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold m-0 flex items-center gap-2">
                  <Bell className="w-5 h-5" style={{ color: 'var(--fp-olive)' }} />
                  <span>Automated Event Reminders (Server Scheduled)</span>
                </h3>
                <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
                  Automatically sends bulk reminders 1 week before, 1 day before, and on the morning of {event?.title}. Runs continuously on the server and pins announcements into Event Chat.
                </p>
              </div>
              <span className="fp-tag-sage text-[11px]">Auto-Scheduler Active</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {eventReminders.map((rem) => {
                const isEditing = editingReminderId === rem.id;
                const triggerDate = event?.startsAt
                  ? new Date(new Date(event.startsAt).getTime() - rem.offsetDays * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Scheduled';
                return (
                  <div key={rem.id} className="p-4 rounded-xl border flex flex-col justify-between gap-3" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="fp-tag-olive text-[11px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rem.label}
                        </span>
                        <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(rem.enabled)}
                            disabled={reminderBusyId === rem.id}
                            onChange={() => handleToggleReminder(rem)}
                            className="accent-[#5A6552]"
                          />
                          <span>{rem.enabled ? 'On' : 'Off'}</span>
                        </label>
                      </div>

                      <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        Trigger: {triggerDate} · {rem.sentAt ? `Sent (${rem.lastRecipientsCount} delegates)` : 'Pending'}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <input
                            value={reminderDraft.subject}
                            onChange={(e) => setReminderDraft((d) => ({ ...d, subject: e.target.value }))}
                            className="fp-input w-full px-2.5 py-1.5 text-xs font-bold"
                          />
                          <textarea
                            rows={3}
                            value={reminderDraft.message}
                            onChange={(e) => setReminderDraft((d) => ({ ...d, message: e.target.value }))}
                            className="fp-input w-full px-2.5 py-1.5 text-xs"
                          />
                          <div className="space-y-1.5">
                            <label className="btn-fp-outline px-2.5 py-1.5 text-[11px] inline-flex items-center gap-1.5 cursor-pointer">
                              {reminderUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                              <span>{reminderUploading ? 'Uploading...' : 'Attach Flyer / PDF'}</span>
                              <input
                                type="file"
                                multiple
                                accept={ATTACHMENT_ACCEPT}
                                onChange={handleReminderFileUpload}
                                disabled={reminderUploading}
                                className="hidden"
                              />
                            </label>
                            {(reminderDraft.attachments || []).length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {reminderDraft.attachments.map((att) => (
                                  <span
                                    key={att.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] max-w-full"
                                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                                  >
                                    <FileText className="w-3 h-3 shrink-0" style={{ color: 'var(--fp-olive)' }} />
                                    <span className="truncate max-w-[140px]">{att.name}</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setReminderDraft((d) => ({
                                          ...d,
                                          attachments: (d.attachments || []).filter((a) => a.id !== att.id),
                                        }))
                                      }
                                      className="p-0 bg-transparent border-0 cursor-pointer"
                                      style={{ color: 'var(--text-muted)' }}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button type="button" disabled={reminderUploading} onClick={() => handleSaveReminderEdit(rem.id)} className="btn-fp-olive px-3 py-1.5 text-xs">Save</button>
                            <button type="button" onClick={() => setEditingReminderId(null)} className="btn-fp-outline px-3 py-1.5 text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-bold text-xs sm:text-sm leading-snug">{rem.subject}</div>
                          <p className="text-xs m-0 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{rem.message}</p>
                          <AttachmentList attachments={rem.attachments} compact />
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReminderId(rem.id);
                            setReminderDraft({
                              subject: rem.subject,
                              message: rem.message,
                              attachments: Array.isArray(rem.attachments) ? rem.attachments : [],
                            });
                          }}
                          className="btn-fp-outline flex-1 py-1.5 text-xs"
                        >
                          Edit Text
                        </button>
                        <button
                          type="button"
                          disabled={reminderBusyId === rem.id}
                          onClick={() => handleSendReminderNow(rem)}
                          className="btn-fp-olive flex-1 py-1.5 text-xs inline-flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>{reminderBusyId === rem.id ? 'Sending...' : 'Send Now'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Manual Bulk Broadcast */}
            <div className="lg:col-span-7 fp-card p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold m-0">Send Instant Bulk Broadcast</h3>
                <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
                  Dispatch custom announcements, room changes, or post-event survey links to filtered registrants.
                </p>
              </div>
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Audience Segment</label>
                  <select value={broadcastTarget} onChange={(e) => setBroadcastTarget(e.target.value)} className="fp-input w-full px-3 py-2.5 text-sm">
                    <option value="ALL">All Registrants ({totalRegistered})</option>
                    <option value="ATTENDED">Checked-In Attendees Only ({attendedCount})</option>
                    <option value="NOSHOW">Pending / Not Checked In ({noShowCount})</option>
                    {waitlistedCount > 0 && <option value="WAITLIST">Waitlisted Delegates ({waitlistedCount})</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Subject *</label>
                  <input required value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} placeholder="e.g. Opening Keynote Starts at 9:30 AM" className="fp-input w-full px-3.5 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Message *</label>
                  <textarea required rows={4} value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} placeholder="Write announcement..." className="fp-input w-full px-3.5 py-2.5 text-sm" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-semibold m-0">Attachments (Flyers, PDF Agendas, Slides, Images)</label>
                    <label className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5 cursor-pointer">
                      {broadcastUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                      <span>{broadcastUploading ? 'Uploading...' : 'Attach Files'}</span>
                      <input
                        type="file"
                        multiple
                        accept={ATTACHMENT_ACCEPT}
                        onChange={handleBroadcastFileUpload}
                        disabled={broadcastUploading || broadcastAttachments.length >= 6}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {broadcastAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {broadcastAttachments.map((att) => (
                        <div
                          key={att.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs max-w-[260px]"
                          style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                        >
                          {att.isImage ? (
                            <img src={att.url} alt={att.name} className="w-5 h-5 rounded object-cover shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fp-olive)' }} />
                          )}
                          <span className="truncate font-medium">{att.name}</span>
                          <span className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                            {formatFileSize(att.size)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setBroadcastAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                            className="p-0.5 bg-transparent border-0 cursor-pointer shrink-0"
                            style={{ color: 'var(--text-muted)' }}
                            title="Remove file"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={broadcastPinToChat} onChange={(e) => setBroadcastPinToChat(e.target.checked)} className="accent-[#5A6552]" />
                  <span>Also pin announcement inside live Event Chat</span>
                </label>
                <button type="submit" disabled={broadcastBusy || broadcastUploading} className="btn-fp-olive px-5 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-50">
                  <Send className="w-4 h-4" /> {broadcastBusy ? 'Sending...' : 'Send Bulk Broadcast'}
                </button>
              </form>
            </div>

            {/* Delivery Log & Feedback Summary */}
            <div className="lg:col-span-5 space-y-5">
              <div className="fp-card p-5 space-y-3">
                <h3 className="text-sm sm:text-base font-bold m-0">Bulk Delivery History ({eventBroadcasts.length})</h3>
                {eventBroadcasts.length === 0 ? (
                  <p className="text-xs m-0" style={{ color: 'var(--text-muted)' }}>
                    No broadcasts or reminders dispatched yet. Click &quot;Send Now&quot; on any reminder or send a custom broadcast.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {eventBroadcasts.map((b) => (
                      <div key={b.id} className="p-3 rounded-xl border text-xs space-y-1" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold truncate">{b.subject}</span>
                          <span className="fp-tag-sage text-[10px] shrink-0">{b.recipientCount} sent</span>
                        </div>
                        <p className="m-0 text-[11px]" style={{ color: 'var(--text-muted)' }}>{b.message}</p>
                        <AttachmentList attachments={b.attachments} compact />
                        <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {new Date(b.sentAt).toLocaleString()} · {b.target}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="fp-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold m-0 flex items-center gap-1.5">
                    <Star className="w-4 h-4" style={{ color: 'var(--fp-amber)' }} />
                    <span>Post-Event Feedback</span>
                  </h3>
                  {avgRating && <span className="fp-tag-olive text-xs">{avgRating} / 5.0 ({eventFeedback.length})</span>}
                </div>
                {eventFeedback.length === 0 ? (
                  <p className="text-xs m-0" style={{ color: 'var(--text-muted)' }}>
                    Checked-in attendees can submit star ratings and comments from their Ticket Portal.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {eventFeedback.map((fb) => (
                      <div key={fb.id} className="p-3 rounded-xl border text-xs space-y-1" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center justify-between">
                          <strong className="truncate">{fb.attendeeName}</strong>
                          <span className="font-bold" style={{ color: 'var(--fp-amber)' }}>{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                        </div>
                        {fb.comment && <p className="m-0 text-[11px]" style={{ color: 'var(--text-muted)' }}>{fb.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BRANDING & SETTINGS */}
      {activeTab === 'branding' && (
        <WorkspaceBrandingSettings tenant={tenant} event={event} onUpdated={onRefresh} />
      )}

      <BadgeModal
        isOpen={!!selectedAttendeeForBadge}
        onClose={() => setSelectedAttendeeForBadge(null)}
        attendee={selectedAttendeeForBadge}
        tenant={tenant}
        event={event}
        onReprint={onReprintBadge}
        staffUser={tenant?.organizer?.name || 'Organizer'}
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
