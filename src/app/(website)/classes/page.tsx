import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import { getPublishedClasses, type SiteClass } from "@/lib/firestore";
import PageHero, {
  AudienceStrip,
  IconCardGrid,
  SplitShowcase,
} from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconBook,
  IconExam,
  IconLive,
  IconStudents,
  IconTarget,
  IconTutor,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Classes & Programs",
  description:
    "Bridgitus classes for every stage — regular tutoring, specialist Maths/English/Science, HSC, VCE, scholarship and college prep.",
};

const FALLBACK: SiteClass[] = [
  {
    id: "1",
    title: "Regular Tutoring",
    grades: "All grades",
    description: "Ongoing weekly sessions covering all core subjects.",
    subjects: ["Maths", "English", "Science"],
    type: "one-on-one",
    published: true,
    order: 0,
  },
  {
    id: "2",
    title: "Special Math Class",
    grades: "K–12",
    description: "Intensive maths coaching from foundational to advanced levels.",
    subjects: ["Maths", "Statistics", "Calculus"],
    type: "one-on-one",
    published: true,
    order: 1,
  },
  {
    id: "3",
    title: "Special Science Class",
    grades: "7–12",
    description: "Deep-dive science sessions covering Physics, Chemistry and Biology.",
    subjects: ["Physics", "Chemistry", "Biology"],
    type: "one-on-one",
    published: true,
    order: 2,
  },
  {
    id: "4",
    title: "Special English Class",
    grades: "K–12",
    description: "Build reading, writing and comprehension skills.",
    subjects: ["English", "Literature", "Writing"],
    type: "one-on-one",
    published: true,
    order: 3,
  },
  {
    id: "5",
    title: "HSC Class",
    grades: "11–12",
    description: "Targeted HSC preparation with past paper practice.",
    subjects: ["All HSC subjects"],
    type: "group",
    published: true,
    order: 4,
  },
  {
    id: "6",
    title: "VCE Class",
    grades: "11–12",
    description: "Comprehensive VCE coaching aligned to the curriculum.",
    subjects: ["All VCE subjects"],
    type: "group",
    published: true,
    order: 5,
  },
  {
    id: "7",
    title: "Scholarship Preparatory Class",
    grades: "K–10",
    description: "Structured preparation for ACER, Edutest and scholarship exams.",
    subjects: ["Maths", "English", "Reasoning"],
    type: "group",
    published: true,
    order: 6,
  },
  {
    id: "8",
    title: "College Preparatory Class",
    grades: "9–12",
    description: "University readiness coaching — ATAR and applications.",
    subjects: ["All subjects", "Study Skills"],
    type: "one-on-one",
    published: true,
    order: 7,
  },
];

const ANCHORS: Record<string, string> = {
  "Regular Tutoring": "regular",
  "Special Math Class": "special-math",
  "Special Science Class": "special-science",
  "Special English Class": "english",
  "HSC Class": "hsc",
  "VCE Class": "vce",
  "Scholarship Preparatory Class": "scholarship",
  "College Preparatory Class": "college",
};

const CLASS_IMAGES = [
  "/assets/i2.jpg",
  "/assets/i3.jpg",
  "/assets/i4.jpg",
  "/assets/i5.jpg",
  "/assets/i6.jpg",
  "/assets/i8.jpg",
  "/assets/i9.jpg",
  "/assets/i11.jpg",
];

export default async function ClassesPage() {
  let classes: SiteClass[] = [];
  try {
    classes = await getPublishedClasses();
  } catch {
    /* fallback */
  }
  if (classes.length === 0) classes = FALLBACK;

  return (
    <div>
      <PageHero
        eyebrow="Classes"
        title="Programs for every learning stage"
        subtitle="From foundations to HSC, VCE, scholarship and college prep — with agendas driven by real diagnostic data."
        crumbs={[{ href: "/classes", label: "Classes" }]}
        image="/assets/i6.jpg"
        badge="1:1 & small groups"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">
            How every class is designed
          </h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Same Bridgitus system whether you choose 1:1 or a small group — diagnose, teach,
            practise, prove.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Diagnostic-first",
                  body: "We don’t guess the agenda — assessments flag exact skills to close.",
                  icon: <IconTarget />,
                },
                {
                  title: "Live expert teaching",
                  body: "Tutors follow passport priorities so every minute counts.",
                  icon: <IconLive />,
                },
                {
                  title: "Curriculum-aligned",
                  body: "ACARA, Common Core, IGCSE, and British pathways supported.",
                  icon: <IconBook />,
                },
                {
                  title: "Exam pathways",
                  body: "HSC, VCE, scholarship, NAPLAN, and Selective Entry options.",
                  icon: <IconExam />,
                },
                {
                  title: "Small groups",
                  body: "Up to 4 students with peer motivation and personalised plans.",
                  icon: <IconStudents />,
                },
                {
                  title: "1:1 intensive",
                  body: "Exclusive tutor attention for gaps, acceleration, or exam crunch.",
                  icon: <IconTutor />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section id="classes" className="mkt-section bg-[#f7f8fa]">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">Browse programs</h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            Pick a pathway — we’ll refine it after a free diagnostic.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {classes.map((c, idx) => {
              const anchor =
                ANCHORS[c.title] ?? c.title.toLowerCase().replace(/\s+/g, "-");
              const img = c.image || CLASS_IMAGES[idx % CLASS_IMAGES.length];
              return (
                <article
                  key={c.id}
                  id={anchor}
                  className="flex flex-col gap-3 rounded-2xl border border-[#001233]/10 bg-white overflow-hidden scroll-mt-36 shadow-[0_10px_30px_-18px_rgba(0,18,51,0.2)]"
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/40 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-md bg-[#00369b] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {c.type === "group" ? "Group" : c.type === "online" ? "Online" : "1:1"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 p-5 pt-1 flex-1">
                    <h2 className="font-semibold text-lg text-[#001233] leading-tight">
                      {c.title}
                    </h2>
                    {c.grades && (
                      <p className="text-xs font-medium text-[#00369b]">Grades: {c.grades}</p>
                    )}
                    <p className="text-sm text-[#64748b] leading-relaxed flex-1">
                      {c.description}
                    </p>
                    {c.subjects && c.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {c.subjects.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-[#e8eef8] text-[#001233]/70 px-2 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button style="link" href="/register">
                      Book now
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <AudienceStrip
        title="Choose your class format"
        items={[
          {
            title: "Group classes",
            body: "Up to 4 students, 60-minute sessions, personalised programs with peer motivation.",
            icon: <IconStudents className="h-7 w-7 text-[#00369b]" />,
            tint: "bg-[#e8eef8] text-[#00369b]",
          },
          {
            title: "1:1 classes",
            body: "Exclusive tutor attention for intensive learning, exam prep, or specific challenges.",
            icon: <IconTutor className="h-7 w-7 text-[#00369b]" />,
            tint: "bg-[#e8eef8] text-[#00369b]",
          },
          {
            title: "Exam pathways",
            body: "HSC, VCE, scholarship, NAPLAN, and Selective Entry — structured and timed.",
            icon: <IconExam className="h-7 w-7 text-[#C4A574]" />,
            tint: "bg-[#C4A574]/15 text-[#C4A574]",
          },
        ]}
      />

      <SplitShowcase
        eyebrow="Curriculum standards"
        title="Aligned to the frameworks schools use"
        body="Whether your child follows Australian Curriculum, Common Core, IGCSE, or British pathways — agendas stay curriculum-honest."
        bullets={[
          "Australian Curriculum (ACARA)",
          "Common Core · IGCSE · British Curriculum",
          "NAPLAN & Selective Entry prep available",
        ]}
        image="/assets/i10.jpg"
      >
        <p className="mt-6 text-sm text-[#64748b]">
          Also explore{" "}
          <Link href="/naplan" className="mkt-link">
            NAPLAN prep
          </Link>{" "}
          and{" "}
          <Link href="/selective-entry" className="mkt-link">
            Selective Entry
          </Link>
          .
        </p>
      </SplitShowcase>

      <MarketingCta
        title="Not sure which class is right?"
        body="Register and we’ll match your child after a free diagnostic assessment."
        primaryLabel="Get a free assessment"
        image="/assets/i12.jpg"
      />
    </div>
  );
}
