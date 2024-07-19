"use client";
// import Image from "next/image";
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
  ]; // Add paths to your background images

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Change background every 5 seconds

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
// export default Hero;
// const Hero = () => {
//   return (
//     <div className="relative isolate px-6 pt-14 h-screen lg:px-8">
//       {/* Background overlay */}
//       <div
//         className="absolute inset-0 z-0 bg-cover bg-center"
//         style={{
//           backgroundImage: `url('/images/bgimage.webp')`, // Use the relative path to your image
//           filter: "contrast(0.6)", // Adjust contrast value as per your preference
//         }}
//         aria-hidden="true"
//       ></div>

//       {/* Main content */}
//       <div className="relative z-10 mx-auto max-w-4xl py-32 sm:py-48 lg:py-40 text-white">
//         {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
//           <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
//             Announcing our next round of funding.{" "}
//             <a href="#" className="font-semibold text-indigo-600">
//               <span className="absolute inset-0" aria-hidden="true"></span>Read
//               more <span aria-hidden="true">&rarr;</span>
//             </a>
//           </div>
//         </div> */}
//         <div className="text-center">
//           <h1 className="text-7xl font-bold tracking-tight text-white-900 sm:text-6xl">
//             Fullfill Your Dream and Become a Property Owner with Ease
//           </h1>
//           <p className="mt-6 text-xl leading-8 text-white-600 lg:py-5">
//             Explore a wide range of Property for Sale or Rent
//           </p>
//           <div className="mt-10 flex items-center justify-center gap-x-6">
//             <a
//               href="#"
//               className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Get started
//             </a>
//             <a
//               href="#"
//               className="text-sm font-semibold leading-6 text-gray-900"
//             >
//               Learn more <span aria-hidden="true">→</span>
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;
