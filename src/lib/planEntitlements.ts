import type { Student } from "./firestore";
import { isFamilyPlan } from "./pricingPlans";

/** Usage quotas tied to each pricing plan. */
export interface PlanQuotaState {
  classesAllowed: number;
  assessmentsAllowed: number;
  classesUsed: number;
  assessmentsUsed: number;
  /** Basic plan: assignment/session minutes included (60). */
  assignmentMinutesAllowed?: number;
  assignmentMinutesUsed?: number;
}

export type PlanKind = "family" | "basic" | "standard" | "premium" | "other";

export function getPlanKind(planTitle?: string | null): PlanKind {
  const t = (planTitle || "").toLowerCase();
  if (t.includes("family")) return "family";
  if (t.includes("basic") || t.includes("pay as you go") || t.includes("casual"))
    return "basic";
  if (t.includes("premium") || t.includes("success")) return "premium";
  if (t.includes("standard") || t.includes("growth")) return "standard";
  return "other";
}

/**
 * Entitlements applied at payment time.
 * - Family: expires 7 days after payment (time-based)
 * - Basic: 1 lesson + 1 assessment (+ 60 assignment minutes)
 * - Standard: 20 classes + 20 assessments
 * - Premium: 30 classes + 30 assessments
 */
export function getPlanEntitlements(planTitle?: string | null): {
  kind: PlanKind;
  durationDays: number | null;
  quotas: Omit<
    PlanQuotaState,
    "classesUsed" | "assessmentsUsed" | "assignmentMinutesUsed"
  > | null;
} {
  const kind = getPlanKind(planTitle);
  switch (kind) {
    case "family":
      return { kind, durationDays: 7, quotas: null };
    case "basic":
      return {
        kind,
        durationDays: null,
        quotas: {
          classesAllowed: 1,
          assessmentsAllowed: 1,
          assignmentMinutesAllowed: 60,
        },
      };
    case "standard":
      return {
        kind,
        durationDays: null,
        quotas: { classesAllowed: 20, assessmentsAllowed: 20 },
      };
    case "premium":
      return {
        kind,
        durationDays: null,
        quotas: { classesAllowed: 30, assessmentsAllowed: 30 },
      };
    default:
      return { kind, durationDays: 30, quotas: null };
  }
}

export function buildQuotaState(planTitle?: string | null): PlanQuotaState | null {
  const { quotas } = getPlanEntitlements(planTitle);
  if (!quotas) return null;
  return {
    ...quotas,
    classesUsed: 0,
    assessmentsUsed: 0,
    assignmentMinutesUsed: 0,
  };
}

export function isQuotaExhausted(student: Student): boolean {
  const q = student.planQuota;
  if (!q) return false;
  const classesDone = q.classesUsed >= q.classesAllowed;
  const assessmentsDone = q.assessmentsUsed >= q.assessmentsAllowed;
  const minutesCap = q.assignmentMinutesAllowed ?? 0;
  const minutesDone =
    minutesCap > 0 && (q.assignmentMinutesUsed ?? 0) >= minutesCap;

  if (getPlanKind(student.planTitle) === "basic") {
    return (classesDone && assessmentsDone) || minutesDone;
  }
  return classesDone && assessmentsDone;
}

export function formatPaidAt(student: Student): string | null {
  const raw = student.paidAt;
  if (!raw) return null;
  const d =
    typeof (raw as { toDate?: () => Date }).toDate === "function"
      ? (raw as { toDate: () => Date }).toDate()
      : new Date(raw as unknown as string);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatExpiresLabel(student: Student): string | null {
  const raw = student.planExpiresAt;
  if (raw) {
    const d =
      typeof (raw as { toDate?: () => Date }).toDate === "function"
        ? (raw as { toDate: () => Date }).toDate()
        : new Date(raw as unknown as string);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }
  const q = student.planQuota;
  if (!q) return null;
  const leftClasses = Math.max(0, q.classesAllowed - q.classesUsed);
  const leftAssess = Math.max(0, q.assessmentsAllowed - q.assessmentsUsed);
  return `${leftClasses} lesson(s) + ${leftAssess} assessment(s) remaining`;
}

export function computePlanExpiresAt(
  planTitle?: string | null,
  from = new Date()
): Date | null {
  const { durationDays } = getPlanEntitlements(planTitle);
  if (!durationDays) return null;
  return new Date(from.getTime() + durationDays * 24 * 60 * 60 * 1000);
}

export function planTitleIsFamily(planTitle?: string | null): boolean {
  return isFamilyPlan({ title: planTitle || "", badge: "" });
}
