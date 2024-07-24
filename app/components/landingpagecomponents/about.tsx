import Image from "next/image";
import companyLogo from "../../../public/ajibestlogo.png"; // Adjust the path according to your project structure

const About = () => {
  return (
    <div className=" min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 pl-5 pr-5 pt-20 pb-16 sm:p-20">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Image
              src={companyLogo}
              alt="A.A AJibest Land Vendors Limited Logo"
              width={150}
              height={150}
            />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mt-4">
            A.A AJibest Land Vendors Limited
          </h1>
          <p className="text-lg mt-2">
            Registered with the Corporate Affairs Commission of Nigeria
          </p>
          <p className="text-sm">Registration Number: RC7364094</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 ">About Us</h2>
          <p className="text-justify">
            A.A AJibest Land Vendors Limited is a reputable estate management
            company dedicated to providing exceptional land, farm, and house
            rental and sales services. Whether you are looking to buy, rent, or
            lease on an installment plan, we offer flexible options tailored to
            meet your needs.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-justify">
            Our mission is to deliver high-quality estate management services
            that exceed our clients&lsquo; expectations by offering reliable and
            sustainable solutions for land and property acquisition and rental.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-justify">
            Our vision is to be the leading estate management company in
            Nigeria, recognized for our integrity, innovation, and excellence in
            service delivery.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Value Proposition</h2>
          <p className="text-justify">
            We offer a comprehensive range of estate management services,
            including land, farm, and house rentals and sales, with options for
            one-time payments or installment plans. Our commitment to
            transparency, customer satisfaction, and quality sets us apart in
            the industry.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Business Objectives</h2>
          <ul className="list-disc list-inside">
            <li className="text-justify">
              To provide top-notch estate management services that cater to the
              diverse needs of our clients.
            </li>
            <li className="text-justify">
              To foster long-term relationships with our clients through
              exceptional service and trust.
            </li>
            <li className="text-justify">
              To continually innovate and improve our service offerings to meet
              evolving market demands.
            </li>
            <li className="text-justify">
              To uphold the highest standards of professionalism, ethics, and
              integrity in all our dealings.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
