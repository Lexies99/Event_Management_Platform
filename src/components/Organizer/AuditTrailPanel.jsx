import React, { useMemo, useState } from 'react';
import { Activity, Download, Search, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';

const ACTION_CATEGORIES = [
  { id: 'ALL', label: 'All Activity' },
  { id: 'CHECKIN', label: 'Check-Ins & Scans' },
  { id: 'BADGE', label: 'Badge Prints' },
  { id: 'REGISTRATION', label: 'Registrations' },
  { id: 'STAFF', label: 'Staff & Logins' },
  { id: 'ADMIN', label: 'Branding & Admin' },
];

function classifyAction(action = '') {
  const a = action.toUpperCase();
  if (a.includes('CHECKIN') || a.includes('OFFLINE')) return 'CHECKIN';
  if (a.includes('BADGE')) return 'BADGE';
  if (a.includes('REGISTRATION')) return 'REGISTRATION';
  if (a.includes('STAFF') || a.includes('LOGIN')) return 'STAFF';
  return 'ADMIN';
}

export default function AuditTrailPanel({
  logs = [],
  title = 'Security & Operations Audit Trail',
  subtitle = 'Tamper-evident Ghana Act 843 compliance log of every check-in, scan attempt, badge print, registration, and admin change.',
  compact = false,
  tenantName = 'Event',
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      const catMatch = category === 'ALL' || classifyAction(log.action) === category;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        (log.user || '').toLowerCase().includes(q) ||
        (log.action || '').toLowerCase().includes(q) ||
        (log.target || '').toLowerCase().includes(q)
      );
    });
  }, [logs, search, category]);

  const handleExportAuditCsv = () => {
    if (filtered.length === 0) return;
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Severity', 'Details', 'IP'];
    const rows = filtered.map((l) => [
      l.timestamp || '',
      `"${(l.user || '').replace(/"/g, '""')}"`,
      l.role || 'system',
      l.action || '',
      l.severity || 'info',
      `"${(l.target || '').replace(/"/g, '""')}"`,
      l.ip || '127.0.0.1',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tenantName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_audit_trail.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const renderSeverityIcon = (log) => {
    const sev = log.severity || (log.action?.includes('FAILED') ? 'error' : log.action?.includes('DENIED') || log.action?.includes('DUPLICATE') ? 'warning' : log.action?.includes('RECORDED') || log.action?.includes('CREATED') ? 'success' : 'info');
    if (sev === 'error') return <XCircle className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fp-red)' }} />;
    if (sev === 'warning') return <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fp-amber)' }} />;
    if (sev === 'success') return <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fp-green)' }} />;
    return <Info className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fp-olive)' }} />;
  };

  return (
    <div className="fp-card p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold m-0 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: 'var(--fp-olive)' }} />
            <span>{title}</span>
            <span className="fp-tag-sage text-[11px]">{filtered.length}</span>
          </h3>
          {!compact && (
            <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleExportAuditCsv}
          disabled={filtered.length === 0}
          className="btn-fp-outline px-3.5 py-2 text-xs inline-flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by actor, ticket code, action, or details..."
            className="fp-input w-full pl-9 pr-3 py-2 text-xs sm:text-sm"
          />
        </div>

        <div className="fp-subnav">
          {ACTION_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`fp-subnav-pill text-xs py-1.5 px-3 ${category === c.id ? 'active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Compact Feed */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-xs sm:text-sm rounded-xl border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          <Activity className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
          No audit events match this filter yet.
        </div>
      ) : compact ? (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filtered.slice(0, 20).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border flex items-start justify-between gap-3 text-xs"
              style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5">{renderSeverityIcon(log)}</div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold">{log.user}</span>
                    <code className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'var(--fp-sage)', color: 'var(--fp-sage-text)' }}>
                      {log.action}
                    </code>
                  </div>
                  <p className="m-0 mt-0.5 break-words" style={{ color: 'var(--text-sub)' }}>{log.target}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
          <table className="fp-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target / Event Detail</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 80).map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold" style={{ background: 'var(--fp-sage)', color: 'var(--fp-sage-text)' }}>
                      {renderSeverityIcon(log)}
                      <span>{log.action}</span>
                    </span>
                  </td>
                  <td className="text-xs sm:text-sm min-w-[220px]">
                    {log.target}
                  </td>
                  <td className="font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                    {log.ip || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
