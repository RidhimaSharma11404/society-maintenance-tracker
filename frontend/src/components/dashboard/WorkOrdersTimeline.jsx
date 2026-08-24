import React, { useState } from 'react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import {
  Clock,
  AlertTriangle,
  ChevronRight,
  List,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const WorkOrdersTimeline = ({
  complaints = [],
  selectedUnit,
  onSelectComplaint,
  onViewAllRegistry
}) => {
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'table'

  const normalize = (str) => (!str ? '' : str.toLowerCase().replace(/[\s\-_]/g, ''));

  // Filter by selected unit if set
  const filteredComplaints = selectedUnit
    ? complaints.filter((c) =>
        normalize(c.unitNumber).includes(normalize(selectedUnit)) ||
        normalize(selectedUnit).includes(normalize(c.unitNumber))
      )
    : complaints;

  const getRemainingHours = (complaint) => {
    if (complaint.remainingHours !== undefined && complaint.remainingHours !== null) {
      return complaint.remainingHours;
    }
    if (complaint.dueDate) {
      const diff = new Date(complaint.dueDate).getTime() - Date.now();
      return Math.max(0, Math.round(diff / (1000 * 60 * 60)));
    }
    return 24;
  };

  const getIsOverdue = (complaint) => {
    if (complaint.isOverdue !== undefined) return complaint.isOverdue;
    if (['Resolved', 'Closed'].includes(complaint.currentStatus)) return false;
    return complaint.dueDate ? new Date(complaint.dueDate).getTime() < Date.now() : false;
  };

  return (
    <div className="bg-[#0B1220]/90 border border-slate-800 p-5 sm:p-7 font-sans text-slate-100 rounded-3xl backdrop-blur-xl shadow-xl space-y-5">
      {/* Header with View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-white tracking-wide uppercase font-mono flex items-center gap-2">
              <List className="w-4 h-4 text-cyan-400" />
              Active Work Orders & Maintenance Stream
            </h3>
            {selectedUnit && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                Filtered: {selectedUnit}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status updates and contractor dispatch pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={onViewAllRegistry}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2 py-1 cursor-pointer"
          >
            <span>All Tickets ({complaints.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Timeline Feed */}
      {viewMode === 'timeline' ? (
        <div className="space-y-3">
          {filteredComplaints.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
              No active tickets found for this filter.
            </div>
          ) : (
            filteredComplaints.map((c) => {
              const isOverdue = getIsOverdue(c);
              const remainingHours = getRemainingHours(c);

              return (
                <div
                  key={c._id}
                  onClick={() => onSelectComplaint && onSelectComplaint(c._id)}
                  className={`p-4 bg-slate-950/80 hover:bg-slate-900 border rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-md ${
                    isOverdue
                      ? 'border-rose-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                      : 'border-slate-800/90 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-cyan-300 font-bold">
                        {c.unitNumber}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {c.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {c.description}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-0.5">
                      <span>Category: <strong className="text-slate-300">{c.category}</strong></span>
                      <span>·</span>
                      <span>Resident: <strong className="text-slate-300">{c.resident?.name || 'Arthur Pendelton'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    {isOverdue ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/60 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        OVERDUE SLA
                      </span>
                    ) : remainingHours > 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {remainingHours}h SLA left
                      </span>
                    ) : null}

                    <StatusBadge status={c.currentStatus} />
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs font-sans text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Unit</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
              {filteredComplaints.map((c) => (
                <tr
                  key={c._id}
                  onClick={() => onSelectComplaint && onSelectComplaint(c._id)}
                  className="hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <td className="p-3 font-mono font-bold text-cyan-300">{c.unitNumber}</td>
                  <td className="p-3 font-semibold text-white truncate max-w-xs">{c.title}</td>
                  <td className="p-3 text-slate-400">{c.category}</td>
                  <td className="p-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="p-3"><StatusBadge status={c.currentStatus} /></td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">
                    {getIsOverdue(c) ? (
                      <span className="text-rose-400 font-bold">Overdue</span>
                    ) : (
                      `${getRemainingHours(c)}h`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
