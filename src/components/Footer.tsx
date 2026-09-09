import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone } from "./Icons";
import { getSiteContent } from "@/lib/firestore";
import { SEO_PAGES } from "@/lib/marketingContent";

const DEFAULTS = {
  email: "info@bridgitus.com",
  phone: "+61433600592",
  abn: "16146552112",
  facebook: "https://www.facebook.com/profile.php?id=61579279874406",
  instagram: "https://www.instagram.com/bridgitus/",
  linkedin: "https://www.linkedin.com/in/bridgitus-learning-538390383",
  youtube: "https://youtube.com/@BridgitusLearning",
};

export default async function Footer() {
  const data = await getSiteContent("contact_info").catch(() => null);
  const c = { ...DEFAULTS, ...(data ?? {}) } as typeof DEFAULTS;

  return (
    <footer className="bg-[#001233] text-white">
      <div className="mkt-container py-14 md:py-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="w-[160px]">
            <Image src="/assets/logof.png" alt="Bridgitus" width={320} height={120} />
          </div>
          <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-xs">
            Measurable online learning for Maths, English, and Science — powered by the Smart
            Learning Passport.
          </p>
          <div className="mt-4 space-y-2 text-sm text-white/55">
            {c.phone && (
              <Link href={`tel:${c.phone}`} className="flex items-center gap-2 hover:text-white">
                <Phone /> {c.phone}
              </Link>
            )}
            {c.email && (
              <Link href={`mailto:${c.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail /> {c.email}
              </Link>
            )}
            {c.abn && <p>ABN: {c.abn}</p>}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-white/90">Explore</h2>
          <div className="mt-4 flex flex-col gap-2">
            {[
              { title: "About", url: "/about" },
              { title: "Features", url: "/features" },
              { title: "How it works", url: "/how-it-works" },
              { title: "Pricing", url: "/pricing" },
              { title: "Classes", url: "/classes" },
              { title: "Contact", url: "/contact" },
              { title: "Student Portal", url: "/portal/login" },
            ].map((e) => (
              <Link key={e.url} href={e.url} className="text-sm text-white/50 hover:text-[#00c1ff]">
                {e.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-white/90">Learning</h2>
          <div className="mt-4 flex flex-col gap-2">
            {SEO_PAGES.map((e) => (
              <Link key={e.href} href={e.href} className="text-sm text-white/50 hover:text-[#00c1ff]">
                {e.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-white/90">Legal</h2>
          <div className="mt-4 flex flex-col gap-2">
            {[
              { title: "Terms & Conditions", url: "/terms-and-conditions" },
              { title: "Code of Conduct", url: "/code-of-conduct" },
              { title: "Privacy & Data Protection", url: "/privacy-and-data-protection" },
              { title: "Privacy Policy", url: "/privacy-policy" },
            ].map((e) => (
              <Link key={e.url} href={e.url} className="text-sm text-white/50 hover:text-[#00c1ff]">
                {e.title}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            {[
              { url: c.facebook, icon: <Facebook /> },
              { url: c.instagram, icon: <Instagram /> },
              { url: c.linkedin, icon: <Linkedin /> },
              { url: c.youtube, icon: <Youtube /> },
            ]
              .filter((s) => s.url)
              .map((s, i) => (
                <Link
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/10 p-2 hover:bg-[#00c1ff]/20 transition"
                >
                  {s.icon}
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mkt-container py-5 text-xs text-white/40 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Bridgitus Learning. All rights reserved.</span>
          <span>Measurable learning. Real mastery.</span>
        </div>
      </div>
    </footer>
  );
}
