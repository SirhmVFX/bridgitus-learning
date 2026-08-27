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
  getStudySessions,
  formatStudyTime,
  getUpcomingOnlineSession,
  isOnlineSessionLive,
  type TestAttempt,
  type Assignment,
  type StudentProgress,
  type LearningMaterial,
  type Announcement,
  type StudySession,
  type OnlineSession,
} from "@/lib/firestore";
import {
  MdMenuBook, MdQuiz, MdAssignment, MdBarChart,
  MdCheckCircle, MdPending, MdTrendingUp, MdStar,
  MdPushPin, MdCampaign, MdArrowForward, MdTimer,
  MdOndemandVideo, MdVideocam,
} from "react-icons/md";

const YOUTUBE_URL = "https://youtube.com/@BridgitusLearning";

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
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [onlineSession, setOnlineSession] = useState<OnlineSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id || !student?.grade) return;
    async function load() {
      try {
        const [att, ass, prog, mats, comps, ann, sessions, online] = await Promise.all([
          getAllStudentAttempts(student!.id!),
          getAssignmentsForStudent(student!.grade, student!.id!),
          getStudentProgress(student!.id!),
          getMaterialsByGrade(student!.grade),
          getMaterialCompletions(student!.id!, student!.grade),
          getAnnouncementsForStudent(student!.grade),
          getStudySessions(student!.id!, 7),
          getUpcomingOnlineSession(student!.grade),
        ]);
        setAttempts(att); setAssignments(ass); setProgress(prog);
        setMaterials(mats); setCompletions(comps as typeof completions); setAnnouncements(ann);
        setStudySessions(sessions);
        setOnlineSession(online);
      } finally { setLoading(false); }
    }
    load();
    const t = setInterval(() => {
      getUpcomingOnlineSession(student!.grade).then(setOnlineSession).catch(() => {});
    }, 30_000);
    return () => clearInterval(t);
  }, [student]);

  const approvedAttempts = attempts.filter((a) => a.status === "approved");
  const pendingAttempts = attempts.filter((a) => a.status === "pending_review");
  const avgScore = approvedAttempts.length > 0
    ? Math.round(approvedAttempts.reduce((s, a) => s + a.percentage, 0) / approvedAttempts.length) : 0;

  const overallProgress = progress.length > 0
    ? Math.round(progress.reduce((s, p) => s + p.overallScore, 0) / progress.length) : 0;

  const totalMats = materials.length;
  const doneMats = materials.filter((m) => isMaterialCompleted(completions, m.id!)).length;
  const matPct = totalMats > 0 ? Math.round((doneMats / totalMats) * 100) : 0;

  const nextMaterial: LearningMaterial | undefined = materials.find(
    (m) => !isMaterialCompleted(completions, m.id!)
  );

  const todayKey = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const secondsToday = studySessions.find((s) => s.date === todayKey)?.seconds ?? 0;
  const secondsWeek = studySessions.reduce((sum, s) => sum + (s.seconds ?? 0), 0);
  const teamsLive = onlineSession ? isOnlineSessionLive(onlineSession) : false;

  return (
    <PortalLayout>
      <div className="space-y-5">

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-1">
            Overview
          </p>
          <h1 className="text-2xl lg:text-[1.75rem] font-extrabold text-[#001233] tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your learning snapshot for today
          </p>
        </div>

        {/* Welcome */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001233] via-[#00369b] to-[#0050c8] p-6 lg:p-7 text-white border border-[#00369b]/40">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_#00c1ff_0%,_transparent_55%)] pointer-events-none" />
          <div className="relative">
            <p className="text-white/70 text-sm mb-0.5">{greeting()},</p>
            <h2 className="text-2xl font-extrabold mb-0.5 tracking-tight">
              {student?.firstName} {student?.lastName}
            </h2>
            <p className="text-white/70 text-sm">
              Grade {student?.grade} · {student?.studentId}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href="/portal/materials"
                className="rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 transition-all hover:-translate-y-0.5"
              >
                Browse Materials →
              </Link>
              <Link
                href="/portal/tests"
                className="rounded-xl bg-[#00c1ff] hover:bg-[#33d0ff] text-[#001233] text-sm font-bold px-4 py-2 transition-all hover:-translate-y-0.5 border border-[#00a8e0]"
              >
                Take a Quiz →
              </Link>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 transition-all inline-flex items-center gap-1.5 hover:-translate-y-0.5"
              >
                <MdOndemandVideo size={16} /> YouTube
              </a>
              {onlineSession && (
                teamsLive ? (
                  <a
                    href={onlineSession.teamsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative rounded-xl bg-[#5B5FC7] hover:bg-[#4B4FB7] text-white text-sm font-bold px-4 py-2 transition-all inline-flex items-center gap-1.5 ring-2 ring-white/40 animate-pulse"
                  >
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                    <MdVideocam size={16} /> Join Teams — Live
                  </a>
                ) : (
                  <a
                    href={onlineSession.teamsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#5B5FC7]/80 hover:bg-[#5B5FC7] text-white text-sm font-medium px-4 py-2 transition-all inline-flex items-center gap-1.5"
                  >
                    <MdVideocam size={16} /> Teams ·{" "}
                    {new Date(onlineSession.startsAt).toLocaleTimeString("en-AU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {!loading && announcements.length > 0 && (
          <div className="space-y-2">
            {announcements.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className={`portal-card !py-3.5 !px-4 flex items-start gap-3 ${
                  a.pinned ? "!bg-amber-50 !border-amber-200" : ""
                }`}
              >
                {a.pinned ? (
                  <MdPushPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <MdCampaign size={16} className="text-[#00369b] shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {a.body.replace(/<[^>]+>/g, "").slice(0, 160)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card h-28 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Tests Completed",
                value: approvedAttempts.length,
                sub: `${pendingAttempts.length} pending review`,
                icon: MdQuiz,
                iconBg: "bg-[#00369b]/10 text-[#00369b]",
              },
              {
                label: "Avg Test Score",
                value: `${avgScore}%`,
                sub: approvedAttempts.length > 0 ? "across all tests" : "no tests yet",
                icon: MdTrendingUp,
                iconBg: "bg-emerald-50 text-emerald-600",
              },
              {
                label: "Materials",
                value: `${matPct}%`,
                sub: `${doneMats}/${totalMats} completed`,
                icon: MdMenuBook,
                iconBg: "bg-sky-50 text-[#00c1ff]",
              },
              {
                label: "Overall Progress",
                value: `${overallProgress}%`,
                sub: progress.length > 0 ? `${progress.length} subjects` : "no data yet",
                icon: MdBarChart,
                iconBg: "bg-violet-50 text-violet-600",
              },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    {s.label}
                  </p>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}
                  >
                    <s.icon size={18} />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-[#001233] mt-3 tracking-tight">
                  {s.value}
                </p>
                <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="portal-card flex flex-wrap items-center gap-5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
              <MdTimer size={20} className="text-cyan-600" />
            </div>
            <div className="flex-1 min-w-40">
              <p className="text-sm font-semibold text-slate-900">Time Spent Learning</p>
              <p className="text-xs text-slate-400">Tracked automatically while you use the portal</p>
            </div>
            <div className="flex gap-8">
              <div className="text-right">
                <p className="text-xl font-extrabold text-[#001233]">
                  {formatStudyTime(secondsToday)}
                </p>
                <p className="text-xs text-slate-400">Today</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-[#001233]">
                  {formatStudyTime(secondsWeek)}
                </p>
                <p className="text-xs text-slate-400">Last 7 days</p>
              </div>
            </div>
          </div>
        )}

        {!loading && totalMats > 0 && (
          <div className="portal-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-900">
                Materials Progress — {doneMats}/{totalMats} completed
              </p>
              <Link
                href="/portal/materials"
                className="text-xs text-[#00369b] font-semibold hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="h-2.5 bg-slate-100 w-full rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00369b] to-[#00c1ff] transition-all duration-700 rounded-full"
                style={{ width: `${matPct}%` }}
              />
            </div>
          </div>
        )}

        {!loading && nextMaterial && (
          <div className="portal-card hover-lift flex items-center gap-4 !border-[#00369b]/20">
            <div className="w-11 h-11 rounded-2xl bg-[#00369b]/10 flex items-center justify-center shrink-0">
              <MdMenuBook size={20} className="text-[#00369b]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-400 uppercase tracking-wide font-bold mb-0.5">
                Next Up
              </p>
              <p className="font-semibold text-slate-900 truncate">{nextMaterial.title}</p>
              <p className="text-xs text-slate-500">
                {nextMaterial.subject}
                {nextMaterial.estimatedMinutes
                  ? ` · ${nextMaterial.estimatedMinutes} min`
                  : ""}
              </p>
            </div>
            <Link
              href="/portal/materials"
              className="portal-btn-primary text-sm shrink-0 inline-flex items-center gap-1"
            >
              Continue <MdArrowForward size={15} />
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
            <div className="portal-card !p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-[#001233] flex items-center gap-2 text-sm">
                  <MdQuiz size={16} className="text-[#00369b]" /> Recent Results
                </h2>
                <Link
                  href="/portal/tests"
                  className="text-xs text-[#00369b] font-semibold hover:underline"
                >
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="p-5 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : approvedAttempts.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <MdQuiz size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No approved results yet</p>
                  <Link
                    href="/portal/tests"
                    className="mt-2 inline-block text-sm text-[#00369b] font-semibold hover:underline"
                  >
                    Take your first quiz →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {approvedAttempts.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/80 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800 truncate max-w-[160px]">
                          {a.testTitle ?? "Test"}
                        </p>
                        <p className="text-xs text-slate-400">Attempt #{a.attemptNumber}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-extrabold ${
                            a.passed ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {a.percentage}%
                        </p>
                        <p className="text-xs text-slate-400">
                          {a.passed ? "Passed" : "Failed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="portal-card !p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-[#001233] flex items-center gap-2 text-sm">
                  <MdAssignment size={16} className="text-amber-500" /> Assignments
                </h2>
                <Link
                  href="/portal/assignments"
                  className="text-xs text-[#00369b] font-semibold hover:underline"
                >
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="p-5 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : assignments.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <MdAssignment size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No assignments yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {assignments.slice(0, 4).map((a) => (
                    <Link
                      key={a.id}
                      href="/portal/assignments"
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${
                            a.type === "ixl"
                              ? "bg-orange-500"
                              : a.type === "deltamath"
                                ? "bg-blue-500"
                                : "bg-slate-500"
                          }`}
                        >
                          {a.type === "ixl" ? "IXL" : a.type === "deltamath" ? "Δ" : "✏"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate max-w-[140px]">
                            {a.title}
                          </p>
                          <p className="text-xs text-slate-400">{a.subject}</p>
                        </div>
                      </div>
                      {a.dueDate && (
                        <p className="text-xs text-slate-400 shrink-0">
                          {new Date(a.dueDate).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {pendingAttempts.length > 0 && (
              <div className="portal-card !bg-amber-50 !border-amber-200 flex items-start gap-3">
                <MdPending size={22} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">
                    {pendingAttempts.length} result
                    {pendingAttempts.length > 1 ? "s" : ""} pending review
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Scores appear once your teacher approves them.
                  </p>
                  <Link
                    href="/portal/tests"
                    className="text-xs text-amber-700 font-bold hover:underline mt-2 inline-block"
                  >
                    View →
                  </Link>
                </div>
              </div>
            )}

            <div className="portal-card">
              <h2 className="font-semibold text-[#001233] mb-3 text-sm">Quick links</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    href: "/portal/materials",
                    icon: MdMenuBook,
                    label: "Materials",
                    color: "bg-sky-50 text-[#00369b] hover:bg-sky-100",
                  },
                  {
                    href: "/portal/tests",
                    icon: MdQuiz,
                    label: "Quizzes",
                    color: "bg-blue-50 text-[#00369b] hover:bg-blue-100",
                  },
                  {
                    href: "/portal/assignments",
                    icon: MdAssignment,
                    label: "Assignments",
                    color: "bg-amber-50 text-amber-700 hover:bg-amber-100",
                  },
                  {
                    href: "/portal/progress",
                    icon: MdStar,
                    label: "Progress",
                    color: "bg-violet-50 text-violet-700 hover:bg-violet-100",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center text-center p-4 rounded-xl transition-all hover:-translate-y-0.5 ${item.color}`}
                  >
                    <item.icon size={20} className="mb-1.5" />
                    <p className="text-xs font-bold">{item.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
