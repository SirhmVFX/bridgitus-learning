import Button from "@/components/Button";
import { Check } from "@/components/Icons";
import { getPublishedPricingPlans, type SitePricingPlan } from "@/lib/firestore";

const FALLBACK_PLANS: SitePricingPlan[] = [
  {
    id: "1", title: "Basic Plan", tagline: "Pay as you go", price: "$50", per: "/hour lesson", highlighted: false, order: 0, published: true,
    perks: [{ desc: "Flexible Scheduling" }, { desc: "No long-term commitment" }, { desc: "Perfect for trial lessons or casual learning" }],
    freePerks: ["One-on-one personalized tutoring", "Flexible scheduling options", "Free initial consultation"]
  },
  {
    id: "2", title: "Standard Plan", tagline: "Growth Plan", price: "$955", per: "20 classes at $47.75/hr", highlighted: true, order: 1, published: true,
    perks: [{ desc: "2 classes per week (10 weeks)" }, { desc: "Structured learning with consistency" }, { desc: "Progress tracking & Feedback" }],
    freePerks: ["One-on-one personalized tutoring", "Flexible scheduling options", "Free initial consultation"]
  },
  {
    id: "3", title: "Premium Plan", tagline: "Success Plan", price: "$1,365", per: "30 classes at $45.50/hr", highlighted: false, order: 2, published: true,
    perks: [{ desc: "2 classes per week (15 weeks)" }, { desc: "Strong foundation & measurable improvements" }, { desc: "Best value for long-term learning" }],
    freePerks: ["One-on-one personalized tutoring", "Flexible scheduling options", "Free initial consultation"]
  },
];

export default async function Pricing() {
  let plans: SitePricingPlan[] = [];
  try { plans = await getPublishedPricingPlans(); } catch { }
  if (plans.length === 0) plans = FALLBACK_PLANS;

  return (
    <main>
      <section>
        <div className="w-full max-w-[1250px] mx-auto flex flex-col gap-10 items-center py-24 sm:py-32 px-4 md:px-6">
          <div className="flex flex-col gap-2 items-center pt-10 sm:pt-20 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">Choose your plan</h1>
            <p className="text-sm sm:text-lg text-black/50">Our one-on-one private tuition costs just</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {plans.map((plan) => (
              <div key={plan.id}
                className={`flex flex-col gap-6 cursor-pointer border p-6 sm:p-10 transition-all hover:border-blue-500 hover:bg-blue-50/30 ${plan.highlighted ? "border-blue-500 bg-blue-50/20 relative" : "border-black/10 bg-gray-50/20"
                  }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1">POPULAR</div>
                )}
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl sm:text-2xl font-bold">{plan.title}</h2>
                  <p className="text-gray-500 text-sm">({plan.tagline})</p>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-4xl sm:text-6xl font-bold">{plan.price}</h3>
                  <p className="text-sm text-gray-500">{plan.per}</p>
                </div>
                <Button style="link" href="/register">Book your first lesson now</Button>
                <div className="flex flex-col gap-2">
                  {plan.perks.map((perk, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Check className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-black/50">{perk.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-black/10" />
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-sm">Free Perks</p>
                  {plan.freePerks.filter(Boolean).map((fp, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Check className="text-green-500 w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-black/50">{fp}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
