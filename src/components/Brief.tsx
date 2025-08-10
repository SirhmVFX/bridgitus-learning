import Image from "next/image";
import Button from "./Button";

function Brief() {
  return (
    <section className="bg-gradient-to-b from-black to-black/20 md:h-[calc(100vh-200px)] flex items-center">
      <div className="md:w-[1200px] md:mx-auto flex md:flex-row flex-col-reverse justify-between gap-20 items-center px-4 md:px-0">
        <div className="md:w-1/2 flex flex-col md:gap-5 gap-3 items-start">
          <h1 className="text-white md:text-5xl text-4xl">Bridgitus</h1>
          <p className="text-white/50 text-sm">
            Empowering Every Learner with a Path Made Just for Them
          </p>

          <p className="text-white/80 md:text-lg text-sm">
            A leading online tuition platform committed to delivering
            personalized, high-quality education that empowers students to
            succeed. Founded by a team of dedicated educators, our mission is to
            close the gap between curiosity and understanding, guiding learners
            toward their academic goals from the comfort of their homes. With
            expert tutors and customized support, we ensure every student has
            the tools they need to thrive.
          </p>

          <Button type="button">Bridge the gap</Button>
        </div>

        <div className="md:w-1/2 flex flex-col gap-8 items-start">
          <h1 className="text-white md:text-6xl text-4xl italic">
            “Our services are designed to help you know more, and do more, so
            you can be more.”
          </h1>
          <div className="flex md:gap-5 gap-2 items-center">
            <div className="w-12 h-12 ">
              <Image width={1000} height={1000} src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg" alt="founder" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-white md:text-2xl text-xl">Mr. John Doe</h1>
              <p className="text-white/50 md:text-sm text-xs">Founder, Bridgitus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brief;
