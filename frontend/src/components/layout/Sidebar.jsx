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
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-3.5 flex-shrink-0 font-sans">
      <div className="space-y-4">
        {/* Navigation List */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {role === 'resident' ? 'Resident Menu' : 'Operations Menu'}
          </p>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Society Emergency Helplines Card */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            Society Helplines
          </span>
          <span className="text-emerald-700 text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200 font-semibold">
            24x7
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Gate Security: <strong className="text-slate-700">Ext 101</strong> · Manager: <strong className="text-slate-700">Ext 102</strong>
        </p>
      </div>
    </aside>
  );
};
