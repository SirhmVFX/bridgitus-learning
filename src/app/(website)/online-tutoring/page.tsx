import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { IconCardGrid, SplitShowcase } from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconLive,
  IconPassport,
  IconStudents,
  IconTutor,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Online Tutoring",
  description:
    "Personalised online tutoring with Bridgitus — live sessions guided by Smart Learning Passport priorities across Maths, English, Science, HSC, VCE, and more.",
};

export default function OnlineTutoringPage() {
  return (
    <div>
      <PageHero
        eyebrow="Live learning"
        title="Online tutoring that starts from evidence"
        subtitle="Expert tutors teach the exact skills your child’s passport flags — then retest until mastery sticks."
        crumbs={[{ href: "/online-tutoring", label: "Online tutoring" }]}
        image="/assets/i8.jpg"
        badge="Named tutors · Clear agendas"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <IconCardGrid
            items={[
              {
                title: "Live online sessions",
                body: "Scheduled tutoring with objectives driven by diagnostic data.",
                icon: <IconLive />,
              },
              {
                title: "Qualified subject tutors",
                body: "Classroom-trained specialists placed only in their own subject.",
                icon: <IconTutor />,
              },
              {
                title: "Passport included",
                body: "Premium plans include the Smart Learning Passport as the proof layer.",
                icon: <IconPassport />,
              },
              {
                title: "Small groups or 1:1",
                body: "Cap sizes that keep every learner visible — never lost in a crowd of thirty.",
                icon: <IconStudents />,
              },
            ]}
          />
        </div>
      </section>

      <SplitShowcase
        eyebrow="Pathways"
        title="From foundations to HSC & VCE"
        body="Curriculum-aligned teaching in Maths, English, and Science, plus specialist pathways including scholarship and college prep."
        bullets={[
          "Regular and specialist subject classes",
          "HSC and VCE preparation",
          "Portal access for assignments, assessments, and materials",
        ]}
        image="/assets/i12.jpg"
        imageLeft
      >
        <div className="mt-6">
          <Link href="/classes" className="mkt-link">
            Browse all classes →
          </Link>
        </div>
      </SplitShowcase>

      <MarketingCta primaryHref="/register" primaryLabel="Book a tutoring plan" image="/assets/i12.jpg" />
    </div>
  );
}
