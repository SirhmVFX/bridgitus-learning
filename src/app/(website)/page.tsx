import Brief from "@/components/Brief";
import HeroSection from "@/components/Herosection";
import Partners from "@/components/Partners";
import TrustedBy from "@/components/TrustedBy";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Brief />
      <Partners />
      <TrustedBy />
    </div>
  );
}
