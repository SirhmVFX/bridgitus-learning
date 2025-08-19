import Button from "@/components/Button";
import {
  Activity,
  Box,
  Boxes,
  Chrome,
  Codesandbox,
  Cookie,
  Dribble,
  Ico,
} from "@/components/Icons";
import Link from "next/link";

function Classes() {
  return (
    <main>
      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto">
        <div className="grid grid-cols-3 md:pt-40 lg:pt-52 xl:pt-64 pb-20 gap-6">
          <div className="flex flex-col gap-2 items-start">
            <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
              Our Classes – A Journey of Growth and Excellence
            </h1>
            <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] ">
              At our tutoring centre, we believe in nurturing academic potential
              through personalised, structured, and challenging programs
              designed to support students from Year 3 to Year 12. Our classes
              are carefully curated to strengthen core skills, deepen
              understanding, and build the confidence needed to excel in school
              and beyond.
            </p>
            <Button style="link" href="/about">
              Learn More About
            </Button>
          </div>

          {[
            {
              id: 1,
              icon: <Activity />,
              title: "Regular Tutoring (Years 3 – 12)",
              desc: "Our regular tutoring programs in Math, English, and Science provide comprehensive support tailored to each student’s curriculum level. Whether a student needs to catch up, stay on track, or move ahead, our structured lessons, small class sizes, and focused attention help them achieve their academic goals. We cover foundational skills, reinforce classroom learning, and foster effective study habits that last.",
            },
            {
              id: 2,
              icon: <Boxes />,
              title: "Special Math Class",
              desc: "For students who show particular interest or aptitude in Mathematics, our Special Math Class offers an enriched learning experience. Here, we dive deeper into mathematical concepts, challenge students with advanced problem-solving strategies, and prepare them for selective exams and competitions. This class is ideal for high achievers aiming to excel beyond the school curriculum.",
            },
            {
              id: 3,
              icon: <Box />,
              title: "Special Science Class",
              desc: "Our Special Science Class is designed for students eager to explore the core sciences — biology, chemistry, and physics — at a more advanced level. With engaging activities, analytical thinking, and conceptual depth, this class nurtures scientific curiosity and prepares students for future academic challenges, including science competitions and selective entry exams.",
            },

            {
              id: 4,
              icon: <Ico />,
              title: "English Class",
              desc: "Our English classes build strong communication, reading, and writing skills essential for academic success. We help students expand their vocabulary, refine their grammar, and develop critical thinking through text analysis and essay writing. These classes prepare students for internal assessments, NAPLAN, and external exams with confidence and clarity.",
            },
            {
              id: 5,
              icon: <Chrome />,
              title: "HSC Tutoring",
              desc: "Our HSC tutoring program supports Year 11 and 12 students in their preparation for the NSW Higher School Certificate. We offer in-depth coverage of each subject's syllabus, focusing on Units 1 & 2 (Year 11) and Units 3 & 4 (Year 12). Students benefit from structured content delivery, exam-style practice, and personalised feedback to help them reach their full potential and achieve a competitive ATAR.",
            },
            {
              id: 6,
              icon: <Cookie />,
              title: "VCE Class",
              desc: "Our VCE classes provide comprehensive tutoring for students undertaking the Victorian Certificate of Education. We offer targeted preparation for Units 1 & 2 (Year 11) and Units 3 & 4 (Year 12), with a strong focus on content mastery, exam skills, and SAC preparation. Our expert tutors help students develop the strategies they need to succeed in both internal assessments and external exams.",
            },
            {
              id: 7,
              icon: <Codesandbox />,
              title: "Scholarship Preparatory Class",
              desc: "The Scholarship Preparatory Class is designed for ambitious students preparing for competitive scholarship and selective school entrance exams. This program includes advanced Mathematics, Reading Comprehension, Writing, and Abstract Reasoning. With timed drills, mock exams, and critical feedback, students are equipped to perform under pressure and stand out from the competition.",
            },
            {
              id: 8,
              icon: <Dribble />,
              title: "College Preparatory Class",
              desc: "Our College Preparatory Class is tailored for senior students aiming for university entrance — both in Australia and internationally. We provide advanced academic training across subjects, with a core focus on ATAR excellence. For Year 11 students, we ensure thorough preparation for Units 1 & 2, laying a strong academic foundation. For Year 12 students, we intensively prepare for Units 3 & 4, aligning lessons with exam criteria and assessment tasks.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 flex flex-col gap-2 bg-[#f6f6f6] rounded-3xl hover:bg-secondary-color transition-all duration-300 cursor-pointer hover:text-white hover:scale-105 hover:rotate-2"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <h1 className="text-[12px] lg:text-[14px] xl:text-[16px] font-bold">
                  {item.title}
                </h1>
              </div>
              <p className="md:text-[10px]  lg:text-[12px] xl:text-[13px] ">
                {item.desc}
              </p>
              <Link
                href="/register"
                className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-primary-color  "
              >
                Register Now
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Classes;
