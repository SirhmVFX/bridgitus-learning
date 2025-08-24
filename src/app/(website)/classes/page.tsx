import Link from "next/link";

function Classes() {
  return (
    <main>
      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto">
        <section
          id="classes"
          className="py-28 bg-background md:pt-32 lg:pt-40 xl:pt-52"
        >
          <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-6">
                <span className="text-sm font-medium text-yellow-500-foreground">
                  🏫 OUR CLASSES
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Classes for Every Learning Stage
              </h2>
              <p className="text-lg text-black/50 max-w-2xl mx-auto">
                From elementary foundations to advanced high school preparation,
                we have the right program for your child&apos;s academic
                journey.
              </p>
            </div>
            {/* <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group p-8 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-book-open w-8 h-8"
                  >
                    <path d="M12 7v14"></path>
                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Elementary Level
                </h3>
                <p className="text-yellow-500 font-semibold mb-4">Grades 1-5</p>
                <p className="text-black/50">
                  Foundational courses focusing on core skills in math, reading,
                  and writing.
                </p>
              </div>
              <div className="group p-8 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-pink-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-graduation-cap w-8 h-8"
                  >
                    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                    <path d="M22 10v6"></path>
                    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Middle School
                </h3>
                <p className="text-yellow-500 font-semibold mb-4">Grades 6-8</p>
                <p className="text-black/50">
                  Comprehensive classes covering advanced topics and preparing
                  for high school.
                </p>
              </div>
              <div className="group p-8 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-trophy w-8 h-8"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  High School
                </h3>
                <p className="text-yellow-500 font-semibold mb-4">
                  Grades 9-12
                </p>
                <p className="text-black/50">
                  Rigorous courses including AP and honors-level subjects to
                  boost college readiness.
                </p>
              </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 py-12">
              {[
                {
                  id: 1,
                  title: "Regular Tutoring",
                  grade: "Years 3 – 12",
                  color: "bg-yellow-500",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-book-open w-8 h-8"
                    >
                      <path d="M12 7v14"></path>
                      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                    </svg>
                  ),
                  description:
                    "Comprehensive support in Math, English, and Science tailored to each student's curriculum level.",
                },
                {
                  id: 2,
                  title: "Special Math Class",
                  grade: "Advanced Level",
                  color: "bg-pink-500",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-square-root w-8 h-8"
                    >
                      <path d="M4 12h6l4 8 3-12 5 20h-6l-3-12-4 8z"></path>
                    </svg>
                  ),
                  description:
                    "Enriched learning experience with advanced problem-solving strategies and competition preparation.",
                },
                {
                  id: 3,
                  title: "Special Science Class",
                  grade: "Advanced Level",
                  color: "bg-green-500",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-flask-conical w-8 h-8"
                    >
                      <path d="M10 2v7.31"></path>
                      <path d="M14 9.3V1.99"></path>
                      <path d="M8.5 2h7"></path>
                      <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                      <path d="M5.52 16h12.96"></path>
                    </svg>
                  ),
                  description:
                    "Exploration of biology, chemistry, and physics at an advanced level with engaging activities.",
                },
                {
                  id: 4,
                  title: "English Class",
                  grade: "All Levels",
                  color: "bg-blue-500",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-book-text w-8 h-8"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                      <path d="M8 7h6"></path>
                      <path d="M8 11h8"></path>
                      <path d="M8 15h5"></path>
                    </svg>
                  ),
                  description:
                    "Build strong communication, reading, and writing skills essential for academic success.",
                },
                {
                  id: 5,
                  title: "HSC Tutoring",
                  grade: "Years 11-12",
                  color: "bg-red-500",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-graduation-cap w-8 h-8"
                    >
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                      <path d="M22 10v6"></path>
                      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                    </svg>
                  ),
                  description:
                    "Comprehensive coverage of HSC syllabus with exam-style practice and personalized feedback.",
                },
                {
                  id: 6,
                  title: "VCE Class",
                  grade: "Years 11-12",
                  color: "bg-purple-500",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-award w-8 h-8"
                    >
                      <circle cx="12" cy="8" r="6"></circle>
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                    </svg>
                  ),
                  description:
                    "Targeted preparation for VCE Units 1-4 with focus on content mastery and SAC preparation.",
                },
                {
                  id: 7,
                  title: "Scholarship Prep",
                  grade: "Competitive Exams",
                  color: "bg-orange-500",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-medal w-8 h-8"
                    >
                      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.18L16.79 15"></path>
                      <path d="M11 12 5.12 4.5"></path>
                      <path d="m13 12 5.88-7.5"></path>
                      <path d="M8 7h8"></path>
                      <circle cx="12" cy="17" r="5"></circle>
                      <path d="M12 18v-2h-.5"></path>
                    </svg>
                  ),
                  description:
                    "Preparation for competitive scholarship and selective school entrance exams.",
                },
                {
                  id: 8,
                  title: "College Prep",
                  grade: "Senior Students",
                  color: "bg-amber-500",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-building-2 w-8 h-8"
                    >
                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                      <path d="M10 6h4"></path>
                      <path d="M10 10h4"></path>
                      <path d="M10 14h4"></path>
                      <path d="M10 18h4"></path>
                    </svg>
                  ),
                  description:
                    "Advanced academic training for university entrance in Australia and internationally.",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="group p-6 cursor-pointer rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div
                    className={`${item.color}  " w-16 h-16 bg-gradient-to-br  text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-yellow-500 font-semibold mb-4">
                    {item.grade}
                  </p>
                  <p className="text-black/50 mb-6">{item.description}</p>
                  <Link
                    href="/register"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 group-hover:translate-x-1 transition-transform duration-300"
                  >
                    Register Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>

            <div className="  rounded-3xl md:p-8 p-4 border border-black/10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-6">
                  <span className="text-sm font-medium text-yellow-500-foreground">
                    🧑‍🏫 HOW OUR CLASSES OPERATE
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Choose Your Learning Style
                </h3>
                <p className="text-black/50 max-w-2xl mx-auto">
                  We offer flexible learning options designed to meet every
                  student&apos;s unique needs and preferences.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group md:p-8 p-4 bg-card rounded-2xl border cursor-pointer border-black/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-yellow-500/10 rounded-xl group-hover:bg-yellow-500/20 transition-colors mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-users w-8 h-8 text-yellow-500"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground">
                        Group Classes
                      </h4>
                      <p className="text-yellow-500 font-medium">
                        Interactive Learning
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-check-big w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                      >
                        <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                        <path d="m9 11 3 3L22 4"></path>
                      </svg>
                      <p className="text-black/70">
                        Maximum of 4 students per session
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-clock w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <p className="text-black/70">
                        60-minute focused sessions
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-target w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                      <p className="text-black/70">
                        Personalized academic programs
                      </p>
                    </div>
                  </div>
                  <p className="text-black/70 leading-relaxed">
                    Each student works in their own private room with the tutor
                    on their personalized academic program, ensuring focused
                    attention while maintaining the benefits of group dynamics.
                  </p>
                  <div className="mt-6 p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                    <p className="text-sm text-yellow-500 font-medium">
                      Perfect for: Collaborative learning and peer motivation
                    </p>
                  </div>
                </div>
                <div className="group md:p-8 p-4 bg-card rounded-2xl border cursor-pointer border-black/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-yellow-500/10 rounded-xl group-hover:bg-yellow-500/20 transition-colors mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-user w-8 h-8 text-yellow-500"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground">
                        1:1 Classes
                      </h4>
                      <p className="text-yellow-500 font-medium">
                        Exclusive Attention
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-circle-check-big w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                      >
                        <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                        <path d="m9 11 3 3L22 4"></path>
                      </svg>
                      <p className="text-black/70">
                        One-on-one exclusive sessions
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-clock w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <p className="text-black/70">
                        Full 60-minute dedicated time
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-target w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                      <p className="text-black/70">
                        Completely customized curriculum
                      </p>
                    </div>
                  </div>
                  <p className="text-black/70 leading-relaxed">
                    Exclusive, personalized sessions conducted between tutor and
                    student for the full 60-minute session. Perfect for
                    intensive learning, exam preparation, or addressing specific
                    learning challenges.
                  </p>
                  <div className="mt-6 p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                    <p className="text-sm text-yellow-500 font-medium">
                      Perfect for: Intensive learning and exam preparation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="py-20 bg-gray-100/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                📘 Our Curriculum Standards
              </h2>
              <p className="text-lg text-black/50 max-w-3xl mx-auto">
                We specialize in delivering high-quality education aligned with
                globally recognized curricula, ensuring students are
                well-prepared for their academic journeys.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="group p-6 rounded-2xl bg-white cursor-pointer border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-pink-500 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-flag w-7 h-7"
                  >
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" x2="4" y1="22" y2="15"></line>
                  </svg>
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">
                  Australian Curriculum (ACARA)
                </h3>
                <p className="text-black/50 text-xs">
                  Assessment and Reporting Authority standards
                </p>
              </div>
              <div className="group p-6 rounded-2xl bg-white cursor-pointer border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-blue-500 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-globe w-7 h-7"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">
                  Common Core State Standards
                </h3>
                <p className="text-black/50 text-xs">
                  American Curriculum standards
                </p>
              </div>
              <div className="group p-6 rounded-2xl bg-white cursor-pointer border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-green-500 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-award w-7 h-7"
                  >
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                    <circle cx="12" cy="8" r="6"></circle>
                  </svg>
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">
                  International GCSE (IGCSE)
                </h3>
                <p className="text-black/50 text-xs">
                  Global secondary education certification
                </p>
              </div>
              <div className="group p-6 rounded-2xl bg-white cursor-pointer border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-book-text w-7 h-7"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
                    <path d="M8 11h8"></path>
                    <path d="M8 7h6"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">
                  British Curriculum
                </h3>
                <p className="text-black/50 text-xs">
                  UK national curriculum standards
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/10">
              <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                🧠 Key Learning Areas
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="text-4xl mb-4">📚</div>
                  <h4 className="text-xl font-semibold text-foreground">
                    English
                  </h4>
                  <p className="text-black/50 leading-relaxed">
                    Literacy development, comprehension, and creation of various
                    texts.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="text-4xl mb-4">🔢</div>
                  <h4 className="text-xl font-semibold text-foreground">
                    Mathematics
                  </h4>
                  <p className="text-black/50 leading-relaxed">
                    Number and algebra, measurement and geometry, statistics and
                    probability.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="text-4xl mb-4">🔬</div>
                  <h4 className="text-xl font-semibold text-foreground">
                    Science
                  </h4>
                  <p className="text-black/50 leading-relaxed">
                    Inquiry and investigation into the natural world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Classes;
