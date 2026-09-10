import type { Metadata } from "next";
import PageHero, {
  IconCardGrid,
  SplitShowcase,
} from "@/components/marketing/PageHero";
import FeatureExplorer from "@/components/marketing/FeatureExplorer";
import Why from "@/components/Why";
import Offer from "@/components/Offer";
import MarketingCta from "@/components/marketing/MarketingCta";
import { getSiteContent } from "@/lib/firestore";
import {
  IconAI,
  IconChart,
  IconDiagnostic,
  IconExam,
  IconLive,
  IconPassport,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Bridgitus online tutoring services: personalised teaching, Smart Learning Passport, assessments, NAPLAN & Selective prep, and parent-ready progress reporting.",
};

const DEFAULT_BADGES = [
  { label: "Boost Confidence" },
  { label: "Improve Marks" },
  { label: "Realise Potentials" },
];

export default async function Services() {
  let badges = DEFAULT_BADGES;
  try {
    const d = await getSiteContent("service_badges");
    if (d && Array.isArray((d as Record<string, unknown>).badges)) {
      badges = (d as { badges: typeof DEFAULT_BADGES }).badges;
    }
  } catch {
    /* keep defaults */
  }

  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="Personalised tutoring with measurable outcomes"
        subtitle="We bridge curiosity and confidence — with diagnostics, live teaching, and a passport that proves progress."
        crumbs={[{ href: "/services", label: "Services" }]}
        image="/assets/i9.jpg"
        badge="Outcomes you can see"
      />

      <section className="bg-[#001233]">
        <div className="mkt-container grid grid-cols-1 sm:grid-cols-3">
          {badges.map((b, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-6 ${
                i === 0 ? "bg-white/5" : i === 1 ? "bg-white/10" : "bg-white/15"
              }`}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C4A574]/20 text-[#C4A574] text-sm"
                aria-hidden
              >
                ✓
              </span>
              <span className="text-white font-medium">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">
            What we deliver every week
          </h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            A full learning system — diagnose, teach, practise, and prove — not disconnected
            worksheets.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Diagnostic assessments",
                  body: "Map exact skills so every session targets a real gap.",
                  icon: <IconDiagnostic />,
                },
                {
                  title: "Live online tutoring",
                  body: "Expert tutors with agendas driven by passport priorities.",
                  icon: <IconLive />,
                },
                {
                  title: "Smart Learning Passport",
                  body: "Levels, gaps, and goals that update as mastery grows.",
                  icon: <IconPassport />,
                },
                {
                  title: "AI-guided practice",
                  body: "Hints that prompt thinking — never completed answers.",
                  icon: <IconAI />,
                },
                {
                  title: "NAPLAN & Selective",
                  body: "Timed papers and domain drills aligned to the real exams.",
                  icon: <IconExam />,
                },
                {
                  title: "Parent-ready reports",
                  body: "Plain-language progress so you’re never left guessing.",
                  icon: <IconChart />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <Why />
      <Offer />

      <SplitShowcase
        eyebrow="Inside the platform"
        title="One portal for practice, sessions, and proof"
        body="Students open Bridgitus and find assessments, assignments, live sessions, materials, and the Smart Learning Passport — connected, not scattered."
        bullets={[
          "Curriculum-aligned materials matched to gaps",
          "Live session agendas from diagnostic data",
          "Analytics parents can read in two minutes",
        ]}
        image="/assets/i11.jpg"
      />

      <FeatureExplorer title="Services inside the Bridgitus platform" />
      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
