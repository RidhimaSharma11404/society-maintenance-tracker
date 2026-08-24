import React, { useState } from 'react';
import { Sliders, ArrowUpRight, CheckCircle2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
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
        dayLabel: t === 0 ? 'Today' : `${t} Days`,
        riskScore: score,
        threshold: thresholdScore
      });
    }
  }

  return (
    <div className="bg-white border border-[#CBD3DD] p-5 font-sans text-[#16233D] space-y-4 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E8EE] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#16233D]" />
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-[#16233D]">
              Predictive Defect Risk Trajectory
            </h3>
            {selectedUnit ? (
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 ${
                hasUnitData ? 'bg-[#16233D] text-[#EEF2F6]' : 'bg-[#F7F9FB] border border-[#CBD3DD] text-[#2E8B63]'
              }`}>
                UNIT: {selectedUnit.toUpperCase()} ({unitScore} pts)
              </span>
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.2 border border-[#CBD3DD] bg-[#F7F9FB] text-[#6E7C90]">
                FACILITY-WIDE OVERVIEW
              </span>
            )}
          </div>
          <p className="text-[11px] font-sans text-[#6E7C90] mt-0.5">
            {selectedUnit
              ? hasUnitData
                ? `Defect severity cooling curve for ${selectedUnit}.`
                : `No defect history for ${selectedUnit}. All physical systems nominal.`
              : '90-day defect severity cooling curve. Select any unit on the building map to isolate.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedUnit && (
            <button
              onClick={onClearUnit}
              className="text-xs font-mono text-[#6E7C90] hover:text-[#16233D] underline cursor-pointer"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-[#CBD3DD] bg-[#F7F9FB] hover:bg-[#EEF2F6] text-[#16233D] text-xs font-sans font-medium transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#E8891C]" />
            <span>{showExplainer ? 'Hide Guide' : 'How It Works'}</span>
          </button>
          <button
            onClick={onNavigateSliders}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#CBD3DD] bg-[#16233D] hover:bg-[#253556] text-[#EEF2F6] text-xs font-sans font-semibold transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#E8891C]" />
            <span>Sensitivity</span>
          </button>
        </div>
      </div>

      {/* Human-Friendly "How It Works" Card */}
      {showExplainer && (
        <div className="p-4 bg-[#F7F9FB] border border-[#CBD3DD] text-xs font-sans space-y-2 animate-fadeIn">
          <div className="font-bold text-[#16233D] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E8891C]" />
            How Predictive Risk Helps You Prevent Breakdowns:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-2.5 bg-white border border-[#CBD3DD] space-y-1">
              <div className="font-bold text-[#16233D]">1. Recency Matters</div>
              <p className="text-[11px] text-[#6E7C90] leading-relaxed">
                New complaints carry full weight. Repaired issues naturally cool down over 30 days.
              </p>
            </div>
            <div className="p-2.5 bg-white border border-[#CBD3DD] space-y-1">
              <div className="font-bold text-[#16233D]">2. Repeat Failures</div>
              <p className="text-[11px] text-[#6E7C90] leading-relaxed">
                Multiple repairs in the same flat or shaft compound into an alert before a pipe bursts.
              </p>
            </div>
            <div className="p-2.5 bg-white border border-[#CBD3DD] space-y-1">
              <div className="font-bold text-[#16233D]">3. Early Dispatch</div>
              <p className="text-[11px] text-[#6E7C90] leading-relaxed">
                When score exceeds 3.0 pts, staff are prompted to dispatch contractors proactively.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Diagnosis & Action Recommendation Card for Selected Problem Unit */}
      {selectedUnit && hasUnitData && unitScore >= 3.0 && (
        <div className="p-3 bg-[#FFF8F0] border-l-4 border-[#E8891C] border-y border-r border-[#CBD3DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#E8891C] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs text-[#16233D]">
                Recommended Action: Inspect {unitData?.category || 'Utility System'}
              </div>
              <p className="text-[11px] text-[#6E7C90] mt-0.5">
                Elevated defect score ({unitScore} pts) indicates recurring component stress. A preventive overhaul is advised.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart OR Empty State for Nominal Units */}
      {selectedUnit && !hasUnitData ? (
        <div className="min-h-[180px] w-full flex flex-col items-center justify-center bg-[#F7F9FB] border border-[#CBD3DD] p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-[#2E8B63] mb-2" />
          <h4 className="text-xs font-bold font-mono uppercase text-[#16233D]">
            NO DEFECT RISK DATA · UNIT NOMINAL
          </h4>
          <p className="text-[11px] font-sans text-[#6E7C90] max-w-sm mt-1">
            Zero defect points logged for {selectedUnit}. Physical systems are in nominal operating condition.
          </p>
        </div>
      ) : (
        <div className="min-h-[180px] w-full pt-1">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={curveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="connectedRiskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8891C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16233D" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#E4E8EE" vertical={false} />
              <XAxis
                dataKey="day"
                tickFormatter={(v) => (v === 0 ? 'Today' : v === 30 ? '30 Days' : v === 60 ? '60 Days' : v === 90 ? '90 Days' : '')}
                ticks={[0, 15, 30, 45, 60, 75, 90]}
                stroke="#6E7C90"
                fontSize={10}
                tickLine={false}
                fontFamily="IBM Plex Mono"
              />
              <YAxis
                stroke="#6E7C90"
                fontSize={10}
                tickLine={false}
                fontFamily="IBM Plex Mono"
                domain={[0, Math.max(12, Math.ceil(unitScore + 2))]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16233D',
                  borderColor: '#6E7C90',
                  borderRadius: '0px',
                  fontSize: '11px',
                  fontFamily: 'IBM Plex Mono',
                  color: '#EEF2F6',
                  boxShadow: 'none'
                }}
                formatter={(val) => [`${val} pts`, 'Defect Risk Level']}
                labelFormatter={(day) => `Lookback: ${day} days ago`}
              />
              <ReferenceLine
                y={thresholdScore}
                stroke="#E8891C"
                strokeDasharray="4 4"
                label={{
                  value: 'ALERT THRESHOLD (3.0 pts)',
                  position: 'insideTopRight',
                  fill: '#E8891C',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'IBM Plex Mono'
                }}
              />
              <Area
                type="monotone"
                dataKey="riskScore"
                stroke="#16233D"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#connectedRiskGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Caption */}
      <div className="pt-2 border-t border-[#E4E8EE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-sans text-[#6E7C90]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#E8891C]/25 border border-[#E8891C] inline-block" />
          <span>
            <strong className="text-[#16233D]">Amber zone</strong> = Score ≥ 3.0 pts (Requires preventive inspection)
          </span>
        </div>
        <div className="font-mono text-[10px] text-[#546275]">
          30-DAY LOOKBACK WINDOW
        </div>
      </div>
    </div>
  );
};
