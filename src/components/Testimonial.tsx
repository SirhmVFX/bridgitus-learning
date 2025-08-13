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
          {
            id: 1,
            title:
              "Bridgitus Learning has transformed my daughter's approach to math. The personalized sessions made complex concepts so much easier to understand!",
            image: "/assets/test1.png",
            name: "- Sarah M., Parent",
          },
          {
            id: 2,
            title:
              "The tutors are incredibly engaging and patient. My son looks forward to his science lessons every week!",
            image: "/assets/test1.png",
            name: "- James L., Parent",
          },
          {
            id: 3,
            title:
              "Thanks to Bridgitus, I aced my AP English exam. The one-on-one attention really helped me improve my writing skills",
            image: "/assets/test1.png",
            name: "- Emily R., Student",
          },
        ].map((item, i) => (
          <div key={i} className="px-2">
            <div className="bg-black md:h-[300px] h-[200px] relative rounded-lg overflow-hidden">
              <div className="md:p-12 p-5 z-50 w-full md:w-3/4 ">
                <h3 className="text-white md:text-4xl text-xs">{item.title}</h3>
                <p className="text-white/50 text-xs md:text-base">
                  {item.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CenterMode;
