"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "@/components/Icons";

interface Faq { id?: string; question: string; answer: string; order: number; published: boolean; }

export default function AboutClient({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq) => {
        const key = faq.id ?? faq.question;
        return (
          <div key={key} className="border-b border-black/20 pb-4">
            <button className="w-full flex items-center justify-between text-left gap-4 py-2"
              onClick={() => setOpen(open === key ? null : key)}>
              <h3 className="text-base sm:text-lg font-bold text-black leading-relaxed">{faq.question}</h3>
              {open === key ? <ChevronUp /> : <ChevronDown />}
            </button>
            {open === key && (
              <p className="text-base text-black/70 leading-relaxed mt-2 mb-4 italic">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
