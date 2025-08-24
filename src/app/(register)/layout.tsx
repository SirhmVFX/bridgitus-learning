import type { Metadata } from "next";
import RegisterLayout from "@/components/RegisterLayout";
import { Open_Sans } from "next/font/google";
import "../globals.css";

const open_sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bridgitus",
  description:
    "Bridgitus is a leading online tuition platform committed to delivering personalized, high-quality education that empowers students to succeed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={` ${open_sans.variable} antialiased p-4`}>
        <RegisterLayout>{children}</RegisterLayout>
      </body>
    </html>
  );
}
