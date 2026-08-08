import Cta from "@/components/Cta";
import Offer from "@/components/Offer";
import Why from "@/components/Why";
import { getSiteContent } from "@/lib/firestore";

const DEFAULT_BADGES = [
  { label: "Boost Confidence" },
  { label: "Improve Marks" },
  { label: "Realise Potentials" },
];

function Verified() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export default async function Services() {
  let badges = DEFAULT_BADGES;
  try {
    const d = await getSiteContent("service_badges");
    if (d && Array.isArray((d as Record<string, unknown>).badges)) {
      badges = ((d as Record<string, unknown[]>).badges as typeof DEFAULT_BADGES);
    }
  } catch { }

  return (
    <div className="pt-28 sm:pt-32">
      <Why />
      <section className="bg-black">
        <div className="w-full max-w-[1250px] mx-auto grid grid-cols-3">
          {badges.map((b, i) => (
            <div key={i} className={`flex items-center gap-2 p-5 sm:p-6 ${i === 0 ? "bg-black/30" : i === 1 ? "bg-black/60" : "bg-black/90"}`}>
              <Verified />
              <span className="text-white text-xs sm:text-base font-medium">{b.label}</span>
            </div>
          ))}
        </div>
      </section>
      <Offer />
      <Cta />
    </div>
  );
}
