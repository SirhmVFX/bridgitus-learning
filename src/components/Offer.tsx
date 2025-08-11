function Offer() {
    return (
        <section>
            <div className="md:w-[1200px] md:mx-auto flex flex-col gap-10 py-20 px-4 md:px-0">
                <h1 className="text-4xl md:text-center">Why Choose Bridgitus Learning?</h1>
                <div className="grid md:grid-cols-3 grid-cols-2 gap-6 ">
                {[
                    {
                        id: 1,
                        title: "Fully interactive classes – face-to-face lessons with dynamic online whiteboard",
                    }, 
                    {
                        id: 2,
                        title: "Verbal and written correction and instruction provided in real-time, for real learning",
                    },
                    {
                        id: 3,
                        title: "100% tailored to your child’s needs",
                    },
                    {
                        id: 4,
                        title: "Private sessions – your child will not see or hear anyone other than their tutor while they learn",
                    },
                    {
                        id: 5,
                        title: "Simple – no downloads or complex steps to follow",
                    },
                    {
                        id: 6,
                        title: "Safe and secure software trusted by families in thousands of cities world-wide",
                    },
                    {
                        id: 7,
                        title: "Convenience – get the best in 21st Century education from the comfort of your home",
                    },
                    {
                        id: 8,
                        title: "Affordable – online sessions start at just $50 per hour",
                    },
                    {
                        id: 9,
                        title: "Weekly sessions – your child attends on a weekly basis for maximum educational advantage",
                    }
                ].map((e) => (
                    <div className="bg-black/5 rounded-xl p-6  hover:scale-105 cursor-pointer transition-all" key={e.id}>
                        <h1 className="text-xs">{e.title}</h1>
                    </div>
                ))}
                </div>
            </div>
            
        </section>
    )
}

export default Offer