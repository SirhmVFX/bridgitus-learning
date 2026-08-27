import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { StudentAuthProvider } from "@/lib/studentAuth";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const solution_serif = Source_Serif_4({
  variable: "--font-solution",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Bridgitus Learning Portal",
  description:
    "Student portal for Bridgitus Learning — access your materials, tests, and assignments.",
};

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${solution_serif.variable}`}>
      <body className="antialiased bg-[#eef1f6] min-h-screen font-sans">
        <StudentAuthProvider>{children}</StudentAuthProvider>
      </body>
    </html>
  );
}
