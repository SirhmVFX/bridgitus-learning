import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone } from "./Icons";
import Image from "next/image";
import { getSiteContent } from "@/lib/firestore";

const DEFAULTS = {
  email: "info@bridgitus.com", phone: "+61433600592",
  abn: "16146552112", facebook: "https://www.facebook.com/profile.php?id=61579279874406",
  instagram: "https://www.instagram.com/bridgitus/",
  linkedin: "https://www.linkedin.com/in/bridgitus-learning-538390383",
  youtube: "https://youtube.com/@BridgitusLearning",
};

async function Footer() {
  const data = await getSiteContent("contact_info").catch(() => null);
  const c = { ...DEFAULTS, ...(data ?? {}) } as typeof DEFAULTS;

  return (
    <footer className="bg-blue-500 py-10 md:py-14 xl:py-20 px-4">
      <div className="w-full max-w-[1250px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
        <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
          <div className="w-[140px] sm:w-[180px]">
            <Image src="/assets/logof.png" alt="logo" width={1000} height={1000} />
          </div>
          {c.phone && (
            <div className="flex items-center gap-2">
              <Phone />
              <Link href={`tel:${c.phone}`} className="text-xs text-white/50">{c.phone}</Link>
            </div>
          )}
          {c.email && (
            <div className="flex items-center gap-2">
              <Mail />
              <Link href={`mailto:${c.email}`} className="text-xs text-white/50">{c.email}</Link>
            </div>
          )}
          {c.abn && <p className="text-xs text-white/50">ABN: {c.abn}</p>}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm text-white font-semibold">Legal</h2>
          {[
            { title: "Terms & Conditions", url: "/terms-and-conditions" },
            { title: "Code of Conduct", url: "/code-of-conduct" },
            { title: "Privacy & Data Protection", url: "/privacy-and-data-protection" },
            { title: "Privacy Policy", url: "/privacy-policy" },
          ].map((e) => (
            <Link key={e.url} className="text-xs text-white/50 hover:text-white transition-colors" href={e.url}>{e.title}</Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm text-white font-semibold">Company</h2>
          {[
            { title: "About Us", url: "/about" },
            { title: "Contact", url: "/contact" },
            { title: "Classes", url: "/classes" },
            { title: "Services", url: "/services" },
            { title: "Student Portal", url: "/portal" },
          ].map((e) => (
            <Link key={e.url} className="text-xs text-white/50 hover:text-white transition-colors" href={e.url}>{e.title}</Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm text-white font-semibold">Socials</h2>
          <div className="flex gap-2">
            {[
              { url: c.facebook, icon: <Facebook /> },
              { url: c.instagram, icon: <Instagram /> },
              { url: c.linkedin, icon: <Linkedin /> },
              { url: c.youtube, icon: <Youtube /> },
            ].filter((s) => s.url).map((s, i) => (
              <Link key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="bg-white/10 p-2 hover:bg-white/20 transition-colors">{s.icon}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
