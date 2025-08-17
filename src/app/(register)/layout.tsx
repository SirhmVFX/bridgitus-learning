import RegisterLayout from "@/components/RegisterLayout";
import { Open_Sans } from "next/font/google";
import "../globals.css";

const open_sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={` ${open_sans.variable} antialiased`}>
        <RegisterLayout>{children}</RegisterLayout>
      </body>
    </html>
  );
}
