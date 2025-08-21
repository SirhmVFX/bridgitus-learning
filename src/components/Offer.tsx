function Offer() {
  const features = [
    {
      id: 1,
      icon: (
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
      ),
      title: "Fully Interactive Classes",
      description: "Face-to-face lessons with dynamic online whiteboard",
    },
    {
      id: 2,
      icon: (
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      ),
      title: "Real-time Feedback",
      description:
        "Verbal and written correction and instruction provided instantly",
    },
    {
      id: 3,
      icon: (
        <>
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </>
      ),
      title: "100% Personalized",
      description: "Completely tailored to your child's unique learning needs",
    },
    {
      id: 4,
      icon: (
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
      ),
      title: "Private Sessions",
      description:
        "Your child will not see or hear anyone other than their tutor",
    },
    {
      id: 5,
      icon: (
        <>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" x2="12" y1="15" y2="3"></line>
        </>
      ),
      title: "Simple Setup",
      description: "No downloads or complex steps to follow",
    },
    {
      id: 6,
      icon: (
        <>
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </>
      ),
      title: "Safe & Secure",
      description: "Trusted software used by families worldwide",
    },
    {
      id: 7,
      icon: (
        <>
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </>
      ),
      title: "Learn from Home",
      description: "Convenience of learning from the comfort of your home",
    },
    {
      id: 8,
      icon: (
        <>
          <line x1="12" x2="12" y1="2" y2="22"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </>
      ),
      title: "Affordable Pricing",
      description: "Online sessions start at just $50 per hour",
    },
    {
      id: 9,
      icon: (
        <>
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </>
      ),
      title: "Consistent Learning",
      description: "Weekly sessions for maximum learning advantage",
    },
  ];

  const requirements = [
    {
      id: 1,
      icon: (
        <>
          <rect width="20" height="14" x="2" y="3" rx="2"></rect>
          <line x1="8" x2="16" y1="21" y2="21"></line>
          <line x1="12" x2="12" y1="17" y2="21"></line>
        </>
      ),
      title: "Computer",
      description: "Desktop or laptop",
    },
    {
      id: 2,
      icon: (
        <>
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
          <circle cx="12" cy="13" r="3"></circle>
        </>
      ),
      title: "Webcam",
      description: "Built-in or external",
    },
    {
      id: 3,
      icon: (
        <>
          <path d="M12 20h.01"></path>
          <path d="M2 8.82a15 15 0 0 1 20 0"></path>
          <path d="M5 12.859a10 10 0 0 1 14 0"></path>
          <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
        </>
      ),
      title: "Internet",
      description: "Stable connection",
    },
    {
      id: 4,
      icon: (
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
      ),
      title: "Headset",
      description: "For clear audio",
    },
  ];

  const renderIcon = (icon: JSX.Element | JSX.Element[]) => (
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
      className="lucide lucide-custom w-6 h-6 text-yellow-500"
    >
      {icon}
    </svg>
  );

  return (
    <>
      <section className="py-20 bg-gray-100/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                🌟 Why Choose Bridgitus Learning?
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the difference with our comprehensive online tutoring
                platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="cursor-pointer group p-6 bg-card rounded-xl border border-black/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                      {renderIcon(feature.icon)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-8 border border-black/10">
              <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                🖥️ What You Need to Get Started
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {requirements.map((item) => (
                  <div
                    key={item.id}
                    className="cursor-pointer text-center p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 transition-colors group"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/30 transition-colors">
                        {renderIcon(item.icon)}
                      </div>
                    </div>
                    <p className="font-semibold text-foreground mb-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-6">
              <span className="text-sm font-medium text-yellow-500-foreground">
                WHY CHOOSE US
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Benefits of Online Tutoring
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Services at{" "}
              <span className="font-semibold text-primary">
                Bridgitus Learning
              </span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="cursor-pointer group p-8 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
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
                  className="lucide lucide-user w-8 h-8"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                One-On-One Teaching
              </h3>
              <p className="text-muted-foreground">
                Personalized sessions tailored to individual learning needs,
                ensuring focused attention and customized lesson plans.
              </p>
            </div>
            <div className="cursor-pointer group p-8 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-500 text-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
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
                  className="lucide lucide-users w-8 h-8"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                24/7 Tutor Availability
              </h3>
              <p className="text-muted-foreground">
                Interactive small-group sessions that foster collaboration and
                peer learning in a supportive environment.
              </p>
            </div>
            <div className="cursor-pointer group p-8 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
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
                  className="lucide lucide-book-open w-8 h-8"
                >
                  <path d="M12 7v14"></path>
                  <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Interactive Whiteboard
              </h3>
              <p className="text-muted-foreground">
                Specialized coaching for standardized tests and school exams,
                including practice tests and study strategies.
              </p>
            </div>
            <div className="cursor-pointer group p-8 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
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
              <h3 className="text-xl font-bold text-foreground mb-4">
                Affordable Prices
              </h3>
              <p className="text-muted-foreground">
                Guided assistance with assignments and projects to help students
                stay on track and excel academically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Offer;
