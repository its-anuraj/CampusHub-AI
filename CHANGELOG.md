# 📋 Changelog – CampusHub AI

All notable changes to the CampusHub AI ecosystem are documented in this file.

## [3.2.0] - 2026-08-27

### 🎓 Student Ecosystem Enhancements
- **AI Code Plagiarism & Quality Auditor (`/dashboard/student/assignments/code-checker`, `/api/ai/code-check`)**: Syntax verification, cyclomatic complexity estimation, and plagiarism similarity scoring.
- **Virtual Science & Engineering Labs (`/dashboard/student/labs`, `/api/labs/simulations`)**: Interactive circuit oscilloscope and physics mechanics mathematical simulators.
- **Peer-to-Peer Study Pods & Virtual Rooms (`/dashboard/student/study-groups`, `/api/study-groups`)**: 1-click video study pods with daily revision streak counters.
- **Hostel Laundry Token Booking (`/dashboard/student/hostel/laundry`, `/api/hostel/laundry`)**: IoT washing machine status tracker and digital QR token vouchers.
- **Campus E-Cycle Sharing (`/dashboard/student/transport/bikes`, `/api/transport/bikes`)**: Green mobility bicycle unlock console and carbon offset counters.
- **Campus Personal Budget Manager (`/dashboard/student/budget`, `/api/student-budget`)**: Expense category breakdown and monthly budget caps.
- **Alumni Job Referral Board (`/dashboard/student/alumni/referrals`, `/api/alumni/referrals`)**: Direct InMail referral outreach to FAANG alumni.
- **W3C Cryptographic Micro-Credentials (`/dashboard/student/certificates/export`, `lib/credentialVerifier.ts`)**: OpenBadges 3.0 export with cryptographic root authority signatures.
- **Hackathon Live Audience Voting & Q&A Wall (`/dashboard/student/events/live-poll`, `/api/events/live-poll`)**: Real-time audience voting arena and question upvoting.
- **AI Lost & Found Claim Matcher (`/dashboard/student/lost-found/claim-tracker`, `/api/lost-found/claims`)**: Ownership evidence verification and custody handover tracking.

### 🔬 Faculty Academic Operations
- **AI Exam Question Paper Generator (`/dashboard/faculty/exam-generator`, `/api/ai/exam-generator`)**: Bloom's taxonomy balanced university question sheets.
- **Rubric-Based Assignment Evaluation Desk (`/dashboard/faculty/assignments/rubrics`, `/api/assignments/rubrics`)**: Standardized 5-criterion grading matrix.
- **1-on-1 Office Hours Scheduler (`/dashboard/faculty/office-hours`, `/api/faculty/office-hours`)**: Consultation availability publisher and Google Meet integration.
- **NBA & NAAC Accreditation Radar (`/dashboard/faculty/accreditation`, `/api/faculty/accreditation`)**: Program Outcome (PO1 - PO12) attainment calculation.
- **Lab Equipment Calibration Logger (`/dashboard/faculty/labs/maintenance`, `/api/labs/maintenance`)**: Preventative maintenance log sheets and calibration schedules.

### 🏛️ Admin Governance & Campus IoT
- **Campus Sustainability & Solar Telemetry (`/dashboard/admin/sustainability`, `/api/admin/sustainability`)**: Real-time rooftop solar generation and building net zero audits.
- **Visitor Pass Management & ANPR Parking (`/dashboard/admin/security/visitors`, `/api/security/visitors`)**: Automated number plate recognition and host authorizations.
- **AI Timetable Conflict Optimizer (`/dashboard/admin/timetable-optimizer`, `/api/admin/timetable`)**: Automated professor double-booking and room constraint solver.
- **Classroom IoT Environment & Air Quality (`/dashboard/admin/iot-sensors`, `/api/admin/iot`)**: CO2 ppm, temperature, and automated HVAC triggers.
- **Alumni Endowment Trust Fund (`/dashboard/admin/endowment`, `/api/admin/endowment`)**: Institutional endowment grants and fellowship allocations.
- **Cyber Forensic Audit Log Filter (`/dashboard/admin/audit-inspector`, `/api/admin/audit-logs`)**: Immutable RBAC activity log inspector.

### 👨‍👩‍👧 Parent Engagement & Child Safety
- **Parent-Teacher Meeting Video Booking (`/dashboard/parent/ptm`, `/api/parent/ptm`)**: 1-on-1 progress consultations with mentors.
- **Student Safety Geofence & Check-In Timeline (`/dashboard/parent/safety`, `/api/parent/safety`)**: Turnstile logs and curfew compliance alerts.
- **Hostel Mess Nutrition & Dietary Preferences (`/dashboard/parent/mess`, `/api/parent/mess`)**: Daily meal nutrition rater and allergy preferences.

### 🧩 Shared Components & Infrastructure
- **Web Audio Sound Effects Engine (`lib/soundEffects.ts`, `components/shared/SoundEffectsToggle.tsx`)**: Lightweight synthesized audio feedback.
- **Offline Data Sync Engine (`lib/offlineSync.ts`, `components/shared/OfflineSyncIndicator.tsx`)**: Offline-first mutation queue with automatic online sync.
- **Official Academic Transcript Generator (`lib/transcriptGenerator.ts`, `/api/certificates/generate-pdf`)**: Vector printable transcript exporter.
- **Server Latency Profiler & System Diagnostics (`lib/profiler.ts`, `lib/systemDiagnostics.ts`)**: Real-time latency benchmarking and memory telemetry.
- **Automated API Verification Suite (`scripts/verify-endpoints.ts`)**: 35/35 endpoint automated assertions with 100% pass rate.

---

## [3.1.0] - 2026-08-26

### 🌐 Global Accessibility & Universal Inclusivity
- **Global Floating Accessibility Suite (`components/shared/AccessibilityToolbar.tsx`)**: High Contrast Mode toggle, Dyslexic-friendly font spacing, Text Size Scaler (85% - 130%), and Reduce Animation Motion mode with persistent local storage preferences across all portals.

### 📅 Events & Calendar Integration
- **Events Calendar Sync & RSVP Tracker (`/dashboard/student/events`)**: iCalendar (.ics) export for Google/Apple/Outlook calendars, 3-state RSVP selector (Going, Interested, Not Going), and personal event bookmarking.

### 📊 Faculty Academic Operations & Attendance Radar
- **Automated Attendance Analytics & Defaulter Alert System (`/dashboard/faculty/attendance`)**: Defaulter threshold radar (<75%), 1-click batch parent SMS notification dispatcher, and roster filter tabs (All, Regular, Defaulters).
- **Faculty Voice Audio Memo Recorder (`components/shared/VoiceNotesModal.tsx`, `/dashboard/faculty/notes`)**: Quick audio notes recorder with simulated AI transcription for classroom notes.

### 🤖 AI Study & Career Tools
- **AI Study Flashcards Arena & Leitner Spaced Repetition (`/dashboard/student/study-planner`)**: 3D interactive flashcard flipping with Leitner boxes (Review / Good / Mastered) and dynamic accuracy scoring.
- **Resume ATS Score Analyzer & Keyword Optimizer (`/dashboard/student/resume-builder`, `/api/ai/resume-analyzer`)**: Target industry role matcher (Full Stack, AI/ML, DevOps, Data Science, Cyber) with clickable missing keyword chips and live score breakdown.

### 🏛️ Admin Disaster Recovery & Platform Security
- **Automated Backup & Disaster Recovery Simulator (`/dashboard/admin/system-health`, `/api/system-health`)**: Encrypted SHA-256 database snapshots, RTO (< 15 mins), RPO (< 1 hr), and simulated disaster failover testing.
- **Two-Factor Authentication (2FA) Setup & Recovery Codes (`/dashboard/admin/settings`)**: Google/Microsoft Authenticator TOTP QR setup with manual secret key, 8 emergency one-time backup recovery codes, and active device sessions manager.

### 🥪 Smart Cafeteria & Dining Pass
- **Digital Meal QR Coupon & Live Queue System (`/dashboard/student/cafeteria`)**: Express pickup time slot selector (15-min to 60-min intervals), live queue serving token indicator (#408), and digital QR meal coupon voucher pass.

### 👨‍👩‍👧 Parent Academic Trajectory & Competency Benchmarks
- **Subject Competency & Class Average Benchmark (`/dashboard/parent`)**: Subject-wise percentile comparison against semester batch average, printable Term Progress Card download, and Faculty Mentor Advisor remarks.

### 📚 Library & Inter-Campus Loans
- **Digital Book Lending Extension & Inter-Library Loan Tracker (`/dashboard/student/library`)**: 14-day loan auto-renewal, simulated ISBN barcode scanner, and Inter-Library Loan courier request workflow from partner universities.

### 🌿 Student Health, Wellness & Peer Empathy
- **Anonymous Peer Support Wall & 4-7-8 Neuro-Calm Breathing (`/dashboard/student/wellness`)**: Scientifically-guided 4-7-8 animated breathing timer (Inhale 4s, Hold 7s, Exhale 8s) and moderated anonymous peer encouragement message wall.

### 🚌 Campus Shuttle GPS Radar & Lost-Found
- **Live Campus Shuttle Spatial Telemetry & Proximity Alerts (`/dashboard/student/transport`)**: 2D waypoint radar map with moving bus marker, stop arrival proximity notifications, and in-shuttle Lost & Found inquiry reporter.

### 🏆 Campus Gamification & Achievement Badges
- **Campus Quest & Achievement Badges Arena (`/dashboard/student`)**: Level 4 Scholar XP progress bar (1,450 XP), unlocked milestone badges (Attendance Sentinel, Early Bird Solver, Bibliophile), and daily quests.

### 🏠 Hostel Living & Roommate Covenant
- **Roommate Living Agreement & Digital Night-Out Pass (`/dashboard/student/hostel`)**: Signed mutual living covenant (quiet hours, sleep schedule, chore rotation, guest policy) and digital parent-notified Night-Out gate pass application.

### 🤝 Alumni InMail & Mentorship
- **Alumni Industry Domain Filters & Direct InMail Outreach (`/dashboard/student/alumni`)**: Filter alumni by FAANG, AI/ML, FinTech, and Startups with direct InMail outreach and 1:1 Google Meet booking.

### 🎪 Student Clubs Budget Grants
- **Club Event Budget Grant Proposal Portal (`/dashboard/student/clubs`)**: SAC funding application workflow for hackathons and symposiums with live multistage approval tracking.

### 💬 Discussion Forum Code Sandbox
- **Code Snippet Runner & Sandbox (`/dashboard/student/discussion`)**: Formatted C++/Python/JavaScript syntax rendering with 1-click clipboard copy and console output execution preview.

### 🧪 Automated End-to-End Test Suite
- **Comprehensive API Verification Suite (`scripts/verify-endpoints.ts`)**: 11/11 automated endpoint health checks validating clubs, transport, gatepass, system health, DR simulation, feedback, budget, cafeteria, alumni, wellness, and hostel routes.

---

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

---

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
