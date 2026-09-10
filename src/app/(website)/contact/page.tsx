import type { Metadata } from "next";
import { getSiteContent } from "@/lib/firestore";
import ContactForm from "./_ContactForm";
import PageHero, { SplitShowcase } from "@/components/marketing/PageHero";
import {
  IconMail,
  IconPhone,
  IconSpark,
} from "@/components/marketing/MarketingIcons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Bridgitus Learning — ask about the Smart Learning Passport, tutoring plans, NAPLAN & Selective prep, or book a diagnostic.",
};

const DEFAULTS = {
  email: "info@bridgitus.com",
  phone: "+61 433 600 592",
  altPhone: "0434742393",
};

export default async function Contact() {
  let ci = DEFAULTS;
  try {
    const d = await getSiteContent("contact_info");
    if (d) {
      const raw = d as Partial<typeof DEFAULTS>;
      ci = {
        ...DEFAULTS,
        ...raw,
        email: typeof raw.email === "string" && raw.email.trim() ? raw.email : DEFAULTS.email,
        phone: typeof raw.phone === "string" && raw.phone.trim() ? raw.phone : DEFAULTS.phone,
        altPhone:
          typeof raw.altPhone === "string" && raw.altPhone.trim()
            ? raw.altPhone
            : DEFAULTS.altPhone,
      };
    }
  } catch (err) {
    console.error("contact_info load failed:", err);
  }

  const cards = [
    {
      label: "Email",
      value: ci.email,
      href: `mailto:${ci.email}`,
      icon: <IconMail />,
    },
    {
      label: "Phone",
      value: ci.phone,
      href: `tel:${ci.phone?.replace(/\s/g, "")}`,
      icon: <IconPhone />,
    },
    {
      label: "Alternate phone",
      value: ci.altPhone,
      href: ci.altPhone ? `tel:${ci.altPhone?.replace(/\s/g, "")}` : undefined,
      icon: <IconPhone />,
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Let’s map your child’s next step"
        subtitle="Ask about diagnostics, the Smart Learning Passport, tutoring plans, or NAPLAN & Selective prep."
        crumbs={[{ href: "/contact", label: "Contact" }]}
        image="/assets/i12.jpg"
        badge="We reply quickly"
      />

      <section id="contact" className="mkt-section">
        <div className="mkt-container max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {cards.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-[#001233]/10 bg-white p-6 text-center shadow-[0_10px_30px_-18px_rgba(0,18,51,0.2)]"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8eef8] text-[#00369b]">
                  {c.icon}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#00369b]">
                  {c.label}
                </p>
                {c.href && c.value ? (
                  <a
                    href={c.href}
                    className="mt-2 block text-sm font-medium text-[#001233] hover:text-[#00c1ff] transition"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-[#001233]/40 italic">Not set</p>
                )}
              </div>
            ))}
          </div>
          <ContactForm />
        </div>
      </section>

      <SplitShowcase
        eyebrow="What to expect"
        title="A clear next step — not a sales pitch"
        body="Tell us your child’s year level, subjects, and goals. We’ll suggest a diagnostic, Passport-only, or tutoring plan that fits."
        bullets={[
          "Free diagnostic pathway for new families",
          "Passport-only or full tutoring options",
          "NAPLAN & Selective guidance on request",
        ]}
        image="/assets/i8.jpg"
        imageLeft
      >
        <div className="mt-6 flex items-center gap-3 text-sm text-[#64748b]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4A574]/15 text-[#C4A574]">
            <IconSpark />
          </span>
          Most families hear back within one business day.
        </div>
      </SplitShowcase>
    </div>
  );
}
