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
  RefreshCw,
  BellRing,
  Sparkles
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
      const items = Array.isArray(res.data) ? res.data : (res.data?.notices || res.data?.items || []);
      setNotices(items);
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

  const pinnedNotices = notices.filter((n) => n.isPinned || n.priority === 'Urgent');
  const regularNotices = notices.filter((n) => !n.isPinned && n.priority !== 'Urgent');

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-100">
      {/* Header Card */}
      <div className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <BellRing className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-sans text-white uppercase tracking-tight">
              Society Bulletins & Official Circulars
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            General management broadcasts, water shutoff notices, and AGM announcements.
          </p>
        </div>

        {isManagerOrStaff && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all self-start sm:self-auto cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Post New Circular</span>
          </button>
        )}
      </div>

      {/* Pinned Important Announcements */}
      {pinnedNotices.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 fill-amber-400" />
            <span>PINNED IMPORTANT NOTICES</span>
          </h3>

          <div className="space-y-3">
            {pinnedNotices.map((n) => (
              <div
                key={n._id}
                className="p-5 bg-gradient-to-r from-amber-950/80 to-slate-900/90 border border-amber-500/50 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.15)] space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                      HIGH PRIORITY
                    </span>
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">{n.content}</p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-amber-500/20">
                  <span>Issued by: <strong className="text-slate-200">{n.issuedBy?.name || 'Secretary Elena Vance'}</strong></span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Delete Notice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Circulars */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          GENERAL NOTICES ({regularNotices.length})
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mx-auto mb-2" />
            Loading circulars...
          </div>
        ) : regularNotices.length === 0 && pinnedNotices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
            No circulars currently posted.
          </div>
        ) : (
          regularNotices.map((n) => (
            <div
              key={n._id}
              className="p-5 bg-[#0B1220]/90 border border-slate-800 rounded-2xl space-y-2 shadow-md hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{n.title}</h4>
                <span className="text-[11px] font-mono text-slate-500">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span>Issued by: <strong className="text-slate-300">{n.issuedBy?.name || 'Secretary Elena Vance'}</strong></span>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isCreateModalOpen && (
        <CreateNoticeModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => {
            setIsCreateModalOpen(false);
            fetchNotices();
          }}
        />
      )}
    </div>
  );
};
