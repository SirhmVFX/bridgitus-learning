import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "./Icons";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-secondary-color md:p-20 py-10 px-4">
      <div className="md:w-[1200px] w-full md:mx-auto md:grid md:grid-cols-4 grid grid-cols-1 gap-5">
        <div className="flex flex-col gap-3">
          <div className="w-[200px]">
            <Image
              src="/assets/logof.png"
              alt="logo"
              width={1000}
              height={1000}
            />
          </div>
          <div className="flex items-center gap-2">
            <Phone />
            <Link href="tel:+0433600592" className="text-xs text-white/50">
              +0433600592
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Mail />
            <Link
              href="mailto:info@bridgitus.com"
              className="text-xs text-white/50"
            >
              info@bridgitus.com
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-sm text-white">Legal</h1>
          {[
            { id: 1, title: "Terms & Conditions", url: "#" },
            { id: 2, title: "Code of Conduct", url: "#" },
            { id: 3, title: "Privacy & Data Protection", url: "#" },
            { id: 4, title: "Privacy Policy", url: "#" },
          ].map((e) => (
            <Link className="text-xs text-white/50" key={e.id} href={e.url}>
              {e.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-sm text-white">Company</h1>
          {[
            { id: 1, title: "About Us", url: "#" },
            { id: 2, title: "Contact", url: "#" },
            { id: 3, title: "Academy", url: "#" },
          ].map((e) => (
            <Link className="text-xs text-white/50" key={e.id} href={e.url}>
              {e.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-sm text-white">Socials</h1>
          <div className="flex gap-2 ">
            {[
              { id: 1, title: "Facebook", url: "#", icon: <Facebook /> },
              { id: 2, title: "Instagram", url: "#", icon: <Instagram /> },
              { id: 3, title: "Linkedin", url: "#", icon: <Linkedin /> },
            ].map((e) => (
              <Link
                className="text-xs text-white/50 flex items-center gap-2 bg-white/10 rounded-full p-2"
                key={e.id}
                href={e.url}
              >
                {e.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
