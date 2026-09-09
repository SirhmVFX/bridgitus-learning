import Image from "next/image";
import Link from "next/link";
import { CheckIcon, SectionEyebrow } from "./SectionEyebrow";

const POINTS = [
  "Every tutor holds a teaching qualification and is placed only in their own subject.",
  "Classes capped at eight, so nobody spends an hour quietly falling behind.",
  "Written progress reports every five weeks, with the marks behind them.",
];

export default function WhoWeAre() {
  return (
    <section className="bg-white">
      <div className="mkt-container py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual */}
          <div className="relative mx-auto w-full max-w-[420px] lg:mx-0">
            {/* Gold arch outline behind */}
            <div
              className="pointer-events-none absolute -inset-x-3 -top-3 bottom-8 rounded-t-[999px] border border-[#C4A574]"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-t-[999px] rounded-b-none">
              <Image
                src="/assets/i12.jpg"
                alt="Students learning together at Bridgitus"
                width={840}
                height={1000}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            {/* Floating years card */}
            <div className="absolute -bottom-2 left-0 z-10 max-w-[220px] border-l-2 border-t border-[#C4A574] bg-white px-5 py-4 shadow-[0_12px_40px_-12px_rgba(0,18,51,0.35)] sm:max-w-[240px]">
              <p className="text-4xl font-bold text-[#001233]">12</p>
              <p className="mt-1 text-sm leading-snug text-[#001233]/75">
                Years teaching students in this city — and their younger siblings after them.
              </p>
            </div>
          </div>

          {/* Copy */}
          <div className="pt-8 lg:pt-0">
            <SectionEyebrow>Who we are</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#001233] md:text-[2.5rem]">
              A teaching institute, not a homework club
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#4a5568] md:text-[17px]">
              Bridgitus Learning was founded by classroom teachers who kept meeting bright students
              being failed by the pace of a class of thirty. We rebuilt the syllabus into small
              groups, gave every student a named tutor, and made progress something parents can
              actually see.
            </p>
            <ul className="mt-7 space-y-4">
              {POINTS.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-[#334155]">
                  <CheckIcon />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/how-it-works"
                className="inline-flex items-center rounded-full border border-[#001233] px-6 py-2.5 text-sm font-semibold text-[#001233] transition hover:bg-[#001233] hover:text-white"
              >
                See how we teach
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold text-[#001233] transition hover:text-[#00369b]"
              >
                Meet the team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
