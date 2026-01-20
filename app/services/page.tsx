import React from "react";
import Navbar from "../components/landingpagecomponents/navbar";
import Footer from "../components/landingpagecomponents/footer";
import ServicesPageContent from "./ServicesPage";

const ServicesPageRoute = () => {
  return (
    <>
      <Navbar />
      <ServicesPageContent />
      <Footer />
    </>
  );
};

export default ServicesPageRoute;
