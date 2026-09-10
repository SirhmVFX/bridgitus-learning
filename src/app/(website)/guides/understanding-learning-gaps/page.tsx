import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";

export const metadata: Metadata = {
  title: "Understanding Learning Gaps",
  description:
    "Learn what academic learning gaps are, why they compound silently, and how Bridgitus skill diagnostics and the Smart Learning Passport close them.",
};

export default function LearningGapsGuide() {
  return (
    <div>
      <PageHero
        eyebrow="Guide"
        title="Understanding learning gaps"
        subtitle="A small miss in Year 3 fractions can become a Year 6 maths struggle — unless someone flags the exact skill early."
        crumbs={[
          { href: "/guides", label: "Guides" },
          { href: "/guides/understanding-learning-gaps", label: "Learning gaps" },
        ]}
        image="/assets/i6.jpg"
        badge="Catch it early"
      />

      <SplitShowcase
        eyebrow="What a gap really is"
        title="Not vague — specific"
        body="A learning gap is a specific skill below mastery — like long division with remainders — not a vague sense that maths is “hard.” School reports often hide that detail."
        bullets={[
          "Later topics assume earlier skills",
          "Unseen gaps erode confidence",
          "Bridgitus names the exact skill in the Passport",
        ]}
        image="/assets/i8.jpg"
        imageLeft
      />

      <SplitShowcase
        eyebrow="How Bridgitus finds them"
        title="Diagnose → map → retest"
        body="Adaptive diagnostics score each curriculum sub-skill. Gaps feed lessons and practice. Retests confirm real mastery."
        image="/assets/i4.jpg"
      >
        <p className="mt-6 text-sm text-[#64748b]">
          Read more about the{" "}
          <Link href="/smart-learning-passport" className="mkt-link">
            Smart Learning Passport
          </Link>{" "}
          or{" "}
          <Link href="/assessments" className="mkt-link">
            assessments
          </Link>
          .
        </p>
      </SplitShowcase>

      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
