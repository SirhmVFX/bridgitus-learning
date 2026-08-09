"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getAllStudentAttempts,
  getStudentProgress,
  getAssignmentsForStudent,
  getSubmission,
  getMaterialsByGrade,
  getMaterialCompletions,
  isMaterialCompleted,
  getLearningGaps,
  getPracticeAttempts,
  type TestAttempt,
  type StudentProgress,
  type Assignment,
  type LearningMaterial,
  type MaterialCompletion,
  type LearningGap,
  type PracticeAttempt,
} from "@/lib/firestore";
import {
  MdBarChart, MdTrendingUp, MdEmojiEvents, MdMenuBook,
  MdAutoAwesome, MdWarning, MdCheckCircle,
} from "react-icons/md";
import Link from "next/link";

// ── Badges ─────────────────────────────────────────────────

interface Badge { id: string; icon: string; label: string; description: string; earned: boolean; }

function buildBadges(
  approvedAttempts: TestAttempt[],
  assignmentsCompleted: number,
  avgScore: number,
  materialsCompleted: number
): Badge[] {
  const passed = approvedAttempts.filter((a) => a.passed).length;
  const perfect = approvedAttempts.filter((a) => a.percentage === 100).length;
  return [
    { id: "first_material", icon: "📖", label: "First Read", description: "Completed your first material", earned: materialsCompleted >= 1 },
    { id: "five_materials", icon: "📚", label: "Bookworm", description: "Completed 5 materials", earned: materialsCompleted >= 5 },
    { id: "first_test", icon: "🎯", label: "First Test", description: "Completed your first test", earned: approvedAttempts.length >= 1 },
    { id: "five_tests", icon: "📝", label: "Test Taker", description: "Completed 5 tests", earned: approvedAttempts.length >= 5 },
    { id: "ten_tests", icon: "🏅", label: "Dedicated Learner", description: "Completed 10 tests", earned: approvedAttempts.length >= 10 },
    { id: "first_pass", icon: "✅", label: "First Pass", description: "Passed your first test", earned: passed >= 1 },
    { id: "five_pass", icon: "🌟", label: "Consistent", description: "Passed 5 tests", earned: passed >= 5 },
    { id: "perfect", icon: "💯", label: "Perfect Score", description: "Achieved 100% on a test", earned: perfect >= 1 },
    { id: "high_avg", icon: "🏆", label: "High Achiever", description: "Avg score 80%+ across 3+ tests", earned: avgScore >= 80 && approvedAttempts.length >= 3 },
    { id: "assignment_pro", icon: "🎓", label: "Assignment Pro", description: "Completed 10 assignments", earned: assignmentsCompleted >= 10 },
  ];
}

// ── Score Ring ─────────────────────────────────────────────

function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 40; const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-22 h-22 w-20 h-20">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={circ - (value / 100) * circ}
            strokeLinecap="butt" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{value}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 font-medium text-center">{label}</p>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────

export default function ProgressPage() {
  const { student } = useStudentAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [completions, setCompletions] = useState<MaterialCompletion[]>([]);
  const [assignmentsCompleted, setAssignmentsCompleted] = useState(0);
  const [gaps, setGaps] = useState<LearningGap[]>([]);
  const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id || !student?.grade) return;
    async function load() {
      const [att, prog, ass, mats, comps, gapData, practiceData] = await Promise.all([
        getAllStudentAttempts(student!.id!),
        getStudentProgress(student!.id!),
        getAssignmentsForStudent(student!.grade, student!.id!),
        getMaterialsByGrade(student!.grade),
        getMaterialCompletions(student!.id!, student!.grade),
        getLearningGaps(student!.id!),
        getPracticeAttempts(student!.id!),
      ]);
      setAttempts(att); setProgress(prog); setAssignments(ass);
      setMaterials(mats); setCompletions(comps);
      setGaps(gapData); setPracticeAttempts(practiceData);

      let completed = 0;
      for (const a of ass) {
        const sub = await getSubmission(a.id!, student!.id!);
        if (sub && (sub.status === "submitted" || sub.status === "graded")) completed++;
      }
      setAssignmentsCompleted(completed);
      setLoading(false);
    }
    load();
  }, [student]);

  const approvedAttempts = attempts.filter((a) => a.status === "approved");
  const avgScore = approvedAttempts.length > 0
    ? Math.round(approvedAttempts.reduce((s, a) => s + a.percentage, 0) / approvedAttempts.length) : 0;
  const passRate = approvedAttempts.length > 0
    ? Math.round((approvedAttempts.filter((a) => a.passed).length / approvedAttempts.length) * 100) : 0;

  const totalMats = materials.length;
  const doneMats = materials.filter((m) => isMaterialCompleted(completions, m.id!)).length;
  const matPct = totalMats > 0 ? Math.round((doneMats / totalMats) * 100) : 0;

  const credibilityScore = Math.min(100, Math.round(
    avgScore * 0.35 + passRate * 0.25 + matPct * 0.2 + Math.min(assignmentsCompleted * 4, 20)
  ));
  const credLevel =
    credibilityScore >= 80 ? { label: "Outstanding", color: "#22c55e" } :
      credibilityScore >= 60 ? { label: "Proficient", color: "#3b82f6" } :
        credibilityScore >= 40 ? { label: "Developing", color: "#f59e0b" } :
          { label: "Beginner", color: "#94a3b8" };

  const badges = buildBadges(approvedAttempts, assignmentsCompleted, avgScore, doneMats);
  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track your academic performance and credibility</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white border h-36 animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* Credibility hero card */}
            <div className="bg-secondary-color p-6 text-white">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Academic Credibility Score</p>
                  <div className="flex items-end gap-3">
                    <p className="text-6xl font-black">{credibilityScore}</p>
                    <span className="mb-1.5 bg-white/20 text-white text-sm font-bold px-3 py-0.5">
                      {credLevel.label}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Test scores · Pass rate · Materials · Assignments
                  </p>
                  {earnedBadges.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {earnedBadges.map((b) => (
                        <span key={b.id} title={b.description}
                          className="bg-white/20 px-2 py-1 text-xs font-medium flex items-center gap-1">
                          {b.icon} {b.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-5">
                  <ScoreRing value={avgScore} label="Avg Score" color="#00c1ff" />
                  <ScoreRing value={passRate} label="Pass Rate" color="#4ade80" />
                  <ScoreRing value={matPct} label="Materials" color="#f59e0b" />
                </div>
              </div>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Tests Taken", value: approvedAttempts.length, icon: "📝", c: "bg-blue-50 text-blue-600" },
                { label: "Tests Passed", value: approvedAttempts.filter((a) => a.passed).length, icon: "✅", c: "bg-emerald-50 text-emerald-600" },
                { label: "Materials Done", value: `${doneMats}/${totalMats}`, icon: "📖", c: "bg-indigo-50 text-indigo-600" },
                { label: "Assignments Done", value: assignmentsCompleted, icon: "✏️", c: "bg-amber-50 text-amber-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 p-4 flex flex-col items-center text-center">
                  <div className={`w-9 h-9 flex items-center justify-center text-base mb-2 ${s.c}`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Materials progress */}
            {totalMats > 0 && (
              <div className="bg-white border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MdMenuBook size={16} className="text-indigo-500" />
                    Materials Progress
                  </h2>
                  <span className="text-sm font-bold text-gray-900">{matPct}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 mb-4">
                  <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${matPct}%` }} />
                </div>
                <div className="space-y-2">
                  {materials.map((m) => {
                    const done = isMaterialCompleted(completions, m.id!);
                    return (
                      <div key={m.id} className={`flex items-center justify-between px-3 py-2 text-sm ${done ? "bg-emerald-50" : "bg-gray-50"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 flex items-center justify-center text-xs font-bold ${done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                            {done ? "✓" : ""}
                          </span>
                          <span className={done ? "text-emerald-800 font-medium" : "text-gray-500"}>{m.title}</span>
                        </div>
                        <span className="text-xs text-gray-400">{m.subject}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subject progress */}
            {progress.length > 0 && (
              <div className="bg-white border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MdBarChart size={16} className="text-secondary-color" /> Progress by Subject
                </h2>
                <div className="space-y-4">
                  {progress.map((p) => (
                    <div key={p.id}>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm text-gray-700 font-medium">{p.subject} · Grade {p.grade}</p>
                        <p className="text-sm font-bold text-gray-900">{p.overallScore}%</p>
                      </div>
                      <div className="h-2.5 bg-gray-100">
                        <div className="h-full transition-all duration-700" style={{
                          width: `${p.overallScore}%`,
                          background: p.overallScore >= 80 ? "#22c55e" : p.overallScore >= 60 ? "#3b82f6" : p.overallScore >= 40 ? "#f59e0b" : "#ef4444"
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test history */}
            {approvedAttempts.length > 0 && (
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <MdTrendingUp size={16} className="text-secondary-color" />
                  <h2 className="font-semibold text-gray-900">Test History</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {approvedAttempts.map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{a.testTitle ?? "Test"}</p>
                        <p className="text-xs text-gray-400">Attempt #{a.attemptNumber}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-bold ${a.passed ? "text-emerald-600" : "text-red-500"}`}>{a.percentage}%</p>
                          <p className="text-xs text-gray-400">{a.score}/{a.totalPoints} pts</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 ${a.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                          {a.passed ? "Pass" : "Fail"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Gaps Panel */}
            {(() => {
              // Build topic accuracy from test attempts + practice attempts combined
              const topicMap: Record<string, { subject: string; scores: number[] }> = {};
              for (const g of gaps) {
                if (!topicMap[g.topic]) topicMap[g.topic] = { subject: g.subject, scores: [] };
                topicMap[g.topic].scores.push(g.accuracy);
              }
              for (const pa of practiceAttempts) {
                const key = pa.topic;
                if (!topicMap[key]) topicMap[key] = { subject: pa.subject, scores: [] };
                topicMap[key].scores.push(pa.percentage);
              }
              const topicRows = Object.entries(topicMap).map(([topic, { subject, scores }]) => ({
                topic, subject,
                accuracy: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
              })).sort((a, b) => a.accuracy - b.accuracy);

              const gapColor = (acc: number) =>
                acc < 40 ? { bar: "#ef4444", badge: "bg-red-100 text-red-700", icon: "🔴" } :
                  acc < 60 ? { bar: "#f59e0b", badge: "bg-amber-100 text-amber-700", icon: "🟡" } :
                    acc < 80 ? { bar: "#3b82f6", badge: "bg-blue-100 text-blue-700", icon: "🔵" } :
                      { bar: "#22c55e", badge: "bg-emerald-100 text-emerald-700", icon: "🟢" };

              if (topicRows.length === 0 && gaps.length === 0) return null;

              return (
                <div className="bg-white border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MdAutoAwesome size={16} className="text-purple-600" /> Topic Accuracy &amp; Learning Gaps
                    </h2>
                    <Link href="/portal/practice"
                      className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1">
                      <MdAutoAwesome size={12} /> Practice weak topics →
                    </Link>
                  </div>

                  {topicRows.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200">
                      <MdCheckCircle size={20} className="text-emerald-600 shrink-0" />
                      <p className="text-sm text-emerald-800 font-medium">No active learning gaps. Great work!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topicRows.map(({ topic, subject, accuracy }) => {
                        const c = gapColor(accuracy);
                        return (
                          <div key={topic}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{c.icon}</span>
                                <p className="text-sm font-medium text-gray-800">{topic}</p>
                                <span className="text-xs text-gray-400">{subject}</span>
                              </div>
                              <span className={`text-xs font-bold px-2 py-0.5 ${c.badge}`}>{accuracy}%</span>
                            </div>
                            <div className="h-2 bg-gray-100">
                              <div className="h-full transition-all duration-700" style={{ width: `${accuracy}%`, background: c.bar }} />
                            </div>
                          </div>
                        );
                      })}
                      {gaps.filter(g => g.accuracy < 60).length > 0 && (
                        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 px-3 py-2">
                          <MdWarning size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800">
                            You have <strong>{gaps.filter(g => g.accuracy < 60).length}</strong> topic{gaps.filter(g => g.accuracy < 60).length !== 1 ? "s" : ""} below 60% accuracy.
                            {" "}<Link href="/portal/practice" className="font-bold underline">Start a practice session</Link> to improve.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Badges */}
            <div className="bg-white border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdEmojiEvents size={16} className="text-amber-500" /> Achievements
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {badges.map((b) => (
                  <div key={b.id} title={b.description}
                    className={`flex flex-col items-center gap-1.5 p-3 border text-center transition-all ${b.earned ? "border-amber-300 bg-amber-50" : "border-gray-100 bg-gray-50 opacity-40 grayscale"
                      }`}>
                    <span className="text-2xl">{b.icon}</span>
                    <p className="text-xs font-semibold text-gray-700 leading-tight">{b.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400 text-center">{earnedBadges.length}/{badges.length} badges earned</p>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
