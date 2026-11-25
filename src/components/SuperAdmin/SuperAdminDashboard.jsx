import React, { useState } from 'react';
import {
  Building2,
  Plus,
  ShieldCheck,
  Users,
  CreditCard,
  CheckCircle,
  Copy,
  Activity,
  Lock,
  Search,
  ArrowRight,
  PieChart as PieIcon,
  Check,
  ExternalLink,
} from 'lucide-react';
import TenantLogo from '../Common/TenantLogo';
import { DonutChart, BarGraph } from '../Common/Charts';
import AuditTrailPanel from '../Organizer/AuditTrailPanel';

export default function SuperAdminDashboard({
  tenants = [],
  onOpenEventSite,
  onNavigateToOnboard,
  onToggleTenantStatus,
  plans = [],
  auditLogs = [],
  allRegistrations = [],
}) {
  const [activeTab, setActiveTab] = useState('tenants');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === 'active').length;
  const totalRegistrations = allRegistrations.length;
  const totalAttended = allRegistrations.filter((r) => r.status === 'attended').length;
  const estimatedRevenue = tenants.reduce((acc, t) => {
    const plan = plans.find((p) => p.id === t.planId);
    return acc + (plan?.price || 199);
  }, 0);

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.organizer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyTenantLink = (slug, id) => {
    navigator.clipboard.writeText(`${window.location.origin}/#/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tierData = plans.map((p, idx) => ({
    label: `${p.name}`,
    value: tenants.filter((t) => t.planId === p.id).length,
    color: ['#5A6552', '#3B7A57', '#9CAF88'][idx % 3],
  }));

  const tenantBarData = tenants.slice(0, 6).map((t) => ({
    label: (t.shortName || t.name).split(' ')[0],
    value: allRegistrations.filter((r) => r.tenantId === t.id).length,
    unit: 'delegates',
  }));

  return (
    <div className="space-y-6">
      <div className="fp-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="fp-tag-sage mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Operator Control Plane
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold m-0">Multi-Tenant Event Platform Fleet</h1>
          <p className="text-xs sm:text-sm mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
            Manage all dedicated event websites, subscription plans, and platform-wide audit logs.
          </p>
        </div>
        <button type="button" onClick={onNavigateToOnboard} className="btn-fp-olive px-4 py-2.5 text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          <span>New Event Website</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="fp-card p-4">
          <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Event Websites</div>
          <div className="text-2xl font-extrabold mt-1">{totalTenants} <span className="text-xs font-semibold" style={{ color: 'var(--fp-green)' }}>({activeTenants} live)</span></div>
        </div>
        <div className="fp-card p-4">
          <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Total Registrants</div>
          <div className="text-2xl font-extrabold mt-1">{totalRegistrations}</div>
        </div>
        <div className="fp-card p-4">
          <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Verified Check-Ins</div>
          <div className="text-2xl font-extrabold mt-1" style={{ color: 'var(--fp-green)' }}>{totalAttended}</div>
        </div>
        <div className="fp-card p-4">
          <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Estimated MRR</div>
          <div className="text-2xl font-extrabold mt-1">${estimatedRevenue}</div>
        </div>
      </div>

      {/* Sub-Nav Tabs */}
      <div className="fp-subnav">
        {[
          { id: 'tenants', label: `Event Workspaces (${tenants.length})`, icon: Building2 },
          { id: 'analytics', label: 'Fleet Analytics', icon: PieIcon },
          { id: 'plans', label: 'Plans & Tiers', icon: CreditCard },
          { id: 'audit', label: `Global Audit Trail (${auditLogs.length})`, icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`fp-subnav-pill ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tenants Grid */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search organizations or slugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fp-input w-full pl-9 pr-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map((t) => {
              const plan = plans.find((p) => p.id === t.planId) || plans[0];
              const tRegs = allRegistrations.filter((r) => r.tenantId === t.id);
              const tAtt = tRegs.filter((r) => r.status === 'attended').length;
              return (
                <div key={t.id} className="fp-card p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <TenantLogo tenant={t} size={44} className="rounded-xl" />
                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate">{t.name}</div>
                          <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>/{t.slug}</div>
                        </div>
                      </div>
                      <span className={t.status === 'active' ? 'fp-tag-sage text-[10px]' : 'fp-tag-olive text-[10px]'}>
                        {t.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border text-xs space-y-1" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                      <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Organizer:</span><strong>{t.organizer?.name}</strong></div>
                      <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Plan:</span><span className="font-semibold">{plan?.name} (${plan?.price})</span></div>
                      <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Turnout:</span><strong>{tAtt} / {tRegs.length}</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <button type="button" onClick={() => copyTenantLink(t.slug, t.id)} className="btn-fp-outline px-2.5 py-1.5 text-xs inline-flex items-center gap-1">
                      {copiedId === t.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === t.id ? 'Copied' : 'URL'}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => onToggleTenantStatus(t.id)} className="btn-fp-outline p-1.5" title="Toggle Active/Suspended">
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => onOpenEventSite(t.slug, 'organizer')} className="btn-fp-olive px-3 py-1.5 text-xs inline-flex items-center gap-1">
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="fp-card p-5 space-y-4">
            <h3 className="text-base font-bold m-0">Subscription Plan Mix</h3>
            <DonutChart data={tierData} title="Plans" centerLabel="Tenants" />
          </div>
          <div className="fp-card p-5 space-y-4">
            <h3 className="text-base font-bold m-0">Registrations by Event Website</h3>
            <BarGraph data={tenantBarData} height={160} />
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div key={p.id} className="fp-card p-5 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold m-0">{p.name}</h3>
                <div className="text-3xl font-extrabold mt-2">${p.price}<span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/{p.billingPeriod}</span></div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                <ul className="space-y-2 mt-4 p-0 list-none text-xs">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--fp-green)' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button type="button" onClick={onNavigateToOnboard} className="btn-fp-sage w-full py-2 text-xs">
                Provision on {p.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audit' && (
        <AuditTrailPanel
          logs={auditLogs}
          title="Platform-Wide Security Audit Trail"
          tenantName="EventPlan_Platform"
        />
      )}
    </div>
  );
}
