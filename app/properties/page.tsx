import React from "react";
import Navbar from "../components/landingpagecomponents/navbar";
import Footer from "../components/landingpagecomponents/footer";
import PropertiesPage from "./properties";

const PropertySearchResult = () => {
  return (
    <>
      <Navbar />
      <PropertiesPage />
      <Footer />
    </>
  );
};

export default PropertySearchResult;
