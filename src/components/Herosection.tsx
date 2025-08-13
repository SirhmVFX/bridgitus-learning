import Image from "next/image";
import Button from "./Button";

function HeroSection() {
  return (
    <section className="bg-black h-screen relative">
      <Image
        src="https://res.cloudinary.com/dkeh0cumc/image/upload/v1754926933/Line_rjqzxi.png"
        alt="hero"
        width={1000}
        height={1000}
        className="w-full h-full object-cover absolute top-0 left-0 z-0"
      />
      <div className="md:w-[1000px] md:mx-auto flex justify-between md:items-center py-20 md:py-0 px-4 md:px-0 h-full relative">
        <div className="md:w-2/3 flex flex-col gap-5 z-10 py-16 md:py-0">
          {/* <div className="p-1 bg-white/30 flex items-center gap-2 w-fit rounded-full border border-white/20 animate-pulse hover:animate-none hover:border-white/40 transition-all duration-300">
            <div className="bg-white/30 rounded-full px-2 py-1">
              <p className="text-[8px] md:text-xs text-white">🎉 New</p>
            </div>
            <h1 className="text-white md:text-sm text-[8px]">Bridgiton is tailoring tutoring for students who are ready to thrive. 🔥</h1>
            <ArrowRightIcon />
          </div> */}

          <h1 className="text-white md:text-5xl text-5xl font-bold">
            Bridging Curiosity and Confidence —{" "}
            <span className="text-yellow-400">One Student at a Time</span>
          </h1>
          <p className="text-white/50 text-lg">
            Personalized online tutoring designed to unlock every learner’s
            potential.
          </p>

          <div className="flex gap-5">
            <Button type="link" href="/register">
              Get Started
            </Button>
            <Button type="link" href="/about" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        <div className=" absolute top-0 left-0 right-0 bottom-0 flex justify-end ">
          <div className="w-[50%] h-[90%] relative">
            <div className="bg-gradient-to-r from-[#000000] to-[#16161600] absolute top-0 left-0 right-0 bottom-0"></div>
            <div className="bg-gradient-to-t from-[#000000] to-[#16161600] absolute top-[50%] left-0 right-0 bottom-0"></div>
            <Image
              src="/assets/i6.jpg"
              alt="hero"
              width={1000}
              height={1000}
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
