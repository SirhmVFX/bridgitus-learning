import Brief from "@/components/Brief";
import Cta from "@/components/Cta";
import HeroSection from "@/components/Herosection";
import Partners from "@/components/Partners";

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
