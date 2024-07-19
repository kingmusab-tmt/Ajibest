import {
  FaSearch,
  FaCalendarAlt,
  FaCheck,
  FaMoneyBillAlt,
  FaStar,
  FaFolder,
  FaHome,
} from "react-icons/fa"; // Import specific icons
import { ImTextColor } from "react-icons/im";

interface Step {
  title: string;
  description?: string;
  icon: React.ComponentType<any>; // Specify icon component type
  color?: string;
}

const steps: Step[] = [
  { title: "Search Properties", icon: FaSearch },
  { title: "Schedule Viewing", icon: FaCalendarAlt },
  { title: "Accept Offer & Initial Payment", icon: FaCheck },
  { title: "Deposit Monthly", icon: FaMoneyBillAlt },
  { title: "Complete Payment", icon: FaCheck },
  { title: "Collect Documents", icon: FaFolder }, // Replace with FaFolder if available
  { title: "Congratulations!!!", icon: FaStar },
  { title: "You Own a Land", icon: FaHome },
];

const Diagram = () => {
  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.random() * 0.75 + 0.25;
    const lightness = Math.random() * 0.5 + 0.5;
    return `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
  };

  return (
    <div className="mt-10 p-4 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">How It Works</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {" "}
        {/* Responsive grid */}
        {steps.map((step, index) => {
          const randomColor = generateRandomColor();
          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-between p-4 border rounded-lg shadow-md step-${
                index + 1
              }`}
              style={{ backgroundColor: randomColor }} // Apply random color as inline style
            >
              <div className="flex items-center mb-2">
                <step.icon className={`w-6 h-6 mr-2 text-${randomColor}`} />{" "}
                {/* Use random color for icons */}
                <div className="text-xl font-bold">Step {index + 1}</div>
              </div>
              <div className="text-center">{step.title}</div>
              {step.description && (
                <p className="text-sm text-gray-500 mt-2">{step.description}</p>
              )}
              {index < steps.length - 1 && (
                <div className="mt-2">
                  <svg
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 01
                      1.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0
                      010-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Diagram;
