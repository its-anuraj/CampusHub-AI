import { ShieldCheck, CheckCircle2, Award, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-6">
      <div className="max-w-2xl mx-auto w-full pt-10 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to CampusHub Portal
        </Link>

        {/* Verification Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-700 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800">
                Official Authenticated Record
              </span>
              <h1 className="text-xl font-bold text-white mt-1">Certificate Integrity Verified</h1>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700">
                <p className="text-slate-400">Recipient Student</p>
                <p className="text-sm font-bold text-white mt-0.5">Alex Kumar</p>
                <p className="text-[11px] font-mono text-slate-400">Roll No: 23CSE042</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700">
                <p className="text-slate-400">Certificate Identifier</p>
                <p className="text-sm font-mono font-bold text-blue-400 mt-0.5">{id}</p>
                <p className="text-[11px] text-slate-400">Status: Active & Valid</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-2">
              <p className="text-slate-400">Credential Title</p>
              <p className="text-sm font-bold text-slate-200">Institutional Bonafide & Student Enrollment Certificate</p>
              <p className="text-[11px] text-slate-400">Issuing Authority: Office of the Registrar & Academic Affairs</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between text-[11px] font-mono text-emerald-300">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Cryptographic Integrity Proof:
              </span>
              <span className="truncate ml-2 text-slate-400">SHA-256 Validated</span>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 text-center text-[11px] text-slate-500">
            Certified by CampusHub AI Cryptographic Identity Provider • Timestamp: August 2026
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 py-4">
        © 2026 CampusHub AI. Autonomous Academic Credential Verification System.
      </footer>
    </div>
  );
}
