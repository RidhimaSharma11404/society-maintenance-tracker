import React, { useState, useEffect } from 'react';
import {
  Building2,
  Bot,
  Sparkles,
  Flame,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Layers,
  Trees,
  Compass,
  Play,
  RotateCcw
} from 'lucide-react';

const CAMPUS_ZONES = [
  {
    id: 'Tower A',
    name: 'Tower A — North Residential Wing',
    floors: '4 Floors · 16 Flats (Units 101–404)',
    riskScore: 6.94,
    riskLevel: 'High',
    statusText: '1 Active Electrical Defect (Unit 402)',
    agentDialogue:
      'Here is Tower A (North Wing). Flat 402 currently has an active electrical short circuit ticket with 18 hours remaining on SLA. Would you like to log a ticket for another unit here?',
    recommendedUnit: 'Tower A - 402',
    accentColor: '#d97706',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    type: 'residential',
    svgCoords: { x: 120, y: 110, w: 190, h: 140 }
  },
  {
    id: 'Tower B',
    name: 'Tower B — South Residential Wing',
    floors: '4 Floors · 16 Flats (Units 101–404)',
    riskScore: 13.23,
    riskLevel: 'Critical',
    statusText: 'Critical Defect Cluster: Riser Leakage at Flat 101 (4x recurring)',
    agentDialogue:
      'We are at Tower B (South Wing). Our exponential decay engine has flagged Flat 101 as a Critical Risk Cluster due to repeated main riser seepage. Contractor dispatch recommended.',
    recommendedUnit: 'Tower B - 101',
    accentColor: '#dc2626',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    type: 'residential',
    svgCoords: { x: 120, y: 320, w: 190, h: 140 }
  },
  {
    id: 'Tower C',
    name: 'Tower C — East Residential Wing',
    floors: '4 Floors · 16 Flats (Units 101–404)',
    riskScore: 0.0,
    riskLevel: 'Clear',
    statusText: '100% Operational · No Reported Defects',
    agentDialogue:
      'Tower C (East Wing) is currently in optimal health with zero reported complaints in the past 90 days. All risers and electrical mains are nominal.',
    recommendedUnit: 'Tower C - 101',
    accentColor: '#059669',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    type: 'residential',
    svgCoords: { x: 650, y: 110, w: 190, h: 140 }
  },
  {
    id: 'Clubhouse',
    name: 'Clubhouse, Gym & Swimming Pool',
    floors: '2 Floors · Community Amenities',
    riskScore: 4.77,
    riskLevel: 'Elevated',
    statusText: 'Elevator Maintenance Service Overdue',
    agentDialogue:
      'This is the Community Clubhouse & Pool area. The lift elevator inspection has exceeded its SLA window. You can report clubhouse or amenity issues here.',
    recommendedUnit: 'Clubhouse',
    accentColor: '#2563eb',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    type: 'amenity',
    svgCoords: { x: 400, y: 190, w: 180, h: 150 }
  },
  {
    id: 'Utility Complex',
    name: 'Central Water Pump & Power Station',
    floors: '1 Floor · Critical Infrastructure',
    riskScore: 0.0,
    riskLevel: 'Clear',
    statusText: 'Dual 15HP Submersible Pumps & 125kVA Generator Online',
    agentDialogue:
      'This is the Central Pump House & Generator Station. All society water delivery shafts and backup diesel power are running smoothly.',
    recommendedUnit: 'Utility Complex',
    accentColor: '#475569',
    badgeClass: 'bg-slate-100 text-slate-900 border-slate-300',
    type: 'utility',
    svgCoords: { x: 650, y: 320, w: 190, h: 140 }
  }
];

export const SocietyRealisticCampusTour = ({ onOpenCreateTicket, userUnit }) => {
  const [activeZoneIndex, setActiveZoneIndex] = useState(1); // Default Tower B
  const [isTourPlaying, setIsTourPlaying] = useState(false);

  const activeZone = CAMPUS_ZONES[activeZoneIndex];

  // Auto-tour step timer
  useEffect(() => {
    let timer;
    if (isTourPlaying) {
      timer = setInterval(() => {
        setActiveZoneIndex((prev) => (prev + 1) % CAMPUS_ZONES.length);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isTourPlaying]);

  const handleSelectZone = (index) => {
    setActiveZoneIndex(index);
    setIsTourPlaying(false);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl text-white space-y-5 overflow-hidden relative">
      {/* Subtle Ambient Radial Lights */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              Greenwood Heights — Society Master Campus Map
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-400/30">
                LIVE DIGITAL TWIN
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 3D architectural layout with real-time risk telemetry & AI concierge guidance
            </p>
          </div>
        </div>

        {/* Guided Tour Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTourPlaying(!isTourPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              isTourPlaying
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isTourPlaying ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Touring Campus ({activeZoneIndex + 1}/{CAMPUS_ZONES.length})</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-blue-400" />
                <span>Start AI Tour</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenCreateTicket(activeZone.recommendedUnit || userUnit)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise Complaint</span>
          </button>
        </div>
      </div>

      {/* Realistic Society Architectural Canvas (SVG 3D Isometric View) */}
      <div className="relative z-10 w-full h-[360px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-xl border border-slate-800 overflow-hidden select-none">
        <svg
          viewBox="0 0 960 520"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="poolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glowAlert" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#dc2626" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background Estate Landscape */}
          <rect width="960" height="520" fill="url(#grassGrad)" />

          {/* Outer Perimeter Walkway / Road */}
          <path
            d="M 50 60 L 910 60 L 910 470 L 50 470 Z"
            fill="none"
            stroke="url(#roadGrad)"
            strokeWidth="38"
            strokeLinejoin="round"
          />
          <path
            d="M 50 60 L 910 60 L 910 470 L 50 470 Z"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          {/* Central Connecting Roadway */}
          <path
            d="M 480 60 L 480 470"
            fill="none"
            stroke="url(#roadGrad)"
            strokeWidth="32"
          />

          {/* Security Gate & Main Entrance */}
          <g transform="translate(435, 460)">
            <rect width="90" height="35" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            <text x="45" y="22" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">
              MAIN ENTRANCE
            </text>
          </g>

          {/* Landscaped Garden Trees */}
          {[
            { x: 330, y: 90 },
            { x: 340, y: 390 },
            { x: 610, y: 90 },
            { x: 610, y: 400 },
            { x: 90, y: 260 },
            { x: 860, y: 260 }
          ].map((tree, i) => (
            <g key={i} transform={`translate(${tree.x}, ${tree.y})`}>
              <circle r="14" fill="#047857" opacity="0.6" />
              <circle r="10" fill="#10b981" opacity="0.8" />
              <circle r="4" fill="#34d399" />
            </g>
          ))}

          {/* ================= BUILDINGS ================= */}

          {/* 1. Tower A (North Wing) */}
          <g
            onClick={() => handleSelectZone(0)}
            className="cursor-pointer transition-transform duration-200 hover:opacity-95"
          >
            <rect
              x="110"
              y="90"
              width="200"
              height="150"
              rx="12"
              fill="#0f172a"
              stroke={activeZoneIndex === 0 ? '#3b82f6' : '#334155'}
              strokeWidth={activeZoneIndex === 0 ? '4' : '2'}
            />
            {/* Building Roof / Windows */}
            <rect x="125" y="105" width="170" height="40" rx="6" fill="#1e293b" />
            <text x="210" y="130" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
              🏢 TOWER A (NORTH)
            </text>
            <text x="210" y="170" textAnchor="middle" fill="#cbd5e1" fontSize="11">
              4 Floors · 16 Units
            </text>

            {/* Risk Badge */}
            <rect x="135" y="195" width="150" height="26" rx="6" fill="#d97706" fillOpacity="0.2" stroke="#d97706" />
            <text x="210" y="212" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
              ⚡ High Risk: 6.94 pts
            </text>
          </g>

          {/* 2. Tower B (South Wing - Critical Cluster) */}
          <g
            onClick={() => handleSelectZone(1)}
            className="cursor-pointer transition-transform duration-200 hover:opacity-95"
            filter="url(#glowAlert)"
          >
            <rect
              x="110"
              y="290"
              width="200"
              height="150"
              rx="12"
              fill="#0f172a"
              stroke={activeZoneIndex === 1 ? '#ef4444' : '#b91c1c'}
              strokeWidth={activeZoneIndex === 1 ? '4' : '2'}
            />
            <rect x="125" y="305" width="170" height="40" rx="6" fill="#1e293b" />
            <text x="210" y="330" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
              🏢 TOWER B (SOUTH)
            </text>
            <text x="210" y="370" textAnchor="middle" fill="#fca5a5" fontSize="11">
              4 Floors · 16 Units
            </text>

            {/* Pulsing Critical Cluster Pill */}
            <rect x="135" y="395" width="150" height="26" rx="6" fill="#dc2626" />
            <text x="210" y="412" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="extrabold">
              🚨 CRITICAL: 13.23 pts (Flat 101)
            </text>
          </g>

          {/* 3. Clubhouse & Swimming Pool (Center) */}
          <g
            onClick={() => handleSelectZone(3)}
            className="cursor-pointer transition-transform duration-200 hover:opacity-95"
          >
            {/* Swimming Pool */}
            <rect x="390" y="110" width="180" height="80" rx="10" fill="url(#poolGrad)" stroke="#38bdf8" strokeWidth="2" />
            <text x="480" y="155" textAnchor="middle" fill="#e0f2fe" fontSize="12" fontWeight="bold">
              🏊 RESIDENT POOL
            </text>

            {/* Clubhouse Building */}
            <rect
              x="390"
              y="210"
              width="180"
              height="150"
              rx="12"
              fill="#0f172a"
              stroke={activeZoneIndex === 3 ? '#3b82f6' : '#334155'}
              strokeWidth={activeZoneIndex === 3 ? '4' : '2'}
            />
            <rect x="405" y="225" width="150" height="40" rx="6" fill="#1e293b" />
            <text x="480" y="250" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
              🏛️ CLUBHOUSE & GYM
            </text>
            <text x="480" y="295" textAnchor="middle" fill="#93c5fd" fontSize="11">
              Elevator & Amenities
            </text>
            <rect x="410" y="320" width="140" height="24" rx="6" fill="#1d4ed8" fillOpacity="0.3" stroke="#3b82f6" />
            <text x="480" y="336" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">
              Elevated: 4.77 pts
            </text>
          </g>

          {/* 4. Tower C (East Wing) */}
          <g
            onClick={() => handleSelectZone(2)}
            className="cursor-pointer transition-transform duration-200 hover:opacity-95"
          >
            <rect
              x="650"
              y="90"
              width="200"
              height="150"
              rx="12"
              fill="#0f172a"
              stroke={activeZoneIndex === 2 ? '#10b981' : '#334155'}
              strokeWidth={activeZoneIndex === 2 ? '4' : '2'}
            />
            <rect x="665" y="105" width="170" height="40" rx="6" fill="#1e293b" />
            <text x="750" y="130" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
              🏢 TOWER C (EAST)
            </text>
            <text x="750" y="170" textAnchor="middle" fill="#a7f3d0" fontSize="11">
              4 Floors · 16 Units
            </text>

            <rect x="675" y="195" width="150" height="26" rx="6" fill="#059669" fillOpacity="0.3" stroke="#10b981" />
            <text x="750" y="212" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold">
              ✓ 100% Clear & Nominal
            </text>
          </g>

          {/* 5. Utility Station (East South) */}
          <g
            onClick={() => handleSelectZone(4)}
            className="cursor-pointer transition-transform duration-200 hover:opacity-95"
          >
            <rect
              x="650"
              y="290"
              width="200"
              height="150"
              rx="12"
              fill="#0f172a"
              stroke={activeZoneIndex === 4 ? '#3b82f6' : '#334155'}
              strokeWidth={activeZoneIndex === 4 ? '4' : '2'}
            />
            <rect x="665" y="305" width="170" height="40" rx="6" fill="#1e293b" />
            <text x="750" y="330" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
              ⚙️ PUMP & GENERATOR
            </text>
            <text x="750" y="370" textAnchor="middle" fill="#cbd5e1" fontSize="11">
              Dual 15HP Submersible
            </text>
            <rect x="675" y="395" width="150" height="26" rx="6" fill="#475569" fillOpacity="0.4" stroke="#64748b" />
            <text x="750" y="412" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">
              Active Utility Riser
            </text>
          </g>
        </svg>

        {/* Floating Active Zone Highlight Card (Top Overlay) */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg">
          <MapPin className="w-4 h-4 text-blue-400 animate-bounce" />
          <span>Focused Zone: <strong className="text-white">{activeZone.name}</strong></span>
        </div>
      </div>

      {/* Interactive AI Concierge Navigator Dock */}
      <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        {/* Agent Avatar & Speech Bubble */}
        <div className="flex items-start gap-3.5 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-blue-500/25 mt-0.5">
            <Bot className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                Greenwood AI Concierge Guide
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{activeZone.agentDialogue}"
            </p>
          </div>
        </div>

        {/* Direct Action Button to Register Complaint in Selected Zone */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => onOpenCreateTicket(activeZone.recommendedUnit)}
            className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Register Complaint in {activeZone.id}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Zone Selector Pills */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Quick Jump:
        </span>
        {CAMPUS_ZONES.map((zone, idx) => (
          <button
            key={zone.id}
            onClick={() => handleSelectZone(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeZoneIndex === idx
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {zone.id}
          </button>
        ))}
      </div>
    </div>
  );
};
