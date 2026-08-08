"use client";

import { useEffect, useState, useRef } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getTestsByGrade,
  getAllStudentAttempts,
  submitTestAttempt,
  getMaterialCompletions,
  getMaterialById,
  isMaterialCompleted,
  upsertStudentProgress,
  type Test, type TestAttempt, type Question, type MaterialCompletion,
} from "@/lib/firestore";
import {
  MdQuiz, MdTimer, MdCheckCircle, MdCancel, MdPending,
  MdLock, MdArrowBack, MdArrowForward, MdSend, MdMenuBook,
} from "react-icons/md";

// ── Test Runner ──────────────────────────────────────────────

function TestRunner({
  test, studentId, studentUid, attemptNumber, onSubmit,
}: {
  test: Test; studentId: string; studentUid: string;
  attemptNumber: number; onSubmit: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    test.timeLimit && test.timeLimit > 0 ? test.timeLimit * 60 : null
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setTimeout(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function grade() {
    let score = 0;
    for (const q of test.questions) {
      const given = answers[q.id]?.trim().toLowerCase();
      const correct = q.correctAnswer.trim().toLowerCase();
      if (q.type === "multiple_choice" || q.type === "true_false") {
        if (given === correct) score += q.points;
      } else if (q.type === "short_answer") {
        if (given && correct && given.includes(correct)) score += q.points;
      }
    }
    const pct = Math.round((score / test.totalPoints) * 100);
    return { score, percentage: pct, passed: pct >= test.passMark };
  }

  async function handleSubmit() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSubmitting(true);
    try {
      const { score, percentage, passed } = grade();
      await submitTestAttempt({
        testId: test.id!, testTitle: test.title,
        studentId, studentUid, answers, score,
        totalPoints: test.totalPoints, percentage, passed,
        attemptNumber, status: "pending_review",
      });
      // Auto-write progress
      await upsertStudentProgress(studentId, test.grade, test.subject, {
        scoreToAdd: percentage, passed,
      });
      onSubmit();
    } finally { setSubmitting(false); }
  }

  const q: Question = test.questions[current];
  const answered = Object.keys(answers).length;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="bg-secondary-color text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">{test.title}</h2>
          <p className="text-white/70 text-sm">{test.subject} · Grade {test.grade}</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-white/20 px-3 py-1">{answered}/{test.questions.length} answered</span>
          {timeLeft !== null && (
            <span className={`bg-white/20 px-3 py-1 flex items-center gap-1 ${timeLeft < 60 ? "bg-red-600/80" : ""}`}>
              <MdTimer size={14} />{formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>
      <div className="h-1 bg-gray-100">
        <div className="h-full bg-primary-color transition-all" style={{ width: `${((current + 1) / test.questions.length) * 100}%` }} />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 bg-secondary-color text-white text-sm font-bold flex items-center justify-center shrink-0">{current + 1}</span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{q.type.replace("_", " ")} · {q.points} pt{q.points !== 1 ? "s" : ""}</span>
        </div>
        <div className="text-gray-800 font-medium text-base mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: q.text }} />

        {q.type === "multiple_choice" && q.options && (
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-all ${answers[q.id] === opt ? "border-secondary-color bg-secondary-color/5" : "border-gray-200 hover:border-gray-300"}`}>
                <div className={`w-5 h-5 border-2 shrink-0 flex items-center justify-center ${answers[q.id] === opt ? "border-secondary-color bg-secondary-color" : "border-gray-300"}`}>
                  {answers[q.id] === opt && <div className="w-2 h-2 bg-white" />}
                </div>
                <input type="radio" name={q.id} value={opt} className="sr-only" checked={answers[q.id] === opt} onChange={() => setAnswers({ ...answers, [q.id]: opt })} />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {q.type === "true_false" && (
          <div className="flex gap-4">
            {["True", "False"].map((opt) => (
              <label key={opt} className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 cursor-pointer font-semibold transition-all ${answers[q.id] === opt.toLowerCase() ? "border-secondary-color bg-secondary-color/5 text-secondary-color" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}>
                <input type="radio" name={q.id} value={opt.toLowerCase()} className="sr-only" checked={answers[q.id] === opt.toLowerCase()} onChange={() => setAnswers({ ...answers, [q.id]: opt.toLowerCase() })} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {q.type === "short_answer" && (
          <textarea value={answers[q.id] ?? ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder="Type your answer here…" rows={4}
            className="w-full p-4 border-2 border-gray-200 text-sm outline-none focus:border-secondary-color resize-none transition-colors" />
        )}
      </div>

      <div className="px-6 pb-6 flex items-center justify-between">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
          <MdArrowBack size={16} /> Previous
        </button>
        <div className="hidden sm:flex gap-1.5">
          {test.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-7 h-7 text-xs font-bold transition-all ${i === current ? "bg-secondary-color text-white" : answers[test.questions[i].id] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}>
              {i + 1}
            </button>
          ))}
        </div>
        {current < test.questions.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary-color text-white text-sm font-medium hover:bg-secondary-color/90 transition-colors">
            Next <MdArrowForward size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors">
            <MdSend size={16} />{submitting ? "Submitting…" : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────

export default function TestsPage() {
  const { student, user } = useStudentAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [allAttempts, setAllAttempts] = useState<TestAttempt[]>([]);
  const [completions, setCompletions] = useState<MaterialCompletion[]>([]);
  const [materialTitles, setMaterialTitles] = useState<Record<string, string>>({});
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    if (!student?.grade || !student?.id) return;
    const [t, a, comps] = await Promise.all([
      getTestsByGrade(student.grade),
      getAllStudentAttempts(student.id),
      getMaterialCompletions(student.id, student.grade),
    ]);
    setTests(t); setAllAttempts(a); setCompletions(comps);

    // Fetch titles for any linked materials
    const ids = [...new Set(t.map((x) => x.linkedMaterialId).filter(Boolean) as string[])];
    const titles: Record<string, string> = {};
    await Promise.all(ids.map(async (id) => {
      const m = await getMaterialById(id);
      if (m) titles[id] = m.title;
    }));
    setMaterialTitles(titles);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [student]);

  function attemptsForTest(testId: string) {
    return allAttempts.filter((a) => a.testId === testId);
  }

  function canAttempt(test: Test) {
    return attemptsForTest(test.id!).length < test.maxAttempts;
  }

  function materialUnlocked(test: Test): boolean {
    if (!test.linkedMaterialId) return true;
    return isMaterialCompleted(completions, test.linkedMaterialId);
  }

  if (activeTest && !submitted) {
    return (
      <PortalLayout>
        <div className="max-w-3xl mx-auto space-y-4">
          <button onClick={() => setActiveTest(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <MdArrowBack size={16} /> Back to Tests
          </button>
          <TestRunner
            test={activeTest} studentId={student!.id!} studentUid={user!.uid}
            attemptNumber={attemptsForTest(activeTest.id!).length + 1}
            onSubmit={() => { setSubmitted(true); setActiveTest(null); loadData(); }}
          />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tests &amp; Exams</h1>
          <p className="text-gray-500 text-sm mt-0.5">Grade {student?.grade} assessments</p>
        </div>

        {submitted && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 flex items-center gap-3">
            <MdCheckCircle size={22} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Test submitted!</p>
              <p className="text-xs text-emerald-600 mt-0.5">Your result is pending teacher review. You&apos;ll see it once approved.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white border h-32 animate-pulse" />)}</div>
        ) : tests.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <MdQuiz size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No tests available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => {
              const myAttempts = attemptsForTest(test.id!);
              const approved = myAttempts.filter((a) => a.status === "approved");
              const pending = myAttempts.filter((a) => a.status === "pending_review");
              const bestScore = approved.length > 0 ? Math.max(...approved.map((a) => a.percentage)) : null;
              const locked = !canAttempt(test);
              const matUnlocked = materialUnlocked(test);
              const linkedTitle = test.linkedMaterialId ? materialTitles[test.linkedMaterialId] : null;

              return (
                <div key={test.id} className={`bg-white border overflow-hidden ${!matUnlocked ? "opacity-70 border-gray-200" : "border-gray-200"}`}>
                  <div className={`h-1 ${!matUnlocked ? "bg-gray-200" : test.type === "exam" ? "bg-red-500" : "bg-secondary-color"}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 ${test.type === "exam" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                            {test.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5">{test.subject}</span>
                          {test.timeLimit && test.timeLimit > 0 && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5"><MdTimer size={12} /> {test.timeLimit} min</span>
                          )}
                          {!matUnlocked && (
                            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 flex items-center gap-0.5 font-semibold">
                              <MdLock size={11} /> Locked
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg">{test.title}</h3>
                        {test.description && <p className="text-sm text-gray-500 mt-0.5">{test.description}</p>}

                        {/* Prerequisite notice */}
                        {!matUnlocked && linkedTitle && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
                            <MdMenuBook size={15} className="shrink-0" />
                            Complete <strong className="mx-1">&ldquo;{linkedTitle}&rdquo;</strong> to unlock this test.
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                          <span>{test.questions.length} questions · {test.totalPoints} pts</span>
                          <span>Pass: {test.passMark}%</span>
                          <span>Attempts: {myAttempts.length}/{test.maxAttempts}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {bestScore !== null && (
                          <div className="mb-2">
                            <p className={`text-2xl font-bold ${bestScore >= test.passMark ? "text-emerald-600" : "text-red-500"}`}>{bestScore}%</p>
                            <p className="text-xs text-gray-400">Best score</p>
                          </div>
                        )}
                        {!matUnlocked ? (
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm"><MdLock size={15} /> Locked</div>
                        ) : locked ? (
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm"><MdLock size={15} /> Max attempts</div>
                        ) : (
                          <button onClick={() => { setSubmitted(false); setActiveTest(test); }}
                            className="bg-secondary-color text-white text-sm font-semibold px-4 py-2 hover:bg-secondary-color/90 transition-colors">
                            {myAttempts.length === 0 ? "Start Test" : "Retry"}
                          </button>
                        )}
                      </div>
                    </div>

                    {myAttempts.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your attempts</p>
                        <div className="flex flex-wrap gap-2">
                          {myAttempts.map((att) => (
                            <div key={att.id} className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${att.status === "approved" ? (att.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")
                                : att.status === "pending_review" ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-500"}`}>
                              {att.status === "approved" ? (att.passed ? <MdCheckCircle size={12} /> : <MdCancel size={12} />) : <MdPending size={12} />}
                              Attempt {att.attemptNumber}
                              {att.status === "approved" && ` · ${att.percentage}%`}
                              {att.status === "pending_review" && " · Pending"}
                            </div>
                          ))}
                        </div>
                        {myAttempts.some((a) => a.adminComment) && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-100">
                            <p className="text-xs font-semibold text-blue-700 mb-1">Teacher Feedback:</p>
                            {myAttempts.filter((a) => a.adminComment).map((a) => (
                              <p key={a.id} className="text-xs text-blue-600">Attempt {a.attemptNumber}: {a.adminComment}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
