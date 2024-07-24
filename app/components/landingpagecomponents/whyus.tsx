import { FaLock, FaHeadset, FaRegLightbulb, FaBuilding } from "react-icons/fa";

interface Step {
  title: string;
  description: string;
  icon: JSX.Element;
}

const steps: Step[] = [
  {
    title: "Secure Transactions",
    description:
      "We prioritize secure transactions to protect your peace of mind.",
    icon: <FaLock size={50} className="text-red-500" />,
  },
  {
    title: "Excellent Customer Support",
    description: "Our dedicated team is always here to assist you.",
    icon: <FaHeadset size={50} className="text-blue-500" />,
  },
  {
    title: "Personalized Recommendations",
    description: "We match you with properties that meet your needs.",
    icon: <FaRegLightbulb size={50} className="text-green-500" />,
  },
  {
    title: "Extensive Property Listings",
    description: "Explore a wide range of properties to find your perfect fit.",
    icon: <FaBuilding size={50} className="text-yellow-500" />,
  },
];

const WhyChooseUs = () => {
  return (
    <div className="mt-10 why-choose-us bg-blue-100 py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-black">
        Why Choose Us?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 border rounded-lg shadow-md bg-white text-center"
          >
            <div className="mb-4">{step.icon}</div>
            <div className="text-xl font-bold mb-2 dark:text-black">
              {step.title}
            </div>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
