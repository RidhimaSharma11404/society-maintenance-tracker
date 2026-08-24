import React from 'react';
import { Check, X, Sparkles, ShieldCheck } from 'lucide-react';

export const UnthinkableComparison = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 pb-6 items-start">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-600">
            The Problem & The Solution
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Most society apps track static complaints.{' '}
            <span className="text-slate-400 font-normal">We engineer predictive intelligence.</span>
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Traditional portals treat maintenance tickets like simple to-do lists. We operate at the engineering level: calculating exponential decay risk load, enforcing state machine audit trails, and decoupling event notifications via ACID transactional outbox queues.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Typical Portal Card */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold font-mono">
            Typical Housing Society App
          </div>

          <div className="space-y-3 text-xs text-slate-600 font-medium">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                ✕
              </span>
              <span>Static ticket numbers with no historical defect clustering</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                ✕
              </span>
              <span>Unverified status jumps without mandatory technician audit logs</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                ✕
              </span>
              <span>Synchronous email sending that slows down resident UI</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                ✕
              </span>
              <span>No mathematical risk decay or preventive asset scheduling</span>
            </div>
          </div>
        </div>

        {/* The Unthinkable Way Card */}
        <div className="p-6 rounded-2xl bg-blue-50/70 border-2 border-blue-600 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold font-mono shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            The Unthinkable Way
          </div>

          <div className="space-y-3 text-xs text-slate-900 font-semibold">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5 shadow-xs">
                ✓
              </span>
              <span>
                Dynamic Exponential Half-Life Decay Risk Scoring: <strong className="font-mono text-blue-700">S(t) = w · e^(-λt)</strong>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5 shadow-xs">
                ✓
              </span>
              <span>Strict FSM lifecycle verification: Open ➔ In Progress ➔ Resolved ➔ Closed</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5 shadow-xs">
                ✓
              </span>
              <span>Decoupled Transactional Outbox pattern inside ACID transaction boundaries</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5 shadow-xs">
                ✓
              </span>
              <span>Facility Operations AI Copilot with real-time telemetry diagnostics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
