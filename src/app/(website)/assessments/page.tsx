import type { Metadata } from "next";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconChart,
  IconDiagnostic,
  IconExam,
  IconTarget,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Assessments & Diagnostics",
  description:
    "Bridgitus student assessments: diagnostic, assessment, test, and exam modes with adaptive difficulty and skill-by-skill scoring.",
};

export default function AssessmentsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Assessments"
        title="Diagnostics that map skills — not just percentages"
        subtitle="Adaptive questions, skill-by-skill scoring, and gap mapping that feed directly into the Smart Learning Passport."
        crumbs={[{ href: "/assessments", label: "Assessments" }]}
        image="/assets/i6.jpg"
        badge="Skill-by-skill scoring"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <IconCardGrid
            items={[
              {
                title: "Diagnostic",
                body: "Find the starting point. Adaptive difficulty keeps struggling students encouraged and strong students challenged.",
                icon: <IconDiagnostic />,
              },
              {
                title: "Assessment",
                body: "Check understanding after teaching. Track which sub-skills moved from gap to developing to mastered.",
                icon: <IconExam />,
              },
              {
                title: "Test & exam",
                body: "Timed structures that mirror school pressure while still scoring discrete skills for follow-up.",
                icon: <IconTarget />,
              },
              {
                title: "Retesting",
                body: "After a lesson + practice dose, retest the specific skill — efficient updates without repeating everything.",
                icon: <IconChart />,
              },
            ]}
          />
        </div>
      </section>

      <SplitShowcase
        eyebrow="Why it matters"
        title="One score hides the story"
        body="A student can look ‘average’ overall while carrying a critical gap in fractions or grammar. Bridgitus surfaces the exact skill so teaching stays precise."
        bullets={[
          "Adaptive pathways per student",
          "Gaps named specifically for tutors and parents",
          "Results that update the Learning Passport instantly",
        ]}
        image="/assets/i4.jpg"
        imageLeft
      />

      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
