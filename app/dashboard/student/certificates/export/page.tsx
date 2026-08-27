'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  ShieldCheck, 
  Download, 
  Copy, 
  ArrowLeft, 
  Check, 
  ExternalLink, 
  Sparkles, 
  QrCode,
  FileCheck
} from 'lucide-react';
import { generateVerifiableCredential, verifyBadgeSignature } from '@/lib/credentialVerifier';

export default function MicroCredentialsExportPage() {
  const [copied, setCopied] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<string>('ai-specialist');

  const credentialsData = {
    'ai-specialist': generateVerifiableCredential({
      id: 'cred-ai-01',
      achievement: {
        title: 'Deep Learning & Neural Architectures Honors',
        description: 'Completed 120 hours of high-performance GPU cluster experiments, transformer models & loss function optimization.',
        criteriaUrl: 'https://campushub.edu.in/credentials/ai-specialist',
        issuedOn: '2026-08-15'
      }
    }),
    'cloud-devops': generateVerifiableCredential({
      id: 'cred-cloud-02',
      achievement: {
        title: 'Cloud Infrastructure & Kubernetes Orchestration',
        description: 'Successfully deployed and managed multi-region microservice clusters with Istio service mesh and CI/CD pipelines.',
        criteriaUrl: 'https://campushub.edu.in/credentials/cloud-devops',
        issuedOn: '2026-07-28'
      }
    })
  };

  const currentBadge = credentialsData[selectedBadge as keyof typeof credentialsData];
  const verification = verifyBadgeSignature(currentBadge);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentBadge, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900/40 via-yellow-900/30 to-slate-900/40 p-6 rounded-2xl border border-amber-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Link href="/dashboard/student/certificates" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Certificates
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Verifiable Credentials</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            W3C Cryptographic Micro-Credentials Exporter
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Export tamper-proof OpenBadges 3.0 verifiable credentials with cryptographic root authority signatures.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedBadge('ai-specialist')}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer ${
            selectedBadge === 'ai-specialist'
              ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500'
              : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/30'
          }`}
        >
          <span className="text-xs text-amber-400 font-semibold uppercase block mb-1">Honors Degree Track</span>
          <h3 className="text-sm font-bold text-white">Deep Learning & Neural Architectures Honors</h3>
          <p className="text-xs text-slate-400 mt-1">Issued Aug 15, 2026 • Verified on Blockchain Node</p>
        </button>

        <button
          onClick={() => setSelectedBadge('cloud-devops')}
          className={`p-5 rounded-2xl border text-left transition cursor-pointer ${
            selectedBadge === 'cloud-devops'
              ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500'
              : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/30'
          }`}
        >
          <span className="text-xs text-amber-400 font-semibold uppercase block mb-1">Industry Micro-Cred</span>
          <h3 className="text-sm font-bold text-white">Cloud Infrastructure & Kubernetes Orchestration</h3>
          <p className="text-xs text-slate-400 mt-1">Issued Jul 28, 2026 • Verified on Blockchain Node</p>
        </button>
      </div>

      {/* Visual Badge + JSON-LD Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Badge */}
        <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Award className="w-10 h-10 text-slate-950" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{currentBadge.achievement.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{currentBadge.issuer.name}</p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="text-white font-medium">{currentBadge.recipient.name} ({currentBadge.recipient.studentId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issued On:</span>
                <span className="text-slate-300 font-mono">{currentBadge.achievement.issuedOn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Signature:</span>
                <span className="text-amber-400 font-mono truncate max-w-[180px]">{currentBadge.signature}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{verification.message}</span>
          </div>
        </div>

        {/* JSON-LD Schema Pane */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono text-slate-300">OpenBadges_v3_W3C.json</span>
            </div>
            <button
              onClick={handleCopyJson}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Payload' : 'Copy JSON-LD'}
            </button>
          </div>

          <pre className="bg-slate-950/90 p-4 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
            {JSON.stringify(currentBadge, null, 2)}
          </pre>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Standard: OpenBadges 3.0 / W3C Verifiable Credential</span>
            <button
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([JSON.stringify(currentBadge, null, 2)], { type: 'application/json' });
                element.href = URL.createObjectURL(file);
                element.download = `${selectedBadge}-credential.json`;
                document.body.appendChild(element);
                element.click();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Badge Payload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
