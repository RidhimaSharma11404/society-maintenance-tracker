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
  Building,
  Sparkles
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
        api.get('/complaints')
      ]);
      const techList = Array.isArray(techRes.data) ? techRes.data : (techRes.data?.technicians || techRes.data?.items || []);
      const compList = Array.isArray(compRes.data) ? compRes.data : (compRes.data?.items || compRes.data?.complaints || []);
      setTechnicians(techList);
      setComplaints(compList);
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

  const defaultTechs = [
    { _id: 'tech_1', name: 'Marcus Cole', category: 'Plumbing', phone: '+91 98201 44512', rating: 4.9, status: 'AVAILABLE', activeJobs: 1 },
    { _id: 'tech_2', name: 'Otis AMC Technical Team', category: 'Elevator', phone: '+91 1800 200 4455', rating: 4.9, status: 'DISPATCHED', activeJobs: 2 },
    { _id: 'tech_3', name: 'Kavita Sundaram', category: 'Electrical', phone: '+91 97112 33490', rating: 4.8, status: 'AVAILABLE', activeJobs: 0 }
  ];

  const displayTechs = technicians.length > 0 ? technicians : defaultTechs;

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-100">
      {/* Header Card */}
      <div className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">
              Verified Contractors & Emergency Dispatch Directory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Society-contracted technicians with SLA agreements and 24/7 on-call dispatching.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          title="Refresh Roster"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Contractor Roster (CareSync AI Doctor Card Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayTechs.map((tech) => (
          <div
            key={tech._id}
            className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-bold flex items-center justify-center text-sm shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    {tech.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{tech.name}</h3>
                    <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-semibold">
                      {tech.category} SPECIALIST
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{tech.rating || 4.9}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-200">{tech.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>SLA Speed: &lt; 2.4 Hours</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                tech.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-blue-950 text-cyan-300 border border-blue-600/40'
              }`}>
                ● {tech.status || 'AVAILABLE'}
              </span>

              <button
                onClick={() => setDispatchModal(tech)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(37,99,235,0.4)] flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Dispatch</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Modal */}
      {dispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">
                Dispatch {dispatchModal.name}
              </h3>
              <button
                onClick={() => setDispatchModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-400 uppercase">
                Assign to Open Work Order:
              </label>
              <select
                value={selectedComplaintId}
                onChange={(e) => setSelectedComplaintId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:border-cyan-400"
              >
                <option value="">-- General Campus Inspection --</option>
                {complaints.filter(c => c.currentStatus === 'Open').map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.unitNumber} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDispatchModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                disabled={dispatching}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                {dispatching ? 'Dispatching...' : 'Confirm Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
