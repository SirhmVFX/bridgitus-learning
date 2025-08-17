import Button from "@/components/Button";
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

      <div>
        {/* <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto p-4 mx-auto pt-24 md:py-32 md:flex items-center gap-4">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-medium md:w-1/2">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-gray-500 text-base md:text-lg md:w-1/2">
            Have questions, suggestions, or want to partner with us? Reach out
            today and let’s work together to make a difference!
          </p>
        </div> */}

        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto mx-auto py-4 flex md:flex-row flex-col items-center gap-4">
          <div className=" flex md:flex-row flex-col gap-8 p-6 rounded-lg w-1/2">
            <form className="w-full flex flex-col gap-4 items-start">
              <h1 className="text-xl font-medium">Leave us your info </h1>
              <input
                type="text"
                className="w-full bg-transparent p-4 rounded-md border border-gray-300"
                placeholder="Your Name"
              />
              <input
                type="text"
                className="w-full bg-transparent p-4 rounded-md border border-gray-300"
                placeholder="Your Email"
              />
              <textarea
                className="w-full bg-transparent p-4 rounded-md border border-gray-300"
                placeholder="Your Message"
                rows={5}
              ></textarea>
              <div>
                <input type="checkbox" className="mr-2" />
                <label htmlFor="">
                  You agree to our friendly{" "}
                  <span className="text-primarycolor">privacy policy</span>
                </label>
              </div>
              <Button type="button">Send Message</Button>
            </form>
          </div>

          <div className="w-1/2 flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl  font-medium">Office Address</h1>

              <p className="text-gray-700 text-base  lg:text-lg"></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl  font-medium">Phone Number: </h1>

                <p className="text-gray-700  text-base  lg:text-lg">
                  +61433600592
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-xl  font-medium">Email Address: </h1>

                <p className="text-gray-700 text-base  lg:text-lg">
                  info@bridgitus.com
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-xl  font-medium">Social Media Links </h1>

              <div className="flex gap-4">
                <Link href={""} className="text-primarycolor">
                  Facebook
                </Link>
                <Link href={""} className="text-primarycolor">
                  Instagram{" "}
                </Link>
                <Link href={""} className="text-primarycolor">
                  LinkedIn
                </Link>
                <Link href={""} className="text-primarycolor">
                  Twitter/X
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
