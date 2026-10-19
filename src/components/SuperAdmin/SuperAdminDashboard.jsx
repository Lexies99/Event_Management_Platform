import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  ExternalLink, 
  FileText, 
  Activity, 
  Lock, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import NewTenantModal from './NewTenantModal';

export default function SuperAdminDashboard({
  tenants,
  activeTenant,
  onSelectTenant,
  onAddTenant,
  onToggleTenantStatus,
  plans,
  auditLogs,
  allRegistrations,
  allEvents
}) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tenants'); // 'tenants' | 'plans' | 'audit'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Platform calculations
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const totalRegistrations = allRegistrations.length;
  const totalAttended = allRegistrations.filter(r => r.status === 'attended').length;
  const estimatedRevenue = tenants.reduce((acc, t) => {
    const plan = plans.find(p => p.id === t.planId);
    return acc + (plan?.price || 199);
  }, 0);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyTenantLink = (slug, id) => {
    const link = `${window.location.origin}/?tenant=${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Operator Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Operator Control Plane (Super-Admin)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Multi-Tenant Event Platform Fleet
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Rent, onboard and manage corporate tenants with strict row-level security isolation, custom branding, and metered subscription plans.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Company Workspace</span>
          </button>
        </div>
      </div>

      {/* Headline KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rented Workspaces</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{totalTenants}</span>
            <span className="text-xs text-emerald-400 font-medium">({activeTenants} active)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full" 
              style={{ width: `${(activeTenants / (totalTenants || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Platform Registrants</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{totalRegistrations}</span>
            <span className="text-xs text-slate-400">across events</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Capacity utilization: <span className="text-cyan-300 font-semibold">{totalRegistrations} registered</span>
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Verified Check-ins</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{totalAttended}</span>
            <span className="text-xs text-emerald-400 font-medium">
              {totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0}% rate
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Printed badges produced on-site
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Estimated MRR / Billing</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">${estimatedRevenue}</span>
            <span className="text-xs text-amber-400 font-medium">USD</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Tiered usage & rental revenue
          </p>
        </div>
      </div>

      {/* Tabs Switcher: Tenants | Subscription Plans | Audit Trail */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'tenants'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tenant Companies ({tenants.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'plans'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Subscription Plans & Tiers</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Security & Audit Trail</span>
        </button>
      </div>

      {/* TAB 1: TENANT LIST */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search company, slug, organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-400 self-end sm:self-auto">
              Showing {filteredTenants.length} of {tenants.length} workspaces
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTenants.map((t) => {
              const plan = plans.find(p => p.id === t.planId) || plans[0];
              const tenantRegs = allRegistrations.filter(r => r.tenantId === t.id);
              const tenantAttended = tenantRegs.filter(r => r.status === 'attended').length;
              const isCurrent = activeTenant?.id === t.id;

              return (
                <div
                  key={t.id}
                  className={`glass-panel rounded-2xl p-5 flex flex-col justify-between transition-all border ${
                    isCurrent ? 'ring-2 ring-indigo-500 border-indigo-500/50' : 'hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Header: Logo, Name, Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.logoUrl}
                          alt={t.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800"
                        />
                        <div>
                          <h3 className="font-bold text-white text-base leading-snug">{t.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full inline-block" 
                              style={{ backgroundColor: t.brandColor }} 
                              title={`Brand: ${t.brandColor}`}
                            />
                            <span className="text-xs font-mono text-slate-400">/{t.slug}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        t.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    {/* Organizer details */}
                    <div className="bg-slate-800/60 rounded-xl p-3 text-xs space-y-1 mb-4 border border-slate-700/50">
                      <div className="flex justify-between text-slate-400">
                        <span>Event Organizer:</span>
                        <span className="font-semibold text-slate-200">{t.organizer.name}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Contact:</span>
                        <span className="text-slate-300 truncate max-w-[150px]">{t.organizer.email}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-700/40">
                        <span>Plan Tier:</span>
                        <span className="font-bold text-indigo-400 capitalize">{plan.name} (${plan.price}/{plan.billingPeriod})</span>
                      </div>
                    </div>

                    {/* Usage Bars */}
                    <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Registrations & Check-ins:</span>
                        <span className="text-slate-200 font-semibold">{tenantAttended} / {tenantRegs.length} attended</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-emerald-500 h-full" 
                          style={{ width: `${tenantRegs.length > 0 ? (tenantAttended / tenantRegs.length) * 100 : 0}%` }}
                          title="Attended"
                        />
                        <div 
                          className="bg-indigo-500 h-full" 
                          style={{ width: `${tenantRegs.length > 0 ? ((tenantRegs.length - tenantAttended) / tenantRegs.length) * 100 : 0}%` }}
                          title="Pending / No-show"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy Link, Switch workspace, Suspend */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyTenantLink(t.slug, t.id)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                      title="Copy Private Event Link for Organizer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedId === t.id ? "Copied!" : "Private Link"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleTenantStatus(t.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          t.status === 'active' 
                            ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' 
                            : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                        title={t.status === 'active' ? "Suspend Tenant" : "Reactivate Tenant"}
                      >
                        <Lock className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectTenant(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          isCurrent 
                            ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        <span>{isCurrent ? "Active" : "Switch Workspace"}</span>
                        {!isCurrent && <ArrowRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIPTION PLANS & TIERS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-xl font-bold text-white">Multi-Tenant Rental Tiers</h2>
            <p className="text-xs text-slate-400 mt-1">
              Operators can assign subscription limits per tenant. Metered resources enforce attendee thresholds, badge printing storage, and real-time chat servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const activeWithPlan = tenants.filter(t => t.planId === p.id).length;
              return (
                <div
                  key={p.id}
                  className={`glass-panel rounded-3xl p-6 relative flex flex-col justify-between border ${
                    p.popular ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-2xl' : 'border-slate-800'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg">
                      Most Popular Tier
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-lg font-bold text-white">{p.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {activeWithPlan} active tenants
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-4">
                      <span className="text-4xl font-extrabold text-white">${p.price}</span>
                      <span className="text-xs text-slate-400">/{p.billingPeriod}</span>
                    </div>

                    <p className="text-xs text-slate-300 mb-5">{p.description}</p>

                    <div className="bg-slate-800/60 rounded-xl p-3 text-xs space-y-1.5 mb-5 border border-slate-700/50">
                      <div className="flex justify-between text-slate-400">
                        <span>Max Events:</span>
                        <span className="text-white font-semibold">{p.limits.events === 999 ? 'Unlimited' : p.limits.events}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Max Attendees:</span>
                        <span className="text-white font-semibold">{p.limits.attendees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>S3 Cloud Storage:</span>
                        <span className="text-white font-semibold">{p.limits.storage}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Real-Time Chat:</span>
                        <span className={p.limits.chatEnabled ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                          {p.limits.chatEnabled ? "Included" : "Disabled"}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300">
                      {p.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800">
                    <button
                      onClick={() => setIsNewModalOpen(true)}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                    >
                      Provision Workspace on {p.name}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Security & Row-Level Audit Log
              </h3>
              <p className="text-xs text-slate-400">
                Ghana Data Protection Act (Act 843) compliance log: sensitive events, check-ins, badge reprints, and tenant modifications.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User / Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target / Detail</th>
                  <th className="py-2.5 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      {log.user}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {log.target}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                      {log.ip || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Tenant Modal */}
      <NewTenantModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={(data) => {
          const tenant = onAddTenant(data);
          return tenant;
        }}
        plans={plans}
      />

    </div>
  );
}
