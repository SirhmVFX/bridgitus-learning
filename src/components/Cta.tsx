import Link from "next/link";
import { getSiteContent } from "@/lib/firestore";

const DEFAULTS = {
  heading: "Every class is an opportunity to succeed.",
  subheading: "Ready to take the first step? Register today and start your learning journey.",
  buttonLabel: "Get Started",
  buttonHref: "/register",
};

async function Cta() {
  let c = DEFAULTS;
  try {
    const d = await getSiteContent("cta");
    if (d) c = { ...DEFAULTS, ...(d as typeof DEFAULTS) };
  } catch { }

  return (
    <section className="py-16 sm:py-20 bg-secondary-color">
      <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6 text-center flex flex-col items-center gap-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-white max-w-2xl leading-tight">{c.heading}</h2>
        <p className="text-white/70 text-base sm:text-lg max-w-xl">{c.subheading}</p>
        <Link href={c.buttonHref}
          className="inline-block bg-white text-secondary-color font-bold px-8 py-4 text-sm sm:text-base hover:bg-white/90 transition-colors">
          {c.buttonLabel}
        </Link>
      </div>
    </section>
  );
}

export default Cta;
