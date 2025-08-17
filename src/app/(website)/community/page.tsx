import { ArrowRightUp } from "@/components/Icons";
import Image from "next/image";
import Link from "next/link";

function Community() {
  return (
    <main>
      <section className="md:w-[1200px] w-full md:mx-auto md:px-0 px-4 pt-44">
        <div className="flex flex-col gap-4">
          <h1 className="md:text-6xl text-4xl text-center">
            Discover Together: Connect, Inspire, and Thrive with Bridgitus!
          </h1>
          <p className="text-xs md:text-sm text-black/50 text-center">
            Accelerate Your Growth: Learn and Build in Public with the Power of
            Community Support!
          </p>
        </div>
        <div className="w-full">
          <Image
            src="/assets/com.svg"
            alt="community"
            width={1000}
            height={1000}
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      <section className="md:w-[1200px] w-full md:mx-auto md:px-0 px-4 py-20">
        <div className="flex flex-col gap-4 md:w-3/4 mx-auto">
          <h1 className="md:text-5xl text-2xl text-center">
            Join our community of thriving and growing minds
          </h1>
          <p className="text-xs md:text-sm text-black/50 text-center">
            Accelerate Your Growth: Learn and Build in Public with the Power of
            Community Support!
          </p>
        </div>

        <div className="flex gap-6 py-10">
          <Link
            href="#"
            className="w-2/5 flex flex-col justify-between bg-[#1D2329] rounded-3xl"
          >
            <div className="flex justify-between p-8">
              <div>
                <h1 className="text-white text-xl">Slack</h1>
                <p className="text-white/50">Click to join </p>
              </div>

              <div className="p-4 rounded-full bg-white">
                <ArrowRightUp />
              </div>
            </div>

            <div className="px-14 pt-20">
              <Image
                src="/assets/slack.svg"
                alt="slack"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          <div className="w-3/5 flex flex-col gap-6">
            <Link
              href="#"
              className="flex justify-between h-2/4 bg-[#FBFBFB] rounded-3xl"
            >
              <div className="flex flex-col justify-between items-start p-8">
                <div>
                  <h1 className=" text-xl">Slack</h1>
                  <p className="">Click to join </p>
                </div>

                <div className="p-4 rounded-full bg-white">
                  <ArrowRightUp />
                </div>
              </div>

              <div className="pb-10">
                <Image
                  src="/assets/wassap.svg"
                  alt="wassap"
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            <div className="flex gap-6 h-2/4">
              <Link
                href="/about"
                className="w-1/2 p-8 bg-[#1362F3] rounded-3xl flex flex-col justify-between"
              >
                <div className="flex justify-between items-start ">
                  <div>
                    <h1 className="text-white text-sm">
                      Want to know more about us
                    </h1>
                    <p className="text-xs md:text-sm text-white/50">
                      Read about us
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-white/30">
                    <ArrowRightUp className="text-white" />
                  </div>
                </div>

                <h1 className="text-xl text-white">About us</h1>
              </Link>

              <Link
                href="/contact"
                className="w-1/2 p-8 bg-[#20A84E] rounded-3xl flex flex-col justify-between"
              >
                <div className="flex justify-between items-start ">
                  <div>
                    <h1 className="text-white text-sm">Have questions?</h1>
                    <p className="text-xs md:text-sm text-white/50">
                      Contact us
                    </p>
                  </div>
                  <div className="p-4 rounded-full bg-white/30">
                    <ArrowRightUp className="text-white" />
                  </div>
                </div>

                <h1 className="text-xl text-white">Contact us</h1>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Community;
