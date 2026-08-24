import React from 'react';
import { Building, Wrench, X, AlertTriangle, ShieldCheck, Sparkles, Activity } from 'lucide-react';

export const BuildingSchematicMap = ({
  riskClusters = [],
  unitRisk = [],
  selectedUnit,
  onSelectUnit,
  recentComplaints = [],
  onOpenCreateTicket
}) => {
  const normalize = (str) => (!str ? '' : str.toLowerCase().replace(/[\s\-_]/g, ''));

  const getUnitStatus = (unitId) => {
    const normId = normalize(unitId);
    const cluster = riskClusters.find((c) => normalize(c.unitNumber) === normId);
    const unitRiskData = unitRisk.find((u) => normalize(u.unitNumber) === normId);
    const complaints = recentComplaints.filter((c) => normalize(c.unitNumber) === normId);

    const score = cluster?.totalRiskScore || unitRiskData?.score || 0;
    const complaintCount = cluster?.complaintCount || complaints.length || 0;

    let level = 'Clear';
    if (score >= 8.0) {
      level = 'Critical';
    } else if (score >= 5.0) {
      level = 'High';
    } else if (score >= 3.0) {
      level = 'Elevated';
    } else if (complaints.some((c) => c.isOverdue)) {
      level = 'Critical';
    } else if (complaints.some((c) => c.currentStatus === 'Open' || c.currentStatus === 'In Progress')) {
      level = 'Elevated';
    }

    return {
      level,
      score: Number(score.toFixed(1)),
      count: complaintCount,
      complaints
    };
  };

  const floors = [
    { floor: 4, label: 'FL 04', unitsA: ['Tower A - 401', 'Tower A - 402'], unitsB: ['Tower B - 401', 'Tower B - 402'] },
    { floor: 3, label: 'FL 03', unitsA: ['Tower A - 301', 'Tower A - 302'], unitsB: ['Tower B - 301', 'Tower B - 302'] },
    { floor: 2, label: 'FL 02', unitsA: ['Tower A - 201', 'Tower A - 202'], unitsB: ['Tower B - 201', 'Tower B - 202'] },
    { floor: 1, label: 'FL 01', unitsA: ['Tower A - 101', 'Tower A - 102'], unitsB: ['Tower B - 101', 'Tower B - 102'] },
    { floor: 0, label: 'GROUND', unitsA: ['Tower A - G01', 'Tower A - G02'], unitsB: ['Tower B - G01', 'Tower B - G02'] }
  ];

  const commonPlants = [
    { id: 'Common Area - Tower B', label: 'Passenger Lift B2', sub: 'Shaft Core & Machine Room', category: 'Elevator' },
    { id: 'Common Area - Tower A', label: 'Passenger Lift A1', sub: 'Shaft Core & Machine Room', category: 'Elevator' },
    { id: 'Common Area - Main Switchroom', label: 'Main Substation & DG', sub: '415V Panel & DG Sync', category: 'Electrical' },
    { id: 'Common Area - Pump House', label: 'Hydro Pump & Tanks', sub: 'Overhead & Sump Pumps', category: 'Plumbing' }
  ];

  const activeUnitInfo = selectedUnit ? getUnitStatus(selectedUnit) : null;

  return (
    <div className="relative bg-[#0B1220]/90 border border-slate-800 p-6 sm:p-10 font-sans text-slate-100 rounded-3xl backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-slate-800/80 pb-5 mb-7">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-white uppercase flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Greenwood Heights · Live Elevation
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono border border-emerald-500/30 bg-emerald-950/50 text-emerald-400 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              24 Units Monitored
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Interactive digital twin. Tap any physical flat or core plant to inspect live telemetry and active work orders.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <span className="text-rose-400 font-bold">Critical Issue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            <span className="text-amber-400 font-bold">High Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600" />
            <span className="text-slate-400">Nominal</span>
          </div>
        </div>
      </div>

      {/* ELEVATION LAYOUT */}
      <div className="relative bg-[#070D18]/90 border border-slate-800/80 p-5 sm:p-8 rounded-2xl shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {/* TOWER A */}
          <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 p-5 rounded-2xl space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-sans font-bold text-xs text-white uppercase tracking-wider block">
                  Tower A (West Wing)
                </span>
                <span className="text-[11px] font-mono text-cyan-400">Units 101 – 402</span>
              </div>
              <Building className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5">
              {floors.map((fl) => (
                <div key={fl.floor} className="flex items-center gap-2.5">
                  <span className="w-12 text-[10px] font-mono text-slate-500 text-center font-bold">
                    {fl.label}
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 flex-1">
                    {fl.unitsA.map((u) => {
                      const status = getUnitStatus(u);
                      const isSelected = selectedUnit === u;
                      const isCritical = status.level === 'Critical';
                      const isHigh = status.level === 'High';
                      const isElevated = status.level === 'Elevated';

                      return (
                        <button
                          key={u}
                          onClick={() => onSelectUnit(isSelected ? null : u)}
                          className={`living-unit p-3 text-left rounded-xl border cursor-pointer relative transition-all ${
                            isSelected
                              ? 'ring-2 ring-cyan-400 bg-slate-800 border-cyan-400 z-30 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : isCritical
                              ? 'bg-rose-950/80 text-white border-rose-500/80 glow-critical'
                              : isHigh
                              ? 'bg-amber-950/80 text-white border-amber-500/80 glow-high font-semibold'
                              : isElevated
                              ? 'bg-blue-950/60 text-cyan-200 border-blue-600/50'
                              : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800/90'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs tracking-tight">
                              {u.replace('Tower A - ', 'A-')}
                            </span>
                            {status.score > 0 && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                isCritical ? 'bg-rose-500 text-white font-bold' : isHigh ? 'bg-amber-500 text-black font-bold' : 'bg-cyan-900 text-cyan-300'
                              }`}>
                                {status.score}p
                              </span>
                            )}
                          </div>
                          <div className={`text-[10px] font-sans mt-1 leading-tight whitespace-nowrap ${
                            isCritical ? 'text-rose-200 font-medium' : isHigh ? 'text-amber-200 font-medium' : 'text-slate-400'
                          }`}>
                            {status.count > 0 ? `${status.count} Active ${status.count === 1 ? 'Ticket' : 'Tickets'}` : 'Nominal'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTRAL UTILITY CORE */}
          <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 p-5 rounded-2xl space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-sans font-bold text-xs text-white uppercase tracking-wider block">
                  Central Utility Core
                </span>
                <span className="text-[11px] font-mono text-cyan-400">Shared Campus Assets</span>
              </div>
              <Wrench className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5">
              {commonPlants.map((plant) => {
                const status = getUnitStatus(plant.id);
                const isSelected = selectedUnit === plant.id;
                const isCritical = status.level === 'Critical';
                const isHigh = status.level === 'High' || status.level === 'Elevated';

                return (
                  <button
                    key={plant.id}
                    onClick={() => onSelectUnit(isSelected ? null : plant.id)}
                    className={`living-unit w-full p-3 text-left rounded-xl border cursor-pointer relative transition-all ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 bg-slate-800 border-cyan-400 z-30 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : isCritical
                        ? 'bg-rose-950/80 text-white border-rose-500/80 glow-critical'
                        : isHigh
                        ? 'bg-amber-950/80 text-white border-amber-500/80 glow-high font-semibold'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-xs tracking-tight">
                        {plant.label}
                      </span>
                      {status.score > 0 ? (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isCritical ? 'bg-rose-500 text-white font-bold' : 'bg-amber-500 text-black font-bold'
                        }`}>
                          {status.score} pts
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          OK
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] font-sans mt-1 ${
                      isCritical || isHigh ? 'text-slate-200' : 'text-slate-400'
                    }`}>
                      {plant.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TOWER B */}
          <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 p-5 rounded-2xl space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-sans font-bold text-xs text-white uppercase tracking-wider block">
                  Tower B (East Wing)
                </span>
                <span className="text-[11px] font-mono text-cyan-400">Units 101 – 402</span>
              </div>
              <Building className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5">
              {floors.map((fl) => (
                <div key={fl.floor} className="flex items-center gap-2.5">
                  <span className="w-12 text-[10px] font-mono text-slate-500 text-center font-bold">
                    {fl.label}
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 flex-1">
                    {fl.unitsB.map((u) => {
                      const status = getUnitStatus(u);
                      const isSelected = selectedUnit === u;
                      const isCritical = status.level === 'Critical';
                      const isHigh = status.level === 'High';
                      const isElevated = status.level === 'Elevated';

                      return (
                        <button
                          key={u}
                          onClick={() => onSelectUnit(isSelected ? null : u)}
                          className={`living-unit p-3 text-left rounded-xl border cursor-pointer relative transition-all ${
                            isSelected
                              ? 'ring-2 ring-cyan-400 bg-slate-800 border-cyan-400 z-30 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : isCritical
                              ? 'bg-rose-950/80 text-white border-rose-500/80 glow-critical'
                              : isHigh
                              ? 'bg-amber-950/80 text-white border-amber-500/80 glow-high font-semibold'
                              : isElevated
                              ? 'bg-blue-950/60 text-cyan-200 border-blue-600/50'
                              : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800/90'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs tracking-tight">
                              {u.replace('Tower B - ', 'B-')}
                            </span>
                            {status.score > 0 && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                isCritical ? 'bg-rose-500 text-white font-bold' : isHigh ? 'bg-amber-500 text-black font-bold' : 'bg-cyan-900 text-cyan-300'
                              }`}>
                                {status.score}p
                              </span>
                            )}
                          </div>
                          <div className={`text-[10px] font-sans mt-1 leading-tight whitespace-nowrap ${
                            isCritical ? 'text-rose-200 font-medium' : isHigh ? 'text-amber-200 font-medium' : 'text-slate-400'
                          }`}>
                            {status.count > 0 ? `${status.count} Active ${status.count === 1 ? 'Ticket' : 'Tickets'}` : 'Nominal'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SELECTED UNIT DRAWER / INSPECTOR */}
      {selectedUnit && activeUnitInfo && (
        <div className="mt-6 p-5 bg-slate-900/95 border border-cyan-500/40 rounded-2xl space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono text-xs">
                {selectedUnit.slice(0, 7)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{selectedUnit}</h3>
                <span className="text-xs text-slate-400">
                  Risk Score: <strong className="text-cyan-400 font-mono">{activeUnitInfo.score} pts</strong> · Status:{' '}
                  <strong className={activeUnitInfo.level === 'Critical' ? 'text-rose-400' : 'text-emerald-400'}>
                    {activeUnitInfo.level}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenCreateTicket && onOpenCreateTicket(selectedUnit)}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm"
              >
                + Dispatch Ticket for {selectedUnit}
              </button>
              <button
                onClick={() => onSelectUnit(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ticket list for unit */}
          {activeUnitInfo.complaints?.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Work Orders for this Location:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeUnitInfo.complaints.map((c) => (
                  <div key={c._id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate">{c.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-cyan-300 border border-cyan-500/30">
                        {c.currentStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No active complaints logged for this unit. All telemetry is nominal.</p>
          )}
        </div>
      )}
    </div>
  );
};
