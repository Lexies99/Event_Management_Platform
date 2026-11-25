import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Lock, Camera, Users, Scale } from 'lucide-react';

export const TERMS_VERSION = "v1.0 — Effective 2026";

export function buildDefaultEventTerms(orgName = 'the Event Organizer', eventTitle = 'this event') {
  return `1. Registration & Admission
All delegates registering for ${eventTitle} hosted by ${orgName} must provide accurate contact information. Admission is granted upon presentation of your valid QR ticket code or printed lanyard badge at the venue check-in desk.

2. Cancellations & Transfers
Tickets are personal to the registered delegate. Any substitution, transfer, or cancellation request must be submitted to ${orgName} at least 48 hours before the event start date.

3. Code of Conduct
All attendees, speakers, sponsors, and staff are expected to maintain respectful, professional conduct throughout ${eventTitle}, including in the live Event Community Chat. ${orgName} reserves the right to remove disruptive participants.

4. Photography, Media & Data Protection (Ghana Act 843)
By attending ${eventTitle}, you consent to event photography/video recording for official ${orgName} communications and to the processing of your registration details strictly for event admission, badge printing, and certificates in compliance with the Data Protection Act, 2012 (Act 843).

5. Schedule & Venue Changes
${orgName} reserves the right to update session timings, speakers, or venue rooms when necessary, with timely notice sent via Event Announcements and Reminders.`;
}

export default function TermsModal({ isOpen, onClose, onAccept, tenantName, eventTitle, customTerms }) {
  if (!isOpen) return null;

  const isEventContext = Boolean(tenantName);
  const trimmedCustom = String(customTerms || '').trim();
  const scopeLabel = isEventContext
    ? `${tenantName}${eventTitle ? ` · ${eventTitle}` : ''}`
    : "EventPlan Cloud (ManaMa Technologies)";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      style={{ background: "rgba(15, 20, 14, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="fp-card w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        style={{ background: "var(--bg-main)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 sm:px-7 py-4 border-b"
          style={{ background: "var(--bg-header)", borderColor: "var(--border-header)", color: "var(--header-text)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--fp-olive)", color: "var(--fp-olive-text, #ffffff)" }}
            >
              <Scale className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold m-0 truncate" style={{ color: "var(--header-text)" }}>
                Terms &amp; Conditions &amp; Data Protection Policy
              </h2>
              <p className="text-xs opacity-80 m-0 truncate" style={{ color: "var(--header-text)" }}>
                {scopeLabel} · {TERMS_VERSION}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors shrink-0"
            style={{ color: "var(--header-text)" }}
            aria-label="Close Terms and Conditions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Legal Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-5 text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
          {isEventContext && trimmedCustom ? (
            <>
              <div className="p-4 rounded-xl border flex items-start gap-3" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                <FileText className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--fp-olive)" }} />
                <div className="text-xs sm:text-sm">
                  <strong style={{ color: "var(--text-main)" }}>Official Event Terms &amp; Conditions — Provided by {tenantName}:</strong>{" "}
                  These terms are set directly by the host organizer for {eventTitle || tenantName}.
                </div>
              </div>

              <div
                className="p-5 rounded-xl border whitespace-pre-line text-sm leading-relaxed"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
              >
                {trimmedCustom}
              </div>

              <div className="p-3.5 rounded-xl border text-xs flex items-start gap-2.5" style={{ background: "var(--bg-subtle)", borderColor: "var(--border-color)", color: "var(--text-muted)" }}>
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--fp-olive)" }} />
                <span>
                  Hosted on <strong>EventPlan Cloud (ManaMa Technologies)</strong>. Attendee registration data, QR tickets, and check-in audit logs are isolated to {tenantName}&apos;s workspace in compliance with the Ghana Data Protection Act, 2012 (Act 843).
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl border flex items-start gap-3" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--fp-olive)" }} />
                <div className="text-xs sm:text-sm">
                  <strong style={{ color: "var(--text-main)" }}>Ghana Data Protection Act, 2012 (Act 843) &amp; Multi-Tenant Privacy Guarantee:</strong>{" "}
                  By registering an organization workspace or enrolling as an event delegate on EventPlan Cloud, you agree to the terms below governing ticketing, identity verification, badge printing, and audit logging.
                </div>
              </div>

          <section className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
              <FileText className="w-4 h-4" style={{ color: "var(--fp-olive)" }} />
              1. Acceptance of Terms &amp; Platform Scope
            </h3>
            <p>
              EventPlan Cloud operates as a multi-tenant event management platform providing dedicated branded event websites, online delegate registration, QR ticketing, multi-desk check-in stations, 3.1-inch lanyard badge production, certificates of attendance, and attendance-gated event community chat. Accessing or using any tenant portal constitutes binding acceptance of these Terms &amp; Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
              <Users className="w-4 h-4" style={{ color: "var(--fp-olive)" }} />
              2. Delegate Registration, Tickets &amp; Multi-Day Access
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Each registered attendee receives a unique cryptographic ticket code (e.g., <code>TKT-XXX-0000</code>) and scannable QR credential tied exclusively to the specific event and permitted attendance days selected during registration.</li>
              <li>Tickets and printed lanyard badges are non-transferable unless explicitly re-issued by an authorized Event Organizer or Check-In Supervisor.</li>
              <li>Duplicate ticket scans or attempts to enter on non-permitted event days are automatically flagged and recorded in the event security audit trail.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
              <Camera className="w-4 h-4" style={{ color: "var(--fp-olive)" }} />
              3. Data Protection, Photography &amp; Badge Consent (Act 843)
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Personal data collected during registration (full name, email address, phone number, organization, job title, nationality, and optional headshot photograph) is processed strictly for event admission, printed ID badge creation, attendance verification, and official post-event certificates.</li>
              <li>In compliance with the <strong>Data Protection Act, 2012 (Act 843)</strong>, attendees may request correction or deletion of their personal data by contacting the host Event Organizer.</li>
              <li>Uploaded or webcam-captured attendee portraits are scoped exclusively to the host event workspace and are never shared with external third-party advertisers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
              <Lock className="w-4 h-4" style={{ color: "var(--fp-olive)" }} />
              4. Multi-Tenant Isolation &amp; Audit Trail Logging
            </h3>
            <p>
              Every organization workspace operates within an isolated tenant boundary. To ensure operational accountability and compliance, all sensitive actions—including attendee registrations, check-in scans, failed or duplicate scan attempts, badge prints and reprints, staff account changes, and workspace branding updates—are permanently logged in the workspace <strong>Audit Trail</strong> with actor identity and timestamp.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: "var(--text-main)" }}>
              5. Organizer &amp; Check-In Staff Responsibilities
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Event Organizers are responsible for the accuracy of their event schedule, venue details, custom branding assets, and authorized Check-In Staff PIN credentials.</li>
              <li>Check-In Staff must safeguard station PINs and only reprint badges when verified, providing an accurate audit reason for duplicate badge prints.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: "var(--text-main)" }}>
              6. Event Community Code of Conduct &amp; Cancellation
            </h3>
            <p>
              Participants using the attendance-gated Event Community Chat must maintain respectful, professional conduct. Organizers reserve the right to pin announcements or remove disruptive messages. Event schedules, speakers, or venues may be updated by the host organizer with reasonable notice to registered delegates.
            </p>
          </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 sm:px-7 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Questions? Contact support@manamatechnologies.com
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-fp-outline px-4 py-2 text-xs sm:text-sm"
            >
              Close
            </button>
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="btn-fp-olive px-5 py-2 text-xs sm:text-sm inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Accept Terms &amp; Conditions</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
