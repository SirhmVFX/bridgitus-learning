"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle } from "react-icons/md";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token")?.trim() || "";

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      setError("This reset link is missing or incomplete. Use the link from your email, or request a new one from the login page.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/students/reset-password?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "This reset link is not valid.");
          setValid(false);
        } else {
          setValid(true);
          setStudentId(data.studentId || "");
          setFirstName(data.firstName || "");
        }
      } catch {
        if (!cancelled) setError("Could not validate the reset link. Please try again.");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/students/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update password.");
      setDone(true);
      setTimeout(() => router.push("/portal/login"), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f4f6fb]">
      <div className="w-full max-w-md bg-white border border-gray-100 shadow-sm p-8">
        <div className="text-center mb-6">
          <Image
            src="/assets/FullLogo.png"
            alt="Bridgitus"
            width={140}
            height={48}
            className="mx-auto mb-4 object-contain"
          />
          <h1 className="text-xl font-bold text-[#001f5b]">Set a new password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Parent/guardian link · student portal login
          </p>
        </div>

        {checking && (
          <p className="text-sm text-gray-500 text-center py-8">Checking reset link…</p>
        )}

        {!checking && done && (
          <div className="text-center space-y-3 py-4">
            <MdCheckCircle className="mx-auto text-emerald-500" size={48} />
            <p className="font-semibold text-gray-900">Password updated</p>
            <p className="text-sm text-gray-600">
              {firstName || "Your child"} can now sign in with Student ID{" "}
              <span className="font-mono text-[#00369b]">{studentId}</span> and the new password.
            </p>
            <Link
              href="/portal/login"
              className="inline-block mt-2 bg-[#001f5b] text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Go to login
            </Link>
          </div>
        )}

        {!checking && !done && error && !valid && (
          <div className="space-y-4">
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
            <Link href="/portal/login" className="block text-center text-sm text-[#00369b] font-semibold hover:underline">
              Back to login · request a new link
            </Link>
          </div>
        )}

        {!checking && !done && valid && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 px-3 py-2.5 text-sm text-gray-700">
              <p>
                Setting password for <strong>{firstName}</strong>
              </p>
              <p className="mt-0.5">
                Student ID:{" "}
                <span className="font-mono text-[#00369b] font-semibold">{studentId}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">New password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm password</label>
              <input
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                placeholder="Type the same password again"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
            )}

            <ol className="text-xs text-gray-500 list-decimal pl-4 space-y-1">
              <li>Choose a password your child can remember (or store it safely).</li>
              <li>After saving, open the portal login page.</li>
              <li>Sign in with the Student ID above + this new password.</li>
            </ol>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#001f5b] text-white text-sm font-semibold py-3 rounded-lg disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Saving…" : "Save new password"}
            </button>

            <p className="text-center text-xs text-gray-400">
              <Link href="/portal/login" className="hover:underline">
                Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
          Loading…
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
