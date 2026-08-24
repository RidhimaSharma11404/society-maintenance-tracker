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
  Sparkles,
  CheckCircle2,
  Building2,
  Activity
} from 'lucide-react';

export const Login = ({ onNavigateToRegister, onLoginSuccess }) => {
  const { login } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const [email, setEmail] = useState('admin@greenwood.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('admin');

  const handleRoleLogin = async (role, roleEmail) => {
    setActiveRole(role);
    setEmail(roleEmail);
    setPassword('Password123!');
    setLoading(true);
    try {
      const loggedUser = await login(roleEmail, 'Password123!');
      toastSuccess(`Signed in as ${loggedUser.name} (${role.toUpperCase()}).`);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      toastError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      toastSuccess(`Signed in as ${loggedUser.name} (${loggedUser.role.toUpperCase()}).`);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      toastError(err.message || 'Login failed. Please check your credentials.');
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
      {/* LEFT PANEL (~40%): The Operations Sign-In Form */}
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
                FACILITY OPERATIONS & RISK PORTAL
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Form Block */}
        <div className="max-w-sm w-full mx-auto my-auto py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold font-sans text-[#16233D] tracking-tight">
              Sign in to the console.
            </h1>
            <p className="text-xs text-[#6E7C90] mt-1 font-sans">
              Choose your role below for 1-click access to your workspace:
            </p>
          </div>

          {/* THREE PRIMARY 1-CLICK ROLE LOGIN BUTTONS */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E7C90]">
              <span>SELECT YOUR LOGIN OPTION</span>
              <span className="text-[#2E8B63] font-mono font-bold">● ONLINE</span>
            </div>

            {/* Option 1: Admin */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleRoleLogin('admin', 'admin@greenwood.com')}
              className="w-full p-3.5 bg-white hover:bg-[#F8FAFC] active:scale-[0.99] border-2 border-[#16233D] border-l-6 border-l-[#E8A33D] flex items-center justify-between transition-all cursor-pointer shadow-sm group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#16233D] text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#E8A33D]" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-[#16233D] group-hover:text-[#E8A33D] transition-colors">
                    1. LOGIN AS ADMIN
                  </div>
                  <div className="text-[11px] text-[#6E7C90]">
                    Secretary Elena Vance · Operations Console
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#16233D] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Option 2: Staff */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleRoleLogin('staff', 'staff@greenwood.com')}
              className="w-full p-3.5 bg-white hover:bg-[#F8FAFC] active:scale-[0.99] border border-[#CBD3DD] hover:border-[#16233D] border-l-6 border-l-[#16233D] flex items-center justify-between transition-all cursor-pointer shadow-sm group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-[#16233D] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[#16233D]" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-[#16233D] group-hover:text-[#E8A33D] transition-colors">
                    2. LOGIN AS STAFF / OPS
                  </div>
                  <div className="text-[11px] text-[#6E7C90]">
                    Technician Marcus Cole · Maintenance Queue
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6E7C90] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Option 3: Resident */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleRoleLogin('resident', 'resident@greenwood.com')}
              className="w-full p-3.5 bg-white hover:bg-[#F8FAFC] active:scale-[0.99] border border-[#CBD3DD] hover:border-[#16233D] border-l-6 border-l-[#2E8B63] flex items-center justify-between transition-all cursor-pointer shadow-sm group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Home className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-[#16233D] group-hover:text-[#2E8B63] transition-colors">
                    3. LOGIN AS RESIDENT
                  </div>
                  <div className="text-[11px] text-[#6E7C90]">
                    Dr. Arthur Pendelton · Flat 402 Tickets & Dues
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6E7C90] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-[#CBD3DD] w-full" />
            <span className="bg-[#EEF2F6] px-2.5 text-[10px] font-mono text-[#6E7C90] uppercase tracking-wider absolute">
              OR SIGN IN WITH CUSTOM CREDENTIALS
            </span>
          </div>

          {/* Custom Credentials Form */}
          <form className="space-y-3" onSubmit={handleFormSubmit}>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@greenwood.com"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] placeholder-[#6E7C90]/60 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#16233D]">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#6E7C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#CBD3DD] focus:border-[#16233D] text-xs font-mono text-[#16233D] placeholder-[#6E7C90]/60 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Signature Electric Amber Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#E8A33D] hover:bg-[#d97d15] active:scale-98 text-[#16233D] text-xs font-sans font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Credentials'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#16233D]" />
            </button>
          </form>

          {/* Sublinks */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#6E7C90] border-t border-[#CBD3DD]">
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Default password for demo accounts is: Password123!');
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

      {/* RIGHT PANEL (~60%): Stunning Living Building Architectural Visual Hero */}
      <div className="hidden lg:flex flex-1 bg-[#0B111A] text-[#EEF2F6] flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Background Radial Ambiance */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-[#E8A33D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] bg-[#2E8B63]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Telemetry Header */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#6E7C90] border-b border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B63] animate-pulse" />
            <span className="text-[#EEF2F6] font-bold tracking-wider">CAMPUS TELEMETRY DIGITAL TWIN</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[#E8A33D]">
              TOWERS A & B · 24 UNITS
            </span>
          </div>
        </div>

        {/* Center Main Visual Section */}
        <div className="relative z-10 my-auto py-3 space-y-6 max-w-2xl mx-auto w-full">
          {/* Header Title */}
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-2xl xl:text-3xl font-bold font-sans tracking-tight text-white leading-tight">
              Intelligent building operations. <br />
              <span className="text-[#E8A33D]">Zero defect downtime.</span>
            </h2>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed max-w-lg">
              Real-time architectural telemetry, exponential defect decay risk modeling, and multi-tenant maintenance workflows.
            </p>
          </div>

          {/* VISUAL 1: Interactive Living Building Architectural Elevation Graphic */}
          <div className="relative p-5 bg-slate-950/80 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Elevation SVG Architectural Visualization */}
            <svg
              viewBox="0 0 540 180"
              className="w-full h-36 xl:h-40"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="towerGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <radialGradient id="alertGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sky Backdrop & Grid */}
              <rect x="0" y="0" width="540" height="180" fill="url(#skyGrad)" rx="16" />
              <line x1="20" y1="150" x2="520" y2="150" stroke="#334155" strokeWidth="1.5" />
              <line x1="20" y1="155" x2="520" y2="155" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

              {/* TOWER A (West Wing) */}
              <rect x="40" y="25" width="130" height="125" rx="4" fill="url(#towerGrad)" stroke="#475569" strokeWidth="1.5" />
              <rect x="35" y="20" width="140" height="6" rx="2" fill="#334155" />
              {/* Tower A Floor Windows */}
              {[0, 1, 2, 3].map((floor) => (
                <g key={`A-${floor}`}>
                  {/* Unit 1 */}
                  <rect x="52" y={35 + floor * 27} width="46" height="20" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <circle cx="58" cy={45 + floor * 27} r="2" fill={floor === 0 ? "#f59e0b" : "#38bdf8"} />
                  {/* Unit 2 */}
                  <rect x="110" y={35 + floor * 27} width="46" height="20" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <circle cx="116" cy={45 + floor * 27} r="2" fill={floor === 3 ? "#38bdf8" : "#4ade80"} />
                </g>
              ))}
              <text x="105" y="165" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TOWER A (UNITS 101–402)</text>

              {/* CENTRAL UTILITY CORE (Lifts & Pumps) */}
              <rect x="195" y="10" width="150" height="140" rx="4" fill="#090d16" stroke="#475569" strokeWidth="1.5" />
              <rect x="235" y="4" width="70" height="8" rx="2" fill="#475569" />
              <text x="270" y="20" fill="#e2e8f0" fontSize="8" fontFamily="monospace" textAnchor="middle">CENTRAL UTILITY CORE</text>
              {/* Lift Shaft 1 & 2 */}
              <rect x="210" y="26" width="54" height="114" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <rect x="276" y="26" width="54" height="114" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              {/* Lift B2 (Active Repair with Alert) */}
              <rect x="214" y="60" width="46" height="26" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="237" y="76" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">LIFT B2 ⚠️</text>
              {/* Lift A1 (Operational) */}
              <rect x="280" y="90" width="46" height="26" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1" />
              <text x="303" y="106" fill="#22c55e" fontSize="8" fontFamily="monospace" textAnchor="middle">LIFT A1 ✓</text>
              <text x="270" y="165" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OTIS ELEVATOR AMC</text>

              {/* TOWER B (East Wing) */}
              <rect x="370" y="25" width="130" height="125" rx="4" fill="url(#towerGrad)" stroke="#475569" strokeWidth="1.5" />
              <rect x="365" y="20" width="140" height="6" rx="2" fill="#334155" />
              {/* Tower B Floor Windows */}
              {[0, 1, 2, 3].map((floor) => (
                <g key={`B-${floor}`}>
                  {/* Unit 1 */}
                  <rect
                    x="382"
                    y={35 + floor * 27}
                    width="46"
                    height="20"
                    rx="3"
                    fill={floor === 3 ? "#450a0a" : "#1e293b"}
                    stroke={floor === 3 ? "#ef4444" : "#334155"}
                    strokeWidth={floor === 3 ? 1.5 : 1}
                  />
                  <circle cx="388" cy={45 + floor * 27} r="2" fill={floor === 3 ? "#ef4444" : "#4ade80"} />
                  {/* Unit 2 */}
                  <rect x="440" y={35 + floor * 27} width="46" height="20" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <circle cx="446" cy={45 + floor * 27} r="2" fill="#38bdf8" />
                </g>
              ))}
              <text x="435" y="165" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TOWER B (UNITS 101–402)</text>

              {/* Floating Alert Badges */}
              <g transform="translate(365, 118)">
                <circle cx="0" cy="0" r="10" fill="url(#alertGlow)" />
                <rect x="-8" y="-7" width="46" height="14" rx="7" fill="#ef4444" />
                <text x="15" y="3" fill="#ffffff" fontSize="7" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">RISK 4.2</text>
              </g>
            </svg>

            {/* Live Campus Sensor Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-[10px] font-mono text-[#E8A33D]">
              <Activity className="w-3 h-3 animate-spin" />
              <span>LIVE SENSOR FEED</span>
            </div>
          </div>

          {/* VISUAL 2: Four Curved Circular Feature Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="group relative p-4 bg-slate-900/80 border border-slate-800/90 rounded-2xl hover:border-[#E8A33D]/60 hover:bg-slate-900 transition-all duration-300 shadow-md flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-700/80 flex items-center justify-center text-[#E8A33D] shrink-0 group-hover:scale-110 group-hover:border-[#E8A33D] group-hover:shadow-[0_0_12px_rgba(232,163,61,0.35)] transition-all duration-300">
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold font-sans text-white group-hover:text-[#E8A33D] transition-colors truncate">
                        {feat.title}
                      </h3>
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 ml-1">
                        0{idx + 1}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-tight">
                      {feat.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Live Metric Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl space-y-0.5 text-center">
              <div className="text-[9px] font-mono text-[#6E7C90] uppercase">
                Facility Uptime
              </div>
              <div className="text-base font-mono font-bold text-[#2E8B63]">
                99.4%
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl space-y-0.5 text-center">
              <div className="text-[9px] font-mono text-[#6E7C90] uppercase">
                Active Telemetry
              </div>
              <div className="text-base font-mono font-bold text-white">
                24 Units
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl space-y-0.5 text-center">
              <div className="text-[9px] font-mono text-[#6E7C90] uppercase">
                Avg SLA Speed
              </div>
              <div className="text-base font-mono font-bold text-[#E8A33D]">
                &lt; 2.4 hrs
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#6E7C90] border-t border-slate-800/80 pt-3">
          <span>GREENWOOD HEIGHTS CO-OPERATIVE HOUSING SOCIETY</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </div>
  );
};
