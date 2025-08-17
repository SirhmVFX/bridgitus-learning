import Link from "next/link";

function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex flex-col justify-between gap-4 h-screen">
      <header className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          Back to Home
        </Link>

        <Link href="/help" className="flex items-center gap-2">
          Get Help
        </Link>
      </header>
      <div className="h-full">{children}</div>

      <footer>
        <h1>Footer</h1>
      </footer>
    </div>
  );
}

export default RegisterLayout;
