import Image from "next/image";
import Button from "./Button";

function HeroSection() {
  return (
    <section className="flex justify-center items-center h-screen relative">
      <Image
        src="https://res.cloudinary.com/dkeh0cumc/image/upload/v1755773371/Line2222_deiq0p.png"
        alt="hero"
        width={1000}
        height={1000}
        className="w-full md:h-full object-cover absolute top-0 left-0 z-0 opacity-20"
      />
      <div className=" md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex md:flex-row flex-col md:items-center  md:py-0 px-4 md:px-0 md:h-full py-20 md:pb-0 relative gap-10 ">
        <div className="w-full md:w-1/2 flex flex-col gap-5 z-10 py-16 md:py-0">
          <h1 className=" md:text-4xl lg:text-5xl xl:text-6xl  text-4xl font-bold pt-14">
            Bridging Curiosity and Confidence —{" "}
            <span className="text-blue-400">One Student at a Time</span>
          </h1>
          <p className="text-black/50 text-lg">
            Personalized online tutoring designed to unlock every learner’s
            potential.
          </p>

          <div className="flex gap-5">
            <Button style="link" href="/register">
              Get Started
            </Button>
            <Button style="link" href="/about" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        <div className="w-full  md:w-1/2 h-full ">
          <Image
            src="/assets/i6.jpg"
            alt="hero"
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
