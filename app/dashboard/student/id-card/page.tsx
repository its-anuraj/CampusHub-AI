'use client';

import { useState } from 'react';
import {
  Shield,
  QrCode,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Radio,
  Copy,
  Building2,
  Award
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { cn } from '@/lib/utils';

export default function DigitalIdCardPage() {
  const { addToast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isNfcActive, setIsNfcActive] = useState(false);

  const student = {
    name: 'Anuraj Singh',
    rollNumber: 'CS2023-042',
    enrollmentNo: 'EN2023-889412',
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE',
    batch: '2023 - 2027',
    semester: '5th Semester (Section A)',
    dob: '14 Nov 2003',
    bloodGroup: 'O+ Positive',
    validThru: '31 July 2027',
    contactNumber: '+91 98765 43210',
    emergencyContact: '+91 98765 00000 (Father)',
    address: 'Campus Hostel Block-B, Room 304, CampusHub University',
    libraryCardId: 'LIB-CS-2023-042',
  };

  const handlePrint = () => {
    addToast({
      title: 'Print Preview Ready',
      message: 'Preparing high-resolution official student ID badge layout...',
      type: 'info'
    });
    window.print();
  };

  const handleDownload = () => {
    addToast({
      title: 'ID Badge Downloaded',
      message: 'Official cryptographic ID badge (PNG) exported to your device.',
      type: 'success'
    });
  };

  const handleNfcTap = () => {
    setIsNfcActive(true);
    addToast({
      title: 'NFC Turnstile Access Granted',
      message: 'Main Gate turnstile unlocked. Welcome to campus, Anuraj!',
      type: 'success'
    });
    setTimeout(() => setIsNfcActive(false), 3000);
  };

  const copyRollNo = () => {
    navigator.clipboard?.writeText(student.rollNumber);
    addToast({
      title: 'Copied to Clipboard',
      message: `Roll Number ${student.rollNumber} copied!`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-green-300" /> Cryptographic Identity Token
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Smart Digital Student ID Card</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Official university student identity badge with NFC turnstile sensor simulation, encrypted security QR, and verifiable credential hash.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active Verified Student
          </span>
          <span className="text-xs text-muted-foreground font-mono">ID: {student.enrollmentNo}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Flip Card ({isFlipped ? 'Front' : 'Back'})
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" /> Download Badge
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-border hover:bg-muted text-foreground transition"
            title="Print ID Card"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Flip Card Visual */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-sm">
            {!isFlipped ? (
              /* FRONT OF CARD */
              <div className="w-full bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-white/20 relative overflow-hidden transition-all duration-500">
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl" />

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-sm tracking-wider text-blue-300">
                      CH
                    </div>
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider text-white">CampusHub University</h2>
                      <p className="text-[9px] text-blue-200/80">Autonomous Institute of Technology</p>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-bold text-emerald-300">
                    STUDENT
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="relative shrink-0">
                    <div className="w-20 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      AS
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-black text-white leading-tight">{student.name}</h3>
                    <p className="text-xs font-semibold text-blue-300">{student.course}</p>
                    <p className="text-[10px] text-slate-300 truncate">{student.department}</p>
                    <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-300 font-mono">
                      <span>Roll: <strong>{student.rollNumber}</strong></span>
                      <button onClick={copyRollNo} className="text-blue-400 hover:text-blue-300">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Meta Grid */}
                <div className="mt-5 grid grid-cols-3 gap-2 bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center relative z-10">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Blood Group</span>
                    <strong className="text-xs font-bold text-rose-300">{student.bloodGroup}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Batch</span>
                    <strong className="text-xs font-bold text-white">{student.batch}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Valid Until</span>
                    <strong className="text-xs font-bold text-emerald-300">{student.validThru}</strong>
                  </div>
                </div>

                {/* Barcode & Verification Footer */}
                <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between relative z-10">
                  <div className="font-mono text-[9px] tracking-widest text-slate-300">
                    <div className="flex gap-0.5 items-end h-5 mb-1">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 2, 1, 3, 2].map((w, i) => (
                        <div key={i} className="bg-white/80 h-full" style={{ width: `${w * 1.5}px` }} />
                      ))}
                    </div>
                    <span>{student.enrollmentNo}</span>
                  </div>

                  <div className="p-1.5 rounded-xl bg-white text-slate-950 shadow-md">
                    <QrCode className="w-8 h-8" />
                  </div>
                </div>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="w-full bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-white/20 relative overflow-hidden transition-all duration-500">
                <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Emergency & Campus Terms</h3>
                  <span className="text-[10px] text-slate-500 font-mono">REVERSE SIDE</span>
                </div>

                <div className="w-full h-8 bg-slate-800 rounded-lg mb-4 border border-slate-700 flex items-center justify-end px-3">
                  <span className="text-[8px] font-mono text-slate-400">CH-SECURE-MAGSTRIPE-900</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Emergency Contact</span>
                    <strong className="text-xs text-white font-mono">{student.emergencyContact}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Hostel Residence</span>
                    <p className="text-xs text-slate-300">{student.address}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Campus Security Helpline</span>
                    <strong className="text-xs text-amber-300 font-mono">1800-CAMPUS-911 (Toll Free)</strong>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                  This card is property of CampusHub University. If found, return to Campus Security Desk Gate 1.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: NFC Simulator & Verification Details */}
        <div className="lg:col-span-6 space-y-5">
          {/* NFC Turnstile Simulator */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">NFC Smart Gate Access Simulator</h3>
                <p className="text-xs text-muted-foreground">Tap to simulate Turnstile & Lab Door Access</p>
              </div>
            </div>

            <div
              onClick={handleNfcTap}
              className={cn(
                "p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all",
                isNfcActive
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                  : "border-border hover:border-blue-500 bg-muted/40 text-foreground"
              )}
            >
              <Radio className={cn("w-8 h-8 mb-2", isNfcActive ? "text-emerald-500 animate-ping" : "text-blue-500")} />
              <strong className="text-xs font-bold">
                {isNfcActive ? 'NFC Handshake Verified!' : 'Click to Simulate NFC Sensor Tap'}
              </strong>
              <span className="text-[10px] text-muted-foreground mt-1">Simulates ISO/IEC 14443 Type A RFID Smart Card</span>
            </div>
          </div>

          {/* Verification Credentials */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" /> Digital Credentials & Access Authorizations
            </h3>
            <div className="divide-y divide-border/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Certificate Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Valid
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Library Access ID</span>
                <span className="font-mono text-foreground font-medium">{student.libraryCardId}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Hostel Pass</span>
                <span className="font-medium text-foreground">Block B, Room 304 (Resident)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Mess Card Status</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">Special Diet (Active)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
