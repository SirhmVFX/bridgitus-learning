import Image from "next/image";
import Link from "next/link";
import { SectionEyebrow } from "./SectionEyebrow";
import { BRAND } from "@/lib/marketingContent";

const PHONE_DISPLAY = "+61 433 600 592";
const PHONE_HREF = `tel:${BRAND.phone}`;

export default function MarketingCta({
  title = "Book the free diagnostic and see where your child really stands",
  body = "Ninety minutes, marked by a subject teacher, followed by a straight conversation about what would help. Term 4 groups are filling now.",
  primaryHref = PHONE_HREF,
  primaryLabel = `Call ${PHONE_DISPLAY}`,
  secondaryHref = `mailto:${BRAND.email}`,
  secondaryLabel = "Email admissions",
  image = "/assets/i12.jpg",
}: {
  title?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src={image} alt="" fill className="object-cover object-center" priority={false} />
        <div className="absolute inset-0 bg-[#001233]/82" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001233]/95 via-[#001233]/75 to-[#001233]/45" />
      </div>

      <div className="mkt-container relative py-16 md:py-24">
        <SectionEyebrow>Enrolments open</SectionEyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.65rem]">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-[17px]">
          {body}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-full bg-[#C4A574] px-6 py-3.5 text-sm font-semibold text-[#001233] transition hover:bg-[#d4b88a]"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
