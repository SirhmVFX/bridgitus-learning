import Brief from "@/components/Brief";
import HeroSection from "@/components/Herosection";
import Partners from "@/components/Partners";
import TrustedBy from "@/components/TrustedBy";
import Cta from "@/components/Cta";

// All components are Server Components — no "use client" needed here
export default function Home() {
  return (
    <div>
      <HeroSection />
      {/* brief */}
      <Brief />
      <Partners />
      <TrustedBy />
      <Cta />
    </div>
  );
}
