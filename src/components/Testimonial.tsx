"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Star2 } from "./Icons";

function CenterMode() {
  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "90px",
    centerMode: true,
    slidesToShow: 2,
    speed: 500,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // tablets and smaller laptops
        settings: {
          slidesToShow: 1,
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
            name: "Sarah M., Parent",
          },
          {
            id: 2,
            title:
              "The tutors are incredibly engaging and patient. My son looks forward to his science lessons every week!",
            image: "/assets/test1.png",
            name: "James L., Parent",
          },
          {
            id: 3,
            title:
              "Thanks to Bridgitus, I aced my AP English exam. The one-on-one attention really helped me improve my writing skills",
            image: "/assets/test1.png",
            name: "Emily R., Student",
          },
        ].map((item, i) => (
          <div key={i} className="px-2">
            <div className="border border-gray-300 flex flex-col gap-2 justify-center items-center p-8 h-full rounded-lg overflow-hidden">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <p className="text-white text-xs md:text-base">
                  {item.name.split(" ")[0].charAt(0).toUpperCase()}
                </p>
              </div>
              <p className=" text-xs md:text-base font-bold">{item.name}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <Star2 key={i} />
                ))}
              </div>
              <h3 className=" text-center">{item.title}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CenterMode;
