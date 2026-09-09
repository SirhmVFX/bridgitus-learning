"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Cancel, ChevronDown, ChevronUp, Mail, Menu, Phone } from "./Icons";
import { getSiteContent } from "@/lib/firestore";
import { CLASSES, SEO_PAGES } from "@/lib/marketingContent";

const DEFAULTS = {
  phone: "+61433600592",
  email: "info@bridgitus.com",
  abn: "16146552112",
  rating: "5 star rating from 5000+ verified reviews",
};

const PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/smart-learning-passport", label: "Passport" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openLearn, setOpenLearn] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openMobileClasses, setOpenMobileClasses] = useState(false);
  const [openMobileLearn, setOpenMobileLearn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [info, setInfo] = useState(DEFAULTS);

  useEffect(() => {
    getSiteContent("header_info")
      .then((d) => {
        if (d && Object.keys(d).length) setInfo({ ...DEFAULTS, ...(d as typeof DEFAULTS) });
        else return getSiteContent("contact_info");
      })
      .then((d) => {
        if (d && Object.keys(d).length) setInfo((prev) => ({ ...prev, ...(d as typeof DEFAULTS) }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile]);

  const bar = scrolled || openMobile
    ? "bg-white/95 backdrop-blur-md border-b border-[#001233]/8 shadow-sm"
    : "bg-white/85 backdrop-blur-md border-b border-transparent";

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000]">
      <div className="hidden md:block bg-[#001233]">
        <div className="mkt-container flex items-center justify-between py-2 text-[11px] text-white/80">
          <div className="flex items-center gap-5">
            {info.phone && (
              <Link href={`tel:${info.phone}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Phone />
                {info.phone}
              </Link>
            )}
            {info.email && (
              <Link href={`mailto:${info.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Mail />
                {info.email}
              </Link>
            )}
          </div>
          {info.rating && <span className="text-white/70">{info.rating}</span>}
        </div>
      </div>

      <div className={`transition-all duration-300 ${bar}`}>
        <div className="mkt-container flex items-center justify-between py-2.5 gap-4">
          <Link href="/" className="shrink-0 w-[140px] md:w-[160px]">
            <Image
              width={320}
              height={120}
              src="/assets/FullLogo.png"
              alt="Bridgitus"
              className="w-full h-auto object-contain"
              priority
            />
            {info.abn && (
              <p className="text-[9px] font-bold tracking-wide text-[#00369b]">ABN: {info.abn}</p>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {PRIMARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2.5 py-2 text-[13px] font-medium text-[#001233] transition hover:text-[#00369b]"
              >
                {item.label}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setOpenLearn(true)}
              onMouseLeave={() => setOpenLearn(false)}
            >
              <button
                type="button"
                className="px-2.5 py-2 text-[13px] font-medium text-[#001233] inline-flex items-center gap-1"
              >
                Learn <ChevronDown />
              </button>
              {openLearn && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-[280px] rounded-xl border border-[#001233]/8 bg-white p-3 shadow-xl">
                    {SEO_PAGES.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        className="block rounded-lg px-3 py-2 text-sm text-[#001233]/80 hover:bg-[#e8eef8] hover:text-[#00369b]"
                      >
                        {p.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <Link
                href="/classes"
                className="px-2.5 py-2 text-[13px] font-medium text-[#001233] inline-flex items-center gap-1"
              >
                Classes <ChevronDown />
              </Link>
              {open && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-[240px] rounded-xl border border-[#001233]/8 bg-white p-3 shadow-xl">
                    {CLASSES.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-lg px-3 py-2 text-sm text-[#001233]/80 hover:bg-[#e8eef8] hover:text-[#00369b]"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/portal/login" className="ml-1 px-2.5 py-2 text-[13px] font-semibold text-[#00369b]">
              Portal
            </Link>
            <Button style="link" href="/register">
              Register
            </Button>
          </nav>

          <button
            type="button"
            className="lg:hidden p-2 text-[#001233]"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label="Menu"
          >
            {openMobile ? <Cancel /> : <Menu />}
          </button>
        </div>

        {openMobile && (
          <div className="lg:hidden border-t border-[#001233]/8 bg-white max-h-[80vh] overflow-y-auto px-4 py-4">
            <ul className="flex flex-col gap-1">
              {PRIMARY.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenMobile(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#001233]"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium"
                onClick={() => setOpenMobileLearn((v) => !v)}
              >
                Learn {openMobileLearn ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openMobileLearn &&
                SEO_PAGES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setOpenMobile(false)}
                    className="pl-6 py-2 text-sm text-[#001233]/70"
                  >
                    {p.label}
                  </Link>
                ))}
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium"
                onClick={() => setOpenMobileClasses((v) => !v)}
              >
                Classes {openMobileClasses ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openMobileClasses &&
                CLASSES.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setOpenMobile(false)}
                    className="pl-6 py-2 text-sm text-[#001233]/70"
                  >
                    {c.label}
                  </Link>
                ))}
              <Link
                href="/portal/login"
                onClick={() => setOpenMobile(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#00369b]"
              >
                Student Portal
              </Link>
              <div className="pt-2">
                <Button style="link" href="/register">
                  Register Now
                </Button>
              </div>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
