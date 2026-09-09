"use client";

import Link from "next/link";
import { SUBJECTS } from "@/lib/marketingContent";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

export default function SubjectsStrip() {
  return (
    <section className="mkt-section">
      <div className="mkt-container">
        <Reveal>
          <p className="mkt-eyebrow">Core subjects</p>
          <h2 className="mkt-display mt-3 text-3xl md:text-4xl text-[#001233]">
            Maths. English. Science.
          </h2>
          <p className="mt-3 max-w-xl text-[#001233]/65">
            Curriculum-aligned foundations with skill-level diagnostics and passport tracking in
            every subject.
          </p>
        </Reveal>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {SUBJECTS.map((s, i) => (
            <StaggerItem key={s.slug}>
              <Link
                href={`/subjects/${s.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-[#001233] p-8 min-h-[220px] text-white"
              >
                <div
                  className={`absolute inset-0 opacity-40 transition group-hover:opacity-60 bg-gradient-to-br ${
                    i === 0
                      ? "from-[#00369b] to-transparent"
                      : i === 1
                        ? "from-[#00c1ff]/40 to-transparent"
                        : "from-[#00369b]/80 via-[#00c1ff]/20 to-transparent"
                  }`}
                />
                <div className="relative">
                  <h3 className="mkt-display text-2xl md:text-3xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">{s.body}</p>
                  <span className="mt-6 inline-block text-sm font-semibold text-[#00c1ff]">
                    Explore →
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
