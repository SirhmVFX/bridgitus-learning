import type { Metadata } from "next";
import Link from "next/link";
import PageHero, {
  IconCardGrid,
  SplitShowcase,
} from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconBook,
  IconExam,
  IconSpark,
  IconStudents,
  IconTarget,
  IconTutor,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Student Projects & Pathways",
  description:
    "See how Bridgitus students build mastery through guided projects, exam pathways, and real-world learning challenges.",
};

export default function Projects() {
  return (
    <div>
      <PageHero
        eyebrow="Projects"
        title="Learning that shows up in the real world"
        subtitle="Guided challenges, exam pathways, and mastery projects — so progress isn’t only a score on a worksheet."
        crumbs={[{ href: "/projects", label: "Projects" }]}
        image="/assets/i4.jpg"
        badge="Mastery in action"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">
            Pathways students actually work through
          </h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Every project ties back to passport gaps — practice with purpose, not busywork.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Skill mastery projects",
                  body: "Short challenges that prove a flagged skill is finally locked in.",
                  icon: <IconTarget />,
                },
                {
                  title: "Exam sprint pathways",
                  body: "Timed papers and review cycles for NAPLAN, Selective, HSC, and VCE.",
                  icon: <IconExam />,
                },
                {
                  title: "Reading & writing studios",
                  body: "Comprehension, composition, and feedback loops that build voice.",
                  icon: <IconBook />,
                },
                {
                  title: "STEM investigations",
                  body: "Problem-solving projects that connect maths and science to life.",
                  icon: <IconSpark />,
                },
                {
                  title: "Peer collaboration",
                  body: "Small-group challenges where students explain thinking out loud.",
                  icon: <IconStudents />,
                },
                {
                  title: "Tutor-guided portfolios",
                  body: "Evidence of growth parents can see — not just activity logs.",
                  icon: <IconTutor />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <SplitShowcase
        eyebrow="How it fits"
        title="Projects sit inside the Bridgitus system"
        body="Diagnostics flag the gap. Tutors set the agenda. Projects and practice close it. The Passport records the win."
        bullets={[
          "Linked to Smart Learning Passport priorities",
          "Feedback from expert tutors",
          "Visible milestones for parents",
        ]}
        image="/assets/i9.jpg"
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/smart-learning-passport"
            className="inline-flex rounded-full border border-[#001233] px-5 py-2.5 text-sm font-semibold text-[#001233] hover:bg-[#001233] hover:text-white transition"
          >
            Explore the Passport
          </Link>
          <Link
            href="/classes"
            className="inline-flex rounded-full bg-[#00369b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002a7a] transition"
          >
            Browse classes
          </Link>
        </div>
      </SplitShowcase>

      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
