import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ComplaintStatusStepper } from './ComplaintStatusStepper';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Clock,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  SendHorizontal,
  FileText
} from 'lucide-react';

const ALLOWED_TRANSITIONS = {
  Open: ['In Progress', 'Resolved'],
  'In Progress': ['Resolved', 'Open'],
  Resolved: ['Closed', 'In Progress'],
  Closed: []
};

export const ComplaintDetailModal = ({ isOpen, onClose, complaint, onUpdated }) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [nextStatus, setNextStatus] = useState('');
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);

  if (!complaint) return null;

  const validNextStatuses = ALLOWED_TRANSITIONS[complaint.currentStatus] || [];

  const handleStatusTransition = async (e) => {
    e.preventDefault();
    if (!nextStatus) {
      toastError('Please select the target status.');
      return;
    }
    if (!comment.trim()) {
      toastError('Please provide a mandatory audit comment explaining this action.');
      return;
    }

    setUpdating(true);
    try {
      await api.put(`/complaints/${complaint._id}/status`, {
        nextStatus,
        comment
      });
      success(`Ticket status transitioned to '${nextStatus}' successfully.`);
      setNextStatus('');
      setComment('');
      onUpdated();
      onClose();
    } catch (err) {
      toastError(err.message || 'Status transition rejected.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket #${complaint._id.slice(-6).toUpperCase()} - ${complaint.title}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-slate-900">
        {/* Overdue Alert */}
        {complaint.isOverdue && (
          <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 uppercase tracking-wider">
                SLA Breach - Target Overdue
              </h4>
              <p className="text-rose-800 mt-0.5">
                This ticket exceeded its resolution target on{' '}
                {new Date(complaint.dueDate).toLocaleString()}. Priority escalation is advised.
              </p>
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Status</span>
            <div className="mt-1">
              <StatusBadge status={complaint.currentStatus} />
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Category & Priority</span>
            <div className="mt-1 flex items-center gap-1.5 font-bold text-slate-800">
              <span>{complaint.category}</span>
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Unit / Location</span>
            <div className="mt-1 flex items-center gap-1 text-slate-900 font-bold">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{complaint.unitNumber}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Resolution Target</span>
            <div className="mt-1 flex items-center gap-1 text-slate-900 font-mono text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{new Date(complaint.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Description & Resident */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Reported by: <strong className="text-slate-900">{complaint.resident?.name || 'Resident'}</strong> ({complaint.resident?.email})
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(complaint.createdAt).toLocaleString()}
            </span>
          </div>

          <div>
            <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
              Issue Description
            </h5>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
              {complaint.description}
            </p>
          </div>

          {/* Photo */}
          {complaint.photoUrl && (
            <div className="pt-3 border-t border-slate-100">
              <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Attached Photo Evidence
              </h5>
              <a
                href={complaint.photoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block relative group rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-colors shadow-2xs"
              >
                <img
                  src={complaint.photoUrl}
                  alt="Complaint attachment"
                  className="max-h-48 rounded-xl object-cover group-hover:scale-102 transition-transform duration-200"
                />
              </a>
            </div>
          )}
        </div>

        {/* Stepper */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <ComplaintStatusStepper
            currentStatus={complaint.currentStatus}
            statusHistory={complaint.statusHistory || []}
          />
        </div>

        {/* State Transition Form */}
        {validNextStatuses.length > 0 ? (
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                State Machine Transition
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Permitted: [{validNextStatuses.join(', ')}]
              </span>
            </div>

            <form onSubmit={handleStatusTransition} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Next Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {validNextStatuses.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNextStatus(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        nextStatus === st
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      ➔ Transition to {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mandatory Audit Log Comment <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="State technician action, inspection findings, or resolution details..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600 resize-none font-medium"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating || !nextStatus || !comment.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  {updating ? 'Committing...' : 'Commit Transition'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-center text-xs text-slate-500 font-bold">
            This ticket is in the terminal <strong>Closed</strong> state.
          </div>
        )}
      </div>
    </Modal>
  );
};
