import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Sliders,
  Clock,
  Save,
  RefreshCw,
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Settings = () => {
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formState, setFormState] = useState({ severityWeight: 3, slaHours: 24, description: '' });
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      const items = Array.isArray(res.data) ? res.data : (res.data?.settings || res.data?.items || []);
      setSettings(items);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const defaultSettings = [
    { _id: 'set_1', category: 'Plumbing', severityWeight: 4, slaHours: 12, description: 'Water leakages, pipe bursts, and overhead tank overflows' },
    { _id: 'set_2', category: 'Elevator', severityWeight: 5, slaHours: 6, description: 'Passenger lift entrapment, door sensor failure, and Otis AMC' },
    { _id: 'set_3', category: 'Electrical', severityWeight: 4, slaHours: 12, description: 'Main substation, DG backup, and hallway lighting' },
    { _id: 'set_4', category: 'Civil', severityWeight: 2, slaHours: 48, description: 'Plaster cracking, waterproofing, and tile repairs' }
  ];

  const displaySettings = settings.length > 0 ? settings : defaultSettings;

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-100">
      {/* Header */}
      <div className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">
              SLA Thresholds & Category Response Time Settings
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure turnaround hours and severity weights for automatic overdue ticket detection.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          title="Refresh Settings"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displaySettings.map((item) => (
          <div
            key={item.category}
            className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl space-y-4 hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">{item.category} Category</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                SLA: {item.slaHours} Hours
              </span>
            </div>

            <p className="text-xs text-slate-400">{item.description}</p>

            <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-2">
              <span>Severity Weight: <strong className="text-amber-400">{item.severityWeight} / 5</strong></span>
              <span className="text-slate-500">Overdue after {item.slaHours}h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
