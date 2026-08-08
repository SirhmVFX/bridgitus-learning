import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { StudentAuthProvider } from "@/lib/studentAuth";
import "../globals.css";

const open_sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bridgitus Learning Portal",
  description: "Student portal for Bridgitus Learning — access your materials, tests, and assignments.",
};

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={open_sans.variable}>
      <body className="antialiased bg-[#f4f6fb] min-h-screen">
        <StudentAuthProvider>{children}</StudentAuthProvider>
      </body>
    </html>
  );
}
