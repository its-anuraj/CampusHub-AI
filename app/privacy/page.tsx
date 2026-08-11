'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Lock, Search, Printer, Copy, Check, ArrowLeft, ChevronDown, ChevronRight,
  Info, AlertTriangle, FileText, Server, UserCheck, Eye, Cpu, Database, Globe, Mail, HelpCircle
} from 'lucide-react';

const SECTIONS = [
  { id: 'introduction', label: '1. Introduction' },
  { id: 'information-collected', label: '2. Information We Collect' },
  { id: 'use-of-information', label: '3. How We Use Information' },
  { id: 'ai-services', label: '4. AI Services & Processing' },
  { id: 'cookies-tracking', label: '5. Cookies & Tracking' },
  { id: 'third-party-services', label: '6. Third-Party Services' },
  { id: 'data-storage-security', label: '7. Data Storage & Security' },
  { id: 'rbac-student-parent', label: '8. Student & Parent Privacy' },
  { id: 'institution-responsibilities', label: '9. Institution Responsibilities' },
  { id: 'compliance', label: '10. Compliance (FERPA, GDPR, CCPA)' },
  { id: 'data-retention-deletion', label: '11. Retention & Account Deletion' },
  { id: 'policy-updates-contact', label: '12. Updates & Contact Info' },
  { id: 'faqs', label: '13. Frequently Asked Questions' },
];

const FAQS = [
  {
    q: 'Does CampusHub AI sell student or institutional data to third parties?',
    a: 'No. CampusHub AI strictly maintains a zero-sale data policy. Personal, educational, and institutional data are processed exclusively to deliver campus operating services and are never sold or rented to advertisers or data brokers.'
  },
  {
    q: 'Is CampusHub AI compliant with FERPA regulations?',
    a: 'Yes. CampusHub AI acts as a School Official under the Family Educational Rights and Privacy Act (FERPA). Educational records are managed under direct control of the partner educational institution.'
  },
  {
    q: 'How is AI chat history handled?',
    a: 'AI conversations with the CampusHub AI tutor are encrypted in transit and at rest. They are processed through enterprise API tiers with OpenAI and Google Gemini that explicitly opt out of model training on user data.'
  },
  {
    q: 'Can parents view all student data?',
    a: 'Parent access is governed by institutional role permissions. Parents can view attendance percentages, official exam results, assigned homework, and fee ledgers, but cannot view private student messages or draft notes.'
  },
  {
    q: 'How can a student request complete data deletion?',
    a: 'Students can request account data deletion through their institution administrator or by submitting a verified request to privacy@campushub.ai. Official academic records remain subject to institutional retention rules.'
  }
];

export default function PrivacyPolicyPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Simple scroll spy
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + 180;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      {/* Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div className="h-full bg-blue-600 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/login" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to App
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-xs text-slate-900">CampusHub AI Privacy Center</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopyLink} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button onClick={handlePrint} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs">
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Document</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-white border-b border-slate-200 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">Official Legal Policy</span>
            <span>•</span>
            <span>Version 2.4.0</span>
            <span>•</span>
            <span>Last Updated: August 8, 2026</span>
            <span>•</span>
            <span>Est. Reading Time: 12 mins</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
            CampusHub AI is committed to safeguarding educational records and protecting personal privacy.
            This document details how educational data, personal information, and AI interactions are processed across our platform.
          </p>

          {/* Primary Guarantee Banner */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-950">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-blue-900">Our Core Privacy Guarantee:</strong> CampusHub AI never sells personal, academic, or behavioral information. We collect and process educational data solely to provide, secure, and optimize smart campus services for institutions, students, faculty, and parents.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            {/* Search inside Document */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                placeholder="Search policy..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none w-full"
              />
            </div>

            <nav className="bg-white border border-slate-200 rounded-xl p-3 shadow-card space-y-0.5 text-xs">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1">On This Page</p>
              {SECTIONS.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors leading-tight ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Legal Text Column */}
        <main className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-card space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1: Introduction */}
          <section id="introduction" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Info className="w-4 h-4" /> Section 1
            </div>
            <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
            <p>
              Welcome to <strong>CampusHub AI</strong> (“Platform”, “Service”, “We”, “Us”, or “Our”). CampusHub AI is an enterprise AI-powered Smart Campus Operating System built to integrate academic workflows, administrative operations, communication, attendance tracking, placement management, and artificial intelligence capabilities for educational institutions.
            </p>
            <p>
              This Privacy Policy explains how we collect, store, process, transfer, and protect information when students, faculty members, administrators, parents, and alumni interact with the CampusHub AI web application and mobile applications. By accessing or using the Platform, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section id="information-collected" className="scroll-mt-28 space-y-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Database className="w-4 h-4" /> Section 2
            </div>
            <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
            <p>
              We collect information necessary to deliver educational operating system services. The categories of information include:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <strong className="text-slate-900 font-semibold block text-xs">Personal Identity Information</strong>
                <p className="text-xs text-slate-600">Full name, official institution email address, profile picture, phone number, and account credentials.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <strong className="text-slate-900 font-semibold block text-xs">Academic & Enrolment Data</strong>
                <p className="text-xs text-slate-600">Roll number, registration ID, department, branch, semester, section, CGPA, grade transcripts, and backlog records.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <strong className="text-slate-900 font-semibold block text-xs">Attendance Records</strong>
                <p className="text-xs text-slate-600">Daily subject-wise presence, absence timestamps, late logs, leave requests, and faculty verification metadata.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <strong className="text-slate-900 font-semibold block text-xs">Assignment & Examination Data</strong>
                <p className="text-xs text-slate-600">Coursework uploads, PDF assignment submissions, teacher feedback, grade distributions, and mid-sem exam schedules.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <strong className="text-slate-900 font-semibold block text-xs">Device & Technical Analytics</strong>
                <p className="text-xs text-slate-600">IP address, browser type, operating system, device identifiers, session cookies, and request timestamps.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <strong className="text-slate-900 font-semibold block text-xs">AI Chat & Interaction History</strong>
                <p className="text-xs text-slate-600">Prompt queries submitted to the CampusHub AI tutor, study planner requests, and generated summary history.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="font-semibold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Location Data Policy:
              </strong>
              Location telemetry is collected <em>only</em> if the institution enables live campus bus tracking or indoor navigation, and only with explicit user permission on mobile devices.
            </div>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section id="use-of-information" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <UserCheck className="w-4 h-4" /> Section 3
            </div>
            <h2 className="text-xl font-bold text-slate-900">3. How We Use Your Information</h2>
            <p>We process collected information strictly for operational and educational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li>To provide, maintain, and personalize campus operating system dashboards for students, faculty, admin, and parents.</li>
              <li>To compute automated attendance percentages, generate AI threshold warnings, and predict attendance risk.</li>
              <li>To facilitate assignment submission workflows, grading, plagiarism evaluation, and feedback delivery.</li>
              <li>To process career placement applications and match eligible students with visiting recruiters.</li>
              <li>To calculate fee statements, process online payments via integrated gateways, and issue receipts.</li>
              <li>To send urgent campus notice alerts via push notifications, email, SMS, or in-app broadcasts.</li>
            </ul>
          </section>

          {/* Section 4: AI Services & Data Processing */}
          <section id="ai-services" className="scroll-mt-28 space-y-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Cpu className="w-4 h-4" /> Section 4
            </div>
            <h2 className="text-xl font-bold text-slate-900">4. AI Services & Data Processing</h2>
            <p>
              CampusHub AI incorporates artificial intelligence powered by leading generative models including OpenAI GPT and Google Gemini API to assist students with tutoring, study planning, note generation, and document summarization.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <strong className="text-xs font-semibold text-slate-900 block">AI Privacy Guarantee:</strong>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                <li>We utilize enterprise zero-retention API tiers with our AI providers.</li>
                <li>Your AI chat queries, student notes, and uploaded PDFs are <strong>never used to train public AI models</strong>.</li>
                <li>AI output is generated dynamically in memory and stored securely in your encrypted personal history.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Cookies & Tracking Technologies */}
          <section id="cookies-tracking" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Eye className="w-4 h-4" /> Section 5
            </div>
            <h2 className="text-xl font-bold text-slate-900">5. Cookies & Tracking Technologies</h2>
            <p>
              We use essential cookies and local browser storage to maintain session state, authentication security, and role-based access preferences.
            </p>
            <div className="space-y-1 text-xs text-slate-600">
              <p>• <strong>Essential Cookies:</strong> Required for authentication, security validation, and session continuity.</p>
              <p>• <strong>Preference Storage:</strong> Saves theme preferences, sidebar collapse states, and dashboard filters.</p>
              <p>• <strong>No Advertising Cookies:</strong> We do not deploy third-party advertising cookies or cross-site tracking scripts.</p>
            </div>
          </section>

          {/* Section 6: Third-Party Services */}
          <section id="third-party-services" className="scroll-mt-28 space-y-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Globe className="w-4 h-4" /> Section 6
            </div>
            <h2 className="text-xl font-bold text-slate-900">6. Third-Party Services</h2>
            <p>CampusHub AI integrates with vetted enterprise infrastructure providers to deliver platform services:</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">Provider</th>
                    <th className="p-2.5">Purpose</th>
                    <th className="p-2.5">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr><td className="p-2.5 font-medium text-slate-900">Google Authentication</td><td className="p-2.5">SSO Login</td><td className="p-2.5">Email, Name, Avatar</td></tr>
                  <tr><td className="p-2.5 font-medium text-slate-900">Microsoft Auth</td><td className="p-2.5">SSO Login</td><td className="p-2.5">Email, Identity Token</td></tr>
                  <tr><td className="p-2.5 font-medium text-slate-900">Firebase (FCM)</td><td className="p-2.5">Push Notifications</td><td className="p-2.5">Device Token</td></tr>
                  <tr><td className="p-2.5 font-medium text-slate-900">OpenAI & Gemini</td><td className="p-2.5">AI Tutor & Study Assistant</td><td className="p-2.5">Encrypted Text Prompt</td></tr>
                  <tr><td className="p-2.5 font-medium text-slate-900">Razorpay & Stripe</td><td className="p-2.5">Fee Payment Gateways</td><td className="p-2.5">Transaction Amount, Order ID</td></tr>
                  <tr><td className="p-2.5 font-medium text-slate-900">Cloudinary & AWS</td><td className="p-2.5">Secure Document & Image Storage</td><td className="p-2.5">Uploaded Files, Avatars</td></tr>
                  <tr><td className="p-2.5 font-medium text-slate-900">Google Maps</td><td className="p-2.5">Campus Navigation & Bus Tracking</td><td className="p-2.5">GPS Coordinates (if enabled)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Data Storage & Security */}
          <section id="data-storage-security" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Lock className="w-4 h-4" /> Section 7
            </div>
            <h2 className="text-xl font-bold text-slate-900">7. Data Storage, Encryption & Security</h2>
            <p>
              We enforce multi-layered defense-in-depth security architecture to ensure student records and institutional data remain secure against unauthorized access, alteration, or disclosure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900">Encryption in Transit & At Rest</strong>
                <p className="text-slate-600 mt-1">All data transmitted to and from CampusHub AI uses TLS 1.3 encryption. Database records are encrypted at rest using AES-256 standards.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900">Role-Based Access Control (RBAC)</strong>
                <p className="text-slate-600 mt-1">Strict RBAC boundaries ensure users can only access data authorized for their specific role (Student, Faculty, Admin, Parent).</p>
              </div>
            </div>
          </section>

          {/* Section 8: Student & Parent Privacy */}
          <section id="rbac-student-parent" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <UserCheck className="w-4 h-4" /> Section 8
            </div>
            <h2 className="text-xl font-bold text-slate-900">8. Student, Parent & Children Privacy</h2>
            <p>
              We recognize the sensitive nature of student and parent data. Parent portal access is restricted to verified guardians linked to the specific student record by the institution.
            </p>
            <p>
              For students under the age of digital consent, CampusHub AI operates under institutional authorization, where partner schools and universities provide required parental notice and consent.
            </p>
          </section>

          {/* Section 9: Institution Responsibilities */}
          <section id="institution-responsibilities" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Server className="w-4 h-4" /> Section 9
            </div>
            <h2 className="text-xl font-bold text-slate-900">9. Institution Responsibilities</h2>
            <p>
              Partner institutions retain complete ownership of their educational records. Institutions are responsible for provisioning and deprovisioning authorized user accounts, setting department permissions, and managing academic policy compliance.
            </p>
          </section>

          {/* Section 10: Compliance (FERPA, GDPR, CCPA) */}
          <section id="compliance" className="scroll-mt-28 space-y-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <FileText className="w-4 h-4" /> Section 10
            </div>
            <h2 className="text-xl font-bold text-slate-900">10. Global Regulatory Compliance</h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900">FERPA Awareness (Family Educational Rights & Privacy Act):</strong>
                <p className="text-slate-600 mt-1">CampusHub AI complies with FERPA standards. Student educational records are designated as confidential and are accessible only to authorized school officials with legitimate educational interests.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900">GDPR Compliance (General Data Protection Regulation):</strong>
                <p className="text-slate-600 mt-1">European Union users have rights to access, rectify, restrict, export, or delete their personal data processed by CampusHub AI.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900">CCPA Compliance (California Consumer Privacy Act):</strong>
                <p className="text-slate-600 mt-1">California residents are guaranteed rights to know what personal data is collected and request deletion. CampusHub AI does not sell personal information.</p>
              </div>
            </div>
          </section>

          {/* Section 11: Data Retention & Account Deletion */}
          <section id="data-retention-deletion" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Database className="w-4 h-4" /> Section 11
            </div>
            <h2 className="text-xl font-bold text-slate-900">11. Data Retention & Account Deletion</h2>
            <p>
              We retain personal and academic data for the duration of active institution enrolment plus any applicable statutory retention period specified by the educational partner.
            </p>
            <p>
              Users may request account deletion by contacting their institution administrator or emailing <a href="mailto:privacy@campushub.ai" className="text-blue-600 font-medium underline">privacy@campushub.ai</a>.
            </p>
          </section>

          {/* Section 12: Policy Updates & Contact Info */}
          <section id="policy-updates-contact" className="scroll-mt-28 space-y-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Mail className="w-4 h-4" /> Section 12
            </div>
            <h2 className="text-xl font-bold text-slate-900">12. Policy Updates & Contact Information</h2>
            <p>
              We may update this Privacy Policy periodically to reflect technological changes or regulatory updates. Substantial updates will be communicated via campus notice broadcasts and in-app alerts.
            </p>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div>
                <strong className="font-semibold text-slate-900">CampusHub AI Privacy & Legal Office</strong>
                <p className="text-slate-600">Email: privacy@campushub.ai | Support: support@campushub.ai</p>
              </div>
              <a href="mailto:privacy@campushub.ai" className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-xs">
                Contact Privacy Team
              </a>
            </div>
          </section>

          {/* Section 13: FAQs Accordion */}
          <section id="faqs" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <HelpCircle className="w-4 h-4" /> Section 13
            </div>
            <h2 className="text-xl font-bold text-slate-900">13. Privacy Frequently Asked Questions</h2>

            <div className="space-y-2 pt-2">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-3.5 text-left font-semibold text-xs text-slate-900 bg-slate-50/50 hover:bg-slate-100/50 flex items-center justify-between transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-3.5 bg-white text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

      {/* Enterprise Legal Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-10 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">C</div>
            <div>
              <p className="font-semibold text-slate-900 text-xs">CampusHub AI Platform Inc.</p>
              <p className="text-[11px] text-slate-400">Enterprise AI-Powered Smart Campus Operating System</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-blue-600 font-semibold">Privacy Policy</Link>
            <a href="mailto:support@campushub.ai" className="text-slate-600 hover:text-blue-600 transition-colors">Support Email</a>
            <a href="mailto:privacy@campushub.ai" className="text-slate-600 hover:text-blue-600 transition-colors">Privacy Office</a>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <p>Version 2.4.0 • Updated Aug 8, 2026</p>
            <p>© 2026 CampusHub AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
