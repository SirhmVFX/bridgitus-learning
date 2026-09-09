import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import PassportShowcase from "@/components/marketing/PassportShowcase";
import InteractiveFaq from "@/components/marketing/InteractiveFaq";
import MarketingCta from "@/components/marketing/MarketingCta";
import HowItWorksSteps from "@/components/marketing/HowItWorksSteps";
import {
  IconChart,
  IconDiagnostic,
  IconParent,
  IconPassport,
  IconSpark,
  IconTarget,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Smart Learning Passport",
  description:
    "The Bridgitus Smart Learning Passport is a personal learning roadmap for Maths, English & Science — achievement levels, knowledge gaps, weekly goals, progress over time, and parent reports.",
};

export default function SmartLearningPassportPage() {
  return (
    <div>
      <PageHero
        eyebrow="Flagship product"
        title="Finally know exactly where your child stands — and what to do about it"
        subtitle="Stop guessing. Start measuring. The Bridgitus Smart Learning Passport turns diagnostic results into a living roadmap for Maths, English, and Science."
        crumbs={[{ href: "/smart-learning-passport", label: "Smart Learning Passport" }]}
        image="/assets/i12.jpg"
        badge="Living report card"
      />

      <SplitShowcase
        eyebrow="The problem"
        title="Most families are flying blind"
        body="Report cards are vague. Tutoring hours aren’t proof. Gaps compound silently. Generic AI apps hand out answers. You deserve evidence."
        bullets={[
          "School reports hide which skills are shaky",
          "Paying for time without independent proof",
          "Small Year 3 misses become Year 6 struggles",
        ]}
        image="/assets/i8.jpg"
        imageLeft
      />

      <section className="mkt-section bg-[#f7f8fa]">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">What’s inside every Passport</h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Seven elements that turn diagnostics into a plan parents can actually use.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Achievement level",
                  body: "Curriculum-aligned snapshot subject by subject.",
                  icon: <IconPassport />,
                },
                {
                  title: "Knowledge gaps",
                  body: "Exact skills — e.g. long division with remainders.",
                  icon: <IconDiagnostic />,
                },
                {
                  title: "Outcomes mastered",
                  body: "A verified checklist of what’s genuinely learned.",
                  icon: <IconSpark />,
                },
                {
                  title: "Next steps",
                  body: "Lessons and activities matched to the gaps.",
                  icon: <IconTarget />,
                },
                {
                  title: "Weekly goals",
                  body: "Small targets that build momentum.",
                  icon: <IconTarget />,
                },
                {
                  title: "Parent report",
                  body: "Plain language with tutor comments — under two minutes.",
                  icon: <IconParent />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <PassportShowcase />
      <HowItWorksSteps />

      <SplitShowcase
        eyebrow="Pricing"
        title="Standalone or included free"
        body="Smart Learning Passport standalone from $49/term — or included free with any Premium Tutoring Plan."
        bullets={[
          "Termly re-diagnostic + updated passport",
          "Upgrade to tutoring anytime",
          "Progress history that stays with your family",
        ]}
        image="/assets/i6.jpg"
      >
        <div className="mt-6">
          <Link href="/pricing" className="mkt-link">
            Compare plans →
          </Link>
        </div>
      </SplitShowcase>

      <InteractiveFaq />
      <MarketingCta image="/assets/i12.jpg"
        title="Your child’s roadmap starts with one diagnostic"
        primaryLabel="Get the Smart Learning Passport"
        primaryHref="/register"
      />
    </div>
  );
}
