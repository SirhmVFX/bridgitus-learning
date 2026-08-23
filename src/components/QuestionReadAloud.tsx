"use client";

import { useEffect, useRef, useState } from "react";
import { MdVolumeUp, MdStop } from "react-icons/md";

/** Grades that get read-aloud support (Year / Grade 1–6). */
export function gradeSupportsReadAloud(grade: string | null | undefined): boolean {
  if (!grade) return false;
  const g = String(grade).trim().toLowerCase().replace(/^year\s+/i, "");
  const n = parseInt(g, 10);
  if (!Number.isNaN(n)) return n >= 1 && n <= 6;
  return ["1", "2", "3", "4", "5", "6"].includes(g);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Build spoken text for a question + options. */
export function buildQuestionSpeech(opts: {
  text: string;
  options?: string[] | null;
  index?: number;
}): string {
  const parts: string[] = [];
  if (typeof opts.index === "number") {
    parts.push(`Question ${opts.index + 1}.`);
  }
  parts.push(stripHtml(opts.text || ""));
  const options = (opts.options || []).filter(Boolean);
  if (options.length) {
    parts.push("The options are:");
    options.forEach((opt, i) => {
      const label = String.fromCharCode(65 + i);
      parts.push(`Option ${label}. ${stripHtml(opt)}.`);
    });
  }
  return parts.filter(Boolean).join(" ");
}

type ReadAloudButtonProps = {
  /** Full text to speak (already prepared), or pass text+options. */
  speechText?: string;
  text?: string;
  options?: string[] | null;
  index?: number;
  className?: string;
  label?: string;
};

/**
 * Browser Web Speech API read-aloud control.
 * Free, no API key. Works best on Chrome/Safari/Edge.
 */
export function ReadAloudButton({
  speechText,
  text,
  options,
  index,
  className = "",
  label = "Listen",
}: ReadAloudButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function stop() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    utterRef.current = null;
  }

  function play() {
    if (!supported) return;
    const spoken =
      speechText?.trim() ||
      buildQuestionSpeech({ text: text || "", options, index });
    if (!spoken) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(spoken);
    utter.rate = 0.9;
    utter.pitch = 1;
    utter.lang = "en-AU";

    // Prefer a clear English voice when available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /en-AU/i.test(v.lang) && /female|samantha|karen|moira/i.test(v.name)) ||
      voices.find((v) => /en-AU/i.test(v.lang)) ||
      voices.find((v) => /^en[-_]/i.test(v.lang));
    if (preferred) utter.voice = preferred;

    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : play())}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-colors ${
        speaking
          ? "bg-amber-50 border-amber-300 text-amber-800"
          : "bg-blue-50 border-blue-200 text-[#00369b] hover:bg-blue-100"
      } ${className}`}
      aria-label={speaking ? "Stop reading" : "Listen to question"}
      title={speaking ? "Stop" : "Listen to this question"}
    >
      {speaking ? <MdStop size={15} /> : <MdVolumeUp size={15} />}
      {speaking ? "Stop" : label}
    </button>
  );
}

/** Convenience wrapper: only renders for grades 1–6. */
export function QuestionReadAloud({
  grade,
  text,
  options,
  index,
  className,
}: {
  grade: string | null | undefined;
  text: string;
  options?: string[] | null;
  index?: number;
  className?: string;
}) {
  if (!gradeSupportsReadAloud(grade)) return null;
  return (
    <ReadAloudButton
      text={text}
      options={options}
      index={index}
      className={className}
      label="Listen"
    />
  );
}
