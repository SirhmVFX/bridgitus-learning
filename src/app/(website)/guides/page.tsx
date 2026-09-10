import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";

export const metadata: Metadata = {
  title: "Learning Guides for Parents",
  description:
    "Practical Bridgitus guides for parents — understanding learning gaps, reading progress reports, and choosing tutoring that proves results.",
};

const GUIDES = [
  {
    href: "/guides/understanding-learning-gaps",
    title: "Understanding learning gaps",
    body: "Why small misunderstandings compound — and how skill-level diagnostics catch them early.",
    image: "/assets/i6.jpg",
    tag: "Diagnostics",
  },
  {
    href: "/guides/reading-progress-reports",
    title: "How to read a progress report",
    body: "What parents should look for beyond “working at expected level.”",
    image: "/assets/i8.jpg",
    tag: "Parents",
  },
  {
    href: "/guides/tutoring-that-proves-results",
    title: "Tutoring that proves results",
    body: "Hours vs outcomes — how the Smart Learning Passport changes the decision.",
    image: "/assets/i12.jpg",
    tag: "Outcomes",
  },
];

export default function GuidesIndexPage() {
  return (
    <div>
      <PageHero
        eyebrow="Guides"
        title="Clear answers for busy parents"
        subtitle="Short, practical articles drawn from how Bridgitus diagnoses, teaches, and proves mastery."
        crumbs={[{ href: "/guides", label: "Guides" }]}
        image="/assets/i9.jpg"
        badge="Written by teachers"
      />
      <section className="mkt-section bg-[#f7f8fa]">
        <div className="mkt-container grid gap-6 md:grid-cols-3">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-16px_rgba(0,18,51,0.25)] transition hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={g.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded bg-[#001233] px-2.5 py-1 text-[11px] font-semibold text-white">
                  {g.tag}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#001233]">{g.title}</h2>
                <p className="mt-2 text-sm text-[#64748b] leading-relaxed">{g.body}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-[#00369b]">
                  Read the article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <MarketingCta image="/assets/i12.jpg" />
    </div>
  );
}
