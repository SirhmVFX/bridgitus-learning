import type { Student } from "./firestore";
import { Timestamp } from "firebase/firestore";

/** Parse plan expiry date from Firestore Timestamp or ISO string. */
export function getPlanExpiryDate(student: Student): Date | null {
  if (!student.planExpiresAt) return null;
  const raw = student.planExpiresAt;
  if (raw instanceof Timestamp) return raw.toDate();

  const candidate = raw as unknown as { toDate?: unknown };
  if (typeof candidate === "object" && candidate !== null && typeof candidate.toDate === "function") {
    return (candidate.toDate as () => Date)();
  }

  return new Date(raw as unknown as string);
}

export function isPlanExpired(student: Student): boolean {
  if (student.paymentStatus === "waived") return false;
  if (student.paymentStatus !== "paid") return false;
  const expiry = getPlanExpiryDate(student);
  if (!expiry) return false;
  return expiry.getTime() <= Date.now();
}

export function isPaymentCurrent(student: Student): boolean {
  if (student.paymentStatus === "waived") return true;
  if (student.paymentStatus !== "paid") return false;
  return !isPlanExpired(student);
}

export function getDaysRemaining(student: Student): number | null {
  const expiry = getPlanExpiryDate(student);
  if (!expiry || student.paymentStatus !== "paid") return null;
  const ms = expiry.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function isPlanExpiringSoon(student: Student, withinDays = 7): boolean {
  const days = getDaysRemaining(student);
  if (days === null) return false;
  return days <= withinDays && days > 0;
}

export function isAccountBlocked(student: Student): boolean {
  return student.status === "suspended" || student.status === "inactive";
}

export function hasPortalAccess(student: Student): boolean {
  if (isAccountBlocked(student)) return false;
  return isPaymentCurrent(student);
}

/** Infer plan duration from pricing plan `per` label when durationDays is unset. */
export function inferDurationDays(per: string): number {
  const lower = per.toLowerCase();
  if (lower.includes("week") && !lower.includes("weeks")) return 7;
  const weeksMatch = lower.match(/(\d+)\s*week/);
  if (weeksMatch) return Number(weeksMatch[1]) * 7;
  const classesMatch = lower.match(/(\d+)\s*class/);
  if (classesMatch) {
    const classes = Number(classesMatch[1]);
    return Math.round((classes / 2) * 7);
  }
  return 30;
}
