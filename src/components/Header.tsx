"use client";

import Link from "next/link";
import Button from "./Button";
import Image from "next/image";
import { Mail, Menu, Phone, Star } from "./Icons";

function Header() {
  return (
    <header className={`absolute top-0 left-0 right-0 z-50 `}>
      <div className="hidden md:block py-3 bg-[#161616]">
        <div className=" md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full mx-auto flex items-center justify-between ">
          <div className="flex items-center gap-5 ">
            <div className="flex items-center gap-2">
              <Phone />
              <Link
                href="tel:+0433600592"
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] text-white`}
              >
                +0433600592
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
      <div className="bg-black">
        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] w-full mx-auto flex justify-between items-center py-1 px-4 md:px-0  text-white">
          <div className="md:w-[170px] lg:w-[200px] xl:w-[250px] w-[200px]">
            <Image
              width={1000}
              height={1000}
              src="/assets/logof.png"
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
                About Bridgitus Learning
              </Link>
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                href="/services"
              >
                Our Services
              </Link>
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                href="/classes"
              >
                Classes
              </Link>
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                href="/pricing"
              >
                Pricing
                {/* <div>
                  <Link href="/subjects">Maths</Link>
                  <Link href="/subjects">English </Link>
                  <Link href="/subjects">Physics</Link>
                  <Link href="/subjects">Chemistry</Link>
                  <Link href="/subjects">Biology</Link>
                </div> */}
              </Link>
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                href="/testimonials"
              >
                Testimonials
              </Link>
              <Link
                className={`md:text-[8px] lg:text-[11px] xl:text-[12px] `}
                href="/contact"
              >
                Contact
              </Link>
              <Button type="link" href="/register">
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
