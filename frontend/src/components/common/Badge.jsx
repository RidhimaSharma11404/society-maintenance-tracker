import React from 'react';

export const StatusBadge = ({ status }) => {
  const statusStyles = {
    Open: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-600'
    },
    'In Progress': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500 animate-pulse'
    },
    Resolved: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-600'
    },
    Closed: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-500'
    }
  };

  const style = statusStyles[status] || statusStyles.Open;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{status}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const priorityStyles = {
    Low: 'bg-slate-100 text-slate-600 border-slate-200',
    Medium: 'bg-blue-50 text-blue-700 border-blue-200',
    High: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
    Critical: 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
  };

  const style = priorityStyles[priority] || priorityStyles.Medium;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${style}`}
    >
      {priority}
    </span>
  );
};

export const RiskBadge = ({ level, score }) => {
  const riskStyles = {
    Clear: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Elevated: 'bg-blue-50 text-blue-700 border-blue-200',
    High: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
    Critical: 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
  };

  const style = riskStyles[level] || riskStyles.Clear;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${style}`}
    >
      <span>{level || 'Nominal'}</span>
      {score !== undefined && (
        <span className="font-mono text-[10px] opacity-80">({score}p)</span>
      )}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] uppercase font-bold border border-slate-200 bg-slate-50 text-slate-700">
      {role}
    </span>
  );
};
