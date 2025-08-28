"use client";

import { useRef, useState, useEffect } from "react";
import Brief from "@/components/Brief";
import HeroSection from "@/components/Herosection";
import Partners from "@/components/Partners";
import TrustedBy from "@/components/TrustedBy";
import { BackToTopButton, SectionNavButtons } from "@/components/ScrollButton";

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // Define the sections in order
  const sections = [
    { id: "hero", component: <HeroSection key="hero" /> },
    { id: "brief", component: <Brief key="brief" /> },
    { id: "partners", component: <Partners key="partners" /> },
    { id: "trusted", component: <TrustedBy key="trusted" /> },
  ];

  // Handle scroll to update current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sectionsRef.current.forEach((section, index) => {
        if (!section) return;
        const { offsetTop, offsetHeight } = section;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (index: number) => {
    const section = sectionsRef.current[index];
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Navigation handlers
  const handleNext = () => {
    const nextSection = Math.min(currentSection + 1, sections.length - 1);
    scrollToSection(nextSection);
  };

  const handlePrev = () => {
    const prevSection = Math.max(currentSection - 1, 0);
    scrollToSection(prevSection);
  };

  return (
    <div className="relative">
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => {
            sectionsRef.current[index] = el;
          }}
          id={section.id}
          className="scroll-mt-20" // Add some space for fixed header
        >
          {section.component}
        </section>
      ))}

      {/* Navigation Buttons */}
      <SectionNavButtons
        currentSection={currentSection}
        totalSections={sections.length}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}
