import Button from "@/components/Button";
import { Check, Commit, Schedule, Trial } from "@/components/Icons";

function Pricing() {
  return (
    <main>
      <section className=" ">
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex flex-col gap-10 items-center py-32 px-4 md:px-0">
          <div className="flex flex-col gap-2 items-center pt-20">
            <h1 className="text-4xl font-bold  text-center">
              Choose your plan
            </h1>
            <p className="text-sm md:text-lg text-black/50 text-center">
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
                  { id: 1, desc: "Flexible Scheduling", icon: <Schedule /> },
                  { id: 2, desc: "No long-term commitment", icon: <Commit /> },
                  {
                    id: 3,
                    desc: "Perfect for trial lessons or casual learning",
                    icon: <Trial />,
                  },
                ],
              },
              {
                id: 2,
                title: "Standard plan",
                desc: "Growth Plan",
                price: "$855",
                per: "20 classes at $42.75/hr",
                perks: [
                  {
                    id: 1,
                    desc: "2 classes per week (10 weeks)",
                    icon: <Schedule />,
                  },
                  {
                    id: 2,
                    desc: "Structured learning with consistency",
                    icon: <Commit />,
                  },
                  {
                    id: 3,
                    desc: "Progress tracking & Feedback",
                    icon: <Trial />,
                  },
                ],
              },
              {
                id: 3,
                title: "Premium plan",
                desc: "Success Plan",
                price: "$1,215",
                per: "30 classes at $40.50/hr",

                perks: [
                  {
                    id: 1,
                    desc: "2 classes per week (15 weeks)",
                    icon: <Schedule />,
                  },
                  {
                    id: 2,
                    desc: "Strong foundation & measurable improvements",
                    icon: <Commit />,
                  },
                  {
                    id: 3,
                    desc: "Best value for long term learning",
                    icon: <Trial />,
                  },
                ],
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex gap-10 hover:bg-blue-100/50 transition-all hover:scale-105 hover:border-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-300 cursor-pointer flex-col rounded-2xl bg-gray-50/20 border border-black/10 p-10"
              >
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold">{item.title}</h1>
                  <p>({item.desc})</p>
                </div>
                <div className="flex flex-col gap-1 ">
                  <h1 className="text-6xl font-bold">{item.price}</h1>
                  <p>{item.per}</p>
                </div>
                <Button
                  variant={`${item.id === 2 ? "filled" : "outline"}`}
                  style="link"
                  href="/register"
                >
                  Book your first lesson now
                </Button>
                <div className="flex flex-col gap-1">
                  {item.perks.map((perk) => (
                    <div key={perk.id} className="flex gap-2">
                      {perk.icon}
                      <p className="text-xs md:text-sm text-black/50">
                        {perk.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-[1px] bg-black/10"></div>
                <div className="flex flex-col gap-1">
                  <h1 className=" font-bold">Free Perks</h1>
                  <div className="flex gap-2">
                    <Check className="text-green-500 w-4 h-4" />
                    <p className="text-xs md:text-sm text-black/50">
                      One-on-one personalized tutoring{" "}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Check className="text-green-500 w-4 h-4" />

                    <p className="text-xs md:text-sm text-black/50">
                      Flexible scheduling options{" "}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Check className="text-green-500 w-4 h-4" />

                    <p className="text-xs md:text-sm text-black/50">
                      Free initial consultation{" "}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Pricing;
