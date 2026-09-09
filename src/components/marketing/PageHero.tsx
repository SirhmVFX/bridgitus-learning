"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  crumbs,
  image = "/assets/i12.jpg",
  badge,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: { href: string; label: string }[];
  image?: string;
  badge?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#001233] pt-28 md:pt-36 pb-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 10% 0%, #00c1ff44, transparent 45%), radial-gradient(ellipse at 90% 20%, #C4A57433, transparent 40%)",
        }}
      />
      {/* Decorative arcs */}
      <svg
        className="pointer-events-none absolute -right-16 top-10 hidden h-[420px] w-[420px] opacity-30 md:block"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden
      >
        {[80, 120, 160, 200].map((r, i) => (
          <circle
            key={r}
            cx="220"
            cy="180"
            r={r}
            stroke="#C4A574"
            strokeWidth={i === 1 ? 1.4 : 1}
            opacity={0.35 + i * 0.1}
          />
        ))}
      </svg>

      <div className="mkt-container relative grid items-end gap-10 pb-14 md:grid-cols-2 md:pb-16 lg:gap-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="pt-8"
        >
          {crumbs && crumbs.length > 0 && (
            <nav className="mb-4 flex flex-wrap gap-2 text-xs text-white/50">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              {crumbs.map((c) => (
                <span key={c.href} className="inline-flex items-center gap-2">
                  <span>/</span>
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <div className="flex items-center gap-2.5">
              <svg
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
                aria-hidden
              >
                <path
                  d="M1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9"
                  stroke="#C4A574"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[12px] font-semibold tracking-wide text-[#C4A574]">
                {eyebrow}
              </span>
            </div>
          )}
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative mx-auto w-full max-w-md md:mx-0 md:ml-auto"
        >
          <div className="relative overflow-hidden rounded-t-[2.5rem] rounded-b-[1.25rem] border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
            <Image
              src={image}
              alt=""
              width={800}
              height={640}
              className="aspect-[5/4] w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/50 to-transparent" />
          </div>
          {badge && (
            <div className="absolute -left-3 bottom-8 rounded-2xl bg-[#C4A574] px-4 py-3 text-sm font-semibold text-[#001233] shadow-lg md:-left-6">
              {badge}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function IconCardGrid({
  items,
}: {
  items: { title: string; body: string; icon: ReactNode }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.05 }}
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-[#001233]/8 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,18,51,0.25)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8eef8] text-[#00369b]">
            {item.icon}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#001233]">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
            {item.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function SplitShowcase({
  eyebrow,
  title,
  body,
  bullets,
  image,
  imageLeft = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  bullets?: string[];
  image?: string;
  imageLeft?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="mkt-section">
      <div
        className={`mkt-container grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${
          imageLeft ? "" : ""
        }`}
      >
        {image && (
          <motion.div
            initial={{
              opacity: 0,
              x: imageLeft ? -24 : 0,
              y: imageLeft ? 0 : 18,
            }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className={imageLeft ? "lg:order-1" : "lg:order-2"}
          >
            <div
              className="relative overflow-hidden rounded-[2rem]"
              style={{ borderRadius: "2rem 1rem 2rem 2rem" }}
            >
              <Image
                src={image}
                alt=""
                width={900}
                height={700}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#001233]/25 to-transparent" />
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className={imageLeft ? "lg:order-2" : "lg:order-1"}
        >
          {eyebrow && (
            <div className="flex items-center gap-2.5">
              <svg
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
                aria-hidden
              >
                <path
                  d="M1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9"
                  stroke="#C4A574"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[13px] font-medium text-[#C4A574]">
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#001233] md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#64748b]">
            {body}
          </p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-[#334155]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C4A574]/20 text-[#C4A574]">
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export function AudienceStrip({
  title = "Built for everyone in the journey",
  items,
}: {
  title?: string;
  items: { title: string; body: string; icon: ReactNode; tint: string }[];
}) {
  return (
    <section className="mkt-section bg-[#f7f8fa]">
      <div className="mkt-container">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight text-[#001233] md:text-4xl"
        >
          {title}
        </motion.h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl bg-white p-7 border border-[#001233]/6"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.tint}`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#001233]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
