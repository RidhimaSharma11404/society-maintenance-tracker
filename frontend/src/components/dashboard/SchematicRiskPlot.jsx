import React, { useState } from 'react';
import { Sliders, ArrowUpRight, AlertTriangle, Flame } from 'lucide-react';
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

export const SchematicRiskPlot = ({ categoryRisk = [], onNavigateSliders }) => {
  const totalDays = 90;
  const decayRate = 0.0231;
  const initialWeight = 10.0;
  const thresholdScore = 3.0;

  // Generate 45 smooth points along the mathematical curve: S(t) = 10 * e^(-0.0231 * t)
  const curveData = [];
  for (let t = 0; t <= totalDays; t += 2) {
    const score = parseFloat((initialWeight * Math.exp(-decayRate * t)).toFixed(2));
    curveData.push({
      day: t,
      dayLabel: t === 0 ? 'Today (t=0)' : t === 30 ? '30d (Half-life)' : `${t}d`,
      riskScore: score,
      threshold: thresholdScore
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Dynamic Defect Risk Decay Curve · S(t) = w · e^(-0.0231·t)
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Half-Life: 30 Days
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculates diminishing defect severity load over a 90-day window to prioritize preventive maintenance.
          </p>
        </div>

        <button
          onClick={onNavigateSliders}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span>Adjust Sensitivity Sliders</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Interactive Recharts Graph */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={curveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              tickFormatter={(v) => (v === 0 ? 'Today' : v === 30 ? '30d' : v === 60 ? '60d' : v === 90 ? '90d' : '')}
              ticks={[0, 15, 30, 45, 60, 75, 90]}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
            />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '12px',
                color: '#0f172a',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
              formatter={(val) => [`${val} pts`, 'Calculated Risk Score']}
              labelFormatter={(day) => `Lookback Offset: ${day} days ago`}
            />
            <ReferenceLine
              y={3.0}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: 'Critical Threshold (3.0 pts)',
                position: 'insideTopRight',
                fill: '#d97706',
                fontSize: 11,
                fontWeight: 600
              }}
            />
            <Area
              type="monotone"
              dataKey="riskScore"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#riskGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Active Category Badges Summary */}
      {categoryRisk && categoryRisk.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium">Category Clusters:</span>
            {categoryRisk.slice(0, 4).map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold"
              >
                <span>{cat.category}</span>
                <span className="font-mono text-blue-700 font-bold">{cat.score} pts</span>
              </span>
            ))}
          </div>

          <span className="text-slate-400 text-[11px]">
            Formula: S(t) = w · e^(-0.0231·t) · λ = 0.0231 d⁻¹
          </span>
        </div>
      )}
    </div>
  );
};
