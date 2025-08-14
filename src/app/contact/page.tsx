import Image from "next/image";
import Link from "next/link";

function Contact() {
  return (
    <main>
      <section className="bg-black  relative  flex items-center justify-center md:h-[250px] lg:h-[300px] xl:h-[400px] h-[300px] ">
        <Image
          src="/assets/line2.png"
          alt="cta"
          width={1000}
          height={1000}
          className="w-full h-full object-cover absolute top-0 left-0 bottom-0"
        />

        <div className="flex flex-col gap-5 items-center justify-center absolute top-0 left-0 bottom-0 right-0 pt-20 ">
          <h1 className="md:w-2/3 text-2xl md:text-5xl text-white text-center">
            Get In Touch with us
          </h1>
          <p className="text-sm md:text-lg text-white/50">
            Let&apos;s build success together
          </p>
        </div>
      </section>

      <section className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto flex flex-col gap-10 items-center py-20 px-4 md:px-0">
        <div className="grid md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-1 p-6 border border-gray-200 rounded-2xl">
            <div>
              <h1 className="text-xs md:text-sm font-bold">Call us</h1>
            </div>
            <a
              href="tel:+0433600592"
              className="text-blue-500 text-base md:text-lg"
            >
              +0433600592
            </a>
          </div>
          <div className="flex flex-col gap-1 p-6 border border-gray-200 rounded-2xl">
            <div>
              <h1 className="text-xs md:text-sm font-bold">Email us</h1>
            </div>
            <a
              href="mailto:info@bridgitus.com"
              className="text-blue-500 text-base md:text-lg"
            >
              info@bridgitus.com
            </a>
          </div>
          <div className="flex flex-col gap-1 p-6 border border-gray-200 rounded-2xl">
            <div>
              <h1 className="text-xs md:text-sm font-bold">Text Us</h1>
            </div>
            <a
              href="tel:+0433600592"
              className="text-blue-500 text-base md:text-lg"
            >
              +0433600592
            </a>
          </div>
          <div className="flex flex-col gap-1 p-6 border border-gray-200 rounded-2xl">
            <div>
              <h1 className="text-xs md:text-sm font-bold">Follow us</h1>
            </div>
            <div>
              <Link
                href="https://www.facebook.com/bridgitus/"
                target="_blank"
              ></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
