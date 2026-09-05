import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  setDoc, increment, query, where, serverTimestamp, Timestamp, limit,
} from "firebase/firestore";
import { db } from "./firebase";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface Student {
  id?: string;
  uid?: string;
  studentId: string;
  /** Parent / contact email — shared across siblings. Not used for login. */
  email: string;
  /** Internal Firebase Auth email (unique per student). Used only for auth. */
  authEmail?: string;
  firstName: string; lastName: string; dateOfBirth: string;
  gender: string; school: string; grade: string; subjects: string[];
  parentFirstName: string; parentLastName: string;
  parentEmail: string; parentPhone: string; postcode: string;
  enrolledAt?: Timestamp; status: "active" | "inactive" | "suspended";
  avatar?: string; bio?: string; credentialsSent?: boolean;
  paymentStatus: "pending" | "paid" | "failed" | "waived" | "expired";
  paymentReference?: string; paymentAmount?: number; paidAt?: Timestamp;
  planId?: string; planTitle?: string; planExpiresAt?: Timestamp;
  /** Usage quotas for Basic / Standard / Premium (Family uses time expiry only). */
  planQuota?: {
    classesAllowed: number;
    assessmentsAllowed: number;
    classesUsed: number;
    assessmentsUsed: number;
    assignmentMinutesAllowed?: number;
    assignmentMinutesUsed?: number;
  };
  /** Last password issued at registration or admin reset (visible to admin). */
  issuedPassword?: string;
  // Stripe payment data (captured on successful Checkout)
  stripeCustomerId?: string;
  stripePaymentMethod?: {
    paymentMethodId: string; last4?: string; brand?: string;
    expMonth?: string; expYear?: string;
  };
  // Legacy Paystack fields (kept for older records)
  paystackCustomerCode?: string;
  paystackAuthorization?: {
    authorizationCode: string; last4?: string; cardType?: string;
    expMonth?: string; expYear?: string; bank?: string;
  };
  autoPay?: {
    interval: "weekly" | "monthly";
    amountCents?: number;
    amountKobo?: number; // legacy alias for amountCents
    subscriptionId?: string;
    planCode?: string;
    subscriptionCode?: string;
    emailToken?: string;
    status: "active" | "cancelled";
    createdAt?: Timestamp; cancelledAt?: Timestamp;
  };
  createdAt?: Timestamp; updatedAt?: Timestamp;
}

export interface LearningMaterial {
  id?: string; title: string; description: string;
  grade: string; subject: string;
  type: "text" | "document" | "pdf" | "image" | "video" | "link" | "mixed";
  content?: string; fileUrl?: string; fileName?: string;
  linkUrl?: string; linkLabel?: string; thumbnailUrl?: string;
  published: boolean; order: number; estimatedMinutes?: number;
  linkedMaterialId?: string;
  createdAt?: Timestamp; updatedAt?: Timestamp;
}

export type QuestionType = "multiple_choice" | "true_false" | "short_answer";
export interface Question {
  id: string; type: QuestionType; text: string;
  options?: string[]; correctAnswer: string; points: number;
  explanation?: string; workedSolution?: string;
  imageUrl?: string;        // optional diagram/illustration for the question
}

export interface Test {
  id?: string; title: string; description: string;
  grade: string; subject: string; type: "test" | "exam";
  questions: Question[]; totalPoints: number; passMark: number;
  maxAttempts: number; timeLimit?: number; linkedMaterialId?: string;
  /** ISO datetime-local string */
  startAt?: string;
  /** ISO datetime-local string */
  dueAt?: string;
  published: boolean; createdAt?: Timestamp; updatedAt?: Timestamp;
}

export interface TestAttempt {
  id?: string; testId: string; testTitle?: string;
  studentId: string; studentUid: string;
  studentName?: string;
  answers: Record<string, string>; score: number; totalPoints: number;
  percentage: number; passed: boolean; attemptNumber: number;
  status: "pending_review" | "approved" | "rejected";
  adminComment?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  submittedAt?: Timestamp; reviewedAt?: Timestamp;
}

export interface Assignment {
  id?: string; title: string; description: string;
  grade: string; subject: string;
  type: "ixl" | "deltamath" | "custom" | "document" | "quiz";
  platformUrl?: string; platform?: "ixl" | "deltamath" | "other";
  content?: string; fileUrl?: string; fileName?: string;
  /** @deprecated Prefer dueAt */
  dueDate?: string; maxScore?: number; linkedMaterialId?: string;
  startAt?: string;
  dueAt?: string;
  questions?: Question[]; totalPoints?: number; passMark?: number;
  timeLimit?: number; maxAttempts?: number;
  targetGrades: string[]; targetStudentIds?: string[];
  published: boolean; createdAt?: Timestamp; updatedAt?: Timestamp;
}

export interface AssignmentSubmission {
  id?: string; assignmentId: string; studentId: string; studentUid: string;
  studentName?: string;
  status: "not_started" | "in_progress" | "submitted" | "graded";
  answers?: Record<string, string>; score?: number; totalPoints?: number;
  percentage?: number; passed?: boolean; attemptNumber?: number;
  feedback?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  submittedAt?: Timestamp; gradedAt?: Timestamp;
}

export interface StudentProgress {
  id?: string; studentId: string; grade: string; subject: string;
  overallScore: number; testsCompleted: number; testsPassed: number;
  assignmentsCompleted: number; materialsCompleted: number;
  lastActivity?: Timestamp; updatedAt?: Timestamp;
}

export interface MaterialCompletion {
  id?: string; studentId: string; materialId: string;
  grade: string; subject: string; completedAt?: Timestamp;
}

export interface Announcement {
  id?: string; title: string; body: string;
  targetGrades: string[]; pinned: boolean; published: boolean;
  createdAt?: Timestamp; updatedAt?: Timestamp;
}

export interface SiteContent {
  id?: string; section: string; data: Record<string, unknown>; updatedAt?: Timestamp;
}
export interface SiteTestimonial {
  id?: string; name: string; role: string; quote: string; rating: number;
  avatar?: string; published: boolean; order: number; createdAt?: Timestamp;
}
export interface SitePricingPlan {
  id?: string;
  title: string;
  tagline: string;        // shown under title e.g. "(Best Value for Families)"
  price: string;          // display price e.g. "$49.99"
  per: string;            // e.g. "/week"
  badge?: string;         // e.g. "1 to 4 Children"
  description?: string;   // short description under badge
  icon?: string;          // emoji icon e.g. "👨‍👩‍👧‍👦"
  ctaLabel?: string;      // button text e.g. "Book your family plan now"
  ctaHref?: string;       // button link
  perks: Array<{ desc: string }>;
  freePerks: string[];
  features?: Array<{ icon: string; title: string; desc: string }>;  // "What's Included" grid
  bottomNote1?: string;   // e.g. "More learning. More progress. More value together."
  bottomNote2?: string;   // e.g. "Cancel or pause anytime"
  highlighted: boolean;
  order: number;
  published: boolean;
  /** Charge amount in cents (AUD). Prefer this for Stripe. */
  amountCents?: number;
  /** @deprecated Legacy Paystack field — treated as amountCents when amountCents is missing. */
  amountKobo?: number;
  durationDays?: number;  // plan duration — used for expiry countdown
  createdAt?: Timestamp;
}

/** Stripe charge amount in cents for a pricing plan. */
export function getPlanAmountCents(plan: Pick<SitePricingPlan, "amountCents" | "amountKobo" | "price">): number {
  if (typeof plan.amountCents === "number" && plan.amountCents > 0) return plan.amountCents;
  // Parse display prices like "$50", "$1,365", "$49.99"
  const raw = (plan.price ?? "").replace(/[^0-9.]/g, "");
  if (raw) {
    const dollars = parseFloat(raw);
    if (!isNaN(dollars) && dollars > 0) return Math.round(dollars * 100);
  }
  // Legacy amountKobo only if it looks like cents (not old NGN kobo millions)
  if (typeof plan.amountKobo === "number" && plan.amountKobo > 0 && plan.amountKobo < 1_000_000) {
    return plan.amountKobo;
  }
  return 0;
}
export interface SiteFaq {
  id?: string; question: string; answer: string;
  order: number; published: boolean; createdAt?: Timestamp;
}
export interface ContactMessage {
  id?: string; name: string; email: string; message: string;
  read: boolean; createdAt?: Timestamp;
}
export interface SiteClass {
  id?: string; title: string; grades: string; description: string;
  subjects: string[]; type: "one-on-one" | "group" | "online";
  image?: string; published: boolean; order: number;
}
export interface SiteService {
  id?: string; title: string; description: string; icon?: string;
  bullets?: string[]; image?: string;
  section: "offer" | "why" | "exam_prep"; published: boolean; order: number;
}
export interface SitePartner {
  id?: string; name: string; logo: string; url?: string;
  published: boolean; order: number;
}

// ─────────────────────────────────────────────────────────────
// STUDENTS
// ─────────────────────────────────────────────────────────────

export async function getStudentByUid(uid: string): Promise<Student | null> {
  const snap = await getDocs(query(collection(db, "students"), where("uid", "==", uid)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Student) };
}

export async function getStudentById(id: string): Promise<Student | null> {
  const snap = await getDoc(doc(db, "students", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Student) };
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<void> {
  await updateDoc(doc(db, "students", id), { ...data, updatedAt: serverTimestamp() });
}

// ─────────────────────────────────────────────────────────────
// LEARNING MATERIALS  (no composite index — filter + sort client-side)
// ─────────────────────────────────────────────────────────────

export async function getMaterialsByGrade(grade: string): Promise<LearningMaterial[]> {
  // Single-field where — no index needed
  const snap = await getDocs(query(collection(db, "learningMaterials"), where("grade", "==", grade)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as LearningMaterial) }))
    .filter(m => m.published)
    .sort((a, b) => a.order - b.order);
}

export async function getMaterialsByGradeAndSubject(grade: string, subject: string): Promise<LearningMaterial[]> {
  const snap = await getDocs(query(collection(db, "learningMaterials"), where("grade", "==", grade)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as LearningMaterial) }))
    .filter(m => m.published && m.subject === subject)
    .sort((a, b) => a.order - b.order);
}

export async function getMaterialById(id: string): Promise<LearningMaterial | null> {
  const snap = await getDoc(doc(db, "learningMaterials", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as LearningMaterial) };
}

// ─────────────────────────────────────────────────────────────
// TESTS  (no composite index)
// ─────────────────────────────────────────────────────────────

export async function getTestsByGrade(grade: string): Promise<Test[]> {
  const snap = await getDocs(query(collection(db, "tests"), where("grade", "==", grade)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as Test) }))
    .filter(t => t.published)
    .sort((a, b) => (b.createdAt as Timestamp)?.toMillis() - (a.createdAt as Timestamp)?.toMillis() || 0);
}

export async function getTestById(id: string): Promise<Test | null> {
  const snap = await getDoc(doc(db, "tests", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Test) };
}

export async function getStudentAttempts(studentId: string, testId: string): Promise<TestAttempt[]> {
  const snap = await getDocs(query(collection(db, "testAttempts"), where("studentId", "==", studentId)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as TestAttempt) }))
    .filter(a => a.testId === testId)
    .sort((a, b) => (b.submittedAt as Timestamp)?.toMillis() - (a.submittedAt as Timestamp)?.toMillis() || 0);
}

export async function getAllStudentAttempts(studentId: string): Promise<TestAttempt[]> {
  const snap = await getDocs(query(collection(db, "testAttempts"), where("studentId", "==", studentId)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as TestAttempt) }))
    .sort((a, b) => (b.submittedAt as Timestamp)?.toMillis() - (a.submittedAt as Timestamp)?.toMillis() || 0);
}

export async function getTestAttemptById(id: string): Promise<TestAttempt | null> {
  const snap = await getDoc(doc(db, "testAttempts", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as TestAttempt) };
}

export async function submitTestAttempt(attempt: Omit<TestAttempt, "id" | "submittedAt" | "reviewedAt">): Promise<string> {
  const payload: Omit<TestAttempt, "id" | "submittedAt" | "reviewedAt"> & { submittedAt: ReturnType<typeof serverTimestamp>; reviewedAt?: ReturnType<typeof serverTimestamp> } = {
    ...attempt,
    submittedAt: serverTimestamp(),
  };
  if (attempt.status === "approved" || attempt.status === "rejected") {
    payload.reviewedAt = serverTimestamp();
  }
  const ref = await addDoc(collection(db, "testAttempts"), payload);
  await incrementPlanUsage(attempt.studentId, { assessments: 1 }).catch(() => {});
  return ref.id;
}

export async function getApprovedAttempts(studentId: string): Promise<TestAttempt[]> {
  const snap = await getDocs(query(collection(db, "testAttempts"), where("studentId", "==", studentId)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as TestAttempt) }))
    .filter(a => a.status === "approved")
    .sort((a, b) => (b.submittedAt as Timestamp)?.toMillis() - (a.submittedAt as Timestamp)?.toMillis() || 0);
}

// ─────────────────────────────────────────────────────────────
// ASSIGNMENTS  (no composite index)
// ─────────────────────────────────────────────────────────────

export async function getAssignmentsForStudent(grade: string, studentId: string): Promise<Assignment[]> {
  // array-contains alone is fine without composite index
  const snap = await getDocs(query(collection(db, "assignments"), where("targetGrades", "array-contains", grade)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as Assignment) }))
    .filter(a => a.published && (!a.targetStudentIds?.length || a.targetStudentIds.includes(studentId)))
    .sort((a, b) => (b.createdAt as Timestamp)?.toMillis() - (a.createdAt as Timestamp)?.toMillis() || 0);
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  const snap = await getDoc(doc(db, "assignments", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Assignment) };
}

export async function getSubmission(assignmentId: string, studentId: string): Promise<AssignmentSubmission | null> {
  const snap = await getDocs(query(collection(db, "assignmentSubmissions"),
    where("assignmentId", "==", assignmentId), where("studentId", "==", studentId), limit(1)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as AssignmentSubmission) };
}

export async function getSubmissionsByStudent(studentId: string): Promise<AssignmentSubmission[]> {
  const snap = await getDocs(
    query(collection(db, "assignmentSubmissions"), where("studentId", "==", studentId))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as AssignmentSubmission) }))
    .sort((a, b) => (b.submittedAt as Timestamp)?.toMillis() - (a.submittedAt as Timestamp)?.toMillis() || 0);
}

export async function upsertSubmission(sub: Omit<AssignmentSubmission, "id">): Promise<void> {
  const existing = await getSubmission(sub.assignmentId, sub.studentId);
  const isNew = !existing?.id;
  if (existing?.id) {
    await updateDoc(doc(db, "assignmentSubmissions", existing.id), { ...sub, submittedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, "assignmentSubmissions"), { ...sub, submittedAt: serverTimestamp() });
  }
  // Count each assignment/quiz once toward the plan assessment quota
  if (isNew && (sub.status === "submitted" || sub.status === "graded")) {
    await incrementPlanUsage(sub.studentId, { assessments: 1 }).catch(() => {});
  }
}

// ─────────────────────────────────────────────────────────────
// PRACTICE PAPERS (NAPLAN / Selective Entry)
// ─────────────────────────────────────────────────────────────

export type PracticeProgram = "naplan" | "selective";

export interface PracticePaper {
  id?: string;
  program: PracticeProgram;
  title: string;
  description: string;
  yearLevels: string[];
  subject: string;
  type: "quiz" | "exam" | "test" | "document" | "custom";
  questions?: Question[];
  totalPoints?: number;
  passMark?: number;
  timeLimit?: number;
  maxAttempts?: number;
  fileUrl?: string;
  fileName?: string;
  content?: string;
  startAt?: string;
  dueAt?: string;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PracticeAttempt {
  id?: string;
  paperId: string;
  paperTitle?: string;
  program: PracticeProgram;
  studentId: string;
  studentUid: string;
  studentName?: string;
  answers?: Record<string, string>;
  score?: number;
  totalPoints?: number;
  percentage?: number;
  passed?: boolean;
  attemptNumber: number;
  status: "submitted" | "graded" | "pending_review";
  feedback?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  submittedAt?: Timestamp;
  gradedAt?: Timestamp;
}

function sanitizeUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

/** Normalize "Year 8" / "Grade 8" / "8" → "8" */
export function normalizeYearGrade(value: string | null | undefined): string {
  if (!value) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^year\s+/i, "")
    .replace(/^grade\s+/i, "")
    .replace(/^yr\s+/i, "");
}

export function paperMatchesStudentGrade(
  paper: PracticePaper,
  studentGrade: string
): boolean {
  const g = normalizeYearGrade(studentGrade);
  if (!g) return false;
  return (paper.yearLevels ?? []).some((y) => normalizeYearGrade(y) === g);
}

export async function getPracticePapers(program: PracticeProgram): Promise<PracticePaper[]> {
  const snap = await getDocs(
    query(collection(db, "practicePapers"), where("program", "==", program))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as PracticePaper) }))
    .filter((p) => p.published)
    .sort((a, b) => (b.createdAt as Timestamp)?.toMillis() - (a.createdAt as Timestamp)?.toMillis() || 0);
}

export async function getPracticePapersForStudent(
  program: PracticeProgram,
  studentGrade: string
): Promise<PracticePaper[]> {
  const papers = await getPracticePapers(program);
  return papers.filter((p) => paperMatchesStudentGrade(p, studentGrade));
}

export async function getPracticePaperById(id: string): Promise<PracticePaper | null> {
  const snap = await getDoc(doc(db, "practicePapers", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as PracticePaper) };
}

export async function getAttemptsByPaper(
  paperId: string,
  studentId?: string
): Promise<PracticeAttempt[]> {
  const snap = await getDocs(
    query(collection(db, "practiceAttempts"), where("paperId", "==", paperId))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as PracticeAttempt) }))
    .filter((a) => Boolean(a.paperId) && (!studentId || a.studentId === studentId))
    .sort((a, b) => (b.submittedAt as Timestamp)?.toMillis() - (a.submittedAt as Timestamp)?.toMillis() || 0);
}

export async function getStudentPracticeAttempts(
  studentId: string,
  program?: PracticeProgram
): Promise<PracticeAttempt[]> {
  const snap = await getDocs(
    query(collection(db, "practiceAttempts"), where("studentId", "==", studentId))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as PracticeAttempt) }))
    .filter((a) => Boolean(a.paperId) && (!program || a.program === program))
    .sort((a, b) => (b.submittedAt as Timestamp)?.toMillis() - (a.submittedAt as Timestamp)?.toMillis() || 0);
}

export async function submitPracticeAttempt(
  attempt: Omit<PracticeAttempt, "id" | "submittedAt" | "gradedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "practiceAttempts"), {
    ...sanitizeUndefined(attempt as unknown as Record<string, unknown>),
    submittedAt: serverTimestamp(),
  });
  await incrementPlanUsage(attempt.studentId, { assessments: 1 }).catch(() => {});
  return ref.id;
}

export async function getPracticeAttemptById(id: string): Promise<PracticeAttempt | null> {
  const snap = await getDoc(doc(db, "practiceAttempts", id));
  if (!snap.exists()) return null;
  const data = snap.data() as PracticeAttempt;
  if (!data.paperId) return null;
  return { id: snap.id, ...data };
}

// ─────────────────────────────────────────────────────────────
// PROGRESS
// ─────────────────────────────────────────────────────────────

export async function getStudentProgress(studentId: string): Promise<StudentProgress[]> {
  const snap = await getDocs(query(collection(db, "studentProgress"), where("studentId", "==", studentId)));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as StudentProgress) }));
}

export async function upsertStudentProgress(
  studentId: string, grade: string, subject: string,
  patch: { scoreToAdd?: number; passed?: boolean; materialCompleted?: boolean; assignmentCompleted?: boolean }
): Promise<void> {
  const snap = await getDocs(query(collection(db, "studentProgress"),
    where("studentId", "==", studentId), where("grade", "==", grade), where("subject", "==", subject), limit(1)));
  if (!snap.empty) {
    const ex = snap.docs[0].data() as StudentProgress;
    const tests = (ex.testsCompleted ?? 0) + (patch.scoreToAdd !== undefined ? 1 : 0);
    const newScore = patch.scoreToAdd !== undefined && tests > 0
      ? Math.round(((ex.overallScore ?? 0) * (ex.testsCompleted ?? 0) + patch.scoreToAdd) / tests)
      : ex.overallScore ?? 0;
    await updateDoc(snap.docs[0].ref, {
      testsCompleted: tests,
      testsPassed: (ex.testsPassed ?? 0) + (patch.passed ? 1 : 0),
      materialsCompleted: (ex.materialsCompleted ?? 0) + (patch.materialCompleted ? 1 : 0),
      assignmentsCompleted: (ex.assignmentsCompleted ?? 0) + (patch.assignmentCompleted ? 1 : 0),
      overallScore: newScore,
      lastActivity: serverTimestamp(), updatedAt: serverTimestamp(),
    });
  } else {
    await addDoc(collection(db, "studentProgress"), {
      studentId, grade, subject,
      overallScore: patch.scoreToAdd ?? 0,
      testsCompleted: patch.scoreToAdd !== undefined ? 1 : 0,
      testsPassed: patch.passed ? 1 : 0,
      materialsCompleted: patch.materialCompleted ? 1 : 0,
      assignmentsCompleted: patch.assignmentCompleted ? 1 : 0,
      lastActivity: serverTimestamp(), updatedAt: serverTimestamp(),
    });
  }
}

// ─────────────────────────────────────────────────────────────
// MATERIAL COMPLETION
// ─────────────────────────────────────────────────────────────

export async function getMaterialCompletions(studentId: string, grade: string): Promise<MaterialCompletion[]> {
  const snap = await getDocs(query(collection(db, "materialCompletions"),
    where("studentId", "==", studentId), where("grade", "==", grade)));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as MaterialCompletion) }));
}

export async function markMaterialComplete(studentId: string, material: LearningMaterial): Promise<void> {
  const snap = await getDocs(query(collection(db, "materialCompletions"),
    where("studentId", "==", studentId), where("materialId", "==", material.id!), limit(1)));
  if (!snap.empty) return;
  await addDoc(collection(db, "materialCompletions"), {
    studentId, materialId: material.id, grade: material.grade,
    subject: material.subject, completedAt: serverTimestamp(),
  });
  await upsertStudentProgress(studentId, material.grade, material.subject, { materialCompleted: true });
  await incrementPlanUsage(studentId, { classes: 1 });
}

/** Bump plan quota usage (classes = lessons/materials, assessments = tests/assignments/quizzes). */
export async function incrementPlanUsage(
  studentId: string,
  delta: { classes?: number; assessments?: number; assignmentMinutes?: number }
): Promise<void> {
  const ref = doc(db, "students", studentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as Student;
  if (data.paymentStatus !== "paid" || !data.planQuota) return;
  const q = { ...data.planQuota };
  if (delta.classes) q.classesUsed = (q.classesUsed || 0) + delta.classes;
  if (delta.assessments) q.assessmentsUsed = (q.assessmentsUsed || 0) + delta.assessments;
  if (delta.assignmentMinutes) {
    q.assignmentMinutesUsed = (q.assignmentMinutesUsed || 0) + delta.assignmentMinutes;
  }
  const patch: Record<string, unknown> = {
    planQuota: q,
    updatedAt: serverTimestamp(),
  };
  // Soft-expire when quotas are fully used
  const { isQuotaExhausted } = await import("./planEntitlements");
  if (isQuotaExhausted({ ...data, planQuota: q })) {
    patch.paymentStatus = "expired";
  }
  await updateDoc(ref, patch);
}

export async function unmarkMaterialComplete(studentId: string, materialId: string): Promise<void> {
  const snap = await getDocs(query(collection(db, "materialCompletions"),
    where("studentId", "==", studentId), where("materialId", "==", materialId), limit(1)));
  if (!snap.empty) await deleteDoc(snap.docs[0].ref);
}

export function isMaterialCompleted(completions: MaterialCompletion[], materialId: string): boolean {
  return completions.some(c => c.materialId === materialId);
}

// ─────────────────────────────────────────────────────────────
// ANNOUNCEMENTS  (no composite index)
// ─────────────────────────────────────────────────────────────

export async function getAnnouncementsForStudent(grade: string): Promise<Announcement[]> {
  // Single where only — filter + sort client-side
  const snap = await getDocs(query(collection(db, "announcements"), where("published", "==", true)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as Announcement) }))
    .filter(a => a.targetGrades.length === 0 || a.targetGrades.includes(grade))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (b.createdAt as Timestamp)?.toMillis() - (a.createdAt as Timestamp)?.toMillis() || 0;
    });
}

// ─────────────────────────────────────────────────────────────
// SITE CONTENT (CMS)  — single where, no index needed
// ─────────────────────────────────────────────────────────────

export async function getSiteContent(section: string): Promise<Record<string, unknown> | null> {
  const snap = await getDocs(query(collection(db, "siteContent"), where("section", "==", section)));
  if (snap.empty) return null;

  // Prefer the most recently updated doc if duplicates exist
  const docs = [...snap.docs].sort((a, b) => {
    const aMs = (a.data().updatedAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
    const bMs = (b.data().updatedAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
    return bMs - aMs;
  });
  const raw = docs[0].data() as SiteContent & Record<string, unknown>;
  // Nested CMS shape: { section, data: { ... } }. Legacy flat docs fall back to top-level fields.
  if (raw.data && typeof raw.data === "object") return raw.data as Record<string, unknown>;
  const { section: _s, updatedAt: _u, id: _id, data: _d, ...flat } = raw;
  return flat;
}

export async function getPublishedTestimonials(): Promise<SiteTestimonial[]> {
  const snap = await getDocs(query(collection(db, "siteTestimonials"), where("published", "==", true)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as SiteTestimonial) }))
    .sort((a, b) => a.order - b.order);
}

export async function getPublishedPricingPlans(): Promise<SitePricingPlan[]> {
  const snap = await getDocs(query(collection(db, "sitePricingPlans"), where("published", "==", true)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as SitePricingPlan) }))
    .sort((a, b) => {
      const aFamily = (a.title || "").toLowerCase().includes("family") ? 0 : 1;
      const bFamily = (b.title || "").toLowerCase().includes("family") ? 0 : 1;
      if (aFamily !== bFamily) return aFamily - bFamily;
      return (a.order ?? 0) - (b.order ?? 0);
    });
}

export async function getPricingPlanById(id: string): Promise<SitePricingPlan | null> {
  const snap = await getDocs(query(collection(db, "sitePricingPlans"), where("id", "==", id), limit(1)));
  if (!snap.empty) {
    return { id: snap.docs[0].id, ...(snap.docs[0].data() as SitePricingPlan) };
  }

  const docSnap = await getDoc(doc(db, "sitePricingPlans", id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...(docSnap.data() as SitePricingPlan) };
}

export async function getPublishedFaqs(): Promise<SiteFaq[]> {
  const snap = await getDocs(query(collection(db, "siteFaqs"), where("published", "==", true)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as SiteFaq) }))
    .sort((a, b) => a.order - b.order);
}

export async function getPublishedClasses(): Promise<SiteClass[]> {
  const snap = await getDocs(query(collection(db, "siteClasses"), where("published", "==", true)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as SiteClass) }))
    .sort((a, b) => a.order - b.order);
}

export async function getPublishedServices(section?: string): Promise<SiteService[]> {
  const snap = await getDocs(query(collection(db, "siteServices"), where("published", "==", true)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as SiteService) }))
    .filter(s => !section || s.section === section)
    .sort((a, b) => a.order - b.order);
}

export async function getPublishedPartners(): Promise<SitePartner[]> {
  const snap = await getDocs(query(collection(db, "sitePartners"), where("published", "==", true)));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as SitePartner) }))
    .sort((a, b) => a.order - b.order);
}

// ─────────────────────────────────────────────────────────────
// AI QUESTION SETS (saved generator output)
// ─────────────────────────────────────────────────────────────

export interface AIQuestion {
  id: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "extended_response";
  text: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
  workedSolution?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  imageUrl?: string;        // optional diagram/illustration for the question
}

export interface QuestionSet {
  id?: string;
  title: string;
  curriculum: string;
  subject: string;
  year: string;
  topic: string;
  subtopic?: string;
  difficulty: string;
  format: string;
  context: string;
  questionCount: number;
  questions: AIQuestion[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface LearningGap {
  id?: string;
  studentId: string;
  subject: string;
  topic: string;
  subtopic?: string;
  accuracy: number;        // 0–100 percentage
  attemptCount: number;
  lastAttemptAt?: Timestamp;
  resolved: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** AI adaptive practice attempt — not NAPLAN/Selective exam-prep papers. */
export interface AiPracticeAttempt {
  id?: string;
  studentId: string;
  studentUid: string;
  questionSetId?: string;
  questions: AIQuestion[];
  answers: Record<string, string>;
  score: number;
  totalPoints: number;
  percentage: number;
  subject: string;
  topic: string;
  difficulty: string;
  submittedAt?: Timestamp;
}

// ── Question Set helpers (student portal — read only) ────────────────────

export async function getQuestionSetById(id: string): Promise<QuestionSet | null> {
  const snap = await getDoc(doc(db, "questionSets", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as QuestionSet) };
}

// ── Learning Gaps ────────────────────────────────────────────────────────

// Matches internal machine ids that older records mistakenly stored as
// topic/subtopic labels: "q3", "q12-sim1", UUIDs like
// "9f8cb890-228c-4b20-b0bd-ee853947d531" (optionally with a -sim suffix),
// and other long digit-containing ids (e.g. Firestore document ids).
const ID_LIKE_LABEL = new RegExp(
  [
    /^q\d+([-_]?sim\d*)?$/.source,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}([-_]?sim\d*)?$/.source,
    /^(?=.*\d)[A-Za-z0-9_-]{18,}$/.source,
  ].join("|"),
  "i"
);

/** Returns a human-readable topic label, replacing internal question ids. */
export function displayTopic(topic: string | undefined, subject?: string): string {
  const t = (topic ?? "").trim();
  if (!t || ID_LIKE_LABEL.test(t)) {
    return subject ? `${subject} — General Practice` : "General Practice";
  }
  return t;
}

export async function getLearningGaps(studentId: string): Promise<LearningGap[]> {
  const snap = await getDocs(query(
    collection(db, "learningGaps"),
    where("studentId", "==", studentId),
    where("resolved", "==", false)
  ));
  return snap.docs.map(d => {
    const data = d.data() as LearningGap;
    return {
      ...data,
      id: d.id,
      topic: displayTopic(data.topic, data.subject),
      subtopic: data.subtopic && ID_LIKE_LABEL.test(data.subtopic) ? undefined : data.subtopic,
    };
  }).sort((a, b) => a.accuracy - b.accuracy);  // worst gaps first
}

/** All topic records for a student — including resolved ones (used for skill-progress analytics). */
export async function getAllLearningGapsForStudent(studentId: string): Promise<LearningGap[]> {
  const snap = await getDocs(query(
    collection(db, "learningGaps"),
    where("studentId", "==", studentId)
  ));
  return snap.docs.map(d => {
    const data = d.data() as LearningGap;
    return {
      ...data,
      id: d.id,
      topic: displayTopic(data.topic, data.subject),
      subtopic: data.subtopic && ID_LIKE_LABEL.test(data.subtopic) ? undefined : data.subtopic,
    };
  }).sort((a, b) => b.accuracy - a.accuracy);
}

export async function upsertLearningGap(
  studentId: string, subject: string, topic: string, subtopic: string | undefined,
  accuracy: number
): Promise<void> {
  const q = query(collection(db, "learningGaps"),
    where("studentId", "==", studentId),
    where("subject", "==", subject),
    where("topic", "==", topic)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    const existing = snap.docs[0].data() as LearningGap;
    await updateDoc(snap.docs[0].ref, {
      accuracy,
      attemptCount: (existing.attemptCount ?? 0) + 1,
      resolved: accuracy >= 80,
      lastAttemptAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await addDoc(collection(db, "learningGaps"), {
      studentId, subject, topic, subtopic: subtopic ?? null,
      accuracy, attemptCount: 1, resolved: accuracy >= 80,
      lastAttemptAt: serverTimestamp(),
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
  }
}

// ── Study Sessions (time-online tracking) ────────────────────────────────
// One document per student per day: studySessions/{studentId}_{YYYY-MM-DD}

export interface StudySession {
  id?: string;
  studentId: string;
  date: string;             // "YYYY-MM-DD" (local)
  seconds: number;          // accumulated active seconds for that day
  updatedAt?: Timestamp;
}

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Adds active seconds to today's study session for the student. */
export async function recordStudyTime(studentId: string, seconds: number): Promise<void> {
  if (seconds <= 0) return;
  const date = localDateKey();
  await setDoc(doc(db, "studySessions", `${studentId}_${date}`), {
    studentId, date,
    seconds: increment(seconds),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  // Basic plan tracks assignment/session minutes toward the included hour
  if (seconds >= 30) {
    await incrementPlanUsage(studentId, {
      assignmentMinutes: Math.round(seconds / 60),
    }).catch(() => {});
  }
}

/** Study sessions for the last `days` days (including today), newest first. */
export async function getStudySessions(studentId: string, days = 30): Promise<StudySession[]> {
  const cutoff = localDateKey(new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000));
  const snap = await getDocs(query(
    collection(db, "studySessions"),
    where("studentId", "==", studentId)
  ));
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as StudySession) }))
    .filter(s => s.date >= cutoff)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Formats seconds as e.g. "2 hr 8 min" or "45 min". */
export function formatStudyTime(totalSeconds: number): string {
  const mins = Math.round(totalSeconds / 60);
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}

// ── AI Practice Attempts ────────────────────────────────────────────────────

function isExamPrepAttemptDoc(data: Record<string, unknown>): boolean {
  return Boolean(data.paperId || data.program === "naplan" || data.program === "selective");
}

export async function savePracticeAttempt(attempt: Omit<AiPracticeAttempt, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "practiceAttempts"), {
    ...attempt, submittedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPracticeAttempts(studentId: string): Promise<AiPracticeAttempt[]> {
  const snap = await getDocs(query(
    collection(db, "practiceAttempts"),
    where("studentId", "==", studentId)
  ));
  return snap.docs
    .map(d => {
      const data = d.data() as AiPracticeAttempt & Record<string, unknown>;
      return { ...data, id: d.id, topic: displayTopic(data.topic, data.subject) };
    })
    .filter((a) => !isExamPrepAttemptDoc(a as unknown as Record<string, unknown>))
    .sort((a, b) => (b.submittedAt as Timestamp)?.toMillis() - (a.submittedAt as Timestamp)?.toMillis() || 0);
}

// ── Online Sessions (Microsoft Teams) ────────────────────────────────────

export interface OnlineSession {
  id?: string;
  title: string;
  teamsUrl: string;
  startsAt: string;
  durationMinutes: number;
  endsAt: string;
  targetGrades: string[];
  createdBy?: string;
  notified?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function isOnlineSessionLive(session: OnlineSession, now = new Date()): boolean {
  const start = new Date(session.startsAt).getTime();
  const end = new Date(session.endsAt).getTime();
  const t = now.getTime();
  return t >= start && t <= end;
}

export async function getActiveOnlineSession(grade?: string): Promise<OnlineSession | null> {
  const snap = await getDocs(collection(db, "onlineSessions"));
  const sessions = snap.docs.map(d => ({ id: d.id, ...(d.data() as OnlineSession) }));
  const now = new Date();
  return sessions.find(s => {
    if (!isOnlineSessionLive(s, now)) return false;
    if (!s.targetGrades?.length) return true;
    if (!grade) return true;
    return s.targetGrades.includes(grade);
  }) ?? null;
}

/** Upcoming or live session for dashboard (live now, or starting within 24 hours). */
export async function getUpcomingOnlineSession(grade?: string): Promise<OnlineSession | null> {
  const snap = await getDocs(collection(db, "onlineSessions"));
  const sessions = snap.docs
    .map(d => ({ id: d.id, ...(d.data() as OnlineSession) }))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return sessions.find(s => {
    const start = new Date(s.startsAt).getTime();
    const end = new Date(s.endsAt).getTime();
    if (end < now) return false; // already finished
    const live = now >= start && now <= end;
    const soon = start > now && start - now <= day;
    if (!live && !soon) return false;
    if (!s.targetGrades?.length) return true;
    if (!grade) return true;
    return s.targetGrades.includes(grade);
  }) ?? null;
}
