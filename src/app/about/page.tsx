import Image from "next/image";

function About() {
  return (
    <main>
      <section className="relative">
        <Image
          width={1000}
          height={1000}
          src=""
          alt=""
          className="w-full h-screen object-cover"
        />
        <div className="w-[1200px] mx-auto absolute top-0 left-0 right-0 bottom-0 flex items-center">
          <div className="w-1/2">
            <h1 className="text-7xl ">We support early-stage startups</h1>
            <p className="text-white/50">
              Leading tech giants to take control of their firm’s entire
              operations through Loreon&apos;s dedicated DevOps package.
            </p>
          </div>
        </div>
      </section>

      <section className="w-[1200px] mx-auto h-screen flex items-center">
        <div className="w-1/2 flex flex-col gap-4">
          <h1 className="text-5xl">
            Loreon Is More than a Company. It&apos;s a Story
          </h1>
          <p className="text-sm text-black/50">
            Launching app operations and DevOps shouldn’t take time it&apos;s
            something companies should enjoy and not struggle with. After
            spending a few years in the industry, our founder came up with a
            better way to handle the ever-changing cultural shift with a unique
            approach to Development and Operations (DevOps) that emphasizes
            teamwork and open communication before anything else.
          </p>

          <h1 className="font-bold">
            There is No Passion To Be Found Playing Small — Nelson Mandela
          </h1>
          <p className="text-sm text-black/50">
            Driven by this sheer passion, LOREON was created as a platform that
            simplifies and automates the entire process of building, testing,
            deploying, monitoring, and securing software applications while
            providing startups and founders with the resources needed to
            transform ideas into products that people love.
          </p>
        </div>
        <div></div>
      </section>

      <section className="w-[1200px] mx-auto">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl">
            Our Process is Unique, We’re Here to Solve Your DevOps Problem
          </h1>
          <p className="text-sm text-black/50">
            With our FOUR STEPS building, testing, deploying, monitoring process
            and approach, we provide our clients with the fastest way to launch
            applications.
          </p>
        </div>
      </section>

      <section className="w-[1200px] mx-auto py-20 flex items-center h-screen">
        <div className="w-1/3"></div>
        <div className="w-2/3 flex flex-col gap-4">
          <h1 className="text-5xl">
            Today, Tomorrow, or the Future. We Share a Large Vision
          </h1>
          <p>
            The tech world is ever-changing and fast-growing, and statistics
            show that it will become the largest industry in the future. The
            DevOps industry market forecast suggests huge numbers in the future
            and a need for more labor force. To actualize this while stamping
            Africa’s presence on the global DevOps map, LOREON’s vision is to be
            Africa&apos;s largest and leading DevOps service offering platform.
            ACHIEVE MUCH MORE IN LESS TIME. We provide companies with the needed
            professional help to keep up with the fast-moving pace of the global
            tech world! Actualize your deployment goals faster and stamp your
            presence with LOREON, Africa&apos;s largest and leading DevOps and
            business intelligence service offering platform.{" "}
          </p>
        </div>
      </section>

      <section className="w-[1200px] mx-auto py-20 flex items-center h-screen">
        <div className="w-2/3 flex flex-col gap-4">
          <h1 className="text-5xl">
            Today, Tomorrow, or the Future. We Share a Large Vision
          </h1>
          <p>
            The tech world is ever-changing and fast-growing, and statistics
            show that it will become the largest industry in the future. The
            DevOps industry market forecast suggests huge numbers in the future
            and a need for more labor force. To actualize this while stamping
            Africa’s presence on the global DevOps map, LOREON’s vision is to be
            Africa&apos;s largest and leading DevOps service offering platform.
            ACHIEVE MUCH MORE IN LESS TIME. We provide companies with the needed
            professional help to keep up with the fast-moving pace of the global
            tech world! Actualize your deployment goals faster and stamp your
            presence with LOREON, Africa&apos;s largest and leading DevOps and
            business intelligence service offering platform.{" "}
          </p>
        </div>

        <div className="w-1/3"></div>
      </section>
    </main>
  );
}

export default About;
