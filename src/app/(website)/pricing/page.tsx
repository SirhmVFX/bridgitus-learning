import { getPublishedPricingPlans, type SitePricingPlan } from "@/lib/firestore";
import { FALLBACK_PLANS, enrichPlans } from "@/lib/pricingPlans";
import PricingPlanCard from "@/components/PricingPlanCard";

export default async function Pricing() {
  let plans: SitePricingPlan[] = [];
  try {
    plans = enrichPlans(await getPublishedPricingPlans());
  } catch {
    plans = FALLBACK_PLANS;
  }
  if (plans.length === 0) plans = FALLBACK_PLANS;

  return (
    <main className="min-h-screen bg-[#f4f6fb] py-16 sm:py-20 px-4">
      <div className="w-full max-w-[1250px] mx-auto">
        <div className="text-center mb-12 sm:mb-16 pt-10 sm:pt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Choose your plan
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            Flexible pricing for every learner. All plans include one-on-one personalised tutoring.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <PricingPlanCard key={plan.id ?? plan.title} plan={plan} />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          All prices are in AUD. Plans can be paused or cancelled at any time. Contact us for custom enterprise or school pricing.
        </p>
      </div>
    </main>
  );
}
