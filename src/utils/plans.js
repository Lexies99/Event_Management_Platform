import { INITIAL_PLANS } from '../data/mockData.js';

export const PLAN_ORDER = ['free', 'starter', 'growth', 'enterprise'];

export const PLAN_ENTITLEMENTS = {
  free: {
    id: 'free',
    name: 'Free',
    maxEvents: 1,
    maxAttendees: 100,
    maxStaffDesks: 0,
    canRegisterAndExport: true,
    canIssueDigitalTickets: false,
    canCheckIn: false,
    canPrintBadges: false,
    canUseMeetings: false,
    canUseCertificates: false,
    canViewAuditTrail: false,
    canUseBulkMessaging: false,
    canUseEventChat: false,
    canUseFeedback: false,
    canUseCustomBranding: false,
    canViewAnalytics: false,
    includesHardwareAndStaff: false,
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    maxEvents: 1,
    maxAttendees: 300,
    maxStaffDesks: 2,
    canRegisterAndExport: true,
    canIssueDigitalTickets: true,
    canCheckIn: true,
    canPrintBadges: true,
    canUseMeetings: true,
    canUseCertificates: true,
    canViewAuditTrail: true,
    canUseBulkMessaging: false,
    canUseEventChat: false,
    canUseFeedback: false,
    canUseCustomBranding: false,
    canViewAnalytics: false,
    includesHardwareAndStaff: false,
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    maxEvents: 5,
    maxAttendees: 2000,
    maxStaffDesks: 10,
    canRegisterAndExport: true,
    canIssueDigitalTickets: true,
    canCheckIn: true,
    canPrintBadges: true,
    canUseMeetings: true,
    canUseCertificates: true,
    canViewAuditTrail: true,
    canUseBulkMessaging: true,
    canUseEventChat: true,
    canUseFeedback: true,
    canUseCustomBranding: true,
    canViewAnalytics: true,
    includesHardwareAndStaff: false,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    maxEvents: 999,
    maxAttendees: 15000,
    maxStaffDesks: 999,
    canRegisterAndExport: true,
    canIssueDigitalTickets: true,
    canCheckIn: true,
    canPrintBadges: true,
    canUseMeetings: true,
    canUseCertificates: true,
    canViewAuditTrail: true,
    canUseBulkMessaging: true,
    canUseEventChat: true,
    canUseFeedback: true,
    canUseCustomBranding: true,
    canViewAnalytics: true,
    includesHardwareAndStaff: true,
  },
};

export function normalizePlanId(planId) {
  const key = String(planId || 'free').toLowerCase().trim();
  return PLAN_ENTITLEMENTS[key] ? key : 'free';
}

export function getPlanEntitlements(planId) {
  return PLAN_ENTITLEMENTS[normalizePlanId(planId)];
}

export function getPlanInfo(planId) {
  const id = normalizePlanId(planId);
  return INITIAL_PLANS.find((p) => p.id === id) || INITIAL_PLANS[0];
}

export function isPlanAtLeast(currentPlanId, requiredPlanId) {
  const curIdx = PLAN_ORDER.indexOf(normalizePlanId(currentPlanId));
  const reqIdx = PLAN_ORDER.indexOf(normalizePlanId(requiredPlanId));
  return curIdx >= reqIdx;
}

export function getUpgradeOptions(currentPlanId) {
  const curIdx = PLAN_ORDER.indexOf(normalizePlanId(currentPlanId));
  return INITIAL_PLANS.filter((p) => PLAN_ORDER.indexOf(p.id) > curIdx);
}
