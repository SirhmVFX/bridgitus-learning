"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import Pagination from "@/components/Pagination";
import { useStudentAuth } from "@/lib/studentAuth";
import { paginate } from "@/lib/pagination";
import {
  getAssignmentsForStudent,
  getSubmission,
  upsertSubmission,
  getMaterialCompletions,
  getMaterialById,
  isMaterialCompleted,
  upsertStudentProgress,
  upsertLearningGap,
  type Assignment,
  type AssignmentSubmission,
  type MaterialCompletion,
} from "@/lib/firestore";
import { QuestionReadAloud } from "@/components/QuestionReadAloud";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  formatSchedule,
  isNotYetOpen,
  isPastDue,
  effectiveDueAt,
} from "@/lib/schedule";
import {
  MdAssignment,
  MdOpenInNew,
  MdCheckCircle,
  MdCalendarToday,
  MdLock,
  MdLink,
  MdMenuBook,
  MdExpandMore,
  MdExpandLess,
  MdAutoAwesome,
  MdPrint,
  MdAttachFile,
  MdSchedule,
} from "react-icons/md";
import type { Question } from "@/lib/firestore";

const TYPE_LABELS: Record<string, string> = {
  ixl: "IXL",
  deltamath: "DeltaMath",
  custom: "Custom",
  document: "Document",
  quiz: "Quiz",
};

const SUBMISSION_ACCEPT = ".pdf,.doc,.docx,.png,.jpg,.jpeg";
const SUBMISSION_FOLDER = "bridgitus/submissions";

function AssignmentCard({
  assignment,
  studentId,
  studentUid,
  studentName,
  isUnlocked,
  prerequisiteTitle,
  onStartQuiz,
  onViewResults,
  refreshToken,
}: {
  assignment: Assignment;
  studentId: string;
  studentUid: string;
  studentName: string;
  isUnlocked: boolean;
  prerequisiteTitle?: string;
  onStartQuiz?: (assignment: Assignment) => void;
  onViewResults?: (assignment: Assignment, submission: AssignmentSubmission) => void;
  refreshToken: number;
}) {
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [marking, setMarking] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>();
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!assignment.id) return;
    getSubmission(assignment.id, studentId).then((sub) => {
      setSubmission(sub);
      if (sub?.attachmentUrl) {
        setAttachmentUrl(sub.attachmentUrl);
        setAttachmentName(sub.attachmentName);
      }
    });
  }, [assignment.id, studentId, refreshToken]);

  const notOpen = isNotYetOpen(assignment);
  const pastDue = isPastDue(assignment);
  const scheduleBlocked = notOpen || pastDue;
  const canAct = isUnlocked && !scheduleBlocked;
  const dueLabel = effectiveDueAt(assignment);
  const requiresAttachment =
    assignment.type === "document" || assignment.type === "custom";

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

  async function markStarted() {
    if (!canAct || !assignment.id) return;
    setMarking(true);
    try {
      await upsertSubmission({
        assignmentId: assignment.id,
        studentId,
        studentUid,
        studentName,
        status: "in_progress",
      });
      setSubmission({
        assignmentId: assignment.id,
        studentId,
        studentUid,
        studentName,
        status: "in_progress",
      });
    } finally {
      setMarking(false);
    }
  }

  async function markSubmitted() {
    if (!assignment.id || !canAct) return;
    if (requiresAttachment && !attachmentUrl) {
      setUploadError("Please attach your work before submitting.");
      return;
    }
    setMarking(true);
    setUploadError("");
    try {
      await upsertSubmission({
        assignmentId: assignment.id,
        studentId,
        studentUid,
        studentName,
        status: "submitted",
        ...(attachmentUrl
          ? { attachmentUrl, attachmentName: attachmentName ?? "attachment" }
          : {}),
      });
      await upsertStudentProgress(studentId, assignment.grade, assignment.subject, {
        assignmentCompleted: true,
      });
      setSubmission((current) =>
        current
          ? {
              ...current,
              status: "submitted",
              attachmentUrl,
              attachmentName,
            }
          : {
              assignmentId: assignment.id!,
              studentId,
              studentUid,
              status: "submitted",
              attachmentUrl,
              attachmentName,
            }
      );
    } finally {
      setMarking(false);
    }
  }

  const status = submission?.status ?? "not_started";
  const hasQuiz = (assignment.questions?.length ?? 0) > 0 || assignment.type === "quiz";
  const canSubmitWork =
    canAct &&
    !hasQuiz &&
    (status === "in_progress" || status === "not_started");
  const showAttachmentInput =
    canAct &&
    !hasQuiz &&
    (status === "not_started" || status === "in_progress");

  const statusStyle: Record<string, string> = {
    not_started: "bg-gray-100 text-gray-600",
    in_progress: "bg-amber-100 text-amber-700",
    submitted: "bg-blue-100 text-blue-700",
    graded: "bg-emerald-100 text-emerald-700",
  };

  const statusLabel: Record<string, string> = {
    not_started: "Not Started",
    in_progress: "In Progress",
    submitted: "Submitted",
    graded: "Graded",
  };

  const platformColor = assignment.type === "ixl"
    ? "bg-orange-500"
    : assignment.type === "deltamath"
      ? "bg-blue-600"
      : "bg-secondary-color";

  return (
    <div className={`portal-card hover-lift !p-0 overflow-hidden transition-all ${!isUnlocked || scheduleBlocked ? "opacity-65" : pastDue && status === "not_started" ? "!border-red-200" : ""}`}>
      <div className={`h-1 ${!isUnlocked || scheduleBlocked ? "bg-gray-200" : assignment.type === "ixl" ? "bg-orange-500" : assignment.type === "deltamath" ? "bg-blue-600" : "bg-secondary-color"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-white text-xs font-bold px-2.5 py-0.5 rounded-full ${platformColor}`}>
                {TYPE_LABELS[assignment.type] ?? assignment.type}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{assignment.subject}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyle[status]}`}>{statusLabel[status]}</span>
              {!isUnlocked && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                  <MdLock size={11} /> Locked
                </span>
              )}
              {notOpen && isUnlocked && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                  <MdSchedule size={11} /> Not open
                </span>
              )}
              {pastDue && status === "not_started" && isUnlocked && (
                <span className="text-xs bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full font-semibold">Closed</span>
              )}
            </div>

            <h3 className={`font-semibold text-lg ${!isUnlocked ? "text-gray-400" : "text-[#001233]"}`}>{assignment.title}</h3>
            {assignment.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{assignment.description}</p>}

            {!isUnlocked && prerequisiteTitle && (
              <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <MdMenuBook size={15} className="shrink-0" />
                Complete <strong className="mx-1">&ldquo;{prerequisiteTitle}&rdquo;</strong> to unlock this assignment.
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-400">
              {assignment.startAt && (
                <span className="flex items-center gap-1">
                  <MdSchedule size={11} />
                  Start: {formatSchedule(assignment.startAt)}
                </span>
              )}
              {dueLabel && (
                <span className={`flex items-center gap-1 ${pastDue ? "text-red-500" : ""}`}>
                  <MdCalendarToday size={11} />
                  Due: {formatSchedule(dueLabel)}
                </span>
              )}
              {assignment.maxScore && <span>Max: {assignment.maxScore}</span>}
              {submission?.score !== undefined && (
                <span className="text-emerald-600 font-semibold">Score: {submission.score}/{assignment.maxScore ?? "—"}</span>
              )}
            </div>

            {(submission?.attachmentUrl || attachmentUrl) && (status === "submitted" || status === "graded") && (
              <a
                href={submission?.attachmentUrl ?? attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-color hover:underline"
              >
                <MdLink size={13} />
                {submission?.attachmentName ?? attachmentName ?? "View uploaded file"}
              </a>
            )}

            {status === "graded" && submission?.feedback && (
              <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 mb-0.5">Teacher Feedback:</p>
                <p className="text-xs text-emerald-600">{submission.feedback}</p>
              </div>
            )}
          </div>

          {isUnlocked && (
            <div className="flex flex-col items-end gap-2 shrink-0">
              {notOpen ? (
                <div className="text-sm text-slate-500 text-right max-w-[11rem]">
                  <div className="flex items-center justify-end gap-1.5 font-medium">
                    <MdSchedule size={15} /> Opens
                  </div>
                  <p className="text-xs mt-0.5">{formatSchedule(assignment.startAt)}</p>
                </div>
              ) : pastDue ? (
                <>
                  <div className="text-sm text-red-500 text-right max-w-[11rem]">
                    <div className="flex items-center justify-end gap-1.5 font-medium">
                      <MdLock size={15} /> Closed
                    </div>
                    <p className="text-xs mt-0.5">{formatSchedule(dueLabel)}</p>
                  </div>
                  {hasQuiz && status === "graded" && submission && onViewResults && (
                    <button
                      type="button"
                      onClick={() => onViewResults(assignment, submission)}
                      className="rounded-xl bg-emerald-600 text-white text-xs font-bold px-3 py-2 hover:bg-emerald-700 transition-colors"
                    >
                      View Results
                    </button>
                  )}
                </>
              ) : (
                <>
                  {assignment.platformUrl && (
                    <a
                      href={assignment.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={status === "not_started" && !hasQuiz ? markStarted : undefined}
                      className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors ${assignment.type === "ixl" ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      <MdOpenInNew size={13} />
                      Open in {assignment.type === "ixl" ? "IXL" : "DeltaMath"}
                    </a>
                  )}

                  {hasQuiz && status !== "graded" && onStartQuiz && (
                    <button
                      type="button"
                      onClick={() => onStartQuiz(assignment)}
                      className="portal-btn-primary !text-xs !px-3 !py-2"
                    >
                      Take Quiz
                    </button>
                  )}

                  {hasQuiz && status === "graded" && submission && onViewResults && (
                    <button
                      type="button"
                      onClick={() => onViewResults(assignment, submission)}
                      className="rounded-xl bg-emerald-600 text-white text-xs font-bold px-3 py-2 hover:bg-emerald-700 transition-colors"
                    >
                      View Results
                    </button>
                  )}

                  {hasQuiz && status === "graded" && onStartQuiz && (
                    <button
                      type="button"
                      onClick={() => onStartQuiz(assignment)}
                      className="rounded-xl border border-secondary-color text-secondary-color text-xs font-bold px-3 py-2 hover:bg-secondary-color hover:text-white transition-colors"
                    >
                      Retake Quiz
                    </button>
                  )}

                  {status === "in_progress" && !hasQuiz && (
                    <button
                      type="button"
                      onClick={markSubmitted}
                      disabled={marking || uploading || (requiresAttachment && !attachmentUrl)}
                      className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline disabled:opacity-60"
                    >
                      <MdCheckCircle size={15} /> Mark as Done
                    </button>
                  )}

                  {status === "not_started" && !assignment.platformUrl && !hasQuiz && (
                    <button
                      type="button"
                      onClick={markStarted}
                      disabled={marking}
                      className="portal-btn-primary !text-xs !px-3 !py-2 disabled:opacity-60"
                    >
                      Start
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {showAttachmentInput && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              {requiresAttachment ? "Attachment (required)" : "Optional attachment"}
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
                  disabled={uploading || marking}
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
            {requiresAttachment && !attachmentUrl && (
              <p className="mt-1.5 text-[11px] text-amber-700">
                Attach your completed work before marking as done.
              </p>
            )}
            {uploadError && <p className="mt-1.5 text-xs text-red-600">{uploadError}</p>}
            {canSubmitWork && status === "not_started" && assignment.platformUrl && attachmentUrl && (
              <button
                type="button"
                onClick={markSubmitted}
                disabled={marking || uploading}
                className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline disabled:opacity-60"
              >
                <MdCheckCircle size={15} /> Submit with attachment
              </button>
            )}
          </div>
        )}

        {isUnlocked && (assignment.content || assignment.fileUrl) && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-secondary-color font-medium hover:underline mb-3"
            >
              {expanded ? "Hide instructions ↑" : "Show instructions ↓"}
            </button>
            {expanded && (
              <div>
                {assignment.content && (
                  <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: assignment.content }} />
                )}
                {assignment.fileUrl && (
                  <a
                    href={assignment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 hover:bg-gray-200 transition-colors"
                  >
                    <MdLink size={13} />
                    {assignment.fileName ?? "Download file"}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuizResultPanel({
  assignment,
  submission,
  studentId,
  onBack,
}: {
  assignment: Assignment;
  submission: AssignmentSubmission;
  studentId: string;
  onBack: () => void;
}) {
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [creatingSimFor, setCreatingSimFor] = useState<string | null>(null);
  const [simError, setSimError] = useState("");
  const questions = assignment.questions ?? [];

  async function handleCreateSimilar(q: Question) {
    setCreatingSimFor(q.id);
    setSimError("");
    const topicLabel = assignment.title || assignment.subject;
    try {
      const res = await fetch("/api/create-similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: {
            ...q,
            topic: topicLabel,
            subtopic: assignment.subject,
            difficulty: "Core",
          },
          count: 3,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      const existing = JSON.parse(sessionStorage.getItem("practiceQuestions") ?? "[]");
      sessionStorage.setItem("practiceQuestions", JSON.stringify([...existing, ...data.questions]));
      sessionStorage.setItem(
        "practiceMeta",
        JSON.stringify({
          subject: assignment.subject,
          topic: topicLabel,
          difficulty: "Core",
          studentId,
          source: "assignment",
          assignmentId: assignment.id,
        })
      );
      window.location.href = "/portal/practice";
    } catch (err: unknown) {
      setSimError(err instanceof Error ? err.message : "Could not create similar questions");
    } finally {
      setCreatingSimFor(null);
    }
  }

  async function handlePracticeAllWrong() {
    const wrong = questions.filter((q) => !isCorrect(q));
    if (!wrong.length) return;
    setCreatingSimFor("__all__");
    setSimError("");
    const topicLabel = assignment.title || assignment.subject;
    try {
      const allQs: Question[] = [];
      for (const q of wrong.slice(0, 5)) {
        const res = await fetch("/api/create-similar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: {
              ...q,
              topic: topicLabel,
              subtopic: assignment.subject,
              difficulty: "Core",
            },
            count: 2,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        allQs.push(...(data.questions as Question[]));
      }
      const existing = JSON.parse(sessionStorage.getItem("practiceQuestions") ?? "[]");
      sessionStorage.setItem("practiceQuestions", JSON.stringify([...existing, ...allQs]));
      sessionStorage.setItem(
        "practiceMeta",
        JSON.stringify({
          subject: assignment.subject,
          topic: topicLabel,
          difficulty: "Core",
          studentId,
          source: "assignment",
          assignmentId: assignment.id,
        })
      );
      window.location.href = "/portal/practice";
    } catch (err: unknown) {
      setSimError(err instanceof Error ? err.message : "Could not create practice questions");
    } finally {
      setCreatingSimFor(null);
    }
  }

  const isCorrect = (q: Question) => {
    const given = submission.answers?.[q.id]?.trim().toLowerCase() ?? "";
    const correct = q.correctAnswer.trim().toLowerCase();
    if (q.type === "short_answer") return given.includes(correct);
    return given === correct;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card text-center !py-4">
          <p className={`text-3xl font-black ${(submission.passed ?? true) ? "text-emerald-600" : "text-red-500"}`}>
            {submission.percentage ?? 0}%
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400 mt-0.5">Score</p>
        </div>
        <div className="stat-card text-center !py-4">
          <p className="text-3xl font-black text-[#001233]">
            {submission.score ?? 0}/{submission.totalPoints ?? 0}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400 mt-0.5">Points</p>
        </div>
        <div className="stat-card text-center !py-4">
          <p className={`text-lg font-bold ${(submission.passed ?? true) ? "text-emerald-600" : "text-red-500"}`}>
            {(submission.passed ?? true) ? "Passed" : "Needs practice"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{assignment.title}</p>
        </div>
      </div>

      {simError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{simError}</p>}

      {submission.attachmentUrl && (
        <a
          href={submission.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium px-3 py-2 hover:bg-gray-100 transition-colors"
        >
          <MdLink size={15} />
          {submission.attachmentName ?? "View attachment"}
        </a>
      )}

      <div className="portal-card !p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-semibold text-[#001233] text-sm">
          Question breakdown
        </div>
        <div className="divide-y divide-gray-50">
          {questions.map((q, i) => {
            const correct = isCorrect(q);
            const expanded = expandedQ === q.id;
            return (
              <div key={q.id}>
                <div className={`px-4 py-3 flex items-start justify-between gap-3 ${correct ? "bg-emerald-50/50" : "bg-red-50/40"}`}>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${correct ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium text-gray-800 leading-snug">{q.text}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!correct && (
                      <button
                        onClick={() => handleCreateSimilar(q)}
                        disabled={creatingSimFor === q.id}
                        className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1 disabled:opacity-50"
                      >
                        <MdAutoAwesome size={13} />
                        {creatingSimFor === q.id ? "…" : "Practice"}
                      </button>
                    )}
                    <button onClick={() => setExpandedQ(expanded ? null : q.id)} className="text-gray-400 hover:text-gray-600">
                      {expanded ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
                    </button>
                  </div>
                </div>
                {expanded && (
                  <div className="px-4 py-4 bg-white space-y-3 border-t border-gray-100">
                    {q.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={q.imageUrl} alt="Question diagram" className="max-h-48 border border-gray-200 object-contain" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Your answer:</p>
                      <p className={`text-sm px-3 py-1.5 border ${correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>
                        {submission.answers?.[q.id] || <em className="text-gray-400">Not answered</em>}
                        {correct ? " ✓" : " ✗"}
                      </p>
                    </div>
                    {!correct && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Correct answer:</p>
                        <p className="text-sm px-3 py-1.5 border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold">
                          {q.correctAnswer} ✓
                        </p>
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

      <div className="flex flex-wrap gap-3">
        <button onClick={onBack} className="portal-btn-secondary">
          Back to assignments
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 portal-btn-secondary">
          <MdPrint size={15} /> Print
        </button>
        {questions.some((q) => !isCorrect(q)) && (
          <button
            type="button"
            onClick={handlePracticeAllWrong}
            disabled={creatingSimFor === "__all__"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 text-white text-sm font-semibold hover:bg-purple-800 disabled:opacity-60"
          >
            <MdAutoAwesome size={15} />
            {creatingSimFor === "__all__" ? "Building practice…" : "AI Practice wrong questions"}
          </button>
        )}
        <a href="/portal/practice" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-300 text-purple-800 text-sm font-semibold hover:bg-purple-50">
          <MdAutoAwesome size={15} /> Open AI Practice
        </a>
      </div>
    </div>
  );
}

function QuizRunner({
  assignment,
  studentId,
  studentUid,
  studentName,
  studentGrade,
  onCancel,
  onComplete,
}: {
  assignment: Assignment;
  studentId: string;
  studentUid: string;
  studentName: string;
  studentGrade: string;
  onCancel: () => void;
  onComplete: (assignment: Assignment, submission: AssignmentSubmission) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>();
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const questions = assignment.questions ?? [];
  const totalPoints = assignment.totalPoints ?? questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
  const requiresAttachment =
    assignment.type === "document" || assignment.type === "custom";

  function handleAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleAttachmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadToCloudinary(file, SUBMISSION_FOLDER);
      setAttachmentUrl(url);
      setAttachmentName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  function grade() {
    let score = 0;
    for (const q of questions) {
      const given = answers[q.id]?.trim().toLowerCase() ?? "";
      const correct = q.correctAnswer.trim().toLowerCase();
      if (q.type === "multiple_choice" || q.type === "true_false") {
        if (given === correct) score += q.points;
      } else {
        if (given && correct && given.includes(correct)) score += q.points;
      }
    }
    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    return {
      score,
      percentage,
      passed: assignment.passMark !== undefined ? percentage >= assignment.passMark : true,
    };
  }

  async function handleSubmit() {
    if (!assignment.id) {
      setError("Assignment is not available.");
      return;
    }
    if (requiresAttachment && !attachmentUrl) {
      setError("Please attach your work before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { score, percentage, passed } = grade();
      const submission: AssignmentSubmission = {
        assignmentId: assignment.id,
        studentId,
        studentUid,
        studentName,
        status: "graded",
        answers,
        score,
        totalPoints,
        percentage,
        passed,
        attemptNumber: 1,
        ...(attachmentUrl
          ? { attachmentUrl, attachmentName: attachmentName ?? "attachment" }
          : {}),
      };

      await upsertSubmission(submission);

      // Feed learning gaps so assignment results appear in analytics + AI Practice gap list
      try {
        const topicStats: Record<string, { correct: number; total: number }> = {};
        for (const q of questions) {
          const topic = assignment.title || assignment.subject;
          topicStats[topic] ??= { correct: 0, total: 0 };
          topicStats[topic].total++;
          const given = answers[q.id]?.trim().toLowerCase() ?? "";
          const correctAns = q.correctAnswer.trim().toLowerCase();
          const ok =
            q.type === "short_answer"
              ? given.includes(correctAns)
              : given === correctAns;
          if (ok) topicStats[topic].correct++;
        }
        await Promise.all(
          Object.entries(topicStats).map(([topic, v]) => {
            const accuracy = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
            return upsertLearningGap(studentId, assignment.subject, topic, undefined, accuracy);
          })
        );
      } catch (gapErr) {
        console.error("Learning gap update failed (quiz still saved):", gapErr);
      }

      onComplete(assignment, submission);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!questions.length) {
    return (
      <div className="portal-card p-8 text-center">
        <p className="text-gray-600">This quiz is not configured yet. Please contact your teacher.</p>
        <button type="button" onClick={onCancel} className="mt-4 text-sm font-semibold text-secondary-color hover:underline">
          Back to assignments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 portal-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#001233]">{assignment.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
          <p className="text-xs text-gray-400 mt-2">{questions.length} questions · {totalPoints} points total</p>
        </div>
        <button type="button" onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="border rounded-xl p-4">
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <p className="text-sm font-semibold text-gray-900">Question {index + 1}</p>
              <div className="flex items-center gap-2">
                <QuestionReadAloud
                  grade={studentGrade}
                  text={question.text}
                  options={
                    question.type === "true_false"
                      ? ["True", "False"]
                      : question.options
                  }
                  index={index}
                />
                <span className="text-xs text-gray-500">{question.points} points</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{question.text}</p>
            {question.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={question.imageUrl} alt="Question diagram"
                className="max-h-56 border border-gray-200 object-contain mb-3" />
            )}

            {question.type === "multiple_choice" && question.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-secondary-color">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswer(question.id, option)}
                  className="form-radio text-secondary-color"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}

            {question.type === "true_false" && ["True", "False"].map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-secondary-color">
                <input
                  type="radio"
                  name={question.id}
                  value={option.toLowerCase()}
                  checked={answers[question.id] === option.toLowerCase()}
                  onChange={() => handleAnswer(question.id, option.toLowerCase())}
                  className="form-radio text-secondary-color"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}

            {question.type === "short_answer" && (
              <textarea
                value={answers[question.id] ?? ""}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 focus:border-secondary-color focus:ring-secondary-color/20"
                placeholder="Type your answer here"
              />
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <label className="block text-xs font-semibold text-gray-500 mb-2">
          {requiresAttachment ? "Attachment (required)" : "Optional attachment"}
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
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || uploading || (requiresAttachment && !attachmentUrl)}
          className="portal-btn-primary disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit Quiz"}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:underline">
          Back to assignments
        </button>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const { student, user } = useStudentAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [completions, setCompletions] = useState<MaterialCompletion[]>([]);
  const [materialTitles, setMaterialTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ixl" | "deltamath" | "custom" | "document" | "quiz">("all");
  const [activeQuiz, setActiveQuiz] = useState<Assignment | null>(null);
  const [resultView, setResultView] = useState<{ assignment: Assignment; submission: AssignmentSubmission } | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [page, setPage] = useState(1);

  async function loadAssignments() {
    if (!student?.grade || !student?.id) return;
    setLoading(true);
    try {
      const [ass, comps] = await Promise.all([
        getAssignmentsForStudent(student.grade, student.id),
        getMaterialCompletions(student.id, student.grade),
      ]);

      setAssignments(ass);
      setCompletions(comps);

      const ids = [...new Set(ass.map((a) => a.linkedMaterialId).filter(Boolean) as string[])];
      const titles: Record<string, string> = {};
      await Promise.all(ids.map(async (id) => {
        const material = await getMaterialById(id);
        if (material) titles[id] = material.title;
      }));
      setMaterialTitles(titles);
      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error("Assignments load error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, [student]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const filtered = filter === "all" ? assignments : assignments.filter((a) => a.type === filter);
  const pageSlice = paginate(filtered, page);
  const ixlCount = assignments.filter((a) => a.type === "ixl").length;
  const deltaMathCount = assignments.filter((a) => a.type === "deltamath").length;

  function isAssignmentUnlocked(a: Assignment): boolean {
    if (!a.linkedMaterialId) return true;
    return isMaterialCompleted(completions, a.linkedMaterialId);
  }

  async function handleCompleteQuiz(assignment: Assignment, submission: AssignmentSubmission) {
    setActiveQuiz(null);
    setResultView({ assignment, submission });
    await upsertStudentProgress(submission.studentId, assignment.grade, assignment.subject, { assignmentCompleted: true });
    await loadAssignments();
  }

  return (
    <PortalLayout>
      <div className="w-full space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">Tasks</p>
          <h1 className="text-2xl lg:text-[1.75rem] font-extrabold text-[#001233] tracking-tight">Assignments</h1>
          <p className="text-slate-500 text-sm mt-1">Your tasks, IXL exercises, and DeltaMath practice</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <a href="https://www.ixl.com" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-orange-500 text-white p-4 flex items-center justify-between hover:bg-orange-600 transition-colors border border-orange-600">
            <div>
              <p className="font-bold text-lg">IXL Learning</p>
              <p className="text-white/80 text-sm">{ixlCount} assignment{ixlCount !== 1 ? "s" : ""} assigned</p>
            </div>
            <MdOpenInNew size={22} className="text-white/70" />
          </a>
          <a href="https://www.deltamath.com" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-blue-600 text-white p-4 flex items-center justify-between hover:bg-blue-700 transition-colors border border-blue-700">
            <div>
              <p className="font-bold text-lg">DeltaMath</p>
              <p className="text-white/80 text-sm">{deltaMathCount} assignment{deltaMathCount !== 1 ? "s" : ""} assigned</p>
            </div>
            <MdOpenInNew size={22} className="text-white/70" />
          </a>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["all", "ixl", "deltamath", "quiz", "custom", "document"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all border ${filter === value ? "bg-[#001233] text-white border-[#001233]" : "bg-white border-gray-200 text-gray-600 hover:border-[#00369b]"}`}
            >
              {value === "all" ? "All" : TYPE_LABELS[value]}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} assignment{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, index) => <div key={index} className="portal-card h-32 animate-pulse bg-slate-100" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="portal-card p-16 text-center">
            <MdAssignment size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No assignments yet.</p>
          </div>
        ) : resultView ? (
          <QuizResultPanel
            assignment={resultView.assignment}
            submission={resultView.submission}
            studentId={student!.id!}
            onBack={() => setResultView(null)}
          />
        ) : activeQuiz ? (
          <QuizRunner
            assignment={activeQuiz}
            studentId={student!.id!}
            studentUid={user!.uid}
            studentName={`${student!.firstName} ${student!.lastName}`.trim()}
            studentGrade={student!.grade}
            onCancel={() => setActiveQuiz(null)}
            onComplete={handleCompleteQuiz}
          />
        ) : (
          <div className="space-y-4">
            {pageSlice.items.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                studentId={student!.id!}
                studentUid={user!.uid}
                studentName={`${student!.firstName} ${student!.lastName}`.trim()}
                isUnlocked={isAssignmentUnlocked(assignment)}
                prerequisiteTitle={assignment.linkedMaterialId ? materialTitles[assignment.linkedMaterialId] : undefined}
                refreshToken={refreshToken}
                onStartQuiz={(a) => {
                  if (isNotYetOpen(a) || isPastDue(a)) return;
                  setResultView(null);
                  setActiveQuiz(a);
                }}
                onViewResults={(a, s) => setResultView({ assignment: a, submission: s })}
              />
            ))}
            <Pagination slice={pageSlice} onPageChange={setPage} />
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
