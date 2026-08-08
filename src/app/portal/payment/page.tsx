"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStudentAuth } from "@/lib/studentAuth";
import { getPublishedPricingPlans, type SitePricingPlan } from "@/lib/firestore";
import {
  MdPayment, MdCheckCircle, MdLock, MdSchool, MdLogout,
  MdArrowBack, MdCheck,
} from "react-icons/md";

declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

const CURRENCY = process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || "NGN";

// Fallback plans if Firestore has none yet
const FALLBACK_PLANS: SitePricingPlan[] = [
  {
    id: "basic", title: "Basic Plan", tagline: "Pay as you go", price: "₦50,000", per: "/hour lesson",
    perks: [{ desc: "Flexible Scheduling" }, { desc: "No long-term commitment" }, { desc: "Perfect for trial lessons" }],
    freePerks: ["One-on-one tutoring", "Flexible scheduling", "Free initial consultation"],
    highlighted: false, order: 0, published: true, amountKobo: 5000000,
  },
  {
    id: "standard", title: "Standard Plan", tagline: "Growth Plan", price: "₦955,000", per: "20 classes",
    perks: [{ desc: "2 classes per week (10 weeks)" }, { desc: "Structured learning" }, { desc: "Progress tracking & Feedback" }],
    freePerks: ["One-on-one tutoring", "Flexible scheduling", "Free initial consultation"],
    highlighted: true, order: 1, published: true, amountKobo: 95500000,
  },
  {
    id: "premium", title: "Premium Plan", tagline: "Success Plan", price: "₦1,365,000", per: "30 classes",
    perks: [{ desc: "2 classes per week (15 weeks)" }, { desc: "Strong foundation & measurable improvements" }, { desc: "Best value" }],
    freePerks: ["One-on-one tutoring", "Flexible scheduling", "Free initial consultation"],
    highlighted: false, order: 2, published: true, amountKobo: 136500000,
  },
];

function formatAmount(kobo: number, currency: string) {
  const major = kobo / 100;
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency, minimumFractionDigits: 0 }).format(major);
  } catch {
    return `${currency} ${major.toLocaleString()}`;
  }
}

export default function PaymentPage() {
  const { student, loading: authLoading, signOut, refreshStudent } = useStudentAuth();
  const router = useRouter();

  const [plans, setPlans] = useState<SitePricingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SitePricingPlan | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
  const isConfigured = publicKey.startsWith("pk_");

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!student) { router.replace("/portal/login"); return; }
    if (student.paymentStatus === "paid" || student.paymentStatus === "waived") {
      router.replace("/portal/dashboard");
    }
  }, [student, authLoading, router]);

  // Load plans from Firestore
  useEffect(() => {
    getPublishedPricingPlans()
      .then((data) => {
        const withAmount = data.filter((p) => (p.amountKobo ?? 0) > 0);
        setPlans(withAmount.length > 0 ? withAmount : FALLBACK_PLANS);
      })
      .catch(() => setPlans(FALLBACK_PLANS))
      .finally(() => setPlansLoading(false));
  }, []);

  // Load Paystack script
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.PaystackPop) { setScriptReady(true); return; }
    const existing = document.getElementById("paystack-script");
    if (existing) { existing.addEventListener("load", () => setScriptReady(true)); return; }
    const s = document.createElement("script");
    s.id = "paystack-script";
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => setScriptReady(true);
    s.onerror = () => setError("Payment service could not load. Check your internet connection.");
    document.body.appendChild(s);
    const t = setTimeout(() => setScriptReady(true), 8000);
    return () => clearTimeout(t);
  }, []);

  async function handleVerify(reference: string) {
    setVerifying(true); setError("");
    try {
      const res = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, studentId: student!.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setSuccess(true);
      await refreshStudent();
      setTimeout(() => router.replace("/portal/dashboard"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment verification failed. Please contact support.");
    } finally { setVerifying(false); }
  }

  function openPaystack(plan: SitePricingPlan) {
    if (!student) return;
    if (!isConfigured) {
      setError("Payment is not yet configured. Contact info@bridgitus.com to complete enrollment.");
      return;
    }
    if (!window.PaystackPop) {
      setError("Payment service is still loading. Please wait and try again.");
      return;
    }
    const amount = plan.amountKobo ?? 0;
    if (amount === 0) {
      setError("This plan has no payment amount set. Contact info@bridgitus.com.");
      return;
    }
    setError("");
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: student.email,
      amount,
      currency: CURRENCY,
      ref: `BRG-${student.studentId}-${plan.id}-${Date.now()}`,
      metadata: {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentIdCode: student.studentId,
        planId: plan.id,
        planTitle: plan.title,
      },
      callback: (response: { reference: string }) => { handleVerify(response.reference); },
      onClose: () => { },
    });
    handler.openIframe();
  }

  async function handleSignOut() { await signOut(); router.replace("/portal/login"); }

  // ── Loading states ──────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your account…</p>
        </div>
      </div>
    );
  }

  if (!student || student.paymentStatus === "paid" || student.paymentStatus === "waived") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="w-8 h-8 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Success ─────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="bg-white border border-gray-200 p-10 text-center max-w-sm w-full mx-4">
          <MdCheckCircle size={56} className="mx-auto text-emerald-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Confirmed!</h2>
          <p className="text-gray-500 text-sm">
            Welcome to Bridgitus Learning Portal, {student.firstName}.<br />
            Redirecting to your dashboard…
          </p>
        </div>
      </div>
    );
  }

  // ── Header (shared) ─────────────────────────────────────

  const Header = () => (
    <header className="bg-secondary-color px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MdSchool size={20} className="text-white" />
        <span className="text-white font-semibold text-sm">Bridgitus Learning Portal</span>
      </div>
      <button onClick={handleSignOut}
        className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
        <MdLogout size={15} /> Sign out
      </button>
    </header>
  );

  // ── Checkout view (plan selected) ───────────────────────

  if (selectedPlan) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md">
            <button onClick={() => { setSelectedPlan(null); setError(""); }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors">
              <MdArrowBack size={16} /> Back to plans
            </button>

            <div className="bg-white border border-gray-200">
              <div className="bg-secondary-color px-6 sm:px-8 py-6">
                <div className="flex justify-center mb-3">
                  <Image src="/assets/FullLogo.png" alt="Bridgitus" width={130} height={48}
                    className="object-contain h-10 w-auto brightness-0 invert" priority />
                </div>
                <h1 className="text-white font-bold text-lg text-center">Complete Payment</h1>
                <p className="text-white/70 text-sm text-center mt-1">{selectedPlan.title}</p>
              </div>

              <div className="px-6 sm:px-8 py-6 space-y-5">
                {/* Student */}
                <div className="border border-gray-200 p-4 bg-gray-50">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Enrolled Student</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-secondary-color flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">{student.firstName[0]}{student.lastName[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-gray-400">{student.studentId} · Grade {student.grade}</p>
                    </div>
                  </div>
                </div>

                {/* Selected plan summary */}
                <div className="border border-secondary-color/30 bg-secondary-color/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">{selectedPlan.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedPlan.tagline} · {selectedPlan.per}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-secondary-color">{selectedPlan.price}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {selectedPlan.perks.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <MdCheckCircle size={13} className="text-emerald-500 shrink-0" /> {p.desc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's included */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Portal access includes</p>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {["All learning materials for your grade", "Tests & exams with instant grading",
                      "IXL & DeltaMath assignments", "Progress tracking & achievement badges",
                      "Direct teacher feedback on results"].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <MdCheckCircle size={14} className="text-emerald-500 shrink-0" /> {item}
                        </li>
                      ))}
                  </ul>
                </div>

                {!isConfigured && (
                  <div className="border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    <strong>Note:</strong> Payment gateway pending setup. Contact{" "}
                    <a href="mailto:info@bridgitus.com" className="underline">info@bridgitus.com</a>.
                  </div>
                )}

                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <button
                  onClick={() => openPaystack(selectedPlan)}
                  disabled={verifying || !scriptReady}
                  className="w-full bg-secondary-color hover:bg-secondary-color/90 disabled:opacity-50 text-white font-bold py-4 text-base flex items-center justify-center gap-2 transition-colors"
                >
                  {verifying ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</>
                  ) : !scriptReady ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Loading…</>
                  ) : (
                    <><MdPayment size={20} />Pay {selectedPlan.price} with Paystack</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <MdLock size={12} /> Secured by Paystack · 256-bit SSL
                </div>

                <p className="text-center text-xs text-gray-400">
                  Need help?{" "}
                  <Link href="/contact" className="text-secondary-color hover:underline">Contact support</Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">© {new Date().getFullYear()} Bridgitus Learning</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Plan selection view ─────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col">
      <Header />

      <div className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page heading */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/assets/FullLogo.png" alt="Bridgitus" width={120} height={44}
                className="object-contain h-10 w-auto" priority />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Choose Your Learning Plan
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Hi {student.firstName} 👋 — select the plan that works best for you.
              Payment activates your full portal access immediately.
            </p>

            {/* Student info pill */}
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 mt-4 text-sm text-gray-600">
              <div className="w-6 h-6 bg-secondary-color flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{student.firstName[0]}</span>
              </div>
              {student.firstName} {student.lastName} · {student.studentId} · Grade {student.grade}
            </div>
          </div>

          {/* Plans grid */}
          {plansLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <div key={plan.id}
                  className={`relative bg-white border flex flex-col transition-all ${plan.highlighted
                      ? "border-secondary-color"
                      : "border-gray-200 hover:border-secondary-color/50"
                    }`}>

                  {/* Popular badge */}
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-color text-white text-xs font-bold px-3 py-1">
                      MOST POPULAR
                    </div>
                  )}

                  <div className={`px-6 pt-8 pb-5 ${plan.highlighted ? "bg-secondary-color/5" : ""}`}>
                    <h2 className="text-lg font-bold text-gray-900">{plan.title}</h2>
                    <p className="text-gray-500 text-xs mt-0.5">{plan.tagline}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-400 text-sm ml-1">{plan.per}</span>
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex flex-col flex-1 gap-4">
                    {/* Key perks */}
                    <ul className="space-y-2">
                      {plan.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <MdCheck size={16} className="text-secondary-color shrink-0 mt-0.5" />
                          {perk.desc}
                        </li>
                      ))}
                    </ul>

                    {/* Divider + free perks */}
                    {plan.freePerks.filter(Boolean).length > 0 && (
                      <>
                        <div className="h-px bg-gray-100" />
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Included free</p>
                          <ul className="space-y-1.5">
                            {plan.freePerks.filter(Boolean).map((fp, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                                <MdCheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                                {fp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {/* Select button */}
                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => { setSelectedPlan(plan); setError(""); }}
                        className={`w-full py-3 font-bold text-sm transition-colors ${plan.highlighted
                            ? "bg-secondary-color text-white hover:bg-secondary-color/90"
                            : "border border-secondary-color text-secondary-color hover:bg-secondary-color hover:text-white"
                          }`}>
                        Select {plan.title}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
            <MdLock size={13} />
            All payments secured by Paystack · 256-bit SSL encryption
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            Questions?{" "}
            <Link href="/contact" className="text-secondary-color hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
