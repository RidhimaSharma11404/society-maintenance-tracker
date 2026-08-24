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
  Building
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
  Bar
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
      const res = await api.get('/complaints/risk-analytics');
      setData(res.data);
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
      setWindowDays(120);
      setThreshold(2.0);
      setHalfLifeDays(45);
    } else if (presetKey === 'strict') {
      setWindowDays(30);
      setThreshold(5.0);
      setHalfLifeDays(15);
    }
  };

  const lambda = Number((Math.LN2 / halfLifeDays).toFixed(4));

  const decayCurveData = Array.from({ length: 10 }, (_, i) => {
    const days = Math.round((i * windowDays) / 9);
    const sev5 = Number((5 * Math.exp(-lambda * days)).toFixed(1));
    const sev4 = Number((4 * Math.exp(-lambda * days)).toFixed(1));
    const sev3 = Number((3 * Math.exp(-lambda * days)).toFixed(1));
    return {
      days: days === 0 ? 'Today' : `${days}d`,
      'Critical Issues': sev5,
      'High Priority': sev4,
      'Standard Issues': sev3
    };
  });

  const rawClusters = data?.clusters || [];
  const filteredClusters = rawClusters.filter((c) => c.totalRiskScore >= threshold);

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900">
      {/* 1. Human Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Preventive Maintenance & Equipment Health
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Spots repeat faults across plumbing, lifts, and electrical systems before they cause major breakdowns.
          </p>
        </div>

        <button
          onClick={fetchRiskData}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-900' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* 2. One-Click Quick Presets for Non-Technical Users */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Quick Monitoring Presets
            </span>
            <span className="text-[11px] text-slate-500">
              Select a pre-configured mode or adjust the sliders below to fine-tune.
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleApplyPreset('standard')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activePreset === 'standard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              🛡️ Standard (Recommended)
            </button>
            <button
              onClick={() => handleApplyPreset('sensitive')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activePreset === 'sensitive'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              ⚡ High Sensitivity (Monsoon)
            </button>
            <button
              onClick={() => handleApplyPreset('strict')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activePreset === 'strict'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              🚨 Critical Only
            </button>
          </div>
        </div>

        {/* Plain-Language Sensitivity Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* Slider 1 */}
          <div className="space-y-2 bg-slate-50/80 p-4 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-800">
                1. Repair History Memory
              </label>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {windowDays} Days
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              How far back to look for recurring faults in each flat.
            </p>
            <input
              type="range"
              min={15}
              max={180}
              step={5}
              value={windowDays}
              onChange={(e) => {
                setWindowDays(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>15d</span>
              <span>90d (Standard)</span>
              <span>180d</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2 bg-slate-50/80 p-4 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-800">
                2. Alert Trigger Level
              </label>
              <span className="font-mono font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {threshold.toFixed(1)} pts
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Minimum repeat severity required to flag an alert to staff.
            </p>
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
              className="w-full cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.0 (Low)</span>
              <span>3.0 (Balanced)</span>
              <span>8.0 (Critical)</span>
            </div>
          </div>

          {/* Slider 3 */}
          <div className="space-y-2 bg-slate-50/80 p-4 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-800">
                3. Repair Cool-Off Window
              </label>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {halfLifeDays} Days
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              How quickly fixed issues safely fade from the watch list.
            </p>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={halfLifeDays}
              onChange={(e) => {
                setHalfLifeDays(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10d (Quick)</span>
              <span>30d (Standard)</span>
              <span>60d (Thorough)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Plain-English Executive Diagnosis & Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-red-900">
            <span>🔴 Urgent: Tower B - 101</span>
            <span className="bg-red-200/80 text-red-900 px-2 py-0.5 rounded text-[10px] font-mono font-bold">13.2 pts</span>
          </div>
          <p className="text-xs text-red-800 font-medium">
            3 repeat plumbing complaints within 20 days.
          </p>
          <p className="text-[11px] text-red-700">
            <strong>Recommended:</strong> Dispatch Apex Hydro for a preventive riser line overhaul before pipe bursts.
          </p>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>🟡 High Alert: Tower A - 402</span>
            <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded text-[10px] font-mono font-bold">6.9 pts</span>
          </div>
          <p className="text-xs text-amber-800 font-medium">
            2 electrical breaker tripping tickets on AC startup.
          </p>
          <p className="text-[11px] text-amber-700">
            <strong>Recommended:</strong> Tighten neutral busbar at distribution board to prevent load imbalance.
          </p>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>🟡 Lift Alert: Passenger Lift B2</span>
            <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded text-[10px] font-mono font-bold">4.8 pts</span>
          </div>
          <p className="text-xs text-amber-800 font-medium">
            Jerky descent and vibration reported (Overdue SLA).
          </p>
          <p className="text-[11px] text-amber-700">
            <strong>Recommended:</strong> Request Otis technician to inspect guide shoes and brake alignment.
          </p>
        </div>
      </div>

      {/* 4. Visual Analytics with Plain-Language Descriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cool-off Curve */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Issue Cool-Off Projection Over Time
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Shows how fixed issues safely cool down and exit the watch list after repairs are completed.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={decayCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="days" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Critical Issues"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="High Priority"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Standard Issues"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Active Category Load */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Total Risk by Building System
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Shows which building infrastructure is currently experiencing the most repair strain.
          </p>

          <div className="h-60 w-full">
            {data?.categoryRiskData && data.categoryRiskData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="category"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '12px'
                    }}
                    formatter={(val) => [`${val} pts`, 'Active Risk Score']}
                  />
                  <Bar dataKey="score" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No active repair load recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Clear, Human Table of Watch List Areas */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Identified Trouble Spots & Repeat Faults
            </h3>
            <p className="text-xs text-slate-500">
              Units or shared equipment that cross your current alert threshold ({threshold.toFixed(1)} pts).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {filteredClusters.length} Area(s) on Watch
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Location / Unit</th>
                <th className="px-4 py-3">System / Category</th>
                <th className="px-4 py-3 text-center">Severity Score</th>
                <th className="px-4 py-3 text-center">Repeat Complaints</th>
                <th className="px-4 py-3 text-center">Unresolved</th>
                <th className="px-4 py-3">Last Ticket Date</th>
                <th className="px-4 py-3">Status Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClusters.length > 0 ? (
                filteredClusters.map((c, i) => (
                  <tr key={`${c.unitNumber}-${c.category}-${i}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 font-mono">
                      {c.unitNumber}
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-semibold">
                      {c.category}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-900 text-sm">
                      {c.totalRiskScore} pts
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-900 font-bold">
                      {c.complaintCount}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                          c.activeComplaintsCount > 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {c.activeComplaintsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {c.lastComplaintDate ? new Date(c.lastComplaintDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5">
                      <RiskBadge level={c.riskLevel} score={c.totalRiskScore} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No trouble spots matching current threshold ({threshold.toFixed(1)} pts). All systems nominal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
