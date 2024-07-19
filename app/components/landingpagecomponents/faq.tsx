// pages/FAQ.tsx
import { useState } from "react";
import Image from "next/image";
import Accordion from "../landingpagecomponents/accordion";
import cutstomer from "@/public/images/customer care.png";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is your return policy?",
    answer: "You can return any item within 30 days of purchase.",
  },
  {
    question: "How can I contact customer service?",
    answer:
      "You can reach our customer service at support@example.com or call us at (123) 456-7890.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to over 50 countries worldwide.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You can track your order using the tracking number provided in your shipment confirmation email.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start px-4 py-16 bg-blue-300">
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onClick={() => handleAccordionClick(index)}
          />
        ))}
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <Image
          src={cutstomer}
          alt="Customer Care"
          width={500}
          height={400}
          className="rounded-lg shadow-lg mb-8"
        />
        <button className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700">
          Get in Touch
        </button>
      </div>
    </div>
  );
};

export default FAQPage;