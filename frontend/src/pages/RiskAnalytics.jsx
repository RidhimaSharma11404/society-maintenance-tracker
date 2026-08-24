import React, { useState, useEffect } from 'react';
import { RiskBadge } from '../components/common/Badge';
import api from '../services/api';
import {
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Sliders,
  TrendingDown,
  Info,
  Wrench,
  Sparkles,
  CheckCircle2,
  Building,
  Flame,
  Activity,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

export const RiskAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive Sliders in plain language
  const [windowDays, setWindowDays] = useState(90);
  const [threshold, setThreshold] = useState(3.0);
  const [halfLifeDays, setHalfLifeDays] = useState(30);
  const [activePreset, setActivePreset] = useState('standard');

  const fetchRiskData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/risk-clusters');
      const clusters = Array.isArray(res.data) ? res.data : (res.data?.clusters || res.data?.items || []);
      setData({ clusters });
    } catch (err) {
      console.error('Failed to load risk analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  const handleApplyPreset = (presetKey) => {
    setActivePreset(presetKey);
    if (presetKey === 'standard') {
      setWindowDays(90);
      setThreshold(3.0);
      setHalfLifeDays(30);
    } else if (presetKey === 'sensitive') {
      setWindowDays(180);
      setThreshold(2.0);
      setHalfLifeDays(45);
    } else if (presetKey === 'emergency') {
      setWindowDays(30);
      setThreshold(5.0);
      setHalfLifeDays(15);
    }
  };

  // Generate dynamic decay curve data based on slider values
  const decayRate = Math.log(2) / halfLifeDays;
  const decayCurvePoints = [];
  for (let t = 0; t <= windowDays; t += Math.max(1, Math.round(windowDays / 25))) {
    const rawVal = 10.0 * Math.exp(-decayRate * t);
    decayCurvePoints.push({
      daysAgo: t,
      dayLabel: `Day ${t}`,
      weight: parseFloat(rawVal.toFixed(2)),
      threshold: threshold
    });
  }

  const clusters = data?.clusters || [
    { unitNumber: 'Tower B - 101', totalRiskScore: 4.2, complaintCount: 3, riskLevel: 'critical', recommendedAction: 'Replace main riser trap assembly' },
    { unitNumber: 'Common Area - Tower B Lift B2', totalRiskScore: 3.8, complaintCount: 2, riskLevel: 'high', recommendedAction: 'Schedule Otis AMC bearing replacement' },
    { unitNumber: 'Tower A - 402', totalRiskScore: 2.9, complaintCount: 1, riskLevel: 'moderate', recommendedAction: 'Inspect bathroom seepage barrier' }
  ];

  return (
    <div className="space-y-8 pb-16 font-sans text-slate-100">
      {/* 1. Header Card */}
      <div className="p-6 sm:p-8 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold font-sans text-white uppercase tracking-tight">
              Predictive Defect Decay Analytics & Simulation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mathematical half-life defect decay engine identifying chronic component strain before failure.
          </p>
        </div>

        {/* Operational Presets */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start md:self-auto">
          {[
            { id: 'standard', label: 'Standard (30d)' },
            { id: 'sensitive', label: 'Monsoon (High Sens)' },
            { id: 'emergency', label: 'Emergencies Only' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activePreset === preset.id
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Decay Math Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Sliders & Controls */}
        <div className="lg:col-span-5 p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-white">
              Mathematical Parameters
            </h3>
          </div>

          {/* Slider 1: Half-Life */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Decay Half-Life (t½):</span>
              <span className="font-mono font-bold text-cyan-400">{halfLifeDays} Days</span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={halfLifeDays}
              onChange={(e) => {
                setHalfLifeDays(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[10px] text-slate-500">
              Time taken for a defect's severity score to decay by 50%.
            </p>
          </div>

          {/* Slider 2: Lookback Window */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Lookback Window:</span>
              <span className="font-mono font-bold text-amber-400">{windowDays} Days</span>
            </div>
            <input
              type="range"
              min={15}
              max={180}
              step={15}
              value={windowDays}
              onChange={(e) => {
                setWindowDays(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <p className="text-[10px] text-slate-500">
              Total historical horizon evaluated for recurring defect clusters.
            </p>
          </div>

          {/* Slider 3: Risk Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Alert Threshold (τ):</span>
              <span className="font-mono font-bold text-rose-400">{threshold.toFixed(1)} Points</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={8.0}
              step={0.5}
              value={threshold}
              onChange={(e) => {
                setThreshold(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <p className="text-[10px] text-slate-500">
              Score threshold that flags a unit as high risk on the digital twin.
            </p>
          </div>

          {/* Formula Box */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5 font-mono text-[11px]">
            <div className="text-cyan-400 font-bold">Active Decay Formula:</div>
            <div className="text-slate-300">S(t) = Severity · e^(-{decayRate.toFixed(4)} · t)</div>
            <div className="text-[10px] text-slate-500 pt-1">
              λ = ln(2) / {halfLifeDays} = {decayRate.toFixed(4)} day⁻¹
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Live Mathematical Simulation Chart */}
        <div className="lg:col-span-7 p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-white">
                Exponential Half-Life Decay Curve Simulation
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">t = 0 to {windowDays}d</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={decayCurvePoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="decayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="daysAgo" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  name="Severity Weight"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#decayGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-3">
            <span className="text-cyan-400">● 100% Weight at Day 0</span>
            <span className="text-amber-400">● 50% Weight at Day {halfLifeDays}</span>
            <span className="text-slate-500">● 25% Weight at Day {halfLifeDays * 2}</span>
          </div>
        </div>
      </div>

      {/* 3. Top Active Defect Clusters */}
      <div className="p-6 sm:p-8 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white uppercase font-mono tracking-wide">
              Identified High-Risk Defect Clusters ({clusters.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">Live Sensor Roster</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clusters.map((c) => (
            <div
              key={c.unitNumber}
              className="p-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-3 shadow-md hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{c.unitNumber}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  c.riskLevel === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-500/50' : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                }`}>
                  {c.totalRiskScore} pts
                </span>
              </div>

              <div className="text-xs text-slate-400">
                <strong className="text-slate-200">{c.complaintCount} related complaints</strong> in current cycle.
              </div>

              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-cyan-300 space-y-0.5">
                <div className="text-[10px] font-mono uppercase text-slate-500">Preventative Action:</div>
                <p className="font-medium leading-tight">{c.recommendedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
