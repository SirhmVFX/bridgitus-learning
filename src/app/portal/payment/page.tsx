"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStudentAuth } from "@/lib/studentAuth";
import { getPublishedPricingPlans, type SitePricingPlan } from "@/lib/firestore";
import {
  FALLBACK_PLANS,
  enrichPlans,
  findPlanMatch,
  getPlanAmountCents,
} from "@/lib/pricingPlans";
import { hasPortalAccess } from "@/lib/payment";
import {
  MdPayment, MdCheckCircle, MdLock, MdSchool, MdLogout,
  MdArrowBack,
} from "react-icons/md";

function PaymentPageInner() {
  const { student, loading: authLoading, signOut, refreshStudent } = useStudentAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plans, setPlans] = useState<SitePricingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SitePricingPlan | null>(null);
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [lockedToRegisteredPlan, setLockedToRegisteredPlan] = useState(false);

  const stripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_"));

  useEffect(() => {
    if (authLoading) return;
    if (!student) { router.replace("/portal/login"); return; }
    if (student && hasPortalAccess(student)) {
      router.replace("/portal/dashboard");
    }
  }, [student, authLoading, router]);

  useEffect(() => {
    if (authLoading || !student) return;

    getPublishedPricingPlans()
      .then((data) => {
        const enriched = enrichPlans(data.length ? data : FALLBACK_PLANS);
        const preferred = findPlanMatch(enriched, {
          planId: student.planId,
          planTitle: student.planTitle,
        });
        if (preferred) {
          setPlans([preferred]);
          setLockedToRegisteredPlan(true);
        } else {
          // Legacy students without a saved plan still see all options
          setPlans(enriched);
          setLockedToRegisteredPlan(false);
        }
      })
      .catch(() => {
        const preferred = findPlanMatch(FALLBACK_PLANS, {
          planId: student.planId,
          planTitle: student.planTitle,
        });
        if (preferred) {
          setPlans([preferred]);
          setLockedToRegisteredPlan(true);
        } else {
          setPlans(FALLBACK_PLANS);
        }
      })
      .finally(() => setPlansLoading(false));
  }, [authLoading, student]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const cancelled = searchParams.get("cancelled");
    if (cancelled) {
      setError("Payment was cancelled. You can try again when ready.");
      return;
    }
    if (!sessionId || !student?.id || verifying || success) return;

    setVerifying(true);
    setError("");
    fetch("/api/stripe/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, studentId: student.id }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Verification failed");
        setSuccess(true);
        await refreshStudent();
        setTimeout(() => router.replace("/portal/dashboard"), 2500);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Payment verification failed. Please contact support.");
      })
      .finally(() => setVerifying(false));
  }, [searchParams, student?.id, verifying, success, refreshStudent, router]);

  async function startCheckout(plan: SitePricingPlan) {
    if (!student?.id) return;
    const amountCents = getPlanAmountCents(plan);
    if (amountCents <= 0) {
      setError("This plan has no payment amount set. Contact info@bridgitus.com.");
      return;
    }
    if (!stripeConfigured) {
      setError("Payment is not yet configured. Contact info@bridgitus.com to complete enrollment.");
      return;
    }
    setPaying(true); setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          planId: plan.id,
          planTitle: plan.title,
          amountCents,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  function Header() {
    return (
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/FullLogo.png" alt="Bridgitus" width={100} height={36} className="h-8 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:inline">
            {student?.firstName} {student?.lastName}
          </span>
          <button
            type="button"
            onClick={() => signOut().then(() => router.replace("/portal/login"))}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            <MdLogout size={16} /> Sign out
          </button>
        </div>
      </header>
    );
  }

  if (authLoading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="w-8 h-8 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 p-8 max-w-md w-full text-center">
            <div className="w-10 h-10 border-4 border-secondary-color border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h1 className="text-lg font-bold text-gray-900">Confirming payment…</h1>
            <p className="text-sm text-gray-500 mt-2">Please wait while we activate your portal access.</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Payment successful!</h1>
            <p className="text-sm text-gray-500 mt-2">Redirecting you to the dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPlan) {
    const amountCents = getPlanAmountCents(selectedPlan);
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col">
        <Header />
        <div className="flex-1 py-10 px-4">
          <div className="max-w-lg mx-auto">
            {!lockedToRegisteredPlan && (
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="inline-flex items-center gap-1 text-sm text-secondary-color mb-6 hover:underline"
              >
                <MdArrowBack size={16} /> Back to plans
              </button>
            )}

            <div className="bg-secondary-color text-white p-6 text-center mb-0">
              <MdSchool size={28} className="mx-auto mb-2 opacity-80" />
              <h1 className="text-xl font-bold">Confirm payment</h1>
              <p className="text-white/70 text-sm text-center mt-1">{selectedPlan.title}</p>
            </div>

            <div className="bg-white border border-gray-200 border-t-0 p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">{selectedPlan.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">({selectedPlan.tagline}) · {selectedPlan.per}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-secondary-color">{selectedPlan.price}</p>
                  <p className="text-[11px] text-gray-400">AUD + tax</p>
                </div>
              </div>

              {error && (
                <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MdLock size={14} /> Secure checkout via Stripe
              </div>

              <button
                type="button"
                disabled={paying || amountCents <= 0}
                onClick={() => startCheckout(selectedPlan)}
                className="w-full py-3.5 text-sm font-bold bg-secondary-color text-white hover:bg-secondary-color/90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {paying ? (
                  "Redirecting…"
                ) : (
                  <><MdPayment size={20} />Pay {selectedPlan.price} AUD + tax with Stripe</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col">
      <Header />

      <div className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="w-full max-w-[1250px] mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="flex justify-center mb-4">
              <Image src="/assets/FullLogo.png" alt="Bridgitus" width={120} height={44}
                className="object-contain h-10 w-auto" priority />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {lockedToRegisteredPlan ? "Your selected plan" : "Choose your plan"}
            </h1>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Hi {student.firstName} —{" "}
              {lockedToRegisteredPlan
                ? "complete payment for the plan you chose at registration."
                : "same plans as our pricing page."}{" "}
              All prices are in AUD. Payment activates your full portal access immediately.
            </p>
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 mt-5 text-sm text-gray-600">
              <div className="w-6 h-6 bg-secondary-color flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{student.firstName[0]}</span>
              </div>
              {student.firstName} {student.lastName} · {student.studentId} · Grade {student.grade}
            </div>
          </div>

          {error && (
            <div className="max-w-xl mx-auto mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {plansLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${plans.length > 1 ? "sm:grid-cols-2" : "max-w-md mx-auto"} gap-6`}>
              {plans.map((plan) => {
                const amountCents = getPlanAmountCents(plan);
                return (
                  <div
                    key={plan.id}
                    className={`bg-white flex flex-col relative overflow-hidden ${plan.highlighted
                      ? "ring-2 ring-secondary-color"
                      : "border border-gray-200"
                      }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-color" />
                    )}
                    {plan.highlighted && (
                      <div className="absolute top-3 right-3 bg-secondary-color text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                        Most Popular
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1 gap-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-black text-gray-900 leading-tight">{plan.title}</h2>
                          <p className="text-gray-500 text-sm mt-0.5">({plan.tagline})</p>
                        </div>
                        {plan.icon && <span className="text-3xl shrink-0">{plan.icon}</span>}
                      </div>

                      <div>
                        <div className="flex items-end gap-1 flex-wrap">
                          <span className="text-5xl font-black text-gray-900 leading-none">{plan.price}</span>
                          <span className="text-gray-500 text-base font-medium mb-1">{plan.per}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">AUD</p>
                      </div>

                      {plan.badge && (
                        <div className="inline-block bg-secondary-color text-white text-sm font-bold px-4 py-1.5 w-fit">
                          {plan.badge}
                        </div>
                      )}

                      {plan.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
                      )}

                      {amountCents > 0 ? (
                        <button
                          type="button"
                          onClick={() => { setSelectedPlan(plan); setError(""); }}
                          className={`w-full py-3.5 text-sm font-bold text-center transition-colors ${plan.highlighted
                            ? "bg-secondary-color text-white hover:bg-secondary-color/90"
                            : "bg-[#001f5b] text-white hover:bg-[#001040]"
                            }`}
                        >
                          {plan.ctaLabel ?? `Select ${plan.title}`}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full py-3.5 text-sm font-bold text-center border border-gray-300 text-gray-500 bg-gray-50 cursor-not-allowed"
                        >
                          Not available for online payment
                        </button>
                      )}

                      {plan.features && plan.features.length > 0 ? (
                        <div>
                          <p className="font-bold text-secondary-color text-sm mb-3">What&apos;s Included:</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                            {plan.features.map((f, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-base">
                                  {f.icon}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-800 leading-tight">{f.title}</p>
                                  <p className="text-[11px] text-gray-500 leading-snug">{f.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="w-8 h-8 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentPageInner />
    </Suspense>
  );
}
