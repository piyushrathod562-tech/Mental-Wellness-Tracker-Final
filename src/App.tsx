import React from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  Sparkles, 
  Layout, 
  Settings, 
  FileText, 
  GraduationCap, 
  ExternalLink,
  Github,
  Users
} from 'lucide-react';
import JournalLogger from './components/JournalLogger';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* HEADER BAR */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950">
              <HeartPulse className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display tracking-tight text-slate-200 flex items-center gap-1.5">
                Samarthan
                <span className="text-[10px] font-mono font-medium text-emerald-400/90 bg-emerald-400/10 px-1.5 rounded-full border border-emerald-400/15">
                  Secure Ingress
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Exam Stresses Companion Platform</p>
            </div>
          </div>

          {/* Secure indicator badge instead of the complex tab */}
          <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LOCAL GATEWAY FILTER</span>
          </div>
        </div>
      </header>

      {/* SUB-HEADER APP BANNER */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-900 py-6">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400 font-semibold">Competitive Prep Mitigation Engine</span>
            </div>
            <h2 className="text-2xl font-semibold font-display tracking-tight text-white">
              Syllabus pressure should never threaten student lives.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              Tailored specifically for Indian aspirants preparing for <strong className="text-emerald-400">JEE, NEET, and UPSC</strong>. Offers secure, local-first anonymized prompt processing, model guardrails, and instantaneous deterministic crisis mitigation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-center space-y-1">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">GEMINI FLOW</div>
              <div className="text-sm font-semibold text-emerald-400">ResponseSchema Safe</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-center space-y-1">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">CRISIS LATENCY</div>
              <div className="text-sm font-semibold text-emerald-400">&lt;1ms Local Preempt</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FRAME WORKSPACE */}
      <main className="flex-grow py-6">
        <JournalLogger />
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-mono">Samarthan Secure Core Version 4.1.2</p>
            <p className="text-[10px]">Empathetic Virtual Peer designed for competitive exam stress moderation inside Google AI Studio Sandbox.</p>
          </div>
          <div className="flex space-x-4 font-mono text-[10px]">
            <span className="text-slate-400">See root README.md for 6-Layer Security</span>
            <span>•</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA & OWASP Guardrails Active
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
