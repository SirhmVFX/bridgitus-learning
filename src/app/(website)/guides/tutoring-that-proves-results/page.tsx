import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";

export const metadata: Metadata = {
  title: "Tutoring That Proves Results",
  description:
    "Why tutoring hours aren’t enough — and how Bridgitus pairs live teaching with the Smart Learning Passport so families can see real mastery.",
};

export default function TutoringResultsGuide() {
  return (
    <div>
      <PageHero
        eyebrow="Guide"
        title="Tutoring that proves results"
        subtitle="You’re not buying hours. You’re buying a measurable learning journey."
        crumbs={[
          { href: "/guides", label: "Guides" },
          { href: "/guides/tutoring-that-proves-results", label: "Proving results" },
        ]}
        image="/assets/i12.jpg"
        badge="Hours ≠ outcomes"
      />

      <SplitShowcase
        eyebrow="The shift"
        title="From commodity hours to measurable journeys"
        body="Most tutoring competitors sell time. Hours are shoppable on price. A measurable journey is harder to replace — because switching means losing progress history."
        bullets={[
          "Diagnose skill-by-skill before teaching",
          "Teach to passport priorities",
          "Retest until mastery is genuine",
          "Share plain-language proof with parents",
        ]}
        image="/assets/i6.jpg"
        imageLeft
      />

      <SplitShowcase
        eyebrow="Decide"
        title="Compare plans with evidence in mind"
        body="Whether you start with the Passport alone or full tutoring, Bridgitus keeps the proof layer visible."
        image="/assets/i8.jpg"
      >
        <p className="mt-6 text-sm text-[#64748b]">
          Compare{" "}
          <Link href="/pricing" className="mkt-link">
            plans
          </Link>{" "}
          or explore{" "}
          <Link href="/online-tutoring" className="mkt-link">
            online tutoring
          </Link>
          .
        </p>
      </SplitShowcase>

      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
