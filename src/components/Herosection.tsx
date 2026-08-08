import Image from "next/image";
import Button from "./Button";
import { getSiteContent } from "@/lib/firestore";

const DEFAULTS = {
  heading: "Bridging Curiosity and Confidence —",
  headingHighlight: "One Student at a Time",
  subheading: "Personalized online tutoring designed to unlock every learner's potential.",
  image: "/assets/i6.jpg",
  bgPattern: "https://res.cloudinary.com/dkeh0cumc/image/upload/v1755773371/Line2222_deiq0p.png",
};

async function HeroSection() {
  const data = await getSiteContent("hero").catch(() => null);
  const c = { ...DEFAULTS, ...(data ?? {}) } as typeof DEFAULTS;

  return (
    <section className="flex justify-center items-center min-h-screen relative overflow-hidden">
      {c.bgPattern && (
        <Image src={c.bgPattern} alt="" fill className="object-cover z-0 opacity-20" priority={false} />
      )}
      <div className="w-full max-w-[1250px] mx-auto flex md:flex-row flex-col md:items-center px-4 md:px-6 md:h-screen py-20 md:py-0 relative gap-8 lg:gap-10 z-10">
        <div className="w-full md:w-1/2 flex flex-col gap-5 py-8 md:py-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold pt-10 md:pt-14 leading-tight">
            {c.heading}{" "}
            <span className="text-blue-400">{c.headingHighlight}</span>
          </h1>
          <p className="text-black/50 text-base lg:text-lg">{c.subheading}</p>
          <div className="flex flex-wrap gap-4">
            <Button style="link" href="/register">Get Started</Button>
            <Button style="link" href="/about" variant="outline">Learn More</Button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image src={c.image} alt="hero" width={1000} height={1000}
            className="w-full h-64 sm:h-80 md:h-full object-cover" priority />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
