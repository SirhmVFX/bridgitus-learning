"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getAnnouncementsForStudent,
  recordStudyTime,
  type Announcement,
} from "@/lib/firestore";
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
} from "react-icons/md";

const NAV = [
  { href: "/portal/dashboard", label: "Dashboard", icon: MdDashboard },
  {
    href: "/portal/materials",
    label: "Learning Materials",
    icon: MdMenuBook,
    requiresPaid: true,
  },
  { href: "/portal/tests", label: "Quizzes", icon: MdQuiz, requiresPaid: true },
  {
    href: "/portal/assignments",
    label: "Assignments",
    icon: MdAssignment,
    requiresPaid: true,
  },
  {
    href: "/portal/practice",
    label: "AI Practice",
    icon: MdAutoAwesome,
    requiresPaid: true,
  },
  {
    href: "/portal/progress",
    label: "My Progress",
    icon: MdBarChart,
    requiresPaid: true,
  },
  {
    href: "/portal/analytics",
    label: "My Analytics",
    icon: MdInsights,
    requiresPaid: true,
  },
  { href: "/portal/account", label: "My Account", icon: MdPerson },
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const isPaid =
    student?.paymentStatus === "paid" || student?.paymentStatus === "waived";
  const isSuspended =
    student?.status === "suspended" || student?.status === "inactive";

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/portal/login");
      return;
    }
    // Suspended / inactive students can only reach the suspended page or login
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

  // Load announcements for the notification bell
  useEffect(() => {
    if (student?.grade) {
      getAnnouncementsForStudent(student.grade)
        .then(setAnnouncements)
        .catch(() => {});
    }
  }, [student?.grade]);

  // Time-online tracker: accumulate active (tab visible) seconds and flush to
  // Firestore every minute and when the tab is hidden/closed.
  useEffect(() => {
    const studentId = student?.id;
    if (!studentId) return;

    let lastTick = Date.now();

    const flush = () => {
      const now = Date.now();
      const sec = Math.round((now - lastTick) / 1000);
      lastTick = now;
      // Ignore tiny slices and anything implausibly large (sleep/wake gaps)
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

  // Close notif panel on outside click
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
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="w-8 h-8 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/portal/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-secondary-color text-white">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-color flex items-center justify-center shrink-0">
            <MdSchool size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-blue-300">
              Bridgitus
            </p>
            <p className="text-sm font-semibold">Learning Portal</p>
          </div>
        </div>
        <button
          className="lg:hidden text-white/50 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <MdClose size={18} />
        </button>
      </div>

      {/* Student info */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-color/30 flex items-center justify-center shrink-0">
            {student?.avatar ? (
              <Image
                src={student.avatar}
                alt="avatar"
                width={40}
                height={40}
                className="object-cover w-10 h-10"
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {student?.firstName?.[0] ?? "S"}
              </span>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">
              {student?.firstName} {student?.lastName}
            </p>
            <p className="text-xs text-blue-300 truncate">
              {student?.studentId}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {student?.grade && (
            <span className="bg-primary-color/30 px-3 py-0.5 text-xs text-blue-200">
              Grade {student.grade}
            </span>
          )}
          {isPaid ? (
            <span className="bg-emerald-500/30 text-emerald-300 text-xs px-2 py-0.5 font-semibold">
              ✓ PAID
            </span>
          ) : (
            <span className="bg-amber-500/30 text-amber-300 text-xs px-2 py-0.5 font-semibold">
              PAYMENT PENDING
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const locked = item.requiresPaid && !isPaid;
          return (
            <Link
              key={item.href}
              href={locked ? "/portal/payment" : item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/10 text-white border-l-2 border-primary-color"
                  : locked
                    ? "text-white/30 cursor-pointer"
                    : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {locked && <MdLock size={13} className="text-white/30" />}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <MdLogout size={18} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center justify-between">
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <MdMenu size={22} />
          </button>
          <div className="flex-1 lg:flex-none" />
          {/* Payment banner */}
          {!isPaid && (
            <Link
              href="/portal/payment"
              className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-700 text-xs font-semibold px-3 py-1.5 mr-3"
            >
              <MdLock size={13} /> Complete payment to unlock all features
            </Link>
          )}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <MdNotifications size={22} />
                {announcements.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-1 w-80 sm:w-96 bg-white border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <MdCampaign size={16} className="text-secondary-color" />
                      Announcements
                    </h3>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                  {announcements.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <MdCampaign
                        size={32}
                        className="mx-auto text-gray-300 mb-2"
                      />
                      <p className="text-sm text-gray-500 font-medium">
                        No notifications
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        You&apos;re all caught up!
                      </p>
                    </div>
                  ) : (
                    <div>
                      {announcements.map((a) => (
                        <div
                          key={a.id}
                          className={`border-b border-gray-50 px-4 py-3 last:border-0 ${a.pinned ? "bg-amber-50" : ""}`}
                        >
                          <div className="flex items-start gap-2">
                            {a.pinned ? (
                              <MdPushPin
                                size={14}
                                className="text-amber-500 shrink-0 mt-0.5"
                              />
                            ) : (
                              <MdCampaign
                                size={14}
                                className="text-secondary-color shrink-0 mt-0.5"
                              />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {a.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-3">
                                {a.body.replace(/<[^>]+>/g, "").slice(0, 180)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-8 h-8 bg-secondary-color flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {student?.firstName?.[0] ?? "S"}
              </span>
            </div>
          </div>
        </header>

        {/* Payment nudge banner */}
        {!isPaid && !FREE_PATHS.some((p) => pathname.startsWith(p)) && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
            <p className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
              <MdLock size={13} /> Your portal access is limited until payment
              is complete.
            </p>
            <Link
              href="/portal/payment"
              className="text-xs font-bold text-amber-700 hover:underline shrink-0"
            >
              Pay now →
            </Link>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
