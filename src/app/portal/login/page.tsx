"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStudentAuth } from "@/lib/studentAuth";
import { MdLock, MdVisibility, MdVisibilityOff, MdSchool } from "react-icons/md";

export default function LoginPage() {
  const { signIn, user, loading } = useStudentAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/portal/dashboard");
    }
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(identifier.trim(), password);
      router.replace("/portal/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found")) {
        setError("Incorrect Student ID or password.");
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="w-8 h-8 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-secondary-color flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-60px] left-[-60px] w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-[-40px] right-[-40px] w-80 h-80 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MdSchool size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Bridgitus Learning Portal</h1>
          <p className="text-white/80 text-lg max-w-xs mx-auto leading-relaxed">
            Access your personalised lessons, tests, assignments, and track your progress.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Learning Materials", icon: "📚" },
              { label: "Tests & Exams", icon: "📝" },
              { label: "Assignments", icon: "✏️" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs text-white/80 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/assets/FullLogo.png"
              alt="Bridgitus"
              width={160}
              height={60}
              className="object-contain h-14 w-auto"
              priority
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm mb-8">
              Sign in with your Student ID and password
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Identifier */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Student ID
                </label>
                <div className="relative">
                  <MdSchool
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="BRG-2026-0001"
                    required
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-secondary-color focus:ring-2 focus:ring-secondary-color/20 transition-all uppercase"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <MdLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-secondary-color focus:ring-2 focus:ring-secondary-color/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-secondary-color hover:bg-secondary-color/90 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Not yet enrolled?{" "}
              <Link
                href="/register"
                className="text-secondary-color font-semibold hover:underline"
              >
                Register now
              </Link>
            </p>

            <p className="mt-2 text-center text-xs text-gray-400">
              Need help?{" "}
              <Link href="/contact" className="hover:underline">
                Contact support
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Bridgitus Learning
          </p>
        </div>
      </div>
    </div>
  );
}
