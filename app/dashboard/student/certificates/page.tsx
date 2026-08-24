'use client';

import { useState, useEffect } from 'react';
import { Award, ShieldCheck, Download, ExternalLink, QrCode, Sparkles, CheckCircle2, Lock, FileText, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentCertificatesPage() {
  const { addToast } = useToast();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewCert, setPreviewCert] = useState<any>(null);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const res = await fetch('/api/certificates');
        if (res.ok) {
          const json = await res.json();
          const list = json.data || json;
          setCerts(list);
          if (list.length > 0) setPreviewCert(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, []);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shadow-xs">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verifiable Digital Credentials & Certificates</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Cryptographically signed academic certificates, bonafide letters, and honors credentials</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Tamper-Proof
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">My Issued Credentials</h3>
          {certs.map((c) => (
            <div
              key={c.id}
              onClick={() => setPreviewCert(c)}
              className={cn(
                'p-4 rounded-2xl border transition-all cursor-pointer shadow-card space-y-2',
                previewCert?.id === c.id ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400' : 'bg-white border-slate-200 hover:border-slate-300'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                  {c.type.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{c.certificateId}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{c.courseOrTitle}</h4>
              <p className="text-[11px] text-slate-500">{c.issuedBy}</p>
            </div>
          ))}
        </div>

        {/* Certificate Preview Banner */}
        <div className="lg:col-span-2 space-y-4">
          {previewCert && (
            <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-6">
              {/* Decorative Watermark */}
              <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
                <Award className="w-72 h-72 text-amber-900" />
              </div>

              {/* Institution Seal Header */}
              <div className="text-center border-b-2 border-amber-100 pb-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center text-white font-bold text-lg shadow-md">
                  CH
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide">CAMPUSHUB INSTITUTE OF TECHNOLOGY</h2>
                <p className="text-xs uppercase tracking-widest text-slate-500">Autonomous Institution • NIRF Rank #12</p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-serif text-xs font-semibold border border-amber-200">
                  {previewCert.type.replace('_', ' ')} OF MERIT
                </div>
              </div>

              {/* Recipient Body */}
              <div className="text-center space-y-3 py-4">
                <p className="text-xs font-serif italic text-slate-500">This is to officially certify that</p>
                <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-wide">{previewCert.studentName}</h3>
                <p className="text-xs text-slate-600 font-mono">Roll Number: {previewCert.rollNumber}</p>
                <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed pt-2">
                  has satisfactorily fulfilled all academic requirements and institutional standards for <strong className="text-slate-900 font-semibold">{previewCert.courseOrTitle}</strong> with distinction.
                </p>
              </div>

              {/* Security Details & Signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-4 border-t-2 border-amber-100 pt-6 text-xs">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Date of Issuance</p>
                  <p className="font-semibold text-slate-800">{new Date(previewCert.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-[10px] text-slate-500">{previewCert.issuedBy}</p>
                </div>

                <div className="flex flex-col items-center justify-center text-center space-y-1">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1 flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-slate-800" />
                  </div>
                  <p className="text-[9px] font-mono text-slate-400">Scan to Verify</p>
                </div>

                <div className="sm:text-right space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Digital Seal & Signature</p>
                  <p className="font-serif italic font-semibold text-slate-800">Prof. Dr. Vikram Mehta</p>
                  <p className="text-[10px] text-slate-500">Registrar & Controller of Exams</p>
                </div>
              </div>

              {/* SHA-256 Hash */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <Lock className="w-3 h-3" /> Integrity Hash:
                </span>
                <span className="truncate ml-2">{previewCert.digitalHash}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <a
                  href={`/verify/${previewCert.certificateId}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Public Verify Link
                </a>
                <button
                  onClick={handlePrintCertificate}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
