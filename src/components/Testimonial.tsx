"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPublishedTestimonials, type SiteTestimonial } from "@/lib/firestore";

const FALLBACK: SiteTestimonial[] = [
  { id: "1", name: "Sarah M.", role: "Parent", quote: "Bridgitus Learning has transformed my daughter's approach to math. The personalized sessions made complex concepts so much easier!", rating: 5, published: true, order: 0 },
  { id: "2", name: "James L.", role: "Parent", quote: "The tutors are incredibly engaging and patient. My son looks forward to his science lessons every week!", rating: 5, published: true, order: 1 },
  { id: "3", name: "Emily R.", role: "Student", quote: "Thanks to Bridgitus, I aced my AP English exam. The one-on-one attention really helped me improve my writing skills.", rating: 5, published: true, order: 2 },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className={`w-4 h-4 ${i <= count ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`}>
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [items, setItems] = useState<SiteTestimonial[]>(FALLBACK);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getPublishedTestimonials()
      .then((data) => { if (data.length > 0) setItems(data); })
      .catch(() => { });
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  return (
    <section className="py-12 sm:py-16">
      <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6">
        {/* Grid for md+, carousel for mobile */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>

        {/* Mobile single-card carousel */}
        <div className="sm:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {items.map((t) => (
                <div key={t.id} className="w-full shrink-0">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots + arrows */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button onClick={prev}
              className="w-9 h-9 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Previous">
              ‹
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-secondary-color" : "bg-gray-300"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next}
              className="w-9 h-9 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Next">
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: SiteTestimonial }) {
  return (
    <div className="bg-white border border-gray-200 flex flex-col gap-3 p-6 sm:p-8">
      <Stars count={t.rating} />
      <p className="text-gray-600 leading-relaxed italic flex-1">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center gap-3 mt-2">
        {t.avatar ? (
          <Image src={t.avatar} alt={t.name} width={40} height={40}
            className="w-10 h-10 object-cover" />
        ) : (
          <div className="w-10 h-10 bg-secondary-color flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">{t.name[0]}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
          <p className="text-xs text-gray-500">{t.role}</p>
        </div>
      </div>
    </div>
  );
}
