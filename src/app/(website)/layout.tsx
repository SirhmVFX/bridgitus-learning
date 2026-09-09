import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans-mkt",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bridgitus.com"),
  title: {
    default: "Bridgitus | Smart Learning Passport & Online Tutoring",
    template: "%s | Bridgitus",
  },
  description:
    "Bridgitus delivers personalised online tutoring with the Smart Learning Passport — diagnostics, skill-gap mapping, AI-guided practice, NAPLAN & Selective prep, and measurable progress for Maths, English, and Science.",
  openGraph: {
    title: "Bridgitus — Measurable learning. Real mastery.",
    description:
      "Stop guessing. Start measuring. Smart Learning Passport, live tutoring, assessments, and parent-ready progress reports.",
    type: "website",
    siteName: "Bridgitus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bridgitus Learning",
    description: "Personalised tutoring with evidence of progress — Smart Learning Passport.",
  },
  robots: { index: true, follow: true },
};

export default function WebsiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} mkt-body antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
