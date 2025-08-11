import Image from "next/image";
import Button from "./Button";
import { ArrowRightIcon } from "./Icons";

function HeroSection() {
  return (
    <section className="bg-black h-screen relative">
    <Image src="/assets/line.png" alt="hero" width={1000} height={1000} className="w-full h-full object-cover absolute top-0 left-0 z-0" />
      <div className="md:w-[1200px] md:mx-auto flex justify-between md:items-center py-20 md:py-0 px-4 md:px-0 h-full">
        <div className="md:w-1/2 flex flex-col gap-5">
          <div className="p-1 bg-white/30 flex items-center gap-2 w-fit rounded-full border border-white/20 animate-pulse hover:animate-none hover:border-white/40 transition-all duration-300">
            <div className="bg-white/30 rounded-full px-2 py-1">
              <p className="text-[8px] md:text-xs text-white">🎉 New</p>
            </div>
            <h1 className="text-white md:text-sm text-[8px]">Bridgiton is tailoring tutoring for students who are ready to thrive. 🔥</h1>
            <ArrowRightIcon />
          </div>

          <h1 className="text-white md:text-6xl text-5xl">
            Bridging Curiosity and Confidence — One Student at a Time
          </h1>
          <p className="text-white/50 text-lg">
            Personalized online tutoring designed to unlock every learner’s
            potential.
          </p>

          <div className="flex gap-5">
          <Button type="button">Get Started</Button>
          <Button type="button" variant="outline">Learn More</Button>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}

export default HeroSection;
