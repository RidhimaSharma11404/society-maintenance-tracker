import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CreateNoticeModal } from '../components/notices/CreateNoticeModal';
import api from '../services/api';
import {
  Pin,
  Plus,
  Trash2,
  Calendar,
  User,
  Megaphone,
  RefreshCw
} from 'lucide-react';

export const Notices = () => {
  const { isManagerOrStaff, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notices');
      setNotices(res.data?.notices || []);
    } catch (err) {
      console.error('Failed to load notices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice broadcast?')) {
      return;
    }
    try {
      await api.delete(`/notices/${id}`);
      success('Notice deleted.');
      fetchNotices();
    } catch (err) {
      toastError(err.message || 'Failed to delete notice.');
    }
  };

  const pinnedNotices = notices.filter((n) => n.isPinned);
  const regularNotices = notices.filter((n) => !n.isPinned);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-600" />
            Society Announcements & Bulletins
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official operational circulars, AGM updates, maintenance advisories, and facility notices
          </p>
        </div>

        {isManagerOrStaff && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 flex items-center justify-center text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
          Loading announcements...
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200/80 rounded-2xl text-center text-xs text-slate-400">
          No notices currently active on the community board.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Section */}
          {pinnedNotices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-amber-600" />
                Pinned Priority Announcements ({pinnedNotices.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedNotices.map((notice) => (
                  <div
                    key={notice._id}
                    className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-extrabold">
                          {notice.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                            <Calendar className="w-3 h-3" />
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(notice._id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                              title="Delete Notice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                        {notice.title}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                        {notice.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Issued by: {notice.createdBy?.name || 'Society Ops'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Announcements */}
          {regularNotices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                General Community Notices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularNotices.map((notice) => (
                  <div
                    key={notice._id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                          {notice.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                            <Calendar className="w-3 h-3" />
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(notice._id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                              title="Delete Notice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                        {notice.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                        {notice.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Issued by: {notice.createdBy?.name || 'Society Ops'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CreateNoticeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchNotices}
      />
    </div>
  );
};
