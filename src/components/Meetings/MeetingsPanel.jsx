import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Copy,
  Download,
  ExternalLink,
  MapPin,
  PenTool,
  PlusCircle,
  Printer,
  QrCode,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { Storage } from '../../data/storage';
import { generateQrDataUrl } from '../../utils/qr';
import { printElementCleanly } from '../../utils/print';

/**
 * Parses CSV or newline-separated attendee lists:
 * Format per line: Name, Department, Role, Email, Phone
 * (Works cleanly even if only Name is provided per line!)
 */
function parseRosterText(raw) {
  return String(raw || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^name\s*[,;]/i.test(line))
    .map((line) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim().replace(/^["']|["']$/g, ''));
      return {
        name: parts[0] || '',
        department: parts[1] || '',
        role: parts[2] || '',
        email: parts[3] || '',
        phone: parts[4] || '',
      };
    })
    .filter((r) => r.name);
}

export default function MeetingsPanel({
  tenant,
  meetings = [],
  onOpenMeetingSignIn,
  onRefresh,
  isOrganizer = false,
}) {
  const tenantMeetings = useMemo(
    () => meetings.filter((m) => m.tenantId === tenant?.id),
    [meetings, tenant?.id]
  );

  const [selectedMeetingId, setSelectedMeetingId] = useState(tenantMeetings[0]?.id || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddRoster, setShowAddRoster] = useState(false);

  // Create Meeting form
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00');
  const [venue, setVenue] = useState('Main Boardroom');
  const [host, setHost] = useState(tenant?.organizer?.name || 'Chairperson');
  const [mode, setMode] = useState('hybrid'); // 'roster' | 'open' | 'hybrid'
  const [rosterText, setRosterText] = useState('');
  const [appendRosterText, setAppendRosterText] = useState('');

  const [meetingQrUrl, setMeetingQrUrl] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const selectedMeeting =
    tenantMeetings.find((m) => m.id === selectedMeetingId) || tenantMeetings[0] || null;

  const meetingSignInUrl = selectedMeeting
    ? `${window.location.origin}/#/${tenant?.slug}/meeting/${selectedMeeting.id}`
    : '';

  useEffect(() => {
    if (!meetingSignInUrl) {
      setMeetingQrUrl(null);
      return;
    }
    generateQrDataUrl(meetingSignInUrl, {
      width: 240,
      margin: 1,
      darkColor: '#1a1d1a',
      lightColor: '#ffffff',
    }).then((url) => setMeetingQrUrl(url));
  }, [meetingSignInUrl]);

  const handleCsvFile = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(String(ev.target.result || ''));
    reader.readAsText(file);
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const roster = mode === 'open' ? [] : parseRosterText(rosterText);
      const created = await Storage.createMeetingAsync({
        tenantId: tenant.id,
        title: title.trim(),
        date,
        time,
        venue: venue.trim() || 'Conference Room',
        host: host.trim() || tenant?.organizer?.name || 'Chair',
        mode,
        roster,
      });
      setSelectedMeetingId(created.id);
      setTitle('');
      setRosterText('');
      setShowCreateForm(false);
      setNotice(`Meeting "${created.title}" created with ${roster.length} pre-loaded attendee(s).`);
      onRefresh?.();
      setTimeout(() => setNotice(''), 5000);
    } catch (err) {
      alert(err.message || 'Could not create meeting');
    } finally {
      setBusy(false);
    }
  };

  const handleAppendRoster = async (e) => {
    e.preventDefault();
    if (!selectedMeeting || !appendRosterText.trim() || busy) return;
    setBusy(true);
    try {
      const roster = parseRosterText(appendRosterText);
      if (roster.length === 0) {
        alert('No valid names found. Enter one name per line.');
        return;
      }
      const res = await Storage.uploadMeetingRosterAsync(
        selectedMeeting.id,
        roster,
        tenant?.organizer?.name || 'Organizer'
      );
      setAppendRosterText('');
      setShowAddRoster(false);
      setNotice(`Uploaded ${res.addedCount} attendee(s) to "${selectedMeeting.title}".`);
      onRefresh?.();
      setTimeout(() => setNotice(''), 5000);
    } catch (err) {
      alert(err.message || 'Could not upload attendee list');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteMeeting = async (mtg) => {
    if (!confirm(`Delete "${mtg.title}" and its attendance register?`)) return;
    await Storage.deleteMeetingAsync(mtg.id);
    if (selectedMeetingId === mtg.id) setSelectedMeetingId(null);
    onRefresh?.();
  };

  const handleExportCsv = () => {
    if (!selectedMeeting) return;
    const rows = [
      ['#', 'Full Name', 'Department', 'Role', 'Email', 'Phone', 'Status', 'Type', 'Signed At'],
      ...(selectedMeeting.attendees || []).map((a, i) => [
        i + 1,
        a.name,
        a.department || '',
        a.role || '',
        a.email || '',
        a.phone || '',
        a.signedIn ? 'Present (Signed)' : 'Absent',
        a.isWalkIn ? 'QR Walk-In' : 'Pre-Uploaded Roster',
        a.signedInAt ? new Date(a.signedInAt).toLocaleString() : '',
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMeeting.title.replace(/[^a-z0-9]+/gi, '_')}_Attendance.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadQr = () => {
    if (!meetingQrUrl || !selectedMeeting) return;
    const a = document.createElement('a');
    a.href = meetingQrUrl;
    a.download = `${selectedMeeting.title.replace(/[^a-z0-9]+/gi, '_')}_SignIn_QR.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const attendees = selectedMeeting?.attendees || [];
  const signedInCount = attendees.filter((a) => a.signedIn).length;
  const absentCount = attendees.filter((a) => !a.signedIn).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="fp-tag-sage text-xs mb-1">Organizational Attendance Register</span>
          <h1 className="text-xl sm:text-2xl font-extrabold m-0">Meetings &amp; Digital Sign-In Sheets</h1>
          <p className="text-xs sm:text-sm m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Upload an attendee roster so people sign next to their names, or let anyone scan the meeting QR code to enter their details and sign.
          </p>
        </div>
        {isOrganizer && (
          <button
            type="button"
            onClick={() => setShowCreateForm((v) => !v)}
            className="btn-fp-olive px-4 py-2.5 text-xs sm:text-sm inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showCreateForm ? 'Close Form' : 'New Meeting'}</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl border text-xs sm:text-sm font-semibold" style={{ background: 'var(--fp-sage)', borderColor: 'var(--fp-olive)', color: 'var(--fp-sage-text)' }}>
          {notice}
        </div>
      )}

      {/* Create New Meeting Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateMeeting} className="fp-card p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold m-0">Create Meeting Attendance Register</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">Meeting Title *</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Monthly Staff & Operations Review" className="fp-input w-full px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Meeting Chair / Host</label>
              <input value={host} onChange={(e) => setHost(e.target.value)} placeholder="Chairperson Name" className="fp-input w-full px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="fp-input w-full px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Start Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="fp-input w-full px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Venue / Room</label>
              <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Boardroom A" className="fp-input w-full px-3.5 py-2.5 text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold">Sign-In Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'hybrid', title: 'Roster + QR Walk-Ins', desc: 'Upload names to sign next to, plus QR for extra guests' },
                { id: 'roster', title: 'Uploaded Roster Only', desc: 'Only people on your uploaded list can sign next to their name' },
                { id: 'open', title: 'Open QR Sign-In (No List)', desc: 'Attendees scan QR code, enter their details & sign' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  className="p-3 rounded-xl border text-left transition-colors"
                  style={{
                    background: mode === opt.id ? 'var(--fp-sage)' : 'var(--bg-main)',
                    borderColor: mode === opt.id ? 'var(--fp-olive)' : 'var(--border-color)',
                    color: mode === opt.id ? 'var(--fp-sage-text)' : 'var(--text-main)',
                  }}
                >
                  <div className="font-bold text-xs sm:text-sm">{opt.title}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {mode !== 'open' && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-semibold">
                  Upload CSV or Paste Attendee List (one per line: Name, Department, Role, Email)
                </label>
                <label className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload CSV File</span>
                  <input type="file" accept=".csv,.txt" className="hidden" onChange={(e) => handleCsvFile(e, setRosterText)} />
                </label>
              </div>
              <textarea
                rows={4}
                value={rosterText}
                onChange={(e) => setRosterText(e.target.value)}
                placeholder={'Kwame Mensah, Finance, Director, kwame@company.com\nAma Serwah, HR, Manager, ama@company.com\nKofi Boateng, Operations, Analyst'}
                className="fp-input w-full px-3.5 py-2.5 text-xs font-mono"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreateForm(false)} className="btn-fp-outline px-4 py-2 text-xs">Cancel</button>
            <button type="submit" disabled={busy} className="btn-fp-olive px-5 py-2 text-xs sm:text-sm">
              {busy ? 'Creating...' : 'Create Meeting & Generate QR'}
            </button>
          </div>
        </form>
      )}

      {/* Meetings Selector Bar */}
      {tenantMeetings.length === 0 ? (
        <div className="fp-card p-10 text-center space-y-3">
          <ClipboardList className="w-10 h-10 mx-auto" style={{ color: 'var(--fp-olive)' }} />
          <h2 className="text-lg font-extrabold m-0">No Meetings Created Yet</h2>
          <p className="text-xs sm:text-sm m-0" style={{ color: 'var(--text-muted)' }}>
            Click &quot;New Meeting&quot; above to upload an attendance list or generate an open QR sign-in sheet.
          </p>
        </div>
      ) : (
        <>
          <div className="fp-subnav">
            {tenantMeetings.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMeetingId(m.id)}
                className={`fp-subnav-pill text-xs ${selectedMeeting?.id === m.id ? 'active' : ''}`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>{m.title}</span>
              </button>
            ))}
          </div>

          {selectedMeeting && (
            <div className="space-y-5">
              {/* Top QR + Stats Hub */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 fp-card p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="fp-tag-sage text-[11px] uppercase">
                        {selectedMeeting.mode === 'open' ? 'Open QR Sign-In' : selectedMeeting.mode === 'roster' ? 'Uploaded Roster Only' : 'Roster + Walk-In QR'}
                      </span>
                      <h2 className="text-lg sm:text-xl font-extrabold m-0 mt-1">{selectedMeeting.title}</h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedMeeting.date}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedMeeting.time}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedMeeting.venue}</span>
                      </div>
                    </div>
                    {isOrganizer && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMeeting(selectedMeeting)}
                        className="p-2 rounded-lg border hover:opacity-80 bg-transparent cursor-pointer"
                        style={{ borderColor: 'var(--border-color)', color: 'var(--fp-red)' }}
                        title="Delete Meeting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                      <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>Signed In</div>
                      <div className="text-2xl font-extrabold mt-0.5" style={{ color: 'var(--fp-green)' }}>{signedInCount}</div>
                    </div>
                    <div className="p-3 rounded-xl border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                      <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>Not Yet Signed</div>
                      <div className="text-2xl font-extrabold mt-0.5">{absentCount}</div>
                    </div>
                    <div className="p-3 rounded-xl border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                      <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>Total Listed</div>
                      <div className="text-2xl font-extrabold mt-0.5">{attendees.length}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onOpenMeetingSignIn(selectedMeeting.id)}
                      className="btn-fp-olive px-4 py-2 text-xs inline-flex items-center gap-1.5"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Open Live Sign-In Sheet / Kiosk</span>
                    </button>
                    {isOrganizer && selectedMeeting.mode !== 'open' && (
                      <button
                        type="button"
                        onClick={() => setShowAddRoster((v) => !v)}
                        className="btn-fp-sage px-3.5 py-2 text-xs inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Add Names</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => printElementCleanly('printable-meeting-sheet', `${selectedMeeting.title} - Signed Attendance`)}
                      className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Signed Sheet</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Meeting QR Code Card */}
                <div className="lg:col-span-5 fp-card p-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
                  <div className="p-2.5 bg-white rounded-2xl border-2 border-dashed shrink-0 text-center" style={{ borderColor: 'var(--border-color)' }}>
                    {meetingQrUrl ? (
                      <img src={meetingQrUrl} alt="Meeting Sign-In QR" className="w-32 h-32 mx-auto" />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center"><QrCode className="w-8 h-8 opacity-30" /></div>
                    )}
                    <div className="text-[10px] font-mono font-bold text-slate-700 mt-1">SCAN TO SIGN IN</div>
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                    <div className="font-bold text-sm">Meeting Door QR Code</div>
                    <p className="text-xs m-0" style={{ color: 'var(--text-muted)' }}>
                      Attendees scan with their phone to sign next to their name or enter their details if not listed.
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(meetingSignInUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                      </button>
                      <button type="button" onClick={handleDownloadQr} className="btn-fp-sage px-3 py-1.5 text-xs inline-flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>QR PNG</span>
                      </button>
                      <a
                        href={meetingSignInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload More Names Drawer */}
              {showAddRoster && (
                <form onSubmit={handleAppendRoster} className="fp-card p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold m-0">Upload CSV or Paste Additional Names</h3>
                    <label className="btn-fp-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose CSV File</span>
                      <input type="file" accept=".csv,.txt" className="hidden" onChange={(e) => handleCsvFile(e, setAppendRosterText)} />
                    </label>
                  </div>
                  <textarea
                    rows={4}
                    value={appendRosterText}
                    onChange={(e) => setAppendRosterText(e.target.value)}
                    placeholder="One attendee per line: Name, Department, Role, Email, Phone"
                    className="fp-input w-full px-3.5 py-2.5 text-xs font-mono"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddRoster(false)} className="btn-fp-outline px-3.5 py-1.5 text-xs">Cancel</button>
                    <button type="submit" disabled={busy} className="btn-fp-olive px-4 py-1.5 text-xs">
                      {busy ? 'Uploading...' : 'Add to Attendance List'}
                    </button>
                  </div>
                </form>
              )}

              {/* Printable Official Signed Attendance Sheet */}
              <div id="printable-meeting-sheet" className="fp-card p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h3 className="text-base font-extrabold m-0">{selectedMeeting.title} — Attendance Register</h3>
                    <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {tenant?.name} · {selectedMeeting.date} at {selectedMeeting.time} · {selectedMeeting.venue} · Chair: {selectedMeeting.host}
                    </p>
                  </div>
                  <span className="fp-tag-olive text-xs">{signedInCount} / {attendees.length} Signed</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="fp-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Department &amp; Role</th>
                        <th>Status</th>
                        <th>Time Signed</th>
                        <th>Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-xs" style={{ color: 'var(--text-muted)' }}>
                            No attendees signed in yet. Share the Meeting QR Code above or upload a roster.
                          </td>
                        </tr>
                      ) : (
                        attendees.map((att, idx) => (
                          <tr key={att.id}>
                            <td className="font-mono text-xs">{idx + 1}</td>
                            <td>
                              <div className="font-bold text-xs sm:text-sm">{att.name}</div>
                              {(att.email || att.phone) && (
                                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                  {[att.email, att.phone].filter(Boolean).join(' · ')}
                                </div>
                              )}
                            </td>
                            <td className="text-xs">
                              <div className="font-medium">{att.department || '—'}</div>
                              {att.role && <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{att.role}</div>}
                            </td>
                            <td>
                              {att.signedIn ? (
                                <span className="fp-tag-olive text-[11px] inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> {att.isWalkIn ? 'QR Signed' : 'Signed'}
                                </span>
                              ) : (
                                <span className="fp-tag-sage text-[11px]">Awaiting</span>
                              )}
                            </td>
                            <td className="text-xs font-mono whitespace-nowrap">
                              {att.signedInAt ? new Date(att.signedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                            </td>
                            <td>
                              {att.signatureDataUrl ? (
                                <img src={att.signatureDataUrl} alt={`${att.name} signature`} className="h-9 max-w-[130px] object-contain bg-white rounded border px-1" />
                              ) : att.signedIn ? (
                                <span className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>Verified</span>
                              ) : (
                                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
