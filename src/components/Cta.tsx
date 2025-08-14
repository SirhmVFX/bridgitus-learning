import Image from "next/image";
import Button from "./Button";

function Cta() {
  return (
    <section className="bg-black  relative py-10 flex items-center justify-center md:h-[250px] lg:h-[300px] xl:h-[400px] h-[300px] ">
      <Image
        src="/assets/line2.png"
        alt="cta"
        width={1000}
        height={1000}
        className="w-full h-full object-cover absolute top-0 left-0 bottom-0"
      />

      <div className="flex flex-col gap-5 items-center justify-center absolute top-0 left-0 bottom-0 right-0 ">
        <h1 className="md:w-2/3 text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white text-center">
          Every class is an opportunity to succeed and an experience to remember
          for the future.{" "}
        </h1>
        <p className="text-sm md:text-lg text-white/50">
          Ready to take the first step?
        </p>
        <Button type="link" href="register">
          Book your first session
        </Button>
      </div>
    </section>
  );
}

export default Cta;
