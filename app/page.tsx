"use client";
import { useSession, signOut } from "next-auth/react";
import { useContext } from "react";
// import Link from "next/link";
import Hero from "../app/components/landingpagecomponents/Hero";
import Diagram from "../app/components/landingpagecomponents/howto";
import WhyChooseUs from "../app/components/landingpagecomponents/whyus";
import Navbar from "../app/components/landingpagecomponents/navbar";
import Footer from "../app/components/landingpagecomponents/footer";
import FAQPage from "../app/components/landingpagecomponents/faq";
import FeaturedProperties from "./components/landingpagecomponents/featuredproperty";
// import type { AppProps } from "next/app";
// import Testimonials from "./components/testimonial";
// import LayoutContext from "./components/LayoutContext";

/* {session ? (
        <>
          <h1>Welcome, {session.user?.name}</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <Link href="/login">Login </Link>
      )} */
export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Navbar />
      <Hero />
      <Diagram />
      <FeaturedProperties />
      <WhyChooseUs />
      <FAQPage />
      <Footer />
    </>
  );
}
