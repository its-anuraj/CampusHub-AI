# 🎓 CampusHub AI – Enterprise Autonomous Campus Operating System (Release v3.0.0)

> **AI-Powered Autonomous Operating System for Modern Higher Education & University Campuses**  
> One unified, multi-tenant, cloud-native platform for **Students, Faculty, University Administration, and Parents** across Web, PWA, and Mobile.

---

## 🌟 Major Highlights & Production Features

- ⚡ **Next.js 16.3 (Turbopack) & React 19** with App Router architecture & TypeScript strictness.
- 📱 **Progressive Web App (PWA)** with offline service worker, app manifest, and instant installability.
- 🤖 **AI Study Planner, Pomodoro Engine & Exam Question Predictor** with ambient focus audio soundscapes.
- 🪪 **Smart Digital ID Card & Gate Outpass** with flip card badges, NFC turnstile simulator, and security QR generation.
- 📊 **Faculty Interactive Gradebook & Attendance Terminal** with CSV bulk marks upload and rotating QR classroom scanner.
- 🚌 **Live GPS Campus Bus & Transit Tracker** with telemetry radars and digital bus pass renewal.
- 🏫 **Student Clubs & Communities Hub** with category directories, lead rosters, and application modals.
- 💬 **360-Degree Anonymous Course & Faculty Feedback Portal** with NAAC/NIRF compliance analytics.
- 📈 **Institutional Accreditation & NIRF Metrics Reporting Dashboard** (TLR, RPC, GO, OI, SFR breakdown).
- 🛠️ **Admin System Telemetry & Health Console** with memory heap graphs, database ping, and cache purge actions.
- 💰 **Departmental Budget Allocation & CapEx Requisitions Console** with CFO approval workflows.
- 💳 **Parent Real-Time Fee EMI & Installment Payment Calculator** with UPI QR simulation and printable receipts.
- 🥪 **Smart Cafeteria & Pre-Ordering Hub** with nutrition calorie trackers and daily mess quality feedback.
- 🏆 **Hackathon Arena & Team Matcher** with GitHub repository submissions and jury evaluations.
- 💼 **Career Services & AI Mock Technical Interview Simulator** with keyword grading and ATS resume matching.
- 📚 **Digital Library Hub & E-Book Reader** with 48h shelf reservations and overdue fine calculations.
- 🌦️ **Campus Live Microclimate Weather & AQI Telemetry Widget**.
- ⌨️ **Quick Keyboard Shortcuts Modal (`Shift + ?`) & Command Palette (`⌘K`)**.
- 🔔 **Global Sliding Notification Drawer** with category filters and audio alerts.
- 🔒 **Forensic Security Audit Logs & AI Anomaly Intelligence Detector**.

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

# 4. Verify API Health Test Suite
npm run test:endpoints

# 5. Start Local Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🔑 Demo Access Accounts

| Role | Email | Password | Primary Capabilities |
|------|-------|----------|----------------------|
| **Student** | `student@campushub.edu` | `student123` | Digital ID, Timetable, Outpass, Clubs, Placement, Library, E-Books |
| **Faculty** | `faculty@campushub.edu` | `faculty123` | Attendance QR Projector, Gradebook Moderation, Research Grants |
| **Admin** | `admin@campushub.edu` | `admin123` | System Health, NIRF Reports, Audit Logs, Department Budgets, SOS Siren |
| **Parent** | `parent@campushub.edu` | `parent123` | Attendance Alerts, 0% EMI Fee Planner, Live Bus GPS Radar, PTM |

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
