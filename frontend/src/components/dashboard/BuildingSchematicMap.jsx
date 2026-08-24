import React from 'react';
import { Building, Wrench, X, AlertTriangle, ShieldCheck } from 'lucide-react';

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
    <div className="relative bg-white border border-[#CBD3DD] p-8 sm:p-12 font-sans text-[#16233D] shadow-sm">
      {/* Signature Architectural Corner Drafting Marks */}
      <span className="absolute -top-[1px] -left-[1px] w-3.5 h-3.5 border-t-2 border-l-2 border-[#16233D] pointer-events-none" />
      <span className="absolute -top-[1px] -right-[1px] w-3.5 h-3.5 border-t-2 border-r-2 border-[#16233D] pointer-events-none" />
      <span className="absolute -bottom-[1px] -left-[1px] w-3.5 h-3.5 border-b-2 border-l-2 border-[#16233D] pointer-events-none" />
      <span className="absolute -bottom-[1px] -right-[1px] w-3.5 h-3.5 border-b-2 border-r-2 border-[#16233D] pointer-events-none" />

      {/* Header with Human Voice */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#E4E8EE] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-[#16233D] uppercase">
              Greenwood Heights · Live Elevation
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono border border-[#CBD3DD] bg-[#F7F9FB] text-[#2E8B63] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#2E8B63]" />
              24 Units Monitored
            </span>
          </div>
          <p className="text-xs text-[#6E7C90] mt-1.5">
            Tap a unit to see what's going on. Trouble spots pulse with real-time alert telemetry.
          </p>
        </div>

        {/* Minimal Decisive Legend */}
        <div className="flex items-center gap-5 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#C6433D] shadow-[0_0_10px_rgba(198,67,61,0.7)]" />
            <span className="text-[#16233D] font-bold">Critical Issue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E8891C] shadow-[0_0_10px_rgba(232,137,28,0.6)]" />
            <span className="text-[#16233D] font-bold">High Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white border border-[#CBD3DD]" />
            <span className="text-[#6E7C90]">Nominal</span>
          </div>
        </div>
      </div>

      {/* HERO LIVING BUILDING SILHOUETTE ELEVATION */}
      <div className="relative bg-gradient-to-b from-[#F7F9FB] to-[#EEF2F6] border border-[#CBD3DD] p-6 sm:p-10 shadow-inner">
        {/* Subtle Drafting Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD3DD_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* TOWER A (Residential Wing - 4 Cols) */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-xs border border-[#CBD3DD] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E4E8EE] pb-3">
              <div>
                <span className="font-sans font-bold text-xs text-[#16233D] uppercase tracking-wider block">
                  Tower A
                </span>
                <span className="text-[11px] font-mono text-[#6E7C90]">Units 101 – 402</span>
              </div>
              <Building className="w-4 h-4 text-[#6E7C90]" />
            </div>

            <div className="space-y-2.5">
              {floors.map((fl) => (
                <div key={fl.floor} className="flex items-center gap-2.5">
                  <span className="w-12 text-[10px] font-mono text-[#6E7C90] text-center font-bold">
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
                          className={`living-unit p-3.5 text-left border cursor-pointer relative ${
                            isSelected
                              ? 'ring-2 ring-[#16233D] bg-white z-30 shadow-md'
                              : isCritical
                              ? 'bg-[#C6433D] text-white border-[#C6433D] glow-critical'
                              : isHigh
                              ? 'bg-[#E8891C] text-white border-[#E8891C] glow-high font-semibold'
                              : isElevated
                              ? 'bg-[#16233D] text-white border-[#16233D]'
                              : 'bg-white hover:bg-slate-50 text-[#16233D] border-[#CBD3DD]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs tracking-tight">
                              {u.replace('Tower A - ', 'A-')}
                            </span>
                            {status.score > 0 && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 ${
                                isCritical || isHigh || isElevated ? 'bg-black/25 text-white' : 'bg-[#16233D] text-white'
                              }`}>
                                {status.score}p
                              </span>
                            )}
                          </div>
                          <div className={`text-[9.5px] font-sans mt-1 leading-tight whitespace-nowrap ${
                            isCritical || isHigh || isElevated ? 'text-white/95 font-medium' : 'text-[#6E7C90]'
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

          {/* CENTRAL CORE: Common Facilities & Shared Utilities (4 Cols) */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-xs border border-[#CBD3DD] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E4E8EE] pb-3">
              <div>
                <span className="font-sans font-bold text-xs text-[#16233D] uppercase tracking-wider block">
                  Central Utility Core
                </span>
                <span className="text-[11px] font-mono text-[#6E7C90]">Shared Campus Assets</span>
              </div>
              <Wrench className="w-4 h-4 text-[#6E7C90]" />
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
                    className={`living-unit w-full p-3.5 text-left border cursor-pointer relative ${
                      isSelected
                        ? 'ring-2 ring-[#16233D] bg-white z-30 shadow-md'
                        : isCritical
                        ? 'bg-[#C6433D] text-white border-[#C6433D] glow-critical'
                        : isHigh
                        ? 'bg-[#E8891C] text-white border-[#E8891C] glow-high font-semibold'
                        : 'bg-white hover:bg-slate-50 text-[#16233D] border-[#CBD3DD]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-xs tracking-tight">
                        {plant.label}
                      </span>
                      {status.score > 0 ? (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 ${
                          isCritical || isHigh ? 'bg-black/25 text-white' : 'bg-[#16233D] text-white'
                        }`}>
                          {status.score} pts
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-[#2E8B63] bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                          OK
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] font-sans mt-1 ${
                      isCritical || isHigh ? 'text-white/95' : 'text-[#6E7C90]'
                    }`}>
                      {plant.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TOWER B (Residential Wing - 4 Cols) */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-xs border border-[#CBD3DD] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E4E8EE] pb-3">
              <div>
                <span className="font-sans font-bold text-xs text-[#16233D] uppercase tracking-wider block">
                  Tower B
                </span>
                <span className="text-[11px] font-mono text-[#6E7C90]">Units 101 – 402</span>
              </div>
              <Building className="w-4 h-4 text-[#6E7C90]" />
            </div>

            <div className="space-y-2.5">
              {floors.map((fl) => (
                <div key={fl.floor} className="flex items-center gap-2.5">
                  <span className="w-12 text-[10px] font-mono text-[#6E7C90] text-center font-bold">
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
                          className={`living-unit p-3.5 text-left border cursor-pointer relative ${
                            isSelected
                              ? 'ring-2 ring-[#16233D] bg-white z-30 shadow-md'
                              : isCritical
                              ? 'bg-[#C6433D] text-white border-[#C6433D] glow-critical'
                              : isHigh
                              ? 'bg-[#E8891C] text-white border-[#E8891C] glow-high font-semibold'
                              : isElevated
                              ? 'bg-[#16233D] text-white border-[#16233D]'
                              : 'bg-white hover:bg-slate-50 text-[#16233D] border-[#CBD3DD]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs tracking-tight">
                              {u.replace('Tower B - ', 'B-')}
                            </span>
                            {status.score > 0 && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 ${
                                isCritical || isHigh || isElevated ? 'bg-black/25 text-white' : 'bg-[#16233D] text-white'
                              }`}>
                                {status.score}p
                              </span>
                            )}
                          </div>
                          <div className={`text-[9.5px] font-sans mt-1 leading-tight whitespace-nowrap ${
                            isCritical || isHigh || isElevated ? 'text-white/95 font-medium' : 'text-[#6E7C90]'
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

        {/* Foundation Plinth Base */}
        <div className="mt-6 pt-4 border-t border-[#CBD3DD] flex items-center justify-between text-xs font-mono text-[#6E7C90]">
          <span>FOUNDATION & BASEMENT PARKING · P1 / P2</span>
          <span>CAMPUS POWER: 415V GRID STABLE</span>
        </div>
      </div>

      {/* Selected Unit Telemetry Inspector Flyout */}
      {selectedUnit && (
        <div className="mt-6 p-5 bg-[#16233D] text-[#EEF2F6] border border-[#16233D] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#E8891C] text-[#16233D] flex items-center justify-center font-bold text-xs flex-shrink-0">
              UNIT
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-base text-[#E8891C]">
                  {selectedUnit.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-white/10 text-white border border-white/20">
                  {activeUnitInfo?.level?.toUpperCase() || 'NOMINAL'}
                </span>
              </div>
              <p className="text-xs text-[#CBD3DD] mt-1">
                {activeUnitInfo?.score > 0
                  ? `${activeUnitInfo.count} active ticket(s) · Defect Severity Score: ${activeUnitInfo.score} pts`
                  : 'Zero defect tickets logged for this unit. All facilities running normally.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenCreateTicket && onOpenCreateTicket(selectedUnit)}
              className="px-4 py-2 bg-[#E8891C] hover:bg-[#E8891C]/90 text-[#16233D] text-xs font-bold transition-colors cursor-pointer"
            >
              Report Issue for {selectedUnit}
            </button>
            <button
              onClick={() => onSelectUnit(null)}
              className="p-2 bg-white/10 hover:bg-white/20 text-[#EEF2F6] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
