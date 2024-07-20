"use client";
// import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Hero from "../app/components/landingpagecomponents/Hero";
import Diagram from "../app/components/landingpagecomponents/howto";
import WhyChooseUs from "../app/components/landingpagecomponents/whyus";
import Navbar from "../app/components/landingpagecomponents/navbar";
import Footer from "../app/components/landingpagecomponents/footer";
import FAQPage from "../app/components/landingpagecomponents/faq";
import FeaturedProperties from "./components/landingpagecomponents/featuredproperty";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <Navbar key="navbar" />
      <Hero key="hero" />
      <Diagram key="diagram" />
      <FeaturedProperties key="featured-properties" />
      <WhyChooseUs key="why-choose-us" />
      <FAQPage key="faq-page" />
      <Footer key="footer" />
    </>
  );
}
