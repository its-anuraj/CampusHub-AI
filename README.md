# 🎓 CampusHub AI – Enterprise Smart Campus Operating System

> **AI-Powered Autonomous Operating System for Higher Education Institutions**  
> One unified multi-tenant platform for **Students, Faculty, Administration, and Parents** on Web and Mobile.

---

## 🌟 Highlights & Architecture

- ⚡ **Next.js 16 (Turbopack) & React 19** with App Router
- 🤖 **AI Academic Tutor & Exam Assistant** with latex/code formatting
- 🔍 **Global Spotlight Command Palette (`Ctrl+K` / `⌘K`)** for instant cross-portal navigation
- 🪪 **Smart Digital ID Card** with flip animation, NFC turnstile simulator & QR verification
- 📚 **Integrated Library Catalog & Book Loans** with real-time stock management
- ⏱️ **AI Study Planner & Pomodoro Focus Engine** with streak counters
- 📅 **Interactive Timetable** with live ongoing class indicator & `.ics` calendar sync
- 💬 **Campus Peer Discussion Forum** with upvotes, tags, and anonymous posting
- 🎫 **Grievance Ticketing System** with SLA tracking & admin resolution workflows
- 💳 **Online Fee Payment Simulator** with printable and downloadable official PDF receipts
- 💼 **Placement Portal** with AI resume match score & CGPA cutoff verification
- 📊 **Faculty Marks & Gradebook Entry** with automatic GPA/SGPA letter calculation
- 📂 **Course Lecture Materials & Notes Repository** with download analytics
- 🔄 **Faculty Class Substitution Request & Coverage Workflow**
- 🏛️ **13 Academic Departments Console** with budget tracker & student:faculty load ratios
- 🛡️ **Security Audit Logs & Activity Monitor** with severity filters & CSV export
- ⚙️ **Campus System Settings** with maintenance mode & attendance threshold guardrails
- 👥 **Bulk User Onboarding** with downloadable CSV templates & live validation
- 🚌 **Live GPS Campus Bus & Transport Tracking Simulator** for parents
- 🤝 **Parent-Teacher Meeting (PTM) Scheduler** with Google Meet integration
- 🎨 **Campus Theme Accent Customizer** (Indigo, Emerald, Violet, Rose, Amber)
- 🔔 **Glassmorphic Toast Notification System**
- 🔒 **API Rate Limiting, Input Sanitization & Robust Response Payloads**

---

## 🚀 Quick Setup & Run

### Prerequisites
- Node.js >= 18.x
- npm / yarn / pnpm

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/its-anuraj/CampusHub-AI.git
cd CampusHub-AI

# 2. Install dependencies
npm install

# 3. Setup SQLite Database & Seed Data
npx prisma db push
npm run prisma:seed # or npx tsx prisma/seed.ts

# 4. Start Local Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **👑 Admin (Superuser)** | `ajsinghindolia@gmail.com` | `12345678` |
| **👨‍🏫 Faculty** | `priya.sharma@campushub.edu` | `12345678` |
| **🎓 Student** | `anuraj.singh@campushub.edu` | `12345678` |
| **👨‍👩‍👧 Parent** | `rajesh.singh@parent.campushub.edu` | `12345678` |

---

## 📂 Project Structure

```
├── app/
│   ├── api/                  # RESTful API Endpoints (Auth, Library, Marks, Logs, Complaints, Discussion, etc.)
│   ├── dashboard/
│   │   ├── admin/            # Admin console (Users, Depts, Logs, Settings, Reports, Placements, Fees)
│   │   ├── faculty/          # Faculty portal (Attendance, Marks, Notes, Schedule, Assignments)
│   │   ├── parent/           # Parent dashboard (Transport, PTM, Marks, Attendance, Fees)
│   │   └── student/          # Student suite (Study Planner, ID Card, Timetable, Forum, Library, AI Chat)
│   ├── login/ & signup/      # Authentication & Google GIS / Mobile OTP verification
│   └── layout.tsx            # Global Root Layout with Theme & Toast Providers
├── components/
│   └── shared/               # Universal UI Components (CommandPalette, Header, Sidebar, Toast, Modals)
├── lib/                      # Core business logic (DB, Auth, Rate Limiting, CSV Export, Sanitize)
├── prisma/                   # SQLite schema & database seeders
└── types/                    # TypeScript interfaces
```

---

## 📜 License
Licensed under the [MIT License](LICENSE).
