import Link from "next/link";
import Button from "./Button";
import Image from "next/image";
import { Mail, Menu, Phone, Star } from "./Icons";

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 text-white">
      <div className="hidden md:block py-3 bg-[#161616]">
        <div className="w-[1200px] mx-auto flex items-center justify-between ">
          <div className="flex items-center gap-5 ">
            <div className="flex items-center gap-2">
              <Phone />
              <Link href="tel:+0433600592" className="text-xs">
              +0433600592
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Mail />
              <Link href="mailto:info@bridgitus.com" className="text-xs">
                bridgituslearning@gmail.com
              </Link>
            </div>
           
           
          </div>
              <Link href="#" className="text-xs flex items-center gap-2">
                <Star />5 star rating from 5000+ verified reviews
              </Link>
        </div>

        <div></div>
      </div>
      <div className="w-[1200px] mx-auto flex justify-between py-5 px-4 md:px-0">
        <div className="md:w-[350px] w-[250px]">
          <Image
            width={1000}
            height={1000}
            src="/assets/logow.png"
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="hidden md:block">
          <ul className="flex gap-5 items-center">
            <Link className="text-xs" href="/about">
              Why Bridgitus
            </Link>
            <Link className="text-xs" href="/projects">
              Projects
            </Link>
            <Link className="text-xs" href="/training">
              Training
            </Link>
            <Link className="text-xs" href="/community">
              Community
            </Link>
            <Link className="text-xs" href="/contact">
              Contact
            </Link>
            <Button type="button">Register Now</Button>
          </ul>
        </div>

        <div className="md:hidden block">
          <Menu />
        </div>
      </div>
    </header>
  );
}

export default Header;
