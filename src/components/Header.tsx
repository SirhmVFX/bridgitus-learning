"use client";

import Link from "next/link";
import Button from "./Button";
import Image from "next/image";
import { Mail, Menu, Phone, Star } from "./Icons";
import { useState } from "react";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[9999999] `}>
      <div className="hidden md:block py-3 bg-[#161616]">
        <div className=" md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full mx-auto flex items-center justify-between ">
          <div className="flex items-center gap-5 ">
            <div className="flex items-center gap-2">
              <Phone />
              <Link
                href="tel:+61433600592"
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] text-white`}
              >
                +61433600592
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Mail />
              <Link
                href="mailto:info@bridgitus.com"
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] text-white`}
              >
                info@bridgitus.com
              </Link>
            </div>
          </div>
          <Link
            href="#"
            className={`md:text-[8px] lg:text-[11px] xl:text-[12px] flex items-center gap-2 text-white`}
          >
            <Star />5 star rating from 5000+ verified reviews
          </Link>
        </div>
      </div>
      <div className="border bg-white border-b-black/10 ">
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full mx-auto flex justify-between items-center py-1  px-4 md:px-0 ">
          <div className="md:w-[70px] lg:w-[150px] xl:w-[170px] w-[180px]">
            <Image
              width={1000}
              height={1000}
              src="/assets/FullLogo.png"
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="hidden md:block">
            <ul className="flex gap-5 items-center">
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                href="/"
              >
                Home
              </Link>
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                href="/about"
              >
                About Us
              </Link>
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                href="/services"
              >
                Our Services
              </Link>
              <li
                className="relative cursor-pointer flex justify-center items-center"
                onMouseOver={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <Link
                  href="/classes"
                  className="md:text-[8px] lg:text-[11px] xl:text-[12px] cursor-pointer z-50"
                >
                  Classes
                </Link>
                {open && (
                  <div
                    className="absolute top-5 left-0 flex flex-col gap-4 bg-white/50 w-[200px] px-2 pb-2 pt-10 backdrop-blur-md "
                    onMouseOver={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                  >
                    <Link
                      href="/classes/#regular"
                      className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                    >
                      Regular Tutoring
                    </Link>
                    <Link
                      href="/classes/#special-math"
                      className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                    >
                      Special Math Class
                    </Link>
                    <Link
                      href="/classes/#special-science"
                      className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                    >
                      Special Science Class
                    </Link>
                    <Link
                      href="/classes/#english"
                      className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                    >
                      Special English Class
                    </Link>
                    <Link
                      href="/classes/#hsc"
                      className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                    >
                      HSC class
                    </Link>
                    <Link
                      href="/classes/#vce"
                      className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                    >
                      VCE class
                    </Link>
                    <Link
                      href="/classes/#scholarship"
                      className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                    >
                      Scholarship Preparatory Class{" "}
                    </Link>
                    <Link
                      href="/classes/#college"
                      className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                    >
                      College Preparatory Class
                    </Link>
                  </div>
                )}
              </li>
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] z-50`}
                href="/pricing"
              >
                Pricing
              </Link>
              {/* <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] z-50`}
                href="/testimonials"
              >
                Testimonials
              </Link> */}
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] z-50 `}
                href="/contact"
              >
                Contact
              </Link>
              <Button style="link" href="/register">
                Register Now
              </Button>
            </ul>
          </div>

          <div className="md:hidden block">
            <Menu />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
