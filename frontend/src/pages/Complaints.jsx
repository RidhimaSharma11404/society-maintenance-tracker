import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { ComplaintDetailModal } from '../components/complaints/ComplaintDetailModal';
import { CreateComplaintModal } from '../components/complaints/CreateComplaintModal';
import api from '../services/api';
import {
  Search,
  Plus,
  Clock,
  MapPin,
  AlertCircle,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  List,
  Sparkles
} from 'lucide-react';

export const Complaints = ({ initialSelectedComplaintId, externalSearchQuery }) => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  const [isOverdueOnly, setIsOverdueOnly] = useState(false);
  const [myOnly, setMyOnly] = useState(false);

  // Quick categories for CareSync-style filter pills
  const quickCategories = [
    { label: 'All Tickets', value: 'All' },
    { label: 'Plumbing 💧', value: 'Plumbing' },
    { label: 'Electrical ⚡', value: 'Electrical' },
    { label: 'Elevator 🛗', value: 'Elevator' },
    { label: 'Civil 🏢', value: 'Civil' }
  ];

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      let items = Array.isArray(res.data) ? res.data : (res.data?.items || res.data?.complaints || []);
      
      // Filter in client
      if (statusFilter !== 'All') {
        items = items.filter(c => c.currentStatus === statusFilter);
      }
      if (categoryFilter !== 'All') {
        items = items.filter(c => c.category === categoryFilter);
      }
      if (isOverdueOnly) {
        items = items.filter(c => c.isOverdue || (c.dueDate && new Date(c.dueDate) < new Date() && !['Resolved', 'Closed'].includes(c.currentStatus)));
      }
      if (myOnly && user?.unitNumber) {
        items = items.filter(c => c.unitNumber === user?.unitNumber);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        items = items.filter(c => 
          c.title?.toLowerCase().includes(q) || 
          c.description?.toLowerCase().includes(q) || 
          c.unitNumber?.toLowerCase().includes(q)
        );
      }

      setComplaints(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter, searchQuery, isOverdueOnly, myOnly]);

  const handleOpenDetail = (complaint) => {
    setSelectedComplaint(complaint);
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-100">
      {/* 1. Header Card */}
      <div className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">
              {user?.role === 'resident' ? 'My Requests & Maintenance Complaints' : 'Work Orders & Maintenance Registry'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track maintenance tickets from submission to resolution with verified audit logs and SLA timers.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all self-start sm:self-auto cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>{user?.role === 'resident' ? 'Report a Maintenance Issue' : 'Raise New Work Order'}</span>
        </button>
      </div>

      {/* 2. CARESYNC AI-STYLE QUICK FILTER PILLS */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1">QUICK FILTERS:</span>
        {quickCategories.map((cat) => {
          const isSelected = categoryFilter === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)] border border-blue-400/40 font-bold'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}

        <button
          onClick={() => setIsOverdueOnly(!isOverdueOnly)}
          className={`ml-auto px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isOverdueOnly
              ? 'bg-rose-950 text-rose-300 border border-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Overdue SLA Only</span>
        </button>
      </div>

      {/* 3. Search & Status Filter Bar */}
      <div className="p-4 bg-[#0B1220]/90 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-lg space-y-3">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 pb-3">
          {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search complaint title, description, flat, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            />
          </div>

          <button
            onClick={fetchComplaints}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Refresh Complaints"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. Complaints List Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-slate-950/60 rounded-3xl border border-slate-800">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mx-auto mb-2" />
            Loading work orders...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-950/60 rounded-3xl border border-slate-800 space-y-2">
            <p className="text-sm font-semibold text-slate-300">No complaints matching your filter.</p>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or clear active filters.</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div
              key={c._id}
              onClick={() => handleOpenDetail(c)}
              className="p-4 sm:p-5 bg-[#0B1220]/90 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-md"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-cyan-300">
                    {c.unitNumber}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {c.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {c.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                  <span>Category: <strong className="text-slate-300">{c.category}</strong></span>
                  <span>·</span>
                  <span>Reported by: <strong className="text-slate-300">{c.resident?.name || 'Arthur Pendelton'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.currentStatus} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(c);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 text-xs font-bold text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateComplaintModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => {
            setIsCreateModalOpen(false);
            fetchComplaints();
          }}
        />
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          isOpen={!!selectedComplaint}
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdated={() => {
            fetchComplaints();
          }}
        />
      )}
    </div>
  );
};
