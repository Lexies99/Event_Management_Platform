import React, { useState } from 'react';
import { Lock, ArrowUpCircle, CheckCircle2, Sparkles, Printer, Users } from 'lucide-react';
import { INITIAL_PLANS } from '../../data/mockData';
import { getPlanInfo, PLAN_ORDER, normalizePlanId } from '../../utils/plans';
import { Storage } from '../../data/storage';

export default function PlanUpgradeGate({
  tenant,
  featureTitle,
  featureDescription,
  requiredPlanId = 'starter',
  isOrganizer = false,
  onUpgraded,
}) {
  const [upgradingId, setUpgradingId] = useState(null);
  const [error, setError] = useState('');

  const currentPlanId = normalizePlanId(tenant?.planId);
  const currentPlan = getPlanInfo(currentPlanId);
  const requiredPlan = getPlanInfo(requiredPlanId);
  const reqIdx = PLAN_ORDER.indexOf(normalizePlanId(requiredPlanId));
  const upgradeChoices = INITIAL_PLANS.filter((p) => PLAN_ORDER.indexOf(p.id) >= reqIdx);

  const handleUpgrade = async (targetPlanId) => {
    if (!tenant?.id || upgradingId) return;
    setError('');
    setUpgradingId(targetPlanId);
    try {
      await Storage.updateTenantAsync(tenant.id, { planId: targetPlanId });
      onUpgraded?.();
    } catch (err) {
      setError(err.message || 'Failed to upgrade package.');
    } finally {
      setUpgradingId(null);
    }
  };

  return (
    <div className="fp-card p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div
          className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)' }}
        >
          <Lock className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 fp-tag-sage text-xs font-bold">
          <span>Current Package: {currentPlan.name}</span>
          <span>·</span>
          <span>Requires {requiredPlan.name}+</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold m-0">{featureTitle}</h2>
        <p className="text-xs sm:text-sm m-0 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {featureDescription}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl border text-xs font-semibold text-center" style={{ borderColor: 'var(--fp-red)', color: 'var(--fp-red)' }}>
          {error}
        </div>
      )}

      {isOrganizer ? (
        <div className="space-y-4">
          <div className="text-center text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Upgrade Your Package to Unlock Immediately
          </div>
          <div className={`grid grid-cols-1 ${upgradeChoices.length === 1 ? 'max-w-md mx-auto' : upgradeChoices.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {upgradeChoices.map((plan) => {
              const isEnterprise = plan.id === 'enterprise';
              return (
                <div
                  key={plan.id}
                  className="p-5 rounded-2xl border flex flex-col justify-between gap-4"
                  style={{
                    background: plan.popular ? 'var(--bg-subtle)' : 'var(--bg-main)',
                    borderColor: plan.popular ? 'var(--fp-olive)' : 'var(--border-color)',
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-base">{plan.name}</span>
                      {plan.popular && (
                        <span className="fp-tag-olive text-[10px] inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Popular
                        </span>
                      )}
                      {isEnterprise && (
                        <span className="fp-tag-sage text-[10px] inline-flex items-center gap-1">
                          <Printer className="w-3 h-3" /> Hardware + Staff
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold">{plan.priceLabel || `$${plan.price}`}</span>
                      <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>/{plan.billingPeriod}</span>
                    </div>
                    <p className="text-xs m-0" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>
                    <ul className="space-y-1.5 p-0 m-0 list-none text-xs">
                      {plan.features.slice(0, 5).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--fp-green)' }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    disabled={Boolean(upgradingId)}
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 ${
                      plan.popular || isEnterprise ? 'btn-fp-olive' : 'btn-fp-sage'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>{upgradingId === plan.id ? 'Upgrading...' : `Upgrade to ${plan.name}`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border text-center text-xs max-w-md mx-auto flex items-center justify-center gap-2" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          <Users className="w-4 h-4 shrink-0" />
          <span>Please contact the event organizer to upgrade to the <strong>{requiredPlan.name}</strong> package to enable this feature.</span>
        </div>
      )}
    </div>
  );
}
