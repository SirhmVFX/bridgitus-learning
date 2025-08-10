import Brief from "@/components/Brief";
import HeroSection from "@/components/Herosection";
import { Verified } from "@/components/Icons";
import Partners from "@/components/Partners";
import Why from "@/components/Why";


export default function Home() {
  return (
    <div>
     <HeroSection />
     <Brief />
     <Partners />
     <Why />

     <section className="bg-black">
      <div className="md:w-[1200px] md:mx-auto grid grid-cols-3 ">
        <div className="flex items-center gap-2 p-6 bg-black/30">
         <Verified />
          <h1 className="text-white">Boost Confidence</h1>
        </div>

        <div className="flex items-center gap-2 p-6 bg-black/60">
          <Verified />
          <h1 className="text-white">Improve Marks</h1>
        </div>

        <div className="flex items-center gap-2 p-6 bg-black/90">
          <Verified />
          <h1 className="text-white">Realise Potentials</h1>
        </div>
      </div>
     </section>
    </div>
  );
}
