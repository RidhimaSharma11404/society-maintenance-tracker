import React from 'react';

export const StatCard = ({ title, value, subtitle, color = 'blue', trend, isStatusPill = false }) => {
  const accentColor = {
    blue: 'text-blue-700',
    rose: 'text-rose-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700'
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          {title}
        </span>

        {isStatusPill ? (
          <div className="mt-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {value}
            </span>
          </div>
        ) : (
          <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${accentColor[color] || 'text-slate-900'}`}>
            {value}
          </div>
        )}

        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      {trend && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">{trend.label}</span>
          {trend.positive ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {trend.value}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
