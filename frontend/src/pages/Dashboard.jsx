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
  ArrowUpRight
} from 'lucide-react';

export const Dashboard = ({ onNavigateTab, onSelectComplaint, onOpenCreateTicket }) => {
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
        <div className="flex flex-col items-center gap-3 text-[#6E7C90]">
          <div className="w-7 h-7 border-2 border-[#16233D] border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-[#16233D] uppercase tracking-wider">
            Connecting to building sensors...
          </p>
        </div>
      </div>
    );
  }

  const kpi = data?.kpi || {};
  const riskAnalytics = data?.riskAnalytics || {};
  const pinnedNotices = data?.pinnedNotices || [];
  const recentComplaints = data?.recentComplaints || [];
  const categoryDistribution = data?.categoryDistribution || [];

  return (
    <div className="space-y-10 pb-16 font-sans text-[#16233D]">
      {/* 1. Direct, Human Top Bar with Single Decisive Accent CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CBD3DD] pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-[#16233D]">
              {isStaffOrAdmin ? 'Greenwood Heights, live.' : 'My Home & Society Services'}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 border border-[#CBD3DD] bg-white text-[#16233D]">
              Towers A & B
            </span>
          </div>

          {/* Ambient Real-time Status Strip */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
            {isStaffOrAdmin ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-[#16233D] font-bold">
                  <span className="w-2 h-2 bg-[#16233D] rounded-full" />
                  {kpi.activeComplaints ?? 3} active repairs ({kpi.openComplaints ?? 1} open, {kpi.inProgressComplaints ?? 2} in progress)
                </span>
                <span className="text-[#CBD3DD]">·</span>
                <span className={`inline-flex items-center gap-1.5 font-bold ${(kpi.overdueComplaints ?? 1) > 0 ? 'text-[#C6433D]' : 'text-[#2E8B63]'}`}>
                  <span className={`w-2 h-2 ${(kpi.overdueComplaints ?? 1) > 0 ? 'bg-[#C6433D]' : 'bg-[#2E8B63]'}`} />
                  {kpi.overdueComplaints ?? 1} overdue SLA
                </span>
                <span className="text-[#CBD3DD]">·</span>
                <span className="inline-flex items-center gap-1.5 text-[#E8891C] font-bold">
                  <span className="w-2 h-2 bg-[#E8891C] rounded-full" />
                  {kpi.highRiskClustersCount ?? 3} defect clusters (1 critical)
                </span>
                <span className="text-[#CBD3DD]">·</span>
                <span className="inline-flex items-center gap-1.5 text-[#2E8B63] font-bold">
                  <span className="w-2 h-2 bg-[#2E8B63]" />
                  {kpi.resolutionRate ?? 57}% resolved this cycle
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 text-[#2E8B63] font-bold">
                  <span className="w-2 h-2 bg-[#2E8B63]" />
                  All building utilities operating normally
                </span>
                <span className="text-[#CBD3DD]">·</span>
                <span className="inline-flex items-center gap-1.5 text-[#16233D]">
                  {kpi.activeComplaints ?? 3} active repairs on campus
                </span>
                <span className="text-[#CBD3DD]">·</span>
                <span className="inline-flex items-center gap-1.5 text-[#2E8B63]">
                  August dues paid
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => onOpenCreateTicket && onOpenCreateTicket(selectedUnit || user?.unitNumber)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E8891C] hover:bg-[#d97d15] active:scale-98 text-[#16233D] text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#16233D]" />
            <span>{isStaffOrAdmin ? 'New Maintenance Ticket' : 'Report Issue in Flat'}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 bg-white hover:bg-slate-50 border border-[#CBD3DD] text-[#16233D] transition-colors cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#16233D]' : 'text-[#6E7C90]'}`} />
          </button>
        </div>
      </div>

      {/* 2. HERO: DOMINANT LIVING BUILDING ELEVATION (Admin/Staff) OR RESIDENT HEALTH (Resident) */}
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

      {/* 3. ASYMMETRIC SECONDARY SECTION: Work Orders (70%) vs Risk Detail & Bulletins (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Primary Stream: Chronological Work Orders & Dispatch Log (Cols 1-8) */}
        <div className="lg:col-span-8">
          <WorkOrdersTimeline
            complaints={recentComplaints}
            selectedUnit={isStaffOrAdmin ? selectedUnit : user?.unitNumber}
            onSelectComplaint={onSelectComplaint}
            onViewAllRegistry={() => onNavigateTab('complaints')}
          />
        </div>

        {/* Secondary Stream: Connected Risk Curve, Category Load & Society Bulletins (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Connected Risk Trajectory Detail */}
          {isStaffOrAdmin && (
            <ConnectedRiskPlot
              selectedUnit={selectedUnit}
              categoryRisk={riskAnalytics.categoryRisk || []}
              unitRisk={riskAnalytics.unitRisk || []}
              onNavigateSliders={() => onNavigateTab('risk-analytics')}
              onClearUnit={() => setSelectedUnit(null)}
            />
          )}

          {/* Active System Repair Load Card (Admin/Staff) */}
          {isStaffOrAdmin && categoryDistribution.length > 0 && (
            <div className="bg-white border border-[#CBD3DD] p-5 font-sans shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E4E8EE] pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#16233D]" />
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-[#16233D]">
                    Active System Load
                  </h4>
                </div>
                <button
                  onClick={() => onNavigateTab('risk-analytics')}
                  className="text-[11px] font-sans text-[#16233D] hover:text-[#E8891C] font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Forecast</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {categoryDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#16233D]">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#6E7C90]">
                        {item.value} ticket(s)
                      </span>
                      <span className={`w-2 h-2 rounded-full ${
                        item.name === 'Plumbing'
                          ? 'bg-[#C6433D]'
                          : item.name === 'Electrical'
                          ? 'bg-[#E8891C]'
                          : 'bg-[#16233D]'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Resident Actions if viewing as resident */}
          {!isStaffOrAdmin && (
            <SchematicPanel
              header="Quick Resident Actions"
              headerSub="One-tap access to services"
            >
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => onNavigateTab('billing')}
                  className="w-full p-3 bg-[#F7F9FB] hover:bg-[#EEF2F6] border border-[#CBD3DD] flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-[#16233D]" />
                    <div>
                      <div className="font-bold text-[#16233D] font-sans">Maintenance Dues</div>
                      <div className="text-[11px] text-[#6E7C90]">August 2026 invoice ready</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6E7C90]" />
                </button>

                <button
                  onClick={() => onOpenCreateTicket && onOpenCreateTicket(user?.unitNumber)}
                  className="w-full p-3 bg-[#F7F9FB] hover:bg-[#EEF2F6] border border-[#CBD3DD] flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-4 h-4 text-[#E8891C]" />
                    <div>
                      <div className="font-bold text-[#16233D] font-sans">Report Maintenance Problem</div>
                      <div className="text-[11px] text-[#6E7C90]">Plumbing, Electrical, Lift</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6E7C90]" />
                </button>
              </div>
            </SchematicPanel>
          )}

          {/* Society Bulletins */}
          <div className="bg-white border border-[#CBD3DD] p-5 font-sans shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E4E8EE] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-[#16233D]" />
                <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-[#16233D]">
                  Society Bulletins
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('notices')}
                className="text-xs font-sans text-[#16233D] hover:text-[#E8891C] font-semibold cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {pinnedNotices.length > 0 ? (
                pinnedNotices.map((notice) => (
                  <div
                    key={notice._id}
                    className="p-3 bg-[#F7F9FB] border border-[#CBD3DD] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-sans">
                      <span className="font-bold text-[#16233D] uppercase border border-[#CBD3DD] bg-white px-1.5 py-0.2">
                        {notice.category}
                      </span>
                      <span className="text-[#6E7C90] font-mono">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold font-sans text-[#16233D] leading-snug">
                      {notice.title}
                    </h5>
                    <p className="text-[11px] font-sans text-[#6E7C90] line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs font-sans text-[#6E7C90] text-center py-3">
                  No active circulars.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
