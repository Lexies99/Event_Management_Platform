import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  PenTool,
  Search,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { Storage } from '../../data/storage';
import TenantLogo from '../Common/TenantLogo';
import SignaturePad from '../Common/SignaturePad';

/**
 * Public / Kiosk Meeting Sign-In Page (#/:slug/meeting/:meetingId)
 * - Mode 1 (Roster / Hybrid): Find your name on the uploaded list and sign next to it.
 * - Mode 2 (Open / Hybrid): Scan QR -> enter Name, Department, Role, Email/Phone & sign.
 */
export default function MeetingSignInPage({
  tenant,
  meeting,
  onBackToPortal,
  onSignedIn,
}) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(() =>
    meeting?.mode === 'open' || (meeting?.attendees?.length || 0) === 0 ? 'walkin' : 'roster'
  );
  const [signingAttendee, setSigningAttendee] = useState(null);
  const [rosterSignature, setRosterSignature] = useState('');

  // Walk-in / Open QR form state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [walkInSignature, setWalkInSignature] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [successRecord, setSuccessRecord] = useState(null);

  const attendees = useMemo(() => meeting?.attendees || [], [meeting]);
  const signedCount = attendees.filter((a) => a.signedIn).length;

  const filteredRoster = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return attendees;
    return attendees.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.department || '').toLowerCase().includes(q) ||
        (a.role || '').toLowerCase().includes(q)
    );
  }, [attendees, search]);

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <div className="fp-card max-w-md w-full p-8 text-center space-y-4">
          <Users className="w-10 h-10 mx-auto" style={{ color: 'var(--fp-olive)' }} />
          <h1 className="text-xl font-extrabold m-0">Meeting Not Found</h1>
          <p className="text-sm m-0" style={{ color: 'var(--text-muted)' }}>
            This meeting sign-in link may have expired or been removed by the organizer.
          </p>
          <button type="button" onClick={onBackToPortal} className="btn-fp-olive px-5 py-2.5 text-sm">
            Back to {tenant?.shortName || 'Portal'}
          </button>
        </div>
      </div>
    );
  }

  const handleSignNextToName = async (e) => {
    e.preventDefault();
    if (!signingAttendee) return;
    if (!rosterSignature) {
      setError('Please draw your signature in the box before confirming.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await Storage.signInMeetingAsync(meeting.id, {
        attendeeId: signingAttendee.id,
        signatureDataUrl: rosterSignature,
      });
      setSuccessRecord(res.attendee);
      setSigningAttendee(null);
      setRosterSignature('');
      onSignedIn?.();
    } catch (err) {
      setError(err.message || 'Could not record signature.');
    } finally {
      setBusy(false);
    }
  };

  const handleWalkInSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!walkInSignature) {
      setError('Please draw your signature before signing in.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await Storage.signInMeetingAsync(meeting.id, {
        name: name.trim(),
        department: department.trim(),
        role: role.trim(),
        email: email.trim(),
        phone: phone.trim(),
        signatureDataUrl: walkInSignature,
      });
      setSuccessRecord(res.attendee);
      setName('');
      setDepartment('');
      setRole('');
      setEmail('');
      setPhone('');
      setWalkInSignature('');
      onSignedIn?.();
    } catch (err) {
      setError(err.message || 'Could not complete sign-in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Branded Top Header */}
      <header
        className="sticky top-0 z-50 h-16 px-4 sm:px-8 flex items-center justify-between gap-2 border-b"
        style={{ background: 'var(--bg-header)', borderColor: 'var(--border-header)', color: 'var(--header-text)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <TenantLogo tenant={tenant} size={36} className="rounded-lg" />
          <div className="min-w-0">
            <div className="font-bold text-sm sm:text-base truncate">{tenant?.shortName || tenant?.name}</div>
            <div className="text-[11px] opacity-80 truncate">Meeting Attendance Sign-In</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToPortal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Portal</span>
        </button>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        {/* Meeting Banner Card */}
        <div className="fp-card p-5 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="fp-tag-sage text-xs">Official Meeting Sign-In</span>
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--fp-olive)' }}>
              {signedCount} Signed In {attendees.length > 0 ? `/ ${attendees.length} Listed` : ''}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold m-0 leading-tight">{meeting.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {meeting.date}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {meeting.time}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {meeting.venue}</span>
            <span className="inline-flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Chair: {meeting.host}</span>
          </div>
        </div>

        {/* Success Confirmation Banner */}
        {successRecord && (
          <div className="fp-card p-5 border-2 space-y-2.5" style={{ borderColor: 'var(--fp-green)', background: 'var(--bg-card)' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" style={{ color: 'var(--fp-green)' }} />
                <div>
                  <div className="font-extrabold text-base">Attendance Signed &amp; Recorded!</div>
                  <p className="text-xs sm:text-sm m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Thank you, <strong>{successRecord.name}</strong>. Signed at {new Date(successRecord.signedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                  </p>
                </div>
              </div>
              {successRecord.signatureDataUrl && (
                <img src={successRecord.signatureDataUrl} alt="Signature" className="h-10 bg-white rounded border px-1.5" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setSuccessRecord(null)}
              className="btn-fp-outline px-3.5 py-1.5 text-xs"
            >
              Sign In Another Attendee
            </button>
          </div>
        )}

        {/* Mode Switcher (when Hybrid) */}
        {meeting.mode === 'hybrid' && (
          <div className="fp-card p-2.5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('roster');
                setError('');
              }}
              className={`fp-subnav-pill flex-1 justify-center text-xs py-2.5 ${activeTab === 'roster' ? 'active' : ''}`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Find Name &amp; Sign ({attendees.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('walkin');
                setSigningAttendee(null);
                setError('');
              }}
              className={`fp-subnav-pill flex-1 justify-center text-xs py-2.5 ${activeTab === 'walkin' ? 'active' : ''}`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Not on List? Enter Details</span>
            </button>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl border text-xs font-semibold" style={{ borderColor: 'var(--fp-red)', color: 'var(--fp-red)', background: 'var(--bg-card)' }}>
            {error}
          </div>
        )}

        {/* MODE 1: UPLOADED ROSTER — SIGN NEXT TO YOUR NAME */}
        {activeTab === 'roster' && meeting.mode !== 'open' && (
          <div className="fp-card p-5 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your name or department..."
                className="fp-input w-full pl-10 pr-3.5 py-2.5 text-sm"
              />
            </div>

            {signingAttendee && (
              <form
                onSubmit={handleSignNextToName}
                className="p-4 sm:p-5 rounded-xl border-2 space-y-4"
                style={{ borderColor: 'var(--fp-olive)', background: 'var(--bg-main)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Signing attendance for:</div>
                    <div className="font-extrabold text-base">{signingAttendee.name}</div>
                    {(signingAttendee.department || signingAttendee.role) && (
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {[signingAttendee.role, signingAttendee.department].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSigningAttendee(null);
                      setRosterSignature('');
                    }}
                    className="btn-fp-outline px-3 py-1.5 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <SignaturePad onChange={setRosterSignature} height={140} />

                <button type="submit" disabled={busy} className="btn-fp-olive w-full py-3 text-sm inline-flex items-center justify-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span>{busy ? 'Recording Signature...' : 'Confirm & Sign Attendance'}</span>
                </button>
              </form>
            )}

            <div className="space-y-2.5">
              {filteredRoster.length === 0 ? (
                <div className="text-center py-8 text-xs" style={{ color: 'var(--text-muted)' }}>
                  No matching name found.{meeting.mode === 'hybrid' && ' Tap "Not on List? Enter Details" above to sign in.'}
                </div>
              ) : (
                filteredRoster.map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3"
                    style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm truncate">{att.name}</div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {[att.role, att.department].filter(Boolean).join(' · ') || att.email || 'Invited Attendee'}
                      </div>
                    </div>

                    {att.signedIn ? (
                      <div className="flex items-center gap-2 shrink-0">
                        {att.signatureDataUrl && (
                          <img src={att.signatureDataUrl} alt={`${att.name} signature`} className="h-8 bg-white rounded border px-1" />
                        )}
                        <span className="fp-tag-olive text-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Signed {att.signedInAt ? new Date(att.signedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSigningAttendee(att);
                          setRosterSignature('');
                          setError('');
                        }}
                        className="btn-fp-olive px-4 py-2 text-xs inline-flex items-center gap-1.5 shrink-0"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Sign Next to Name</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MODE 2: OPEN QR SIGN-IN FORM (Enter Details + Draw Signature) */}
        {(activeTab === 'walkin' || meeting.mode === 'open') && meeting.mode !== 'roster' && (
          <form onSubmit={handleWalkInSubmit} className="fp-card p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold m-0">Enter Your Details &amp; Sign In</h2>
              <p className="text-xs mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
                Your name, department, timestamp, and signature will be added directly to the official meeting register.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">Full Name *</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kwame Boateng" className="fp-input w-full px-3.5 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Department / Organization</label>
                <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Finance / GIMPA" className="fp-input w-full px-3.5 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Role / Job Title</label>
                <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Operations Manager" className="fp-input w-full px-3.5 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="fp-input w-full px-3.5 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 24 000 0000" className="fp-input w-full px-3.5 py-2.5 text-sm" />
              </div>
            </div>

            <SignaturePad onChange={setWalkInSignature} height={140} />

            <button type="submit" disabled={busy} className="btn-fp-olive w-full py-3 text-sm inline-flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{busy ? 'Submitting Sign-In...' : 'Sign Meeting Attendance'}</span>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
