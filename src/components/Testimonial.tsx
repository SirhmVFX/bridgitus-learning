"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

function CenterMode() {
  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "90px",
    centerMode: true,
    slidesToShow: 1,
    speed: 500,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // tablets and smaller laptops
        settings: {
          slidesToShow: 2,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 268, // mobile
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="slider-container px-4">
      <Slider {...settings}>
        {[
            {id: 1, title: "Bridgitus Learning has transformed my daughter&apos;s approach to math. The personalized sessions made complex concepts so much easier to understand!", image: "/assets/test1.png", name: "- Sarah M., Parent", },
            {id: 2, title: "Bridgitus Learning has transformed my daughter&apos;s approach to math. The personalized sessions made complex concepts so much easier to understand!", image: "/assets/test1.png", name: "- Sarah M., Parent", },
            {id: 3, title: "Bridgitus Learning has transformed my daughter&apos;s approach to math. The personalized sessions made complex concepts so much easier to understand!", image: "/assets/test1.png", name: "- Sarah M., Parent", },
            {id: 4, title: "Bridgitus Learning has transformed my daughter&apos;s approach to math. The personalized sessions made complex concepts so much easier to understand!", image: "/assets/test1.png", name: "- Sarah M., Parent", },
        ].map((item, i) => (
          <div key={i} className="px-2"> {/* gap between slides */}
            <div className="bg-black md:h-[300px] h-[200px] relative rounded-lg overflow-hidden">
              {/* Image */}
              <div className="hidden md:block w-[220px] h-full absolute bottom-0 right-0 z-10">
                <Image
                  src={item.image}
                  alt="testimonial"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Text */}
              <div className="md:p-12 p-5 z-50 w-full md:w-3/4 ">
                <h3 className="text-white md:text-4xl text-xs">
                  {item.title}
                </h3>
                <p className="text-white/50 text-xs md:text-base">{item.name}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CenterMode;
