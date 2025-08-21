import Button from "@/components/Button";

function Pricing() {
  return (
    <main>
      <section className=" bg-black">
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex flex-col gap-10 items-center py-20 px-4 md:px-0">
          <div className="flex flex-col gap-2 items-center pt-20">
            <h1 className="text-2xl text-white text-center">
              Affordable, contract-free and packed full of value
            </h1>
            <p className="text-sm md:text-lg text-white/50 text-center">
              Our one-on-one private tuition costs justs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 w-full">
            <div className="flex gap-10 items-center flex-col bg-white p-10">
              <div className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Online</h1>
                <p>Anytime, anywhere</p>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <h1 className="text-4xl">$45</h1>
                <p>Per hour lesson</p>
              </div>
              <Button style="link" href="/register">
                Book your first lesson now
              </Button>
            </div>

            <div className="flex gap-10 items-center flex-col bg-white p-10">
              <div className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">In your home</h1>
                <p>In-person lessons</p>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <h1 className="text-4xl">$80</h1>
                <p>Per hour lesson</p>
                <p>$1 per km applies after the initial free 60km</p>
              </div>
              <Button style="link" href="/register">
                Book your first lesson now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Pricing;
