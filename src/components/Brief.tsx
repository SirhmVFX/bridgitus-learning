import Button from "./Button";

function Brief() {
  return (
    <section className="bg-gradient-to-b from-black to-black/20 md:h-screen h-fit flex items-center md:pb-0 pb-36">
      <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex md:flex-row flex-col-reverse justify-between gap-20 items-center px-4 md:px-0">
        <div className="md:w-1/2 flex flex-col md:gap-5 gap-3 items-start">
          <h1 className="text-white md:text-4xl text-2xl font-bold">
            Bridgitus
          </h1>
          <p className="text-white/50 text-sm">
            Empowering Every Learner with a Path Made Just for Them
          </p>

          <p className="text-white/80 md:text-base text-sm">
            A leading online tuition platform committed to delivering
            personalized, high-quality education that empowers students to
            succeed. Founded by a team of dedicated educators, our mission is to
            close the gap between curiosity and understanding, guiding learners
            toward their academic goals from the comfort of their homes. With
            expert tutors and customized support, we ensure every student has
            the tools they need to thrive.
          </p>

          <Button type="link" href="/register">
            Bridge the gap
          </Button>
        </div>

        <div className="md:w-1/2 flex flex-col gap-8 items-start">
          <h1 className="text-white md:text-3xl text-2xl italic">
            “Let your passion for learning be louder than your doubts, your
            dreams brighter than your fears, and your determinations stronger
            than your excuses.”
          </h1>
          <div className="flex md:gap-5 gap-2 items-center">
            <div>
              <h1 className="text-white md:text-base text-sm">
                Phemmie Olugbogi
              </h1>
              <p className="text-white/50 md:text-sm text-xs">
                Founder, Bridgitus Learning
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brief;
