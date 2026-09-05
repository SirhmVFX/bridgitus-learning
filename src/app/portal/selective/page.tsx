"use client";

import PracticePapersPortal from "@/components/PracticePapersPortal";

export default function SelectivePortalPage() {
  return (
    <PracticePapersPortal
      program="selective"
      title="Selective Entry"
      subtitle="Practice papers for Selective Entry exams"
      allowedYears={["8", "9"]}
      restrictedMessage="Selective Entry practice is for Years 8 and 9. Your current year level does not include this program yet — check back when you reach Year 8 or 9."
    />
  );
}
