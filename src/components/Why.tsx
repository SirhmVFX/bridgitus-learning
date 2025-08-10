import { Check } from "./Icons";

function Why() {
  return (
    <section className="bg-gradient-to-b from-black/20 to-black/2 ">
      <div className="md:w-[1200px] md:mx-auto flex flex-col gap-10 py-20 px-4 md:px-0">
        
        <div className="bg-white rounded-xl md:p-10 p-6 hover:scale-105 cursor-pointer transition-all">
          <div className="flex flex-col items-start gap-6 md:w-1/2">
            <h1 className="md:text-4xl text-2xl md:leading-none leading-6">
              Seamless Transition From Development to Your Market Audience{" "}
            </h1>
            <p className="md:text-sm text-xs text-black/70">
              Building, testing, and deployment can be challenging tasks, but
              not with LOREON in your corner. For the past three years, we’ve
              consistently worked with global firms across several industries,
              including telecom service providers, media and internet services
              companies, and technology development firms.{" "}
            </p>

            <h1 className="text-lg font-bold">
              LOREON offers expertise solutions in:
            </h1>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 1, title: "emmmm" },
                { id: 2, title: "emmmm" },
                { id: 3, title: "emmmm" },
                { id: 4, title: "emmmm" },
                { id: 5, title: "emmmm" },
              ].map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                    <Check />
                  <p className="text-xs">{e.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div></div>
        </div>

        <div className="flex md:flex-row flex-col gap-10">
        <div className="bg-blue-500 rounded-xl md:p-10 p-6 hover:scale-105 cursor-pointer transition-all">
          <div className="flex flex-col items-start gap-6">
            <h1 className="md:text-4xl text-2xl md:leading-none leading-6">
              Seamless Transition From Development to Your Market Audience{" "}
            </h1>
            <p className="md:text-sm text-xs text-black/70">
              Building, testing, and deployment can be challenging tasks, but
              not with LOREON in your corner. For the past three years, we’ve
              consistently worked with global firms across several industries,
              including telecom service providers, media and internet services
              companies, and technology development firms.{" "}
            </p>

            <h1 className="text-lg font-bold">
              LOREON offers expertise solutions in:
            </h1>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 1, title: "emmmm" },
                { id: 2, title: "emmmm" },
                { id: 3, title: "emmmm" },
                { id: 4, title: "emmmm" },
                { id: 5, title: "emmmm" },
              ].map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                    <Check />
                  <p className="text-xs">{e.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div></div>
        </div>

        <div className="bg-black rounded-xl md:p-10 p-6 hover:scale-105 cursor-pointer transition-all text-white">
          <div className="flex flex-col items-start gap-6 ">
            <h1 className="md:text-4xl text-2xl md:leading-none leading-6">
              Seamless Transition From Development to Your Market Audience{" "}
            </h1>
            <p className="md:text-sm text-xs text-white/70">
              Building, testing, and deployment can be challenging tasks, but
              not with LOREON in your corner. For the past three years, we’ve
              consistently worked with global firms across several industries,
              including telecom service providers, media and internet services
              companies, and technology development firms.{" "}
            </p>

            <h1 className="text-lg font-bold">
              LOREON offers expertise solutions in:
            </h1>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 1, title: "emmmm" },
                { id: 2, title: "emmmm" },
                { id: 3, title: "emmmm" },
                { id: 4, title: "emmmm" },
                { id: 5, title: "emmmm" },
              ].map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                    <Check />
                  <p className="text-xs">{e.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div></div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default Why;
