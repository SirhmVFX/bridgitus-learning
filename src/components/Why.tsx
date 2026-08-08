import Image from "next/image";
import { getPublishedServices, type SiteService } from "@/lib/firestore";

const FALLBACK: SiteService[] = [
  { id: "1", title: "One-on-One Tutoring", description: "Personalised sessions tailored to each student's learning pace and style.", image: "/assets/i6.jpg", section: "why", published: true, order: 0, bullets: ["Dedicated tutor for every student", "Sessions aligned to school curriculum", "Regular progress reports"] },
  { id: "2", title: "Group Learning", description: "Collaborative sessions that build confidence and communication skills.", image: "/assets/i8.jpg", section: "why", published: true, order: 1, bullets: ["Small groups of 3–5 students", "Peer learning and discussion", "More affordable than 1:1"] },
  { id: "3", title: "Exam Preparation", description: "Structured programs for HSC, VCE, NAPLAN, selective school and scholarship exams.", image: "/assets/i9.jpg", section: "why", published: true, order: 2, bullets: ["Past paper practice", "Time management strategies", "Exam technique coaching"] },
];

async function Why() {
  let items: SiteService[] = [];
  try { items = await getPublishedServices("why"); } catch { }
  if (items.length === 0) items = FALLBACK;

  return (
    <section className="py-16 sm:py-20">
      <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Why Choose Bridgitus?</h2>
          <p className="text-black/50 text-base sm:text-lg max-w-2xl mx-auto">
            We offer flexible, expert-led tutoring for every stage of your child&apos;s education.
          </p>
        </div>
        <div className="space-y-12 sm:space-y-16">
          {items.map((item, i) => (
            <div key={item.id} className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 sm:gap-12 items-center`}>
              {item.image && (
                <div className="w-full md:w-1/2">
                  <Image src={item.image} alt={item.title} width={600} height={400}
                    className="w-full h-56 sm:h-72 md:h-80 object-cover" />
                </div>
              )}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <h3 className="text-2xl sm:text-3xl font-bold">{item.title}</h3>
                <p className="text-black/60 text-base leading-relaxed">{item.description}</p>
                {item.bullets && (item.bullets as string[]).filter(Boolean).length > 0 && (
                  <ul className="space-y-2">
                    {(item.bullets as string[]).filter(Boolean).map((b: string, bi: number) => (
                      <li key={bi} className="flex items-start gap-2 text-sm text-black/70">
                        <span className="text-secondary-color font-bold mt-0.5">✓</span>{b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Why;
