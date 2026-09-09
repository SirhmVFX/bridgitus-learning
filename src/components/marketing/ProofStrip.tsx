"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { Reveal } from "./Reveal";

const PROOF = [
  { label: "Skills mapped", value: "Skill-by-skill" },
  { label: "AI role", value: "Hints, not answers" },
  { label: "Parent report", value: "Under 2 minutes" },
  { label: "Diagnostic", value: "≤40 min / subject" },
];

function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="rounded-2xl border border-[#001233]/10 bg-white p-6 md:p-8 shadow-[0_30px_80px_-40px_rgba(0,18,51,0.45)]"
    >
      <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#00369b]">
        Why Bridgitus
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-[#001233]">
        You’re not buying hours. You’re buying a measurable learning journey.
      </h3>
      <p className="mt-3 text-[#001233]/65 leading-relaxed">
        Most tutoring sells time. Bridgitus sells evidence — gaps closed, outcomes mastered, and
        progress you can see term after term.
      </p>
      <Link href="/how-it-works" className="mkt-link mt-5 inline-block">
        How the system works →
      </Link>
    </motion.div>
  );
}

export default function ProofStrip() {
  return (
    <section className="mkt-section bg-[#e8eef8]">
      <div className="mkt-container grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <TiltCard />
        </Reveal>
        <Reveal delay={0.12}>
          <div className="grid grid-cols-2 gap-4">
            {PROOF.map((p) => (
              <div
                key={p.label}
                className="rounded-xl border border-[#001233]/8 bg-white/70 px-4 py-5 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-wider text-[#001233]/45">{p.label}</p>
                <p className="mt-2 text-lg font-semibold text-[#001233]">{p.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
