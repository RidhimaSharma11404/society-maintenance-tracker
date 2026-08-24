import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  Wrench,
  Flame,
  BellRing,
  Sliders,
  MailCheck,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const role = user?.role || 'resident';

  // Role-based navigation item configuration
  const allNavItems = [
    {
      id: 'dashboard',
      label: role === 'resident' ? 'Dashboard Overview' : 'Operations Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'staff', 'resident']
    },
    {
      id: 'complaints',
      label: role === 'resident' ? 'My Complaints & Requests' : 'Work Orders & Tickets',
      icon: ClipboardList,
      roles: ['admin', 'staff', 'resident']
    },
    {
      id: 'billing',
      label: role === 'resident' ? 'Maintenance Dues & Ledger' : 'Maintenance Ledger',
      icon: CreditCard,
      roles: ['admin', 'staff', 'resident']
    },
    {
      id: 'technicians',
      label: 'Vendors & Contractors',
      icon: Wrench,
      roles: ['admin', 'staff']
    },
    {
      id: 'risk-analytics',
      label: 'Defect Risk Analytics',
      icon: Flame,
      roles: ['admin', 'staff']
    },
    {
      id: 'ai-copilot',
      label: 'AI Operations Copilot',
      icon: Sparkles,
      badge: 'Pro',
      roles: ['admin', 'staff']
    },
    {
      id: 'notices',
      label: role === 'resident' ? 'Society Notices & Circulars' : 'Society Bulletins',
      icon: BellRing,
      roles: ['admin', 'staff', 'resident']
    },
    {
      id: 'settings',
      label: 'Response Time Settings',
      icon: Sliders,
      roles: ['admin']
    },
    {
      id: 'outbox',
      label: 'Notification History',
      icon: MailCheck,
      roles: ['admin', 'staff']
    }
  ];

  const visibleNavItems = allNavItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0A101D]/90 backdrop-blur-xl flex flex-col justify-between p-3.5 flex-shrink-0 font-sans text-slate-300">
      <div className="space-y-4">
        {/* Navigation List */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
            {role === 'resident' ? 'RESIDENT PORTAL' : 'OPERATIONS WORKSPACE'}
          </p>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'technicians' && activeTab === 'dispatch') ||
              (item.id === 'risk-analytics' && activeTab === 'analytics') ||
              (item.id === 'ai-copilot' && activeTab === 'copilot');

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Society Emergency Contact Box */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3 space-y-1 text-[11px] shadow-sm">
        <div className="flex items-center justify-between text-slate-300 font-bold">
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            Society Helplines
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
            24x7
          </span>
        </div>
        <p className="text-slate-500 text-[10px]">
          Gate Security: <span className="font-mono text-slate-300 font-bold">Ext 101</span> · Manager:{' '}
          <span className="font-mono text-slate-300 font-bold">Ext 102</span>
        </p>
      </div>
    </aside>
  );
};
