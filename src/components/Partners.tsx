import Image from "next/image";
import { getPublishedPartners } from "@/lib/firestore";

const FALLBACK = [
  { id: "1", name: "DeltaMath", logo: "/assets/dm.png", url: "https://deltamath.com", published: true, order: 0 },
  { id: "2", name: "Education", logo: "/assets/edu.png", url: "", published: true, order: 1 },
  { id: "3", name: "IXL", logo: "/assets/ixl.webp", url: "https://ixl.com", published: true, order: 2 },
  { id: "4", name: "Khan Academy", logo: "/assets/kah.png", url: "", published: true, order: 3 },
  { id: "5", name: "Khan", logo: "/assets/kh.png", url: "", published: true, order: 4 },
  { id: "6", name: "Quizlet", logo: "/assets/qz.png", url: "", published: true, order: 5 },
  { id: "7", name: "Slader", logo: "/assets/sl.jpg", url: "", published: true, order: 6 },
];

async function Partners() {
  let partners = FALLBACK;
  try {
    const data = await getPublishedPartners();
    if (data.length > 0) partners = data as typeof FALLBACK;
  } catch { }

  return (
    <section className="py-4 border-b border-gray-100">
      <div className="w-full max-w-[1250px] mx-auto flex flex-wrap items-center justify-between gap-4 px-4 md:px-6">
        <p className="text-xs text-gray-500 font-medium whitespace-nowrap">Partner with:</p>
        <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
          {partners.map((p) => (
            <a key={p.id} href={p.url || undefined} target={p.url ? "_blank" : undefined} rel="noopener noreferrer"
              className="h-5 sm:h-6 w-auto hover:scale-105 transition-transform duration-200 cursor-pointer">
              <Image src={p.logo} alt={p.name} width={80} height={24} className="h-full w-auto object-contain" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
