import Link from "next/link";
import { getPublishedPricingPlans, type SitePricingPlan } from "@/lib/firestore";

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
    ctaLabel: "Book your first lesson",
    ctaHref: "/register",
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
    ctaLabel: "Book your standard plan",
    ctaHref: "/register",
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
    ctaLabel: "Book your premium plan",
    ctaHref: "/register",
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
    ctaLabel: "Book your family plan now",
    ctaHref: "/register",
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

export default async function Pricing() {
  let plans: SitePricingPlan[] = [];
  try { plans = await getPublishedPricingPlans(); } catch { }
  if (plans.length === 0) plans = FALLBACK_PLANS;

  return (
    <main className="min-h-screen bg-[#f4f6fb] py-16 sm:py-20 px-4">
      <div className="w-full max-w-[1250px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 pt-10 sm:pt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Choose your plan
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            Flexible pricing for every learner. All plans include one-on-one personalised tutoring.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-10">
          All prices are in AUD. Plans can be paused or cancelled at any time. Contact us for custom enterprise or school pricing.
        </p>
      </div>
    </main>
  );
}

function PricingCard({ plan }: { plan: SitePricingPlan }) {
  return (
    <div className={`bg-white flex flex-col relative overflow-hidden ${plan.highlighted
        ? "ring-2 ring-secondary-color shadow-lg"
        : "border border-gray-200"
      }`}>
      {/* Popular badge */}
      {plan.highlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-color" />
      )}
      {plan.highlighted && (
        <div className="absolute top-3 right-3 bg-secondary-color text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
          Most Popular
        </div>
      )}

      <div className="p-6 flex flex-col flex-1 gap-5">
        {/* Title row with icon */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-tight">{plan.title}</h2>
            <p className="text-gray-500 text-sm mt-0.5">({plan.tagline})</p>
          </div>
          {plan.icon && (
            <span className="text-3xl shrink-0">{plan.icon}</span>
          )}
        </div>

        {/* Price */}
        <div>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-black text-gray-900 leading-none">{plan.price}</span>
            <span className="text-gray-500 text-base font-medium mb-1">{plan.per}</span>
          </div>
        </div>

        {/* Badge */}
        {plan.badge && (
          <div className="inline-block bg-secondary-color text-white text-sm font-bold px-4 py-1.5 w-fit">
            {plan.badge}
          </div>
        )}

        {/* Description */}
        {plan.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
        )}

        {/* CTA button */}
        <Link
          href={plan.ctaHref ?? "/register"}
          className={`w-full py-3.5 text-sm font-bold text-center transition-colors ${plan.highlighted
              ? "bg-secondary-color text-white hover:bg-secondary-color/90"
              : "bg-[#001f5b] text-white hover:bg-[#001040]"
            }`}
        >
          {plan.ctaLabel ?? "Book your lesson now"}
        </Link>

        {/* What's Included */}
        {plan.features && plan.features.length > 0 && (
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
        )}

        {/* Classic perks fallback if no features */}
        {(!plan.features || plan.features.length === 0) && plan.perks.length > 0 && (
          <div className="space-y-2">
            {plan.perks.map((perk, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-secondary-color text-base shrink-0 mt-0.5">✓</span>
                <p className="text-sm text-gray-600">{perk.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom divider + notes */}
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
}
