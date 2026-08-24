import React, { useState } from 'react';
import { RiskBadge, StatusBadge } from '../common/Badge';
import {
  Building2,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Layers,
  PlusCircle,
  ShieldAlert,
  MapPin,
  Sparkles,
  Wrench,
  ChevronRight,
  X
} from 'lucide-react';

const SOCIETY_BLOCKS = [
  {
    id: 'Tower A',
    name: 'Tower A (North Wing)',
    type: 'Residential (16 Units)',
    floors: 4,
    unitsPerFloor: 4,
    status: 'High Risk',
    activeIssue: 'Flat 402 - Electrical Short Circuit',
    riskScore: 6.94,
    riskLevel: 'High',
    color: 'border-amber-400 bg-amber-50/70 hover:bg-amber-100/80',
    iconColor: 'text-amber-600 bg-amber-100',
    position: 'top-left'
  },
  {
    id: 'Tower B',
    name: 'Tower B (South Wing)',
    type: 'Residential (16 Units)',
    floors: 4,
    unitsPerFloor: 4,
    status: 'Critical Cluster',
    activeIssue: 'Flat 101 - Riser Pipe Burst (Recurring 4x)',
    riskScore: 13.23,
    riskLevel: 'Critical',
    color: 'border-rose-400 bg-rose-50/70 hover:bg-rose-100/80',
    iconColor: 'text-rose-600 bg-rose-100',
    position: 'bottom-left'
  },
  {
    id: 'Tower C',
    name: 'Tower C (East Wing)',
    type: 'Residential (16 Units)',
    floors: 4,
    unitsPerFloor: 4,
    status: 'Optimal / Clear',
    activeIssue: 'All systems operating within baseline',
    riskScore: 0.0,
    riskLevel: 'Clear',
    color: 'border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70',
    iconColor: 'text-emerald-600 bg-emerald-100',
    position: 'top-right'
  },
  {
    id: 'Clubhouse',
    name: 'Clubhouse & Amenities',
    type: 'Community Hub & Gym',
    floors: 2,
    unitsPerFloor: 2,
    status: 'Elevated Watch',
    activeIssue: 'Elevator / Lift Periodic Service Overdue',
    riskScore: 4.77,
    riskLevel: 'Elevated',
    color: 'border-blue-400 bg-blue-50/70 hover:bg-blue-100/80',
    iconColor: 'text-blue-600 bg-blue-100',
    position: 'center'
  },
  {
    id: 'Utility Complex',
    name: 'Central Pump & Generator House',
    type: 'Critical Utility Asset',
    floors: 1,
    unitsPerFloor: 1,
    status: 'Optimal / Clear',
    activeIssue: 'Dual backup pumps online',
    riskScore: 0.0,
    riskLevel: 'Clear',
    color: 'border-slate-300 bg-slate-50/80 hover:bg-slate-100',
    iconColor: 'text-slate-600 bg-slate-200',
    position: 'bottom-right'
  }
];

export const SocietyLayoutMap = ({ onOpenCreateTicket, onNavigateTab }) => {
  const [selectedBlock, setSelectedBlock] = useState(SOCIETY_BLOCKS[1]); // Default Tower B
  const [selectedFloor, setSelectedFloor] = useState(1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Building2 className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Greenwood Heights — Whole Society Campus Layout
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Architectural overview of all society residential towers and common utility zones. Click any block to view unit health.
          </p>
        </div>

        <button
          onClick={() => onOpenCreateTicket()}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise New Complaint</span>
        </button>
      </div>

      {/* Campus Map Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-100/70 p-4 rounded-xl border border-slate-200">
        {SOCIETY_BLOCKS.map((block) => {
          const isSelected = selectedBlock.id === block.id;

          return (
            <div
              key={block.id}
              onClick={() => setSelectedBlock(block)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative shadow-xs ${block.color} ${
                isSelected ? 'ring-3 ring-blue-600 scale-[1.02] shadow-md' : 'hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg font-bold ${block.iconColor}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {block.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {block.type}
                    </span>
                  </div>
                </div>

                {block.riskScore > 0 ? (
                  <RiskBadge level={block.riskLevel} score={block.riskScore} />
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Clear
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-700 bg-white/80 p-2 rounded border border-slate-200/60 mt-2 space-y-0.5">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Status:</span>
                  <span className={block.riskScore > 0 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {block.status}
                  </span>
                </div>
                <div className="text-slate-600 truncate text-[10px]">
                  {block.activeIssue}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Block Unit Matrix & Quick Action Drawer */}
      {selectedBlock && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedBlock.name} — Unit Floor Plan
                </h4>
                <RiskBadge level={selectedBlock.riskLevel} score={selectedBlock.riskScore} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a unit below to view recorded complaints or log a maintenance request directly.
              </p>
            </div>

            <button
              onClick={() => onOpenCreateTicket(selectedBlock.id.startsWith('Tower') ? `${selectedBlock.id} - 101` : selectedBlock.id)}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Complaint for {selectedBlock.id}</span>
            </button>
          </div>

          {/* Unit Grid for Selected Block */}
          {selectedBlock.floors > 1 ? (
            <div className="space-y-2">
              {[4, 3, 2, 1].slice(4 - selectedBlock.floors).map((floor) => (
                <div key={floor} className="flex items-center gap-3">
                  <span className="w-16 font-mono text-[11px] font-bold text-slate-500 text-right uppercase">
                    Floor {floor}
                  </span>
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].slice(0, selectedBlock.unitsPerFloor).map((unit) => {
                      const flatName = `${selectedBlock.id} - ${floor}0${unit}`;
                      const isHighRisk = flatName === 'Tower B - 101';
                      const isElevated = flatName === 'Tower A - 402';

                      return (
                        <button
                          key={unit}
                          onClick={() => onOpenCreateTicket(flatName)}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            isHighRisk
                              ? 'bg-rose-50 border-rose-300 text-rose-900 font-extrabold hover:bg-rose-100 shadow-2xs'
                              : isElevated
                              ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold hover:bg-amber-100'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                          title={`Click to log complaint for ${flatName}`}
                        >
                          <div className="text-xs font-bold font-mono">
                            {flatName.replace(`${selectedBlock.id} - `, 'Unit ')}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {isHighRisk ? '13.2 pts (Critical)' : isElevated ? '6.9 pts (High)' : 'All Clear'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800">Critical Infrastructure Asset:</div>
              <p>Dual 15HP submersible water pumps and 125kVA backup diesel generator.</p>
              <button
                onClick={() => onOpenCreateTicket('Utility Complex')}
                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-800 font-bold rounded border border-slate-300 text-xs"
              >
                Log Utility Maintenance Request
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
