import Image from "next/image";

function Partners() {
    return (
        <section className=" ">
            <div className="md:w-[1200px] md:mx-auto flex flex-col gap-10 py-20 px-4 md:px-0">
            <div className=" flex flex-col gap-4 items-center md:p-10 p-4">
          <h1 className="md:text-5xl text-4xl ">Some partners we&apos;ve worked with</h1>
          <p className="md:text-sm text-xs text-black/50 md:text-center">
            Join us on a journey beyond boundaries, where innovation isn&pos;t
            just a destination – it&apos;s the very fabric of our existence. At
            LOREON Technology, we&apos;re redefining the future by delivering
            cutting-edge solutions faster than you can imagine.
          </p>

          <div className="flex gap-8 flex-wrap justify-center py-10">
            {[
              {id:1, img: "/assets/dm.png"}, 
              {id:2, img: "/assets/edu.png"}, 
              {id:3, img: "/assets/ixl.webp"}, 
              {id:4, img: "/assets/kah.png"}, 
              {id:5, img: "/assets/kh.png"},
              {id:6, img: "/assets/qz.png"}, 
              {id:7, img: "/assets/sl.jpg"}, 
            ].map((e) => (
              <div key={e.id} className="h-10">
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