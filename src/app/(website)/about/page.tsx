import type { Metadata } from "next";
import {
  getSiteContent,
  getPublishedTestimonials,
  getPublishedFaqs,
} from "@/lib/firestore";
import AboutClient from "./_AboutClient";
import PageHero, {
  IconCardGrid,
  SplitShowcase,
} from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import HowItWorksStrip from "@/components/marketing/HowItWorksStrip";
import {
  IconParent,
  IconPassport,
  IconSpark,
  IconStudents,
  IconTarget,
  IconTutor,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "About Bridgitus",
  description:
    "Bridgitus Learning bridges curiosity and confidence with personalised online tutoring and the Smart Learning Passport — measurable progress for every student.",
};

const ABOUT_DEFAULTS = {
  heroHeading:
    "Where Every Learner's Journey is Uniquely Designed for Success.",
  heroHeadingHighlight: "Learner's Journey is Uniquely Designed",
  heroImage: "/assets/i7.avif",
  vision: "To inspire and equip every learner to excel and thrive",
  mission:
    "To connect students to Knowledge, skills and confidence through engaging, personalized learning — bridging academic gaps and paving the way to excellence",
  directorName: "Femi Olugbogi",
  directorRole: "Founder, Bridgitus Learning",
  directorImage: "/assets/picc.jpg",
  directorBio:
    "Bridgitus Learning is more than just an educational platform; we are a dynamic bridge between potential and achievement. Founded on the belief that every learner deserves a clear and guided pathway to academic excellence, our mission is to empower students with the tools, strategies, and confidence they need to succeed in today's competitive environment.",
  storyHeading: "Bridgitus Is More than an Institute. It's a Story",
  storyBody:
    "Bridgitus Learning is a premier online tuition platform dedicated to empowering students with personalized, high-quality education and effective learning strategies. Founded by a team of passionate educators, we aim to bridge the gap between curiosity and knowledge, helping students achieve their academic goals from the comfort of their homes.",
  storyImage: "/assets/i8.jpg",
  storyQuote:
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today — Malcolm X",
  approachHeading:
    "Our Approach is Different — We're Here to Close Your Learning Gaps.",
  approachBody:
    "With our four-step process — assessing, personalizing, teaching, and tracking — we give students the fastest path to academic success.",
  approachImageDesktop: "/assets/process.svg",
  approachImageMobile: "/assets/proc2.svg",
  vision2Heading: "Today, Tomorrow, or the Future. We Share a Large Vision",
  vision2Body:
    "By integrating engaging word problems and real-life experiences into our lessons, we make learning relevant, dynamic, and meaningful.",
  vision2Image: "/assets/i9.jpg",
  passionHeading:
    "We Are Changing the Education Narrative: Your Success Is our passion!",
  passionBody:
    "At Bridgitus Learning, we believe education should be more than memorizing facts — it should inspire curiosity, spark confidence, and unlock potential.",
  passionImage: "/assets/i11.jpg",
  testimonialsHeading: "What Our Students Say About Us",
  faqHeading: "We know you have questions, We also have answers",
};

const FALLBACK_TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah M.",
    role: "Parent",
    quote:
      "Bridgitus Learning has transformed my daughter's approach to math. The personalized sessions made complex concepts so much easier!",
    rating: 5,
    published: true,
    order: 0,
  },
  {
    id: "2",
    name: "Emily R.",
    role: "Student",
    quote:
      "Thanks to Bridgitus, I aced my AP English exam. The one-on-one attention really helped me improve my writing skills.",
    rating: 5,
    published: true,
    order: 1,
  },
  {
    id: "3",
    name: "James L.",
    role: "Parent",
    quote:
      "The tutors are incredibly engaging and patient. My son looks forward to his science lessons every week!",
    rating: 5,
    published: true,
    order: 2,
  },
];

const FALLBACK_FAQS = [
  {
    id: "1",
    question: "What subjects do you offer tutoring in?",
    answer:
      "We offer comprehensive tutoring in core subjects including Mathematics, English, Science, and Social Studies, plus test preparation for SAT, ACT, HSC, VCE and GCSE.",
    order: 0,
    published: true,
  },
  {
    id: "2",
    question: "How do you match students with tutors?",
    answer:
      "We carefully match students with tutors based on their learning style, academic needs, and personality — considering subject expertise, teaching style, and student goals.",
    order: 1,
    published: true,
  },
  {
    id: "3",
    question: "What technology do I need?",
    answer:
      "A stable internet connection, a computer or tablet with a webcam, and a quiet space. We use Zoom for our virtual classrooms.",
    order: 2,
    published: true,
  },
  {
    id: "4",
    question: "How often should my child have sessions?",
    answer:
      "Most students benefit from 1–2 sessions per week, but we customise schedules after an initial assessment of your child's learning goals.",
    order: 3,
    published: true,
  },
  {
    id: "5",
    question: "What makes your teaching approach different?",
    answer:
      "Our personalised approach focuses on each student's unique learning style, combining traditional methods with innovative techniques and real-world applications.",
    order: 4,
    published: true,
  },
];

export default async function About() {
  const [aboutData, testimonials, faqs] = await Promise.all([
    getSiteContent("about_page").catch(() => null),
    getPublishedTestimonials().catch(() => []),
    getPublishedFaqs().catch(() => []),
  ]);

  const c = {
    ...ABOUT_DEFAULTS,
    ...(aboutData ?? {}),
  } as typeof ABOUT_DEFAULTS;
  const tList = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  const faqList = faqs.length > 0 ? faqs : FALLBACK_FAQS;

  return (
    <main>
      <PageHero
        eyebrow="About"
        title={c.heroHeading}
        subtitle="We bridge curiosity and confidence — with diagnostics, expert tutors, and evidence of mastery."
        crumbs={[{ href: "/about", label: "About" }]}
        image={c.heroImage || "/assets/i7.avif"}
        badge="Pathway to excellence"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <h2 className="text-3xl font-bold text-[#001233] md:text-4xl">
            Why Bridgitus exists
          </h2>
          <p className="mt-3 max-w-2xl text-[#64748b]">
            A clear vision, a practical mission, and a system that proves
            progress.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "The Vision",
                  body: c.vision,
                  icon: <IconSpark />,
                },
                {
                  title: "The Mission",
                  body: c.mission,
                  icon: <IconTarget />,
                },
                {
                  title: "For students",
                  body: "Personalised agendas, live teaching, and a passport that shows what they’ve mastered.",
                  icon: <IconStudents />,
                },
                {
                  title: "For parents",
                  body: "Plain-language reports and proof — not vague “they’re doing fine.”",
                  icon: <IconParent />,
                },
                {
                  title: "Expert tutors",
                  body: "Human teaching guided by diagnostic data, not guesswork.",
                  icon: <IconTutor />,
                },
                {
                  title: "Smart Learning Passport",
                  body: "Levels, gaps, and goals that update as mastery grows.",
                  icon: <IconPassport />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <HowItWorksStrip />

      <SplitShowcase
        eyebrow="From the Director's desk"
        title={c.directorName}
        body={c.directorBio}
        bullets={[c.directorRole, "Bridge between potential and achievement"]}
      />

      <SplitShowcase
        eyebrow="Our story"
        title={c.storyHeading}
        body={c.storyBody}
        bullets={c.storyQuote ? [c.storyQuote] : undefined}
        image={c.storyImage || "/assets/i8.jpg"}
      />

      <SplitShowcase
        eyebrow="Our approach"
        title={c.approachHeading}
        body={c.approachBody}
        bullets={[
          "Assess — find the exact gaps",
          "Personalise — build the agenda",
          "Teach — live expert sessions",
          "Track — passport proof of growth",
        ]}
        image={c.passionImage || "/assets/i11.jpg"}
        imageLeft
      />

      <section className="py-16 sm:py-20 bg-[#f7f8fa]">
        <div className="mkt-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#001233] mb-3">
              {c.testimonialsHeading}
            </h2>
            <p className="text-base text-[#64748b]">
              Real testimonials from our satisfied students and parents
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tList.map((t) => (
              <div
                key={t.id}
                className="p-6 sm:p-8 bg-white border border-[#001233]/8 rounded-2xl flex flex-col gap-4 shadow-[0_10px_30px_-18px_rgba(0,18,51,0.2)]"
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      className={`w-4 h-4 ${i <= t.rating ? "text-[#C4A574] fill-current" : "text-gray-200 fill-current"}`}
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#64748b] leading-relaxed italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-[#001233]">{t.name}</p>
                  <p className="text-sm text-[#64748b]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-container py-14">
        <h2 className="text-3xl md:text-5xl font-bold text-[#001233] mb-3">
          {c.faqHeading}
        </h2>
        <p className="text-sm text-[#64748b] mb-10 max-w-2xl">
          Our team of experts is always ready to assist you with any questions.
        </p>
        <AboutClient faqs={faqList} />
      </section>

      <MarketingCta image="/assets/i12.jpg" />
    </main>
  );
}
