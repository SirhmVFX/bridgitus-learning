"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getAllStudentAttempts,
  getAssignmentsForStudent,
  getStudentProgress,
  getMaterialsByGrade,
  getMaterialCompletions,
  isMaterialCompleted,
  getAnnouncementsForStudent,
  type TestAttempt,
  type Assignment,
  type StudentProgress,
  type LearningMaterial,
  type Announcement,
} from "@/lib/firestore";
import {
  MdMenuBook, MdQuiz, MdAssignment, MdBarChart,
  MdCheckCircle, MdPending, MdTrendingUp, MdStar,
  MdPushPin, MdCampaign, MdArrowForward, MdTimer,
  MdLock,
} from "react-icons/md";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { student } = useStudentAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [completions, setCompletions] = useState<ReturnType<typeof getMaterialCompletions> extends Promise<infer T> ? T : never>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id || !student?.grade) return;
    async function load() {
      try {
        const [att, ass, prog, mats, comps, ann] = await Promise.all([
          getAllStudentAttempts(student!.id!),
          getAssignmentsForStudent(student!.grade, student!.id!),
          getStudentProgress(student!.id!),
          getMaterialsByGrade(student!.grade),
          getMaterialCompletions(student!.id!, student!.grade),
          getAnnouncementsForStudent(student!.grade),
        ]);
        setAttempts(att); setAssignments(ass); setProgress(prog);
        setMaterials(mats); setCompletions(comps as typeof completions); setAnnouncements(ann);
      } finally { setLoading(false); }
    }
    load();
  }, [student]);

  const approvedAttempts = attempts.filter((a) => a.status === "approved");
  const pendingAttempts = attempts.filter((a) => a.status === "pending_review");
  const avgScore = approvedAttempts.length > 0
    ? Math.round(approvedAttempts.reduce((s, a) => s + a.percentage, 0) / approvedAttempts.length) : 0;

  const overallProgress = progress.length > 0
    ? Math.round(progress.reduce((s, p) => s + p.overallScore, 0) / progress.length) : 0;

  // Material progress
  const totalMats = materials.length;
  const doneMats = materials.filter((m) => isMaterialCompleted(completions, m.id!)).length;
  const matPct = totalMats > 0 ? Math.round((doneMats / totalMats) * 100) : 0;

  // Next incomplete material (first not completed, in order)
  const nextMaterial: LearningMaterial | undefined = materials.find(
    (m) => !isMaterialCompleted(completions, m.id!)
  );

  // Due assignments
  const dueAssignments = assignments.filter((a) => a.dueDate && new Date(a.dueDate) >= new Date());

  return (
    <PortalLayout>
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Welcome banner */}
        <div className="bg-secondary-color p-6 text-white">
          <p className="text-white/70 text-sm mb-0.5">{greeting()},</p>
          <h1 className="text-2xl font-bold mb-0.5">{student?.firstName} {student?.lastName}</h1>
          <p className="text-white/70 text-sm">Grade {student?.grade} · {student?.studentId}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/portal/materials" className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 transition-colors">
              Browse Materials →
            </Link>
            <Link href="/portal/tests" className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 transition-colors">
              Take a Test →
            </Link>
          </div>
        </div>

        {/* Announcements */}
        {!loading && announcements.length > 0 && (
          <div className="space-y-2">
            {announcements.slice(0, 3).map((a) => (
              <div key={a.id} className={`border px-4 py-3 flex items-start gap-3 ${a.pinned ? "bg-amber-50 border-amber-300" : "bg-white border-gray-200"}`}>
                {a.pinned
                  ? <MdPushPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  : <MdCampaign size={16} className="text-secondary-color shrink-0 mt-0.5" />}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.body.replace(/<[^>]+>/g, "").slice(0, 160)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white border border-gray-100 h-24 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Tests Completed", value: approvedAttempts.length, sub: `${pendingAttempts.length} pending review`, icon: <MdQuiz size={20} className="text-white" />, color: "bg-secondary-color" },
              { label: "Avg Test Score", value: `${avgScore}%`, sub: approvedAttempts.length > 0 ? "across all tests" : "no tests yet", icon: <MdTrendingUp size={20} className="text-white" />, color: "bg-emerald-600" },
              { label: "Materials Progress", value: `${matPct}%`, sub: `${doneMats}/${totalMats} completed`, icon: <MdMenuBook size={20} className="text-white" />, color: "bg-indigo-600" },
              { label: "Overall Progress", value: `${overallProgress}%`, sub: progress.length > 0 ? `${progress.length} subjects` : "no data yet", icon: <MdBarChart size={20} className="text-white" />, color: "bg-purple-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 p-4 flex items-start gap-3">
                <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs font-medium text-gray-700 leading-tight">{s.label}</p>
                  {s.sub && <p className="text-xs text-gray-400">{s.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Materials progress bar */}
        {!loading && totalMats > 0 && (
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900">Materials Progress — {doneMats}/{totalMats} completed</p>
              <Link href="/portal/materials" className="text-xs text-secondary-color font-medium hover:underline">View all →</Link>
            </div>
            <div className="h-2.5 bg-gray-100 w-full">
              <div className="h-full bg-secondary-color transition-all duration-500" style={{ width: `${matPct}%` }} />
            </div>
          </div>
        )}

        {/* Next up widget */}
        {!loading && nextMaterial && (
          <div className="bg-white border border-secondary-color/30 p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary-color/10 flex items-center justify-center shrink-0">
              <MdMenuBook size={20} className="text-secondary-color" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Next Up</p>
              <p className="font-semibold text-gray-900">{nextMaterial.title}</p>
              <p className="text-xs text-gray-500">{nextMaterial.subject}
                {nextMaterial.estimatedMinutes ? ` · ${nextMaterial.estimatedMinutes} min` : ""}
              </p>
            </div>
            <Link href="/portal/materials"
              className="bg-secondary-color text-white text-sm font-semibold px-4 py-2 hover:bg-secondary-color/90 transition-colors shrink-0 flex items-center gap-1">
              Continue <MdArrowForward size={15} />
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent results */}
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><MdQuiz size={16} className="text-secondary-color" /> Recent Results</h2>
              <Link href="/portal/tests" className="text-xs text-secondary-color font-medium hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse" />)}</div>
            ) : approvedAttempts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MdQuiz size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No approved results yet</p>
                <Link href="/portal/tests" className="mt-2 inline-block text-sm text-secondary-color font-medium hover:underline">Take your first test →</Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {approvedAttempts.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{a.testTitle ?? "Test"}</p>
                      <p className="text-xs text-gray-400">Attempt #{a.attemptNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${a.passed ? "text-emerald-600" : "text-red-500"}`}>{a.percentage}%</p>
                      <p className="text-xs text-gray-400">{a.passed ? "Passed ✓" : "Failed"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><MdAssignment size={16} className="text-amber-500" /> Assignments</h2>
              <Link href="/portal/assignments" className="text-xs text-secondary-color font-medium hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse" />)}</div>
            ) : assignments.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MdAssignment size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No assignments yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {assignments.slice(0, 4).map((a) => (
                  <Link key={a.id} href="/portal/assignments"
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 flex items-center justify-center text-white text-xs font-bold shrink-0 ${a.type === "ixl" ? "bg-orange-500" : a.type === "deltamath" ? "bg-blue-500" : "bg-gray-500"}`}>
                        {a.type === "ixl" ? "IXL" : a.type === "deltamath" ? "Δ" : "✏"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">{a.title}</p>
                        <p className="text-xs text-gray-400">{a.subject}</p>
                      </div>
                    </div>
                    {a.dueDate && (
                      <p className="text-xs text-gray-400 shrink-0">
                        {new Date(a.dueDate).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending review notice */}
        {pendingAttempts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 flex items-center gap-4">
            <MdPending size={22} className="text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">{pendingAttempts.length} test result{pendingAttempts.length > 1 ? "s" : ""} pending review</p>
              <p className="text-xs text-amber-600 mt-0.5">Results will appear once your teacher approves them.</p>
            </div>
            <Link href="/portal/tests" className="text-xs text-amber-700 font-semibold hover:underline shrink-0">View →</Link>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/portal/materials", icon: <MdMenuBook size={18} />, label: "Materials", color: "bg-indigo-50 text-indigo-600" },
            { href: "/portal/tests", icon: <MdQuiz size={18} />, label: "Tests", color: "bg-blue-50 text-secondary-color" },
            { href: "/portal/assignments", icon: <MdAssignment size={18} />, label: "Assignments", color: "bg-amber-50 text-amber-600" },
            { href: "/portal/progress", icon: <MdStar size={18} />, label: "Progress", color: "bg-purple-50 text-purple-600" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-white border border-gray-200 p-4 flex flex-col items-center text-center hover:border-secondary-color transition-colors">
              <div className={`w-9 h-9 flex items-center justify-center mb-2 ${item.color}`}>{item.icon}</div>
              <p className="text-xs font-semibold text-gray-700">{item.label}</p>
            </Link>
          ))}
        </div>

      </div>
    </PortalLayout>
  );
}
