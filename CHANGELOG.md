# 📋 Changelog – CampusHub AI

All notable changes to the CampusHub AI ecosystem are documented in this file.

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
