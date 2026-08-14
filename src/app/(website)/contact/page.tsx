import { getSiteContent } from "@/lib/firestore";
import ContactForm from "./_ContactForm";

// Always fetch latest CMS content (admin edits must show immediately)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULTS = { email: "info@bridgitus.com", phone: "+61 433 600 592", altPhone: "0434742393" };

export default async function Contact() {
  let ci = DEFAULTS;
  try {
    const d = await getSiteContent("contact_info");
    if (d) {
      const raw = d as Partial<typeof DEFAULTS>;
      ci = {
        ...DEFAULTS,
        ...raw,
        email: typeof raw.email === "string" && raw.email.trim() ? raw.email : DEFAULTS.email,
        phone: typeof raw.phone === "string" && raw.phone.trim() ? raw.phone : DEFAULTS.phone,
        altPhone: typeof raw.altPhone === "string" && raw.altPhone.trim() ? raw.altPhone : DEFAULTS.altPhone,
      };
    }
  } catch (err) {
    console.error("contact_info load failed:", err);
  }

  return (
    <main>
      <section id="contact" className="pt-28 sm:pt-32 md:pt-40 bg-background pb-16">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">📞 Contact Us</h2>
            <p className="text-base sm:text-lg text-black/70">
              Ready to start your learning journey? Reach out to us for more information or to schedule a session!
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-10">
            {[
              { icon: "📧", label: "Email", value: ci.email, href: `mailto:${ci.email}` },
              { icon: "📱", label: "Phone", value: ci.phone, href: `tel:${ci.phone?.replace(/\s/g, "")}` },
              { icon: "☎️", label: "Alternate Phone", value: ci.altPhone, href: ci.altPhone ? `tel:${ci.altPhone?.replace(/\s/g, "")}` : undefined },
            ].map((c) => (
              <div key={c.label} className="p-6 bg-white border border-black/10 text-center">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-semibold mb-1">{c.label}</h3>
                {c.href && c.value ? (
                  <a href={c.href} className="text-black/70 hover:text-secondary-color transition-colors text-sm">{c.value}</a>
                ) : (
                  <p className="text-black/40 text-sm italic">Not set</p>
                )}
              </div>
            ))}
          </div>

          {/* Client-side form */}
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
