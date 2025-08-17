import Cta from "@/components/Cta";
import { Verified } from "@/components/Icons";
import Offer from "@/components/Offer";
import Why from "@/components/Why";

function Services() {
  return (
    <div className="md:pt-32">
      <Why />
      <section className="bg-black">
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto grid grid-cols-3 ">
          <div className="flex items-center gap-2 p-6 bg-black/30">
            <Verified />
            <h1 className="text-white md:text-lg text-xs">Boost Confidence</h1>
          </div>

          <div className="flex items-center gap-2 p-6 bg-black/60">
            <Verified />
            <h1 className="text-white md:text-lg text-xs">Improve Marks</h1>
          </div>

          <div className="flex items-center gap-2 p-6 bg-black/90">
            <Verified />
            <h1 className="text-white md:text-lg text-xs">
              Realise Potentials
            </h1>
          </div>
        </div>
      </section>
      <Offer />
      <Cta />
    </div>
  );
}

export default Services;
