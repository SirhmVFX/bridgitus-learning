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
          <h1 className="md:w-2/3 md:text-center md:text-2xl text-lg font-bold">
            Here&apos;s why you should choose Bridgitus Learning{" "}
          </h1>
          <p className="md:w-2/3 md:text-center md:text-sm text-xs text-black/50">
            These are the reasons why past sponsors have been a part of what we
            do at Bridgitus Learning and it&apos;s and it&apos;s the reasosn why
            they are still contributing{" "}
          </p>
        </div>

        <div className="bg-black text-white rounded-xl  hover:scale-105 cursor-pointer transition-all flex md:flex-row flex-col items-end gap-6">
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
                ? "At Bridgitus Learning, we believe education should adapt to the learner—not the other way around. Our one-on-one tutoring sessions are designed to deliver personalized attention, ensuring each student receives lessons that match their unique learning style, pace, and academic needs. With expert tutors guiding them step-by-step, students can overcome challenges, master difficult topics, and develop the confidence to excel. Whether it’s improving grades, building study habits, or preparing for advanced coursework, our personalized approach makes online learning effective, engaging, and results-driven."
                : "At Bridgitus Learning, we believe education should adapt to the learner—not the other way around. Our one-on-one tutoring sessions are designed to deliver..."}
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-blue-500 hover:underline ml-1 cursor-pointer"
              >
                {showFullText ? "Read less" : "Read more"}
              </button>
            </p>

            <h1 className="text-lg font-bold">The problem this solves</h1>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: 1,
                  title: "Struggling to grasp complex subjects in school",
                },
                {
                  id: 2,
                  title:
                    "Lack of individual attention in traditional classrooms",
                },
                {
                  id: 3,
                  title: "Difficulty staying focused during online learning",
                },
                {
                  id: 4,
                  title: "Inconsistent academic progress and low confidence",
                },
                {
                  id: 5,
                  title: "Limited resources for targeted academic support",
                },
              ].map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                  <Check />
                  <p className="text-base text-white">{e.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/3 p-8 pb-0">
            <Image
              width={1000}
              height={1000}
              src="/assets/ptp.svg"
              alt="why"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-10">
          <div className="md:w-1/2 bg-blue-500 text-white rounded-xl  hover:scale-105 cursor-pointer transition-all">
            <div className="flex flex-col items-start gap-6 md:p-16 md:pb-0 p-6">
              <h1 className="md:text-4xl text-2xl md:leading-none leading-6">
                Collaborative{" "}
                <span className="font-bold text-yellow-400">
                  Group Learning
                </span>
              </h1>
              <p>Boost understanding through interactive peer engagement</p>
              <p className="text-xs text-white/70">
                {showFullText2
                  ? "Our small-group classes create a supportive, collaborative learning environment where students can exchange ideas, solve problems together, and learn from diverse perspectives. Limited to just a few participants per session, each class ensures every voice is heard while still benefiting from group dynamics. This method builds communication skills, promotes teamwork, and reinforces understanding through discussion and peer-to-peer explanation—skills essential for academic success and lifelong learning."
                  : "Our small-group classes create a supportive, collaborative learning environment where students can exchange ideas, solve problems together, and learn from diverse..."}
                <button
                  onClick={() => setShowFullText2(!showFullText2)}
                  className="text-yellow-500 hover:underline ml-1 cursor-pointer"
                >
                  {showFullText ? "Read less" : "Read more"}
                </button>
              </p>

              <h1 className="text-lg font-bold">The problem this solves</h1>
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
                    <Check />
                    <p className="text-xs">{e.title}</p>
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
            <div className="flex flex-col items-start gap-6 md:p-16 p-6">
              <h1 className="md:text-4xl text-2xl md:leading-none leading-6">
                <span className="font-bold text-green-500">
                  Academic Success
                </span>{" "}
                Support
              </h1>
              <p>From assignments to exams—your complete academic partner</p>
              <p className="text-xs text-white/70">
                {showFullText3
                  ? "Bridgitus Learning goes beyond lessons to provide full-spectrum academic support. Our exam preparation programs equip students with strategies, practice tests, and confidence-building techniques to excel in standardized tests and school assessments. Meanwhile, our homework assistance ensures students stay on track, meet deadlines, and understand the work—not just complete it. By combining subject expertise with practical skills, we help learners achieve measurable success in every area of their education journey."
                  : "Bridgitus Learning goes beyond lessons to provide full-spectrum academic support. Our exam preparation programs equip students with strategies, practice tests,..."}
                <button
                  onClick={() => setShowFullText3(!showFullText3)}
                  className="text-green-500 hover:underline ml-1 cursor-pointer"
                >
                  {showFullText ? "Read less" : "Read more"}
                </button>
              </p>

              <h1 className="text-lg font-bold">The problem this solves</h1>
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
                    <Check />
                    <p className="text-xs">{e.title}</p>
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
      </div>
    </section>
  );
}

export default Why;
