import Button from "@/components/Button";
import { getPublishedClasses, type SiteClass } from "@/lib/firestore";
import Image from "next/image";

const FALLBACK: SiteClass[] = [
  { id: "1", title: "Regular Tutoring", grades: "All grades", description: "Ongoing weekly sessions covering all core subjects.", subjects: ["Maths", "English", "Science"], type: "one-on-one", published: true, order: 0 },
  { id: "2", title: "Special Math Class", grades: "K–12", description: "Intensive maths coaching from foundational to advanced levels.", subjects: ["Maths", "Statistics", "Calculus"], type: "one-on-one", published: true, order: 1 },
  { id: "3", title: "Special Science Class", grades: "7–12", description: "Deep-dive science sessions covering Physics, Chemistry and Biology.", subjects: ["Physics", "Chemistry", "Biology"], type: "one-on-one", published: true, order: 2 },
  { id: "4", title: "Special English Class", grades: "K–12", description: "Build reading, writing and comprehension skills.", subjects: ["English", "Literature", "Writing"], type: "one-on-one", published: true, order: 3 },
  { id: "5", title: "HSC Class", grades: "11–12", description: "Targeted HSC preparation with past paper practice.", subjects: ["All HSC subjects"], type: "group", published: true, order: 4 },
  { id: "6", title: "VCE Class", grades: "11–12", description: "Comprehensive VCE coaching aligned to the curriculum.", subjects: ["All VCE subjects"], type: "group", published: true, order: 5 },
  { id: "7", title: "Scholarship Preparatory Class", grades: "K–10", description: "Structured preparation for ACER, Edutest and scholarship exams.", subjects: ["Maths", "English", "Reasoning"], type: "group", published: true, order: 6 },
  { id: "8", title: "College Preparatory Class", grades: "9–12", description: "University readiness coaching — ATAR and applications.", subjects: ["All subjects", "Study Skills"], type: "one-on-one", published: true, order: 7 },
];

const TYPE_COLOR: Record<string, string> = {
  "one-on-one": "bg-secondary-color text-white",
  group: "bg-emerald-600 text-white",
  online: "bg-amber-500 text-white",
};
const TYPE_LABEL: Record<string, string> = {
  "one-on-one": "1:1",
  group: "Group",
  online: "Online",
};

export default async function ClassesPage() {
  let classes: SiteClass[] = [];
  try { classes = await getPublishedClasses(); } catch { }
  if (classes.length === 0) classes = FALLBACK;

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center bg-secondary-color overflow-hidden">
        <div className="absolute inset-0 bg-secondary-color/90 z-10" />
        <div className="relative z-20 text-center px-4 py-20 sm:py-32">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Our Classes</h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            Expert-led tutoring tailored to every grade and learning goal.
          </p>
        </div>
      </section>

      {/* Classes grid */}
      <section className="py-16 sm:py-20">
        <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {classes.map((c) => (
              <div key={c.id} id={c.title.toLowerCase().replace(/\s+/g, "-")}
                className="flex flex-col gap-4 border border-gray-200 bg-white p-6 hover:border-secondary-color/40 transition-colors">
                {c.image && (
                  <Image src={c.image} alt={c.title} width={400} height={200} className="w-full h-36 object-cover" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg leading-tight flex-1">{c.title}</h3>
                  <span className={`text-xs font-bold px-2 py-1 shrink-0 ${TYPE_COLOR[c.type] ?? TYPE_COLOR["one-on-one"]}`}>
                    {TYPE_LABEL[c.type] ?? c.type}
                  </span>
                </div>
                {c.grades && <p className="text-xs text-gray-400 font-medium">Grades: {c.grades}</p>}
                <p className="text-sm text-black/60 leading-relaxed flex-1">{c.description}</p>
                {c.subjects && c.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {c.subjects.slice(0, 4).map((s) => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5">{s}</span>
                    ))}
                    {c.subjects.length > 4 && <span className="text-xs text-gray-400">+{c.subjects.length - 4} more</span>}
                  </div>
                )}
                <Button style="link" href="/register">Book Now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gray-50">
        <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Not sure which class is right?</h2>
          <p className="text-black/50 text-base mb-6 max-w-xl mx-auto">Register and we&apos;ll match your child to the perfect programme after a free assessment.</p>
          <Button style="link" href="/register">Get a Free Assessment</Button>
        </div>
      </section>
    </main>
  );
}
