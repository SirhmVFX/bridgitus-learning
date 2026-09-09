import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import { SUBJECTS } from "@/lib/marketingContent";
import {
  IconChart,
  IconDiagnostic,
  IconExam,
  IconSpark,
} from "@/components/marketing/MarketingIcons";

const EXTRA: Record<
  string,
  { seo: string; points: string[]; image: string; badge: string }
> = {
  mathematics: {
    seo: "Online maths tutoring and diagnostics with Bridgitus — number, measurement, algebra, problem-solving, and passport-tracked mastery.",
    points: [
      "Skill diagnostics across number, measurement, geometry, and problem-solving",
      "Gap-focused lessons (e.g. long division with remainders, reading scales)",
      "Practice sets with scaffolded hints — not answer dumps",
      "NAPLAN numeracy and selective maths pathways available",
    ],
    image: "/assets/i6.jpg",
    badge: "Number → Extension",
  },
  english: {
    seo: "Online English tutoring with Bridgitus — comprehension, grammar, writing, and persuasive techniques with measurable progress.",
    points: [
      "Comprehension and main-idea mastery tracking",
      "Grammar gaps flagged precisely (e.g. possessive vs plural apostrophes)",
      "Writing and persuasive technique practice",
      "Passport goals that keep weekly focus tight",
    ],
    image: "/assets/i4.jpg",
    badge: "Reading · Writing · Craft",
  },
  science: {
    seo: "Online science tutoring with Bridgitus — inquiry skills, concepts, and experiments with diagnostic-led learning.",
    points: [
      "Scientific inquiry and hypothesis skills",
      "Concept mastery with interactive activities",
      "Above-level stretch when diagnostics show readiness",
      "Clear parent reporting on strengths and next steps",
    ],
    image: "/assets/i9.jpg",
    badge: "Inquiry · Concepts",
  },
};

type Props = { params: Promise<{ subject: string }> };

export async function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  const s = SUBJECTS.find((x) => x.slug === subject);
  if (!s) return { title: "Subject" };
  return {
    title: `${s.title} Tutoring & Diagnostics`,
    description: EXTRA[subject]?.seo ?? s.body,
  };
}

export default async function SubjectPage({ params }: Props) {
  const { subject } = await params;
  const s = SUBJECTS.find((x) => x.slug === subject);
  if (!s) notFound();
  const extra = EXTRA[subject];

  return (
    <div>
      <PageHero
        eyebrow="Subject"
        title={`${s.title} that maps every skill`}
        subtitle={s.body}
        crumbs={[
          { href: "/features", label: "Features" },
          { href: `/subjects/${s.slug}`, label: s.title },
        ]}
        image={extra?.image ?? "/assets/i12.jpg"}
        badge={extra?.badge}
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233]">What students practise</h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Bridgitus {s.title.toLowerCase()} support combines live tutoring, assessments,
            materials, and the Smart Learning Passport.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={(extra?.points ?? []).map((p, i) => ({
                title: ["Diagnose", "Teach", "Practise", "Prove"][i] ?? `Focus ${i + 1}`,
                body: p,
                icon:
                  i === 0 ? (
                    <IconDiagnostic />
                  ) : i === 1 ? (
                    <IconSpark />
                  ) : i === 2 ? (
                    <IconExam />
                  ) : (
                    <IconChart />
                  ),
              }))}
            />
          </div>
        </div>
      </section>

      <SplitShowcase
        eyebrow="Connected learning"
        title={`${s.title} progress you can see`}
        body="Skill-level diagnostics feed the passport. Tutors teach the gaps. Parents get plain-language updates."
        image={extra?.image ?? "/assets/i8.jpg"}
        imageLeft
      />

      <MarketingCta primaryLabel={`Start ${s.title} learning`} />
    </div>
  );
}
