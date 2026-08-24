import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Building2,
  CheckCircle2,
  Clock,
  Camera,
  ArrowRight,
  ArrowLeft,
  Wrench,
  User,
  ShieldCheck,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Select Tower' },
  { id: 2, title: 'Select Unit' },
  { id: 3, title: 'Category & SLA' },
  { id: 4, title: 'Issue Details' },
  { id: 5, title: 'Review & Submit' }
];

const TOWERS = [
  { id: 'Tower A', name: 'Tower A (North Wing)', icon: Building2, desc: 'Flats 101 - 404 (16 Units)' },
  { id: 'Tower B', name: 'Tower B (South Wing)', icon: Building2, desc: 'Flats 101 - 404 (16 Units)' },
  { id: 'Tower C', name: 'Tower C (East Wing)', icon: Building2, desc: 'Flats 101 - 404 (16 Units)' },
  { id: 'Clubhouse', name: 'Clubhouse & Pool', icon: Layers, desc: 'Community Amenities & Gym' },
  { id: 'Utility Complex', name: 'Pump & Generator House', icon: Wrench, desc: 'Critical Infrastructure' }
];

export const GuidedComplaintWizard = ({ isOpen, onClose, onCreated, defaultUnit }) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState(1);
  const [selectedTower, setSelectedTower] = useState('Tower A');
  const [selectedFloor, setSelectedFloor] = useState(4);
  const [selectedFlatNum, setSelectedFlatNum] = useState(2);

  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    priority: 'Medium',
    unitNumber: defaultUnit || user?.unitNumber || 'Tower A - 402',
    photoUrl: '',
    assignedStaff: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [settingsRes, techsRes] = await Promise.all([
          api.get('/settings'),
          api.get('/technicians')
        ]);
        if (settingsRes.data?.settings) setCategories(settingsRes.data.settings);
        if (techsRes.data?.technicians) setTechnicians(techsRes.data.technicians);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) loadMetadata();
  }, [isOpen]);

  // Sync unit calculation
  useEffect(() => {
    if (selectedTower.startsWith('Tower')) {
      const computedUnit = `${selectedTower} - ${selectedFloor}0${selectedFlatNum}`;
      setFormData((prev) => ({ ...prev, unitNumber: computedUnit }));
    } else {
      setFormData((prev) => ({ ...prev, unitNumber: selectedTower }));
    }
  }, [selectedTower, selectedFloor, selectedFlatNum]);

  const selectedCatObj = categories.find((c) => c.category === formData.category);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toastError('Please provide a title and detailed issue description.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/complaints', formData);
      success('Ticket registered successfully! SLA resolution timer is active.');
      onCreated();
      onClose();
      setStep(1);
      setFormData({
        title: '',
        description: '',
        category: 'Plumbing',
        priority: 'Medium',
        unitNumber: user?.unitNumber || 'Tower A - 402',
        photoUrl: '',
        assignedStaff: ''
      });
    } catch (err) {
      toastError(err.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Step-by-Step Maintenance Complaint Wizard" maxWidth="max-w-2xl">
      <div className="space-y-6 text-slate-900 font-sans">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.id
                    ? 'bg-blue-700 text-white shadow-xs'
                    : step > s.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
              </div>
              <span
                className={`text-xs hidden sm:inline font-semibold ${
                  step === s.id ? 'text-blue-900 font-bold' : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
              {idx < STEPS.length - 1 && <span className="text-slate-200 hidden sm:inline mx-1">➔</span>}
            </div>
          ))}
        </div>

        {/* STEP 1: Select Tower / Building Block */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Step 1: Select Building Block / Tower</h4>
              <p className="text-xs text-slate-500">Where is the maintenance defect located in the society?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOWERS.map((tower) => {
                const Icon = tower.icon;
                const isSelected = selectedTower === tower.id;
                return (
                  <button
                    key={tower.id}
                    type="button"
                    onClick={() => setSelectedTower(tower.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-100 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{tower.name}</div>
                        <div className="text-[11px] text-slate-500">{tower.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Select Floor & Unit */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Step 2: Choose Floor & Flat Number in {selectedTower}</h4>
              <p className="text-xs text-slate-500">Select the specific flat unit or utility riser location.</p>
            </div>

            {selectedTower.startsWith('Tower') ? (
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {/* Floor Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Floor Level:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[4, 3, 2, 1].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSelectedFloor(f)}
                        className={`py-2 rounded-lg font-bold text-xs transition-all ${
                          selectedFloor === f
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Floor {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flat Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Flat Unit on Floor {selectedFloor}:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((u) => {
                      const flatStr = `${selectedFloor}0${u}`;
                      const isSelected = selectedFlatNum === u;
                      return (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setSelectedFlatNum(u)}
                          className={`p-3 rounded-lg font-mono text-center font-bold text-xs transition-all ${
                            isSelected
                              ? 'bg-blue-700 text-white ring-2 ring-blue-200 shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-800 hover:border-blue-400'
                          }`}
                        >
                          Flat {flatStr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Target Unit Assigned:</span>
                  <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {formData.unitNumber}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <div className="text-xs font-bold text-slate-800">{selectedTower} Common Area Asset</div>
                <p className="text-xs text-slate-500">
                  Target assigned directly to society common facility infrastructure.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Category & SLA */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Step 3: Select Defect Category & Review SLA</h4>
              <p className="text-xs text-slate-500">Different categories carry pre-configured resolution targets and severity weights.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {['Plumbing', 'Electrical', 'Elevator', 'Carpentry', 'Security', 'Sanitation', 'Civil'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.category === cat
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-100 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{cat}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {cat === 'Electrical' ? '12h Target' : cat === 'Elevator' ? '6h Target' : '24h Target'}
                  </div>
                </button>
              ))}
            </div>

            {selectedCatObj && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-950">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-700" />
                  <span>
                    Mandatory Resolution SLA: <strong>{selectedCatObj.slaHours} Hours</strong>
                  </span>
                </div>
                <span className="font-mono font-bold bg-blue-200/80 px-2 py-0.5 rounded text-[11px]">
                  Severity Weight: {selectedCatObj.severityWeight}/5
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Issue Description & Priority */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Step 4: Problem Description & Priority</h4>
              <p className="text-xs text-slate-500">Provide clear instructions so the assigned technician can act immediately.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Complaint Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Master Bathroom Riser Pipe Joint Leakage"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`py-1.5 rounded text-xs font-bold border transition-colors ${
                        formData.priority === p
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
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
                  Photo URL Evidence (Optional)
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Defect Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain the issue, exact room/duct location, time noticed, and any dampness..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Step 5: Review & Confirm Registration</h4>
              <p className="text-xs text-slate-500">Verify your ticket summary before dispatching to the society maintenance desk.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Target Location:</span>
                <strong className="text-slate-900 font-mono">{formData.unitNumber}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Category:</span>
                <strong className="text-slate-900">{formData.category}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Priority:</span>
                <strong className="text-blue-700">{formData.priority}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">SLA Window:</span>
                <strong className="text-slate-900">{selectedCatObj?.slaHours || 24} Hours</strong>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-0.5">Title & Details:</span>
                <p className="font-bold text-slate-900">{formData.title}</p>
                <p className="text-slate-700 mt-1 whitespace-pre-wrap">{formData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Cancel
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Registering Ticket...' : 'Confirm & Submit Ticket'}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
