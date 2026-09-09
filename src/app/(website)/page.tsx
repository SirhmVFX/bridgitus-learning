import HeroVideo from "@/components/marketing/HeroVideo";
import WhoWeAre from "@/components/marketing/WhoWeAre";
import WhyFamiliesStay from "@/components/marketing/WhyFamiliesStay";
import ProgramsSection from "@/components/marketing/ProgramsSection";
import HowItWorksSteps from "@/components/marketing/HowItWorksSteps";
import InsightsSection from "@/components/marketing/InsightsSection";
import PassportShowcase from "@/components/marketing/PassportShowcase";
import FeatureExplorer from "@/components/marketing/FeatureExplorer";
import InteractiveFaq from "@/components/marketing/InteractiveFaq";
import MarketingCta from "@/components/marketing/MarketingCta";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Bridgitus Learning",
  url: "https://www.bridgitus.com",
  description:
    "Personalised online tutoring with the Smart Learning Passport for Mathematics, English, and Science.",
  email: "info@bridgitus.com",
  telephone: "+61433600592",
  areaServed: "AU",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61579279874406",
    "https://www.instagram.com/bridgitus/",
    "https://youtube.com/@BridgitusLearning",
  ],
};

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroVideo />
      <WhoWeAre />
      <WhyFamiliesStay />
      <ProgramsSection />
      <HowItWorksSteps />
      <InsightsSection />
      <PassportShowcase />
      <FeatureExplorer limit={9} />
      <InteractiveFaq />
      <MarketingCta />
    </div>
  );
}
