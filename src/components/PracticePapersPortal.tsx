"use client";

import { useEffect, useRef, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import Pagination from "@/components/Pagination";
import { useStudentAuth } from "@/lib/studentAuth";
import { paginate } from "@/lib/pagination";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  formatSchedule,
  isNotYetOpen,
  isPastDue,
  effectiveDueAt,
} from "@/lib/schedule";
import {
  getPracticePapersForStudent,
  getStudentPracticeAttempts,
  submitPracticeAttempt,
  normalizeYearGrade,
  type PracticePaper,
  type PracticeAttempt,
  type PracticeProgram,
  type Question,
} from "@/lib/firestore";
import QuestionVideo from "@/components/QuestionVideo";
import {
  MdQuiz,
  MdTimer,
  MdCheckCircle,
  MdLock,
  MdArrowBack,
  MdArrowForward,
  MdSend,
  MdAttachFile,
  MdSchedule,
  MdLink,
  MdOpenInNew,
  MdSchool,
} from "react-icons/md";

const SUBMISSION_ACCEPT = ".pdf,.doc,.docx,.png,.jpg,.jpeg";
const SUBMISSION_FOLDER = "bridgitus/submissions";
const QUIZ_TYPES = new Set(["quiz", "exam", "test"]);

function gradeAnswers(paper: PracticePaper, answers: Record<string, string>) {
  const questions = paper.questions ?? [];
  let score = 0;
  for (const q of questions) {
    const given = answers[q.id]?.trim().toLowerCase() ?? "";
    const correct = q.correctAnswer.trim().toLowerCase();
    if (q.type === "multiple_choice" || q.type === "true_false") {
      if (given === correct) score += q.points;
    } else if (q.type === "short_answer") {
      if (given && correct && given.includes(correct)) score += q.points;
    }
  }
  const totalPoints = paper.totalPoints || questions.reduce((s, q) => s + q.points, 0) || 1;
  const percentage = Math.round((score / totalPoints) * 100);
  const passMark = paper.passMark ?? 60;
  return { score, totalPoints, percentage, passed: percentage >= passMark };
}

function PaperQuizRunner({
  paper,
  studentId,
  studentUid,
  studentName,
  attemptNumber,
  onDone,
}: {
  paper: PracticePaper;
  studentId: string;
  studentUid: string;
  studentName: string;
  attemptNumber: number;
  onDone: () => void;
}) {
  const questions = paper.questions ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>();
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    paper.timeLimit && paper.timeLimit > 0 ? paper.timeLimit * 60 : null
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  async function handleSubmit() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSubmitting(true);
    try {
      const { score, totalPoints, percentage, passed } = gradeAnswers(paper, answers);
      await submitPracticeAttempt({
        paperId: paper.id!,
        paperTitle: paper.title,
        program: paper.program,
        studentId,
        studentUid,
        studentName,
        answers,
        score,
        totalPoints,
        percentage,
        passed,
        attemptNumber,
        status: "graded",
        ...(attachmentUrl
          ? { attachmentUrl, attachmentName: attachmentName ?? "attachment" }
          : {}),
      });
      onDone();
    } finally {
      setSubmitting(false);
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

  if (!questions.length) {
    return (
      <div className="portal-card text-center py-10 text-slate-500">
        This paper has no questions yet.
        <button onClick={onDone} className="portal-btn-secondary mt-4 ml-3">
          Back
        </button>
      </div>
    );
  }

  const q: Question = questions[current];
  const answered = Object.keys(answers).length;

  return (
    <div className="portal-card !p-0 overflow-hidden">
      <div className="bg-[#00369b] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">{paper.title}</h2>
          <p className="text-white/70 text-sm">
            {paper.subject} · Years {(paper.yearLevels ?? []).join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-white/20 rounded-full px-3 py-1">
            {answered}/{questions.length} answered
          </span>
          {timeLeft !== null && (
            <span
              className={`bg-white/20 rounded-full px-3 py-1 flex items-center gap-1 ${
                timeLeft < 60 ? "bg-red-600/80" : ""
              }`}
            >
              <MdTimer size={14} />
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-[#00c1ff] transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-xl bg-[#00369b] text-white text-sm font-bold flex items-center justify-center">
            {current + 1}
          </span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {q.type.replace("_", " ")} · {q.points} pt{q.points !== 1 ? "s" : ""}
          </span>
        </div>
        <div
          className="text-gray-800 font-medium text-base mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: q.text }}
        />
        {q.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={q.imageUrl}
            alt="Question"
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
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[q.id] === opt
                    ? "border-[#00369b] bg-[#00369b]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
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
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer font-semibold transition-all ${
                  answers[q.id] === opt.toLowerCase()
                    ? "border-[#00369b] bg-[#00369b]/5 text-[#00369b]"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
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
            className="w-full p-4 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-[#00369b] resize-none"
          />
        )}
      </div>

      <div className="px-6 pb-4 border-t border-gray-100 pt-4">
        <label className="block text-xs font-semibold text-gray-500 mb-2">
          Optional attachment
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer hover:border-[#00369b]">
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
              className="inline-flex items-center gap-1 text-xs text-[#00369b] font-medium hover:underline"
            >
              <MdLink size={13} />
              {attachmentName}
            </a>
          )}
        </div>
        {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
      </div>

      <div className="px-6 pb-6 flex items-center justify-between">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-40"
        >
          <MdArrowBack size={16} /> Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            className="portal-btn-primary !py-2 flex items-center gap-2"
          >
            Next <MdArrowForward size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
          >
            <MdSend size={16} />
            {submitting ? "Submitting…" : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}

function DocumentSubmitPanel({
  paper,
  studentId,
  studentUid,
  studentName,
  attemptNumber,
  onDone,
}: {
  paper: PracticePaper;
  studentId: string;
  studentUid: string;
  studentName: string;
  attemptNumber: number;
  onDone: () => void;
}) {
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>();
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit() {
    if (!attachmentUrl) {
      setUploadError("Please attach your completed work before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await submitPracticeAttempt({
        paperId: paper.id!,
        paperTitle: paper.title,
        program: paper.program,
        studentId,
        studentUid,
        studentName,
        attemptNumber,
        status: "submitted",
        totalPoints: paper.totalPoints ?? 100,
        attachmentUrl,
        attachmentName: attachmentName ?? "attachment",
      });
      onDone();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="portal-card space-y-4">
      <button
        onClick={onDone}
        className="text-sm text-[#00369b] font-semibold inline-flex items-center gap-1 hover:underline"
      >
        <MdArrowBack size={14} /> Back to list
      </button>
      <h2 className="text-xl font-extrabold text-[#001233]">{paper.title}</h2>
      {paper.description && (
        <p className="text-sm text-slate-500">{paper.description}</p>
      )}
      {paper.content && (
        <div
          className="prose prose-sm max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: paper.content }}
        />
      )}
      {paper.fileUrl && (
        <a
          href={paper.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 portal-btn-secondary text-sm"
        >
          <MdOpenInNew size={15} />
          {paper.fileName || "Download paper"}
        </a>
      )}
      <div className="border-t border-slate-100 pt-4">
        <label className="block text-xs font-semibold text-gray-500 mb-2">
          Upload your completed work
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer hover:border-[#00369b]">
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
              className="inline-flex items-center gap-1 text-xs text-[#00369b] font-medium hover:underline"
            >
              <MdLink size={13} />
              {attachmentName}
            </a>
          )}
          <span className="text-[11px] text-gray-400">PDF, DOC, DOCX, PNG, JPG</span>
        </div>
        {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting || uploading || !attachmentUrl}
          className="mt-4 portal-btn-primary inline-flex items-center gap-2 disabled:opacity-60"
        >
          <MdSend size={15} />
          {submitting ? "Submitting…" : "Submit for grading"}
        </button>
      </div>
    </div>
  );
}

export default function PracticePapersPortal({
  program,
  title,
  subtitle,
  allowedYears,
  restrictedMessage,
}: {
  program: PracticeProgram;
  title: string;
  subtitle: string;
  allowedYears?: string[];
  restrictedMessage?: string;
}) {
  const { student, user } = useStudentAuth();
  const [papers, setPapers] = useState<PracticePaper[]>([]);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePaper, setActivePaper] = useState<PracticePaper | null>(null);
  const [page, setPage] = useState(1);

  const gradeNorm = normalizeYearGrade(student?.grade);
  const yearAllowed =
    !allowedYears ||
    allowedYears.some((y) => normalizeYearGrade(y) === gradeNorm);

  async function load() {
    if (!student?.id || !student?.grade) return;
    try {
      const [p, a] = await Promise.all([
        getPracticePapersForStudent(program, student.grade),
        getStudentPracticeAttempts(student.id, program),
      ]);
      setPapers(p);
      setAttempts(a);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!yearAllowed) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id, student?.grade, program, yearAllowed]);

  function attemptsFor(paperId: string) {
    return attempts.filter((a) => a.paperId === paperId);
  }

  if (!yearAllowed) {
    return (
      <PortalLayout>
        <div className="portal-card text-center py-16 max-w-lg mx-auto">
          <MdSchool size={40} className="mx-auto text-slate-300 mb-3" />
          <h1 className="text-xl font-extrabold text-[#001233] mb-2">{title}</h1>
          <p className="text-sm text-slate-500">
            {restrictedMessage ??
              `This program is available for Years ${allowedYears?.join(" & ") ?? "—"}. Your grade is Year ${student?.grade ?? "—"}.`}
          </p>
        </div>
      </PortalLayout>
    );
  }

  if (activePaper && QUIZ_TYPES.has(activePaper.type)) {
    return (
      <PortalLayout>
        <div className="space-y-4">
          <button
            onClick={() => setActivePaper(null)}
            className="text-sm text-[#00369b] font-semibold inline-flex items-center gap-1 hover:underline"
          >
            <MdArrowBack size={14} /> Back
          </button>
          <PaperQuizRunner
            paper={activePaper}
            studentId={student!.id!}
            studentUid={user!.uid}
            studentName={`${student!.firstName} ${student!.lastName}`.trim()}
            attemptNumber={attemptsFor(activePaper.id!).length + 1}
            onDone={async () => {
              setActivePaper(null);
              await load();
            }}
          />
        </div>
      </PortalLayout>
    );
  }

  if (activePaper && (activePaper.type === "document" || activePaper.type === "custom")) {
    return (
      <PortalLayout>
        <DocumentSubmitPanel
          paper={activePaper}
          studentId={student!.id!}
          studentUid={user!.uid}
          studentName={`${student!.firstName} ${student!.lastName}`.trim()}
          attemptNumber={attemptsFor(activePaper.id!).length + 1}
          onDone={async () => {
            setActivePaper(null);
            await load();
          }}
        />
      </PortalLayout>
    );
  }

  const slice = paginate(papers, page);

  return (
    <PortalLayout>
      <div className="space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">
            Exam Prep
          </p>
          <h1 className="text-2xl lg:text-[1.75rem] font-extrabold text-[#001233] tracking-tight">
            {title}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        </div>

        {loading ? (
          <div className="portal-card text-center py-10 text-slate-400 text-sm">
            Loading…
          </div>
        ) : papers.length === 0 ? (
          <div className="portal-card text-center py-12">
            <MdQuiz size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              No published papers for Year {student?.grade} yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {slice.items.map((paper) => {
                const mine = attemptsFor(paper.id!);
                const latest = mine[0];
                const notOpen = isNotYetOpen(paper);
                const pastDue = isPastDue(paper);
                const scheduleBlocked = notOpen || pastDue;
                const maxAttempts = paper.maxAttempts ?? 3;
                const attemptsLeft = QUIZ_TYPES.has(paper.type)
                  ? Math.max(0, maxAttempts - mine.length)
                  : mine.some((a) => a.status === "submitted" || a.status === "graded")
                    ? 0
                    : 1;
                const canStart = !scheduleBlocked && attemptsLeft > 0;

                return (
                  <div
                    key={paper.id}
                    className={`portal-card hover-lift !p-0 overflow-hidden ${
                      scheduleBlocked ? "opacity-70" : ""
                    }`}
                  >
                    <div
                      className={`h-1 ${
                        scheduleBlocked
                          ? "bg-gray-200"
                          : paper.type === "exam"
                            ? "bg-red-500"
                            : "bg-[#00369b]"
                      }`}
                    />
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-[#001233]">{paper.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {paper.subject} · {paper.type}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#00369b]/10 text-[#00369b] text-[10px] font-bold px-2 py-0.5">
                          Y{(paper.yearLevels ?? []).join(",")}
                        </span>
                      </div>
                      {paper.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {paper.description}
                        </p>
                      )}
                      {(paper.startAt || effectiveDueAt(paper)) && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MdSchedule size={12} />
                          {paper.startAt
                            ? `Opens ${formatSchedule(paper.startAt)}`
                            : null}
                          {paper.startAt && effectiveDueAt(paper) ? " · " : null}
                          {effectiveDueAt(paper)
                            ? `Due ${formatSchedule(effectiveDueAt(paper))}`
                            : null}
                        </p>
                      )}
                      {latest && (
                        <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs">
                          {latest.status === "graded" ? (
                            <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                              <MdCheckCircle size={13} />
                              {latest.percentage != null
                                ? `${latest.percentage}%`
                                : `Score ${latest.score}`}
                              {latest.feedback ? ` · ${latest.feedback}` : ""}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium">
                              Submitted — awaiting grade
                            </span>
                          )}
                          {latest.attachmentUrl && (
                            <a
                              href={latest.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block mt-1 text-[#00369b] hover:underline"
                            >
                              Your attachment
                            </a>
                          )}
                        </div>
                      )}
                      {notOpen && (
                        <p className="text-xs text-amber-600 flex items-center gap-1">
                          <MdLock size={12} /> Not open yet
                        </p>
                      )}
                      {pastDue && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <MdLock size={12} /> Past due
                        </p>
                      )}
                      <button
                        disabled={!canStart}
                        onClick={() => setActivePaper(paper)}
                        className="portal-btn-primary w-full text-sm disabled:opacity-50"
                      >
                        {canStart
                          ? QUIZ_TYPES.has(paper.type)
                            ? mine.length
                              ? "Retry"
                              : "Start"
                            : "Open & submit"
                          : attemptsLeft === 0
                            ? "No attempts left"
                            : "Unavailable"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination slice={slice} onPageChange={setPage} />
          </>
        )}
      </div>
    </PortalLayout>
  );
}
