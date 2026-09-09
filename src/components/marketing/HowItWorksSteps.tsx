import Image from "next/image";
import { SectionEyebrow } from "./SectionEyebrow";

const STEPS = [
  {
    n: "01",
    image: "/assets/i6.jpg",
    title: "Sit a free diagnostic",
    body: "Ninety minutes, marked by a subject teacher, showing exactly which topics are shaky and which are solid.",
  },
  {
    n: "02",
    image: "/assets/i12.jpg",
    title: "Agree the plan together",
    body: "We map the gaps against the syllabus, set a target band, and place your child in the group that matches it.",
  },
  {
    n: "03",
    image: "/assets/i8.jpg",
    title: "Start weekly classes",
    body: "Teaching begins the following week. Your first written report lands five weeks later, marks included.",
  },
];

export default function HowItWorksSteps() {
  return (
    <section className="bg-[#f7f8fa]">
      <div className="mkt-container py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow align="center">How it works</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#001233] md:text-[2.35rem]">
            Three steps from first call to first report
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#64748b]">
            No contracts and no enrolment fee. If the fit is wrong after four weeks, we will say so
            first.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col items-center text-center">
              <div className="relative w-full max-w-[280px]">
                <div className="overflow-hidden rounded-t-[999px]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    width={560}
                    height={700}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-[#001233] text-sm font-semibold text-[#C4A574] shadow-lg">
                  {s.n}
                </div>
              </div>
              <h3 className="mt-10 text-lg font-bold text-[#001233]">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#64748b]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
