import Image from "next/image";
import Button from "./Button";

function Brief() {
  return (
    <section className="bg-gradient-to-b from-black to-black/20 h-[calc(100vh-200px)] flex items-center">
      <div className="w-[1200px] mx-auto flex justify-between gap-20 items-center">
        <div className="w-1/2 flex flex-col gap-5 items-start">
          <h1 className="text-white text-5xl">Bridgitus</h1>
          <p className="text-white/50 text-sm">
            Empowering Every Learner with a Path Made Just for Them
          </p>

          <p className="text-white/80 text-lg">
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

        <div className="w-1/2 flex flex-col gap-8 items-start">
          <h1 className="text-white text-6xl italic">
            “Our services are designed to help you know more, and do more, so
            you can be more.”
          </h1>
          <div className="flex gap-5 items-center">
            <div className="w-12 h-12 ">
              <Image width={1000} height={1000} src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg" alt="founder" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-white text-2xl">Mr. John Doe</h1>
              <p className="text-white/50 text-sm">Founder, Bridgitus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brief;
