import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";

export const metadata: Metadata = {
  title: "How to Read a Progress Report",
  description:
    "Parent guide to reading Bridgitus progress reports and Smart Learning Passport updates — levels, gaps, goals, and growth over time.",
};

export default function ProgressReportGuide() {
  return (
    <div>
      <PageHero
        eyebrow="Guide"
        title="How to read a progress report"
        subtitle="A good parent report answers three questions in under two minutes: Where is my child now? What are we working on? What’s the evidence?"
        crumbs={[
          { href: "/guides", label: "Guides" },
          { href: "/guides/reading-progress-reports", label: "Progress reports" },
        ]}
        image="/assets/i8.jpg"
        badge="Under 2 minutes"
      />

      <SplitShowcase
        eyebrow="Look deeper"
        title="Skill detail beats one percentage"
        body="A single score hides the story. Bridgitus reports show achievement level by subject, specific knowledge gaps, and outcomes already mastered."
        bullets={[
          "Weekly goals stay small and discussable",
          "Progress over time shows real growth",
          "Tutor comments stay specific and personal",
        ]}
        image="/assets/i12.jpg"
        imageLeft
      />

      <SplitShowcase
        eyebrow="Next"
        title="Use the report to decide"
        body="Continue, intensify, or adjust — with evidence instead of guesswork."
        image="/assets/i9.jpg"
      >
        <p className="mt-6 text-sm text-[#64748b]">
          See the{" "}
          <Link href="/for-parents" className="mkt-link">
            parent overview
          </Link>{" "}
          or the{" "}
          <Link href="/smart-learning-passport" className="mkt-link">
            Passport story
          </Link>
          .
        </p>
      </SplitShowcase>

      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
