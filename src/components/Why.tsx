"use client";

import Image from "next/image";
import { Check } from "./Icons";
import { useState } from "react";

function Why() {
  const [showFullText, setShowFullText] = useState(false);
  const [showFullText2, setShowFullText2] = useState(false);
  const [showFullText3, setShowFullText3] = useState(false);

  return (
    <section className=" ">
      <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex flex-col gap-10 py-20 px-4 md:px-0">
        <section id="about" className="py-20 bg-background">
          <div className=" mx-auto px-4">
            <div className=" mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-6">
                  <span className="text-sm font-medium text-yellow-500-foreground">
                    📘 BRIDGITUS LEARNING SERVICES
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Your Pathway to Academic Excellence
                </h2>
                <p className="text-lg text-black/70 leading-relaxed">
                  Bridgitus Learning is a premier online tuition platform
                  dedicated to empowering students with personalized,
                  high-quality education. Founded by a team of passionate
                  educators, we aim to bridge the gap between curiosity and
                  knowledge, helping students achieve their academic goals from
                  the comfort of their homes.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <div className="group p-6 bg-card rounded-xl border border-black/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg text-center">
                  <div className="p-3 bg-yellow-500/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
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
                      className="lucide lucide-target w-8 h-8 text-yellow-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Personalized
                  </h3>
                  <p className="text-sm text-black/70">
                    Tailored to each student&apos;s unique learning style
                  </p>
                </div>
                <div className="group p-6 bg-card rounded-xl border border-black/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg text-center">
                  <div className="p-3 bg-yellow-500/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
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
                      className="lucide lucide-users w-8 h-8 text-yellow-500"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Expert Tutors
                  </h3>
                  <p className="text-sm text-black/70">
                    Passionate educators with proven track records
                  </p>
                </div>
                <div className="group p-6 bg-card rounded-xl border border-black/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg text-center">
                  <div className="p-3 bg-yellow-500/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
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
                      className="lucide lucide-lightbulb w-8 h-8 text-yellow-500"
                    >
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                      <path d="M9 18h6"></path>
                      <path d="M10 22h4"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Innovative
                  </h3>
                  <p className="text-sm text-black/70">
                    Cutting-edge teaching methods and technology
                  </p>
                </div>
                <div className="group p-6 bg-card rounded-xl border border-black/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg text-center">
                  <div className="p-3 bg-yellow-500/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
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
                      className="lucide lucide-award w-8 h-8 text-yellow-500"
                    >
                      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                      <circle cx="12" cy="8" r="6"></circle>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Results-Driven
                  </h3>
                  <p className="text-sm text-black/70">
                    Proven success in academic achievement
                  </p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                        className="lucide lucide-heart w-6 h-6 text-yellow-500"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Personalized Learning for Every Student
                      </h3>
                      <p className="text-black/70 leading-relaxed mb-4">
                        At our core, we believe every learner deserves an
                        education tailored to their unique needs. Our online
                        one-on-one tuition platform is dedicated to bridging
                        learning gaps by crafting personalized learning
                        materials that empower students to thrive.
                      </p>
                      <p className="text-black/70 leading-relaxed">
                        We understand that no two learners are alike.
                        That&apos;s why our expert tutors leverage adaptive
                        learning assessment platforms to pinpoint each
                        student&apos;s strengths and challenges precisely.
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
                        className="lucide lucide-zap w-6 h-6 text-yellow-500"
                      >
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Innovative Teaching Methods
                      </h3>
                      <p className="text-black/70 leading-relaxed mb-4">
                        By integrating engaging word problems and real-life
                        experiences into our lessons, we make learning relevant,
                        dynamic, and meaningful. Our customized resources are
                        designed to spark curiosity, build confidence, and
                        address individual learning gaps effectively.
                      </p>
                      <p className="text-black/70 leading-relaxed">
                        Whether it&apos;s mastering complex concepts,
                        reinforcing foundational skills, or accelerating toward
                        academic goals, we&apos;re committed to guiding every
                        student with tailored support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <div className="flex flex-col gap-4 items-center">
          <h1 className="md:w-2/3 md:text-center md:text-2xl text-xl font-bold">
            Our Services
          </h1>
          <p className="md:w-2/3 md:text-center md:text-sm text-xs text-black/50">
            At Bridgitus Learning, we offer personalized, results-driven
            tutoring designed to support every stage of a student&apos;s
            academic journey.
          </p>
        </div> */}

        <div className="bg-black text-white rounded-xl  hover:scale-105 cursor-pointer transition-all flex md:flex-row flex-col  gap-">
          <div className="flex flex-col items-start gap-4 md:w-2/3  md:p-16 p-6">
            <h1 className="md:text-2xl text-xl md:leading-none leading-6">
              Personalized{" "}
              <span className="text-blue-500 font-bold">One-on-One</span>{" "}
              Tutoring
            </h1>
            <p>
              Unlock your child’s full potential with tailored learning
              experiences
            </p>
            <p className="text-xs text-white">
              {showFullText
                ? "At Bridgitus Learning, we uphold the principle that education should be responsive to the individual needs of each learner. Our one-on-one online tutoring sessions are thoughtfully designed to provide personalized instruction, ensuring that every student receives support aligned with their unique learning style, academic level, and pace of progress. With the dedicated guidance of experienced tutors, students are equipped to overcome academic challenges, gain mastery over complex subjects, and build the confidence necessary for sustained success. Whether the objective is to enhance academic performance, develop effective study strategies, or prepare for advanced coursework, our tailored approach to online education ensures meaningful, engaging, and measurable outcomes."
                : "At Bridgitus Learning, we uphold the principle that education should be responsive to the individual needs of each learner. Our one-on-one online tutoring sessions are thoughtfully designed to provide personalized instruction,..."}
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-blue-500 hover:underline ml-1 cursor-pointer"
              >
                {showFullText ? "Read less" : "Read more"}
              </button>
            </p>

            <h1 className="text-lg font-bold">The problem this addresses</h1>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: 1,
                  title:
                    "Difficulty understanding challenging subjects at school",
                },
                {
                  id: 2,
                  title:
                    "Trouble maintaining focus during online learning sessions",
                },
                {
                  id: 3,
                  title: "Scarcity of tailored academic resources and support",
                },
                {
                  id: 4,
                  title:
                    "Limited one-on-one attention in conventional classrooms",
                },
                {
                  id: 5,
                  title:
                    "Irregular academic growth and reduced self-confidence",
                },
              ].map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                  <Check className="hidden md:block" />
                  <p className="md:text-base text-sm  text-white">{e.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/3 px-8 ">
            <Image
              width={1000}
              height={1000}
              src="/assets/i5.jpg"
              alt="why"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-10">
          <div className="md:w-1/2 bg-secondary-color text-white rounded-xl  hover:scale-105 cursor-pointer transition-all">
            <div className="flex flex-col items-start gap-4 md:p-8 md:pb-0 p-6">
              <h1 className="md:text-2xl text-xl md:leading-none leading-6">
                Collaborative{" "}
                <span className="font-bold text-yellow-400">
                  Group Learning
                </span>
              </h1>
              <p>Boost understanding through interactive peer engagement</p>
              <p className="text-xs text-white/70">
                {showFullText2
                  ? "Our small-group online classes create a supportive, collaborative learning environment where students can exchange ideas, solve problems together, and learn from diverse perspectives. Limited to just a few participants per session, each class ensures every voice is heard while still benefiting from group dynamics. This method builds communication skills, promotes teamwork, and reinforces understanding through discussion and peer-to-peer explanation—skills essential for academic success and lifelong learning."
                  : "Our small-group online classes create a supportive, collaborative learning environment where students can exchange ideas, solve problems together, and learn from diverse..."}
                <button
                  onClick={() => setShowFullText2(!showFullText2)}
                  className="text-yellow-500 hover:underline ml-1 cursor-pointer"
                >
                  {showFullText ? "Read less" : "Read more"}
                </button>
              </p>

              <h1 className="text-lg font-bold">The problem this addresses</h1>
              <div className="grid xl:grid-cols-2 gap-2">
                {[
                  {
                    id: 1,
                    title:
                      "Isolation in traditional online learning environments",
                  },
                  {
                    id: 2,
                    title:
                      "Limited opportunities for collaborative problem-solving",
                  },
                  { id: 3, title: "Lack of motivation to engage in lessons" },
                  { id: 4, title: "Fear of asking questions in large classes" },
                  { id: 5, title: "Weak communication and teamwork skills" },
                ].map((e) => (
                  <div key={e.id} className="flex items-center gap-2">
                    <Check className="hidden md:block" />
                    <p className="md:text-base text-sm">{e.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8">
              <Image
                src="/assets/i15.webp"
                alt="cgl"
                width={1000}
                height={1000}
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
          </div>

          <div className="md:w-1/2 bg-black rounded-xl  hover:scale-105 cursor-pointer transition-all text-white">
            <div className="flex flex-col items-start gap-4 md:p-8 p-6">
              <h1 className="md:text-2xl text-xl md:leading-none leading-6">
                <span className="font-bold text-green-500">
                  Academic Success
                </span>{" "}
                Support
              </h1>
              <p>From assignments to exams—your complete academic partner</p>
              <p className="text-xs text-white/70">
                {showFullText3
                  ? "At Bridgitus Learning we offer comprehensive academic support that extends beyond traditional lessons. Our daily assignment and homework support services help students stay organized, meet academic deadlines, and develop a clear understanding of their coursework, rather than simply completing tasks. By integrating subject-matter expertise with practical academic skills we empower learners to achieve consistent, measurable progress across all aspects of their educational journey."
                  : "At Bridgitus Learning we offer comprehensive academic support that extends beyond traditional lessons. Our daily assignment..."}
                <button
                  onClick={() => setShowFullText3(!showFullText3)}
                  className="text-green-500 hover:underline ml-1 cursor-pointer"
                >
                  {showFullText ? "Read less" : "Read more"}
                </button>
              </p>

              <h1 className="text-lg font-bold">The problem this addresses</h1>
              <div className="grid xl:grid-cols-2 gap-4">
                {[
                  { id: 1, title: "Exam anxiety and poor test performance" },
                  {
                    id: 2,
                    title: "Unfinished or incorrect homework assignments",
                  },
                  {
                    id: 3,
                    title: "Ineffective study strategies and time management",
                  },
                  {
                    id: 4,
                    title:
                      "Struggling to balance multiple subjects and deadlines",
                  },
                  {
                    id: 5,
                    title:
                      "Difficulty applying classroom knowledge to real-world scenarios",
                  },
                ].map((e) => (
                  <div key={e.id} className="flex items-center gap-2">
                    <Check className="md:block hidden" />
                    <p className="md:text-base text-sm">{e.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8">
              <Image
                src="/assets/i16.jpg"
                alt="academic"
                width={1000}
                height={1000}
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-cyan-400 text-white rounded-xl  hover:scale-105 cursor-pointer transition-all flex md:flex-col flex-col  gap-">
          <div className="flex flex-col items-start gap-6   md:p-16 p-6 text-black">
            <h1 className="md:text-2xl text-xl md:leading-none leading-6 font-semibold">
              Exam and Scholarship Preparatory Class ({" "}
              <span className="text-bold text-white ">Edutest,</span>{" "}
              <span className="text-bold text-white ">ACER,</span>{" "}
              <span className="text-bold text-white ">AAS,</span>{" "}
              <span className="text-bold text-white ">VCE - high ATAR</span> )
            </h1>
            <p>
              At Bridgitus Learning, our Exam Preparatory Classen are
              meticulously designed to support students aiming for success in
              high-stakes attestments, including{" "}
              <span className="text-bold">
                Edutest SAT , ACER scholarship tests, AAS (Academic Assessment
                Services), and the VCE (Victorian Certificate of Education)
              </span>
            </p>
            <p className=" text-black">
              Each program is tailored to the specific format, content, and
              expectation of these examinations. We focus not only on subject
              mastery but also on buliding the strategic thinking time
              managment, and problem solving skills esential for high
              performance.
            </p>

            <h1 className="text-lg font-bold">Our classes include:</h1>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  id: 1,
                  title:
                    "Comprehensive instruction aligned with each again and question style.",
                },
                {
                  id: 2,
                  title:
                    "Regular practice tests under timed conditions to simulate real exam settings.",
                },
                {
                  id: 3,
                  title:
                    "Data-driven performance analysis and personalized feedback.",
                },
                {
                  id: 4,
                  title:
                    "Strategy workshops focused on critical thinking, nam technique and managing exam pressure.",
                },
                {
                  id: 5,
                  title:
                    "Ongoing support with daily assignments to reinforce learning and build consistent study habits.",
                },
              ].map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                  <Check className="hidden md:block" />
                  <p className="md:text-base text-sm  text-black">{e.title}</p>
                </div>
              ))}
            </div>

            <p>
              Led by experienced educators with a strong understanding of each
              texting framework, our approach ensures that students are fully
              prepared academically and mentally to achieve the best possible
              results.
            </p>
            <p className=" text-black">
              Whether you&apos;re targeting selective entry, university
              admissions, or academic scholarships, Bridgitus Learning provides
              the structure, support, and expertise to help you succeed.
            </p>
          </div>
          <div className=" grid grid-cols-2 md:p-10 p-4 md:gap-6 gap-2">
            <div className="w-full h-[200px]">
              <Image
                width={1000}
                height={1000}
                src="/assets/i9.jpg"
                alt="why"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="w-full h-[200px]">
              <Image
                width={1000}
                height={1000}
                src="/assets/i12.jpg"
                alt="why"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="w-full h-[200px]">
              <Image
                width={1000}
                height={1000}
                src="/assets/i13.png"
                alt="why"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="w-full h-[200px]">
              <Image
                width={1000}
                height={1000}
                src="/assets/i14.png"
                alt="why"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Why;
