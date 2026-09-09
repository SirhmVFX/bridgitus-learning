import type { Metadata } from "next";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import { IconAI, IconSpark, IconTarget, IconTutor } from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "AI-Guided Practice",
  description:
    "Bridgitus AI practice prompts thinking with scaffolded hints — never answer keys — so students build real understanding.",
};

export default function AiPracticePage() {
  return (
    <div>
      <PageHero
        eyebrow="AI practice"
        title="AI that teaches thinking — not shortcuts"
        subtitle="Our hard rule: prescribe the next learning step and hints that ask ‘why’, never completed answers to graded work."
        crumbs={[{ href: "/ai-practice", label: "AI practice" }]}
        image="/assets/i4.jpg"
        badge="Hints, not answers"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <IconCardGrid
            items={[
              {
                title: "Scaffolded hints",
                body: "Questions like “What operation do you use when combining equal groups?” before any answer.",
                icon: <IconSpark />,
              },
              {
                title: "Gap-matched practice",
                body: "Recommendations tied to flagged skills in the Learning Passport.",
                icon: <IconTarget />,
              },
              {
                title: "Responsible AI",
                body: "Never completes graded items. Thinking stays with the student.",
                icon: <IconAI />,
              },
              {
                title: "Tutor oversight",
                body: "Human tutors remain the final layer of instructional judgement.",
                icon: <IconTutor />,
              },
            ]}
          />
        </div>
      </section>

      <SplitShowcase
        eyebrow="Why parents care"
        title="Fast progress on paper means nothing if understanding is hollow"
        body="Parents are rightly wary of AI tools that just “give the answer.” Bridgitus AI practice is built for genuine mastery."
        bullets={[
          "Visible scaffolding, not secret answer dumps",
          "Retests catch memorised patterns",
          "Aligned with OECD-style purposeful AI use in education",
        ]}
        image="/assets/i9.jpg"
      />

      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
