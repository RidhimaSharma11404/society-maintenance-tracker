import React, { useState } from 'react';
import { Sliders, ArrowUpRight, CheckCircle2, Info, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export const ConnectedRiskPlot = ({
  selectedUnit,
  categoryRisk = [],
  unitRisk = [],
  onNavigateSliders,
  onClearUnit
}) => {
  const [showExplainer, setShowExplainer] = useState(false);
  const totalDays = 90;
  const decayRate = 0.0231;
  const thresholdScore = 3.0;

  const normalize = (str) => (!str ? '' : str.toLowerCase().replace(/[\s\-_]/g, ''));

  let unitScore = 0;
  let hasUnitData = false;
  let unitData = null;

  if (selectedUnit) {
    const normSelected = normalize(selectedUnit);
    unitData = unitRisk.find((u) => normalize(u.unitNumber) === normSelected);
    if (unitData && Number(unitData.score) > 0) {
      unitScore = Number(unitData.score);
      hasUnitData = true;
    }
  } else {
    // Global facility overview
    hasUnitData = true;
    unitScore = categoryRisk[0]?.score ? Number(categoryRisk[0].score) : 10.0;
  }

  const curveData = [];
  if (hasUnitData && unitScore > 0) {
    for (let t = 0; t <= totalDays; t += 2) {
      const score = parseFloat((unitScore * Math.exp(-decayRate * t)).toFixed(2));
      curveData.push({
        day: t,
        dayLabel: `Day ${t}`,
        riskScore: score,
        threshold: thresholdScore
      });
    }
  }

  return (
    <div className="bg-[#0B1220]/90 border border-slate-800 p-5 font-sans text-slate-100 rounded-3xl backdrop-blur-xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
            Defect Risk Decay Trajectory
          </h4>
        </div>

        <button
          onClick={onNavigateSliders}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Tune Sliders</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Target description */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-[11px] text-slate-400">Target: </span>
          <span className="font-bold text-white">
            {selectedUnit || 'Global Campus Baseline'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400">Base Severity: </span>
          <span className="font-mono font-bold text-amber-400">{unitScore.toFixed(1)} pts</span>
        </div>
      </div>

      {/* Recharts Area Curve */}
      <div className="h-44 w-full pt-2">
        {curveData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="cyanRiskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: '#f8fafc'
                }}
              />
              <ReferenceLine y={thresholdScore} stroke="#f59e0b" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="riskScore"
                name="Risk Score"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cyanRiskGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 bg-slate-950/40 rounded-xl">
            No defect history recorded for this unit.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2.5">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          S(t) = w · e^(-λt)
        </span>
        <span className="text-amber-400">Amber line = Risk Threshold (3.0p)</span>
      </div>
    </div>
  );
};
