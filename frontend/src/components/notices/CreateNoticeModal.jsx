import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Pin, Send } from 'lucide-react';

export const CreateNoticeModal = ({ isOpen, onClose, onCreated }) => {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    isPinned: false
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toastError('Title and content are required.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/notices', formData);
      success('Notice broadcast published.');
      onCreated();
      onClose();
      setFormData({
        title: '',
        content: '',
        category: 'General',
        isPinned: false
      });
    } catch (err) {
      toastError(err.message || 'Failed to publish notice.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish Society Announcement">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Notice Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Scheduled Elevator Maintenance & Power Generator Testing"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              {['General', 'Maintenance', 'Emergency', 'Event', 'Finance'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                Pin to Board Header
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Announcement Content <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Write full announcement details, timing, impact, and point of contact..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
