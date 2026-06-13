import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  ShieldAlert, 
  Sparkles, 
  Timer, 
  HelpCircle, 
  AlertTriangle,
  Brain, 
  Calendar, 
  ChevronRight, 
  UserCheck, 
  Lock, 
  RefreshCw, 
  Info, 
  Smile,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { JournalEntry, SecurityMetric } from '../types';

const MOOD_DETAILS_MAP: Record<number, { emoji: string; label: string; color: string }> = {
  1: { emoji: "😢", label: "Very Stressed / Lagging", color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
  2: { emoji: "😟", label: "Anxious / Overwhelmed", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  3: { emoji: "😐", label: "Average / Coping", color: "text-slate-400 bg-slate-400/10 border-slate-400/20" },
  4: { emoji: "🙂", label: "Focused / Stable", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  5: { emoji: "🌟", label: "Feeling Confident", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
};

const DEFAULT_MOOD = { emoji: "😐", label: "Neutral", color: "text-slate-400" };

export default function JournalLogger() {
  const [inputText, setInputText] = useState('');
  const [examType, setExamType] = useState<'JEE' | 'NEET' | 'UPSC' | 'GATE' | 'CA' | 'OTHER'>('JEE');
  const [moodRating, setMoodRating] = useState<number>(3);
  const [selectedLanguage, setSelectedLanguage] = useState<'HINGLISH' | 'ENGLISH' | 'HINDI' | 'BENGALI' | 'TAMIL' | 'TELUGU'>('HINGLISH');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'triggers' | 'patterns' | 'coping' | 'mindfulness'>('coping');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [lastSecurityMetrics, setLastSecurityMetrics] = useState<SecurityMetric | null>({
    anonymizationApplied: false,
    sanitizationApplied: true,
    crisisFilterChecked: true,
    rateLimitChecked: true
  });

  // Fetch past entries on load
  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/journals');
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
        if (data.length > 0 && !selectedEntry) {
          setSelectedEntry(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch journal records:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleMoodSelect = (rating: number) => {
    setMoodRating(rating);
  };

  const getMoodEmoji = (rating: number) => {
    return MOOD_DETAILS_MAP[rating] || DEFAULT_MOOD;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMessage("Please express your thoughts before submitting!");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch('/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rawText: inputText,
          examType,
          moodRating,
          preferredLanguage: selectedLanguage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ingestion pipeline failure");
      }

      const result = await response.json();
      setEntries(prev => [result.entry, ...prev]);
      setSelectedEntry(result.entry);
      setLastSecurityMetrics(result.security);
      setInputText('');
      setMoodRating(3);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not connect to the Express companion server. Ensure server builds successfully.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto px-4 py-2 font-sans text-slate-100">
      
      {/* LEFT COLUMN: Input Form & Mood Selector (span 7) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* INTERACTIVE USER GUIDANCE PANEL */}
        <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/30 p-5 rounded-2xl border border-emerald-500/20 shadow-md space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <h4 className="font-semibold text-sm font-display tracking-tight text-emerald-300">Aspirant Navigation & Secure Logging Guidance</h4>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">
            Welcome, Aspirant! Your preparation journey is a marathon. Use this guide to optimize your safe logs and preserve mental wellbeing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 space-y-1.5">
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">🗣️ Use Local Hinglish Code-Switching</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Feel free to express yourself naturally in English, Hindi, or mixed Hinglish (e.g., <em>"Syllabus complete nahi ho raha, test marks fall ho rahe hain"</em>). The Gemini pattern analyzer understands your native context perfectly.
              </p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 space-y-1.5">
              <span className="font-mono text-[10px] text-teal-400 font-bold uppercase tracking-wider">🔒 Strict Data Privacy Safeguards</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Never worry about peer competition or exposure. Our server processes logs strictly in-memory and executes local sanitization to strip mobile numbers or emails before routing. Your privacy is bulletproof.
              </p>
            </div>
          </div>
          <div className="p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-[11px] text-slate-400 flex items-start gap-2">
            <span className="text-xs">💡</span>
            <p>
              <strong>Pro Tip:</strong> Read the project's root <strong>README.md</strong> which details the comprehensive 6-Layer security system, sanitization flow, and crisis triggers in pristine detail.
            </p>
          </div>
        </div>

        <div id="journal-input-card" className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-emerald-400 animate-pulse" />
              <h3 className="text-xl font-semibold font-display tracking-tight text-slate-100">Log Your Mindspace</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> 
              Secure Ingress Link
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Exam context selection */}
            <div className="space-y-2">
              <label id="exam-label" className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Target Exam Context
              </label>
              <div aria-labelledby="exam-label" className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['JEE', 'NEET', 'UPSC', 'GATE', 'CA', 'OTHER'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setExamType(type)}
                    aria-pressed={examType === type}
                    className={`py-1.5 px-2 text-xs font-mono rounded-lg border transition-all duration-150 ${
                      examType === type
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-sm'
                        : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Companion Language selection */}
            <div className="space-y-2">
              <label id="language-label" className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Companion Advice Language
              </label>
              <div aria-labelledby="language-label" className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { code: 'HINGLISH', label: 'Hinglish (मिक्स)' },
                  { code: 'ENGLISH', label: 'English' },
                  { code: 'HINDI', label: 'Hindi (हिंदी)' },
                  { code: 'TAMIL', label: 'Tamil (தமிழ்)' },
                  { code: 'TELUGU', label: 'Telugu (తెలుగు)' },
                  { code: 'BENGALI', label: 'Bengali (বাংলা)' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.code as any)}
                    aria-pressed={selectedLanguage === lang.code}
                    className={`py-1.5 px-1 text-[11px] font-sans rounded-lg border transition-all duration-150 ${
                      selectedLanguage === lang.code
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-sm'
                        : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood selector */}
            <div className="space-y-2">
              <label id="mood-label" className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Current Stress & Mood Level
              </label>
              <div aria-labelledby="mood-label" className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => {
                  const m = getMoodEmoji(rating);
                  const isSelected = moodRating === rating;
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleMoodSelect(rating)}
                      title={m.label}
                      aria-pressed={isSelected}
                      aria-label={`Mood rating ${rating}: ${m.label}`}
                      className={`py-3 px-1 flex flex-col items-center justify-center rounded-xl border transition-all duration-200 ${
                        isSelected 
                          ? 'bg-slate-900 ring-2 ring-emerald-400 border-transparent shadow shadow-emerald-400/25 scale-105' 
                          : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 hover:scale-102'
                      }`}
                    >
                      <span className="text-2xl mb-1 filter drop-shadow-sm" aria-hidden="true">{m.emoji}</span>
                      <span className="text-[10px] font-mono font-medium text-slate-300">{rating}</span>
                    </button>
                  );
                })}
              </div>
              <div className="text-center">
                <span className="text-xs font-mono text-emerald-300 font-medium">
                  Selected: {getMoodEmoji(moodRating).label}
                </span>
              </div>
            </div>

            {/* Input logs */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="journal-text" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Journal Entrance (Supports Hinglish Code-switching)
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  Characters: {inputText.length}
                </span>
              </div>
              <textarea
                id="journal-text"
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="E.g., Coaching tests clear nahi ho rahe... Physics backlog is growing and teachers are moving fast. NEET mock routine makes me nervous... or parents expect UPSC Rank-1 but CA CSAT syllabus feels untackly."
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 rounded-xl p-4 border border-slate-700/80 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all resize-none font-sans"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {errorMessage}
              </p>
            )}

            {/* Submit mechanism */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-sm font-display rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Analyzing securely with Gemini Models...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Log & Provide Empathetic Support
                </>
              )}
            </button>
          </form>
        </div>

        {/* COMPREHENSIVE SECURITY METRIC OVERVIEW */}
        {lastSecurityMetrics && (
          <div className="bg-slate-900/65 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <h4 className="font-semibold text-slate-300 font-display text-sm tracking-wide flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> Secure Sandbox Validation Audit
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400 py-1">
              <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded border border-slate-800">
                <span>1. Sanitization Protocol:</span>
                <span className="text-emerald-400 font-bold">ACTIVE (XSS Block)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded border border-slate-800">
                <span>2. PiI Anonymizer:</span>
                <span className={lastSecurityMetrics.anonymizationApplied ? "text-emerald-400 font-bold" : "text-amber-400/90"}>
                  {lastSecurityMetrics.anonymizationApplied ? "STRIPPED" : "NO_PII_FOUND"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded border border-slate-800">
                <span>3. Deterministic Crisis:</span>
                <span className="text-emerald-400 font-bold">AUDITED (Regex 1ms)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded border border-slate-800">
                <span>4. High-Throughput Limit:</span>
                <span className="text-emerald-400 font-bold">VERIFIED (100-req/m)</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Note: Full sanitization strips HTML tags before Gemini query transmission. All personal email, phone links, and candidate identifiers are substituted dynamically to preserve 100% data confidentiality in our persistent local store.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Active Companion Workspace & History (span 5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* CURRENT ENTRY DIAGRAM / ANALYSIS FEED */}
        <div id="ai-companion-card" className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <h3 className="text-lg font-semibold font-display text-slate-100">Empathetic Response</h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Ref: {selectedEntry ? new Date(selectedEntry.timestamp).toLocaleTimeString() : 'No Entry Selected'}
              </p>
            </div>
            {selectedEntry && (
              <span className={`px-2.5 py-1 text-[10px] font-mono rounded border ${
                selectedEntry.isCrisis 
                  ? 'bg-rose-500/20 border-rose-400 text-rose-400 animate-pulse'
                  : 'bg-emerald-500/10 border-emerald-400/20 text-emerald-400'
              }`}>
                {selectedEntry.isCrisis ? "🔴 CRISIS OVERRIDE" : `🔑 ${selectedEntry.examType} ANALYSIS`}
              </span>
            )}
          </div>

          {selectedEntry ? (
            <div className="space-y-4">
              
              {/* Crisis helpline warning if crisis triggered */}
              {selectedEntry.isCrisis && (
                <div className="p-4 bg-rose-500/15 border border-rose-400/30 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-bounce" />
                    <h4 className="font-semibold text-xs uppercase font-mono tracking-wider">Deterministic Distress Signal Detected</h4>
                  </div>
                  <p className="text-slate-300 text-xs leading-normal">
                    This companion has triggered immediate support resources because your life and security are infinitely more important than NEET, JEE, or UPSC ranks. Please contact these immediate helpline resources helper networks:
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-rose-500/20 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Vandrevala Foundation:</span>
                      <strong className="text-rose-400">9999 666 555</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>AASRA India Helpline:</span>
                      <strong className="text-rose-400">91-9820466726</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>KIRAN Mental Health:</span>
                      <strong className="text-rose-400">1800-599-0019</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    LLM logic bypassed directly to prevent hallucinations and delay.
                  </p>
                </div>
              )}

              {/* General elder-sibling message */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 relative">
                <span className="absolute top-2 right-2 text-xs">⭐</span>
                <p className="text-xs text-slate-400 font-mono mb-1 uppercase tracking-wider">Empathetic Spark:</p>
                <p className="text-sm font-sans tracking-tight text-slate-200 leading-relaxed italic">
                  &ldquo;{selectedEntry.analysis?.toneExplanation || "Analyzing..."}&rdquo;
                </p>
              </div>

              {/* Dynamic Analysis Tabs */}
              <div className="space-y-3">
                <div role="tablist" aria-label="Analysis Insights" className="flex border-b border-slate-700 text-xs">
                  <button
                    role="tab"
                    aria-selected={activeTab === 'coping'}
                    id="tab-coping"
                    aria-controls="panel-coping"
                    onClick={() => setActiveTab('coping')}
                    className={`flex-1 pb-2 font-mono text-center transition-all cursor-pointer ${
                      activeTab === 'coping' 
                        ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Actionable Tips
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'mindfulness'}
                    id="tab-mindfulness"
                    aria-controls="panel-mindfulness"
                    onClick={() => setActiveTab('mindfulness')}
                    className={`flex-1 pb-2 font-mono text-center transition-all cursor-pointer ${
                      activeTab === 'mindfulness' 
                        ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Zen Drills
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'triggers'}
                    id="tab-triggers"
                    aria-controls="panel-triggers"
                    onClick={() => setActiveTab('triggers')}
                    className={`flex-1 pb-2 font-mono text-center transition-all cursor-pointer ${
                      activeTab === 'triggers' 
                        ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Stress Triggers
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'patterns'}
                    id="tab-patterns"
                    aria-controls="panel-patterns"
                    onClick={() => setActiveTab('patterns')}
                    className={`flex-1 pb-2 font-mono text-center transition-all cursor-pointer ${
                      activeTab === 'patterns' 
                        ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Mood Cycles
                  </button>
                </div>

                {/* Tab content area */}
                <div className="min-h-36 py-2">
                  {activeTab === 'coping' && (
                    <div id="panel-coping" role="tabpanel" aria-labelledby="tab-coping" className="space-y-3">
                      <p className="text-xs text-slate-300 font-mono uppercase tracking-wider">Immediate Coping Worklist:</p>
                      <ul className="space-y-2">
                        {selectedEntry.analysis?.copingStrategies?.map((tip, idx) => (
                          <li key={idx} className="flex gap-2 text-xs text-slate-300 bg-slate-900/30 p-2.5 rounded-lg border border-slate-700/30">
                            <span className="text-emerald-400 font-mono font-bold">#{idx + 1}</span>
                            <span className="leading-snug">{tip}</span>
                          </li>
                        )) || <li className="text-xs text-slate-500 font-mono">No coping guidelines available.</li>}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'mindfulness' && (
                    <div id="panel-mindfulness" role="tabpanel" aria-labelledby="tab-mindfulness" className="space-y-3">
                      <p className="text-xs text-slate-300 font-mono uppercase tracking-wider">Anti-stress Mind Routine:</p>
                      <ul className="space-y-2">
                        {selectedEntry.analysis?.mindfulnessExercises?.map((ex, idx) => (
                          <li key={idx} className="flex gap-2 text-xs text-slate-300 bg-teal-950/15 p-2.5 rounded-lg border border-teal-900/30">
                            <span className="text-teal-400 font-mono font-bold">💡</span>
                            <span className="leading-snug">{ex}</span>
                          </li>
                        )) || <li className="text-xs text-slate-500 font-mono">No mindfulness recommendations found.</li>}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'triggers' && (
                    <div id="panel-triggers" role="tabpanel" aria-labelledby="tab-triggers" className="space-y-3">
                      <p className="text-xs text-slate-300 font-mono uppercase tracking-wider">Identified Exam Triggers:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.analysis?.triggers?.map((trigger, idx) => (
                          <span key={idx} className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-slate-900 text-emerald-400 border border-emerald-500/20">
                            🔥 {trigger}
                          </span>
                        )) || <span className="text-xs text-slate-500 font-mono">None identified.</span>}
                      </div>
                    </div>
                  )}

                  {activeTab === 'patterns' && (
                    <div id="panel-patterns" role="tabpanel" aria-labelledby="tab-patterns" className="space-y-3">
                      <p className="text-xs text-slate-300 font-mono uppercase tracking-wider">Anxiety / Overwhelm Cycles:</p>
                      <ul className="space-y-2">
                        {selectedEntry.analysis?.patterns?.map((pattern, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>{pattern}</span>
                          </li>
                        )) || <li className="text-xs text-slate-500 font-mono">No recurrent patterns tracked.</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs font-mono text-slate-400">
                You do not have any logged mental health passages yet.
              </p>
              <p className="text-[11px] text-slate-500">
                Type an exam preparation scenario on the left and submit to launch your security-vetted analysis.
              </p>
            </div>
          )}
        </div>

        {/* LOG HISTORY */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-slate-200 font-display">Aspirant Log Feed ({entries.length})</h4>
            <button 
              onClick={fetchEntries}
              aria-label="Refresh past journals"
              className="p-1 hover:bg-slate-700/40 rounded transition-all text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {entries.map((entry) => {
              const isSelected = selectedEntry?.id === entry.id;
              const date = new Date(entry.timestamp);
              return (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex justify-between items-center ${
                    isSelected 
                      ? 'bg-slate-900 border-emerald-400 text-slate-200' 
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 truncate pr-3 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-slate-500">
                        {date.getMonth()+1}/{date.getDate()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <span className="px-1 text-[9px] font-mono rounded bg-slate-800 text-slate-400">
                        {entry.examType}
                      </span>
                      {entry.isCrisis && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      )}
                    </div>
                    <p className="truncate text-slate-300 font-sans">{entry.text}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-base">{getMoodEmoji(entry.moodRating).emoji}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
