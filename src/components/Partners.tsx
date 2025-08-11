import Image from "next/image";

function Partners() {
    return (
        <section className=" md:h-[calc(100vh-200px)] flex items-center md:pb-0 p-4 h-fit ">
            <div className="md:w-[1200px] md:mx-auto flex flex-col gap-10 md:py-20 py-10">
            <div className=" flex flex-col gap-4 items-center md:p-10 ">
          <h1 className="md:text-5xl text-3xl ">Some partners we&apos;ve worked with</h1>
          <p className="md:text-sm text-xs text-black/50 md:text-center">
            Join us on a journey beyond boundaries, where innovation isn&pos;t
            just a destination – it&apos;s the very fabric of our existence. At
            LOREON Technology, we&apos;re redefining the future by delivering
            cutting-edge solutions faster than you can imagine.
          </p>

          <div className="flex gap-3 md:gap-14 flex-wrap justify-center py-10">
            {[
              {id:1, img: "/assets/dm.png"}, 
              {id:2, img: "/assets/edu.png"}, 
              {id:3, img: "/assets/ixl.webp"}, 
              {id:4, img: "/assets/kah.png"}, 
              {id:5, img: "/assets/kh.png"},
              {id:6, img: "/assets/qz.png"}, 
              {id:7, img: "/assets/sl.jpg"}, 
            ].map((e) => (
              <div key={e.id} className="md:h-10 h-6 w-[150px] hover:scale-105 cursor-pointer transition-all duration-300 ">
                <Image src={e.img} alt="logo" width={1000} height={1000} className="w-full h-full object-contain" />
                
              </div>
            ))}
          </div>
        </div>
            </div>
        </section>
    );
}

export default Partners;