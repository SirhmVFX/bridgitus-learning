"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getLearningGaps, upsertLearningGap, savePracticeAttempt,
  type AIQuestion, type LearningGap,
} from "@/lib/firestore";
import {
  MdAutoAwesome, MdArrowBack, MdArrowForward, MdSend,
  MdCheckCircle, MdCancel, MdExpandMore, MdExpandLess,
  MdPrint, MdRefresh,
} from "react-icons/md";
import { QuestionReadAloud } from "@/components/QuestionReadAloud";

// ── Types ──────────────────────────────────────────────────────────────────

interface PracticeMeta {
  subject: string;
  topic: string;
  difficulty: string;
  studentId: string;
}

// ── Practice Runner ────────────────────────────────────────────────────────

function PracticeRunner({
  questions,
  meta,
  studentId,
  studentUid,
  studentGrade,
  onDone,
}: {
  questions: AIQuestion[];
  meta: PracticeMeta;
  studentId: string;
  studentUid: string;
  studentGrade: string;
  onDone: (answers: Record<string, string>) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const q = questions[current];
  const answered = Object.keys(answers).length;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      let score = 0;
      const totalPoints = questions.reduce((s, q) => s + q.points, 0);
      for (const q of questions) {
        const given = (answers[q.id] ?? "").trim().toLowerCase();
        const correct = q.correctAnswer.trim().toLowerCase();
        const ok = q.type === "short_answer" ? given.includes(correct) : given === correct;
        if (ok) score += q.points;
      }
      const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
      await savePracticeAttempt({
        studentId, studentUid,
        questions, answers, score, totalPoints, percentage,
        subject: meta.subject, topic: meta.topic, difficulty: meta.difficulty,
      });
      await upsertLearningGap(studentId, meta.subject, meta.topic, undefined, percentage);
      onDone(answers);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-700 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MdAutoAwesome size={18} /> Practice Session
          </h2>
          <p className="text-white/70 text-sm">{meta.subject} · {meta.topic} · {meta.difficulty}</p>
        </div>
        <span className="bg-white/20 px-3 py-1 text-sm">{answered}/{questions.length} answered</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div className="h-full bg-purple-500 transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="w-8 h-8 bg-purple-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {current + 1}
          </span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {q.type.replace("_", " ")} · {q.points} pt{q.points !== 1 ? "s" : ""}
            {q.difficulty && ` · ${q.difficulty}`}
          </span>
          <QuestionReadAloud
            grade={studentGrade}
            text={q.text}
            options={
              q.type === "true_false"
                ? ["True", "False"]
                : q.options
            }
            index={current}
            className="ml-auto"
          />
        </div>
        <p className="text-gray-800 font-medium text-base mb-4 leading-relaxed">{q.text}</p>

        {q.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={q.imageUrl} alt="Question diagram"
            className="max-h-72 border border-gray-200 object-contain mb-6" />
        )}

        {q.type === "multiple_choice" && q.options && (
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-all
                ${answers[q.id] === opt ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}>
                <div className={`w-5 h-5 border-2 shrink-0 flex items-center justify-center
                  ${answers[q.id] === opt ? "border-purple-600 bg-purple-600" : "border-gray-300"}`}>
                  {answers[q.id] === opt && <div className="w-2 h-2 bg-white" />}
                </div>
                <input type="radio" name={q.id} value={opt} className="sr-only"
                  checked={answers[q.id] === opt}
                  onChange={() => setAnswers({ ...answers, [q.id]: opt })} />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {q.type === "true_false" && (
          <div className="flex gap-4">
            {["True", "False"].map((opt) => (
              <label key={opt} className={`flex-1 flex items-center justify-center gap-2 p-4 border-2
                cursor-pointer font-semibold transition-all
                ${answers[q.id] === opt.toLowerCase()
                  ? "border-purple-600 bg-purple-50 text-purple-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"}`}>
                <input type="radio" name={q.id} value={opt.toLowerCase()} className="sr-only"
                  checked={answers[q.id] === opt.toLowerCase()}
                  onChange={() => setAnswers({ ...answers, [q.id]: opt.toLowerCase() })} />
                {opt}
              </label>
            ))}
          </div>
        )}

        {(q.type === "short_answer" || q.type === "extended_response") && (
          <textarea value={answers[q.id] ?? ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder="Type your answer here…" rows={4}
            className="w-full p-4 border-2 border-gray-200 text-sm outline-none focus:border-purple-600 resize-none transition-colors" />
        )}
      </div>

      {/* Nav */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
          <MdArrowBack size={16} /> Previous
        </button>
        <div className="hidden sm:flex gap-1.5">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-7 h-7 text-xs font-bold transition-all
                ${i === current ? "bg-purple-700 text-white"
                  : answers[questions[i].id] ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-500"}`}>
              {i + 1}
            </button>
          ))}
        </div>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 transition-colors">
            Next <MdArrowForward size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors">
            <MdSend size={16} />{submitting ? "Submitting…" : "Finish Practice"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Results Panel ──────────────────────────────────────────────────────────

function ResultsPanel({
  questions,
  answers,
  meta,
  onRetry,
}: {
  questions: AIQuestion[];
  answers: Record<string, string>;
  meta: PracticeMeta;
  onRetry: () => void;
}) {
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const isCorrect = (q: AIQuestion) => {
    const given = (answers[q.id] ?? "").trim().toLowerCase();
    const correct = q.correctAnswer.trim().toLowerCase();
    return q.type === "short_answer" || q.type === "extended_response"
      ? given.includes(correct) : given === correct;
  };

  const totalPoints = questions.reduce((s, q) => s + q.points, 0);
  const score = questions.reduce((s, q) => isCorrect(q) ? s + q.points : s, 0);
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const correctCount = questions.filter(isCorrect).length;

  const level = percentage >= 80 ? { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-300" }
    : percentage >= 60 ? { label: "Good", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" }
      : percentage >= 40 ? { label: "Keep Practising", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" }
        : { label: "Needs Work", color: "text-red-600", bg: "bg-red-50 border-red-200" };

  return (
    <div className="space-y-5 print:space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 p-4 text-center">
          <p className={`text-3xl font-black ${percentage >= 60 ? "text-emerald-600" : "text-red-500"}`}>{percentage}%</p>
          <p className="text-xs text-gray-500 mt-0.5">Score</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 text-center">
          <p className="text-3xl font-black text-gray-900">{correctCount}/{questions.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Correct</p>
        </div>
        <div className={`border p-4 text-center ${level.bg}`}>
          <p className={`text-lg font-black ${level.color}`}>{level.label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{meta.subject} · {meta.difficulty}</p>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Question Breakdown</p>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const correct = isCorrect(q);
            const expanded = expandedQ === q.id;
            return (
              <div key={q.id} className={`border overflow-hidden ${correct ? "border-emerald-200" : "border-red-200"}`}>
                <div className={`px-4 py-3 flex items-start justify-between gap-3 ${correct ? "bg-emerald-50" : "bg-red-50"}`}>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0
                      ${correct ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>{i + 1}</div>
                    <p className="text-sm font-medium text-gray-800 leading-snug">{q.text}</p>
                  </div>
                  <button onClick={() => setExpandedQ(expanded ? null : q.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                    {expanded ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
                  </button>
                </div>
                {expanded && (
                  <div className="px-4 py-4 bg-white space-y-3">
                    {q.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={q.imageUrl} alt="Question diagram"
                        className="max-h-56 border border-gray-200 object-contain" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Your answer:</p>
                      <p className={`text-sm px-3 py-1.5 border ${correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>
                        {answers[q.id] || <em className="text-gray-400">Not answered</em>}{correct ? " ✓" : " ✗"}
                      </p>
                    </div>
                    {!correct && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Correct answer:</p>
                        <p className="text-sm px-3 py-1.5 border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold">{q.correctAnswer} ✓</p>
                      </div>
                    )}
                    {q.explanation && (
                      <div className="bg-blue-50 border border-blue-100 px-3 py-2">
                        <p className="text-xs font-semibold text-blue-700 mb-0.5">Explanation</p>
                        <p className="text-xs text-blue-700">{q.explanation}</p>
                      </div>
                    )}
                    {q.workedSolution && (
                      <div className="bg-gray-50 border border-gray-200 px-3 py-2">
                        <p className="text-xs font-semibold text-gray-600 mb-0.5">Worked Solution</p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed tracking-[0.01em] font-[family-name:var(--font-solution),ui-serif,Georgia,serif]">{q.workedSolution}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <button onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white text-sm font-semibold hover:bg-purple-800 transition-colors">
          <MdRefresh size={15} /> Practice Again
        </button>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
          <MdPrint size={15} /> Print / Save as PDF
        </button>
      </div>
    </div>
  );
}

// ── Gap Selector ───────────────────────────────────────────────────────────

function GapSelector({
  gaps,
  onSelect,
  generating,
}: {
  gaps: LearningGap[];
  onSelect: (gap: LearningGap) => void;
  generating: string | null;
}) {
  const badge = (acc: number) =>
    acc < 40 ? "bg-red-100 text-red-700" :
      acc < 60 ? "bg-amber-100 text-amber-700" :
        "bg-blue-100 text-blue-700";

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Your Learning Gaps</h2>
        <p className="text-xs text-gray-500 mt-0.5">Topics where you need more practice — sorted by lowest accuracy</p>
      </div>
      {gaps.length === 0 ? (
        <div className="p-12 text-center">
          <MdCheckCircle size={40} className="mx-auto text-emerald-400 mb-3" />
          <p className="font-medium text-gray-700">No active learning gaps!</p>
          <p className="text-sm text-gray-400 mt-1">Your accuracy is strong across all topics. Keep it up!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {gaps.map((gap) => (
            <div key={gap.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-gray-900">{gap.topic}</p>
                <p className="text-xs text-gray-500">{gap.subject}{gap.subtopic ? ` · ${gap.subtopic}` : ""}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 ${badge(gap.accuracy)}`}>
                    {gap.accuracy}% accuracy
                  </span>
                  <span className="text-xs text-gray-400">{gap.attemptCount} attempt{gap.attemptCount !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <button
                onClick={() => onSelect(gap)}
                disabled={generating === gap.id}
                className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white text-sm font-semibold hover:bg-purple-800 disabled:opacity-60 transition-colors shrink-0">
                {generating === gap.id
                  ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating…</>
                  : <><MdAutoAwesome size={14} /> Practice</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

type PageState = "loading" | "gaps" | "running" | "results";

export default function PracticePage() {
  const { student, user } = useStudentAuth();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [gaps, setGaps] = useState<LearningGap[]>([]);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [meta, setMeta] = useState<PracticeMeta>({ subject: "", topic: "", difficulty: "Core", studentId: "" });
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [error, setError] = useState("");
  const DEFAULT_PRACTICE_COUNT = 10;

  // On mount: check sessionStorage first, then load gaps
  useEffect(() => {
    if (!student?.id) return;

    const rawQ = sessionStorage.getItem("practiceQuestions");
    const rawM = sessionStorage.getItem("practiceMeta");
    if (rawQ && rawM) {
      try {
        const qs: AIQuestion[] = JSON.parse(rawQ);
        const m: PracticeMeta = JSON.parse(rawM);
        sessionStorage.removeItem("practiceQuestions");
        sessionStorage.removeItem("practiceMeta");
        if (qs.length > 0) {
          setQuestions(qs);
          setMeta({ ...m, studentId: student.id });
          setPageState("running");
          return;
        }
      } catch { /* fall through to gap loader */ }
    }

    getLearningGaps(student.id)
      .then((g) => { setGaps(g); setPageState("gaps"); })
      .catch(() => { setGaps([]); setPageState("gaps"); });
  }, [student]);

  async function generateForGap(gap: LearningGap) {
    if (!student?.id) return;
    setGeneratingFor(gap.id ?? gap.topic);
    setError("");
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curriculum: "Victorian Curriculum 2.0",
          subject: gap.subject,
          year: student.grade ? `Year ${student.grade}` : "Year 7",
          topic: gap.topic,
          subtopic: gap.subtopic ?? "",
          count: DEFAULT_PRACTICE_COUNT,
          difficulty: gap.accuracy < 40 ? "Support" : "Core",
          format: "Mixed",
          context: "General",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate questions");
      setQuestions(data.questions);
      setMeta({
        subject: gap.subject,
        topic: gap.topic,
        difficulty: gap.accuracy < 40 ? "Support" : "Core",
        studentId: student.id,
      });
      setPageState("running");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not generate questions");
    } finally {
      setGeneratingFor(null);
    }
  }

  function handleDone(answers: Record<string, string>) {
    setFinalAnswers(answers);
    setPageState("results");
  }

  function handleRetry() {
    setQuestions([]);
    setFinalAnswers({});
    if (!student?.id) return;
    setPageState("loading");
    getLearningGaps(student.id)
      .then((g) => { setGaps(g); setPageState("gaps"); })
      .catch(() => { setGaps([]); setPageState("gaps"); });
  }

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MdAutoAwesome className="text-purple-600" /> AI Practice
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Personalised questions targeting your weak areas
            </p>
          </div>
          {(pageState === "running" || pageState === "results") && (
            <button onClick={handleRetry}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <MdArrowBack size={16} /> Back to Gaps
            </button>
          )}
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <MdCancel size={16} className="shrink-0" /> {error}
          </div>
        )}

        {pageState === "loading" && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border h-20 animate-pulse" />
            ))}
          </div>
        )}

        {pageState === "gaps" && (
          <GapSelector gaps={gaps} onSelect={generateForGap} generating={generatingFor} />
        )}

        {pageState === "running" && questions.length > 0 && (
          <PracticeRunner
            questions={questions}
            meta={meta}
            studentId={student!.id!}
            studentUid={user!.uid}
            studentGrade={student!.grade}
            onDone={handleDone}
          />
        )}

        {pageState === "results" && (
          <>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Practice Results</h2>
              <p className="text-sm text-gray-500 mt-0.5">{meta.subject} · {meta.topic} · {meta.difficulty}</p>
            </div>
            <ResultsPanel
              questions={questions}
              answers={finalAnswers}
              meta={meta}
              onRetry={handleRetry}
            />
          </>
        )}
      </div>
    </PortalLayout>
  );
}
