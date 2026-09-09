import type { Metadata } from "next";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import FeatureExplorer from "@/components/marketing/FeatureExplorer";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconAI,
  IconChart,
  IconDiagnostic,
  IconExam,
  IconLive,
  IconPassport,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Features for Students",
  description:
    "Explore every Bridgitus student feature: assessments, assignments, NAPLAN, Selective Entry, AI practice, analytics, materials, live sessions, parent messaging, and the Smart Learning Passport.",
};

export default function FeaturesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Platform"
        title="A complete learning system — not a pile of disconnected tools"
        subtitle="Everything students need in one portal: diagnose, practise, submit, attend live sessions, and watch mastery grow."
        crumbs={[{ href: "/features", label: "Features" }]}
        image="/assets/i8.jpg"
        badge="One connected portal"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">What students open every week</h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Bridgitus combines live tutoring expertise with a modern student platform — visuals,
            practice, and proof in one place.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Assessments & diagnostics",
                  body: "Adaptive tests that map exact skills — not one vague percentage.",
                  icon: <IconDiagnostic />,
                },
                {
                  title: "Smart Learning Passport",
                  body: "Levels, gaps, goals, and parent-ready progress that updates as mastery grows.",
                  icon: <IconPassport />,
                },
                {
                  title: "AI-guided practice",
                  body: "Hints that prompt thinking. Never completed answers to graded work.",
                  icon: <IconAI />,
                },
                {
                  title: "Live online sessions",
                  body: "Tutor agendas driven by passport priorities so every minute counts.",
                  icon: <IconLive />,
                },
                {
                  title: "NAPLAN & Selective",
                  body: "Timed papers, domain drills, and analytics aligned to the real exams.",
                  icon: <IconExam />,
                },
                {
                  title: "Analytics that parents see",
                  body: "Dashboards and reports that show growth — not just activity.",
                  icon: <IconChart />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <FeatureExplorer />

      <SplitShowcase
        eyebrow="Assignments & materials"
        title="Practice linked to real gaps"
        body="Structured assignments with due dates and feedback. Materials — videos, worksheets, guided lessons — matched to passport priorities so no time is wasted."
        bullets={[
          "Due dates, submissions, and tutor feedback",
          "Curriculum resources tied to flagged skills",
          "Retake pathways when mastery isn’t there yet",
        ]}
        image="/assets/i9.jpg"
      />

      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
