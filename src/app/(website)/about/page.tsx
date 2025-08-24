"use client";
import { ChevronDown, ChevronUp } from "@/components/Icons";
import Image from "next/image";
import { useState } from "react";

function About() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <main>
      <section className="relative h-screen">
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-black to-black/5 z-10"></div>
        <div className="absolute top-0 right-0 bottom-0 left-0 ">
          <Image
            width={1000}
            height={1000}
            src="/assets/i7.avif"
            alt=""
            className="w-full h-full object-cover "
          />
        </div>
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full md:mx-auto md:px-0 px-4 absolute top-0 left-0 right-0 bottom-0 flex items-center z-50">
          <div className="md:w-2/3 flex flex-col gap-4">
            <h1 className="md:text-4xl lg:text-5xl xl:text-6xl text-5xl text-white font-bold">
              Where Every{" "}
              <span className="text-green-500">
                Learner’s Journey is Uniquely Designed
              </span>{" "}
              for Success.
            </h1>
            {/* <p className="text-white">
              Leading tech giants to take control of their firm’s entire
              operations through Bridgitus&apos;s dedicated DevOps package.
            </p> */}
          </div>
        </div>
      </section>

      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full md:mx-auto md:px-0 px-4 md:py-20 py-10  grid md:grid-cols-1 grid-cols-1 items-center md:gap-14 gap-6">
        <div className="grid lg:grid-cols-2 gap-12 ">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-yellow-500"
                >
                  <path d="M2 12s3-7.5 10-7.5 10 7.5 10 7.5-3 7.5-10 7.5S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                  The Vision
                </h3>
                <p className="text-black/70 leading-relaxed text-lg md:text-2xl mb-4">
                  &quot;To inspire and equip every learner to excel and
                  thrive&quot;
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-yellow-500"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                  The Mission
                </h3>
                <p className="text-black/70 leading-relaxed text-lg md:text-2xl mb-4">
                  &quot;To connect students to Knowledge, skills and confidence
                  through engaging, personalized learning - bridging academic
                  gaps and paving the way to excellence&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full md:mx-auto md:px-0 px-4 py-10 flex flex-col gap-10  ">
        <h1 className="text-3xl md:text-5xl font-bold ">
          From the director&apos;s desk
        </h1>
        <div className="flex md:flex-row  flex-col  md:gap-10 gap-8">
          <div className="md:w-1/3">
            <div className="w-full h-[400px] ">
              <Image
                src="/assets/i.jpg"
                alt="directors image"
                width={1000}
                height={1000}
                className="w-full h-full object-cover rounded-3xl bg-green-100"
              />
            </div>

            <div className="p-4">
              <h1 className="text-black md:text-base text-sm">
                Phemmie Olugbogi
              </h1>
              <p className="text-black/50 md:text-sm text-xs italic">
                Founder, Bridgitus Learning
              </p>
            </div>
          </div>
          <div className="md:w-2/3 flex flex-col gap-6">
            {/* <h1 className="text-xl md:text-2xl font-bold">Director’s Note</h1> */}
            <p className="text-lg text-black/70 leading-relaxed">
              Bridgitus Learning is more than just an educational platform; we
              are a dynamic bridge between potential and achievement. Founded on
              the belief that every learner deserves a clear and guided pathway
              to academic excellence, our mission is to empower students with
              the tools, strategies, and confidence they need to succeed in
              today’s competitive environment.
            </p>

            <p className="text-lg text-black/70 leading-relaxed">
              With a commitment to high-quality instruction, innovative learning
              methods, and personalized support, Bridgitus Learning transforms
              the traditional educational experience. Our expert educators and
              carefully designed programs cater to a wide range of learners,
              ensuring that each student’s unique strengths are nurtured while
              challenges are addressed with precision and care.
            </p>

            <p className="text-lg text-black/70 leading-relaxed">
              The name Bridgitus symbolizes connection, a bridge between where a
              student is today and where they aspire to be. Through structured
              learning paths, skill-building courses, and academic mentoring, we
              help students unlock their full potential.
            </p>

            <p className="text-lg text-black/70 leading-relaxed">
              At Bridgitus Learning, excellence is not a destination; it’s a
              journey, and we’re honoured to walk that path with every student
              we serve. Your success story begins here. Let us be your guide.
            </p>
          </div>
        </div>
      </section>

      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full md:mx-auto md:px-0 px-4 md:py-14 py-10 xl:h-screen flex md:flex-row flex-col items-center md:gap-0 gap-6">
        <div className="md:w-1/2 flex flex-col gap-6">
          <h1 className="text-3xl md:text-5xl font-bold">
            Bridgitus Is More than a Institute. It&apos;s a Story
          </h1>
          <p className="text-lg text-black/70 leading-relaxed">
            Bridgitus Learning is a premier online tuition platform dedicated to
            empowering students with personalized, high-quality education.
            Founded by a team of passionate educators, we aim to bridge the gap
            between curiosity and knowledge, helping students achieve their
            academic goals from the comfort of their homes. Our experienced
            tutors provide tailored guidance to ensure every learner thrives.
          </p>

          <h1 className="font-bold italic text-lg">
            &quot;Education is the passport to the future, for tomorrow belongs
            to those who prepare for it today&quot; - Malcolm X.
          </h1>
          <p className="text-lg text-black/70 leading-relaxed">
            At our core, we believe every learner deserves an education tailored
            to their unique needs. Our online one-on-one tuition platform is
            dedicated to bridging learning gaps by crafting personalized
            learning materials that empower students to thrive. We understand
            that no two learners are alike. That’s why our expert tutors
            leverage adaptive learning assessment platforms to pinpoint each
            student’s strengths and challenges precisely.
          </p>
        </div>
        <div className="md:w-1/2 flex items-center justify-center relative">
          <div className="md:w-[300px] md:h-[400px] w-[250px] h-[300px]">
            <Image
              src="/assets/i8.jpg"
              alt="about"
              width={1000}
              height={1000}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="w-[330px] h-[80px] bg-primary-color rounded-lg absolute -bottom-5 left-1/2 transform -translate-x-1/2 -z-10"></div>
        </div>
      </section>

      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full md:mx-auto md:px-0 px-4 md:py-14 py-20 ">
        <div className="flex flex-col gap-4 md:w-3/4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Our Approach is Different — We’re Here to Close Your Learning Gaps.
          </h1>
          <p className="text-lg text-black/70 leading-relaxed">
            With our four-step process — assessing, personalizing, teaching, and
            tracking — we give students the fastest path to academic success.
          </p>
        </div>

        <div className="py-10 md:block hidden">
          <Image
            src="/assets/process.svg"
            alt="about"
            width={1000}
            height={1000}
            className=" w-full h-full object-contain"
          />
        </div>

        <div className="py-10 md:hidden block">
          <Image
            src="/assets/proc2.svg"
            alt="about"
            width={1000}
            height={1000}
            className=" w-full h-full object-contain"
          />
        </div>
      </section>

      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:h-screen w-full md:mx-auto md:px-0 px-4 py-10 flex md:flex-row items-center flex-col  md:gap-10 gap-8 ">
        <div className="md:w-1/3 h-full ">
          <Image
            src="/assets/i9.jpg"
            alt="about"
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
        <div className="md:w-2/3 flex flex-col gap-6">
          <h1 className="text-3xl md:text-5xl font-bold">
            Today, Tomorrow, or the Future. We Share a Large Vision
          </h1>
          <p className="text-lg text-black/70 leading-relaxed">
            By integrating engaging word problems and real-life experiences into
            our lessons, we make learning relevant, dynamic, and meaningful. Our
            customized resources are designed to spark curiosity, build
            confidence, and address individual learning gaps effectively.
          </p>

          <p className="text-lg text-black/70 leading-relaxed">
            Whether it’s mastering complex concepts, reinforcing foundational
            skills, or accelerating toward academic goals, we’re committed to
            guiding every student with tailored support. Our passionate team
            combines innovative teaching methods, including adaptive technology
            and practical applications, with a deep dedication to personalized
            education. Join us on a transformative journey where learning is
            engaging, impactful, and uniquely yours.
          </p>
        </div>
      </section>

      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:h-screen md:gap-20 gap-8 w-full md:mx-auto md:px-0 px-4 py-20 flex md:flex-row flex-col items-center ">
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            We Are Changing the Education Narrative: Your Success Is our
            passion!
          </h1>
          <p className="text-lg text-black/70 leading-relaxed">
            At Bridgitus Learning, we believe education should be more than
            memorizing facts — it should inspire curiosity, spark confidence,
            and unlock potential. We’re redefining the way students learn by
            offering personalized, one-on-one and group tutoring that adapts to
            each learner’s needs. Our passionate educators go beyond the
            textbook, blending innovative teaching methods, real-world examples,
            and adaptive technology to make learning engaging, relevant, and
            impactful. Every lesson is a step toward mastery, every interaction
            a chance to empower. Your success isn’t just our goal — it’s the
            driving force behind everything we do.
          </p>
        </div>

        <div className="md:w-1/2 h-full ">
          <Image
            src="/assets/i11.jpg"
            alt="about"
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      </section>

      {/* <section>
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full md:mx-auto md:px-0 px-4 py-10 flex flex-col gap-4 ">
          <h1 className="md:text-3xl text-xl font-bold md:w-3/4">
            At BRIDGITUS, it&apos;s all about building stories that last a
            lifetime.
          </h1>
          <p className="md:w-3/4 text-xs md:text-sm text-black/50">
            From our clients to students, we serve as a community facilitating
            collaboration for people in the DevOps industry. Discover our
            diverse community and what our clients say about us.
          </p>
        </div>

        <Testimonial />
      </section> */}

      <section className="py-20 bg-background">
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              What Our Students Say About Us
            </h2>
            <p className="text-lg text-black/70 leading-relaxed">
              Real testimonials from our satisfied students and parents
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl cursor-pointer bg-white border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
              </div>
              <p className="text-black/70 mb-6 leading-relaxed italic">
                &quot;Bridgitus Learning has transformed my daughter&apos;s
                approach to math. The personalized sessions made complex
                concepts so much easier to understand!&quot;
              </p>
              <div className="flex items-center">
                {/* <Image
                  width={1000}
                  height={1000}
                  src="/assets/parent-1-BVyu6EHF.jpg"
                  alt="Sarah M."
                  className="w-12 h-12 rounded-full object-cover mr-4"
                /> */}
                <div>
                  <h4 className="font-semibold text-foreground">Sarah M.</h4>
                  <p className="text-sm text-black/70">Parent</p>
                </div>
              </div>
            </div>
            <div className="group p-8 rounded-2xl cursor-pointer bg-white border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
              </div>
              <p className="text-black/70 mb-6 leading-relaxed italic">
                &quot;Thanks to Bridgitus, I aced my AP English exam. The
                one-on-one attention really helped me improve my writing
                skills.&quot;
              </p>
              <div className="flex items-center">
                {/* <Image
                  width={1000}
                  height={1000}
                  src="/assets/student-1-Dq3VaENS.jpg"
                  alt="Emily R."
                  className="w-12 h-12 rounded-full object-cover mr-4"
                /> */}
                <div>
                  <h4 className="font-semibold text-foreground">Emily R.</h4>
                  <p className="text-sm text-black/70">Student</p>
                </div>
              </div>
            </div>
            <div className="group p-8 rounded-2xl cursor-pointer bg-white border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star w-5 h-5 text-yellow-500 fill-current"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
              </div>
              <p className="text-black/70 mb-6 leading-relaxed italic">
                &quot;The tutors are incredibly engaging and patient. My son
                looks forward to his science lessons every week!&quot;
              </p>
              <div className="flex items-center">
                {/* <Image
                  width={1000}
                  height={1000}
                  src="/assets/tutor-1-DYVtSi2S.jpg"
                  alt="James L."
                  className="w-12 h-12 rounded-full object-cover mr-4"
                /> */}
                <div>
                  <h4 className="font-semibold text-foreground">James L.</h4>
                  <p className="text-sm text-black/70">Parent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full md:mx-auto md:px-0 px-4 py-20 ">
        <div className="flex flex-col gap-4  ">
          <h1 className="text-3xl md:text-5xl font-bold md:w-3/4">
            We know you have questions, We also have answers
          </h1>
          <p className="md:w-3/4 text-xs md:text-sm text-black/50">
            We are here to help you with any questions you may have. Our team of
            experts is always ready to assist you with any questions you may
            have.
          </p>
        </div>

        <div className="py-14 flex flex-col gap-4">
          {[
            {
              id: 1,
              question: "What subjects do you offer tutoring in?",
              answer:
                "We offer comprehensive tutoring in core subjects including Mathematics, English, Science, and Social Studies. We also provide specialized test preparation for standardized exams like SAT, ACT, and GCSE.",
            },
            {
              id: 2,
              question: "How do you match students with tutors?",
              answer:
                "We carefully match students with tutors based on their learning style, academic needs, and personality. Our matching process considers subject expertise, teaching style, and student goals to ensure the best possible learning experience.",
            },
            {
              id: 3,
              question: "What technology do I need for online tutoring?",
              answer:
                "You'll need a stable internet connection, a computer or tablet with a webcam, and a quiet space for learning. We use Zoom for our virtual classrooms, which is compatible with most devices.",
            },
            {
              id: 4,
              question: "How often should my child have tutoring sessions?",
              answer:
                "Most students benefit from 1-2 sessions per week, but we can customize this based on individual needs. We'll recommend a schedule after an initial assessment of your child's learning goals.",
            },
            {
              id: 5,
              question: "What makes your teaching approach different?",
              answer:
                "Our personalized learning approach focuses on understanding each student's unique learning style. We combine traditional teaching methods with innovative techniques and real-world applications to make learning engaging and effective.",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 md:p-6 p-4 border-b border-black/20 transition-all duration-300"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpen(open === item.id ? null : item.id)}
              >
                <h1 className="text-lg font-bold leading-relaxed text-black">
                  {item.question}
                </h1>
                {open === item.id ? <ChevronUp /> : <ChevronDown />}
              </div>
              {open === item.id && (
                <p className="text-lg text-black/70 leading-relaxed mt-2  mb-6 italic">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default About;
