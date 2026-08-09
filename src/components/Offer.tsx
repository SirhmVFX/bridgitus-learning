import { getPublishedServices, getSiteContent, type SiteService } from "@/lib/firestore";

const FALLBACK_OFFER: SiteService[] = [
  { id: "1", title: "Fully Interactive Classes", description: "Engage in real-time with whiteboards, live chat and screen sharing.", icon: "🖥️", section: "offer", published: true, order: 0 },
  { id: "2", title: "Real-time Feedback", description: "Get instant feedback from expert tutors during every session.", icon: "💬", section: "offer", published: true, order: 1 },
  { id: "3", title: "100% Personalized", description: "Every lesson plan is crafted around your child's unique learning needs.", icon: "🎯", section: "offer", published: true, order: 2 },
  { id: "4", title: "Progress Tracking", description: "Monitor improvement with detailed reports and performance analytics.", icon: "📊", section: "offer", published: true, order: 3 },
  { id: "5", title: "Flexible Scheduling", description: "Book sessions that fit your schedule — mornings, evenings or weekends.", icon: "📅", section: "offer", published: true, order: 4 },
  { id: "6", title: "Expert Tutors", description: "All tutors are qualified educators with proven track records.", icon: "🏆", section: "offer", published: true, order: 5 },
];

const DEFAULT_REQUIREMENTS = [
  { icon: "💻", label: "Computer or Tablet" },
  { icon: "📷", label: "Webcam" },
  { icon: "🌐", label: "Stable Internet" },
  { icon: "🎧", label: "Headset (optional)" },
];

async function Offer() {
  let items: SiteService[] = [];
  let req = DEFAULT_REQUIREMENTS;

  try { items = await getPublishedServices("offer"); } catch { }
  if (items.length === 0) items = FALLBACK_OFFER;

  // "What You Need" section editable via admin → siteContent "requirements"
  try {
    const d = await getSiteContent("requirements");
    if (d && Array.isArray((d as Record<string, unknown>).items)) {
      req = (d as { items: typeof DEFAULT_REQUIREMENTS }).items;
    }
  } catch { }

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">What We Offer</h2>
          <p className="text-black/50 text-base sm:text-lg max-w-2xl mx-auto">
            Everything you need to support your child&apos;s academic journey in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 p-6 hover:border-secondary-color/30 transition-colors">
              {item.icon && <div className="text-3xl mb-3">{item.icon}</div>}
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-black/50 text-sm leading-relaxed">{item.description}</p>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {(item.bullets as string[]).filter(Boolean).map((b: string, i: number) => (
                    <li key={i} className="text-xs text-black/50 flex items-start gap-2">
                      <span className="text-secondary-color mt-0.5">•</span>{b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="bg-secondary-color p-8 sm:p-10">
          <h3 className="text-white font-bold text-xl sm:text-2xl mb-6 text-center">What You Need to Get Started</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {req.map((r) => (
              <div key={r.label} className="text-center">
                <div className="text-4xl mb-2">{r.icon}</div>
                <p className="text-white/80 text-sm font-medium">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Offer;
