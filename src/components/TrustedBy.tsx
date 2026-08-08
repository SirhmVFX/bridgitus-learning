import { getSiteContent } from "@/lib/firestore";

const DEFAULTS = {
  stat1Label: "100% Positive Feedback",
  stat1Sub: "Over 100+ positive feedback",
  stat2Label: "99% Success Rate",
  stat2Sub: "Students who stick with us succeed",
  stat3Label: "24/7 Expert Support",
  stat3Sub: "Always here when you need help",
};

async function TrustedBy() {
  let stats = DEFAULTS;
  try {
    const d = await getSiteContent("stats");
    if (d) stats = { ...DEFAULTS, ...(d as typeof DEFAULTS) };
  } catch { }

  const items = [
    { label: stats.stat1Label, sub: stats.stat1Sub },
    { label: stats.stat2Label, sub: stats.stat2Sub },
    { label: stats.stat3Label, sub: stats.stat3Sub },
  ];

  return (
    <section className="py-12 sm:py-16 bg-secondary-color">
      <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p className="text-white text-xl sm:text-2xl font-bold">{item.label}</p>
              <p className="text-white/60 text-sm">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;
