import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  Wrench,
  Home,
  Mail,
  Lock,
  ArrowRight,
  Zap,
  CreditCard,
  Flame,
  Layers,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export const Login = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const [email, setEmail] = useState('admin@greenwood.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      toastSuccess(`Authenticated as ${loggedUser.name} (${loggedUser.role.toUpperCase()}).`);
    } catch (err) {
      toastError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role, demoEmail) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('Password123!');
    setLoading(true);
    try {
      const loggedUser = await login(demoEmail, 'Password123!');
      toastSuccess(`Logged in as ${loggedUser.name} (${role.toUpperCase()}).`);
    } catch (err) {
      toastError(err.message || 'Instant login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Four Core Features in Curved Circular Badges
  const features = [
    {
      id: 'predictive',
      icon: Flame,
      title: 'Predictive Defect Engine',
      sub: 'Spots recurring faults across plumbing & lifts before component failure.',
      tag: 'Decay Math'
    },
    {
      id: 'elevation',
      icon: Layers,
      title: 'Living Building Map',
      sub: 'Real-time telemetry and risk coloring across all 24 campus units.',
      tag: 'Digital Twin'
    },
    {
      id: 'sla',
      icon: Zap,
      title: 'Smart SLA Dispatch',
      sub: 'Automated contractor routing with under 2.4-hour turnaround SLA.',
      tag: 'Work Orders'
    },
    {
      id: 'billing',
      icon: CreditCard,
      title: 'ACID Billing & Ledger',
      sub: 'Immutable society dues ledger with automated payment receipts.',
      tag: 'Multi-Tenant'
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#EEF2F6] font-sans text-[#16233D]">
      {/* LEFT PANEL (~42%): The Operations Sign-In Form */}
      <div className="w-full lg:w-[44%] xl:w-[38%] flex flex-col justify-between p-8 sm:p-12 lg:p-14 bg-[#EEF2F6] border-r border-[#CBD3DD] min-h-screen z-20">
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
                FACILITY OPERATIONS & RISK PORTAL
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Form Block */}
        <div className="max-w-sm w-full mx-auto my-auto py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold font-sans text-[#16233D] tracking-tight">
              Sign in to the console.
            </h1>
            <p className="text-xs text-[#6E7C90] mt-1 font-sans">
              Click any role for 1-tap instant login, or enter credentials below.
            </p>
          </div>

          {/* 1-Click Instant Demo Login for ALL THREE ROLES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E7C90]">
              <span>INSTANT 1-CLICK ACCESS (ALL 3 ROLES)</span>
              <span className="text-[#2E8B63] font-mono font-bold">READY</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* Role 1: Admin */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('admin', 'admin@greenwood.com')}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-white border-[#16233D] border-l-4 border-l-[#E8A33D] shadow-sm'
                    : 'bg-white/70 hover:bg-white border-[#CBD3DD] text-[#6E7C90]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16233D]" />
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-100 border border-slate-200">L4</span>
                </div>
                <div className="text-xs font-bold font-mono text-[#16233D]">ADMIN</div>
                <div className="text-[10px] font-mono text-[#6E7C90]">Secretary</div>
              </button>

              {/* Role 2: Staff */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('staff', 'staff@greenwood.com')}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  selectedRole === 'staff'
                    ? 'bg-white border-[#16233D] border-l-4 border-l-[#E8A33D] shadow-sm'
                    : 'bg-white/70 hover:bg-white border-[#CBD3DD] text-[#6E7C90]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Wrench className="w-4 h-4 text-[#16233D]" />
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-100 border border-slate-200">OPS</span>
                </div>
                <div className="text-xs font-bold font-mono text-[#16233D]">STAFF</div>
                <div className="text-[10px] font-mono text-[#6E7C90]">Technician</div>
              </button>

              {/* Role 3: Resident */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('resident', 'resident@greenwood.com')}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  selectedRole === 'resident'
                    ? 'bg-white border-[#16233D] border-l-4 border-l-[#E8A33D] shadow-sm'
                    : 'bg-white/70 hover:bg-white border-[#CBD3DD] text-[#6E7C90]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Home className="w-4 h-4 text-[#16233D]" />
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-100 border border-slate-200">FLAT</span>
                </div>
                <div className="text-xs font-bold font-mono text-[#16233D]">RESIDENT</div>
                <div className="text-[10px] font-mono text-[#6E7C90]">Flat 402</div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-[#CBD3DD] w-full" />
            <span className="bg-[#EEF2F6] px-2.5 text-[10px] font-mono text-[#6E7C90] uppercase tracking-wider absolute">
              OR LOGIN WITH CREDENTIALS
            </span>
          </div>

          {/* Credentials Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                WORK / RESIDENT EMAIL
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@greenwood.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] placeholder-[#6E7C90]/60 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                SECURITY KEY // PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] placeholder-[#6E7C90]/60 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Signature Electric Amber Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#E8A33D] hover:bg-[#d97d15] active:scale-98 text-[#16233D] text-xs font-sans font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#16233D]" />
            </button>
          </form>

          {/* Sublinks: Registration link is prominent & functional */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#6E7C90] border-t border-[#CBD3DD]">
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Please contact Society Secretary at admin@greenwood.com for password reset assistance.');
              }}
              className="hover:text-[#16233D] transition-colors"
            >
              Forgot password?
            </a>

            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-[#16233D] hover:text-[#E8A33D] underline transition-colors cursor-pointer"
            >
              + Register New Flat Owner
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-mono text-[#6E7C90] flex items-center justify-between border-t border-[#CBD3DD] pt-3">
          <span>CAMPUS STATUS: ONLINE</span>
          <span>GREENWOOD OPS v2.4</span>
        </div>
      </div>

      {/* RIGHT PANEL: Four Curved Feature Circles / Badges Hero */}
      <div className="hidden lg:flex flex-1 bg-[#0D1420] text-[#EEF2F6] flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#E8A33D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#2E8B63]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status Header */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#6E7C90] border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B63] animate-pulse" />
            <span className="text-[#EEF2F6] font-bold tracking-wide">CAMPUS TELEMETRY ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>TOWERS A & B</span>
            <span>·</span>
            <span>24 PHYSICAL UNITS</span>
          </div>
        </div>

        {/* Center Hero Block */}
        <div className="relative z-10 my-auto py-6 space-y-8 max-w-2xl mx-auto w-full">
          {/* Header Title Block */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-[#E8A33D]">
              <span className="w-2 h-2 rounded-full bg-[#E8A33D] animate-ping" />
              <span>FACILITY PLATFORM CAPABILITIES</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold font-sans tracking-tight text-white leading-tight">
              Intelligent building operations. <br />
              <span className="text-[#E8A33D]">Zero defect downtime.</span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed max-w-lg">
              Empowering facility managers, technicians, and residents with automated operations intelligence.
            </p>
          </div>

          {/* FOUR CURVED CIRCULAR FEATURE CARDS (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="group relative p-6 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-[#E8A33D]/60 hover:bg-slate-900 transition-all duration-300 shadow-lg flex flex-col justify-between"
                >
                  {/* Top Row with Curved Circle Icon Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-700/80 flex items-center justify-center text-[#E8A33D] group-hover:scale-110 group-hover:border-[#E8A33D] group-hover:shadow-[0_0_15px_rgba(232,163,61,0.35)] transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                      0{idx + 1} · {feat.tag}
                    </span>
                  </div>

                  {/* Feature Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold font-sans text-white group-hover:text-[#E8A33D] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {feat.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Live Facility Health Metric Strip */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-0.5 text-center">
              <div className="text-[10px] font-mono text-[#6E7C90] uppercase">
                Facility Uptime
              </div>
              <div className="text-lg font-mono font-bold text-[#2E8B63]">
                99.4%
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-0.5 text-center">
              <div className="text-[10px] font-mono text-[#6E7C90] uppercase">
                Active Sensors
              </div>
              <div className="text-lg font-mono font-bold text-white">
                24 Units
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-0.5 text-center">
              <div className="text-[10px] font-mono text-[#6E7C90] uppercase">
                Avg Resolution SLA
              </div>
              <div className="text-lg font-mono font-bold text-[#E8A33D]">
                &lt; 2.4 hrs
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#6E7C90] border-t border-slate-800/80 pt-4">
          <span>GREENWOOD HEIGHTS CO-OPERATIVE HOUSING SOCIETY</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </div>
  );
};
