import Brief from "@/components/Brief";
import Cta from "@/components/Cta";
import HeroSection from "@/components/Herosection";
import { Verified } from "@/components/Icons";
import Offer from "@/components/Offer";
import Partners from "@/components/Partners";
import Why from "@/components/Why";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Brief />
      <Partners />
      <Cta />
    </div>
  );
}
