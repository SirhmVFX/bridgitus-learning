"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";


const VIDEO_SRC = "/assets/video/hero-learning.mp4";
const POSTER = "/assets/i6.jpg";

const AVATARS = ["/assets/i6.jpg", "/assets/i8.jpg", "/assets/i12.jpg"];

const STRIP = [
  { kind: "avatars" as const, label: "2,400 families currently enrolled" },
  { kind: "stat" as const, value: "6:1", label: "Average class ratio across all programs" },
  { kind: "stat" as const, value: "94%", label: "Students improve a full band within two terms" },
  { kind: "stat" as const, value: "18", label: "Subject specialists, all classroom-trained" },
];

function GoldArcs() {
  return (
    <div
      className="pointer-events-none absolute -right-[8%] top-[8%] hidden h-[70%] w-[55%] lg:block"
      aria-hidden
    >
      <svg viewBox="0 0 600 600" className="h-full w-full" fill="none">
        {[180, 240, 300, 360, 420].map((r, i) => (
          <circle
            key={r}
            cx="320"
            cy="280"
            r={r}
            stroke="#C4A574"
            strokeWidth={i === 2 ? 1.4 : 1}
            opacity={0.18 + i * 0.04}
          />
        ))}
      </svg>
    </div>
  );
}

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduce) return;
    const play = () => {
      v.play().catch(() => {});
    };
    play();
    v.addEventListener("canplay", play);
    return () => v.removeEventListener("canplay", play);
  }, [reduce]);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#001233]">
      {/* Keep existing video background */}
      <div className="absolute inset-0">
        {!reduce && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            poster={POSTER}
            onLoadedData={() => setReady(true)}
            aria-hidden
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        )}
        {(reduce || !ready) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[#001233]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001233]/88 via-[#001233]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/90 via-transparent to-[#001233]/35" />
        <GoldArcs />
      </div>

      {/* Main copy */}
      <div className="relative z-10 flex flex-1 flex-col justify-center pt-32 pb-8 md:pt-36 md:pb-10">
        <div className="mkt-container w-full">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="flex items-center gap-2.5"
          >
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
              <path
                d="M1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9"
                stroke="#C4A574"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C4A574] sm:text-xs">
              Pathway to academic excellence
            </span>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18 }}
            className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            Every student has a pathway.
            <br />
            <span className="text-[#C4A574]">We help them find it.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
          >
            Small-group tutoring and one-to-one mentoring from Year 5 through to university entry —
            taught by subject specialists who track every result and report on it honestly.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/classes"
              className="inline-flex items-center gap-2 rounded-full bg-[#00369b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#002a7a]"
            >
              Explore our programs
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full border border-white px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Book a free assessment
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom stats strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="relative z-10 border-t border-white/10 bg-[#001233]/75 backdrop-blur-md"
      >
        <div className="mkt-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
            {STRIP.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-1 py-5 sm:px-4 md:py-6 ${
                  i > 0 ? "border-t border-white/10 sm:border-t-0" : ""
                } ${i === 1 ? "sm:border-l sm:border-white/10 lg:border-l-0" : ""} ${
                  i === 2 ? "border-t border-white/10 lg:border-t-0" : ""
                } ${i === 3 ? "border-t border-white/10 sm:border-l sm:border-white/10 lg:border-t-0 lg:border-l-0" : ""}`}
              >
                {item.kind === "avatars" ? (
                  <>
                    <div className="flex shrink-0 -space-x-2.5">
                      {AVATARS.map((src) => (
                        <div
                          key={src}
                          className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[#001233]"
                        >
                          <Image src={src} alt="" fill className="object-cover" sizes="36px" />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm font-medium leading-snug text-white">{item.label}</p>
                  </>
                ) : (
                  <>
                    <p className="shrink-0 text-2xl font-bold tracking-tight text-[#C4A574] md:text-3xl">
                      {item.value}
                    </p>
                    <p className="text-sm leading-snug text-white/90">{item.label}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
