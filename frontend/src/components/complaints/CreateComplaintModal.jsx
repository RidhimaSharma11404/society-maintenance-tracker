import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Wrench,
  AlertCircle,
  FileText,
  Camera,
  Clock,
  Send,
  Building,
  CheckCircle2
} from 'lucide-react';

export const CreateComplaintModal = ({ isOpen, onClose, onCreated, defaultUnit }) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    priority: 'Medium',
    unitNumber: defaultUnit || user?.unitNumber || 'Tower A - 101',
    photoUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (defaultUnit) {
      setFormData((prev) => ({ ...prev, unitNumber: defaultUnit }));
    } else if (user?.unitNumber) {
      setFormData((prev) => ({ ...prev, unitNumber: user.unitNumber }));
    }
  }, [defaultUnit, user, isOpen]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.settings?.length) {
          setCategories(res.data.settings);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) loadCategories();
  }, [isOpen]);

  const selectedCategorySetting = categories.find((c) => c.category === formData.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.unitNumber.trim()) {
      toastError('Title, description, and flat number are required.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/complaints', formData);
      success('Maintenance ticket registered successfully! SLA resolution timer is active.');
      onCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        category: 'Plumbing',
        priority: 'Medium',
        unitNumber: user?.unitNumber || 'Tower A - 101',
        photoUrl: ''
      });
    } catch (err) {
      toastError(err.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Maintenance Request" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
        {/* Unit Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Flat / Unit Location <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Tower B - 101"
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              {['Plumbing', 'Electrical', 'Elevator', 'Carpentry', 'Security', 'Sanitation', 'Civil'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SLA Live Preview Capsule */}
        {selectedCategorySetting && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>
                Standard Resolution SLA: <strong>{selectedCategorySetting.slaHours} Hours</strong>
              </span>
            </div>
            <span className="font-mono font-bold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded text-[11px]">
              Severity Weight: {selectedCategorySetting.severityWeight}/5
            </span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Complaint Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Master Bathroom Riser Pipe Leaking into Wall Shaft"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Priority & Photo URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority Severity
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`py-1.5 rounded text-xs font-bold border transition-colors ${
                    formData.priority === p
                      ? p === 'Critical'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : p === 'High'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Photo URL / Evidence Attachment
            </label>
            <div className="relative">
              <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://..."
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Defect Details & Inspection Notes <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe the exact issue, duration, leakage impact, or technician instructions..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Registering Ticket...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
