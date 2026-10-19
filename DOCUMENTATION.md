# EVENT MANAGEMENT PLATFORM
### Product & Technical Documentation
**Cloud-hosted, multi-tenant event registration, check-in and engagement system**  
**Version:** 1.0  
**Date:** October 2026  
**Status:** Complete Implementation & Verified Architecture  

---

## 1. Executive Summary
The **Event Management Platform (EventFlow)** is a cloud-hosted, multi-tenant web application for running events end to end. Attendees register remotely with a photo, receive a QR-code ticket, and check in on the day, when a printed name badge is produced. Organizers monitor registration and attendance through a live dashboard and can chat with the attendees who actually showed up.

The platform is designed to be rented to multiple companies. A platform operator (the super-admin) creates a company workspace in a few clicks, enters the company's name, logo and event organizer, and sends the company a private link giving access to that company's isolated event workspace.

---

## 2. Goals and Non-Goals

### 2.1 Goals
- **Remote Registration:** Let anyone register for an event from home or anywhere, on any device.
- **Actionable Analytics:** Provide organizers with headline metrics: registered, attended, did not attend (no-show), and turnout rate.
- **Attendance-Gated Chat:** Enable real-time interaction between organizers and registered members who physically attended.
- **Photo Capture & Badging:** Capture each registrant's photo and produce an information badge at check-in.
- **Strict Multi-Tenancy:** Serve multiple companies from a single deployment with data isolation and per-company branding.
- **Rapid Onboarding:** Enable the platform operator to onboard a new company in seconds from an administrative control plane.

### 2.2 Non-Goals (Version 1)
- Full video-conferencing or live streaming (may integrate third-party tools later).
- Complex 3D seating or floor-plan design.
- Native mobile app distribution (a high-performance responsive web app / PWA is used instead).

---

## 3. Users and Roles

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **Super-admin** | Platform operator renting the system to companies | Create and suspend tenants, manage plans and billing, view platform-wide usage, generate tenant links |
| **Organizer (tenant admin)** | Person who runs the company's event | Configure event, manage registrants, view dashboard, send announcements, moderate chat, print badges |
| **Check-in staff** | On-site personnel | Scan QR codes, mark attendance, print badges, handle manual fallback |
| **Attendee** | Registered delegate | Register, receive QR ticket, update profile, join chat after check-in |

---

## 4. System Overview

### 4.1 Multi-Tenancy Model
Each company is a tenant. All tenants share one application and one database, and every tenant-owned record carries a `tenant_id`. Isolation is enforced at three layers:
1. **Application layer:** Every request resolves a tenant from the link or subdomain and scopes all queries to it.
2. **Database layer:** PostgreSQL row-level security (RLS) policies reject cross-tenant reads and writes.
3. **Storage layer:** Uploaded files (photos, logos) are stored under per-tenant prefixes with access checked on every request.

### 4.2 Tenant Onboarding Flow
1. Super-admin opens the admin control plane and selects **New Company**.
2. Super-admin enters company name, uploads logo, chooses brand colour, and enters the event organizer details (name and email).
3. System provisions the tenant workspace and the organizer account.
4. System generates a private event link (e.g., `https://example.com/?tenant=acme`).
5. Super-admin sends the link; organizer accesses the dashboard and begins configuring the event.

### 4.3 Attendee Journey
1. Attendee opens the event's public registration page, branded with the company's name and logo.
2. Attendee completes the form, uploads or selects a photo, and accepts the privacy consent (Ghana Act 843 compliant).
3. System issues a confirmation with a unique QR-code ticket.
4. On event day, staff scan the QR code; the attendee is marked attended and a badge is printed.
5. The attendee gains access to the live event chat.

---

## 5. Functional Requirements Implemented

### 5.1 Registration
- **FR-1.1:** Public registration page per event, responsive across mobile, tablet, and desktop.
- **FR-1.2:** Configurable form fields (name, email, phone, organization, job title, delegate category).
- **FR-1.3:** Photo capture via file upload with validation.
- **FR-1.4:** Duplicate detection by email and phone.
- **FR-1.5:** Capacity limit with waitlist warning.
- **FR-1.6:** Confirmation message with single-use QR-code ticket.

### 5.2 Check-in and Attendance
- **FR-2.1:** Camera / optical QR code scanner interface (&lt; 1s processing target).
- **FR-2.2:** Manual search fallback by name, email, phone, or ticket code.
- **FR-2.3:** Attendance status recorded with exact timestamp and station staff member.
- **FR-2.4:** Duplicate scan warning banner displaying previous check-in time and staff actor.
- **FR-2.5:** Offline mode with local queueing and bulk server sync.

### 5.3 Badge Printing
- **FR-3.1:** Badge template displaying attendee photo, full name, organization, category, QR code, and company logo.
- **FR-3.2:** Direct browser badge printing with print stylesheets formatted for thermal and standard badge paper.
- **FR-3.3:** Configurable badge layout and category color banners.
- **FR-3.4:** Duplicate reprint option logged directly in the system audit trail.

### 5.4 Dashboard and Analytics
- **FR-4.1:** Headline KPI counts: Registered, Attended, No-Show, and Turnout Rate (%).
- **FR-4.2:** Registration timelines and capacity bars.
- **FR-4.3:** Live hourly check-in distribution counter.
- **FR-4.4:** Category breakdown across Attendees, Speakers, VIPs, Sponsors, and Press.
- **FR-4.5:** Filterable attendee table with 1-click CSV/Excel export.
- **FR-4.6:** Super-admin fleet view across all tenants.

### 5.5 Chat
- **FR-5.1:** Real-time event chat strictly gated to attendees who are marked as attended.
- **FR-5.2:** Organizer announcements pinned at the top.
- **FR-5.3:** Moderation controls: pin/unpin announcements, delete messages.
- **FR-5.4:** Live message timestamps, attendee avatars, and category badges.

### 5.6 Communication & Credentials
- **FR-6.1:** Automated digital ticket passes with QR codes.
- **FR-6.2:** Segmented broadcast messaging (All Registrants, Attended Only, No-Shows Only).
- **FR-6.3:** Post-event feedback survey integration.
- **FR-6.4:** Verifiable Certificate of Attendance generation with verification QR code.

### 5.7 Branding & Multi-Tenancy
- **FR-7.1:** Dynamic brand color injection (`--brand-500`), custom company logos, and slug-based routing.
- **FR-8.1 - FR-8.4:** Super-admin tenant suspension, rental tier plans (Starter, Growth, Enterprise), usage metering, and audit logs.

---

## 6. Architecture & Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS (PWA ready, clean print styles)
- **Icons & Components:** Lucide React, Canvas Confetti
- **QR Utilities:** `qrcode` generation engine
- **Multi-Tenant State:** Reactive local persistence engine with row-level security isolation and offline queueing
- **Deployment:** Containerized, zero-downtime static/SSR bundle
