import type { Metadata } from "next";
import PageHero, {
  AudienceStrip,
  IconCardGrid,
  SplitShowcase,
} from "@/components/marketing/PageHero";
import HowItWorksSteps from "@/components/marketing/HowItWorksSteps";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconChart,
  IconDiagnostic,
  IconParent,
  IconPassport,
  IconStudents,
  IconTutor,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "How Bridgitus Works",
  description:
    "See how Bridgitus diagnoses skill gaps, builds a Smart Learning Passport, personalises lessons, and retests for genuine mastery.",
};

export default function HowItWorksPage() {
  return (
    <div>
      <PageHero
        eyebrow="Process"
        title="From first diagnostic to proven mastery"
        subtitle="Adaptive testing, gap mapping, passport generation, guided learning, and skill-level retesting — designed so growth data reflects real learning."
        crumbs={[{ href: "/how-it-works", label: "How it works" }]}
        image="/assets/i6.jpg"
        badge="Evidence-led teaching"
      />

      <HowItWorksSteps />

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">The system in motion</h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Every step feeds the next — so tutoring time is spent on real gaps, not guesswork.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Diagnose",
                  body: "Skill-by-skill scoring that adapts so students stay challenged without shutting down.",
                  icon: <IconDiagnostic />,
                },
                {
                  title: "Passport",
                  body: "A living profile of levels, gaps, mastered outcomes, and weekly goals.",
                  icon: <IconPassport />,
                },
                {
                  title: "Track growth",
                  body: "Retests confirm mastery. Parents see progress over time — not a one-off score.",
                  icon: <IconChart />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <AudienceStrip
        items={[
          {
            title: "Students",
            body: "A personal roadmap with weekly goals small enough to finish in one sitting — confidence from visible wins.",
            icon: <IconStudents className="h-7 w-7 text-[#00369b]" />,
            tint: "bg-[#e8eef8] text-[#00369b]",
          },
          {
            title: "Tutors",
            body: "Every session starts from data. Tutors know exactly what to teach next and add comments parents trust.",
            icon: <IconTutor className="h-7 w-7 text-[#C4A574]" />,
            tint: "bg-[#C4A574]/15 text-[#C4A574]",
          },
          {
            title: "Parents",
            body: "Plain-language reports: Where is my child now? What are we working on? What’s the evidence?",
            icon: <IconParent className="h-7 w-7 text-[#00369b]" />,
            tint: "bg-[#dbeafe] text-[#00369b]",
          },
        ]}
      />

      <SplitShowcase
        eyebrow="Responsible AI"
        title="Hints that teach thinking — never answer keys"
        body="AI recommends the next lesson and scaffolded hints. It never completes graded work. Mastery needs more than one lucky attempt."
        bullets={[
          "Prescribe the next step, not the answer",
          "Scaffolded hints that ask “why”",
          "Human tutors remain the final judgement",
        ]}
        image="/assets/i4.jpg"
        imageLeft
      />

      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
