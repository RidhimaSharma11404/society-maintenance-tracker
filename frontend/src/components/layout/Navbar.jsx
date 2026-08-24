import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Search,
  Plus,
  Bot,
  LogOut
} from 'lucide-react';

export const Navbar = ({ onOpenAssistant, onOpenCreateTicket, searchQuery, setSearchQuery, onNavigateTab, onLogout, onGoToLogin }) => {
  const { user, logout, switchDemoRole } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#16233D] flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider">
          GH
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
              Greenwood Heights
            </h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-[#CBD3DD] text-[#16233D] bg-[#F7F9FB]">
              Operations Console
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans hidden sm:block">
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
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick New Request Button */}
        <button
          onClick={onOpenCreateTicket}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>New Request</span>
        </button>

        {/* Quick AI Help */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">AI Help Desk</span>
        </button>

        {/* Segmented Role Switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <span className="text-[11px] font-medium text-slate-500 px-2 select-none">
            Role:
          </span>
          <div className="flex items-center gap-0.5">
            {['admin', 'staff', 'resident'].map((r) => {
              const isActive = user?.role === r;
              return (
                <button
                  key={r}
                  onClick={() => switchDemoRole(r)}
                  className={`px-2.5 py-0.5 rounded-md text-xs capitalize font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Identity Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-xs">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name}
            </div>
            <div className="text-[11px] text-slate-500">{user?.unitNumber}</div>
          </div>

          <button
            onClick={onLogout || logout}
            title="Log Out / Switch Account"
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
