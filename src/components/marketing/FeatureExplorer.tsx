"use client";

import Link from "next/link";
import { PLATFORM_FEATURES } from "@/lib/marketingContent";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

export default function FeatureExplorer({
  limit,
  title = "Everything Bridgitus provides for students",
  subtitle = "From diagnostics and live tutoring to NAPLAN, Selective Entry, AI practice, analytics, and the Smart Learning Passport — one connected learning system.",
}: {
  limit?: number;
  title?: string;
  subtitle?: string;
}) {
  const items = limit ? PLATFORM_FEATURES.slice(0, limit) : PLATFORM_FEATURES;

  return (
    <section className="mkt-section bg-[#001233] text-white">
      <div className="mkt-container">
        <Reveal>
          <p className="mkt-eyebrow mkt-eyebrow-light">Platform</p>
          <h2 className="mkt-display mt-3 text-3xl md:text-5xl max-w-3xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-white/65 text-lg leading-relaxed">{subtitle}</p>
        </Reveal>

        <Stagger className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3 bg-white/10 border border-white/10 overflow-hidden rounded-2xl">
          {items.map((f) => (
            <StaggerItem key={f.slug}>
              <Link
                href={f.href}
                className="group block h-full bg-[#001233] p-6 md:p-8 transition hover:bg-[#00369b]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00c1ff]">
                  {f.slug.replace(/-/g, " ")}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/65 leading-relaxed group-hover:text-white/85">
                  {f.body}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-[#00c1ff] opacity-0 transition group-hover:opacity-100">
                  Learn more →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
