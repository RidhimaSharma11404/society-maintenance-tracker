import React from 'react';
import {
  CheckCircle2,
  Wrench,
  Zap,
  Droplets,
  ShieldCheck,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';

export const ResidentBuildingHealth = ({
  activeComplaintsCount = 0,
  openComplaints = 0,
  inProgressComplaints = 0,
  onOpenCreateTicket,
  onViewComplaints
}) => {
  const buildingSystems = [
    { name: 'Elevator Lifts (Wings A, B, C)', status: 'Operational', code: '4/4 Active', icon: Wrench },
    { name: 'Domestic Water Supply', status: 'Normal Pressure', code: 'Tank 88%', icon: Droplets },
    { name: 'Common Area Power Backup', status: 'Stable Grid', code: 'DG Standby', icon: Zap },
    { name: 'Perimeter Security', status: '24/7 Monitored', code: 'Guards Active', icon: ShieldCheck }
  ];

  const repairText = activeComplaintsCount === 1
    ? '1 active maintenance repair currently being handled by staff.'
    : `${activeComplaintsCount} active maintenance repairs currently being handled by staff.`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Building Facilities Health & Maintenance Status
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Status: Nominal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Greenwood Heights daily facility status · {repairText}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateTicket}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report a Flat Issue</span>
          </button>
        </div>
      </div>

      {/* Systems Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {buildingSystems.map((sys, idx) => {
          const Icon = sys.icon;
          return (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between relative hover:border-blue-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Icon className="w-3.5 h-3.5 text-blue-600" />
                  <span>{sys.name}</span>
                </div>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{sys.status}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono border border-slate-200 bg-white rounded px-1.5 py-0.5 text-slate-600">
                {sys.code}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary Banner */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="font-bold text-slate-900">
              Active Repairs in Progress:
            </span>{' '}
            <span className="text-slate-600">
              {openComplaints} new request{openComplaints === 1 ? '' : 's'} received · {inProgressComplaints} assigned to technicians on site.
            </span>
          </div>
        </div>

        <button
          onClick={onViewComplaints}
          className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>Track My Flat Requests</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
