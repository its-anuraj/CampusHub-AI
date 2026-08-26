# 🎓 CampusHub AI – Enterprise Autonomous Campus Operating System (Release v3.1.0)

> **AI-Powered Autonomous Operating System for Modern Higher Education & University Campuses**  
> One unified, multi-tenant, cloud-native platform for **Students, Faculty, University Administration, and Parents** across Web, PWA, and Mobile.

---

## 🌟 Major Highlights & Production Features (v3.1.0)

- ⚡ **Next.js 16.3 (Turbopack) & React 19** with App Router architecture & TypeScript strictness.
- ♿ **Global Accessibility Suite**: High Contrast Mode, Dyslexic Spacing, and 85%-130% Text Scaler toolbar.
- 🤖 **AI Study Flashcards & Leitner Spaced Repetition**: 3D flip card memory trainer with accuracy scoring.
- 📄 **Resume ATS Score Analyzer & Keyword Optimizer**: Real-time role-based keyword gap analysis.
- 🛡️ **Admin Automated Backup & Disaster Recovery Simulator**: Encrypted SHA-256 database snapshots & RTO/RPO failover testing.
- 🔐 **Two-Factor Authentication (2FA) & Recovery Codes**: Google/Microsoft Authenticator TOTP and emergency backup codes.
- 🥪 **Smart Cafeteria & QR Meal Passes**: Kitchen queue token simulator (#408) and express pickup times.
- 👨‍👩‍👧 **Parent Academic Trajectory & Competency Benchmarks**: Subject-wise class percentile comparison & printable progress cards.
- 📚 **Digital Library & Inter-Campus Loans**: 14-day loan renewal, ISBN scanner, and Inter-Library Loan courier tracker.
- 🌿 **Student Wellness Sanctuary & 4-7-8 Breathing**: Neuro-calm breathing animation & anonymous peer support wall.
- 🚌 **Live Campus Shuttle GPS Radar**: Spatial route telemetry, waypoint tracker, proximity alarms, and in-shuttle Lost & Found.
- 🏆 **Campus Quest & Achievement Badges**: Gamified level progression, academic XP, and milestone badges.
- 🏠 **Hostel Living & Roommate Covenant**: Signed roommate living agreements & digital Night-Out pass requests.
- 🤝 **Alumni InMail & Mentorship**: Industry domain filtering (FAANG, AI, FinTech) & 1:1 Google Meet booking.
- 🎪 **Student Clubs Budget Grants**: SAC funding proposal application workflow with multi-stage approval tracker.
- 💬 **Discussion Forum Code Sandbox**: Formatted syntax highlighter and runnable code snippet executor.
- 🧪 **Automated API Health & Endpoint Test Suite**: 11/11 automated endpoint test suite passing in sub-50ms.

---

## 🚀 Quick Setup & Run

### Prerequisites
- Node.js >= 18.x / 20.x
- npm / yarn / pnpm / bun

### Installation
```bash
# 1. Clone repository
git clone https://github.com/its-anuraj/CampusHub-AI.git
cd CampusHub-AI

# 2. Install dependencies
npm install

# 3. Synchronize Database & Generate Prisma Client
npx prisma db push
npx prisma db seed # or npm run prisma:seed

# 4. Verify API Health Test Suite (11/11 Tests)
npm run test:endpoints

# 5. Start Local Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🔑 Demo Access Accounts

| Role | Email | Password | Primary Capabilities |
|------|-------|----------|----------------------|
| **Student** | `student@campushub.edu` | `student123` | Digital ID, Timetable, Outpass, Clubs, Placement, Library, Quests |
| **Faculty** | `faculty@campushub.edu` | `faculty123` | Attendance QR, Defaulter Alerts, Voice Memos, Research Grants |
| **Admin** | `admin@campushub.edu` | `admin123` | 2FA Security, Disaster Recovery, System Health, NIRF Reports, SOS Siren |
| **Parent** | `parent@campushub.edu` | `parent123` | Competency Radar, Progress Cards, 0% EMI Fee Planner, Bus GPS Radar |

---

## 🧪 Verification & Quality Control

To execute the automated API health and endpoint verification suite:
```bash
npm run test:endpoints
```

To run TypeScript verification:
```bash
npx tsc --noEmit
```

---

*Built with ❤️ for High-Performance Modern Higher Education.*  
*CampusHub AI © 2026. All rights reserved.*
