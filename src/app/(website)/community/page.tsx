import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero, {
  IconCardGrid,
  SplitShowcase,
} from "@/components/marketing/PageHero";
import MarketingCta from "@/components/marketing/MarketingCta";
import {
  IconCommunity,
  IconParent,
  IconSpark,
  IconStudents,
  IconTutor,
} from "@/components/marketing/MarketingIcons";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the Bridgitus learning community — connect with families, tutors, and peers who care about measurable academic growth.",
};

export default function Community() {
  return (
    <main>
      <PageHero
        eyebrow="Community"
        title="Connect, inspire, and thrive with Bridgitus"
        subtitle="Learn alongside families and tutors who celebrate progress — not just grades on a report card."
        crumbs={[{ href: "/community", label: "Community" }]}
        image="/assets/i5.jpg"
        badge="Grow together"
      />

      <section className="mkt-section">
        <div className="mkt-container">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem]">
            <Image
              src="/assets/com.svg"
              alt="Community illustration"
              width={1200}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
          <h2 className="mt-12 text-3xl font-bold text-[#001233] md:text-4xl text-center">
            Why community matters here
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-center text-[#64748b]">
            Bridgitus isn’t a lonely login. Families, students, and tutors share a culture of
            clarity and encouragement.
          </p>
          <div className="mt-10">
            <IconCardGrid
              items={[
                {
                  title: "Peer motivation",
                  body: "Small groups and shared goals keep learning social — without the noise.",
                  icon: <IconStudents />,
                },
                {
                  title: "Parent circle",
                  body: "Plain-language updates so you’re never guessing what’s working.",
                  icon: <IconParent />,
                },
                {
                  title: "Tutor partnership",
                  body: "Expert humans who celebrate wins and close gaps with you.",
                  icon: <IconTutor />,
                },
                {
                  title: "Celebrate mastery",
                  body: "Passport milestones make progress visible — and shareable.",
                  icon: <IconSpark />,
                },
                {
                  title: "Ask & learn",
                  body: "Channels for questions, tips, and encouragement between sessions.",
                  icon: <IconCommunity />,
                },
                {
                  title: "Belonging",
                  body: "A culture that treats every learner’s pathway as unique.",
                  icon: <IconCommunity />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <SplitShowcase
        eyebrow="Stay connected"
        title="Join the channels that fit your family"
        body="Slack and WhatsApp communities keep updates light and human. Prefer a direct conversation? Contact us anytime."
        bullets={[
          "Tutor tips and weekly encouragement",
          "Parent Q&A without chasing reports",
          "Event and workshop announcements",
        ]}
        image="/assets/i8.jpg"
        imageLeft
      >
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/contact"
            className="flex items-center gap-4 rounded-2xl border border-[#001233]/10 bg-white p-5 hover:border-[#00369b]/40 transition"
          >
            <Image src="/assets/slack.svg" alt="" width={48} height={48} className="h-12 w-12" />
            <div>
              <p className="font-semibold text-[#001233]">Slack community</p>
              <p className="text-sm text-[#64748b]">Ask via contact to join</p>
            </div>
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-4 rounded-2xl border border-[#001233]/10 bg-white p-5 hover:border-[#00369b]/40 transition"
          >
            <Image src="/assets/wassap.svg" alt="" width={48} height={48} className="h-12 w-12" />
            <div>
              <p className="font-semibold text-[#001233]">WhatsApp updates</p>
              <p className="text-sm text-[#64748b]">Request access anytime</p>
            </div>
          </Link>
        </div>
      </SplitShowcase>

      <MarketingCta
        title="Ready to belong?"
        body="Register for a diagnostic — or message us to join the family community."
        primaryLabel="Get started"
        secondaryHref="/contact"
        secondaryLabel="Contact us"
        image="/assets/i12.jpg"
      />
    </main>
  );
}
