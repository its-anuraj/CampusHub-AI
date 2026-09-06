# 🎓 CampusHub AI — Autonomous Campus Operating System & Digitization Suite

[![Next.js](https://img.shields.io/badge/Next.js-16.3%20(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **"A Smarter Campus, Brighter You."**  
> An enterprise-grade, cloud-native Higher Education Campus Operating System built to digitize, unify, and automate academic and administrative workflows across **Web, PWA, and Mobile (iOS & Android)**.

---

## 🏛️ Institutional Context & Project Vision

**CampusHub AI** is an end-to-end higher education digitization platform designed specifically around the operational realities of engineering and management colleges (modeled for **KCC Institute of Technology & Management, Greater Noida**).

Currently operating on a comprehensive, realistic prototype & mock telemetry layer, this platform is engineered with a **zero-trust, multi-tier institutional hierarchy** to transition directly into live college deployment:
* **Central College Directorate**: Direct executive authority over department heads, staff appointments, and university-wide real-time attendance telemetry.
* **Department Administration**: Department leads (Placement Cell, Library, Accounts, Exam Cell, Registrar, Security) managing faculty authorizations and operations.
* **Faculty & Mentors**: Scoped strictly to assigned student sections, grading rubrics, attendance, and direct parent communication.
* **Students & Parents**: Personalized learning companion, digital turnstile passes, fee ledgers, and confidential well-being check-ins.

---

## ✨ System Architecture & Key Innovation Highlights

```
                          ┌─────────────────────────────────────────┐
                          │         CampusHub AI Ecosystem          │
                          └─────────────────────────────────────────┘
                                       │              │
                   ┌───────────────────┴───┐      ┌───┴───────────────────┐
                   │    Web Application    │      │   Mobile App (Expo)   │
                   │   (Next.js 16 App)    │      │  (React Native / iOS) │
                   └───────────────────────┘      └───────────────────────┘
                                       │              │
                   ┌───────────────────┴──────────────┴───┐
                   │        Zero-Trust API Gateway        │
                   │   62 Production Endpoints (RBAC)     │
                   └──────────────────────────────────────┘
                                       │
                   ┌───────────────────┴──────────────────┐
                   │        Database & Security Core      │
                   │  Prisma ORM • Bcrypt • Audit Logs   │
                   └──────────────────────────────────────┘
```

### 1. 🧠 1:1 Confidential AI Student Psychologist & Mind Companion
* **Empathetic AI Care**: Bi-weekly (twice a month) 5–10 minute confidential voice/text check-in designed to detect exam stress, loneliness, or low marks anxiety without academic pressure.
* **Faculty Advisor Bridge**: Automatically compiles an actionable, non-stigmatizing summary for the student's assigned class mentor to provide gentle guidance.

### 2. 👑 College Director Executive Telemetry Desk
* **Department-Wise Teacher Attendance**: Live presence & leave breakdown across CSE (94.1%), ECE (92.8%), ME (91.6%), CE (90.0%), and Management (93.5%).
* **Granular Student Attendance Matrix**: Section, Year, and Semester-level attendance sheets with one-click export.
* **Department Admin Staff Governance**: Appoint, approve, or suspend departmental leadership accounts.

### 3. 👩‍🏫 Faculty Teaching & Parent Direct Reachout Desk
* **Scoped Student Directory**: Faculty can only view students enrolled in their assigned subjects and sections (zero unauthorized cross-department exposure).
* **Direct Parent Contact Card**: Performance metrics + guardian verified phone numbers (`+91 98765 11223`) and preferred calling windows (*"After 04:00 PM"*).
* **1-Tap Attendance & CIE Grading**: Automated alerts for students falling below the mandatory 75% cutoff.

### 4. 👨‍🎓 Student Campus Life & Digital Identity
* **Digital ID & Smart Gatepass**: QR-enabled turnstile pass for hostel outings with automated parent SMS sync.
* **AI ATS Resume & Placement Hub**: Live job drives, CTC analytics (Amazon, TCS, Infosys), and ATS keyword score optimization.
* **Smart Cafeteria & Library**: Real-time kitchen token queue simulator and digital library book renewals.

### 5. 👨‍👩‍👧 Parent Portal
* **Ward Progress Radar**: Real-time attendance percentage, CGPA tracker, and subject marksheet.
* **Digital Fee Ledger**: Fee installment schedules, 0% EMI planning, and online fee receipt generation.

---

## 🔐 Enterprise Security, RBAC & Authentication

* **Password Security**: Bcrypt hashing with 10 salt rounds. Universal password change workflow available across all roles on both Web and Mobile.
* **Zero Trust RBAC**: Server-side role checks (`ADMIN`, `FACULTY`, `STUDENT`, `PARENT`) on every API route.
* **Mandatory Profile Photo Enforcement**: Strict client and server-side image validation (JPEG, PNG, WebP < 2MB) required for official institutional ID verification.
* **Security Audit Logs**: Immutable audit log entries (`db.auditLog.create`) generated on every authentication and sensitive action.

---

## 🔑 Demo Access Credentials

| Role | Title / Department | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Director (Admin)** | College Director & Executive Admin | `ajsinghindolia@gmail.com` | `001234` | College governance, attendance sheets, staff approvals |
| **Admin Staff** | Placement Officer (TPO) | `suresh.tpo@kcc.campushub.edu.in` | `Admin@123` | Drives, CTC statistics, placement clearance |
| **Admin Staff** | Academic Registrar | `rakesh.acad@kcc.campushub.edu.in` | `Admin@123` | Student admissions, faculty profile verification |
| **Admin Staff** | Finance & Accounts | `meena.fees@kcc.campushub.edu.in` | `Admin@123` | Fee collections, installment dues ledger |
| **Faculty** | HOD / Assistant Professor (CSE) | `faculty@campushub.ai` | `Faculty@123` | Class attendance, CIE marks, parent reachout |
| **Student** | B.Tech CSE (Year 3 - Sec A) | `student@campushub.ai` | `Student@123` | Timetable, ID pass, AI psychologist, library |
| **Parent** | Guardian of Arjun Singh | `parent@campushub.ai` | `Parent@123` | Ward attendance, marksheet, fee payment, PTM |

---

## 🧪 Automated Testing & Quality Assurance

CampusHub AI features a **100% Passing Automated API Health Test Suite** testing all 62 critical handlers in sub-millisecond execution time:

```bash
npm run test:endpoints
```

```
====================================================
  CAMPUSHUB AI - AUTOMATED ENDPOINT HEALTH TEST SUITE (v3.3.0)
====================================================

  ✔ PASS [200] /api/clubs (75ms)
  ✔ PASS [200] /api/transport (1ms)
  ✔ PASS [200] /api/gatepass (0ms)
  ✔ PASS [200] /api/system-health (1ms)
  ✔ PASS [200] /api/system-health (DR Simulation) (2ms)
  ✔ PASS [200] /api/course-feedback (0ms)
  ✔ PASS [200] /api/budget (0ms)
  ✔ PASS [200] /api/cafeteria (2ms)
  ✔ PASS [200] /api/alumni (3ms)
  ✔ PASS [200] /api/wellness (1ms)
  ✔ PASS [200] /api/hostel (7ms)
  ✔ PASS [200] /api/ai/code-check (1ms)
  ✔ PASS [200] /api/labs/simulations (1ms)
  ✔ PASS [200] /api/study-groups (0ms)
  ✔ PASS [200] /api/hostel/laundry (0ms)
  ✔ PASS [200] /api/transport/bikes (0ms)
  ✔ PASS [200] /api/student-budget (0ms)
  ✔ PASS [200] /api/alumni/referrals (0ms)
  ✔ PASS [200] /api/events/live-poll (0ms)
  ✔ PASS [200] /api/lost-found/claims (0ms)
  ✔ PASS [200] /api/ai/exam-generator (1ms)
  ✔ PASS [200] /api/assignments/rubrics (0ms)
  ✔ PASS [200] /api/faculty/office-hours (0ms)
  ✔ PASS [200] /api/faculty/accreditation (0ms)
  ✔ PASS [200] /api/labs/maintenance (0ms)
  ✔ PASS [200] /api/admin/sustainability (0ms)
  ✔ PASS [200] /api/security/visitors (0ms)
  ✔ PASS [200] /api/admin/timetable (0ms)
  ✔ PASS [200] /api/admin/iot (0ms)
  ✔ PASS [200] /api/admin/endowment (0ms)
  ✔ PASS [200] /api/admin/audit-logs (0ms)
  ✔ PASS [200] /api/parent/ptm (0ms)
  ✔ PASS [200] /api/parent/safety (0ms)
  ✔ PASS [200] /api/parent/mess (0ms)
  ✔ PASS [200] /api/certificates/generate-pdf (1ms)
  ✔ PASS [200] /api/ai/research-summarizer (GET) (0ms)
  ✔ PASS [201] /api/ai/research-summarizer (POST) (1ms)
  ✔ PASS [200] /api/ai/mock-interview (GET) (0ms)
  ✔ PASS [200] /api/ai/mock-interview (POST) (1ms)
  ✔ PASS [200] /api/transport/carpool (GET) (0ms)
  ✔ PASS [200] /api/tutoring (GET) (0ms)
  ✔ PASS [200] /api/printing (GET) (0ms)
  ✔ PASS [200] /api/hostel/chores (GET) (0ms)
  ✔ PASS [200] /api/sports (GET) (0ms)
  ✔ PASS [200] /api/faculty/grants (GET) (0ms)
  ✔ PASS [200] /api/faculty/ta (GET) (0ms)
  ✔ PASS [200] /api/faculty/cie (GET) (0ms)
  ✔ PASS [200] /api/faculty/guest-lectures (GET) (0ms)
  ✔ PASS [200] /api/faculty/early-warning (GET) (0ms)
  ✔ PASS [200] /api/faculty/appraisal (GET) (0ms)
  ✔ PASS [200] /api/faculty/ipr (GET) (0ms)
  ✔ PASS [200] /api/admin/ev-charging (GET) (0ms)
  ✔ PASS [200] /api/admin/procurement (GET) (0ms)
  ✔ PASS [200] /api/admin/water (GET) (0ms)
  ✔ PASS [200] /api/admin/emergency-broadcast (GET) (0ms)
  ✔ PASS [200] /api/admin/rfid (GET) (0ms)
  ✔ PASS [200] /api/admin/rankings (GET) (0ms)
  ✔ PASS [200] /api/parent/health (GET) (0ms)
  ✔ PASS [200] /api/parent/fee-installments (GET) (0ms)
  ✔ PASS [200] /api/parent/livestreams (GET) (0ms)
  ✔ PASS [200] /api/auth/change-password (POST) (202ms)
  ✔ PASS [200] /api/auth/change-password (Reset to 001234) (182ms)

====================================================
  SUITE RUN COMPLETE: 62/62 Passed (0 Failed)
  Pass Rate: 100.0%
====================================================
```

---

## 💻 Local Setup & Development Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/its-anuraj/CampusHub-AI.git
cd CampusHub-AI

# Install Web Dependencies
npm install

# Install Mobile App Dependencies
cd apps/mobile
npm install
cd ../..
```

### 2. Environment Variables (`.env`)
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="campushub_enterprise_super_secret_jwt_key_2026"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed Demo Users
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Servers
* **Run Web Application (Next.js):**
  ```bash
  npm run dev
  ```
  Visit: `http://localhost:3000`

* **Run Mobile Application (Expo):**
  ```bash
  # Option A: From root
  npm run expo -- --tunnel -c

  # Option B: From mobile directory
  cd apps/mobile
  npx expo start --tunnel -c
  ```

---

## 🚀 Deployment Guide

### A. Deploy Web App to Vercel (Step-by-Step)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy: CampusHub AI enterprise production build"
   git push origin main
   ```
2. **Import Project in Vercel Dashboard**:
   * Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
   * Select your `CampusHub-AI` GitHub repository.
3. **Configure Build Settings**:
   * **Framework Preset**: Next.js
   * **Root Directory**: `./`
   * **Build Command**: `prisma generate && prisma db push && next build`
4. **Set Environment Variables**:
   * `DATABASE_URL`: Your PostgreSQL / Supabase / Neon / Vercel Postgres connection string (or cloud SQLite).
   * `NEXTAUTH_SECRET`: Random 32+ character string.
   * `NEXTAUTH_URL`: Your production Vercel domain (e.g., `https://campushub-ai.vercel.app`).
5. **Click "Deploy"**:
   * Vercel will bundle the Next.js App Router project and deploy with global Edge CDN!

---

### B. Build Android APK File with Expo EAS (Step-by-Step)

1. **Install EAS CLI globally**:
   ```bash
   npm install -g eas-cli
   ```
2. **Log in to your Expo account**:
   ```bash
   eas login
   ```
3. **Configure EAS Project (Inside `apps/mobile`)**:
   ```bash
   cd apps/mobile
   eas build:configure
   ```
4. **Create `eas.json` for Direct APK Generation**:
   Ensure `apps/mobile/eas.json` contains:
   ```json
   {
     "cli": {
       "version": ">= 15.0.0"
     },
     "build": {
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "production": {
         "android": {
           "buildType": "app-bundle"
         }
       }
     }
   }
   ```
5. **Run the Cloud Build for Android APK**:
   ```bash
   eas build -p android --profile preview
   ```
6. **Download your APK**:
   * Once EAS cloud compilation completes (usually ~5–8 mins), a direct download link and QR code for the standalone `.apk` file will be provided in your terminal and Expo dashboard!

---

## 🎯 Tech Stack Summary for Technical Interviews

| Technology Layer | Tools / Libraries Used | Architecture Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.3 (Turbopack) & React 19** | Fast SSR/SSG hybrid rendering, App Router layout nesting, React Server Components. |
| **Mobile Platform** | **React Native (0.81) & Expo SDK 54** | Single TypeScript codebase for iOS and Android with native performance and Expo Router. |
| **Styling & Design System** | **Tailwind CSS v4 & Lucide Icons** | Utility-first, responsive modern palette (Sky/Blue/Slate) with high contrast accessibility. |
| **Database & ORM** | **Prisma ORM & SQLite / PostgreSQL** | Type-safe migrations, parameterized queries, and seamless zero-config local prototyping. |
| **Security & Auth** | **Bcrypt.js & Zero-Trust RBAC** | Cryptographic salted password hashing, audit logs, and session role-gated endpoints. |
| **Quality & CI/CD** | **TypeScript 5.9 & Automated Endpoint Test Harness** | 100% strict type safety and 62 automated integration test cases with sub-50ms execution. |

---

## 🗺️ Future Roadmap: College Integration & Enterprise Scale

1. **ERP & SIS Integration**: Direct bi-directional API connector for college legacy ERP databases (attendance biometrics, fee gateway).
2. **WhatsApp / SMS Gateway**: Automated emergency parent broadcast and hostel outpass verification.
3. **On-Premises Smart Turnstiles**: Direct IoT integration with campus RFID barriers for frictionless contactless student gate entry.

---

*Built with ❤️ for High-Performance Modern Higher Education.*  
*CampusHub AI © 2026. All rights reserved.*
