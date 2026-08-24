# 📋 Changelog – CampusHub AI

All notable changes to the CampusHub AI ecosystem are documented in this file.

## [2.5.0] - 2026-08-24

### 🏠 Student Life, Housing & Wellness Sanctuary
- **Hostel & Room Allocation System (`/dashboard/student/hostel`, `/api/hostel`)**: 2D floor explorer, roommate details, curfew tracking, and maintenance repair ticketing.
- **Campus Events & Hackathons Hub (`/dashboard/student/events`, `/api/events`)**: National hackathon registrations, live capacity tracking, and generated QR ticket admission passes.
- **Verifiable Digital Credentials (`/dashboard/student/certificates`, `/verify/[id]`, `/api/certificates`)**: Tamper-proof bonafide and merit certificates with SHA-256 integrity verification.
- **AI Resume Builder & ATS Score Analyzer (`/dashboard/student/resume-builder`, `/api/ai/resume-analyzer`)**: LaTeX/Modern 1-page CV builder with real-time keyword match score.
- **Alumni & Mentorship Network (`/dashboard/student/alumni`, `/api/alumni`)**: Directory of alumni at Google, Microsoft, Apple with 1:1 Google Meet mentorship booking.
- **Campus Lost & Found Hub (`/dashboard/student/lost-found`, `/api/lost-found`)**: Community lost/found reporting with location pins and security claim verification.
- **Institutional Scholarships & Aid Portal (`/dashboard/student/scholarships`, `/api/scholarships`)**: Merit/need-based grant catalog with verified CGPA eligibility checker.
- **Smart Cafeteria & Meal Pre-Ordering (`/dashboard/student/cafeteria`, `/api/cafeteria`)**: Real-time stall menus, nutritional calorie calculator, and kitchen queue skip tokens.
- **Interactive 2D Campus Map (`/dashboard/student/campus-map`)**: 180-acre vector map with clickable building pins, lab facilities, and walking route navigation.
- **Student Health & Counseling Sanctuary (`/dashboard/student/wellness`, `/api/wellness`)**: Confidential psychologist booking, mood tracker, and 24/7 SOS helpline directory.

### 🔬 Faculty Research, Labs & Academic Operations
- **Faculty Leave & On-Duty (OD) Desk (`/dashboard/faculty/leaves`, `/api/leaves`)**: Casual, medical, and duty leave applications with live quota balance meter and substitute tracking.
- **Research, Publications & Grants Repository (`/dashboard/faculty/research`, `/api/research`)**: Scopus/IEEE publication logger with citations, h-index, and funded research grants.
- **High-End Lab & Supercomputer Slot Booking (`/dashboard/faculty/labs`, `/api/labs`)**: NVIDIA DGX A100 GPU clusters, 3D resin printers, and microwave analyzer slot reservations.
- **Event Organizer & QR Check-in Terminal (`/dashboard/faculty/events`)**: Gate check-in ticket validator with real-time attendee CSV export.

### 🏛️ Admin Enterprise Governance & Safety Command
- **Hostel Housing Administration (`/dashboard/admin/hostel`)**: Occupancy analytics across 4 residential blocks, warden rosters, and maintenance SLA logs.
- **Admin Faculty Leave Approval Console (`/dashboard/admin/leaves`)**: Department-wide leave calendar, 1-click approvals, and substitution auditing.
- **Scholarship Disbursement Dashboard (`/dashboard/admin/scholarships`)**: Financial aid review console, fund allocation tracking, and Direct Benefit Transfer (DBT) sanctions.
- **Capital Asset & Hardware Inventory (`/dashboard/admin/inventory`, `/api/inventory`)**: Barcode asset tracking, valuation calculations, and AMC warranty expiry monitors.
- **Emergency Siren Blast & Broadcast Transmitter (`/dashboard/admin/emergency`, `/api/emergency-alerts`)**: Instant multi-channel alerts (SMS, Email, Push, Audio Siren) for campus lockdowns and weather safety.

### 👨‍👩‍👧 Parent Engagement
- **Parent Grievance & Dean Feedback Desk (`/dashboard/parent/feedback`, `/api/parent-feedback`)**: Direct communication channel with Deans with 48-hour SLA response guarantees.

## [2.0.0] - 2026-08-23

### ✨ Core Navigation & Global UI Enhancements
- **Global Command Palette (`Ctrl+K` / `⌘K`)**: Added spotlight modal allowing keyboard navigation across all portal features, departments, and actions.
- **Glassmorphic Toast System (`ToastProvider`)**: Real-time feedback alerts with progress indicators and auto-dismiss.
- **Campus Theme Accent Customizer**: Color customizer with Indigo, Emerald, Violet, Rose, and Amber palettes, and font accessibility toggles.

### 🎓 Student Experience & Campus Life
- **AI Study Planner & Pomodoro Focus Timer**: Customizable deep work sessions, study streaks, and AI revision coach tips.
- **Smart Digital ID Card**: 3D flip card badge with QR verification, barcode, and NFC turnstile simulator.
- **Advanced Library Catalog API**: Live book reservation, filter by subject, and active loan tracking with due date reminders.
- **Interactive Weekly Timetable**: Live ongoing class highlighter, instructor details modal, and `.ics` calendar sync export.
- **Campus Discussion Forum**: Peer community with category filters, upvotes, tags, and anonymous query posting.
- **Grievance Ticketing System**: Student complaint ticketing with SLA countdowns and maintenance category routing.
- **Online Fee Payment Simulator**: Multi-gateway payment checkout (UPI, Card, NetBanking) with printable PDF invoice receipts.
- **Career & Placement Tracker**: Automated CGPA cutoff verification and AI resume match scores.
- **Exam Results & GPA Trajectory**: Semester SGPA breakdown with progressive growth bar graphs and provisional transcript download.

### 👨‍🏫 Faculty Suite
- **Marks Entry & Gradebook**: Evaluator table with auto letter grade (O, A+, A, B+, B, C, F) assignment and stats.
- **Lecture Study Materials Repository**: Digital slide upload manager with download analytics and course tagging.
- **Class Schedule & Substitution Desk**: Faculty schedule management with peer substitution requests and leave coverage.

### 🏛️ Admin Enterprise Console
- **13 Department Management**: Infrastructure dashboard with HOD assignments, faculty:student ratios, and lab budgets.
- **Security Audit Logs Monitor**: Real-time compliance activity monitor with severity filtering, IP tracing, and CSV export.
- **Campus System Settings**: Control panel for attendance threshold guardrails (75%), SMS/Email relays, and maintenance mode.
- **Bulk User Onboarding**: Batch CSV import with downloadable sample templates and error validation.
- **Institutional Reports & BI Hub**: Universal data export engine (`exportUtils.ts`) supporting CSV, JSON, and printable formats.

### 👨‍👩‍👧 Parent Portal
- **Live GPS Bus & Transport Tracker**: Real-time vehicle speed, route checkpoints, driver emergency contact, and proximity SMS alerts.
- **Parent-Teacher Meeting (PTM) Scheduler**: 1-on-1 consultation booking with faculty mentors and Google Meet link generation.

### 🔒 Security & Middleware
- **Rate Limiting Middleware (`lib/rateLimit.ts`)**: Sliding window request throttle.
- **Standardized API Response Wrappers (`lib/apiResponse.ts`)**: Structured JSON responses.
- **Input Sanitization (`lib/sanitize.ts`)**: XSS prevention and validation utilities.
