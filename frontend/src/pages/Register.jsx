import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  Lock,
  Home,
  Phone,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building
} from 'lucide-react';

export const Register = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    unitNumber: 'Tower A - 201',
    phoneNumber: '',
    role: 'resident'
  });
  const [loading, setLoading] = useState(false);

  const availableUnits = [
    'Tower A - 101', 'Tower A - 102',
    'Tower A - 201', 'Tower A - 202',
    'Tower A - 301', 'Tower A - 302',
    'Tower A - 401', 'Tower A - 402',
    'Tower B - 101', 'Tower B - 102',
    'Tower B - 201', 'Tower B - 202',
    'Tower B - 301', 'Tower B - 302',
    'Tower B - 401', 'Tower B - 402'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.unitNumber) {
      toastError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const authUser = await register(formData);
      toastSuccess(`Welcome to Greenwood Heights, ${authUser.name}! Resident account active.`);
    } catch (err) {
      toastError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#EEF2F6] font-sans text-[#16233D]">
      {/* LEFT PANEL (~42%): Clean Registration Form */}
      <div className="w-full lg:w-[44%] xl:w-[38%] flex flex-col justify-between p-8 sm:p-12 lg:p-14 bg-[#EEF2F6] border-r border-[#CBD3DD] min-h-screen z-20 overflow-y-auto">
        {/* Top Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#16233D] text-white font-mono font-bold text-xs flex items-center justify-center tracking-wider shadow-sm">
              GH
            </div>
            <div>
              <div className="font-mono font-bold text-xs tracking-widest text-[#16233D] uppercase">
                GREENWOOD HEIGHTS CHS
              </div>
              <div className="text-[10px] font-mono text-[#6E7C90]">
                NEW RESIDENT ENROLLMENT
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Form Block */}
        <div className="max-w-sm w-full mx-auto my-auto py-8 space-y-5">
          <div>
            <h1 className="text-2xl font-bold font-sans text-[#16233D] tracking-tight">
              Register your flat.
            </h1>
            <p className="text-xs text-[#6E7C90] mt-1 font-sans">
              Enter resident details to access your society maintenance ledger and tickets.
            </p>
          </div>

          {/* Registration Form */}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                FULL RESIDENT NAME <span className="text-[#C6433D]">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] placeholder-[#6E7C90]/60 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                EMAIL ADDRESS <span className="text-[#C6433D]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@greenwood.com"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] placeholder-[#6E7C90]/60 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Unit / Flat Selection & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                  FLAT / UNIT <span className="text-[#C6433D]">*</span>
                </label>
                <div className="relative">
                  <Home className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] outline-none cursor-pointer"
                  >
                    {availableUnits.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] placeholder-[#6E7C90]/60 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                PASSWORD <span className="text-[#C6433D]">* (MIN 6 CHARS)</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] placeholder-[#6E7C90]/60 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button in Electric Amber */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#E8A33D] hover:bg-[#d97d15] active:scale-98 text-[#16233D] text-xs font-sans font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
            >
              <span>{loading ? 'Registering...' : 'Complete Resident Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#16233D]" />
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="pt-2 text-center border-t border-[#CBD3DD]">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-xs text-[#6E7C90] hover:text-[#16233D] flex items-center justify-center gap-1.5 w-full font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Already registered? <span className="font-bold text-[#16233D] underline">Sign In</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-mono text-[#6E7C90] flex items-center justify-between border-t border-[#CBD3DD] pt-3">
          <span>SECURE RESIDENT ENROLLMENT</span>
          <span>BCRYPT & JWT HASHED</span>
        </div>
      </div>

      {/* RIGHT PANEL: Resident Benefits Showcase */}
      <div className="hidden lg:flex flex-1 bg-[#0D1420] text-[#EEF2F6] flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#E8A33D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#2E8B63]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#6E7C90] border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B63] animate-pulse" />
            <span className="text-[#EEF2F6] font-bold">RESIDENT ONBOARDING</span>
          </div>
          <span>GREENWOOD HEIGHTS CHS</span>
        </div>

        {/* Center Editorial */}
        <div className="relative z-10 my-auto py-6 space-y-7 max-w-xl mx-auto w-full">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-[#2E8B63]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B63]" />
              <span>OFFICIAL SOCIETY PORTAL</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold font-sans tracking-tight text-white leading-tight">
              Manage your flat's maintenance. <br />
              <span className="text-[#E8A33D]">Directly from your phone.</span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
              Register your flat to log plumbing, electrical, and common facility repairs with instant dispatch tracking and online maintenance ledger.
            </p>
          </div>

          {/* 4 Resident Perks */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8A33D]" />
                1-Tap Ticket Log
              </div>
              <p className="text-[11px] text-slate-400">
                Report leaks, power trips, or lift issues directly to technicians.
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E8B63]" />
                Live SLA Countdown
              </div>
              <p className="text-[11px] text-slate-400">
                Track contractor turnaround time from dispatch to resolution.
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8A33D]" />
                Digital Dues Ledger
              </div>
              <p className="text-[11px] text-slate-400">
                View monthly maintenance invoices and payment receipts.
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E8B63]" />
                Society Circulars
              </div>
              <p className="text-[11px] text-slate-400">
                Stay updated on water tank cleaning and power shutdowns.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#6E7C90] border-t border-slate-800/80 pt-4">
          <span>GREENWOOD HEIGHTS RESIDENT NETWORK</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </div>
  );
};
