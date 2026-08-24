import React, { useState } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Building2,
  Wrench,
  Layers,
  Database
} from 'lucide-react';

const SUGGESTION_PILLS = [
  { icon: Flame, text: 'Analyze top recurring plumbing defect clusters in Tower B', prompt: 'Analyze top recurring plumbing defect clusters in Tower B' },
  { icon: AlertTriangle, text: 'List all overdue SLA maintenance complaints', prompt: 'Show all overdue SLA maintenance complaints' },
  { icon: Sparkles, text: 'Simulate dynamic exponential decay risk formula', prompt: 'Explain the dynamic exponential decay formula and show current parameters' },
  { icon: Clock, text: 'Draft scheduled elevator maintenance announcement', prompt: 'Draft a maintenance circular for common plumbing riser inspection' }
];

export const UnthinkableHero = ({ onOpenCreateTicket, onAskAI, onNavigateTab, user }) => {
  const [query, setQuery] = useState('');
  const [activeNode, setActiveNode] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onAskAI(query);
    setQuery('');
  };

  return (
    <section className="relative overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Overline & Main Heading */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            UNTHINKABLE OPERATIONS · GREENWOOD HEIGHTS
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
            We manage society operations{' '}
            <span className="italic font-serif font-normal text-blue-600">smarter</span> than you thought{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-slate-950">possible</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-blue-600 -z-0"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Co-operative Housing Society infrastructure management powered by dynamic exponential decay risk-scoring, append-only FSM validation, and decoupled transactional outbox.
          </p>
        </div>

        {/* The Unthinkable Interactive Pipeline Nodes Graph */}
        <div className="hidden md:block bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            <span>Engineering Architecture: Real-Time Event Pipeline</span>
            <span className="font-mono text-emerald-600">ACID + Aggregation Ready</span>
          </div>

          <div className="grid grid-cols-5 gap-3 items-center">
            {/* Node 1: Resident Prompt / Ticket */}
            <div
              onMouseEnter={() => setActiveNode(1)}
              onMouseLeave={() => setActiveNode(null)}
              className="p-3.5 rounded-xl bg-white border-2 border-blue-500 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                  R
                </span>
                <span className="text-xs font-bold text-slate-900 truncate">Resident Ticket</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Unit 101 · Plumbing</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center text-slate-300 font-mono text-xs">
              <span className="border-t-2 border-dashed border-blue-300 w-full" />
              <ArrowUpRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
            </div>

            {/* Node 2: Finite State Machine */}
            <div
              onMouseEnter={() => setActiveNode(2)}
              onMouseLeave={() => setActiveNode(null)}
              className="p-3.5 rounded-xl bg-white border-2 border-indigo-500 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                  FSM
                </span>
                <span className="text-xs font-bold text-slate-900 truncate">State Machine</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Open ➔ In Progress</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center text-slate-300 font-mono text-xs">
              <span className="border-t-2 border-dashed border-indigo-300 w-full" />
              <ArrowUpRight className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            </div>

            {/* Node 3: Risk Decay Engine */}
            <div
              onMouseEnter={() => setActiveNode(3)}
              onMouseLeave={() => setActiveNode(null)}
              className="p-3.5 rounded-xl bg-white border-2 border-amber-500 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-md bg-amber-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                  λ
                </span>
                <span className="text-xs font-bold text-slate-900 truncate">Decay Scoring</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">S(t) = w·e^(-0.0231t)</p>
            </div>
          </div>
        </div>

        {/* Unthinkable Signature Hero Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-3xl mx-auto">
          <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-blue-600 rounded-2xl p-2 shadow-lg transition-all">
            <div className="pl-3 pr-2 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Want to inspect defects or ask society AI? Let's chat…"
              className="flex-1 px-2 py-2.5 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!query.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {SUGGESTION_PILLS.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onAskAI(pill.prompt)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-xs font-semibold text-slate-700 transition-all active:scale-95 shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-blue-600" />
                <span>{pill.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
