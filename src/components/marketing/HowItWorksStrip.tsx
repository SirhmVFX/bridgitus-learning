"use client";

import { HOW_IT_WORKS } from "@/lib/marketingContent";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

export default function HowItWorksStrip() {
  return (
    <section className="mkt-section">
      <div className="mkt-container">
        <Reveal>
          <p className="mkt-eyebrow">How it works</p>
          <h2 className="mkt-display mt-3 text-3xl md:text-4xl text-[#001233] max-w-xl">
            Diagnose. Map. Teach. Prove mastery.
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s) => (
            <StaggerItem key={s.step}>
              <div className="relative">
                <span className="mkt-display text-5xl text-[#00c1ff]/40">{s.step}</span>
                <h3 className="mt-2 text-xl font-semibold text-[#001233]">{s.title}</h3>
                <p className="mt-2 text-sm text-[#001233]/65 leading-relaxed">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
