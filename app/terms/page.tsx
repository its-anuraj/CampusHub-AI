'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText, Lock, Search, Printer, Copy, Check, ArrowLeft, ChevronDown,
  AlertTriangle, Shield, UserCheck, Scale, Server, HelpCircle, Mail, DollarSign
} from 'lucide-react';

const SECTIONS = [
  { id: 'acceptance-terms', label: '1. Acceptance of Terms' },
  { id: 'eligibility-accounts', label: '2. Eligibility & Accounts' },
  { id: 'role-responsibilities', label: '3. Role Responsibilities' },
  { id: 'acceptable-use', label: '4. Acceptable Use Policy' },
  { id: 'academic-integrity-ai', label: '5. Academic Integrity & AI' },
  { id: 'ip-data-ownership', label: '6. Data Ownership & IP' },
  { id: 'forum-marketplace', label: '7. Forum & Marketplace' },
  { id: 'payment-refunds', label: '8. Payment & Refund Terms' },
  { id: 'liability-disclaimer', label: '9. Liability & Disclaimers' },
  { id: 'suspension-termination', label: '10. Suspension & Termination' },
  { id: 'governing-law-disputes', label: '11. Governing Law & Disputes' },
  { id: 'terms-updates-contact', label: '12. Updates & Contact Info' },
  { id: 'faqs', label: '13. Frequently Asked Questions' },
];

const FAQS = [
  {
    q: 'Who owns the educational data stored on CampusHub AI?',
    a: 'Educational institutions retain 100% ownership of all educational records, student transcripts, attendance logs, and institution data. CampusHub AI acts strictly as the technology platform provider.'
  },
  {
    q: 'What happens if a student abuses the AI Assistant service?',
    a: 'AI services are intended for tutoring and study guidance. Using AI to generate automated assignment submissions or bypass academic integrity rules is strictly prohibited and subject to institutional discipline.'
  },
  {
    q: 'Can accounts be shared among multiple users?',
    a: 'No. Credential sharing is strictly forbidden. Each student, faculty member, parent, and administrator must use their own assigned individual account for audit logging and role security.'
  },
  {
    q: 'What are the refund terms for student fee payments?',
    a: 'Institutional tuition, hostel, and exam fees processed through CampusHub AI are governed by the partner institution refund policies. Payment gateway convenience fees are non-refundable.'
  }
];

export default function TermsOfServicePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('acceptance-terms');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

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
              <Scale className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-xs text-slate-900">CampusHub AI Terms of Service</span>
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
            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">Master Agreement</span>
            <span>•</span>
            <span>Version 2.4.0</span>
            <span>•</span>
            <span>Last Updated: August 8, 2026</span>
            <span>•</span>
            <span>Est. Reading Time: 15 mins</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
            This Master Terms of Service Agreement governs access to and use of CampusHub AI for educational institutions, administrators, faculty members, students, and parents.
          </p>

          {/* Data Ownership Callout */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-950">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-blue-900">Institutional Record Ownership:</strong> Partner educational institutions retain full, unencumbered ownership of all educational records, student grades, attendance ledgers, and academic data. CampusHub AI acts strictly as the technology operating system provider.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                placeholder="Search terms..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none w-full"
              />
            </div>

            <nav className="bg-white border border-slate-200 rounded-xl p-3 shadow-card space-y-0.5 text-xs">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1">Table of Contents</p>
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

        {/* Terms Content */}
        <main className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-card space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1: Acceptance of Terms */}
          <section id="acceptance-terms" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <FileText className="w-4 h-4" /> Section 1
            </div>
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing, registering for, or using <strong>CampusHub AI</strong> (“Platform”, “Service”), you agree to be bound by these Terms of Service (“Terms”) and our Privacy Policy. If you are entering into this agreement on behalf of a university, college, school district, or coaching institute, you represent that you have legal authority to bind that institution.
            </p>
          </section>

          {/* Section 2: Eligibility & Accounts */}
          <section id="eligibility-accounts" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <UserCheck className="w-4 h-4" /> Section 2
            </div>
            <h2 className="text-xl font-bold text-slate-900">2. Eligibility & Account Security</h2>
            <p>
              User accounts are created via institutional onboarding or verified SSO credentials (Google Workspace / Microsoft 365). Users agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
              <li>Provide accurate identity information during account activation.</li>
              <li>Maintain password confidentiality and not share account access credentials.</li>
              <li>Immediately notify system administrators upon discovering unauthorized access.</li>
            </ul>
          </section>

          {/* Section 3: Role Responsibilities */}
          <section id="role-responsibilities" className="scroll-mt-28 space-y-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Server className="w-4 h-4" /> Section 3
            </div>
            <h2 className="text-xl font-bold text-slate-900">3. Role-Based User Responsibilities</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900 block">Student Responsibilities</strong>
                <p className="text-slate-600 mt-1">Submit authentic coursework, maintain academic honesty, check class timetables, and refrain from abusing discussion forums or AI tools.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900 block">Faculty Responsibilities</strong>
                <p className="text-slate-600 mt-1">Accurately record lecture attendance, upload course syllabus materials, evaluate assignment submissions fairly, and post valid notices.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900 block">Parent Responsibilities</strong>
                <p className="text-slate-600 mt-1">Monitor linked student performance records responsibly and pay student fee balances promptly.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <strong className="font-semibold text-slate-900 block">Administrator Responsibilities</strong>
                <p className="text-slate-600 mt-1">Oversee user provisioning, configure department rules, maintain security logs, and manage institutional settings.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Acceptable Use Policy & Prohibitions */}
          <section id="acceptable-use" className="scroll-mt-28 space-y-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-red-600 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4" /> Section 4
            </div>
            <h2 className="text-xl font-bold text-slate-900">4. Acceptable Use Policy & Strict Prohibitions</h2>
            <p>Users must comply with all applicable local, state, national, and international laws. Users explicitly agree <strong>NOT</strong> to:</p>

            <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 text-xs text-red-950 space-y-2">
              <strong className="font-semibold text-red-900 block">Strict Prohibitions List:</strong>
              <ul className="list-disc pl-5 space-y-1.5 text-red-900">
                <li><strong>No Malicious Content:</strong> Upload malware, viruses, trojans, or corrupted files to the platform.</li>
                <li><strong>No Unauthorized Access / Hacking:</strong> Attempt to breach security filters, reverse-engineer code, or access unauthorized student/faculty accounts.</li>
                <li><strong>No Credential Sharing:</strong> Share individual login credentials or transfer accounts to third parties.</li>
                <li><strong>No AI Service Abuse:</strong> Misuse AI chat tools for automated spam, illegal activities, or mass generation of deceptive content.</li>
                <li><strong>No Copyright Infringement:</strong> Upload copyrighted textbooks, software, or media without proper authorization.</li>
                <li><strong>No Harassment or Defamation:</strong> Post abusive, hateful, defamatory, or harassing comments in discussion forums or message channels.</li>
                <li><strong>No Academic Misconduct:</strong> Misrepresent attendance logs, falsify assignment submissions, or tamper with examination records.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Academic Integrity & AI Usage Policy */}
          <section id="academic-integrity-ai" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Shield className="w-4 h-4" /> Section 5
            </div>
            <h2 className="text-xl font-bold text-slate-900">5. Academic Integrity & AI Usage Policy</h2>
            <p>
              CampusHub AI provides artificial intelligence tools to support learning, study planning, and tutoring. Students agree to adhere to their institution's academic honor codes. Generating complete assignment responses via AI and submitting them as personal work is strictly prohibited.
            </p>
          </section>

          {/* Section 6: Data Ownership & Intellectual Property */}
          <section id="ip-data-ownership" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Lock className="w-4 h-4" /> Section 6
            </div>
            <h2 className="text-xl font-bold text-slate-900">6. Data Ownership & Intellectual Property</h2>
            <p>
              <strong>Institutional Data Ownership:</strong> Partner institutions retain full ownership of all educational records, student files, attendance logs, and internal communications.
            </p>
            <p>
              <strong>Platform IP:</strong> CampusHub AI owns all software source code, database structures, UI design elements, logos, and trademarks associated with the platform.
            </p>
          </section>

          {/* Section 7: Forum & Marketplace Rules */}
          <section id="forum-marketplace" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <FileText className="w-4 h-4" /> Section 7
            </div>
            <h2 className="text-xl font-bold text-slate-900">7. Community Forum & Marketplace Rules</h2>
            <p>
              Campus discussion forums and student marketplaces are provided for peer learning and resource sharing. Users buying or selling books, calculators, or hostel essentials in the marketplace assume full responsibility for transactions.
            </p>
          </section>

          {/* Section 8: Payment & Refund Terms */}
          <section id="payment-refunds" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <DollarSign className="w-4 h-4" /> Section 8
            </div>
            <h2 className="text-xl font-bold text-slate-900">8. Fee Payments & Refund Terms</h2>
            <p>
              Tuition fees, hostel fees, and exam dues processed through integrated payment gateways (Razorpay, Stripe) are transferred to the educational institution. Refund requests must be directed to the institution’s accounts office.
            </p>
          </section>

          {/* Section 9: Liability & Disclaimers */}
          <section id="liability-disclaimer" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Scale className="w-4 h-4" /> Section 9
            </div>
            <h2 className="text-xl font-bold text-slate-900">9. Limitation of Liability & Warranty Disclaimer</h2>
            <p>
              The platform is provided “AS IS” and “AS AVAILABLE”. CampusHub AI disclaims all implied warranties of merchantability or fitness for a particular purpose. CampusHub AI shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime or network failures.
            </p>
          </section>

          {/* Section 10: Account Suspension & Termination */}
          <section id="suspension-termination" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4" /> Section 10
            </div>
            <h2 className="text-xl font-bold text-slate-900">10. Account Suspension & Termination</h2>
            <p>
              CampusHub AI and partner institution administrators reserve the right to suspend or terminate accounts that violate acceptable use policies, engage in security breaches, or commit academic fraud.
            </p>
          </section>

          {/* Section 11: Governing Law & Disputes */}
          <section id="governing-law-disputes" className="scroll-mt-28 space-y-3 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Scale className="w-4 h-4" /> Section 11
            </div>
            <h2 className="text-xl font-bold text-slate-900">11. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable state and federal laws without regard to conflict of law principles. Any legal disputes shall be resolved through binding arbitration or competent courts.
            </p>
          </section>

          {/* Section 12: Updates & Contact Info */}
          <section id="terms-updates-contact" className="scroll-mt-28 space-y-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <Mail className="w-4 h-4" /> Section 12
            </div>
            <h2 className="text-xl font-bold text-slate-900">12. Changes to Terms & Contact Information</h2>
            <p>
              We reserve the right to update these Terms at any time. Continued use of CampusHub AI after notice of changes constitutes acceptance of the revised Terms.
            </p>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div>
                <strong className="font-semibold text-slate-900">CampusHub AI Legal Counsel Office</strong>
                <p className="text-slate-600">Legal: legal@campushub.ai | Support: support@campushub.ai</p>
              </div>
              <a href="mailto:legal@campushub.ai" className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-xs">
                Contact Legal Department
              </a>
            </div>
          </section>

          {/* Section 13: FAQs */}
          <section id="faqs" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
              <HelpCircle className="w-4 h-4" /> Section 13
            </div>
            <h2 className="text-xl font-bold text-slate-900">13. Terms of Service FAQs</h2>

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
            <Link href="/terms" className="text-blue-600 font-semibold">Terms of Service</Link>
            <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <a href="mailto:support@campushub.ai" className="text-slate-600 hover:text-blue-600 transition-colors">Support Email</a>
            <a href="mailto:legal@campushub.ai" className="text-slate-600 hover:text-blue-600 transition-colors">Legal Office</a>
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
