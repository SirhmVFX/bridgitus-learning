"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "./Icons";

type ScrollButtonProps = {
  direction: "up" | "down";
  onClick: () => void;
  className?: string;
};

export function ScrollButton({
  direction,
  onClick,
  className = "",
}: ScrollButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-color/90 text-white shadow-lg transition-all hover:scale-110 hover:bg-secondary-color focus:outline-none focus:ring-2 focus:ring-secondary-color focus:ring-offset-2 ${className}`}
      aria-label={`Scroll ${direction}`}
    >
      {direction === "up" ? (
        <ChevronUp className="h-6 w-6" />
      ) : (
        <ChevronDown className="h-6 w-6" />
      )}
    </button>
  );
}

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <ScrollButton direction="up" onClick={scrollToTop} className="bottom-24" />
  );
}

type SectionNavButtonProps = {
  currentSection: number;
  totalSections: number;
  onNext: () => void;
  onPrev: () => void;
};

export function SectionNavButtons({
  currentSection,
  totalSections,
  onNext,
  onPrev,
}: SectionNavButtonProps) {
  return (
    <>
      {currentSection > 0 && (
        <ScrollButton direction="up" onClick={onPrev} className="bottom-24" />
      )}
      {currentSection < totalSections - 1 && (
        <ScrollButton direction="down" onClick={onNext} className="bottom-6" />
      )}
    </>
  );
}
