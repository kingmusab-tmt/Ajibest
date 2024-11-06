import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Slider from "react-slick";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import { Typography, Box, Container, Icon } from "@mui/material";

// Testimonials Data
const testimonials = [
  { name: "Jane Doe", comment: "Excellent service, highly recommended!" },
  { name: "John Smith", comment: "I found my dream home thanks to them!" },
  {
    name: "Alice Johnson",
    comment: "The experience was smooth and stress-free.",
  },
];

const CustomerStats = () => {
  // Setup scroll trigger for counter animation
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  // Settings for testimonial slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container mx-auto py-16 px-4 md:px-8">
      {/* First Div: Satisfied Customers and Properties Listed */}
      {/* <div className="flex flex-col md:flex-row justify-around items-center mb-16">
        <div ref={ref} className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            {inView && <CountUp start={1} end={500} duration={3} />}+
          </h2>
          <p className="text-lg text-gray-600">Satisfied Customers</p>
        </div>
        <div ref={ref} className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            {inView && <CountUp start={1} end={500} duration={3} />}+
          </h2>
          <p className="text-lg text-gray-600">Properties Listed</p>
        </div>
      </div> */}
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        mb={8}
      >
        <Box ref={ref} textAlign="center">
          <Icon color="primary" className="text-8xl">
            <PeopleIcon />
          </Icon>
          <Typography variant="h2" color="textPrimary" fontWeight="bold">
            {inView && <CountUp start={1} end={386} duration={3} />}+
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Satisfied Customers
          </Typography>
        </Box>
        <Box ref={ref} textAlign="center">
          <Icon color="primary" className="text-8xl">
            <HomeIcon />
          </Icon>
          <Typography variant="h2" color="textPrimary" fontWeight="bold">
            {inView && <CountUp start={1} end={500} duration={3} />}+
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Properties Listed
          </Typography>
        </Box>
      </Box>
      {/* Second Div: Customer Testimonials */}
      <div className="w-full md:w-2/3 mx-auto">
        <h3 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          What Our Customers Say
        </h3>
        <Slider {...sliderSettings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-md">
              <p className="text-lg italic text-gray-700 mb-4">
                &quot;{testimonial.comment}&quot;
              </p>
              <p className="text-right font-semibold text-gray-800">
                - {testimonial.name}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CustomerStats;
