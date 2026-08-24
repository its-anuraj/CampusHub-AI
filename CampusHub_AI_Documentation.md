# CampusHub AI – Complete Project Documentation

> **AI-Powered Smart Campus Operating System**  
> One platform for Students, Faculty, Admin, and Parents  
> Web App + Android/iOS Mobile App

---

## 📋 Table of Contents

1. [What is CampusHub AI?](#what-is-campushub-ai)
2. [Problem it Solves](#problem-it-solves)
3. [Who Uses It?](#who-uses-it)
4. [How it Works](#how-it-works)
5. [Features by Role](#features-by-role)
6. [Tech Stack](#tech-stack)
7. [Architecture](#architecture)
8. [Setup & Run](#setup--run)
9. [Demo Credentials](#demo-credentials)
10. [Database Schema](#database-schema)
11. [API Documentation](#api-documentation)
12. [Mobile App](#mobile-app)
13. [AI Features](#ai-features)
14. [Future Roadmap](#future-roadmap)
15. [Project Structure](#project-structure)

---

## 🎯 What is CampusHub AI?

**CampusHub AI** is a production-ready, enterprise-grade SaaS platform designed to digitize and unify the entire campus experience for educational institutions.

Instead of using:
- WhatsApp groups for notices
- Excel sheets for attendance
- Physical registers for library
- Phone calls for fee reminders
- PDFs for timetables

**Everything is now in ONE platform** — available on Web and Mobile.

---

## 🔥 Problem it Solves

### Current Situation (Most Colleges):
| Problem | Impact |
|---------|--------|
| Multiple disconnected portals | Students miss important information |
| Attendance on paper registers | Manual errors, no AI predictions |
| WhatsApp for notices | Important info buried in chats |
| PDFs for timetables | Hard to navigate on mobile |
| No parent visibility | Parents unaware of child's progress |
| Separate placement websites | Students miss company deadlines |
| No AI assistance | Students can't get instant help |

### CampusHub AI Solution:
✅ One login → Role-based dashboard  
✅ Real-time notifications for everything  
✅ AI-powered attendance prediction  
✅ Parents can monitor children in real-time  
✅ Placement drives with eligibility check  
✅ AI chat assistant for study help  
✅ Works on Web, Android, and iOS  

---

## 👥 Who Uses It?

### 🟢 Students
Primary users who interact daily for academic activities.

**When they use it:**
- Every morning to check today's classes
- Before exams to see syllabus and schedule
- To submit assignments before deadlines
- To track attendance and get AI warnings
- To apply for placement drives
- To pay fees online
- To ask AI assistant for study help

### 🟡 Faculty
Teachers and professors managing academic activities.

**When they use it:**
- Every class to mark attendance (mobile or web)
- To upload assignments and set deadlines
- To grade submitted work
- To monitor class performance analytics
- To post notices for students
- To upload study materials

### 🔴 Admin
College administration managing the entire institution.

**When they use it:**
- Daily to monitor campus-wide analytics
- To onboard new students and faculty
- To manage fee collections and send reminders
- To post official notices
- To resolve student complaints
- To coordinate placement drives
- To generate reports for management

### 🔵 Parents
Parents monitoring their child's academic progress.

**When they use it:**
- Weekly to check attendance percentage
- Before exams to see upcoming exam schedule
- When fee payment is due
- To message faculty about concerns
- To track school bus location
- To review marks and assignments

---

## ⚙️ How it Works

```
User opens App (Web or Mobile)
           ↓
     Login Screen
     (Same for all roles)
           ↓
  Enter credentials / 
  Select Role Demo Card
           ↓
  Authentication (JWT)
           ↓
  Role Detection
  ┌─────┬──────┬───────┬────────┐
  │ STU │ FAC  │ ADMIN │ PARENT │
  └─────┴──────┴───────┴────────┘
           ↓
  Role-Specific Dashboard
           ↓
  Real-time Notifications (Socket.IO)
           ↓
  AI Suggestions
           ↓
  User Takes Action
           ↓
  API Call → Backend (Node.js)
           ↓
  Database Update (PostgreSQL)
           ↓
  Real-time Update to all relevant users
           ↓
  Analytics Dashboard Updated
```

---

## 🌟 Features by Role

### 🎓 Student Features

#### Dashboard
| Feature | Description |
|---------|-------------|
| Attendance % | Real-time attendance with AI prediction |
| Today's Classes | Color-coded by type (Lecture/Lab/Tutorial) |
| CGPA Display | Current CGPA with semester comparison |
| Pending Assignments | Count with urgent indicators |
| Upcoming Exams | Days remaining counter |
| AI Suggestion Banner | Smart alerts from AI about attendance, deadlines |

#### Academics
| Module | Capabilities |
|--------|-------------|
| **Timetable** | Weekly/Daily view, color-coded class types, today indicator |
| **Attendance** | Subject-wise %, AI prediction, daily log, export |
| **Assignments** | View, filter, submit, track grades, feedback |
| **Notices** | Browse, filter by category, bookmark, search |
| **Results** | Marks, CGPA, grade analysis, charts |
| **Library** | Search books, check availability, borrow/return |

#### Career
| Module | Capabilities |
|--------|-------------|
| **Placement Portal** | Company listings, eligibility check, apply, track status |
| **Discussion Forum** | Post questions, reply, like, anonymous posting, tags |
| **AI Chat** | Ask doubts, generate notes, study plans, code help |

#### Services
| Module | Capabilities |
|--------|-------------|
| **Fee Management** | View dues, pay online, download receipts |
| **Complaints** | Submit, track status, get resolution |
| **Digital ID Card** | QR code, barcode, download |

---

### 👩‍🏫 Faculty Features

#### Dashboard
| Feature | Description |
|---------|-------------|
| Classes Today | Today's schedule with room details |
| Attendance Pending | Count of classes not yet marked |
| Pending Grading | Count of ungraded submissions |
| Avg Class Attendance | Across all subjects |

#### Teaching Tools
| Module | Capabilities |
|--------|-------------|
| **Attendance** | Mark P/A/L per student, bulk actions, save, history |
| **Assignments** | Create, set deadlines, view submissions, grade, feedback |
| **Notes Upload** | Upload PDFs, presentations, videos |
| **Notices** | Post department/class-specific notices |

#### Student Management
| Module | Capabilities |
|--------|-------------|
| **Student List** | View all enrolled students, contact |
| **Analytics** | Class performance charts, subject-wise trends |
| **Marks & Results** | Enter marks, auto-calculate grades |

---

### 🏢 Admin Features

#### Overview Dashboard
| Metric | Source |
|--------|--------|
| Total Students | Live count |
| Faculty Members | Active faculty |
| Fee Collection | Monthly/semester |
| Today's Attendance | Campus-wide % |
| Active Complaints | Pending resolution |
| Students Placed | Placement statistics |

#### Management Modules
| Module | Capabilities |
|--------|-------------|
| **User Management** | Add/edit/deactivate students, faculty, parents |
| **Departments** | Create, manage, assign HODs |
| **Notice Broadcast** | Create, pin, categorize, send to specific groups |
| **Placement Management** | Add companies, set eligibility, track applications |
| **Fee Management** | View collections, send reminders, generate reports |
| **Complaints** | View, assign, resolve, track SLA |
| **Analytics** | Charts for enrollment, attendance, revenue, placement |
| **Audit Logs** | Every action tracked with timestamp and user |

---

### 👨‍👩‍👦 Parent Features

| Feature | What they see |
|---------|--------------|
| Child's Attendance | Real-time % with AI risk alerts |
| Academic Performance | CGPA, marks, grade trends |
| Assignments | What's pending, submitted, graded |
| Fee Status | Due amount, payment history |
| Bus Tracking | Live GPS location |
| Faculty Chat | Direct messaging with teachers |
| Exam Schedule | Upcoming exams with subjects |
| Notices | Important school notices |

---

## 🛠️ Tech Stack

### Web Application
```
Framework:    Next.js 15 (App Router)
Language:     TypeScript
Styling:      TailwindCSS v4
UI Library:   Radix UI (headless components)
Animations:   Framer Motion
Charts:       Recharts
Icons:        Lucide React
State:        Zustand + React Query (TanStack)
Forms:        React Hook Form + Zod validation
Auth:         NextAuth.js v5 (JWT + RBAC)
```

### Mobile Application (Android + iOS)
```
Framework:    React Native + Expo
Language:     TypeScript
Styling:      NativeWind (TailwindCSS for RN)
Navigation:   Expo Router (file-based)
State:        Zustand + React Query
Auth:         Expo SecureStore + JWT
Notifications: Expo Notifications + FCM
Maps:         Expo Maps + Google Maps API
Camera:       Expo Camera (for QR scanning)
```

### Backend API
```
Runtime:      Node.js (v20+)
Framework:    Express.js / NestJS
Language:     TypeScript
Database:     PostgreSQL (primary)
ORM:          Prisma ORM
Cache:        Redis
Real-time:    Socket.IO
Queue:        BullMQ (background jobs)
Auth:         JWT + Refresh Tokens
Validation:   Zod
Docs:         Swagger (OpenAPI)
```

### AI & Integrations
```
AI Chat:      Google Gemini API
PDF OCR:      Google Vision API
Speech:       Whisper (OpenAI)
Notifications: Firebase Cloud Messaging
Email:        SendGrid / Nodemailer
SMS:          Twilio
Payments:     Razorpay / Stripe
Storage:      Cloudinary / AWS S3
Maps:         Google Maps API
```

### Infrastructure
```
Web Hosting:    Vercel
API Hosting:    Railway / Render
Database:       Supabase / Railway (PostgreSQL)
Cache:          Upstash (Redis)
CI/CD:          GitHub Actions
Containers:     Docker + Docker Compose
CDN:            Cloudflare
SSL:            Auto-managed
```

---

## 🏗️ Architecture

### Monorepo Structure
```
CampusHub_AI/
├── apps/
│   ├── web/                    ← Next.js 15 Website
│   │   ├── app/
│   │   │   ├── login/          ← Login page
│   │   │   └── dashboard/      ← Role-based dashboards
│   │   │       ├── student/    ← 10+ student pages
│   │   │       ├── faculty/    ← 8+ faculty pages
│   │   │       ├── admin/      ← 8+ admin pages
│   │   │       └── parent/     ← 7+ parent pages
│   │   ├── components/
│   │   │   ├── shared/         ← Sidebar, Header, etc.
│   │   │   └── charts/         ← Chart components
│   │   ├── lib/
│   │   │   ├── auth.ts         ← Auth utilities
│   │   │   ├── mockData.ts     ← Demo data
│   │   │   └── utils.ts        ← Utility functions
│   │   └── types/
│   │       └── index.ts        ← All TypeScript types
│   │
│   └── mobile/                 ← Expo (React Native)
│       ├── app/
│       │   ├── (auth)/         ← Login screen
│       │   └── (tabs)/         ← Role-based tabs
│       └── ...
│
├── packages/
│   ├── shared/                 ← Shared types, API calls
│   └── ui/                     ← Shared components
│
└── backend/                    ← Node.js API server
    ├── src/
    │   ├── routes/             ← API route handlers
    │   ├── controllers/        ← Business logic
    │   ├── middleware/         ← Auth, validation, logging
    │   ├── services/           ← Database services
    │   └── ai/                 ← AI integration
    └── prisma/
        └── schema.prisma       ← Database schema
```

### Data Flow
```
Client (Web/Mobile)
      ↓ HTTP Request (with JWT)
API Gateway / NGINX
      ↓
Express.js Routes
      ↓
Auth Middleware (JWT verification + Role check)
      ↓
Controller (business logic)
      ↓
Service Layer (Prisma ORM)
      ↓
PostgreSQL Database
      ↓
Redis Cache (for frequent reads)
      ↓
Response → Client
      ↓
Socket.IO emit (for real-time updates)
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- PostgreSQL (or use SQLite for demo)
- Redis (optional for demo)
- Git

### Quick Start (Demo Mode)

```bash
# 1. Clone/Open the project
cd CampusHub_AI

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:3000
```

### Production Setup

```bash
# 1. Copy environment variables
cp .env.example .env.local

# 2. Configure your .env.local:
DATABASE_URL="postgresql://user:password@localhost:5432/campushub"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
CLOUDINARY_URL="your-cloudinary-url"
REDIS_URL="your-redis-url"

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed demo data
npx prisma db seed

# 5. Start development
npm run dev

# 6. Build for production
npm run build
npm start
```

---

## 🔑 Demo Credentials

> **Use these to instantly test all roles without registration!**

| Role | Email | Password | Color |
|------|-------|----------|-------|
| 🔴 **Admin** | admin@campushub.ai | Admin@123 | Red/Orange |
| 🟢 **Faculty** | faculty@campushub.ai | Faculty@123 | Green |
| 🔵 **Student** | student@campushub.ai | Student@123 | Blue |
| 🟣 **Parent** | parent@campushub.ai | Parent@123 | Purple |

### Quick Login
On the login page, click any **role card** (Student/Faculty/Admin/Parent) to auto-fill credentials and click Sign In.

---

## 🗄️ Database Schema

### Core Tables
```sql
-- Users (all roles)
users: id, name, email, password_hash, role, avatar, phone, created_at

-- Students (extends users)
students: user_id, roll_number, department, year, semester, section, cgpa, backlogs, parent_id

-- Faculty
faculty: user_id, employee_id, department, designation

-- Departments
departments: id, name, hod_id, description

-- Subjects
subjects: id, name, code, department_id, credits, type

-- Attendance
attendance: id, student_id, subject_id, date, status (PRESENT/ABSENT/LATE), marked_by

-- Assignments
assignments: id, title, description, subject_id, faculty_id, due_date, total_marks, file_url

-- Submissions
submissions: id, assignment_id, student_id, file_url, submitted_at, marks, feedback, status

-- Notices
notices: id, title, content, category, priority, department, is_pinned, created_by, created_at

-- Fees
fees: id, student_id, type, amount, due_date, paid_date, status, receipt_no

-- Library
books: id, title, author, isbn, subject, total_copies, available_copies
borrows: id, book_id, student_id, borrowed_at, due_date, returned_at

-- Placements
companies: id, name, role, package, eligibility_json, deadline, status
applications: id, company_id, student_id, status, applied_at

-- Complaints
complaints: id, title, description, category, status, student_id, created_at

-- Discussions
posts: id, title, content, author_id, is_anonymous, tags, created_at
replies: id, post_id, content, author_id, created_at

-- Chat (AI history)
ai_chats: id, user_id, messages_json, created_at

-- Notifications
notifications: id, user_id, title, message, type, is_read, created_at

-- Audit Logs
audit_logs: id, user_id, action, resource, metadata, ip_address, created_at
```

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:3001/api/v1
Production:  https://api.campushub.ai/v1
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

#### Auth
```
POST   /auth/login          → Login and get JWT
POST   /auth/refresh        → Refresh access token
POST   /auth/logout         → Invalidate session
POST   /auth/forgot-password → Send reset email
```

#### Student
```
GET    /student/dashboard   → Dashboard stats
GET    /student/attendance  → Attendance records
GET    /student/attendance/prediction → AI prediction
GET    /student/assignments → List assignments
POST   /student/assignments/:id/submit → Submit assignment
GET    /student/timetable   → Weekly timetable
GET    /student/notices     → Notices (filtered)
GET    /student/fees        → Fee records
POST   /student/fees/:id/pay → Pay fee
GET    /student/placement/companies → Company listings
POST   /student/placement/apply/:id → Apply to company
```

#### Faculty
```
GET    /faculty/dashboard       → Dashboard stats
GET    /faculty/classes         → Today's classes
POST   /faculty/attendance      → Mark attendance
GET    /faculty/attendance/:subject → Attendance history
POST   /faculty/assignments     → Create assignment
GET    /faculty/assignments/:id/submissions → View submissions
POST   /faculty/submissions/:id/grade → Grade submission
POST   /faculty/notices         → Create notice
```

#### Admin
```
GET    /admin/dashboard         → Campus-wide stats
GET    /admin/users             → List all users
POST   /admin/users             → Create user
PUT    /admin/users/:id         → Update user
DELETE /admin/users/:id         → Delete user
GET    /admin/analytics         → Analytics data
GET    /admin/complaints        → All complaints
PUT    /admin/complaints/:id    → Update complaint status
GET    /admin/fees/report       → Fee collection report
GET    /admin/audit-logs        → Audit trail
```

#### Student Life & Housing
```
GET    /api/hostel              → Room inventory, allocation, mess menu & maintenance
POST   /api/hostel              → Book room or submit maintenance work order
GET    /api/events              → Campus hackathons, workshops & symposiums
POST   /api/events              → RSVP & generate digital admission ticket pass
GET    /api/certificates        → List cryptographically signed academic credentials
POST   /api/certificates        → Issue verifiable certificate with SHA-256 hash
GET    /api/alumni              → Alumni directory & mentorship profiles
POST   /api/alumni              → Book 1:1 Google Meet mentorship consultation
GET    /api/lost-found          → Community lost and found item catalog
POST   /api/lost-found          → Report missing item or claim security ownership
GET    /api/scholarships        → Merit & need-based scholarship grant catalog
POST   /api/scholarships        → Submit scholarship application with CGPA verification
GET    /api/cafeteria           → Daily stall menus, pricing, and calorie counts
POST   /api/cafeteria           → Pre-order meal and generate kitchen pickup token
GET    /api/wellness            → Confidential counselors, clinic slots & 24/7 SOS
POST   /api/wellness            → Book psychologist session or log daily mood
```

#### Faculty Research & Operations
```
GET    /api/leaves              → Faculty leave quotas (CL, ML, OD) & history
POST   /api/leaves              → Apply for leave / duty or update approval status
GET    /api/research            → Research papers, citations, h-index, and active grants
POST   /api/research            → Log new IEEE/Springer journal publication
GET    /api/labs                → Supercomputer GPU clusters, 3D printers & fab equipment
POST   /api/labs                → Reserve specialized hardware / compute slot
```

#### Admin & Governance
```
GET    /api/inventory           → Capital asset ledger, barcode tags & warranty monitoring
POST   /api/inventory           → Register new hardware asset tag and valuation
GET    /api/emergency-alerts    → Active campus emergency broadcasts
POST   /api/emergency-alerts    → Trigger multichannel broadcast siren (SMS/Push/Email)
GET    /api/parent-feedback     → Parent queries, suggestions, and grievance tickets
POST   /api/parent-feedback     → Submit direct inquiry to Dean with 48h SLA
```

#### AI
```
POST   /ai/chat                 → AI chat message
POST   /ai/generate-notes       → Generate study notes
POST   /ai/generate-quiz        → Generate quiz questions
POST   /ai/summarize-pdf        → OCR + summarize PDF
POST   /ai/attendance-predict   → Predict attendance risk
POST   /ai/resume-review        → AI resume feedback
```

---

## 📱 Mobile App

### Android & iOS (React Native + Expo)

The mobile app provides the same features as the web app with native UI:

#### Features
- ✅ **Same login** as web (same API)
- ✅ **Role-based home screen** (tabs change based on role)
- ✅ **Push notifications** via Expo + Firebase
- ✅ **Offline mode** — view last cached data
- ✅ **QR Scanner** — scan attendance QR codes
- ✅ **Camera** — upload assignment files directly
- ✅ **Biometric auth** — fingerprint/Face ID
- ✅ **Dark mode** — matches system preference

#### Running the Mobile App

```bash
# Install Expo CLI
npm install -g expo-cli

# Navigate to mobile directory (when added)
cd apps/mobile

# Install dependencies
npm install

# Start Expo
npx expo start

# Scan QR code with Expo Go app on your phone
# OR press 'a' for Android Emulator, 'i' for iOS Simulator
```

#### Available on
- 📱 **Android**: via Expo Go (immediate) or build APK
- 🍎 **iOS**: via Expo Go (immediate) or build IPA
- 🔧 **TestFlight**: for iOS testing
- 🏪 **Play Store / App Store**: production deployment

---

## 🤖 AI Features

### Current (Mock Mode)
The demo app has smart mock AI responses that demonstrate all AI capabilities.

### With Gemini API Key
Add your key to `.env.local`:
```
GEMINI_API_KEY="your-key-from-google-ai-studio"
```

#### AI Modules

| Feature | Description | API Used |
|---------|-------------|----------|
| **AI Chat** | Answer doubts, explain topics | Gemini Pro |
| **Study Planner** | Personalized study schedules | Gemini Pro |
| **Notes Generator** | Convert topics to structured notes | Gemini Pro |
| **Quiz Generator** | Create MCQ tests from syllabus | Gemini Pro |
| **PDF Summarizer** | Upload PDF → get summary | Gemini + Vision |
| **Attendance Prediction** | Predict if student will miss 75% | Custom ML |
| **Risk Detection** | Identify at-risk students early | Custom ML |
| **Resume Analyzer** | Score resume, suggest improvements | Gemini Pro |
| **Mock Interview** | Simulate technical interviews | Gemini Pro |
| **Career Guidance** | Suggest career paths based on profile | Gemini Pro |

---

## 🔮 Future Roadmap

### Phase 2 (Q4 2026)
- [ ] Face Recognition Attendance (via phone camera)
- [ ] AI Proctoring for online exams
- [ ] Smart Bus Tracking with GPS
- [ ] Parent-Teacher video calls
- [ ] Hostel management module
- [ ] Canteen menu + ordering

### Phase 3 (Q1 2027)
- [ ] AR Campus Navigation
- [ ] IoT Smart Classroom integration
- [ ] Blockchain certificate verification
- [ ] Alumni portal + mentorship matching
- [ ] Campus marketplace (buy/sell)
- [ ] Mental health AI assistant

### Phase 4 (Q2 2027)
- [ ] Multi-university SaaS platform
- [ ] White-label with custom branding
- [ ] Super Admin panel (manage multiple institutions)
- [ ] VR Virtual Campus Tour
- [ ] Smart Energy Monitoring
- [ ] Digital Twin Campus Dashboard

---

## 📂 Project Structure (Current)

```
CampusHub_AI/
├── app/
│   ├── layout.tsx              ← Root layout with dark mode
│   ├── page.tsx                ← Home → auto-redirects by role
│   ├── globals.css             ← Design system + animations
│   ├── login/
│   │   └── page.tsx            ← Login with role cards
│   └── dashboard/
│       ├── layout.tsx          ← Dashboard shell (sidebar + header)
│       ├── student/
│       │   ├── page.tsx        ← Student dashboard
│       │   ├── attendance/     ← Attendance with charts
│       │   ├── assignments/    ← Assignment management
│       │   ├── timetable/      ← Weekly/daily timetable
│       │   ├── notices/        ← Notice board
│       │   ├── placement/      ← Placement portal
│       │   ├── ai-chat/        ← AI assistant
│       │   ├── fees/           ← Fee management
│       │   ├── library/        ← Library module
│       │   ├── discussion/     ← Discussion forum
│       │   └── results/        ← Academic results
│       ├── faculty/
│       │   ├── page.tsx        ← Faculty dashboard
│       │   ├── attendance/     ← Mark attendance
│       │   └── ...
│       ├── admin/
│       │   ├── page.tsx        ← Admin dashboard
│       │   ├── users/          ← User management
│       │   ├── notices/        ← Notice management
│       │   └── ...
│       └── parent/
│           └── page.tsx        ← Parent dashboard
│
├── components/
│   └── shared/
│       ├── Sidebar.tsx         ← Role-based navigation
│       └── Header.tsx          ← Search, notifications, user
│
├── lib/
│   ├── auth.ts                 ← Authentication utilities
│   ├── mockData.ts             ← Demo data for all modules
│   └── utils.ts                ← Helper functions
│
├── types/
│   └── index.ts                ← All TypeScript interfaces
│
├── public/                     ← Static assets
├── next.config.ts              ← Next.js configuration
├── tailwind.config.ts          ← Design system tokens
└── package.json                ← Dependencies
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| JWT Authentication | Access token (15min) + Refresh token (7 days) |
| Role-Based Access | Middleware checks role before every route |
| Input Validation | Zod schemas on all API inputs |
| Rate Limiting | 100 req/min per IP, 1000 per auth user |
| CORS | Strict origin whitelist |
| Helmet.js | Security headers (XSS, CSRF protection) |
| Encryption | Passwords hashed with bcrypt (salt=12) |
| Audit Logs | Every action logged with IP, user, timestamp |
| 2FA Ready | TOTP support (Google Authenticator) |

---

## 📊 Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| API Response Time | < 200ms |
| Database Query Time | < 50ms |
| Mobile App Load | < 2s |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📞 Support

- **Email**: support@campushub.ai
- **Docs**: https://docs.campushub.ai
- **Demo**: https://demo.campushub.ai

---

*Built with ❤️ for Indian Education*  
*CampusHub AI © 2026. All rights reserved.*
