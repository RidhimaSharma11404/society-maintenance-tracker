import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Search,
  Plus,
  Bot,
  LogOut,
  Shield,
  Wrench,
  Home,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ onOpenAssistant, onOpenCreateTicket, searchQuery, setSearchQuery, onNavigateTab, onLogout, onGoToLogin }) => {
  const { user, logout, switchDemoRole } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0A101D]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between text-slate-100 shadow-lg">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider shadow-[0_0_16px_rgba(6,182,212,0.45)]">
          GH
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-tight font-sans">
              Greenwood Heights
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-950/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
            Facility Maintenance & Risk Management System
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search complaints, flat / unit (e.g. Tower B - 101), or categories..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick New Request Button */}
        <button
          onClick={onOpenCreateTicket}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>New Request</span>
        </button>

        {/* Quick AI Help */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-xl text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.15)]"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">AI Help Desk</span>
        </button>

        {/* CareSync-style DEMO ROLE SWITCHER PILL BAR */}
        <div className="hidden lg:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 select-none flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>DEMO:</span>
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: 'admin', label: 'Admin', icon: Shield },
              { id: 'staff', label: 'Staff', icon: Wrench },
              { id: 'resident', label: 'Resident', icon: Home }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = user?.role === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => switchDemoRole(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)] border border-blue-400/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Identity Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-md border border-cyan-400/30">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white leading-tight">
              {user?.name}
            </div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{user?.role} · {user?.unitNumber}</div>
          </div>

          <button
            onClick={onLogout || logout}
            title="Log Out & Return to Login Screen"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
