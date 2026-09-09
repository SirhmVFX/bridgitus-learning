import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import InteractiveFaq from "@/components/marketing/InteractiveFaq";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconChart,
  IconParent,
  IconPassport,
  IconSpark,
  IconTarget,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "For Parents",
  description:
    "Bridgitus for parents: plain-language reports, Smart Learning Passport updates, scheduled messaging, and proof that tutoring is closing real gaps.",
};

export default function ForParentsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Parents"
        title="Clarity you can read in two minutes"
        subtitle="Plain-language parent reports, passport progress, and messaging — so you’re never left guessing whether learning is working."
        crumbs={[{ href: "/for-parents", label: "For parents" }]}
        image="/assets/i12.jpg"
        badge="Proof, not vibes"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">
            “Is my child actually improving?”
          </h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Bridgitus answers with evidence — not a vague feeling that the tutor “seems happy.”
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Smart Learning Passport",
                  body: "Achievement levels and specific gaps — not vague ‘needs improvement’.",
                  icon: <IconPassport />,
                },
                {
                  title: "Weekly goals",
                  body: "Two or three targets you can discuss at the dinner table.",
                  icon: <IconTarget />,
                },
                {
                  title: "Progress over time",
                  body: "Visual growth across terms — the story behind a single score.",
                  icon: <IconChart />,
                },
                {
                  title: "Tutor comments",
                  body: "Specific, personal notes that make the data feel human.",
                  icon: <IconSpark />,
                },
                {
                  title: "Parent messaging",
                  body: "Updates from the learning team without chasing reports.",
                  icon: <IconParent />,
                },
                {
                  title: "Clear next steps",
                  body: "Know whether to continue, intensify, or adjust the plan.",
                  icon: <IconTarget />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <SplitShowcase
        eyebrow="Flexible"
        title="Standalone Passport — or full tutoring"
        body="Prefer insight without weekly live sessions? Start with the standalone Passport. Ready for full support? Premium tutoring includes the Passport free."
        bullets={[
          "Standalone from $49/term",
          "Included free with Premium tutoring",
          "Upgrade anytime when a gap needs a human tutor",
        ]}
        image="/assets/i8.jpg"
        imageLeft
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/smart-learning-passport"
            className="inline-flex rounded-full border border-[#001233] px-5 py-2.5 text-sm font-semibold text-[#001233] hover:bg-[#001233] hover:text-white transition"
          >
            Explore the Passport
          </Link>
          <Link
            href="/pricing"
            className="inline-flex rounded-full bg-[#00369b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002a7a] transition"
          >
            View pricing
          </Link>
        </div>
      </SplitShowcase>

      <InteractiveFaq />
      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
