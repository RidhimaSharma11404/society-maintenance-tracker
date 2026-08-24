import React from 'react';

export const SchematicPanel = ({
  children,
  className = '',
  header,
  headerRight,
  headerSub,
  badge,
  noPadding = false
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden ${className}`}>
      {header && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {header}
              </h3>
              {badge && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 bg-white">
                  {badge}
                </span>
              )}
            </div>
            {headerSub && (
              <p className="text-xs text-slate-500 mt-0.5">{headerSub}</p>
            )}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};
