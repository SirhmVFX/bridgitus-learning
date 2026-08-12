"use client";

import { useEffect, useMemo, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getAllStudentAttempts, getPracticeAttempts, getAllLearningGapsForStudent,
  getStudySessions, getTestsByGrade, formatStudyTime,
  type TestAttempt, type PracticeAttempt, type LearningGap,
  type StudySession, type Test, type Question, type AIQuestion,
} from "@/lib/firestore";
import { Timestamp } from "firebase/firestore";
import {
  MdQuiz, MdTimer, MdExtension, MdAutoAwesome,
} from "react-icons/md";
import Link from "next/link";
import { PracticePieChart, SkillMountainChart } from "@/components/AnalyticsCharts";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface AnsweredQuestion {
  subject: string;
  topic: string;
  correct: boolean;
  answeredAt: Date | null;
}

function tsToDate(ts: unknown): Date | null {
  if (ts instanceof Timestamp) return ts.toDate();
  const candidate = ts as { toDate?: () => Date } | null;
  if (candidate && typeof candidate.toDate === "function") return candidate.toDate();
  return null;
}

function isAnswerCorrect(q: Question | AIQuestion, given: string): boolean {
  const g = (given ?? "").trim().toLowerCase();
  const c = (q.correctAnswer ?? "").trim().toLowerCase();
  if (!g) return false;
  if (q.type === "short_answer" || q.type === "extended_response") return g.includes(c);
  return g === c;
}

function collectAnswered(
  attempts: TestAttempt[],
  practice: PracticeAttempt[],
  testsById: Map<string, Test>
): AnsweredQuestion[] {
  const rows: AnsweredQuestion[] = [];
  for (const att of attempts) {
    const test = testsById.get(att.testId);
    if (!test) continue;
    const answeredAt = tsToDate(att.submittedAt);
    for (const q of test.questions ?? []) {
      const given = att.answers?.[q.id];
      if (given === undefined) continue;
      rows.push({ subject: test.subject, topic: test.title, correct: isAnswerCorrect(q, given), answeredAt });
    }
  }
  for (const pa of practice) {
    const answeredAt = tsToDate(pa.submittedAt);
    for (const q of pa.questions ?? []) {
      const given = pa.answers?.[q.id];
      if (given === undefined) continue;
      rows.push({ subject: pa.subject, topic: pa.topic, correct: isAnswerCorrect(q, given), answeredAt });
    }
  }
  return rows;
}

/** IXL-style big digit boxes for the banner counter. */
function DigitBoxes({ value }: { value: number }) {
  return (
    <div className="flex gap-1.5">
      {String(value).split("").map((d, i) => (
        <span key={i} className="w-10 h-12 sm:w-12 sm:h-14 bg-white text-secondary-color text-2xl sm:text-3xl font-black flex items-center justify-center shadow-sm">
          {d}
        </span>
      ))}
    </div>
  );
}

export default function StudentAnalyticsPage() {
  const { student } = useStudentAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [practice, setPractice] = useState<PracticeAttempt[]>([]);
  const [gaps, setGaps] = useState<LearningGap[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id || !student?.grade) return;
    Promise.all([
      getAllStudentAttempts(student.id!),
      getPracticeAttempts(student.id!),
      getAllLearningGapsForStudent(student.id!),
      getStudySessions(student.id!, 366),
      getTestsByGrade(student.grade),
    ])
      .then(([att, pa, g, ss, t]) => {
        setAttempts(att); setPractice(pa); setGaps(g); setSessions(ss); setTests(t);
      })
      .finally(() => setLoading(false));
  }, [student]);

  const testsById = useMemo(() => new Map(tests.map(t => [t.id!, t])), [tests]);
  const answered = useMemo(
    () => collectAnswered(attempts, practice, testsById),
    [attempts, practice, testsById]
  );

  const currentYear = new Date().getFullYear();
  const answeredThisYear = answered.filter(a => a.answeredAt && a.answeredAt.getFullYear() === currentYear);

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

  // Practice by category (topic share of all answered questions)
  const categoryRows = useMemo(() => {
    const agg: Record<string, { subject: string; count: number }> = {};
    for (const a of answered) {
      agg[a.topic] ??= { subject: a.subject, count: 0 };
      agg[a.topic].count++;
    }
    const total = answered.length || 1;
    return Object.entries(agg)
      .map(([topic, v]) => ({ topic, subject: v.subject, count: v.count, pct: Math.round((v.count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [answered]);

  // Practice by month (current year)
  const monthCounts = useMemo(() => {
    const counts = new Array(12).fill(0) as number[];
    for (const a of answeredThisYear) {
      if (a.answeredAt) counts[a.answeredAt.getMonth()]++;
    }
    return counts;
  }, [answeredThisYear]);
  const maxMonth = Math.max(...monthCounts, 1);

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your learning activity, time spent and skill progress</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="bg-white border h-36 animate-pulse" />
            <div className="grid sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-white border h-28 animate-pulse" />)}
            </div>
          </div>
        ) : (
          <>
            {/* IXL-style banner */}
            <div className="bg-secondary-color text-white p-6">
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
              <div className="bg-white border border-gray-200 p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-emerald-50 flex items-center justify-center shrink-0">
                  <MdQuiz size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Answered</p>
                  <p className="text-2xl font-black text-gray-900">{answeredThisYear.length}</p>
                  <p className="text-xs text-gray-400">questions this year</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-50 flex items-center justify-center shrink-0">
                  <MdTimer size={22} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Spent</p>
                  <p className="text-2xl font-black text-gray-900">{formatStudyTime(yearSeconds)}</p>
                  <p className="text-xs text-gray-400">learning this year</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-purple-50 flex items-center justify-center shrink-0">
                  <MdExtension size={22} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Made progress in</p>
                  <p className="text-2xl font-black text-gray-900">{skillsProgressed}</p>
                  <p className="text-xs text-gray-400">skills</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Skill progress mountain */}
              <div className="bg-white border border-gray-200 p-5">
                <SkillMountainChart
                  mastered={skillsMastered}
                  proficient={skillsProficient}
                  practised={skillsPractised}
                />
                {skillsPractised === 0 && (
                  <p className="text-xs text-gray-400 mt-4">
                    Complete <Link href="/portal/practice" className="text-purple-700 font-semibold underline">AI practice sessions</Link> to start tracking your skills.
                  </p>
                )}
              </div>

              {/* Time spent */}
              <div className="bg-white border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MdTimer size={16} className="text-blue-600" /> Time Spent
                </h2>
                <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
                  <div className="px-2">
                    <p className="text-xl font-black text-gray-900">{formatStudyTime(todaySeconds)}</p>
                    <p className="text-xs text-gray-400 mt-1">Today</p>
                  </div>
                  <div className="px-2">
                    <p className="text-xl font-black text-gray-900">{formatStudyTime(weekSeconds)}</p>
                    <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                  </div>
                  <div className="px-2">
                    <p className="text-xl font-black text-gray-900">{formatStudyTime(yearSeconds)}</p>
                    <p className="text-xs text-gray-400 mt-1">This year</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Active time in your portal — tracked automatically while you learn.
                </p>
              </div>
            </div>

            {/* Practice by category — pie chart */}
            <div className="bg-white border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Practice by Category</h2>
              {categoryRows.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">
                  No practice data yet — try an <Link href="/portal/practice" className="text-purple-700 font-semibold underline">AI practice session</Link> or a test.
                </p>
              ) : (
                <PracticePieChart rows={categoryRows} />
              )}
            </div>

            {/* Practice by month */}
            <div className="bg-white border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Practice by Month · {currentYear}</h2>
              <div className="flex items-end gap-1.5 h-44">
                {monthCounts.map((count, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                    {count > 0 && <span className="text-[10px] font-bold text-gray-600">{count}</span>}
                    <div className="w-full bg-[#00c1ff] transition-all duration-500"
                      style={{ height: `${(count / maxMonth) * 100}%`, minHeight: count > 0 ? 3 : 0 }} />
                    <span className="text-[10px] text-gray-400">{MONTH_LABELS[i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Questions answered per month</p>
            </div>

            {/* Practice CTA */}
            <div className="bg-purple-50 border border-purple-200 p-4 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-purple-900 font-medium flex items-center gap-2">
                <MdAutoAwesome size={16} /> Keep your streak going — practise your weakest topics now.
              </p>
              <Link href="/portal/practice"
                className="bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold px-4 py-2 transition-colors">
                Start AI Practice
              </Link>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
