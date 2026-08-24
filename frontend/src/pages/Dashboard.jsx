import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BuildingSchematicMap } from '../components/dashboard/BuildingSchematicMap';
import { ConnectedRiskPlot } from '../components/dashboard/ConnectedRiskPlot';
import { WorkOrdersTimeline } from '../components/dashboard/WorkOrdersTimeline';
import { ResidentBuildingHealth } from '../components/dashboard/ResidentBuildingHealth';
import { SchematicPanel } from '../components/common/SchematicPanel';
import api from '../services/api';
import {
  Plus,
  RefreshCw,
  ChevronRight,
  CreditCard,
  Building,
  Bell,
  Activity,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Wrench,
  Flame,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const Dashboard = ({ onNavigateTab, onSelectComplaint, onOpenCreateTicket, onOpenAssistantWithPrompt }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      const payload = res?.data || res || {};
      setData(payload);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <div className="p-24 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-300 uppercase tracking-wider">
            Connecting to campus telemetry...
          </p>
        </div>
      </div>
    );
  }

  const kpi = data?.kpi || {
    activeComplaints: 3,
    openComplaints: 1,
    inProgressComplaints: 2,
    overdueComplaints: 1,
    highRiskClustersCount: 3,
    resolutionRate: 57
  };
  const riskAnalytics = data?.riskAnalytics || {};
  const recentComplaints = data?.recentComplaints || data?.items || [];
  const categoryDistribution = data?.categoryDistribution || [
    { name: 'Plumbing', value: 3 },
    { name: 'Electrical', value: 2 },
    { name: 'Elevator', value: 2 }
  ];

  return (
    <div className="space-y-8 pb-16 font-sans text-slate-100">
      {/* 1. CARESYNC AI-STYLE TOP WELCOME & TELEMETRY HERO CARD */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-cyan-950/70 border border-cyan-500/30 rounded-3xl backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.12)] overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>FACILITY TELEMETRY IS ACTIVE · TOWERS A & B</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
              Hello, {user?.name || 'Secretary Elena Vance'} 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {isStaffOrAdmin
                ? 'Real-time building elevation digital twin, exponential defect decay risk analytics, and smart work orders dispatch.'
                : 'Welcome to your flat maintenance portal. Report issues with 1-click photos and review society dues.'}
            </p>

            {/* Quick Action Buttons Pill Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onOpenCreateTicket && onOpenCreateTicket(user?.unitNumber)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>{isStaffOrAdmin ? 'New Maintenance Ticket' : 'Report Flat Problem'}</span>
              </button>

              {isStaffOrAdmin && (
                <button
                  onClick={() => onNavigateTab('risk-analytics')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Risk Decay Sliders</span>
                </button>
              )}

              <button
                onClick={() => onNavigateTab('billing')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Maintenance Ledger</span>
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                title="Refresh Live Telemetry"
                className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Two Big Metric Cards (CareSync AI Style) */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 shrink-0">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-1 min-w-[120px] shadow-md">
              <div className="text-2xl font-mono font-bold text-cyan-400">
                {kpi.activeComplaints ?? 3}
              </div>
              <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                ACTIVE REPAIRS
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-1 min-w-[120px] shadow-md">
              <div className="text-2xl font-mono font-bold text-emerald-400">
                24
              </div>
              <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                UNITS MONITORED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVING BUILDING ELEVATION DIGITAL TWIN */}
      {isStaffOrAdmin ? (
        <BuildingSchematicMap
          riskClusters={riskAnalytics.clusters || []}
          unitRisk={riskAnalytics.unitRisk || []}
          selectedUnit={selectedUnit}
          onSelectUnit={setSelectedUnit}
          recentComplaints={recentComplaints}
          onOpenCreateTicket={onOpenCreateTicket}
        />
      ) : (
        <ResidentBuildingHealth
          activeComplaintsCount={kpi.activeComplaints || 0}
          openComplaints={kpi.openComplaints || 0}
          inProgressComplaints={kpi.inProgressComplaints || 0}
          onOpenCreateTicket={() => onOpenCreateTicket && onOpenCreateTicket(user?.unitNumber)}
          onViewComplaints={() => onNavigateTab('complaints')}
        />
      )}

      {/* 3. ASYMMETRIC STREAM: Work Orders vs Connected Risk & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Work Orders Timeline (Cols 1-8) */}
        <div className="lg:col-span-8">
          <WorkOrdersTimeline
            complaints={recentComplaints}
            selectedUnit={isStaffOrAdmin ? selectedUnit : user?.unitNumber}
            onSelectComplaint={onSelectComplaint}
            onViewAllRegistry={() => onNavigateTab('complaints')}
          />
        </div>

        {/* Secondary Stream: Connected Risk Curve & Distribution (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {isStaffOrAdmin && (
            <ConnectedRiskPlot
              selectedUnit={selectedUnit}
              categoryRisk={riskAnalytics.categoryRisk || []}
              unitRisk={riskAnalytics.unitRisk || []}
              onNavigateSliders={() => onNavigateTab('risk-analytics')}
              onClearUnit={() => setSelectedUnit(null)}
            />
          )}

          {/* Active System Load Card */}
          {isStaffOrAdmin && (
            <div className="bg-[#0B1220]/90 border border-slate-800 p-5 font-sans rounded-3xl backdrop-blur-xl shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                    Defect Category Load
                  </h4>
                </div>
                <button
                  onClick={() => onNavigateTab('risk-analytics')}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Forecast</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {categoryDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-cyan-300">
                        {item.value} ticket(s)
                      </span>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        item.name === 'Plumbing'
                          ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                          : item.name === 'Electrical'
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                          : 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.7)]'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
