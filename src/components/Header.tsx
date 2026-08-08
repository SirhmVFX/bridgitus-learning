"use client";

import Link from "next/link";
import Button from "./Button";
import Image from "next/image";
import { Cancel, ChevronDown, ChevronUp, Mail, Menu, Phone, Star } from "./Icons";
import { useState, useEffect } from "react";
import { getSiteContent } from "@/lib/firestore";

const DEFAULTS = {
  phone: "+61433600592",
  email: "info@bridgitus.com",
  abn: "16146552112",
  rating: "5 star rating from 5000+ verified reviews",
};

function Header() {
  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [info, setInfo] = useState(DEFAULTS);

  useEffect(() => {
    // Try header_info first, fall back to contact_info
    getSiteContent("header_info")
      .then((d) => { if (d && Object.keys(d).length) setInfo({ ...DEFAULTS, ...(d as typeof DEFAULTS) }); else return getSiteContent("contact_info"); })
      .then((d) => { if (d && Object.keys(d).length) setInfo((prev) => ({ ...prev, ...(d as typeof DEFAULTS) })); })
      .catch(() => { });
  }, []);

  const NAV_CLASSES = [
    { href: "/classes/#regular", label: "Regular Tutoring" },
    { href: "/classes/#special-math", label: "Special Math Class" },
    { href: "/classes/#special-science", label: "Special Science Class" },
    { href: "/classes/#english", label: "Special English Class" },
    { href: "/classes/#hsc", label: "HSC Class" },
    { href: "/classes/#vce", label: "VCE Class" },
    { href: "/classes/#scholarship", label: "Scholarship Preparatory Class" },
    { href: "/classes/#college", label: "College Preparatory Class" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999999]">
      {/* Top bar */}
      <div className="hidden md:block py-3 bg-[#161616]">
        <div className="w-full max-w-[1250px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {info.phone && (
              <div className="flex items-center gap-2">
                <Phone />
                <Link href={`tel:${info.phone}`} className="md:text-[8px] lg:text-[11px] xl:text-[12px] text-white">{info.phone}</Link>
              </div>
            )}
            {info.email && (
              <div className="flex items-center gap-2">
                <Mail />
                <Link href={`mailto:${info.email}`} className="md:text-[8px] lg:text-[11px] xl:text-[12px] text-white">{info.email}</Link>
              </div>
            )}
          </div>
          {info.rating && (
            <span className="md:text-[8px] lg:text-[11px] xl:text-[12px] flex items-center gap-2 text-white">
              <Star />{info.rating}
            </span>
          )}
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white border-b border-b-black/5">
        <div className="w-full max-w-[1250px] mx-auto flex justify-between items-center py-1 px-4 md:px-6">
          <div className="md:w-[70px] lg:w-[150px] xl:w-[170px] w-[160px] flex flex-col items-center">
            <Image width={1000} height={1000} src="/assets/FullLogo.png" alt="logo" className="w-full h-full object-contain" />
            {info.abn && <p className="text-[10px] font-bold text-blue-900">ABN: {info.abn}</p>}
          </div>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <ul className="flex gap-4 items-center">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Our Services" },
              ].map((item) => (
                <Link key={item.href} className="md:text-[8px] lg:text-[11px] xl:text-[12px]" href={item.href}>{item.label}</Link>
              ))}
              <li className="relative cursor-pointer flex justify-center items-center" onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                <Link href="/classes" className="md:text-[8px] lg:text-[11px] xl:text-[12px] cursor-pointer z-50">Classes</Link>
                {open && (
                  <div className="absolute top-5 left-0 flex flex-col gap-3 bg-white/90 w-[210px] px-3 pb-3 pt-10 backdrop-blur-md border border-gray-100 z-50"
                    onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                    {NAV_CLASSES.map((c) => (
                      <Link key={c.href} href={c.href} className="md:text-[8px] lg:text-[11px] xl:text-[12px] hover:text-secondary-color">{c.label}</Link>
                    ))}
                  </div>
                )}
              </li>
              <Link className="md:text-[8px] lg:text-[11px] xl:text-[12px] z-50" href="/pricing">Pricing</Link>
              <Link className="md:text-[8px] lg:text-[11px] xl:text-[12px] z-50" href="/contact">Contact</Link>
              <Link className="md:text-[8px] lg:text-[11px] xl:text-[12px] z-50 text-secondary-color font-semibold" href="/portal/login">Student Portal</Link>
              <Button style="link" href="/register">Register Now</Button>
            </ul>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden block cursor-pointer z-[9999999999999] p-2" onClick={() => setOpenMobile(!openMobile)}>
            {openMobile ? <Cancel /> : <Menu />}
          </button>
        </div>

        {/* Mobile nav */}
        {openMobile && (
          <div className="fixed top-[60px] left-0 right-0 z-[9999999] bg-white border-t border-gray-100 p-4 max-h-[80vh] overflow-y-auto">
            <ul className="flex flex-col gap-4">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Our Services" },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpenMobile(false)} className="text-sm font-medium">{item.label}</Link>
              ))}
              <div>
                <div className="flex justify-between items-center" onClick={() => setOpenMobileMenu(!openMobileMenu)}>
                  <Link href="/classes" className="text-sm font-medium" onClick={() => setOpenMobile(false)}>Classes</Link>
                  <button className="p-1">{openMobileMenu ? <ChevronUp /> : <ChevronDown />}</button>
                </div>
                {openMobileMenu && (
                  <div className="flex flex-col gap-3 pl-4 mt-3">
                    {NAV_CLASSES.map((c) => (
                      <Link key={c.href} href={c.href} onClick={() => setOpenMobile(false)} className="text-sm text-gray-600">{c.label}</Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/pricing" onClick={() => setOpenMobile(false)} className="text-sm font-medium">Pricing</Link>
              <Link href="/contact" onClick={() => setOpenMobile(false)} className="text-sm font-medium">Contact</Link>
              <Link href="/portal/login" onClick={() => setOpenMobile(false)} className="text-sm font-semibold text-secondary-color">Student Portal</Link>
              <Button style="link" href="/register">Register Now</Button>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
