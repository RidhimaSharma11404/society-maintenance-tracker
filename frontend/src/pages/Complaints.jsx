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
  User
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
  const [categories, setCategories] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/settings');
      setCategories(res.data?.settings || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        search: searchQuery || undefined,
        isOverdue: isOverdueOnly ? 'true' : undefined,
        myOnly: myOnly ? 'true' : undefined
      };

      const res = await api.get('/complaints', { params });
      setComplaints(res.data?.items || []);
      setPagination(res.data?.pagination || { total: 0, totalPages: 1 });

      if (initialSelectedComplaintId) {
        const found = (res.data?.items || []).find((c) => c._id === initialSelectedComplaintId);
        if (found) setSelectedComplaint(found);
      }
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter, searchQuery, isOverdueOnly, myOnly, page]);

  const handleOpenDetail = async (complaint) => {
    try {
      const res = await api.get(`/complaints/${complaint._id}`);
      setSelectedComplaint(res.data);
    } catch {
      setSelectedComplaint(complaint);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#16233D]">
      {/* Header */}
      <div className="relative bg-white border border-[#CBD3DD] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Corner Drafting Marks */}
        <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#16233D] pointer-events-none" />
        <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#16233D] pointer-events-none" />
        <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#16233D] pointer-events-none" />
        <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#16233D] pointer-events-none" />

        <div>
          <h2 className="text-lg font-bold font-sans text-[#16233D] uppercase tracking-tight">
            {user?.role === 'resident' ? 'My Requests & Maintenance Complaints' : 'Work Orders & Maintenance Registry'}
          </h2>
          <p className="text-xs font-sans text-[#6E7C90] mt-0.5">
            Track your maintenance requests from submission to on-site resolution with verified audit logs
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#16233D] hover:bg-[#253556] text-white text-xs font-sans font-bold transition-colors self-start sm:self-auto cursor-pointer border border-[#16233D]"
        >
          <Plus className="w-4 h-4 text-[#E8A33D]" />
          <span>{user?.role === 'resident' ? 'Report a Maintenance Issue' : 'Raise New Work Order'}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        {/* Status Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}

          <button
            onClick={() => {
              setIsOverdueOnly(!isOverdueOnly);
              setPage(1);
            }}
            className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isOverdueOnly
                ? 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-200'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Overdue SLA Only</span>
          </button>
        </div>

        {/* Search, Category, and Unit Checkbox */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search complaint title, description, or unit..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-800 font-bold">
              <input
                type="checkbox"
                checked={myOnly}
                onChange={(e) => {
                  setMyOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span>My Flat Complaints Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Complaint & Category</th>
                <th className="px-4 py-3">Flat / Unit Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">SLA Turnaround</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
                    Loading complaints...
                  </td>
                </tr>
              ) : complaints.length > 0 ? (
                complaints.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => handleOpenDetail(c)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-700 font-bold text-[11px] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                          #{c._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {c.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{c.category}</span>
                        <span>·</span>
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>{c.unitNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {c.resident?.name || 'Resident'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={c.currentStatus} />
                    </td>

                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="px-4 py-3.5">
                      {c.isOverdue ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Overdue</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-700 text-[11px] font-mono font-medium">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>{c.remainingHours}h remaining</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(c);
                        }}
                        className="px-3 py-1.5 rounded bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white transition-colors text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center shadow-xs">
                        <AlertCircle className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          No Maintenance Complaints Found
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          No matching records found for the selected filter or search criteria.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer mt-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Raise New Complaint</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              Showing {complaints.length} of {pagination.total} complaints
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-slate-100 disabled:opacity-30 hover:bg-slate-200 text-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-blue-900">
                Page {page} / {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="p-1.5 rounded bg-slate-100 disabled:opacity-30 hover:bg-slate-200 text-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateComplaintModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchComplaints}
      />

      <ComplaintDetailModal
        isOpen={!!selectedComplaint}
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onUpdated={fetchComplaints}
      />
    </div>
  );
};
