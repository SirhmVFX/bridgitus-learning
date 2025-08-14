function Offer() {
  return (
    <section>
      <div className="md:w-[1000px] md:mx-auto flex flex-col items-center justify-center gap-10 py-20 px-4 md:px-0">
        <h1 className="text-2xl font-bold md:text-center">
          Why Choose Bridgitus Learning?
        </h1>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-6 ">
          {[
            {
              id: 1,
              title:
                "Fully interactive classes – face-to-face lessons with dynamic online whiteboard",
              color: "bg-red-500/10",
              textcolor: "text-red-500/10",
            },
            {
              id: 2,
              title:
                "Verbal and written correction and instruction provided in real-time, for real learning",
              color: "bg-green-500/10",
              textcolor: "text-green-500/10",
            },
            {
              id: 3,
              title: "100% tailored to your child’s needs",
              color: "bg-purple-/10",
              textcolor: "text-purple-500/10",
            },
            {
              id: 4,
              title:
                "Private sessions – your child will not see or hear anyone other than their tutor while they learn",
              color: "bg-pink-500/10",
              textcolor: "text-pink-500/10",
            },
            {
              id: 5,
              title: "Simple – no downloads or complex steps to follow",
              color: "bg-blue-500/10",
              textcolor: "text-blue-500/10",
            },
            {
              id: 6,
              title:
                "Safe and secure software trusted by families in thousands of cities world-wide",
              color: "bg-yellow-500/10",
              textcolor: "text-yellow-500/10",
            },
            {
              id: 7,
              title:
                "Convenience – get the best in 21st Century education from the comfort of your home",
              color: "bg-indigo-500/10",
              textcolor: "text-indigo-500/10",
            },
            {
              id: 8,
              title: "Affordable – online sessions start at just $50 per hour",
              color: "bg-amber-500/10",
              textcolor: "text-amber-500/10",
            },
            {
              id: 9,
              title:
                "Weekly sessions – your child attends on a weekly basis for maximum educational advantage",
              color: "bg-black-500/10",
              textcolor: "text-black-500/10",
            },
          ].map((e) => (
            <div
              className={`${e.color} rounded-xl p-6  hover:scale-105 cursor-pointer transition-all relative h-52 overflow-hidden`}
              key={e.id}
            >
              <h1 className="md:text-base text-sm">{e.title}</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${e.textcolor} lucide lucide-aperture-icon lucide-aperture absolute -right-5 -bottom-5`}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m14.31 8 5.74 9.94" />
                <path d="M9.69 8h11.48" />
                <path d="m7.38 12 5.74-9.94" />
                <path d="M9.69 16 3.95 6.06" />
                <path d="M14.31 16H2.83" />
                <path d="m16.62 12-5.74 9.94" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Offer;
