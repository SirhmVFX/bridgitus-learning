"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getAssignmentsForStudent, getSubmission, upsertSubmission,
  getMaterialCompletions, getMaterialById, isMaterialCompleted,
  upsertStudentProgress,
  type Assignment, type AssignmentSubmission, type MaterialCompletion,
} from "@/lib/firestore";
import {
  MdAssignment, MdOpenInNew, MdCheckCircle, MdCalendarToday,
  MdLock, MdLink, MdMenuBook,
} from "react-icons/md";

const TYPE_LABELS: Record<string, string> = {
  ixl: "IXL", deltamath: "DeltaMath", custom: "Custom", document: "Document",
};

function AssignmentCard({
  assignment, studentId, studentUid, isUnlocked, prerequisiteTitle,
}: {
  assignment: Assignment; studentId: string; studentUid: string;
  isUnlocked: boolean; prerequisiteTitle?: string;
}) {
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [marking, setMarking] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getSubmission(assignment.id!, studentId).then(setSubmission);
  }, [assignment.id, studentId]);

  async function markStarted() {
    if (!isUnlocked) return;
    setMarking(true);
    try {
      await upsertSubmission({ assignmentId: assignment.id!, studentId, studentUid, status: "in_progress" });
      setSubmission({ assignmentId: assignment.id!, studentId, studentUid, status: "in_progress" });
    } finally { setMarking(false); }
  }

  async function markSubmitted() {
    setMarking(true);
    try {
      await upsertSubmission({ assignmentId: assignment.id!, studentId, studentUid, status: "submitted" });
      await upsertStudentProgress(studentId, assignment.grade, assignment.subject, { assignmentCompleted: true });
      setSubmission((s) => s ? { ...s, status: "submitted" } : null);
    } finally { setMarking(false); }
  }

  const status = submission?.status ?? "not_started";
  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

  const statusStyle: Record<string, string> = {
    not_started: "bg-gray-100 text-gray-600",
    in_progress: "bg-amber-100 text-amber-700",
    submitted: "bg-blue-100 text-blue-700",
    graded: "bg-emerald-100 text-emerald-700",
  };
  const statusLabel: Record<string, string> = {
    not_started: "Not Started", in_progress: "In Progress",
    submitted: "Submitted", graded: "Graded",
  };

  const platformColor = assignment.type === "ixl" ? "bg-orange-500" : assignment.type === "deltamath" ? "bg-blue-600" : "bg-gray-500";

  return (
    <div className={`bg-white border overflow-hidden transition-all ${!isUnlocked ? "opacity-65 border-gray-200" : isOverdue && status === "not_started" ? "border-red-200" : "border-gray-200"}`}>
      <div className={`h-1 ${!isUnlocked ? "bg-gray-200" : assignment.type === "ixl" ? "bg-orange-500" : assignment.type === "deltamath" ? "bg-blue-600" : "bg-secondary-color"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-white text-xs font-bold px-2 py-0.5 ${platformColor}`}>
                {TYPE_LABELS[assignment.type] ?? assignment.type}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5">{assignment.subject}</span>
              <span className={`text-xs px-2 py-0.5 font-medium ${statusStyle[status]}`}>{statusLabel[status]}</span>
              {!isUnlocked && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 font-semibold flex items-center gap-0.5"><MdLock size={11} /> Locked</span>}
              {isOverdue && status === "not_started" && isUnlocked && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 font-semibold">Overdue</span>}
            </div>

            <h3 className={`font-semibold text-lg ${!isUnlocked ? "text-gray-400" : "text-gray-900"}`}>{assignment.title}</h3>
            {assignment.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{assignment.description}</p>}

            {/* Prerequisite notice */}
            {!isUnlocked && prerequisiteTitle && (
              <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
                <MdMenuBook size={15} className="shrink-0" />
                Complete <strong className="mx-1">&ldquo;{prerequisiteTitle}&rdquo;</strong> to unlock this assignment.
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-400">
              {assignment.dueDate && (
                <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : ""}`}>
                  <MdCalendarToday size={11} />
                  Due: {new Date(assignment.dueDate).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}
                </span>
              )}
              {assignment.maxScore && <span>Max: {assignment.maxScore}</span>}
              {submission?.score !== undefined && (
                <span className="text-emerald-600 font-semibold">Score: {submission.score}/{assignment.maxScore ?? "—"}</span>
              )}
            </div>

            {status === "graded" && submission?.feedback && (
              <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 mb-0.5">Teacher Feedback:</p>
                <p className="text-xs text-emerald-600">{submission.feedback}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {isUnlocked && (
            <div className="flex flex-col items-end gap-2 shrink-0">
              {assignment.platformUrl && (
                <a href={assignment.platformUrl} target="_blank" rel="noopener noreferrer"
                  onClick={status === "not_started" ? markStarted : undefined}
                  className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-2 transition-colors ${assignment.type === "ixl" ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                  <MdOpenInNew size={13} />
                  Open in {assignment.type === "ixl" ? "IXL" : "DeltaMath"}
                </a>
              )}
              {status === "in_progress" && (
                <button onClick={markSubmitted} disabled={marking}
                  className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline disabled:opacity-60">
                  <MdCheckCircle size={15} /> Mark as Done
                </button>
              )}
              {status === "not_started" && !assignment.platformUrl && (
                <button onClick={markStarted} disabled={marking}
                  className="bg-secondary-color text-white text-xs font-bold px-3 py-2 hover:bg-secondary-color/90 transition-colors disabled:opacity-60">
                  Start
                </button>
              )}
            </div>
          )}
        </div>

        {isUnlocked && (assignment.content || assignment.fileUrl) && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-secondary-color font-medium hover:underline mb-3">
              {expanded ? "Hide instructions ↑" : "Show instructions ↓"}
            </button>
            {expanded && (
              <div>
                {assignment.content && <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: assignment.content }} />}
                {assignment.fileUrl && (
                  <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 hover:bg-gray-200 transition-colors">
                    <MdLink size={13} />{assignment.fileName ?? "Download file"}
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

export default function AssignmentsPage() {
  const { student, user } = useStudentAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [completions, setCompletions] = useState<MaterialCompletion[]>([]);
  const [materialTitles, setMaterialTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ixl" | "deltamath" | "custom" | "document">("all");

  useEffect(() => {
    if (!student?.grade || !student?.id) return;
    async function load() {
      const [ass, comps] = await Promise.all([
        getAssignmentsForStudent(student!.grade, student!.id!),
        getMaterialCompletions(student!.id!, student!.grade),
      ]);
      setAssignments(ass); setCompletions(comps);
      const ids = [...new Set(ass.map((a) => a.linkedMaterialId).filter(Boolean) as string[])];
      const titles: Record<string, string> = {};
      await Promise.all(ids.map(async (id) => {
        const m = await getMaterialById(id);
        if (m) titles[id] = m.title;
      }));
      setMaterialTitles(titles);
      setLoading(false);
    }
    load();
  }, [student]);

  const filtered = filter === "all" ? assignments : assignments.filter((a) => a.type === filter);
  const ixlCount = assignments.filter((a) => a.type === "ixl").length;
  const deltaMathCount = assignments.filter((a) => a.type === "deltamath").length;

  function isAssignmentUnlocked(a: Assignment): boolean {
    if (!a.linkedMaterialId) return true;
    return isMaterialCompleted(completions, a.linkedMaterialId);
  }

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your tasks, IXL exercises, and DeltaMath practice</p>
        </div>

        {/* Platform quick links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="https://www.ixl.com" target="_blank" rel="noopener noreferrer"
            className="bg-orange-500 text-white p-4 flex items-center justify-between hover:bg-orange-600 transition-colors">
            <div><p className="font-bold text-lg">IXL Learning</p><p className="text-white/80 text-sm">{ixlCount} assignment{ixlCount !== 1 ? "s" : ""} assigned</p></div>
            <MdOpenInNew size={22} className="text-white/70" />
          </a>
          <a href="https://www.deltamath.com" target="_blank" rel="noopener noreferrer"
            className="bg-blue-600 text-white p-4 flex items-center justify-between hover:bg-blue-700 transition-colors">
            <div><p className="font-bold text-lg">DeltaMath</p><p className="text-white/80 text-sm">{deltaMathCount} assignment{deltaMathCount !== 1 ? "s" : ""} assigned</p></div>
            <MdOpenInNew size={22} className="text-white/70" />
          </a>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "ixl", "deltamath", "custom", "document"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium transition-all border ${filter === f ? "bg-secondary-color text-white border-secondary-color" : "bg-white border-gray-200 text-gray-600 hover:border-secondary-color"}`}>
              {f === "all" ? "All" : TYPE_LABELS[f]}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} assignment{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white border h-32 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <MdAssignment size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No assignments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((a) => (
              <AssignmentCard key={a.id} assignment={a}
                studentId={student!.id!} studentUid={user!.uid}
                isUnlocked={isAssignmentUnlocked(a)}
                prerequisiteTitle={a.linkedMaterialId ? materialTitles[a.linkedMaterialId] : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
