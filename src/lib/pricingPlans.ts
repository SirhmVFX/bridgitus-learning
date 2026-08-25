import type { SitePricingPlan } from "@/lib/firestore";
import { getPlanAmountCents } from "@/lib/firestore";

/** Always show Family Plan first across pricing, register, and payment. */
export function sortPlansFamilyFirst(plans: SitePricingPlan[]): SitePricingPlan[] {
  return [...plans].sort((a, b) => {
    const aFamily = isFamilyPlan(a) ? 0 : 1;
    const bFamily = isFamilyPlan(b) ? 0 : 1;
    if (aFamily !== bFamily) return aFamily - bFamily;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

/** Shared AUD plans used by pricing, register, and portal payment. */
export const FALLBACK_PLANS: SitePricingPlan[] = [
  {
    id: "4",
    title: "Family Plan",
    tagline: "Best Value for Families",
    price: "$49.99",
    per: "/week",
    badge: "1 to 3 Children",
    description: "Unlimited access for up to 3 children. One low price. More progress together.",
    icon: "👨‍👩‍👧‍👦",
    ctaLabel: "Book your family plan now",
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
    order: 0,
    published: true,
    amountCents: 4999,
    durationDays: 7,
  },
  {
    id: "1",
    title: "Basic Plan",
    tagline: "Pay as you go",
    price: "$50",
    per: "/hour lesson",
    badge: "1 Student",
    description: "Perfect for trial lessons or casual, flexible learning with no commitment.",
    icon: "📚",
    ctaLabel: "Book your first lesson",
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
    order: 1,
    published: true,
    amountCents: 5000,
    durationDays: 0, // usage quotas (1 lesson + 1 assessment), not calendar days
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
    ctaLabel: "Book your standard plan",
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
    order: 2,
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
    ctaLabel: "Book your premium plan",
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
    order: 3,
    published: true,
    amountCents: 136500,
    durationDays: 105,
  },
];

export function isFamilyPlan(plan: Pick<SitePricingPlan, "title" | "badge"> | null | undefined): boolean {
  if (!plan) return false;
  const title = (plan.title || "").toLowerCase();
  const badge = (plan.badge || "").toLowerCase();
  return title.includes("family") || badge.includes("1 to 3") || badge.includes("1 to 4");
}

export function maxStudentsForPlan(plan: Pick<SitePricingPlan, "title" | "badge"> | null | undefined): number {
  return isFamilyPlan(plan) ? 3 : 1;
}

export function findPlanMatch(
  plans: SitePricingPlan[],
  opts: { planId?: string | null; planTitle?: string | null }
): SitePricingPlan | undefined {
  if (opts.planId) {
    const byId = plans.find((p) => p.id === opts.planId);
    if (byId) return byId;
  }
  if (opts.planTitle) {
    const t = opts.planTitle.toLowerCase().trim();
    return plans.find((p) => p.title.toLowerCase() === t || p.title.toLowerCase().includes(t));
  }
  return undefined;
}

export function enrichPlans(cmsPlans: SitePricingPlan[]): SitePricingPlan[] {
  if (!cmsPlans.length) return FALLBACK_PLANS;
  const enriched = cmsPlans.map((plan) => {
    const fb = FALLBACK_PLANS.find((f) => f.title.toLowerCase() === plan.title.toLowerCase());
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
      durationDays: plan.durationDays ?? fb?.durationDays,
    } as SitePricingPlan;
  });
  return sortPlansFamilyFirst(enriched);
}

export { getPlanAmountCents };
