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
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Check
} from 'lucide-react';
import NewTenantModal from './NewTenantModal';
import TenantLogo from '../Common/TenantLogo';
import { DonutChart, BarGraph, AreaTrendGraph } from '../Common/Charts';

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
  const [activeTab, setActiveTab] = useState('tenants'); // 'tenants' | 'analytics' | 'plans' | 'audit'
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
    t.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyTenantLink = (slug, id) => {
    const link = `${window.location.origin}/?tenant=${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Pie Chart Data 1: Subscription Tier Distribution
  const tierDistributionData = plans.map(p => {
    const count = tenants.filter(t => t.planId === p.id).length;
    let color = '#AB6088';
    if (p.id === 'growth') color = '#FB9378';
    if (p.id === 'enterprise') color = '#E0C97E';
    return {
      label: `${p.name} Tier`,
      value: count,
      color
    };
  });

  // Pie Chart Data 2: Platform-wide Attendee Status
  const attendeeStatusData = [
    { label: 'Checked In', value: totalAttended, color: '#FB9378' },
    { label: 'Pending / Awaiting', value: Math.max(0, totalRegistrations - totalAttended), color: '#E0C97E' },
    { label: 'Rented Quota Left', value: Math.max(10, 2000 - totalRegistrations), color: '#AB6088' }
  ];

  // Bar Graph Data: Registrations across workspaces
  const tenantBarData = tenants.slice(0, 6).map(t => {
    const count = allRegistrations.filter(r => r.tenantId === t.id).length;
    return {
      label: t.name.split(' ')[0],
      value: count,
      unit: 'registrants'
    };
  });

  // Area Trend Data: Hourly check-in flow mock
  const hourlyThroughputData = [
    { label: '08:00', value: 12 },
    { label: '09:00', value: 68 },
    { label: '10:00', value: 145 },
    { label: '11:00', value: 92 },
    { label: '12:00', value: 44 },
    { label: '13:00', value: 31 },
    { label: '14:00', value: 85 },
    { label: '15:00', value: 50 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Operator Heading */}
      <div className="relative rounded-3xl bg-[#1c1c1b] border border-white/10 p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
        {/* Subtle iridescent gradient rim on top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E]" />
        
        {/* Background glow orb */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#AB6088]/10 via-[#FB9378]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0C97E]/15 border border-[#E0C97E]/30 text-[#FCF8B3] text-xs font-mono font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FB9378]" />
              <span>Platform Operator Fleet Plane (Super-Admin)</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Multi-Tenant Event Platform Fleet
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl leading-relaxed">
              Rent, onboard and manage corporate tenants with strict row-level security isolation, custom branding, and metered subscription plans.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold text-xs shadow-lg shadow-[#FB9378]/20 transition-all hover:opacity-95 active:scale-95"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>New Company Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Headline KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Rented Workspaces */}
        <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl hover:border-[#E0C97E]/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-semibold">Rented Workspaces</span>
            <div className="w-8 h-8 rounded-xl bg-[#E0C97E]/10 flex items-center justify-center text-[#E0C97E]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">{totalTenants}</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">({activeTenants} active)</span>
          </div>
          <div className="w-full bg-[#141413] h-1.5 rounded-full mt-3 overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-[#AB6088] to-[#E0C97E] h-full rounded-full transition-all duration-500" 
              style={{ width: `${(activeTenants / (totalTenants || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Platform Registrants */}
        <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl hover:border-[#FB9378]/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-semibold">Platform Registrants</span>
            <div className="w-8 h-8 rounded-xl bg-[#FB9378]/10 flex items-center justify-center text-[#FB9378]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FB9378]">{totalRegistrations}</span>
            <span className="text-xs text-white/40 font-medium">total fleet</span>
          </div>
          <p className="text-[11px] text-white/50 mt-2">
            Capacity: <span className="text-[#FCF8B3] font-semibold">{totalRegistrations} / 5,000 allocated</span>
          </p>
        </div>

        {/* Verified Check-ins */}
        <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl hover:border-[#FCF8B3]/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-semibold">Verified Check-ins</span>
            <div className="w-8 h-8 rounded-xl bg-[#FCF8B3]/10 flex items-center justify-center text-[#FCF8B3]">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">{totalAttended}</span>
            <span className="text-xs text-[#E0C97E] font-mono font-bold">
              {totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0}% rate
            </span>
          </div>
          <p className="text-[11px] text-white/50 mt-2">
            Badges scanned on-site
          </p>
        </div>

        {/* Estimated MRR / Billing */}
        <div className="bg-[#1c1c1b] border border-white/10 p-5 rounded-2xl hover:border-[#AB6088]/40 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-xs font-semibold">Estimated Monthly MRR</span>
            <div className="w-8 h-8 rounded-xl bg-[#AB6088]/10 flex items-center justify-center text-[#AB6088]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FCF8B3]">${estimatedRevenue}</span>
            <span className="text-xs text-[#AB6088] font-mono font-bold">USD/mo</span>
          </div>
          <p className="text-[11px] text-white/50 mt-2">
            Tiered subscription revenue
          </p>
        </div>

      </div>

      {/* Tabs Switcher: Tenants | Analytics & Graphs | Subscription Plans | Audit Trail */}
      <div className="flex border-b border-white/10 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'tenants'
              ? 'border-[#FB9378] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeTab === 'tenants' ? 'text-[#FB9378]' : 'text-white/40'}`} />
          <span>Tenant Companies ({tenants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'analytics'
              ? 'border-[#FB9378] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <PieIcon className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-[#FB9378]' : 'text-white/40'}`} />
          <span>Fleet Analytics & Graphs</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'plans'
              ? 'border-[#FB9378] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <CreditCard className={`w-4 h-4 ${activeTab === 'plans' ? 'text-[#FB9378]' : 'text-white/40'}`} />
          <span>Subscription Plans & Tiers</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-[#FB9378] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Activity className={`w-4 h-4 ${activeTab === 'audit' ? 'text-[#FB9378]' : 'text-white/40'}`} />
          <span>Security & Audit Trail</span>
        </button>
      </div>

      {/* TAB 1: TENANT LIST */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/40" />
              <input
                type="text"
                placeholder="Search company, slug, organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1c1c1b] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
              />
            </div>
            <span className="text-xs text-white/40 font-mono self-end sm:self-auto">
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
                  className={`bg-[#1c1c1b] rounded-3xl p-6 flex flex-col justify-between transition-all border shadow-xl ${
                    isCurrent ? 'ring-2 ring-[#FB9378] border-[#FB9378]/50' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Header: Logo, Name, Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <TenantLogo tenant={t} size={48} className="rounded-2xl shrink-0" />
                        <div className="truncate">
                          <h3 className="font-heading font-bold text-white text-base leading-snug truncate">{t.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span 
                              className="w-2 h-2 rounded-full inline-block shrink-0" 
                              style={{ backgroundColor: t.brandColor || '#AB6088' }} 
                              title={`Brand: ${t.brandColor}`}
                            />
                            <span className="text-xs font-mono text-white/40 truncate">/{t.slug}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider shrink-0 ${
                        t.status === 'active' 
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    {/* Organizer details */}
                    <div className="bg-[#141413] rounded-2xl p-3.5 text-xs space-y-1.5 mb-4 border border-white/10">
                      <div className="flex justify-between text-white/50">
                        <span>Event Organizer:</span>
                        <span className="font-semibold text-white/90">{t.organizer?.name || 'Admin'}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Contact:</span>
                        <span className="text-white/80 truncate max-w-[150px]">{t.organizer?.email}</span>
                      </div>
                      <div className="flex justify-between text-white/50 pt-1 border-t border-white/5">
                        <span>Plan Tier:</span>
                        <span className="font-bold text-[#FCF8B3] capitalize">{plan.name} (${plan.price}/{plan.billingPeriod})</span>
                      </div>
                    </div>

                    {/* Usage Bars */}
                    <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex justify-between text-white/50">
                        <span>Registrations & Check-ins:</span>
                        <span className="text-white font-semibold">{tenantAttended} / {tenantRegs.length} attended</span>
                      </div>
                      <div className="w-full bg-[#141413] h-2 rounded-full overflow-hidden flex border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-[#AB6088] to-[#FB9378] h-full" 
                          style={{ width: `${tenantRegs.length > 0 ? (tenantAttended / tenantRegs.length) * 100 : 0}%` }}
                          title="Attended"
                        />
                        <div 
                          className="bg-[#E0C97E] h-full opacity-60" 
                          style={{ width: `${tenantRegs.length > 0 ? ((tenantRegs.length - tenantAttended) / tenantRegs.length) * 100 : 0}%` }}
                          title="Pending"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy Link, Switch workspace, Suspend */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyTenantLink(t.slug, t.id)}
                      className="px-2.5 py-1.5 bg-[#252523] hover:bg-[#2e2e2b] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/15"
                      title="Copy Private Event Link for Organizer"
                    >
                      {copiedId === t.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#E0C97E]" />
                          <span>Private Link</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleTenantStatus(t.id)}
                        className={`p-2 rounded-xl text-xs transition-colors border ${
                          t.status === 'active' 
                            ? 'text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border-white/10' 
                            : 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30'
                        }`}
                        title={t.status === 'active' ? "Suspend Tenant" : "Reactivate Tenant"}
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectTenant(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          isCurrent 
                            ? 'bg-[#FB9378]/20 text-[#FB9378] border border-[#FB9378]/40' 
                            : 'bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold shadow-md shadow-[#FB9378]/20 hover:opacity-95'
                        }`}
                      >
                        <span>{isCurrent ? "Active" : "Switch"}</span>
                        {!isCurrent && <ArrowRight className="w-3 h-3 text-black" />}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM ANALYTICS, PIE CHART & GRAPHS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Top Row: Two Pie / Donut Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pie Chart 1: Subscription Tier Distribution */}
            <div className="bg-[#1c1c1b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-[#FB9378]" />
                    <span>Tenant Subscription Tier Breakdown</span>
                  </h3>
                  <p className="text-xs text-white/50">Distribution across Starter, Growth, and Enterprise plans</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#FCF8B3] border border-white/15">
                  {tenants.length} Workspaces
                </span>
              </div>

              <div className="pt-2">
                <DonutChart
                  data={tierDistributionData}
                  title="Plan Tiers"
                  centerLabel="Workspaces"
                  size={200}
                />
              </div>
            </div>

            {/* Pie Chart 2: Platform-wide Attendee Status Ratio */}
            <div className="bg-[#1c1c1b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-[#E0C97E]" />
                    <span>Fleet Attendance & Utilization Ratio</span>
                  </h3>
                  <p className="text-xs text-white/50">Checked-in delegates vs pending check-ins vs remaining capacity</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-400 border border-white/15">
                  Live Sync
                </span>
              </div>

              <div className="pt-2">
                <DonutChart
                  data={attendeeStatusData}
                  title="Attendance Ratio"
                  centerLabel="Capacity"
                  size={200}
                />
              </div>
            </div>

          </div>

          {/* Bottom Row: Bar Graph & Area Trend Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Bar Graph: Registrations by Company */}
            <div className="bg-[#1c1c1b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#FB9378]" />
                  <span>Registrations Velocity by Company</span>
                </h3>
                <p className="text-xs text-white/50">Comparative delegate counts registered across active companies</p>
              </div>

              <BarGraph data={tenantBarData} height={170} />
            </div>

            {/* Area Trend Graph: Platform Check-in Activity */}
            <div className="bg-[#1c1c1b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#E0C97E]" />
                    <span>Peak Check-In Arrival Distribution</span>
                  </h3>
                  <p className="text-xs text-white/50">Optical scanner throughput and arrival frequency curve</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  Sub-second
                </span>
              </div>

              <AreaTrendGraph data={hourlyThroughputData} height={160} />
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: SUBSCRIPTION PLANS & TIERS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="font-heading font-extrabold text-xl text-white">Multi-Tenant Rental Tiers</h2>
            <p className="text-xs text-white/50 mt-1">
              Operators can assign subscription limits per tenant. Metered resources enforce attendee thresholds, badge printing storage, and real-time chat servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const activeWithPlan = tenants.filter(t => t.planId === p.id).length;
              return (
                <div
                  key={p.id}
                  className={`bg-[#1c1c1b] rounded-3xl p-6 relative flex flex-col justify-between border shadow-xl ${
                    p.popular ? 'border-[#FB9378] ring-2 ring-[#FB9378]/30' : 'border-white/10'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-[#AB6088] to-[#FB9378] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg">
                      Most Popular Tier
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-heading font-bold text-lg text-white">{p.name}</h3>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#141413] text-[#FCF8B3] border border-white/10">
                        {activeWithPlan} active
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-4">
                      <span className="font-heading font-extrabold text-4xl text-white">${p.price}</span>
                      <span className="text-xs text-white/40">/{p.billingPeriod}</span>
                    </div>

                    <p className="text-xs text-white/60 mb-5 leading-relaxed">{p.description}</p>

                    <div className="bg-[#141413] rounded-2xl p-3.5 text-xs space-y-2 mb-5 border border-white/10">
                      <div className="flex justify-between text-white/50">
                        <span>Max Events:</span>
                        <span className="text-white font-semibold">{p.limits.events === 999 ? 'Unlimited' : p.limits.events}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Max Attendees:</span>
                        <span className="text-[#FCF8B3] font-semibold">{p.limits.attendees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>S3 Cloud Storage:</span>
                        <span className="text-white font-semibold">{p.limits.storage}</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Real-Time Chat:</span>
                        <span className={p.limits.chatEnabled ? "text-emerald-400 font-semibold" : "text-white/30"}>
                          {p.limits.chatEnabled ? "Included" : "Disabled"}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-white/70">
                      {p.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#E0C97E] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10">
                    <button
                      onClick={() => setIsNewModalOpen(true)}
                      className="w-full py-2.5 rounded-xl font-extrabold text-xs bg-[#252523] hover:bg-[#2e2e2b] text-white transition-colors border border-white/15"
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

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-[#1c1c1b] rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading font-extrabold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Security & Row-Level Audit Log
              </h3>
              <p className="text-xs text-white/50">
                Ghana Data Protection Act (Act 843) compliance log: sensitive events, check-ins, badge reprints, and tenant modifications.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-[#141413] text-white/50 font-semibold uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">User / Actor</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Target / Detail</th>
                  <th className="py-3 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-3 font-mono text-white/50 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {log.user}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#E0C97E]/15 text-[#FCF8B3] border border-[#E0C97E]/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white/80">
                      {log.target}
                    </td>
                    <td className="py-3 px-3 font-mono text-white/40 text-[11px]">
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
