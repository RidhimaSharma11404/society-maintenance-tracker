import React, { useState } from 'react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import {
  Clock,
  AlertTriangle,
  ChevronRight,
  List,
  Calendar,
  CheckCircle2
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
    <div className="bg-white border border-[#CBD3DD] p-4 sm:p-5 font-sans text-[#16233D]">
      {/* Header with View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E8EE] pb-3.5 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#16233D]" />
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-[#16233D]">
              WORK ORDERS & DISPATCH LOG
            </h3>
            {selectedUnit ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#16233D] text-[#EEF2F6]">
                UNIT: {selectedUnit.toUpperCase()} ({filteredComplaints.length})
              </span>
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.2 border border-[#CBD3DD] bg-[#F7F9FB] text-[#6E7C90]">
                TOTAL: {filteredComplaints.length} WORK ORDERS
              </span>
            )}
          </div>
          <p className="text-[11px] font-sans text-[#6E7C90] mt-0.5">
            Chronological maintenance event stream ordered by turnaround priority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeline / Table Switcher */}
          <div className="flex items-center bg-[#F7F9FB] border border-[#CBD3DD] p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 flex items-center gap-1.5 text-[10px] uppercase font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-[#16233D] text-[#EEF2F6]'
                  : 'text-[#6E7C90] hover:text-[#16233D]'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Timeline Log</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 flex items-center gap-1.5 text-[10px] uppercase font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#16233D] text-[#EEF2F6]'
                  : 'text-[#6E7C90] hover:text-[#16233D]'
              }`}
            >
              <List className="w-3 h-3" />
              <span>Table Grid</span>
            </button>
          </div>

          <button
            onClick={onViewAllRegistry}
            className="text-xs font-sans text-[#16233D] hover:text-[#E8A33D] font-semibold flex items-center gap-1 cursor-pointer pl-1"
          >
            <span>Registry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredComplaints.length === 0 ? (
        <div className="p-8 text-center bg-[#F7F9FB] border border-[#CBD3DD]">
          <CheckCircle2 className="w-8 h-8 text-[#2E8B63] mx-auto mb-2" />
          <h4 className="text-xs font-bold font-sans uppercase text-[#16233D]">
            NO DEFECT WORK ORDERS LOGGED
          </h4>
          <p className="text-[11px] font-sans text-[#6E7C90] mt-0.5">
            {selectedUnit
              ? `No active or historical maintenance complaints recorded for ${selectedUnit}.`
              : 'All building facilities nominal. No active complaints.'}
          </p>
        </div>
      ) : viewMode === 'timeline' ? (
        /* CHRONOLOGICAL TIMELINE VIEW */
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#CBD3DD]">
          {filteredComplaints.map((c) => {
            const dateStr = new Date(c.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const isOverdue = getIsOverdue(c);
            const remainingHours = getRemainingHours(c);

            return (
              <div
                key={c._id}
                onClick={() => onSelectComplaint && onSelectComplaint(c._id)}
                className="relative group cursor-pointer"
              >
                {/* Clean Circular Timeline Node Dot */}
                <span
                  className={`absolute -left-[20px] top-3.5 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                    isOverdue
                      ? 'border-[#C6433D] bg-[#C6433D]'
                      : c.currentStatus === 'In Progress'
                      ? 'border-[#E8A33D] bg-[#E8A33D]'
                      : c.currentStatus === 'Resolved'
                      ? 'border-[#2E8B63] bg-[#2E8B63]'
                      : 'border-[#16233D] bg-[#16233D]'
                  }`}
                />

                {/* Entry Card */}
                <div className="p-3 bg-[#F7F9FB] hover:bg-white border border-[#CBD3DD] hover:border-[#16233D] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#16233D] bg-white px-1.5 py-0.5 border border-[#CBD3DD]">
                        #{c._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="font-mono font-bold text-xs bg-[#16233D] text-[#EEF2F6] px-1.5 py-0.5">
                        {c.unitNumber}
                      </span>
                      <span className="text-xs font-bold font-sans text-[#16233D]">
                        {c.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.currentStatus} />
                      <PriorityBadge priority={c.priority} />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-sans text-[#6E7C90] pt-1.5 border-t border-[#E4E8EE]">
                    <div>
                      <span className="font-semibold text-[#16233D]">CATEGORY:</span> {c.category?.toUpperCase()} · LOGGED ON: <span className="font-mono">{dateStr}</span>
                    </div>

                    <div className="font-mono text-[11px]">
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[#C6433D]">
                          <AlertTriangle className="w-3 h-3" />
                          OVERDUE SLA
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#16233D]">
                          <Clock className="w-3 h-3 text-[#6E7C90]" />
                          {remainingHours}h remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FB] text-[#6E7C90] uppercase tracking-wider text-[10px] font-mono border-b border-[#CBD3DD]">
              <tr>
                <th className="px-4 py-2.5">TICKET / SUMMARY</th>
                <th className="px-4 py-2.5">UNIT_LOCATION</th>
                <th className="px-4 py-2.5">STATUS</th>
                <th className="px-4 py-2.5">PRIORITY</th>
                <th className="px-4 py-2.5">SLA_WINDOW</th>
                <th className="px-4 py-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E8EE]">
              {filteredComplaints.map((c) => {
                const isOverdue = getIsOverdue(c);
                const remainingHours = getRemainingHours(c);

                return (
                  <tr
                    key={c._id}
                    onClick={() => onSelectComplaint && onSelectComplaint(c._id)}
                    className="hover:bg-[#F7F9FB] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#16233D] bg-[#F7F9FB] px-1 py-0.2 border border-[#CBD3DD]">
                          #{c._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="font-sans font-semibold text-[#16233D] line-clamp-1">
                          {c.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6E7C90] font-mono mt-0.5">
                        {c.category?.toUpperCase()} · {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-[#16233D] text-[11px]">
                      <span className="px-1.5 py-0.5 border border-[#CBD3DD] bg-[#F7F9FB]">
                        {c.unitNumber}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={c.currentStatus} />
                    </td>

                    <td className="px-4 py-3">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px]">
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 text-[#C6433D] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          OVERDUE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#16233D]">
                          <Clock className="w-3 h-3 text-[#6E7C90]" />
                          {remainingHours}h left
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint && onSelectComplaint(c._id);
                        }}
                        className="px-2.5 py-1 border border-[#CBD3DD] bg-white hover:bg-[#16233D] hover:text-white text-[#16233D] transition-colors text-[11px] font-mono font-semibold cursor-pointer"
                      >
                        INSPECT
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
