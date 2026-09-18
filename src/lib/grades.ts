/** Canonical student grade / year-level values used across portal + registration. */
export const STUDENT_GRADES = [
  "Pre-K",
  "K",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "A/Level",
] as const;

export type StudentGrade = (typeof STUDENT_GRADES)[number];

/** Subjects offered when grade is A/Level (university pathway). */
export const A_LEVEL_SUBJECTS = ["College Prep", "University Support"] as const;

/** Display label for badges / headers (avoids "Grade A/Level"). */
export function formatGradeLabel(grade?: string | null): string {
  if (!grade) return "";
  const g = grade.trim();
  if (/^a\/level$/i.test(g)) return "A/Level";
  if (/^(pre-k|k)$/i.test(g)) return g;
  if (/^\d+$/.test(g)) return `Grade ${g}`;
  return g;
}

/** Map stored student grade to a curriculum year label for AI practice. */
export function gradeToCurriculumYear(grade?: string | null): string {
  if (!grade) return "Year 7";
  const g = grade.trim();
  if (/^a\/level$/i.test(g)) return "University / A-Level";
  if (/^(pre-k|k)$/i.test(g)) return g;
  if (/^\d+$/.test(g)) return `Year ${g}`;
  return g;
}
