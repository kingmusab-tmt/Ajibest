import Image from "next/image";
import SerImg from "../../../public/images/services.png";
import icon1 from "../../../public/images/farmhouse.png";

interface Service {
  name: string;
  icon: string; // Use a string to refer to the icon image path
}

const services: Service[] = [
  {
    name: "Buying and Selling of Farm Lands",
    icon: "/icons/farmhouse.png",
  },
  {
    name: "Estate Management",
    icon: "/icons/estate.png",
  },
  {
    name: "Leasing/Renting out Property",
    icon: "/icons/house.png",
  },
  {
    name: "Buying and Selling of Plots of Land",
    icon: "/icons/location-pin.png",
  },
  {
    name: "Tenant Management",
    icon: "/icons/key.png",
  },
  {
    name: "Property Valuation",
    icon: "/icons/sublease.png",
  },
];

const Services: React.FC = () => {
  return (
    <div
      id="services"
      className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-8 rounded-lg shadow-lg max-w-6xl mx-auto mt-4"
    >
      {/* Left side: Main Image and Title */}
      <div className="flex flex-col items-center md:items-center md:w-1/3 text-center md:text-left">
        <p className="mt-0 sm:mt-4 text-3xl font-extrabold text-blue-700 text-center">
          Our Services
        </p>
        <div className="relative p-6 rounded-full">
          <Image
            src={SerImg}
            alt="A.A Ajibest Services"
            className="w-36 h-44 sm:w-96 md:h-72 rounded-full object-cover"
            priority
          />
        </div>
      </div>

      {/* Right side: Services list */}
      <div className="mt-8 md:mt-0 md:w-2/3">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center mb-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex-shrink-0">
              <Image
                src={service.icon}
                alt={service.name}
                width={32} // Adjust size as needed
                height={32} // Adjust size as needed
                className="text-xl"
              />
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-800">
                {service.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
