import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  MailCheck,
  Send,
  RotateCw,
  RefreshCw,
  Server
} from 'lucide-react';

export const OutboxLogs = () => {
  const { success, error: toastError } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [processing, setProcessing] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        limit: 50,
        status: statusFilter !== 'All' ? statusFilter : undefined
      };
      const res = await api.get('/outbox/logs', { params });
      setLogs(res.data?.logs || []);
    } catch (err) {
      console.error('Failed to load outbox logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter]);

  const handleProcessQueue = async () => {
    setProcessing(true);
    try {
      const res = await api.post('/outbox/process');
      success(
        `Outbox Processed: ${res.data.processed || 0} event(s) swept (${res.data.successCount || 0} dispatched).`
      );
      fetchLogs();
    } catch (err) {
      toastError(err.message || 'Failed to dispatch outbox items.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRetryItem = async (id) => {
    try {
      await api.post(`/outbox/retry/${id}`);
      success('Notification re-queued for dispatch.');
      fetchLogs();
    } catch (err) {
      toastError(err.message || 'Failed to retry item.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MailCheck className="w-6 h-6 text-blue-600" />
            Transactional Outbox & Event Dispatcher
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Decoupled asynchronous notification pipeline with ACID transaction fallback and retry policies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shadow-card hover:shadow-card-hover transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-400'}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleProcessQueue}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{processing ? 'Dispatching...' : 'Dispatch Queue'}</span>
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Transactional Outbox Architecture
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Domain notifications are inserted inside the MongoDB transaction boundary with the ticket mutation. The asynchronous worker polls and sends notifications without adding latency to resident HTTP requests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs pt-3 border-t border-slate-100">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Filter Status:</span>
          {['All', 'PENDING', 'SENT', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Recipient & Event</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Attempts</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
                    Loading outbox queue...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{log.recipient}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {log.metadata?.eventType || 'SYSTEM_EVENT'}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700 max-w-xs truncate font-semibold">
                      {log.subject}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                          log.status === 'SENT'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : log.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                            : 'bg-rose-50 text-rose-700 border-rose-200/80'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center font-mono text-slate-800 font-bold">
                      {log.attempts || 0} / 5
                    </td>

                    <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      {log.status === 'FAILED' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetryItem(log._id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <RotateCw className="w-3 h-3" />
                          Retry
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {log.lastAttempt ? 'Dispatched' : 'Queued'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No transactional outbox records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Outbox Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-elevated text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Outbox Event Payload</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Recipient</span>
                <span className="font-bold text-slate-900">{selectedLog.recipient}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Subject</span>
                <span className="font-bold text-slate-900">{selectedLog.subject}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Message Payload</span>
                <div className="mt-1 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedLog.body}
                </div>
              </div>
              {selectedLog.error && (
                <div>
                  <span className="text-rose-600 block text-[10px] font-bold uppercase">Dispatch Error</span>
                  <div className="mt-1 p-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-medium">
                    {selectedLog.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
