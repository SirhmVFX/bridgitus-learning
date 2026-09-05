"use client";

import { useEffect, useMemo, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getAllStudentAttempts, getPracticeAttempts, getAllLearningGapsForStudent,
  getStudySessions, getTestsByGrade, getAssignmentsForStudent, getSubmissionsByStudent,
  getAssignmentById, upsertLearningGap, formatStudyTime,
  getStudentPracticeAttempts,
  type TestAttempt, type AiPracticeAttempt, type LearningGap,
  type StudySession, type Test, type Question, type AIQuestion,
  type Assignment, type AssignmentSubmission, type PracticeAttempt,
} from "@/lib/firestore";
import { Timestamp } from "firebase/firestore";
import {
  MdQuiz, MdTimer, MdExtension, MdAutoAwesome, MdSchool, MdEmojiEvents,
} from "react-icons/md";
import Link from "next/link";
import { PracticePieChart, SkillMountainChart } from "@/components/AnalyticsCharts";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface AnsweredQuestion {
  subject: string;
  topic: string;
  correct: boolean;
  answeredAt: Date | null;
  /** Where the question came from — used to split category pies. */
  source: "quiz" | "assignment" | "practice";
}

function tsToDate(ts: unknown): Date | null {
  if (!ts) return null;
  if (ts instanceof Date) return Number.isNaN(ts.getTime()) ? null : ts;
  if (ts instanceof Timestamp) return ts.toDate();
  const candidate = ts as {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
    _seconds?: number;
  };
  if (typeof candidate.toDate === "function") {
    try {
      const d = candidate.toDate();
      return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
    } catch {
      /* ignore */
    }
  }
  const seconds = candidate.seconds ?? candidate._seconds;
  if (typeof seconds === "number") return new Date(seconds * 1000);
  return null;
}

function isAnswerCorrect(q: Question | AIQuestion, given: string): boolean {
  const g = (given ?? "").trim().toLowerCase();
  const c = (q.correctAnswer ?? "").trim().toLowerCase();
  if (!g) return false;
  if (q.type === "short_answer" || (q as { type?: string }).type === "extended_response") {
    return g.includes(c);
  }
  return g === c;
}

function collectAnswered(
  attempts: TestAttempt[],
  practice: AiPracticeAttempt[],
  testsById: Map<string, Test>,
  quizSubs: AssignmentSubmission[] = [],
  assignmentsById: Map<string, Assignment> = new Map()
): AnsweredQuestion[] {
  const rows: AnsweredQuestion[] = [];
  for (const att of attempts) {
    const test = testsById.get(att.testId);
    if (!test) continue;
    const answeredAt = tsToDate(att.submittedAt);
    for (const q of test.questions ?? []) {
      const given = att.answers?.[q.id];
      if (given === undefined) continue;
      rows.push({
        subject: test.subject,
        topic: test.title,
        correct: isAnswerCorrect(q, given),
        answeredAt,
        source: "quiz",
      });
    }
  }
  for (const pa of practice) {
    const answeredAt = tsToDate(pa.submittedAt);
    for (const q of pa.questions ?? []) {
      const given = pa.answers?.[q.id];
      if (given === undefined) continue;
      rows.push({
        subject: pa.subject,
        topic: pa.topic,
        correct: isAnswerCorrect(q, given),
        answeredAt,
        source: "practice",
      });
    }
  }
  for (const sub of quizSubs) {
    if (sub.status !== "graded" && sub.status !== "submitted") continue;
    const assignment = assignmentsById.get(sub.assignmentId);
    const answeredAt =
      tsToDate(sub.submittedAt) ??
      tsToDate(sub.gradedAt) ??
      new Date();
    const subject = assignment?.subject ?? "Quiz";
    const topic = assignment?.title ?? "Assignment quiz";
    const questions = assignment?.questions ?? [];
    let matched = 0;
    for (const q of questions) {
      if (!q?.id) continue;
      const given = sub.answers?.[q.id];
      if (given === undefined) continue;
      matched++;
      rows.push({
        subject,
        topic,
        correct: isAnswerCorrect(q, given),
        answeredAt,
        source: "assignment",
      });
    }
    // Fallback when question IDs don't join (or assignment doc missing) but answers exist
    if (matched === 0 && sub.answers && Object.keys(sub.answers).length > 0) {
      for (const given of Object.values(sub.answers)) {
        if (given === undefined || given === null) continue;
        rows.push({
          subject,
          topic,
          correct: true,
          answeredAt,
          source: "assignment",
        });
      }
    } else if (
      matched === 0 &&
      typeof sub.score === "number" &&
      typeof sub.totalPoints === "number" &&
      sub.totalPoints > 0
    ) {
      const approx = Math.max(1, Math.round(sub.totalPoints));
      for (let i = 0; i < approx; i++) {
        rows.push({
          subject,
          topic,
          correct: i < (sub.score ?? 0),
          answeredAt,
          source: "assignment",
        });
      }
    }
  }
  return rows;
}

function buildCategoryRows(items: AnsweredQuestion[]) {
  const agg: Record<string, { subject: string; count: number }> = {};
  for (const a of items) {
    agg[a.topic] ??= { subject: a.subject, count: 0 };
    agg[a.topic].count++;
  }
  const total = items.length || 1;
  return Object.entries(agg)
    .map(([topic, v]) => ({
      topic,
      subject: v.subject,
      count: v.count,
      pct: Math.round((v.count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

/** IXL-style big digit boxes for the banner counter. */
function DigitBoxes({ value }: { value: number }) {
  return (
    <div className="flex gap-1.5">
      {String(value).split("").map((d, i) => (
        <span key={i} className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl bg-white text-secondary-color text-2xl sm:text-3xl font-black flex items-center justify-center">
          {d}
        </span>
      ))}
    </div>
  );
}

async function settledValue<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch (err) {
    console.error("Analytics load partial failure:", err);
    return fallback;
  }
}

export default function StudentAnalyticsPage() {
  const { student } = useStudentAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [practice, setPractice] = useState<AiPracticeAttempt[]>([]);
  const [gaps, setGaps] = useState<LearningGap[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizSubs, setQuizSubs] = useState<AssignmentSubmission[]>([]);
  const [naplanAttempts, setNaplanAttempts] = useState<PracticeAttempt[]>([]);
  const [selectiveAttempts, setSelectiveAttempts] = useState<PracticeAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id || !student?.grade) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const [att, pa, g, ss, t, asg, subs, naplan, selective] = await Promise.all([
        settledValue(getAllStudentAttempts(student.id!), []),
        settledValue(getPracticeAttempts(student.id!), []),
        settledValue(getAllLearningGapsForStudent(student.id!), []),
        settledValue(getStudySessions(student.id!, 366), []),
        settledValue(getTestsByGrade(student.grade), []),
        settledValue(getAssignmentsForStudent(student.grade, student.id!), []),
        settledValue(getSubmissionsByStudent(student.id!), []),
        settledValue(getStudentPracticeAttempts(student.id!, "naplan"), []),
        settledValue(getStudentPracticeAttempts(student.id!, "selective"), []),
      ]);

      const quizAssignments = asg.filter((a) => a.type === "quiz");
      const byId = new Map(quizAssignments.filter((a) => a.id).map((a) => [a.id!, a]));

      // Pull any graded quiz assignment docs not returned by grade targeting
      const missingIds = [
        ...new Set(
          subs
            .filter((s) => s.status === "graded" || s.status === "submitted")
            .map((s) => s.assignmentId)
            .filter((id) => id && !byId.has(id))
        ),
      ];
      if (missingIds.length) {
        const fetched = await Promise.all(
          missingIds.map((id) => settledValue(getAssignmentById(id), null))
        );
        for (const a of fetched) {
          if (a?.id && a.type === "quiz") byId.set(a.id, a);
        }
      }

      // Backfill skill gaps from graded quizzes that never wrote learningGaps
      let gapsOut = g;
      const gapTopics = new Set(g.map((gap) => `${gap.subject}::${gap.topic}`));
      const backfills: Promise<unknown>[] = [];
      for (const sub of subs) {
        if (sub.status !== "graded" && sub.status !== "submitted") continue;
        const assignment = byId.get(sub.assignmentId);
        if (!assignment?.questions?.length) continue;
        const topic = assignment.title || assignment.subject;
        const key = `${assignment.subject}::${topic}`;
        if (gapTopics.has(key)) continue;
        let correct = 0;
        let total = 0;
        for (const q of assignment.questions) {
          const given = sub.answers?.[q.id];
          if (given === undefined) continue;
          total++;
          if (isAnswerCorrect(q, given)) correct++;
        }
        if (total === 0) continue;
        const accuracy = Math.round((correct / total) * 100);
        gapTopics.add(key);
        backfills.push(
          settledValue(
            upsertLearningGap(student.id!, assignment.subject, topic, undefined, accuracy),
            undefined
          )
        );
      }
      if (backfills.length) {
        await Promise.all(backfills);
        gapsOut = await settledValue(getAllLearningGapsForStudent(student.id!), g);
      }

      if (cancelled) return;
      setAttempts(att);
      setPractice(pa);
      setGaps(gapsOut);
      setSessions(ss);
      setTests(t);
      setAssignments([...byId.values()]);
      setQuizSubs(subs);
      setNaplanAttempts(naplan);
      setSelectiveAttempts(selective);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [student]);

  const testsById = useMemo(() => new Map(tests.map(t => [t.id!, t])), [tests]);
  const assignmentsById = useMemo(() => new Map(assignments.map(a => [a.id!, a])), [assignments]);
  const answered = useMemo(
    () => collectAnswered(attempts, practice, testsById, quizSubs, assignmentsById),
    [attempts, practice, testsById, quizSubs, assignmentsById]
  );

  const currentYear = new Date().getFullYear();
  // Include undated answers in "this year" so quiz rows aren't dropped when submittedAt is missing
  const answeredThisYear = answered.filter(
    (a) => !a.answeredAt || a.answeredAt.getFullYear() === currentYear
  );

  // Time spent (from study sessions — active time in the portal)
  const yearSeconds = sessions
    .filter(s => s.date.startsWith(String(currentYear)))
    .reduce((sum, s) => sum + (s.seconds ?? 0), 0);
  const todayKey = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const todaySeconds = sessions.filter(s => s.date === todayKey).reduce((sum, s) => sum + (s.seconds ?? 0), 0);
  const weekCutoff = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA");
  const weekSeconds = sessions.filter(s => s.date >= weekCutoff).reduce((sum, s) => sum + (s.seconds ?? 0), 0);

  // Skill progress tiers (topics tracked in learning gaps)
  const skillsPractised = gaps.length;
  const skillsProficient = gaps.filter(g => g.accuracy >= 80 && g.accuracy < 95).length;
  const skillsMastered = gaps.filter(g => g.accuracy >= 95).length;
  const skillsProgressed = gaps.filter(g => g.resolved || g.accuracy >= 80).length;

  // Practice by category — tests alone vs quiz assignments + AI practice
  const quizCategoryRows = useMemo(
    () => buildCategoryRows(answered.filter((a) => a.source === "quiz")),
    [answered]
  );
  const assignmentCategoryRows = useMemo(
    () => buildCategoryRows(answered.filter((a) => a.source === "assignment" || a.source === "practice")),
    [answered]
  );

  // Practice by month (current year)
  const monthCounts = useMemo(() => {
    const counts = new Array(12).fill(0) as number[];
    const nowMonth = new Date().getMonth();
    for (const a of answeredThisYear) {
      if (a.answeredAt) counts[a.answeredAt.getMonth()]++;
      else counts[nowMonth]++; // undated → count in current month
    }
    return counts;
  }, [answeredThisYear]);
  const maxMonth = Math.max(...monthCounts, 1);

  return (
    <PortalLayout>
      <div className="w-full space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">Insights</p>
          <h1 className="text-2xl lg:text-[1.75rem] font-extrabold text-[#001233] tracking-tight">My Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Your learning activity, time spent and skill progress</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="portal-card h-36 animate-pulse bg-slate-100" />
            <div className="grid sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="stat-card h-28 animate-pulse bg-slate-100" />)}
            </div>
          </div>
        ) : (
          <>
            {/* IXL-style banner */}
            <div className="rounded-2xl bg-gradient-to-br from-[#001233] via-[#00369b] to-[#0050c8] text-white p-6/20">
              <div className="flex items-center justify-center flex-wrap gap-4 text-center">
                <p className="text-sm sm:text-base font-bold uppercase tracking-wide">
                  This year, you&apos;ve answered
                </p>
                <DigitBoxes value={answeredThisYear.length} />
                <p className="text-sm sm:text-base font-bold uppercase tracking-wide">questions!</p>
              </div>
            </div>

            {/* Summary tiles */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="stat-card">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Answered</p>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <MdQuiz size={18} className="text-emerald-600" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-[#001233] mt-3 tracking-tight">{answeredThisYear.length}</p>
                <p className="text-xs text-slate-400 mt-1">questions this year</p>
              </div>
              <div className="stat-card">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Spent</p>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MdTimer size={18} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-[#001233] mt-3 tracking-tight">{formatStudyTime(yearSeconds)}</p>
                <p className="text-xs text-slate-400 mt-1">learning this year</p>
              </div>
              <div className="stat-card">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Made progress in</p>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <MdExtension size={18} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-[#001233] mt-3 tracking-tight">{skillsProgressed}</p>
                <p className="text-xs text-slate-400 mt-1">skills</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Skill progress mountain */}
              <div className="portal-card">
                <SkillMountainChart
                  mastered={skillsMastered}
                  proficient={skillsProficient}
                  practised={skillsPractised}
                />
                {skillsPractised === 0 && (
                  <p className="text-xs text-slate-400 mt-4">
                    Complete tests, quiz assignments, or{" "}
                    <Link href="/portal/practice" className="text-purple-700 font-semibold underline">AI practice</Link>
                    {" "}to start tracking your skills.
                  </p>
                )}
              </div>

              {/* Time spent */}
              <div className="portal-card">
                <h2 className="font-semibold text-[#001233] mb-4 flex items-center gap-2">
                  <MdTimer size={16} className="text-blue-600" /> Time Spent
                </h2>
                <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
                  <div className="px-2">
                    <p className="text-xl font-black text-[#001233]">{formatStudyTime(todaySeconds)}</p>
                    <p className="text-xs text-slate-400 mt-1">Today</p>
                  </div>
                  <div className="px-2">
                    <p className="text-xl font-black text-[#001233]">{formatStudyTime(weekSeconds)}</p>
                    <p className="text-xs text-slate-400 mt-1">Last 7 days</p>
                  </div>
                  <div className="px-2">
                    <p className="text-xl font-black text-[#001233]">{formatStudyTime(yearSeconds)}</p>
                    <p className="text-xs text-slate-400 mt-1">This year</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">
                  Active time in your portal — tracked automatically while you learn.
                </p>
              </div>
            </div>

            {/* Exam prep analytics */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="portal-card">
                <h2 className="font-semibold text-[#001233] mb-1 flex items-center gap-2">
                  <MdSchool size={16} className="text-[#00369b]" /> NAPLAN Practice
                </h2>
                <p className="text-xs text-slate-400 mb-4">Years 2–9 exam prep attempts</p>
                {naplanAttempts.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">
                    No NAPLAN attempts yet — try{" "}
                    <Link href="/portal/naplan" className="text-secondary-color font-semibold underline">
                      NAPLAN practice
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-extrabold text-[#001233]">{naplanAttempts.length}</p>
                        <p className="text-xs text-slate-400">Attempts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-[#001233]">
                          {naplanAttempts.filter((a) => a.status === "graded").length}
                        </p>
                        <p className="text-xs text-slate-400">Graded</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-[#001233]">
                          {(() => {
                            const graded = naplanAttempts.filter(
                              (a) => typeof a.percentage === "number",
                            );
                            if (!graded.length) return "—";
                            return `${Math.round(
                              graded.reduce((s, a) => s + (a.percentage ?? 0), 0) / graded.length,
                            )}%`;
                          })()}
                        </p>
                        <p className="text-xs text-slate-400">Avg score</p>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {naplanAttempts.slice(0, 5).map((a) => (
                        <div key={a.id} className="flex items-center justify-between py-2 text-sm">
                          <span className="font-medium text-slate-800 truncate max-w-[60%]">
                            {a.paperTitle ?? "Paper"}
                          </span>
                          <span className="text-slate-500">
                            {typeof a.percentage === "number" ? `${a.percentage}%` : a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="portal-card">
                <h2 className="font-semibold text-[#001233] mb-1 flex items-center gap-2">
                  <MdEmojiEvents size={16} className="text-amber-500" /> Selective Entry Prep
                </h2>
                <p className="text-xs text-slate-400 mb-4">Years 8–9 exam prep attempts</p>
                {selectiveAttempts.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">
                    No Selective attempts yet — try{" "}
                    <Link href="/portal/selective" className="text-secondary-color font-semibold underline">
                      Selective Entry prep
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-extrabold text-[#001233]">{selectiveAttempts.length}</p>
                        <p className="text-xs text-slate-400">Attempts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-[#001233]">
                          {selectiveAttempts.filter((a) => a.status === "graded").length}
                        </p>
                        <p className="text-xs text-slate-400">Graded</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-[#001233]">
                          {(() => {
                            const graded = selectiveAttempts.filter(
                              (a) => typeof a.percentage === "number",
                            );
                            if (!graded.length) return "—";
                            return `${Math.round(
                              graded.reduce((s, a) => s + (a.percentage ?? 0), 0) / graded.length,
                            )}%`;
                          })()}
                        </p>
                        <p className="text-xs text-slate-400">Avg score</p>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {selectiveAttempts.slice(0, 5).map((a) => (
                        <div key={a.id} className="flex items-center justify-between py-2 text-sm">
                          <span className="font-medium text-slate-800 truncate max-w-[60%]">
                            {a.paperTitle ?? "Paper"}
                          </span>
                          <span className="text-slate-500">
                            {typeof a.percentage === "number" ? `${a.percentage}%` : a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Practice by category — separate quiz vs assignment pies */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="portal-card">
                <h2 className="font-semibold text-[#001233] mb-1">Quizzes by Category</h2>
                <p className="text-xs text-slate-400 mb-4">Portal tests only</p>
                {quizCategoryRows.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">
                    No quiz data yet — try a{" "}
                    <Link href="/portal/tests" className="text-secondary-color font-semibold underline">portal test</Link>.
                  </p>
                ) : (
                  <PracticePieChart rows={quizCategoryRows} />
                )}
              </div>

              <div className="portal-card">
                <h2 className="font-semibold text-[#001233] mb-1">Assignments by Category</h2>
                <p className="text-xs text-slate-400 mb-4">Quiz assignments &amp; AI practice</p>
                {assignmentCategoryRows.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">
                    No data yet — complete a{" "}
                    <Link href="/portal/assignments" className="text-secondary-color font-semibold underline">quiz assignment</Link>
                    {" "}or{" "}
                    <Link href="/portal/practice" className="text-purple-700 font-semibold underline">AI practice</Link>.
                  </p>
                ) : (
                  <PracticePieChart rows={assignmentCategoryRows} />
                )}
              </div>
            </div>

            {/* Practice by month */}
            <div className="portal-card">
              <h2 className="font-semibold text-[#001233] mb-4">Practice by Month · {currentYear}</h2>
              <div className="flex items-end gap-1.5 h-44">
                {monthCounts.map((count, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                    {count > 0 && <span className="text-[10px] font-bold text-gray-600">{count}</span>}
                    <div className="w-full bg-[#00c1ff] rounded-t-md transition-all duration-500"
                      style={{ height: `${(count / maxMonth) * 100}%`, minHeight: count > 0 ? 3 : 0 }} />
                    <span className="text-[10px] text-slate-400">{MONTH_LABELS[i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">Questions from tests, quiz assignments &amp; AI practice</p>
            </div>

            {/* Practice CTA */}
            <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-purple-900 font-medium flex items-center gap-2">
                <MdAutoAwesome size={16} /> Keep your streak going — practise your weakest topics now.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/portal/assignments"
                  className="rounded-xl border border-purple-300 text-purple-800 text-sm font-bold px-4 py-2 hover:bg-purple-100 transition-colors">
                  Quiz Assignments
                </Link>
                <Link href="/portal/practice"
                  className="rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold px-4 py-2 transition-colors">
                  Start AI Practice
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
