import type { Metadata } from "next";
import Link from "next/link";
import PageHero, {
  AudienceStrip,
  IconCardGrid,
  SplitShowcase,
} from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconDiagnostic,
  IconLive,
  IconPassport,
  IconStudents,
  IconTutor,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "How Our Classes Operate",
  description:
    "How Bridgitus one-on-one, group, and online classes work — diagnostics, live teaching, and passport tracking.",
};

export default function Training() {
  return (
    <main>
      <PageHero
        eyebrow="Training"
        title="Our classes and how they operate"
        subtitle="One system across formats: diagnose the gap, teach with intent, practise with purpose, prove mastery."
        crumbs={[{ href: "/Training", label: "Training" }]}
        image="/assets/i3.jpg"
        badge="Clear operating model"
      />

      <AudienceStrip
        title="Three ways to learn with us"
        items={[
          {
            title: "One-on-one classes",
            body: "Exclusive tutor attention for foundations, acceleration, or exam crunch — agendas from diagnostic data.",
            icon: <IconTutor className="h-7 w-7 text-[#00369b]" />,
            tint: "bg-[#e8eef8] text-[#00369b]",
          },
          {
            title: "Group classes",
            body: "Up to 4 students, peer motivation, and personalised academic programs in every session.",
            icon: <IconStudents className="h-7 w-7 text-[#00369b]" />,
            tint: "bg-[#e8eef8] text-[#00369b]",
          },
          {
            title: "Online classes",
            body: "Live sessions from home with materials, assignments, and passport updates in one portal.",
            icon: <IconLive className="h-7 w-7 text-[#C4A574]" />,
            tint: "bg-[#C4A574]/15 text-[#C4A574]",
          },
        ]}
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">
            What happens in a typical cycle
          </h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Whether 1:1 or group, every learner moves through the same Bridgitus loop.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "1. Diagnose",
                  body: "Adaptive assessments map exact skills — not one vague percentage.",
                  icon: <IconDiagnostic />,
                },
                {
                  title: "2. Teach live",
                  body: "Tutors follow passport priorities so session time isn’t wasted.",
                  icon: <IconLive />,
                },
                {
                  title: "3. Prove mastery",
                  body: "The Smart Learning Passport updates as gaps close and levels rise.",
                  icon: <IconPassport />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <SplitShowcase
        eyebrow="Ready to choose a format?"
        title="Browse programs or book a diagnostic"
        body="Not sure if 1:1 or group is right? Start with a free diagnostic — we’ll recommend the fit."
        bullets={[
          "All formats include passport tracking on Premium",
          "Curriculum-aligned agendas",
          "Parent-ready progress updates",
        ]}
        image="/assets/i6.jpg"
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/classes"
            className="inline-flex rounded-full bg-[#00369b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002a7a] transition"
          >
            View all classes
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex rounded-full border border-[#001233] px-5 py-2.5 text-sm font-semibold text-[#001233] hover:bg-[#001233] hover:text-white transition"
          >
            How it works
          </Link>
        </div>
      </SplitShowcase>

      <MarketingCta primaryLabel="Book a free diagnostic" image="/assets/i12.jpg" />
    </main>
  );
}
