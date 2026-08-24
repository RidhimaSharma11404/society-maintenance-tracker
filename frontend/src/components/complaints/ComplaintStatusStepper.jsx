import React from 'react';
import { Check, PlayCircle, Clock } from 'lucide-react';
import { RoleBadge } from '../common/Badge';

const ORDERED_STEPS = ['Open', 'In Progress', 'Resolved', 'Closed'];

export const ComplaintStatusStepper = ({ currentStatus, statusHistory = [] }) => {
  const currentIndex = ORDERED_STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Stepper */}
      <div className="relative flex items-center justify-between px-3">
        {/* Track Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
            style={{
              width: `${(Math.max(0, currentIndex) / (ORDERED_STEPS.length - 1)) * 100}%`
            }}
          />
        </div>

        {ORDERED_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-500/30'
                    : isCompleted
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <PlayCircle className="w-4 h-4" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`mt-1.5 text-xs font-bold ${
                  isCurrent
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Append-Only Lifecycle Audit Trail */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-600" />
          Lifecycle Audit Log ({statusHistory.length} events)
        </h4>

        <div className="relative pl-5 border-l-2 border-slate-200 space-y-3">
          {statusHistory.map((entry, index) => (
            <div key={entry._id || index} className="relative">
              {/* Dot */}
              <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-blue-600 shadow-xs" />

              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                      {entry.status}
                    </span>
                    <span className="text-slate-400">by</span>
                    <span className="font-bold text-slate-800">
                      {entry.updatedBy?.name || 'System Actor'}
                    </span>
                    {entry.updatedBy?.role && (
                      <RoleBadge role={entry.updatedBy.role} />
                    )}
                  </div>
                  <time className="text-[11px] text-slate-400 font-mono">
                    {new Date(entry.updatedAt).toLocaleString()}
                  </time>
                </div>

                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed font-medium">
                  "{entry.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
