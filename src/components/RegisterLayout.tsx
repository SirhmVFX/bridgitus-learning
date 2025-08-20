import Link from "next/link";

function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex flex-col justify-between gap-4 ">
      <header className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 md:text-[10px] lg:text-[12px] xl:text-[13px]"
        >
          Back to Home
        </Link>

        <Link
          href="/help"
          className="flex items-center gap-2 md:text-[10px] lg:text-[12px] xl:text-[13px]"
        >
          Get Help
        </Link>
      </header>
      <div className="h-full">{children}</div>

      <footer className="py-4">
        <h1 className="text-[10px] lg:text-[12px] xl:text-[13px] text-center">
          Copyright © Bridgitus
        </h1>
      </footer>
    </div>
  );
}

export default RegisterLayout;
