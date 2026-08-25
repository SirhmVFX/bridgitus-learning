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

/** Prefer clear Australian, then British, English voices. */
export function pickClearEnglishVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  const score = (v: SpeechSynthesisVoice): number => {
    const lang = (v.lang || "").toLowerCase();
    const name = (v.name || "").toLowerCase();
    let s = 0;
    if (lang.startsWith("en-au") || lang === "en_au") s += 100;
    else if (lang.startsWith("en-gb") || lang === "en_gb" || lang.startsWith("en-uk")) s += 90;
    else if (lang.startsWith("en")) s += 40;
    else return -1;

    // Prefer known clear AU/GB voices
    if (/karen|catherine|lee|matilda|tina|australian/i.test(name)) s += 30;
    if (/daniel|serena|martha|kate|arthur|british|uk english|en-gb/i.test(name)) s += 25;
    if (/samantha|moira|female|enhanced|premium|neural|natural/i.test(name)) s += 10;
    // Deprioritize robotic / compact voices
    if (/compact|eloquence|whisper|zarvox|bad news|good news|pipes/i.test(name)) s -= 40;
    return s;
  };

  const ranked = voices
    .map((v) => ({ v, s: score(v) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return ranked[0]?.v ?? null;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      resolve(existing);
      return;
    }
    const onChange = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    // Fallback if voiceschanged never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

type ReadAloudButtonProps = {
  speechText?: string;
  text?: string;
  options?: string[] | null;
  index?: number;
  className?: string;
  label?: string;
};

/**
 * Browser Web Speech API read-aloud — prefers Australian / British English.
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
    // Warm the voice list early (Chrome loads async)
    void loadVoices();
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

  async function play() {
    if (!supported) return;
    const spoken =
      speechText?.trim() ||
      buildQuestionSpeech({ text: text || "", options, index });
    if (!spoken) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(spoken);
    // Slightly slower for younger students / clarity
    utter.rate = 0.85;
    utter.pitch = 1;
    utter.lang = "en-AU";

    const voices = await loadVoices();
    const preferred = pickClearEnglishVoice(voices);
    if (preferred) {
      utter.voice = preferred;
      // Match utterance lang to the chosen voice (AU or GB)
      if (/en-GB|en_GB|en-UK/i.test(preferred.lang)) utter.lang = "en-GB";
      else if (/en-AU|en_AU/i.test(preferred.lang)) utter.lang = "en-AU";
    }

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
      onClick={() => (speaking ? stop() : void play())}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-colors ${
        speaking
          ? "bg-amber-50 border-amber-300 text-amber-800"
          : "bg-blue-50 border-blue-200 text-[#00369b] hover:bg-blue-100"
      } ${className}`}
      aria-label={speaking ? "Stop reading" : "Listen to question"}
      title={speaking ? "Stop" : "Listen to this question (Australian / British voice)"}
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
