"use client";

import PracticePapersPortal from "@/components/PracticePapersPortal";

export default function NaplanPortalPage() {
  return (
    <PracticePapersPortal
      program="naplan"
      title="NAPLAN Practice"
      subtitle="Practice papers matched to your year level"
      allowedYears={["2", "3", "4", "5", "6", "7", "8", "9"]}
      restrictedMessage="NAPLAN practice is available for Years 2–9."
    />
  );
}
