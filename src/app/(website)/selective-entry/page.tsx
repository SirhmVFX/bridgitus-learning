import type { Metadata } from "next";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconChart,
  IconExam,
  IconSpark,
  IconTarget,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Selective Entry Preparation",
  description:
    "Prepare for selective school entry with Bridgitus practice papers, scored drills, tutoring, and progress tracking.",
};

export default function SelectiveEntryPage() {
  return (
    <div>
      <PageHero
        eyebrow="Selective Entry"
        title="Selective school prep with structure and proof"
        subtitle="Scored practice, targeted tutoring, and clear progress tracking for competitive selective pathways."
        crumbs={[{ href: "/selective-entry", label: "Selective Entry" }]}
        image="/assets/i12.jpg"
        badge="Reasoning · Reading · Maths"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <IconCardGrid
            items={[
              {
                title: "Selective-style papers",
                body: "Practice in the portal that mirrors the pressure of the real pathway.",
                icon: <IconExam />,
              },
              {
                title: "Skill diagnosis",
                body: "Strengthen reasoning, reading, and maths — not just memorised patterns.",
                icon: <IconTarget />,
              },
              {
                title: "Progress parents can follow",
                body: "Analytics and reports that show what’s moving.",
                icon: <IconChart />,
              },
              {
                title: "Scholarship stream",
                body: "Optional pairing with scholarship preparatory classes.",
                icon: <IconSpark />,
              },
            ]}
          />
        </div>
      </section>

      <SplitShowcase
        eyebrow="More than cramming"
        title="Competitive pathways need foundations"
        body="Selective pathways demand more than last-minute cramming. Bridgitus combines practice papers with skill diagnosis so students strengthen the thinking behind the score."
        image="/assets/i9.jpg"
      />

      <MarketingCta primaryLabel="Prepare for Selective Entry" image="/assets/i12.jpg" />
    </div>
  );
}
