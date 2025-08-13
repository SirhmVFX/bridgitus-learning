import Image from "next/image";

function Partners() {
  return (
    <section className="flex items-center  ">
      <div className="md:w-[1000px] md:mx-auto flex md:flex-row flex-col items-center justify-between md:gap-20 gap-4 py-4 px-2 md:px-0">
        {/* <div className=" flex flex-col gap-4 items-center md:p-10 ">
          <h1 className="md:text-5xl text-3xl ">
            Some partners we&apos;ve worked with
          </h1>
          <p className="md:text-sm text-xs text-black/50 md:text-center">
            Join us on a journey beyond boundaries, where innovation isn&pos;t
            just a destination – it&apos;s the very fabric of our existence. At
            Bridgitus Learning, we&apos;re redefining the future by delivering
            education smoother than you can imagine.
          </p>
        </div> */}

        <h1 className="text-sm">Partner with:</h1>
        <div className="flex gap-2 md:gap-4  justify-between grow-1">
          {[
            { id: 1, img: "/assets/dm.png" },
            { id: 2, img: "/assets/edu.png" },
            { id: 3, img: "/assets/ixl.webp" },
            { id: 4, img: "/assets/kah.png" },
            { id: 5, img: "/assets/kh.png" },
            { id: 6, img: "/assets/qz.png" },
            { id: 7, img: "/assets/sl.jpg" },
          ].map((e) => (
            <div
              key={e.id}
              className="md:h-4 h-3 w-fit hover:scale-105 cursor-pointer transition-all duration-300 "
            >
              <Image
                src={e.img}
                alt="logo"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
