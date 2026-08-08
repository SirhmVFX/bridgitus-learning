import Button from "./Button";
import { getSiteContent } from "@/lib/firestore";

const DEFAULTS = {
  heading: "Bridgitus",
  tagline: "Empowering Every Learner with a Path Made Just for Them",
  body: "A leading online tuition platform committed to delivering personalized, high-quality education that empowers students to succeed. Founded by a team of dedicated educators, our mission is to close the gap between curiosity and understanding, guiding learners toward their academic goals from the comfort of their homes.",
  quote: "Let your passion for learning be louder than your doubts, your dreams brighter than your fears, and your determination stronger than your excuses.",
  quoteAuthor: "Femi Olugbogi",
  quoteRole: "Founder, Bridgitus Learning",
  ctaLabel: "Bridge the gap",
};

async function Brief() {
  const data = await getSiteContent("brief").catch(() => null);
  const c = { ...DEFAULTS, ...(data ?? {}) } as typeof DEFAULTS;

  return (
    <section className="bg-gradient-to-b from-black to-black/20 min-h-screen flex items-center py-16 md:py-0">
      <div className="w-full max-w-[1250px] mx-auto flex md:flex-row flex-col-reverse justify-between gap-10 lg:gap-20 items-center px-4 md:px-6">
        <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-5 items-start">
          <h1 className="text-white text-2xl md:text-4xl font-bold">{c.heading}</h1>
          <p className="text-white/50 text-sm">{c.tagline}</p>
          <div className="text-white/80 text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: c.body.includes("<") ? c.body : `<p>${c.body}</p>` }} />
          <Button style="link" href="/register">{c.ctaLabel}</Button>
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-6 items-start">
          {c.quote && (
            <h2 className="text-white text-xl md:text-3xl italic leading-relaxed">
              &ldquo;{c.quote}&rdquo;
            </h2>
          )}
          <div>
            <p className="text-white text-sm md:text-base">{c.quoteAuthor}</p>
            <p className="text-white/50 text-xs md:text-sm">{c.quoteRole}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brief;
