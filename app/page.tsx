"use client";
import { useState, useEffect } from "react";
import Hero from "../app/components/landingpagecomponents/Hero";
import Diagram from "../app/components/landingpagecomponents/howto";
import WhyChooseUs from "../app/components/landingpagecomponents/whyus";
import Navbar from "../app/components/landingpagecomponents/navbar";
import Footer from "../app/components/landingpagecomponents/footer";
import FAQPage from "../app/components/landingpagecomponents/faq";
import FeaturedProperties from "./components/landingpagecomponents/featuredproperty";
import PushNotificationManager from "./components/generalcomponents/Subscribe";
import Services from "./components/landingpagecomponents/services";
import CustomerStats from "./components/landingpagecomponents/customerstat";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* Notification / subscription manager */}
      <PushNotificationManager />

      {/* Navigation */}
      <Navbar key="navbar" />

      {/* Hero section: immediately shows the value proposition */}
      <Hero key="hero" />

      {/* Customer stats: social proof early */}
      <CustomerStats />

      {/* Services offered */}
      <Services />

      {/* How it works / Diagram */}
      <Diagram key="diagram" />

      {/* Why choose us: credibility & trust */}
      <WhyChooseUs key="why-choose-us" />

      {/* Featured properties: highlights specific offerings */}
      <FeaturedProperties key="featured-properties" />

      {/* FAQ: handle objections or common questions */}
      <FAQPage key="faq-page" />

      {/* Footer with contact, links, social media */}
      <Footer key="footer" />
    </>
  );
}
