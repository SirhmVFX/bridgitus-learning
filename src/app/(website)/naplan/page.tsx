import type { Metadata } from "next";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconChart,
  IconExam,
  IconLive,
  IconTarget,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "NAPLAN Preparation",
  description:
    "Bridgitus NAPLAN prep with practice papers, timed drills, analytics, and tutoring aligned to reading, writing, language, and numeracy.",
};

export default function NaplanPage() {
  return (
    <div>
      <PageHero
        eyebrow="NAPLAN"
        title="NAPLAN preparation with measurable practice"
        subtitle="Timed papers, domain-focused drills, and progress analytics — supported by tutors who teach to the gaps the data reveals."
        crumbs={[{ href: "/naplan", label: "NAPLAN prep" }]}
        image="/assets/i8.jpg"
        badge="Timed · Tracked · Taught"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <IconCardGrid
            items={[
              {
                title: "Practice papers",
                body: "NAPLAN-style papers in the student portal with clear scoring.",
                icon: <IconExam />,
              },
              {
                title: "Timed drills",
                body: "Build exam stamina without reducing learning to tricks.",
                icon: <IconTarget />,
              },
              {
                title: "Analytics",
                body: "See which domains are improving — reading, writing, language, numeracy.",
                icon: <IconChart />,
              },
              {
                title: "Tutor follow-up",
                body: "Live sessions target the exact skills the papers flag.",
                icon: <IconLive />,
              },
            ]}
          />
        </div>
      </section>

      <SplitShowcase
        eyebrow="Approach"
        title="Prep that builds the underlying skills"
        body="Bridgitus helps students prepare for NAPLAN without reducing learning to test tricks. Practice builds comprehension, language, and numeracy — while analytics show what’s improving."
        image="/assets/i6.jpg"
        imageLeft
      />

      <MarketingCta primaryLabel="Start NAPLAN prep" image="/assets/i12.jpg" />
    </div>
  );
}
