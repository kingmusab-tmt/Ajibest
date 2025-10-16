// "use client";
// import { useState, useEffect } from "react";
// import Hero from "../app/components/landingpagecomponents/Hero";
// import Diagram from "../app/components/landingpagecomponents/howto";
// import WhyChooseUs from "../app/components/landingpagecomponents/whyus";
// import Navbar from "../app/components/landingpagecomponents/navbar";
// import Footer from "../app/components/landingpagecomponents/footer";
// import FAQPage from "../app/components/landingpagecomponents/faq";
// import FeaturedProperties from "./components/landingpagecomponents/featuredproperty";
// import PushNotificationManager from "./components/generalcomponents/Subscribe";
// import Services from "./components/landingpagecomponents/services";
// import CustomerStats from "./components/landingpagecomponents/customerstat";

// export default function Home() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   return (
//     <>
//       {/* Notification / subscription manager */}
//       <PushNotificationManager />

//       {/* Navigation */}
//       <Navbar key="navbar" />

//       {/* Hero section: immediately shows the value proposition */}
//       <Hero key="hero" />

//       {/* Customer stats: social proof early */}
//       <CustomerStats />

//       {/* Services offered */}
//       <Services />

//       {/* How it works / Diagram */}
//       <Diagram key="diagram" />

//       {/* Why choose us: credibility & trust */}
//       <WhyChooseUs key="why-choose-us" />

//       {/* Featured properties: highlights specific offerings */}
//       <FeaturedProperties key="featured-properties" />

//       {/* FAQ: handle objections or common questions */}
//       <FAQPage key="faq-page" />

//       {/* Footer with contact, links, social media */}
//       <Footer key="footer" />
//     </>
//   );
// }
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
import LoadingSpinner from "./components/generalcomponents/loadingSpinner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState(null);

  // Simulate fetching Hero content and other critical initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch hero content and other critical data
        // Replace with your actual API calls
        const [heroResponse] = await Promise.all([
          fetch("/api/aapi/hero-content"),
          // Add other critical API calls here if needed
        ]);

        const heroData = await heroResponse.json();
        setHeroData(heroData);

        // Simulate additional loading time for other critical resources
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Show global loading spinner until all critical content (especially Hero) is ready
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Notification / subscription manager */}
      <PushNotificationManager />

      {/* Navigation */}
      <Navbar key="navbar" />

      {/* Hero section: immediately shows the value proposition */}
      <Hero key="hero" data={heroData} />

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
