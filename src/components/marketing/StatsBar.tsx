const STATS = [
  { value: "12", label: "Years of teaching in one community" },
  { value: "2,400+", label: "Students guided through final exams" },
  { value: "94%", label: "Reach or beat their target band" },
  { value: "31", label: "Universities our graduates now attend" },
];

export default function StatsBar() {
  return (
    <section className="bg-black">
      <div className="mkt-container py-14 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#C4A574]/40">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center px-4 py-6 text-center sm:px-6 ${
                i % 2 === 1 ? "border-l border-[#C4A574]/25 lg:border-l-0" : ""
              } ${i >= 2 ? "border-t border-[#C4A574]/25 lg:border-t-0" : ""}`}
            >
              <p className="text-4xl font-semibold tracking-tight text-[#C4A574] md:text-5xl">
                {s.value}
              </p>
              <p className="mt-3 max-w-[180px] text-sm leading-snug text-white">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
