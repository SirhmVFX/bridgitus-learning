import Image from "next/image";
import { getSiteContent, getPublishedTestimonials, getPublishedFaqs } from "@/lib/firestore";
import AboutClient from "./_AboutClient";

const ABOUT_DEFAULTS = {
  heroHeading: "Where Every Learner's Journey is Uniquely Designed for Success.",
  heroHeadingHighlight: "Learner's Journey is Uniquely Designed",
  heroImage: "/assets/i7.avif",
  vision: "To inspire and equip every learner to excel and thrive",
  mission: "To connect students to Knowledge, skills and confidence through engaging, personalized learning — bridging academic gaps and paving the way to excellence",
  directorName: "Femi Olugbogi",
  directorRole: "Founder, Bridgitus Learning",
  directorImage: "/assets/picc.jpg",
  directorBio: "Bridgitus Learning is more than just an educational platform; we are a dynamic bridge between potential and achievement. Founded on the belief that every learner deserves a clear and guided pathway to academic excellence, our mission is to empower students with the tools, strategies, and confidence they need to succeed in today's competitive environment.",
  storyHeading: "Bridgitus Is More than an Institute. It's a Story",
  storyBody: "Bridgitus Learning is a premier online tuition platform dedicated to empowering students with personalized, high-quality education. Founded by a team of passionate educators, we aim to bridge the gap between curiosity and knowledge, helping students achieve their academic goals from the comfort of their homes.",
  storyImage: "/assets/i8.jpg",
  storyQuote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today — Malcolm X",
  approachHeading: "Our Approach is Different — We're Here to Close Your Learning Gaps.",
  approachBody: "With our four-step process — assessing, personalizing, teaching, and tracking — we give students the fastest path to academic success.",
  approachImageDesktop: "/assets/process.svg",
  approachImageMobile: "/assets/proc2.svg",
  vision2Heading: "Today, Tomorrow, or the Future. We Share a Large Vision",
  vision2Body: "By integrating engaging word problems and real-life experiences into our lessons, we make learning relevant, dynamic, and meaningful.",
  vision2Image: "/assets/i9.jpg",
  passionHeading: "We Are Changing the Education Narrative: Your Success Is our passion!",
  passionBody: "At Bridgitus Learning, we believe education should be more than memorizing facts — it should inspire curiosity, spark confidence, and unlock potential.",
  passionImage: "/assets/i11.jpg",
  testimonialsHeading: "What Our Students Say About Us",
  faqHeading: "We know you have questions, We also have answers",
};

const FALLBACK_TESTIMONIALS = [
  { id: "1", name: "Sarah M.", role: "Parent", quote: "Bridgitus Learning has transformed my daughter's approach to math. The personalized sessions made complex concepts so much easier!", rating: 5, published: true, order: 0 },
  { id: "2", name: "Emily R.", role: "Student", quote: "Thanks to Bridgitus, I aced my AP English exam. The one-on-one attention really helped me improve my writing skills.", rating: 5, published: true, order: 1 },
  { id: "3", name: "James L.", role: "Parent", quote: "The tutors are incredibly engaging and patient. My son looks forward to his science lessons every week!", rating: 5, published: true, order: 2 },
];

const FALLBACK_FAQS = [
  { id: "1", question: "What subjects do you offer tutoring in?", answer: "We offer comprehensive tutoring in core subjects including Mathematics, English, Science, and Social Studies, plus test preparation for SAT, ACT, HSC, VCE and GCSE.", order: 0, published: true },
  { id: "2", question: "How do you match students with tutors?", answer: "We carefully match students with tutors based on their learning style, academic needs, and personality — considering subject expertise, teaching style, and student goals.", order: 1, published: true },
  { id: "3", question: "What technology do I need?", answer: "A stable internet connection, a computer or tablet with a webcam, and a quiet space. We use Zoom for our virtual classrooms.", order: 2, published: true },
  { id: "4", question: "How often should my child have sessions?", answer: "Most students benefit from 1–2 sessions per week, but we customise schedules after an initial assessment of your child's learning goals.", order: 3, published: true },
  { id: "5", question: "What makes your teaching approach different?", answer: "Our personalised approach focuses on each student's unique learning style, combining traditional methods with innovative techniques and real-world applications.", order: 4, published: true },
];

export default async function About() {
  const [aboutData, testimonials, faqs] = await Promise.all([
    getSiteContent("about_page").catch(() => null),
    getPublishedTestimonials().catch(() => []),
    getPublishedFaqs().catch(() => []),
  ]);

  const c = { ...ABOUT_DEFAULTS, ...(aboutData ?? {}) } as typeof ABOUT_DEFAULTS;
  const tList = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  const faqList = faqs.length > 0 ? faqs : FALLBACK_FAQS;

  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-black/5 z-10" />
        <Image src={c.heroImage || "/assets/i7.avif"} alt="About" fill className="object-cover" />
        <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6 absolute inset-0 flex items-center z-20">
          <div className="md:w-2/3">
            <h1 className="text-3xl sm:text-5xl xl:text-6xl text-white font-bold leading-tight">{c.heroHeading}</h1>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="w-full max-w-[1250px] mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {[
            { label: "The Vision", text: c.vision, icon: "👁" },
            { label: "The Mission", text: c.mission, icon: "🛡" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 shrink-0 text-2xl">{item.icon}</div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">{item.label}</h3>
                <p className="text-black/70 leading-relaxed text-lg md:text-xl italic">&ldquo;{item.text}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Director's Desk */}
      <section className="w-full max-w-[1250px] mx-auto px-4 md:px-6 py-10 flex flex-col gap-8">
        <h2 className="text-3xl md:text-5xl font-bold">From the Director&apos;s desk</h2>
        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          <div className="md:w-1/3">
            {c.directorImage && (
              <Image src={c.directorImage} alt={c.directorName} width={400} height={400} className="w-full h-[350px] sm:h-[400px] object-cover bg-green-100" />
            )}
            <div className="p-4">
              <p className="font-semibold">{c.directorName}</p>
              <p className="text-black/50 text-sm italic">{c.directorRole}</p>
            </div>
          </div>
          <div className="md:w-2/3 flex flex-col gap-5">
            {c.directorBio.split("\n\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-base lg:text-lg text-black/70 leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="w-full max-w-[1250px] mx-auto px-4 md:px-6 py-14 flex flex-col md:flex-row items-center gap-8 md:gap-14">
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <h2 className="text-3xl md:text-5xl font-bold">{c.storyHeading}</h2>
          <p className="text-base lg:text-lg text-black/70 leading-relaxed">{c.storyBody}</p>
          {c.storyQuote && <p className="font-bold italic text-base lg:text-lg">&ldquo;{c.storyQuote}&rdquo;</p>}
        </div>
        {c.storyImage && (
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <Image src={c.storyImage} alt="Story" width={400} height={500} className="w-full max-w-sm h-72 md:h-96 object-cover" />
          </div>
        )}
      </section>

      {/* Approach */}
      <section className="w-full max-w-[1250px] mx-auto px-4 md:px-6 py-14">
        <div className="flex flex-col gap-4 md:w-3/4">
          <h2 className="text-3xl md:text-5xl font-bold">{c.approachHeading}</h2>
          <p className="text-base lg:text-lg text-black/70">{c.approachBody}</p>
        </div>
        {c.approachImageDesktop && (
          <div className="py-10 hidden md:block">
            <Image src={c.approachImageDesktop} alt="Process" width={1000} height={300} className="w-full h-auto object-contain" />
          </div>
        )}
        {c.approachImageMobile && (
          <div className="py-10 md:hidden">
            <Image src={c.approachImageMobile} alt="Process" width={600} height={600} className="w-full h-auto object-contain" />
          </div>
        )}
      </section>

      {/* Testimonials — client component for interactivity */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-3">{c.testimonialsHeading}</h2>
            <p className="text-base lg:text-lg text-black/70">Real testimonials from our satisfied students and parents</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tList.map((t) => (
              <div key={t.id} className="p-6 sm:p-8 bg-white border border-black/10 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} viewBox="0 0 24 24" className={`w-4 h-4 ${i <= t.rating ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`}>
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                    </svg>
                  ))}
                </div>
                <p className="text-black/70 leading-relaxed italic flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-black/50">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs — client component for accordion */}
      <section className="w-full max-w-[1250px] mx-auto px-4 md:px-6 py-14">
        <h2 className="text-3xl md:text-5xl font-bold mb-3">{c.faqHeading}</h2>
        <p className="text-sm text-black/50 mb-10 max-w-2xl">Our team of experts is always ready to assist you with any questions.</p>
        <AboutClient faqs={faqList} />
      </section>
    </main>
  );
}
