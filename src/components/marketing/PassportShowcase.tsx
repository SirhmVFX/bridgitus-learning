"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { PASSPORT_ELEMENTS } from "@/lib/marketingContent";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

const SAMPLE = {
  student: "Maya Thompson",
  year: "Year 5",
  id: "BSL-2026-04471",
  subjects: [
    { name: "Mathematics", pct: 78, note: "Year 5 — ahead in Number, focus on Measurement" },
    { name: "English", pct: 64, note: "Toward Year 5 — comprehension strong, grammar developing" },
    { name: "Science", pct: 82, note: "Above Year 5 — strong scientific inquiry" },
  ],
  gaps: ["Long division with remainders", "Reading measurement scales", "Possessive apostrophes"],
  goals: ["Complete 2 long division practice sets", "Score 80%+ on measurement retest"],
};

export default function PassportShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="mkt-section relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#00c1ff]/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#00369b]/10 blur-3xl" />
      <div className="mkt-container relative">
        <Reveal>
          <p className="mkt-eyebrow">Flagship product</p>
          <h2 className="mkt-display mt-3 text-3xl md:text-5xl text-[#001233] max-w-2xl">
            The Smart Learning Passport
          </h2>
          <p className="mt-4 max-w-2xl text-[#001233]/65 text-lg leading-relaxed">
            A living report card that updates itself — achievement levels, exact knowledge gaps,
            mastered outcomes, weekly goals, and a parent report you can read in two minutes.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-[#001233]/10 bg-white/80 p-5 md:p-7 shadow-[0_20px_60px_-30px_rgba(0,18,51,0.35)] backdrop-blur">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#001233]/8 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#00369b] font-semibold">
                    Learning Passport
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[#001233]">{SAMPLE.student}</p>
                  <p className="text-sm text-[#001233]/55">
                    {SAMPLE.year} · {SAMPLE.id}
                  </p>
                </div>
                <span className="rounded-md bg-[#00369b] px-3 py-1 text-xs font-semibold text-white">
                  Live sample
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {SAMPLE.subjects.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm font-medium text-[#001233]">
                      <span>{s.name}</span>
                      <span className="text-[#00369b]">{s.pct}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#001233]/8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#00369b] to-[#00c1ff]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-[#001233]/55">{s.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#001233]/45">
                    Knowledge gaps
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {SAMPLE.gaps.map((g) => (
                      <li key={g} className="text-sm text-[#001233]/80">
                        · {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#001233]/45">
                    This week’s goals
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {SAMPLE.goals.map((g) => (
                      <li key={g} className="text-sm text-[#001233]/80">
                        · {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Stagger className="space-y-2">
              {PASSPORT_ELEMENTS.map((el, i) => (
                <StaggerItem key={el.title}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                      active === i
                        ? "border-[#00c1ff] bg-[#00369b] text-white"
                        : "border-transparent bg-white/50 hover:border-[#001233]/10 text-[#001233]"
                    }`}
                  >
                    <p className="font-semibold">{el.title}</p>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        active === i ? "text-white/80" : "text-[#001233]/60"
                      }`}
                    >
                      {el.body}
                    </p>
                  </button>
                </StaggerItem>
              ))}
            </Stagger>
            <div className="mt-6">
              <Link href="/smart-learning-passport" className="mkt-link">
                See the full Passport story →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
