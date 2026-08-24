import React, { useState } from 'react';
import { RiskBadge, StatusBadge } from '../common/Badge';
import {
  Building2,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  PlusCircle,
  X
} from 'lucide-react';

const FLOORS = [4, 3, 2, 1];
const UNITS_PER_FLOOR = [1, 2, 3, 4];

export const TowerHeatmap = ({ clusters = [], complaints = [], onSelectUnit, onOpenCreateTicket }) => {
  const [activeTower, setActiveTower] = useState('Tower B');
  const [selectedFlat, setSelectedFlat] = useState('Tower B - 101');

  // Find risk cluster info for a flat
  const getUnitRisk = (towerName, floorNum, unitNum) => {
    const flatStr = `${towerName} - ${floorNum}0${unitNum}`;
    const foundCluster = clusters.find((c) => c.unitNumber === flatStr);
    const flatComplaints = complaints.filter((c) => c.unitNumber === flatStr);
    const hasActive = flatComplaints.some((c) => c.currentStatus === 'Open' || c.currentStatus === 'In Progress');

    if (foundCluster) {
      return {
        unitNumber: flatStr,
        score: foundCluster.totalRiskScore,
        level: foundCluster.riskLevel,
        category: foundCluster.category,
        totalComplaints: foundCluster.complaintCount,
        hasActive,
        complaints: flatComplaints
      };
    }

    return {
      unitNumber: flatStr,
      score: 0,
      level: 'Clear',
      category: 'General',
      totalComplaints: flatComplaints.length,
      hasActive,
      complaints: flatComplaints
    };
  };

  const currentSelectedData = (() => {
    const [t, rest] = selectedFlat.split(' - ');
    const f = rest ? parseInt(rest[0]) : 1;
    const u = rest ? parseInt(rest.slice(-1)) : 1;
    return getUnitRisk(t || activeTower, f, u);
  })();

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
              Digital-Twin Society Tower Matrix & Health Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive structural defect visualization. Click any unit to inspect real-time decayed risk telemetry.
          </p>
        </div>

        {/* Tower Selector Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs self-start sm:self-auto">
          {['Tower A', 'Tower B', 'Common Areas'].map((tw) => (
            <button
              key={tw}
              onClick={() => {
                setActiveTower(tw);
                if (tw !== 'Common Areas') {
                  setSelectedFlat(`${tw} - 101`);
                }
              }}
              className={`px-3 py-1 rounded font-bold transition-all ${
                activeTower === tw
                  ? 'bg-white text-blue-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tw}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Tower Map, Right Unit Diagnostic Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Floor-by-Floor Matrix */}
        <div className="lg:col-span-2 space-y-3">
          {activeTower === 'Common Areas' ? (
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <Layers className="w-8 h-8 text-blue-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Common Utility & Asset Corridor</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Monitors common risers, central water pumps, clubhouse elevators, and emergency power generators.
              </p>
              <div className="pt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold font-mono">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Elevator / Lift Risk Score: 4.77 pts (Elevated)
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {FLOORS.map((floorNum) => (
                <div key={floorNum} className="flex items-center gap-3">
                  <span className="w-16 font-mono text-[11px] font-bold text-slate-400 text-right uppercase">
                    Floor {floorNum}
                  </span>

                  <div className="flex-1 grid grid-cols-4 gap-2.5">
                    {UNITS_PER_FLOOR.map((unitNum) => {
                      const unitData = getUnitRisk(activeTower, floorNum, unitNum);
                      const isSelected = selectedFlat === unitData.unitNumber;

                      let bgStyles = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                      if (unitData.level === 'Critical') {
                        bgStyles = 'bg-rose-50 border-rose-300 text-rose-900 font-extrabold hover:bg-rose-100 shadow-2xs';
                      } else if (unitData.level === 'High') {
                        bgStyles = 'bg-amber-50 border-amber-300 text-amber-900 font-bold hover:bg-amber-100';
                      } else if (unitData.level === 'Elevated') {
                        bgStyles = 'bg-blue-50 border-blue-300 text-blue-900 font-bold hover:bg-blue-100';
                      } else if (unitData.hasActive) {
                        bgStyles = 'bg-sky-50 border-sky-300 text-sky-900 font-semibold hover:bg-sky-100';
                      }

                      return (
                        <button
                          key={unitNum}
                          onClick={() => setSelectedFlat(unitData.unitNumber)}
                          className={`p-3 rounded-lg border text-center transition-all cursor-pointer relative ${bgStyles} ${
                            isSelected ? 'ring-2 ring-blue-600 shadow-sm' : ''
                          }`}
                        >
                          <div className="text-xs font-bold font-mono">
                            {floorNum}0{unitNum}
                          </div>
                          <div className="text-[10px] opacity-80 mt-0.5">
                            {unitData.score > 0 ? `${unitData.score} pts` : 'Nominal'}
                          </div>

                          {unitData.level === 'Critical' && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Matrix Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Heatmap Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300" />
              <span className="text-slate-600">Critical Cluster (≥ 8.0)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
              <span className="text-slate-600">High Risk (5.0 - 7.9)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
              <span className="text-slate-600">Elevated (3.0 - 4.9)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
              <span className="text-slate-600">Nominal / Clear</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Diagnostic Drilldown */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Unit Diagnostic
              </span>
              <h4 className="text-base font-extrabold text-slate-900 font-mono">
                {currentSelectedData.unitNumber}
              </h4>
            </div>
            <RiskBadge
              level={currentSelectedData.level}
              score={currentSelectedData.score}
            />
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Decayed Risk Score:</span>
              <span className="font-mono font-bold text-slate-900">
                {currentSelectedData.score} pts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Dominant Category:</span>
              <span className="font-bold text-slate-800">
                {currentSelectedData.category}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Recorded Defects:</span>
              <span className="font-mono font-bold text-slate-800">
                {currentSelectedData.totalComplaints} tickets
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Active Work Orders:</span>
              <span className={`font-bold ${currentSelectedData.hasActive ? 'text-rose-700' : 'text-emerald-700'}`}>
                {currentSelectedData.hasActive ? 'Active Issue' : 'All Clear'}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-slate-200/80">
            <button
              onClick={() => onOpenCreateTicket && onOpenCreateTicket(currentSelectedData.unitNumber)}
              className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Ticket for {currentSelectedData.unitNumber}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
