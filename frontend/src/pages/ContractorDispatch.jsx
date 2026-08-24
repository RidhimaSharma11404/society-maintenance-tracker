import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Star,
  MapPin,
  Send,
  RefreshCw,
  UserCheck,
  Building
} from 'lucide-react';

export const ContractorDispatch = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [technicians, setTechnicians] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispatchModal, setDispatchModal] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [dispatching, setDispatching] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [techRes, compRes] = await Promise.all([
        api.get('/technicians'),
        api.get('/complaints', { params: { status: 'Open', limit: 20 } })
      ]);
      setTechnicians(techRes.data?.technicians || []);
      setComplaints(compRes.data?.items || []);
    } catch (err) {
      console.error('Failed to load dispatch roster', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmDispatch = async () => {
    if (!dispatchModal) return;
    setDispatching(true);
    try {
      await api.post('/technicians/dispatch', {
        technicianId: dispatchModal._id,
        complaintId: selectedComplaintId || undefined
      });
      success(`Technician ${dispatchModal.name} dispatched to job.`);
      setDispatchModal(null);
      setSelectedComplaintId('');
      fetchData();
    } catch (err) {
      toastError(err.message || 'Dispatch failed.');
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-700" />
            Contractor & On-Duty Technician Dispatch
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active certified facility contractors, plumber rosters, electrician crews, and lift engineers
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-700' : ''}`} />
          <span>Refresh Crew Status</span>
        </button>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-700 mx-auto mb-2" />
            Loading technician roster...
          </div>
        ) : technicians.length > 0 ? (
          technicians.map((tech) => (
            <div
              key={tech._id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{tech.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{tech.company}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                      tech.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : tech.status === 'On Job'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {tech.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-3 mt-3 border-t border-slate-100 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Trade Specialty:</span>
                    <strong className="text-slate-900">{tech.specialty}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Rating:</span>
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {tech.rating} / 5.0
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Station:</span>
                    <span className="text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      {tech.currentLocation}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact:</span>
                    <span className="text-slate-700 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {tech.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Active Work Orders: <strong>{tech.activeJobsCount || 0}</strong>
                </span>

                <button
                  onClick={() => setDispatchModal(tech)}
                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Dispatch Technician</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center text-slate-400">
            No technicians registered in the roster.
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {dispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-700" />
                Dispatch {dispatchModal.name} ({dispatchModal.specialty})
              </h3>
              <button
                onClick={() => setDispatchModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">Assign to Open Complaint (Optional):</div>
              <p className="text-slate-500">
                Select an active ticket to link this technician directly into the complaint audit trail.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Open Maintenance Complaints ({complaints.length}):
              </label>
              <select
                value={selectedComplaintId}
                onChange={(e) => setSelectedComplaintId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="">General Standby / Direct Patrol</option>
                {complaints.map((c) => (
                  <option key={c._id} value={c._id}>
                    #{c._id.slice(-6).toUpperCase()} - {c.title} ({c.unitNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={handleConfirmDispatch}
                disabled={dispatching}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{dispatching ? 'Dispatching...' : `Confirm Dispatch to ${dispatchModal.currentLocation}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
