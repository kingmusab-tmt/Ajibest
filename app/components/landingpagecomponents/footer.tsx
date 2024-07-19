import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import logo from "../../../public/ajibestlogo.png";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-500 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start">
        <div className="mb-6 md:mb-0">
          <div>
            <h3 className="font-bold text-lg mb-2">Useful Links</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  Buy Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Sell Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Rent Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Listings
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-6 md:mb-0">
          <div>
            <h3 className="font-bold text-lg mb-2">About</h3>
            <ul>
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Testimonies
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-6 md:mb-0">
          <h3 className="font-bold text-lg mb-2">Useful Links</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms and Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Copyright Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Fees and Charges
              </a>
            </li>
          </ul>
        </div>
        <div className="mb-6 md:mb-0">
          <Image
            src={logo}
            width="100"
            height="100"
            alt="Company Logo"
            className="mb-2 w-auto h-auto"
          />
          <p>
            No. 9 Beverly Close
            <br />
            Maiduguri
            <br />
            Borno State
          </p>
          <p>
            <a href="mailto:emailaddress@gmail.com" className="hover:underline">
              emailaddress@gmail.com
            </a>
          </p>
        </div>
      </div>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-8 border-t border-white pt-4">
        <div className="flex space-x-4">
          <p className="text-center">
            © {currentYear} A.A. Ajibest Land Vendors ltd. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-300">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaLinkedinIn />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
