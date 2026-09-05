"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ModalPortal from "@/components/ModalPortal";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getAnnouncementsForStudent,
  recordStudyTime,
  updateStudent,
  type Announcement,
} from "@/lib/firestore";
import { hasPortalAccess, isPlanExpired } from "@/lib/payment";
import {
  MdDashboard,
  MdMenuBook,
  MdAssignment,
  MdQuiz,
  MdBarChart,
  MdPerson,
  MdLogout,
  MdMenu,
  MdSchool,
  MdNotifications,
  MdClose,
  MdLock,
  MdCampaign,
  MdPushPin,
  MdAutoAwesome,
  MdInsights,
  MdSearch,
  MdFactCheck,
  MdEmojiEvents,
} from "react-icons/md";

const NAV = [
  { href: "/portal/dashboard", label: "Dashboard", icon: MdDashboard, group: "overview" },
  {
    href: "/portal/materials",
    label: "Learning Materials",
    icon: MdMenuBook,
    requiresPaid: true,
    group: "learning",
  },
  { href: "/portal/tests", label: "Quizzes", icon: MdQuiz, requiresPaid: true, group: "learning" },
  {
    href: "/portal/assignments",
    label: "Assignments",
    icon: MdAssignment,
    requiresPaid: true,
    group: "learning",
  },
  {
    href: "/portal/practice",
    label: "AI Practice",
    icon: MdAutoAwesome,
    requiresPaid: true,
    group: "learning",
  },
  {
    href: "/portal/naplan",
    label: "NAPLAN",
    icon: MdFactCheck,
    requiresPaid: true,
    group: "exam-prep",
  },
  {
    href: "/portal/selective",
    label: "Selective Entry",
    icon: MdEmojiEvents,
    requiresPaid: true,
    group: "exam-prep",
  },
  {
    href: "/portal/progress",
    label: "My Progress",
    icon: MdBarChart,
    requiresPaid: true,
    group: "insights",
  },
  {
    href: "/portal/analytics",
    label: "My Analytics",
    icon: MdInsights,
    requiresPaid: true,
    group: "insights",
  },
  { href: "/portal/account", label: "My Account", icon: MdPerson, group: "account" },
];

const FREE_PATHS = ["/portal/login", "/portal/payment", "/portal/suspended"];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, student, loading, signOut } = useStudentAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const isPaid = student ? hasPortalAccess(student) : false;
  const isSuspended =
    student?.status === "suspended" || student?.status === "inactive";

  useEffect(() => {
    if (!student?.id) return;
    if (student.paymentStatus === "paid" && isPlanExpired(student)) {
      updateStudent(student.id, { paymentStatus: "expired" }).catch(() => {});
    }
  }, [student]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/portal/login");
      return;
    }
    if (
      student &&
      isSuspended &&
      !pathname.startsWith("/portal/suspended") &&
      !pathname.startsWith("/portal/login")
    ) {
      router.replace("/portal/suspended");
      return;
    }
    if (
      student &&
      !isSuspended &&
      !isPaid &&
      !FREE_PATHS.some((p) => pathname.startsWith(p))
    ) {
      router.replace("/portal/payment");
    }
  }, [user, student, loading, isPaid, isSuspended, pathname, router]);

  useEffect(() => {
    if (student?.grade) {
      getAnnouncementsForStudent(student.grade)
        .then(setAnnouncements)
        .catch(() => {});
    }
  }, [student?.grade]);

  useEffect(() => {
    const studentId = student?.id;
    if (!studentId) return;

    let lastTick = Date.now();

    const flush = () => {
      const now = Date.now();
      const sec = Math.round((now - lastTick) / 1000);
      lastTick = now;
      if (sec >= 5 && sec <= 15 * 60) {
        recordStudyTime(studentId, sec).catch(() => {});
      }
    };

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") flush();
      else lastTick = Date.now();
    }, 60_000);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else lastTick = Date.now();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [student?.id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef1f6]">
        <div className="w-9 h-9 border-4 border-[#00369b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/portal/login");
  }

  function NavLink({
    href,
    icon: Icon,
    label,
    locked,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    locked?: boolean;
  }) {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={locked ? "/portal/payment" : href}
        onClick={() => setSidebarOpen(false)}
        className={`nav-item ${isActive ? "active" : ""} ${locked ? "locked" : ""}`}
      >
        <Icon size={17} />
        <span className="flex-1">{label}</span>
        {locked && <MdLock size={13} className="opacity-50" />}
      </Link>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#001233] text-white">
      <div className="px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00369b] flex items-center justify-center shrink-0 border border-white/10">
            <MdSchool size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#00c1ff] font-bold">
              Bridgitus
            </p>
            <p className="text-sm font-semibold text-white">Learning</p>
          </div>
        </div>
        <button
          className="lg:hidden text-white/50 hover:text-white transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <MdClose size={20} />
        </button>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        <p className="nav-section-label">Overview</p>
        {NAV.filter((n) => n.group === "overview").map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            locked={item.requiresPaid && !isPaid}
          />
        ))}

        <p className="nav-section-label">Learning</p>
        {NAV.filter((n) => n.group === "learning").map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            locked={item.requiresPaid && !isPaid}
          />
        ))}

        <p className="nav-section-label">Exam Prep</p>
        {NAV.filter((n) => n.group === "exam-prep").map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            locked={item.requiresPaid && !isPaid}
          />
        ))}

        <p className="nav-section-label">Insights</p>
        {NAV.filter((n) => n.group === "insights").map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            locked={item.requiresPaid && !isPaid}
          />
        ))}

        <p className="nav-section-label">Account</p>
        {NAV.filter((n) => n.group === "account").map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            locked={item.requiresPaid && !isPaid}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-2 px-2 flex-wrap">
          {student?.grade && (
            <span className="rounded-full bg-[#00c1ff]/15 text-[#00c1ff] px-2.5 py-0.5 text-[11px] font-bold">
              Grade {student.grade}
            </span>
          )}
          {isPaid ? (
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] px-2.5 py-0.5 font-bold">
              Paid
            </span>
          ) : student?.paymentStatus === "expired" ||
            (student && isPlanExpired(student)) ? (
            <span className="rounded-full bg-red-500/20 text-red-300 text-[11px] px-2.5 py-0.5 font-bold">
              Expired
            </span>
          ) : (
            <span className="rounded-full bg-amber-500/20 text-amber-300 text-[11px] px-2.5 py-0.5 font-bold">
              Payment pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-[#00369b] flex items-center justify-center shrink-0 overflow-hidden">
            {student?.avatar ? (
              <Image
                src={student.avatar}
                alt="avatar"
                width={36}
                height={36}
                className="object-cover w-9 h-9"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {student?.firstName?.[0] ?? "S"}
              </span>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold text-white truncate">
              {student?.firstName} {student?.lastName}
            </p>
            <p className="text-[11px] text-[#00c1ff] font-semibold truncate">
              {student?.studentId}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="Sign out"
          >
            <MdLogout size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#eef1f6]">
      <aside className="hidden lg:flex lg:flex-col w-[272px] min-h-screen sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[#001233]/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[272px] flex flex-col animate-[slideUp_0.25s_ease]">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 px-4 lg:px-6 pt-4 pb-2">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-4 lg:px-5 h-14 flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
              onClick={() => setSidebarOpen(true)}
            >
              <MdMenu size={22} />
            </button>

            <div className="shell-search hidden sm:flex">
              <MdSearch size={18} className="text-slate-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search portal…"
                aria-label="Search"
              />
              <span className="shell-kbd">⌘K</span>
            </div>

            <div className="flex-1" />

            {!isPaid && (
              <Link
                href="/portal/payment"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 hover:bg-amber-100 transition-colors"
              >
                <MdLock size={12} /> Unlock access
              </Link>
            )}

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-xl hover:bg-slate-50"
              >
                <MdNotifications size={20} />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00c1ff] rounded-full" />
                )}
              </button>

              {notifOpen && (
                <ModalPortal>
                <div
                  className="fixed z-[1000] w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl max-h-96 overflow-y-auto"
                  style={{
                    top: notifRef.current
                      ? notifRef.current.getBoundingClientRect().bottom + 8
                      : 64,
                    right: 16,
                  }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      <MdCampaign size={16} className="text-[#00369b]" />
                      Announcements
                    </h3>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                  {announcements.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <MdCampaign size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm text-slate-500 font-medium">No notifications</p>
                      <p className="text-xs text-slate-400 mt-0.5">You&apos;re all caught up!</p>
                    </div>
                  ) : (
                    announcements.map((a) => (
                      <div
                        key={a.id}
                        className={`border-b border-slate-50 px-4 py-3 last:border-0 ${
                          a.pinned ? "bg-amber-50/80" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {a.pinned ? (
                            <MdPushPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <MdCampaign size={14} className="text-[#00369b] shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-3">
                              {a.body.replace(/<[^>]+>/g, "").slice(0, 180)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                </ModalPortal>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-[#00369b] flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {student?.firstName?.[0] ?? "S"}
              </span>
            </div>
          </div>
        </header>

        {!isPaid && !FREE_PATHS.some((p) => pathname.startsWith(p)) && (
          <div className="mx-4 lg:mx-6 mb-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-center justify-between gap-4">
            <p className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
              <MdLock size={13} /> Portal access is limited until payment is complete.
            </p>
            <Link
              href="/portal/payment"
              className="text-xs font-bold text-amber-700 hover:underline shrink-0"
            >
              Pay now →
            </Link>
          </div>
        )}

        <main className="flex-1 px-4 lg:px-6 pb-8 pt-2 min-w-0">
          <div className="page-enter" key={pathname}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
