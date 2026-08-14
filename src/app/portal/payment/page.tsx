"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getPublishedPricingPlans,
  getPlanAmountCents,
  type SitePricingPlan,
} from "@/lib/firestore";
import {
  MdPayment, MdCheckCircle, MdLock, MdSchool, MdLogout,
  MdArrowBack,
} from "react-icons/md";

/** Same AUD plans / layout content as the public pricing page. */
const FALLBACK_PLANS: SitePricingPlan[] = [
  {
    id: "1",
    title: "Basic Plan",
    tagline: "Pay as you go",
    price: "$50",
    per: "/hour lesson",
    badge: "1 Student",
    description: "Perfect for trial lessons or casual, flexible learning with no commitment.",
    icon: "📚",
    ctaLabel: "Select Basic Plan",
    perks: [{ desc: "Flexible Scheduling" }, { desc: "No long-term commitment" }, { desc: "Perfect for casual learning" }],
    freePerks: ["One-on-one tutoring", "Flexible scheduling", "Free initial consultation"],
    features: [
      { icon: "🎯", title: "Personalised learning", desc: "Tailored to your child's needs" },
      { icon: "📅", title: "Flexible scheduling", desc: "Book sessions that fit your life" },
      { icon: "✅", title: "No commitment", desc: "Pay only for what you need" },
      { icon: "💬", title: "Expert feedback", desc: "Immediate guidance each session" },
    ],
    bottomNote1: "Start learning today with no obligation.",
    bottomNote2: "Cancel or pause anytime",
    highlighted: false,
    order: 0,
    published: true,
    amountCents: 5000,
    durationDays: 7,
  },
  {
    id: "2",
    title: "Standard Plan",
    tagline: "Growth Plan",
    price: "$955",
    per: "20 classes at $47.75/hr",
    badge: "10 Weeks",
    description: "Structured learning with 2 sessions per week — build consistency and real momentum.",
    icon: "🚀",
    ctaLabel: "Select Standard Plan",
    perks: [{ desc: "2 classes per week (10 weeks)" }, { desc: "Structured learning with consistency" }, { desc: "Progress tracking & Feedback" }],
    freePerks: ["One-on-one tutoring", "Flexible scheduling", "Free initial consultation"],
    features: [
      { icon: "📊", title: "Progress tracking", desc: "Regular updates for your child" },
      { icon: "🎓", title: "Structured lessons", desc: "With consistency & routine" },
      { icon: "💡", title: "Personalised support", desc: "Tailored to each child's needs" },
      { icon: "🛡", title: "Flexible & convenient", desc: "Online lessons that fit your schedule" },
    ],
    bottomNote1: "More learning. More progress. More value.",
    bottomNote2: "Cancel or pause anytime",
    highlighted: true,
    order: 1,
    published: true,
    amountCents: 95500,
    durationDays: 70,
  },
  {
    id: "3",
    title: "Premium Plan",
    tagline: "Success Plan",
    price: "$1,365",
    per: "30 classes at $45.50/hr",
    badge: "15 Weeks",
    description: "The strongest foundation — 2 sessions per week over 15 weeks with full accountability.",
    icon: "🏆",
    ctaLabel: "Select Premium Plan",
    perks: [{ desc: "2 classes per week (15 weeks)" }, { desc: "Strong foundation & measurable improvements" }, { desc: "Best value for long-term learning" }],
    freePerks: ["One-on-one tutoring", "Flexible scheduling", "Free initial consultation"],
    features: [
      { icon: "📈", title: "Measurable improvement", desc: "Track real academic progress" },
      { icon: "🎯", title: "Deep personalisation", desc: "Fully tailored programme" },
      { icon: "📝", title: "Exam readiness", desc: "Targeted test & exam preparation" },
      { icon: "🤝", title: "Dedicated tutor", desc: "Consistent mentor every session" },
    ],
    bottomNote1: "Best value — save more per hour the longer you commit.",
    bottomNote2: "Cancel or pause anytime",
    highlighted: false,
    order: 2,
    published: true,
    amountCents: 136500,
    durationDays: 105,
  },
  {
    id: "4",
    title: "Family Plan",
    tagline: "Best Value for Families",
    price: "$49.99",
    per: "/week",
    badge: "1 to 3 Children",
    description: "Unlimited access for up to 3 children. One low price. More progress together.",
    icon: "👨‍👩‍👧‍👦",
    ctaLabel: "Select Family Plan",
    perks: [{ desc: "Up to 3 children included" }, { desc: "Unlimited weekly access" }, { desc: "One flat weekly price" }],
    freePerks: ["One-on-one tutoring per child", "Flexible scheduling", "Free initial consultation"],
    features: [
      { icon: "👥", title: "Structured learning", desc: "With consistency & routine" },
      { icon: "👤", title: "Personalised support", desc: "Tailored to each child's needs" },
      { icon: "📊", title: "Progress tracking & feedback", desc: "Regular updates for each child" },
      { icon: "👨‍👩‍👧", title: "Family learning support", desc: "Resources to support learning at home" },
      { icon: "🛡", title: "Flexible & convenient", desc: "Online lessons that fit your schedule" },
    ],
    bottomNote1: "More learning. More progress. More value together.",
    bottomNote2: "Cancel or pause anytime",
    highlighted: false,
    order: 3,
    published: true,
    amountCents: 4999,
    durationDays: 7,
  },
];

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

  const stripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_"));

  useEffect(() => {
    if (authLoading) return;
    if (!student) { router.replace("/portal/login"); return; }
    if (student.paymentStatus === "paid" || student.paymentStatus === "waived") {
      router.replace("/portal/dashboard");
    }
  }, [student, authLoading, router]);

  useEffect(() => {
    getPublishedPricingPlans()
      .then((data) => {
        // Prefer CMS plans, but fill missing marketing fields from fallback by title
        if (data.length === 0) {
          setPlans(FALLBACK_PLANS);
          return;
        }
        const enriched = data.map((plan) => {
          const fb = FALLBACK_PLANS.find(
            (f) => f.title.toLowerCase() === plan.title.toLowerCase()
          );
          return {
            ...fb,
            ...plan,
            features: plan.features?.length ? plan.features : fb?.features,
            description: plan.description || fb?.description,
            icon: plan.icon || fb?.icon,
            bottomNote1: plan.bottomNote1 || fb?.bottomNote1,
            bottomNote2: plan.bottomNote2 || fb?.bottomNote2,
            badge: plan.badge || fb?.badge,
            amountCents: getPlanAmountCents(plan) || fb?.amountCents,
          } as SitePricingPlan;
        });
        setPlans(enriched);
      })
      .catch(() => setPlans(FALLBACK_PLANS))
      .finally(() => setPlansLoading(false));
  }, []);

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
      if (!res.ok || !data.url) {
        throw new Error(data.error || data.message || "Could not start checkout");
      }
      window.location.href = data.url as string;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not start payment.");
      setPaying(false);
    }
  }

  async function handleSignOut() { await signOut(); router.replace("/portal/login"); }

  if (authLoading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">{verifying ? "Confirming your payment…" : "Loading your account…"}</p>
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

  if (selectedPlan) {
    const amountCents = getPlanAmountCents(selectedPlan);
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

                <div className="border border-secondary-color/30 bg-secondary-color/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">{selectedPlan.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">({selectedPlan.tagline}) · {selectedPlan.per}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-secondary-color">{selectedPlan.price}</p>
                      <p className="text-[11px] text-gray-400">AUD</p>
                    </div>
                  </div>
                </div>

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

                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <button
                  onClick={() => startCheckout(selectedPlan)}
                  disabled={paying || amountCents <= 0}
                  className="w-full bg-secondary-color hover:bg-secondary-color/90 disabled:opacity-50 text-white font-bold py-4 text-base flex items-center justify-center gap-2 transition-colors"
                >
                  {paying ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Redirecting to Stripe…</>
                  ) : (
                    <><MdPayment size={20} />Pay {selectedPlan.price} AUD with Stripe</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <MdLock size={12} /> Secured by Stripe · AUD · 256-bit SSL
                </div>
              </div>
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
              Choose your plan
            </h1>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Hi {student.firstName} — same plans as our pricing page. All prices are in AUD.
              Payment activates your full portal access immediately.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {plans.map((plan) => {
                const amountCents = getPlanAmountCents(plan);
                return (
                  <div
                    key={plan.id}
                    className={`bg-white flex flex-col relative overflow-hidden ${plan.highlighted
                      ? "ring-2 ring-secondary-color shadow-lg"
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
                                  <p className="font-bold text-gray-900 text-xs leading-tight">{f.title}</p>
                                  <p className="text-gray-400 text-xs leading-tight mt-0.5">{f.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {plan.perks.map((perk, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="text-secondary-color text-base shrink-0 mt-0.5">✓</span>
                              <p className="text-sm text-gray-600">{perk.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {(plan.bottomNote1 || plan.bottomNote2) && (
                        <>
                          <div className="h-px bg-gray-100 mt-auto" />
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                            {plan.bottomNote1 && (
                              <div className="flex items-start gap-1.5">
                                <span className="text-secondary-color shrink-0">♡</span>
                                <span>{plan.bottomNote1}</span>
                              </div>
                            )}
                            {plan.bottomNote2 && (
                              <div className="flex items-start gap-1.5">
                                <span className="text-secondary-color shrink-0">🛡</span>
                                <span>{plan.bottomNote2}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-10">
            All prices are in AUD. Plans can be paused or cancelled at any time.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
            <MdLock size={13} />
            All payments secured by Stripe · AUD · 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="w-10 h-10 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentPageInner />
    </Suspense>
  );
}
