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
  ShieldCheck
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
      setSettings(res.data?.settings || []);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEditClick = (item) => {
    setEditingCategory(item.category);
    setFormState({
      severityWeight: item.severityWeight,
      slaHours: item.slaHours,
      description: item.description || ''
    });
  };

  const handleSave = async (category) => {
    if (!isAdmin) {
      toastError('Administrator privileges required to update SLA configurations.');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/settings/${encodeURIComponent(category)}`, {
        severityWeight: Number(formState.severityWeight),
        slaHours: Number(formState.slaHours),
        description: formState.description
      });
      success(`Settings for '${category}' updated.`);
      setEditingCategory(null);
      fetchSettings();
    } catch (err) {
      toastError(err.message || 'Failed to update category setting.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            Category SLA & Severity Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure response times and severity weights powering automated SLA escalation and dynamic risk models
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shadow-card hover:shadow-card-hover transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-400'}`} />
          <span>Reload Matrix</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3 text-xs text-blue-950 shadow-card">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-0.5 font-extrabold text-blue-950">Dynamic Risk Coupling:</strong>
          Modifications to Severity Weights (1-5) directly calibrate the exponential decay risk calculation in the MongoDB aggregation pipeline. Changes apply on-read instantly.
        </div>
      </div>

      {/* Settings Grid / Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-center">Severity Weight (1 - 5)</th>
                <th className="px-5 py-3.5 text-center">Resolution Target</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
                    Loading configuration matrix...
                  </td>
                </tr>
              ) : (
                settings.map((item) => {
                  const isEditing = editingCategory === item.category;

                  return (
                    <tr key={item.category} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {item.category}
                      </td>

                      {/* Severity Slider */}
                      <td className="px-5 py-4 text-center">
                        {isEditing ? (
                          <div className="flex flex-col items-center gap-1.5 w-32 mx-auto">
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={1}
                              value={formState.severityWeight}
                              onChange={(e) =>
                                setFormState({ ...formState, severityWeight: Number(e.target.value) })
                              }
                              className="w-full"
                            />
                            <span className="font-mono text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              {formState.severityWeight} / 5
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                            {item.severityWeight} / 5
                          </span>
                        )}
                      </td>

                      {/* SLA Hours Slider */}
                      <td className="px-5 py-4 text-center">
                        {isEditing ? (
                          <div className="flex flex-col items-center gap-1.5 w-32 mx-auto">
                            <input
                              type="range"
                              min={1}
                              max={72}
                              step={1}
                              value={formState.slaHours}
                              onChange={(e) =>
                                setFormState({ ...formState, slaHours: Number(e.target.value) })
                              }
                              className="w-full"
                            />
                            <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                              {formState.slaHours} Hours
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-blue-700 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {item.slaHours} Hours
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600 font-medium">
                        {isEditing ? (
                          <input
                            type="text"
                            value={formState.description}
                            onChange={(e) =>
                              setFormState({ ...formState, description: e.target.value })
                            }
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                          />
                        ) : (
                          item.description || 'Standard facility item'
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingCategory(null)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSave(item.category)}
                              disabled={saving}
                              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/20"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditClick(item)}
                            disabled={!isAdmin}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isAdmin
                                ? 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white'
                                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                            }`}
                            title={!isAdmin ? 'Admin privileges required' : 'Edit with Sliders'}
                          >
                            Configure
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
