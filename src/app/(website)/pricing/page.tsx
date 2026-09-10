import type { Metadata } from "next";
import { getPublishedPricingPlans, type SitePricingPlan } from "@/lib/firestore";
import { FALLBACK_PLANS, enrichPlans } from "@/lib/pricingPlans";
import PricingPlanCard from "@/components/PricingPlanCard";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import Link from "next/link";
import {
  IconPassport,
  IconSpark,
  IconTarget,
  IconTutor,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Bridgitus tutoring plans and Smart Learning Passport pricing. Premium plans include the Passport free.",
};

export default async function Pricing() {
  let plans: SitePricingPlan[] = [];
  try {
    plans = enrichPlans(await getPublishedPricingPlans());
  } catch {
    plans = FALLBACK_PLANS;
  }
  if (plans.length === 0) plans = FALLBACK_PLANS;

  return (
    <div>
      <PageHero
        eyebrow="Pricing"
        title="Plans that prove progress"
        subtitle="Flexible tutoring plans for every learner. Premium plans include the Smart Learning Passport at no extra cost."
        crumbs={[{ href: "/pricing", label: "Pricing" }]}
        image="/assets/i12.jpg"
        badge="Passport free on Premium"
      />

      <section className="mkt-section pb-0">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">
            What’s included across plans
          </h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Pick intensity — keep the Bridgitus loop of diagnose, teach, and prove.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Expert live tutoring",
                  body: "Agendas driven by diagnostic data — not generic worksheets.",
                  icon: <IconTutor />,
                },
                {
                  title: "Smart Learning Passport",
                  body: "Included free on Premium — or standalone from $49/term.",
                  icon: <IconPassport />,
                },
                {
                  title: "Clear goals",
                  body: "Two or three weekly targets you can actually discuss at home.",
                  icon: <IconTarget />,
                },
                {
                  title: "Measurable outcomes",
                  body: "Progress you can see — levels rising, gaps closing.",
                  icon: <IconSpark />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-container">
          <div className="mb-10 rounded-2xl border border-[#00c1ff]/40 bg-gradient-to-r from-[#001233] to-[#00369b] p-6 md:p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00c1ff]">
              Smart Learning Passport
            </p>
            <h2 className="mkt-display mt-2 text-2xl md:text-3xl">Standalone from $49/term</h2>
            <p className="mt-2 max-w-2xl text-white/70">
              Re-diagnostic + full updated passport each term — or included free with any Premium
              Tutoring Plan.{" "}
              <Link href="/smart-learning-passport" className="text-[#00c1ff] underline-offset-2 hover:underline">
                Learn about the Passport
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <PricingPlanCard key={plan.id ?? plan.title} plan={plan} />
            ))}
          </div>

          <p className="text-center text-xs text-[#001233]/45 mt-10">
            All prices are in AUD. Plans can be paused or cancelled anytime. Contact us for school or
            enterprise pricing.
          </p>
        </div>
      </section>

      <SplitShowcase
        eyebrow="Not sure which plan?"
        title="Start with a diagnostic conversation"
        body="Tell us the year level and goals — we’ll map Passport-only vs tutoring so you don’t overbuy or under-support."
        bullets={[
          "No pressure sales call",
          "Clear recommendation after diagnostic",
          "Upgrade or pause anytime",
        ]}
        image="/assets/i8.jpg"
        imageLeft
      />

      <MarketingCta secondaryHref="/contact" secondaryLabel="Ask about custom plans" image="/assets/i12.jpg" />
    </div>
  );
}
