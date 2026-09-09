"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionEyebrow } from "./SectionEyebrow";
import { BRAND } from "@/lib/marketingContent";

const FAQ_ITEMS = [
  {
    q: "What qualifications do your tutors hold?",
    a: "Every tutor holds a teaching qualification in the subject they teach, and most are currently working in schools. We do not place undergraduates in front of a class, and we do not ask a maths teacher to cover English.",
  },
  {
    q: "How large are the classes?",
    a: "Classes are capped at eight students so every learner gets real attention. Smaller groups mean nobody spends an hour quietly falling behind.",
  },
  {
    q: "Can we start partway through a term?",
    a: "Yes. After a free diagnostic we place your child in the group that matches their level, even mid-term, and catch them up on anything they have missed.",
  },
  {
    q: "Do you teach online as well as on campus?",
    a: "Yes. Weekday evenings, Saturday mornings, or fully online when sport and family get in the way — same tutors, same reporting either way.",
  },
  {
    q: "What happens if it is not working?",
    a: "No contracts and no enrolment fee. If the fit is wrong after four weeks, we will say so first and help you decide the next step honestly.",
  },
] as const;

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
        fill="#C4A574"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
        stroke="#C4A574"
        strokeWidth="1.6"
      />
      <path d="M4 7l8 6 8-6" stroke="#C4A574" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
        open
          ? "border-transparent bg-[#C4A574] text-[#001233]"
          : "border-[#C4A574] bg-white text-[#C4A574]"
      }`}
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d={open ? "M3.5 9L7 5.5 10.5 9" : "M3.5 5L7 8.5 10.5 5"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const PHONE_DISPLAY = "+61 433 600 592";
const PHONE_HREF = `tel:${BRAND.phone}`;
const EMAIL = BRAND.email;

export default function InteractiveFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white">
      <div className="mkt-container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-start">
          {/* Left: heading + CTA card */}
          <div>
            <SectionEyebrow>Questions</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#001233] md:text-[2.5rem]">
              Answered before you ask
            </h2>

            <div className="relative mt-10 overflow-hidden rounded-[1.75rem] bg-[#001233] p-7 md:p-8">
              <div
                className="pointer-events-none absolute -right-6 -top-4 h-28 w-28 rounded-full border border-[#C4A574]/25"
                aria-hidden
              />
              <h3 className="text-xl font-bold text-white">Still deciding?</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Book the free diagnostic. You will get a marked assessment and an honest
                conversation, with no obligation to enrol.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-2.5 text-sm font-medium text-[#C4A574] hover:text-[#d4b88a]"
                >
                  <PhoneIcon />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-2.5 text-sm font-medium text-[#C4A574] hover:text-[#d4b88a]"
                >
                  <MailIcon />
                  {EMAIL}
                </a>
              </div>
              <Link
                href="/register"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#C4A574] px-6 py-3.5 text-sm font-semibold text-[#001233] transition hover:bg-[#d4b88a] sm:w-auto"
              >
                Book a free assessment
              </Link>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="divide-y divide-[#e8ecf1] border-y border-[#e8ecf1]">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="py-1">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-[#001233] md:text-[17px]">
                      {item.q}
                    </span>
                    <Chevron open={isOpen} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-4 text-[15px] leading-relaxed text-[#64748b] md:pr-12">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
