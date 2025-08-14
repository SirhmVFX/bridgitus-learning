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
      <div className="md:w-[1000px] md:mx-auto flex flex-col gap-10 py-20 px-4 md:px-0">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="md:w-2/3 md:text-center md:text-2xl text-xl font-bold">
            Our Services
          </h1>
          <p className="md:w-2/3 md:text-center md:text-sm text-xs text-black/50">
            At Bridgitus Learning, we offer personalized, results-driven
            tutoring designed to support every stage of a student&apos;s
            academic journey.
          </p>
        </div>

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
                ? "At Bridgitus Learning, we uphold the principle that education should be responsive to the individual needs of each leamer. Our one-on-one online tutoring sessions are thoughtfully designed to provide personalized instruction, ensuring that every student receives support aligned with their unique learning style, academic level, and pace of progress. With the dedicated guidance of experienced tutors, students are equipped to overcome academic challenges, gain mastery over complex subjects, and build the confidence necessary for sustained success. Whether the objective is to enhance academic performance, develop effective study strategies, or prepare for advanced coursework, our tailored approach to online education ensures meaningful, engaging, and measurable outcomes."
                : "At Bridgitus Learning, we uphold the principle that education should be responsive to the individual needs of each leamer. Our one-on-one online tutoring sessions are thoughtfully designed to provide personalized instruction,..."}
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
              <div className="grid grid-cols-2 gap-2">
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
                    <Check className="hidden md:text-block" />
                    <p className="md:text-base text-sm">{e.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Image
                src="/assets/cgl.svg"
                alt="cgl"
                width={1000}
                height={1000}
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
              <div className="grid grid-cols-2 gap-4">
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
                    <Check className="hidden md:block" />
                    <p className="md:text-base text-sm">{e.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Image
                src="/assets/acs.svg"
                alt="academic"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </div>

        <div className="bg-green-500 text-white rounded-xl  hover:scale-105 cursor-pointer transition-all flex md:flex-col flex-col  gap-">
          <div className="flex flex-col items-start gap-6   md:p-16 p-6 text-black">
            <h1 className="md:text-2xl text-xl md:leading-none leading-6 font-bold">
              Exam and Scholarship Preparatory Class ({" "}
              <span className="text-bold text-amber-500">Edutest,</span>{" "}
              <span className="text-bold text-amber-500">ACER,</span>{" "}
              <span className="text-bold text-amber-500">AAS,</span>{" "}
              <span className="text-bold text-amber-500">VCE - high ATAR</span>{" "}
              )
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
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: 1,
                  title:
                    "Comprehensive instruction aligned with each again and question style.",
                },
                {
                  id: 2,
                  title:
                    "2. Regular practice tests under timed conditions to simulate real exam settings.",
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
                    "5. Ongoing support with daily assignments to reinforce learning and build consistent study habits.",
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
          <div className=" grid grid-cols-2 p-10 gap-6">
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
                src="/assets/i13.jpeg"
                alt="why"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="w-full h-[200px]">
              <Image
                width={1000}
                height={1000}
                src="/assets/i14.jpeg"
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
