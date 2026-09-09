import type { ReactNode } from "react";

/** Shared gold accent matching the reference designs */
export const MKT_GOLD = "#C4A574";
export const MKT_NAVY = "#001233";

export function SectionEyebrow({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex items-center gap-2.5 ${align === "center" ? "justify-center" : ""}`}
    >
      <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
        <path
          d="M1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9"
          stroke="#C4A574"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[13px] font-medium tracking-wide text-[#C4A574]">{children}</span>
    </div>
  );
}

export function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C4A574]/20">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M2.5 6.2L4.8 8.5L9.5 3.5"
          stroke="#C4A574"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
