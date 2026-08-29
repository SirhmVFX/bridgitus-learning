/** Schedule helpers for tests / assignments (datetime-local strings). */

export type Schedulable = {
  startAt?: string;
  dueAt?: string;
  /** Legacy date-only field on older assignments */
  dueDate?: string;
};

export function parseScheduleDate(value?: string | null): Date | null {
  if (!value) return null;
  // datetime-local: YYYY-MM-DDTHH:mm — treat as local
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d;
  // date-only: end of day
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const end = new Date(`${value}T23:59:59`);
    return Number.isNaN(end.getTime()) ? null : end;
  }
  return null;
}

export function effectiveDueAt(item: Schedulable): string | undefined {
  return item.dueAt || (item.dueDate ? `${item.dueDate}T23:59` : undefined);
}

export function isNotYetOpen(item: Schedulable, now = new Date()): boolean {
  const start = parseScheduleDate(item.startAt);
  return Boolean(start && now < start);
}

export function isPastDue(item: Schedulable, now = new Date()): boolean {
  const due = parseScheduleDate(effectiveDueAt(item));
  return Boolean(due && now > due);
}

export function isWithinWindow(item: Schedulable, now = new Date()): boolean {
  return !isNotYetOpen(item, now) && !isPastDue(item, now);
}

export function formatSchedule(value?: string | null): string {
  const d = parseScheduleDate(value);
  if (!d) return "—";
  return d.toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Sync legacy dueDate when saving dueAt */
export function dueDateFromDueAt(dueAt?: string): string {
  if (!dueAt) return "";
  return dueAt.slice(0, 10);
}
