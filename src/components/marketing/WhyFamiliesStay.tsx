import Image from "next/image";
import { SectionEyebrow } from "./SectionEyebrow";

const FEATURES = [
  {
    title: "Teachers, not undergraduates",
    body: "Every tutor is qualified to teach the subject they teach, and most still work in schools.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001233" strokeWidth="1.6" aria-hidden>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />
      </svg>
    ),
  },
  {
    title: "Progress you can check",
    body: "A dashboard of every mark, attendance record and tutor note, updated the day it happens.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001233" strokeWidth="1.6" aria-hidden>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20V8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Terms that fit real life",
    body: "Weekday evenings, Saturday mornings, or online when sport and family get in the way.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001233" strokeWidth="1.6" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Scholarship preparation",
    body: "Dedicated coaching for selective entry and scholarship exams, run as a separate stream.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001233" strokeWidth="1.6" aria-hidden>
        <circle cx="12" cy="8" r="5" />
        <path d="M8.5 13L7 21l5-3 5 3-1.5-8" />
      </svg>
    ),
  },
];

export default function WhyFamiliesStay() {
  return (
    <section className="bg-white">
      <div className="mkt-container py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionEyebrow>Why families stay</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#001233] md:text-[2.35rem]">
              The difference shows up in the report, not the brochure
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#64748b]">
              We measure what we promise. Parents get the same data we use to plan the next term, in
              plain language.
            </p>
            <div className="mt-8 space-y-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 rounded-2xl border border-[#e8ecf1] bg-white px-4 py-4 transition hover:border-[#c5d0e0]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef2f7]">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#001233]">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748b]">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[480px] lg:mx-0 lg:ml-auto">
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: "120px 28px 120px 120px" }}
            >
              <Image
                src="/assets/i8.jpg"
                alt="Students studying together"
                width={900}
                height={1100}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -right-2 top-8 z-10 rounded-2xl bg-[#001233] px-5 py-4 text-center shadow-xl sm:right-4 sm:top-10">
              <p className="text-3xl font-semibold tracking-tight text-[#C4A574]">5 wks</p>
              <p className="mt-1 max-w-[110px] text-xs leading-snug text-white/90">
                between progress reports
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
