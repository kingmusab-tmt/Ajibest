"use client";
import { useEffect, useState } from "react";
import Herosearch from "../landingpagecomponents/Herosearch";
import Buttons from "../landingpagecomponents/button";

const Hero = () => {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const backgrounds = [
    "/images/bgimage.webp",
    "/images/img2.webp",
    "/images/img3.webp",
    "/images/img4.webp",
    "/images/f.webp",
    "/images/b.jpeg",
    "/images/c.jpg",
    "/images/h.jpg",
    "/images/o.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div className="relative px-2 pt-14 h-screen lg:px-8">
      {/* Background overlay */}
      <div className="absolute inset-0 z-0">
        {/* Changing Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${backgrounds[backgroundIndex]}')`, // Use the current background image from the array
            filter: "contrast(0.6)", // Adjust contrast value as per your preference
            objectFit: "contain",
          }}
          aria-hidden="true"
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-4xl py-32 sm:py-48 lg:py-40 text-white">
        <div className="text-center">
          <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white">
            Fullfill Your Dream & Become a Property Owner with Ease
          </h1>

          <p className="mt-6 text-xl leading-8 text-white lg:py-5">
            Explore a wide range of Property for Sale or Rent
          </p>
          <div className="mt-48 sm:mt-20 flex items-center justify-center gap-x-0 mx-0">
            <Buttons
              text="Register Now"
              onClick={() => {}}
              className="text-xl w-1/2 h-14 rounded-t-lg bg-indigo-600 text-white hover:bg-indigo-500 font-bold mt-1"
            />
          </div>
          <div className="flex items-center justify-center">
            <Herosearch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
