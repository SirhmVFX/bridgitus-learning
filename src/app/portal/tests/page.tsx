"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import Pagination from "@/components/Pagination";
import { useStudentAuth } from "@/lib/studentAuth";
import { paginate } from "@/lib/pagination";
import {
  getTestsByGrade,
  getAllStudentAttempts,
  getTestAttemptById,
  submitTestAttempt,
  getMaterialCompletions,
  getMaterialById,
  isMaterialCompleted,
  upsertStudentProgress,
  type Test,
  type TestAttempt,
  type Question,
  type MaterialCompletion,
} from "@/lib/firestore";
import QuestionVideo from "@/components/QuestionVideo";
import { QuestionReadAloud } from "@/components/QuestionReadAloud";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  formatSchedule,
  isNotYetOpen,
  isPastDue,
  effectiveDueAt,
} from "@/lib/schedule";
import {
  MdQuiz,
  MdTimer,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdLock,
  MdArrowBack,
  MdArrowForward,
  MdSend,
  MdMenuBook,
  MdExpandMore,
  MdExpandLess,
  MdAutoAwesome,
  MdPrint,
  MdAttachFile,
  MdSchedule,
  MdLink,
} from "react-icons/md";

const SUBMISSION_ACCEPT = ".pdf,.doc,.docx,.png,.jpg,.jpeg";
const SUBMISSION_FOLDER = "bridgitus/submissions";

// ── Worked Solution Viewer ─────────────────────────────────────────────────

function AttemptResultPanel({
  attempt,
  test,
  studentId,
}: {
  attempt: TestAttempt;
  test: Test;
  studentId: string;
}) {
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [creatingSimFor, setCreatingSimFor] = useState<string | null>(null);
  const [simError, setSimError] = useState("");

  async function handleCreateSimilar(q: Question) {
    setCreatingSimFor(q.id);
    setSimError("");
    // Use human-readable labels (test title/subject), never internal question ids
    const topicLabel = test.title || test.subject;
    try {
      const res = await fetch("/api/create-similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: {
            ...q,
            topic: topicLabel,
            subtopic: test.subject,
            difficulty: "Core",
          },
          count: 3,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      // Store in sessionStorage so Practice page can pick them up
      const existing = JSON.parse(
        sessionStorage.getItem("practiceQuestions") ?? "[]"
      );
      sessionStorage.setItem(
        "practiceQuestions",
        JSON.stringify([...existing, ...data.questions])
      );
      sessionStorage.setItem(
        "practiceMeta",
        JSON.stringify({
          subject: test.subject,
          topic: topicLabel,
          difficulty: "Core",
          studentId,
        })
      );
      window.location.href = "/portal/practice";
    } catch (err: unknown) {
      setSimError(
        err instanceof Error
          ? err.message
          : "Could not create similar questions"
      );
    } finally {
      setCreatingSimFor(null);
    }
  }

  const isCorrect = (q: Question) => {
    const given = attempt.answers[q.id]?.trim().toLowerCase() ?? "";
    const correct = q.correctAnswer.trim().toLowerCase();
    if (q.type === "short_answer") return given.includes(correct);
    return given === correct;
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card text-center !py-4">
          <p
            className={`text-3xl font-black ${attempt.passed ? "text-emerald-600" : "text-red-500"}`}
          >
            {attempt.percentage}%
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400 mt-0.5">Score</p>
        </div>
        <div className="stat-card text-center !py-4">
          <p className="text-3xl font-black text-[#001233]">
            {attempt.score}/{attempt.totalPoints}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400 mt-0.5">Points</p>
        </div>
        <div
          className={`rounded-2xl border p-4 text-center ${attempt.passed ? "bg-emerald-50 border-emerald-300" : "bg-red-50 border-red-200"}`}
        >
          <p
            className={`text-xl font-black ${attempt.passed ? "text-emerald-700" : "text-red-600"}`}
          >
            {attempt.passed ? "PASSED" : "FAILED"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Pass mark: {test.passMark}%
          </p>
        </div>
      </div>

      {simError && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {simError}
        </div>
      )}

      {/* Per-question breakdown */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Question Breakdown
        </p>
        <div className="space-y-3">
          {test.questions.map((q, i) => {
            const correct = isCorrect(q);
            const studentAnswer = attempt.answers[q.id];
            const expanded = expandedQ === q.id;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border overflow-hidden ${correct ? "border-emerald-200" : "border-red-200"}`}
              >
                <div
                  className={`px-4 py-3 flex items-start justify-between gap-3 ${correct ? "bg-emerald-50" : "bg-red-50"}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${correct ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {i + 1}
                    </div>
                    <div
                      className="text-sm font-medium text-gray-800 leading-snug line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: q.text }}
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!correct && (
                      <button
                        onClick={() => handleCreateSimilar(q)}
                        disabled={creatingSimFor === q.id}
                        title="Practice similar questions"
                        className="flex items-center gap-1 text-xs rounded-full bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 hover:bg-purple-200 transition-colors disabled:opacity-50"
                      >
                        {creatingSimFor === q.id ? (
                          <>
                            <div className="w-3 h-3 border border-purple-600 border-t-transparent rounded-full animate-spin" />
                            …
                          </>
                        ) : (
                          <>
                            <MdAutoAwesome size={12} />
                            Practice
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedQ(expanded ? null : q.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expanded ? (
                        <MdExpandLess size={18} />
                      ) : (
                        <MdExpandMore size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="px-4 py-4 bg-white space-y-3">
                    {q.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={q.imageUrl}
                        alt="Question diagram"
                        className="max-h-48 border border-gray-200 object-contain"
                      />
                    )}
                    {q.videoUrl && (
                      <QuestionVideo url={q.videoUrl} name={q.videoName} className="mb-1" />
                    )}
                    {/* Student answer */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Your answer:
                      </p>
                      <p
                        className={`text-sm px-3 py-1.5 border ${correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}
                      >
                        {studentAnswer || (
                          <em className="text-gray-400">Not answered</em>
                        )}
                        {correct ? " ✓" : " ✗"}
                      </p>
                    </div>

                    {/* Correct answer */}
                    {!correct && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          Correct answer:
                        </p>
                        <p className="text-sm px-3 py-1.5 border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold">
                          {q.correctAnswer} ✓
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    {(q as Question & { explanation?: string }).explanation && (
                      <div className="bg-blue-50 border border-blue-100 px-3 py-2">
                        <p className="text-xs font-semibold text-blue-700 mb-0.5">
                          Explanation
                        </p>
                        <p className="text-xs text-blue-700">
                          {
                            (q as Question & { explanation?: string })
                              .explanation
                          }
                        </p>
                      </div>
                    )}

                    {/* Worked solution */}
                    {(q as Question & { workedSolution?: string })
                      .workedSolution && (
                      <div className="bg-gray-50 border border-gray-200 px-3 py-2">
                        <p className="text-xs font-semibold text-gray-600 mb-0.5">
                          Worked Solution
                        </p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed tracking-[0.01em] font-[family-name:var(--font-solution),ui-serif,Georgia,serif]">
                          {
                            (q as Question & { workedSolution?: string })
                              .workedSolution
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {attempt.attachmentUrl && (
        <a
          href={attempt.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium px-3 py-2 hover:bg-gray-100 transition-colors"
        >
          <MdLink size={15} />
          {attempt.attachmentName ?? "View attachment"}
        </a>
      )}

      {/* Teacher feedback */}
      {attempt.adminComment && (
        <div className="rounded-2xl bg-secondary-color/5 border border-secondary-color/20 p-4">
          <p className="text-xs font-semibold text-secondary-color mb-1">
            Teacher Feedback
          </p>
          <p className="text-sm text-gray-700">{attempt.adminComment}</p>
        </div>
      )}

      {/* Print button */}
      <div className="flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm portal-btn-secondary"
        >
          <MdPrint size={15} /> Print / Save as PDF
        </button>
        <Link
          href="/portal/practice"
          className="flex items-center gap-2 text-sm rounded-xl bg-purple-600 text-white font-semibold px-4 py-2 hover:bg-purple-700 transition-colors"
        >
          <MdAutoAwesome size={15} /> Go to Practice
        </Link>
      </div>
    </div>
  );
}

// ── Test Runner ──────────────────────────────────────────────

function TestRunner({
  test,
  studentId,
  studentUid,
  studentName,
  studentGrade,
  attemptNumber,
  onSubmit,
}: {
  test: Test;
  studentId: string;
  studentUid: string;
  studentName: string;
  studentGrade: string;
  attemptNumber: number;
  onSubmit: (attempt: TestAttempt | null) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>();
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    test.timeLimit && test.timeLimit > 0 ? test.timeLimit * 60 : null
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function handleAttachmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadToCloudinary(file, SUBMISSION_FOLDER);
      setAttachmentUrl(url);
      setAttachmentName(file.name);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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
      const attemptId = await submitTestAttempt({
        testId: test.id!,
        testTitle: test.title,
        studentId,
        studentUid,
        studentName,
        answers,
        score,
        totalPoints: test.totalPoints,
        percentage,
        passed,
        attemptNumber,
        status: "approved",
        ...(attachmentUrl
          ? { attachmentUrl, attachmentName: attachmentName ?? "attachment" }
          : {}),
      });
      // Auto-write progress
      await upsertStudentProgress(studentId, test.grade, test.subject, {
        scoreToAdd: percentage,
        passed,
      });
      const createdAttempt = await getTestAttemptById(attemptId);
      onSubmit(createdAttempt);
    } finally {
      setSubmitting(false);
    }
  }

  const q: Question = test.questions[current];
  const answered = Object.keys(answers).length;

  return (
    <div className="portal-card !p-0 overflow-hidden">
      <div className="bg-secondary-color text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">{test.title}</h2>
          <p className="text-white/70 text-sm">
            {test.subject} · Grade {test.grade}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-white/20 rounded-full px-3 py-1">
            {answered}/{test.questions.length} answered
          </span>
          {timeLeft !== null && (
            <span
              className={`bg-white/20 rounded-full px-3 py-1 flex items-center gap-1 ${timeLeft < 60 ? "bg-red-600/80" : ""}`}
            >
              <MdTimer size={14} />
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-primary-color transition-all"
          style={{ width: `${((current + 1) / test.questions.length) * 100}%` }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="w-8 h-8 rounded-xl bg-secondary-color text-white text-sm font-bold flex items-center justify-center shrink-0">
            {current + 1}
          </span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {q.type.replace("_", " ")} · {q.points} pt
            {q.points !== 1 ? "s" : ""}
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
        <div
          className="text-gray-800 font-medium text-base mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: q.text }}
        />

        {q.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={q.imageUrl}
            alt="Question diagram"
            className="max-h-72 border border-gray-200 object-contain mb-6"
          />
        )}

        {q.videoUrl && (
          <QuestionVideo url={q.videoUrl} name={q.videoName} />
        )}

        {q.type === "multiple_choice" && q.options && (
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id] === opt ? "border-secondary-color bg-secondary-color/5" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${answers[q.id] === opt ? "border-secondary-color bg-secondary-color" : "border-gray-300"}`}
                >
                  {answers[q.id] === opt && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  className="sr-only"
                  checked={answers[q.id] === opt}
                  onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {q.type === "true_false" && (
          <div className="flex gap-4">
            {["True", "False"].map((opt) => (
              <label
                key={opt}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer font-semibold transition-all ${answers[q.id] === opt.toLowerCase() ? "border-secondary-color bg-secondary-color/5 text-secondary-color" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.toLowerCase()}
                  className="sr-only"
                  checked={answers[q.id] === opt.toLowerCase()}
                  onChange={() =>
                    setAnswers({ ...answers, [q.id]: opt.toLowerCase() })
                  }
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {q.type === "short_answer" && (
          <textarea
            value={answers[q.id] ?? ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder="Type your answer here…"
            rows={4}
            className="w-full p-4 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-secondary-color resize-none transition-colors"
          />
        )}
      </div>

      <div className="px-6 pb-4 border-t border-gray-100 pt-4">
        <label className="block text-xs font-semibold text-gray-500 mb-2">
          Optional attachment
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer hover:border-secondary-color transition-colors">
            <MdAttachFile size={14} />
            {uploading ? "Uploading…" : attachmentName ? "Replace file" : "Attach file"}
            <input
              type="file"
              accept={SUBMISSION_ACCEPT}
              className="hidden"
              onChange={handleAttachmentChange}
              disabled={uploading || submitting}
            />
          </label>
          {attachmentUrl && attachmentName && (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-secondary-color font-medium hover:underline"
            >
              <MdLink size={13} />
              {attachmentName}
            </a>
          )}
          <span className="text-[11px] text-gray-400">PDF, DOC, DOCX, PNG, JPG</span>
        </div>
        {uploadError && (
          <p className="mt-2 text-xs text-red-600">{uploadError}</p>
        )}
      </div>

      <div className="px-6 pb-6 flex items-center justify-between">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <MdArrowBack size={16} /> Previous
        </button>
        <div className="hidden sm:flex gap-1.5">
          {test.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${i === current ? "bg-secondary-color text-white" : answers[test.questions[i].id] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {current < test.questions.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            className="flex items-center gap-2 portal-btn-primary !py-2"
          >
            Next <MdArrowForward size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            <MdSend size={16} />
            {submitting ? "Submitting…" : "Submit Test"}
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
  const [materialTitles, setMaterialTitles] = useState<Record<string, string>>(
    {}
  );
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewingResult, setViewingResult] = useState<{
    attempt: TestAttempt;
    test: Test;
  } | null>(null);
  const [page, setPage] = useState(1);

  async function loadData() {
    if (!student?.grade || !student?.id) return;
    const [t, a, comps] = await Promise.all([
      getTestsByGrade(student.grade),
      getAllStudentAttempts(student.id),
      getMaterialCompletions(student.id, student.grade),
    ]);
    setTests(t);
    setAllAttempts(a);
    setCompletions(comps);

    // Fetch titles for any linked materials
    const ids = [
      ...new Set(t.map((x) => x.linkedMaterialId).filter(Boolean) as string[]),
    ];
    const titles: Record<string, string> = {};
    await Promise.all(
      ids.map(async (id) => {
        const m = await getMaterialById(id);
        if (m) titles[id] = m.title;
      })
    );
    setMaterialTitles(titles);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [student]);

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

  const pageSlice = paginate(tests, page);

  if (activeTest && !submitted) {
    return (
      <PortalLayout>
        <div className="w-full space-y-4">
          <button
            onClick={() => setActiveTest(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <MdArrowBack size={16} /> Back to Tests
          </button>
          <TestRunner
            test={activeTest}
            studentId={student!.id!}
            studentUid={user!.uid}
            studentName={`${student!.firstName} ${student!.lastName}`.trim()}
            studentGrade={student!.grade}
            attemptNumber={attemptsForTest(activeTest.id!).length + 1}
            onSubmit={(attempt) => {
              setSubmitted(false);
              setActiveTest(null);
              if (attempt) setViewingResult({ attempt, test: activeTest });
              loadData();
            }}
          />
        </div>
      </PortalLayout>
    );
  }

  // Viewing a specific approved result
  if (viewingResult) {
    return (
      <PortalLayout>
        <div className="w-full space-y-5">
          <button
            onClick={() => setViewingResult(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <MdArrowBack size={16} /> Back to Tests
          </button>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">Results</p>
            <h1 className="text-2xl lg:text-[1.75rem] font-extrabold text-[#001233] tracking-tight">
              {viewingResult.test.title}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {viewingResult.test.subject} · Grade {viewingResult.test.grade} ·
              Attempt #{viewingResult.attempt.attemptNumber}
            </p>
          </div>
          <AttemptResultPanel
            attempt={viewingResult.attempt}
            test={viewingResult.test}
            studentId={student!.id!}
          />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="w-full space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">Assess</p>
          <h1 className="text-2xl lg:text-[1.75rem] font-extrabold text-[#001233] tracking-tight">Quizzes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Grade {student?.grade} quizzes
          </p>
        </div>

        {submitted && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 flex items-center gap-3">
            <MdCheckCircle size={22} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Quiz submitted successfully!
              </p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Your result is pending teacher review. You&apos;ll see it once
                approved.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="portal-card h-32 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="portal-card p-16 text-center">
            <MdQuiz size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No tests available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pageSlice.items.map((test) => {
              const myAttempts = attemptsForTest(test.id!);
              const approved = myAttempts.filter(
                (a) => a.status === "approved"
              );
              const pending = myAttempts.filter(
                (a) => a.status === "pending_review"
              );
              const bestScore =
                approved.length > 0
                  ? Math.max(...approved.map((a) => a.percentage))
                  : null;
              const locked = !canAttempt(test);
              const matUnlocked = materialUnlocked(test);
              const notOpen = isNotYetOpen(test);
              const pastDue = isPastDue(test);
              const scheduleBlocked = notOpen || pastDue;
              const canStart =
                matUnlocked && !locked && !scheduleBlocked;
              const linkedTitle = test.linkedMaterialId
                ? materialTitles[test.linkedMaterialId]
                : null;
              const dueLabel = effectiveDueAt(test);

              return (
                <div
                  key={test.id}
                  className={`portal-card hover-lift !p-0 overflow-hidden ${!matUnlocked || scheduleBlocked ? "opacity-70" : ""}`}
                >
                  <div
                    className={`h-1 ${!matUnlocked || scheduleBlocked ? "bg-gray-200" : test.type === "exam" ? "bg-red-500" : "bg-secondary-color"}`}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${test.type === "exam" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {test.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                            {test.subject}
                          </span>
                          {test.timeLimit && test.timeLimit > 0 && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                              <MdTimer size={12} /> {test.timeLimit} min
                            </span>
                          )}
                          {!matUnlocked && (
                            <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                              <MdLock size={11} /> Locked
                            </span>
                          )}
                          {notOpen && (
                            <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                              <MdSchedule size={11} /> Not open
                            </span>
                          )}
                          {pastDue && (
                            <span className="text-xs text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                              <MdSchedule size={11} /> Closed
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-[#001233] text-lg">
                          {test.title}
                        </h3>
                        {test.description && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {test.description}
                          </p>
                        )}

                        {/* Prerequisite notice */}
                        {!matUnlocked && linkedTitle && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                            <MdMenuBook size={15} className="shrink-0" />
                            Complete{" "}
                            <strong className="mx-1">
                              &ldquo;{linkedTitle}&rdquo;
                            </strong>{" "}
                            to unlock this test.
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            {test.questions.length} questions ·{" "}
                            {test.totalPoints} pts
                          </span>
                          <span>Pass: {test.passMark}%</span>
                          <span>
                            Attempts: {myAttempts.length}/{test.maxAttempts}
                          </span>
                          {test.startAt && (
                            <span className="flex items-center gap-1">
                              <MdSchedule size={12} />
                              Start: {formatSchedule(test.startAt)}
                            </span>
                          )}
                          {dueLabel && (
                            <span className={`flex items-center gap-1 ${pastDue ? "text-red-500" : ""}`}>
                              <MdSchedule size={12} />
                              Due: {formatSchedule(dueLabel)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {bestScore !== null && (
                          <div className="mb-2">
                            <p
                              className={`text-2xl font-bold ${bestScore >= test.passMark ? "text-emerald-600" : "text-red-500"}`}
                            >
                              {bestScore}%
                            </p>
                            <p className="text-xs text-gray-400">Best score</p>
                          </div>
                        )}
                        {!matUnlocked ? (
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                            <MdLock size={15} /> Locked
                          </div>
                        ) : notOpen ? (
                          <div className="text-sm text-slate-500 max-w-[11rem]">
                            <div className="flex items-center justify-end gap-1.5 font-medium">
                              <MdSchedule size={15} /> Opens
                            </div>
                            <p className="text-xs mt-0.5">
                              {formatSchedule(test.startAt)}
                            </p>
                          </div>
                        ) : pastDue ? (
                          <div className="text-sm text-red-500 max-w-[11rem]">
                            <div className="flex items-center justify-end gap-1.5 font-medium">
                              <MdLock size={15} /> Closed
                            </div>
                            <p className="text-xs mt-0.5">
                              {formatSchedule(dueLabel)}
                            </p>
                          </div>
                        ) : locked ? (
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                            <MdLock size={15} /> Max attempts
                          </div>
                        ) : canStart ? (
                          <button
                            onClick={() => {
                              setSubmitted(false);
                              setActiveTest(test);
                            }}
                            className="portal-btn-primary !text-sm"
                          >
                            {myAttempts.length === 0 ? "Start Test" : "Retry"}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {myAttempts.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                          Your attempts
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {myAttempts.map((att) => (
                            <div
                              key={att.id}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                att.status === "approved"
                                  ? att.passed
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                  : att.status === "pending_review"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {att.status === "approved" ? (
                                att.passed ? (
                                  <MdCheckCircle size={12} />
                                ) : (
                                  <MdCancel size={12} />
                                )
                              ) : (
                                <MdPending size={12} />
                              )}
                              Attempt {att.attemptNumber}
                              {att.status === "approved" &&
                                ` · ${att.percentage}%`}
                              {att.status === "pending_review" && " · Pending"}
                              {att.status === "approved" && (
                                <button
                                  onClick={() =>
                                    setViewingResult({ attempt: att, test })
                                  }
                                  className="ml-1.5 underline text-[10px] hover:opacity-70"
                                >
                                  View result
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        {myAttempts.some((a) => a.adminComment) && (
                          <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                            <p className="text-xs font-semibold text-blue-700 mb-1">
                              Teacher Feedback:
                            </p>
                            {myAttempts
                              .filter((a) => a.adminComment)
                              .map((a) => (
                                <p key={a.id} className="text-xs text-blue-600">
                                  Attempt {a.attemptNumber}: {a.adminComment}
                                </p>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <Pagination slice={pageSlice} onPageChange={setPage} />
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
