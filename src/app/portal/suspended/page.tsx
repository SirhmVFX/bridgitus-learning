"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdBlock, MdLogout, MdEmail } from "react-icons/md";
import { useStudentAuth } from "@/lib/studentAuth";

export default function SuspendedPage() {
  const { student, signOut } = useStudentAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/portal/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col">
      <header className="bg-secondary-color px-6 py-4 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Bridgitus Learning Portal</span>
        <button onClick={handleSignOut} className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm">
          <MdLogout size={15} /> Sign out
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 p-10 max-w-md w-full text-center">
          <MdBlock size={56} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Account Suspended</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {student?.status === "inactive"
              ? "Your account is currently inactive."
              : "Your account has been suspended and portal access is disabled."}
            {" "}This may be due to an outstanding payment or an administrative action.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Please contact us to restore access.
          </p>
          <a href="mailto:info@bridgitus.com"
            className="inline-flex items-center gap-2 mt-6 bg-secondary-color text-white text-sm font-semibold px-5 py-2.5 hover:bg-secondary-color/90 transition-colors">
            <MdEmail size={16} /> Contact Support
          </a>
          <p className="text-xs text-gray-400 mt-6">
            <Link href="/contact" className="text-secondary-color hover:underline">Visit contact page</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
