import Image from "next/image";
import Link from "next/link";
import { SectionEyebrow } from "./SectionEyebrow";

const ARTICLES = [
  {
    image: "/assets/i12.jpg",
    date: "14 Aug",
    category: "Exam technique",
    title: "Why past papers only work if you mark them properly",
    excerpt:
      "Most students do the paper and check the answers. Here is the marking routine that actually moves a band.",
    href: "/guides/tutoring-that-proves-results",
  },
  {
    image: "/assets/i8.jpg",
    date: "02 Aug",
    category: "Study method",
    title: "The study timetable most Year 11 students get wrong",
    excerpt:
      "Long weekend blocks feel productive and rarely are. What our highest scorers do on a Tuesday night instead.",
    href: "/guides/understanding-learning-gaps",
  },
  {
    image: "/assets/i9.jpg",
    date: "21 Jul",
    category: "Pathways",
    title: "Choosing subjects for the degree, not for the mark",
    excerpt:
      "Scaling matters less than most families think. A short guide to picking Year 11 subjects with the end in mind.",
    href: "/guides/reading-progress-reports",
  },
];

export default function InsightsSection() {
  return (
    <section className="bg-[#f7f8fa]">
      <div className="mkt-container py-16 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow>Insights</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#001233] md:text-[2.35rem]">
              Notes from our teaching staff
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#64748b]">
              Practical writing on study method, exam technique and choosing a course — written by
              the people running the classes.
            </p>
          </div>
          <Link
            href="/guides"
            className="inline-flex shrink-0 items-center self-start rounded-full border border-[#001233] px-5 py-2.5 text-sm font-semibold text-[#001233] transition hover:bg-[#001233] hover:text-white md:self-auto"
          >
            Read all articles
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ARTICLES.map((a) => (
            <article
              key={a.title}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_-12px_rgba(0,18,51,0.15)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(0,18,51,0.25)]"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={a.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <span className="absolute bottom-3 left-3 rounded bg-[#C4A574] px-2.5 py-1 text-[11px] font-semibold text-[#001233]">
                  {a.date}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="text-xs font-semibold text-[#00369b]">{a.category}</p>
                <h3 className="mt-2 text-lg font-bold leading-snug text-[#001233]">{a.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748b]">{a.excerpt}</p>
                <Link
                  href={a.href}
                  className="mt-4 text-sm font-semibold text-[#00369b] transition group-hover:underline"
                >
                  Read the article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
