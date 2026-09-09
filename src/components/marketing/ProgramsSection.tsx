import Image from "next/image";
import Link from "next/link";
import { SectionEyebrow } from "./SectionEyebrow";

const PROGRAMS = [
  {
    badge: "Mathematics",
    image: "/assets/i6.jpg",
    title: "Mathematics, Standard to Extension",
    body: "From fractions in Year 5 to calculus in Year 12, taught in the order the syllabus sets and revised until it sticks.",
    meta: [
      { icon: "clock", text: "2 hrs weekly" },
      { icon: "user", text: "Max 8 students" },
      { icon: "cal", text: "Years 5–12" },
      { icon: "report", text: "5-week reports" },
    ],
    price: "$58",
    href: "/subjects/mathematics",
  },
  {
    badge: "English",
    image: "/assets/i4.jpg",
    title: "English, Reading and Essay Craft",
    body: "Close reading, structured argument and timed writing — the three things that separate a Band 4 essay from a Band 6.",
    meta: [
      { icon: "clock", text: "2 hrs weekly" },
      { icon: "user", text: "Max 8 students" },
      { icon: "cal", text: "Years 7–12" },
      { icon: "draft", text: "Marked drafts" },
    ],
    price: "$58",
    href: "/subjects/english",
  },
  {
    badge: "Sciences",
    image: "/assets/i9.jpg",
    title: "Biology, Chemistry and Physics",
    body: "Concept first, then the past papers. Every module ends with a full practice exam marked against the real criteria.",
    meta: [
      { icon: "clock", text: "2.5 hrs weekly" },
      { icon: "user", text: "Max 6 students" },
      { icon: "cal", text: "Years 9–12" },
      { icon: "bank", text: "Past-paper bank" },
    ],
    price: "$66",
    href: "/subjects/science",
  },
];

function MetaIcon({ type }: { type: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#94a3b8",
    strokeWidth: 1.6,
    "aria-hidden": true as const,
  };
  switch (type) {
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
        </svg>
      );
    case "cal":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v13H7V3z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" strokeLinecap="round" />
        </svg>
      );
    case "draft":
      return (
        <svg {...common}>
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function ProgramsSection() {
  return (
    <section className="bg-[#f7f8fa]">
      <div className="mkt-container py-16 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow>Our programs</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#001233] md:text-[2.35rem]">
              Built around the exam your child is actually sitting
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#64748b]">
              Each program follows the official syllabus week by week, so what happens in our
              classroom lines up with what happens in theirs.
            </p>
          </div>
          <Link
            href="/classes"
            className="inline-flex shrink-0 items-center self-start rounded-full border border-[#001233] px-5 py-2.5 text-sm font-semibold text-[#001233] transition hover:bg-[#001233] hover:text-white md:self-auto"
          >
            View all programs
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PROGRAMS.map((p) => (
            <article
              key={p.badge}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_-12px_rgba(0,18,51,0.18)]"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image src={p.image} alt={p.badge} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                <span className="absolute left-3 top-3 rounded bg-[#001233] px-2.5 py-1 text-[11px] font-semibold text-white">
                  {p.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="text-lg font-bold leading-snug text-[#001233]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{p.body}</p>
                <ul className="mt-5 space-y-2.5">
                  {p.meta.map((m) => (
                    <li key={m.text} className="flex items-center gap-2.5 text-sm text-[#475569]">
                      <MetaIcon type={m.icon} />
                      {m.text}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between border-t border-[#eef1f5] pt-4 mt-6">
                  <p className="text-sm font-bold text-[#001233]">
                    {p.price} <span className="font-normal text-[#64748b]">/ session</span>
                  </p>
                  <Link href={p.href} className="text-sm font-semibold text-[#00369b] hover:underline">
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
