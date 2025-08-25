import Button from "@/components/Button";

function Pricing() {
  return (
    <main>
      <section className=" bg-gradient-to-r from-blue-500 via-blue-500 to-blue-400">
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex flex-col gap-10 items-center py-32 px-4 md:px-0">
          <div className="flex flex-col gap-2 items-center pt-20">
            <h1 className="text-4xl font-bold text-white text-center">
              Choose your plan
            </h1>
            <p className="text-sm md:text-lg text-white/50 text-center">
              Our one-on-one private tuition costs justs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 w-full">
            {[
              {
                id: 1,
                title: "Basic plan",
                desc: "Pay as you go",
                price: "$45",
                per: "/hour lesson",
                perks: [
                  "Flexible Scheduling",
                  "No long-term commitment",
                  "Perfect for trial lessons or casual learning",
                ],
              },
              {
                id: 2,
                title: "Standard plan",
                desc: "Growth Plan",
                price: "$855",
                per: "20 classes at $42.75/hr",
                perks: [
                  "2 classes per week (10 weeks)",
                  "Structured learning with consistency",
                  "Progress tracking & Feedback",
                ],
              },
              {
                id: 3,
                title: "Premium plan",
                desc: "Success Plan",
                price: "$1,215",
                per: "30 classes at $40.50/hr",
                perks: [
                  "2 classes per week (15 weeks)",
                  "Strong foundation & measurable improvements",
                  "Best value for long term learning",
                ],
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex gap-10  flex-col rounded-2xl bg-white p-10"
              >
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold">{item.title}</h1>
                  <p>({item.desc})</p>
                </div>
                <div className="flex flex-col gap-1 ">
                  <h1 className="text-6xl font-bold">{item.price}</h1>
                  <p>{item.per}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {item.perks.map((perk) => (
                    <p className="text-xs md:text-sm text-black/50" key={perk}>
                      {perk}
                    </p>
                  ))}
                </div>
                <div className="h-[1px] bg-black/10"></div>
                <div className="flex flex-col gap-1">
                  <h1 className=" font-bold">Free Perks</h1>
                  <p className="text-xs md:text-sm text-black/50">
                    One-on-one personalized tutoring{" "}
                  </p>
                  <p className="text-xs md:text-sm text-black/50">
                    Flexible scheduling options{" "}
                  </p>
                  <p className="text-xs md:text-sm text-black/50">
                    Free initial consultation{" "}
                  </p>
                </div>
                <Button style="link" href="/register">
                  Book your first lesson now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Pricing;
