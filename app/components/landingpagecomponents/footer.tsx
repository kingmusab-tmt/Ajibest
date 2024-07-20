import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import logo from "../../../public/ajibestlogo.png";
import Image from "next/image";
import Link from "next/link";
import { Link2Icon } from "lucide-react";

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
                <Link href="#" className="hover:underline">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Sell Property
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Listings
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-6 md:mb-0">
          <div>
            <h3 className="font-bold text-lg mb-2">About</h3>
            <ul>
              <li>
                <Link href="#" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Testimonies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-6 md:mb-0">
          <h3 className="font-bold text-lg mb-2">Useful Links</h3>
          <ul>
            <li>
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Copyright Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Fees and Charges
              </Link>
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
            <Link
              href="mailto:emailaddress@gmail.com"
              className="hover:underline"
            >
              emailaddress@gmail.com
            </Link>
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
          <Link href="#" className="hover:text-gray-300">
            <FaFacebookF />
          </Link>
          <Link href="#" className="hover:text-gray-300">
            <FaTwitter />
          </Link>
          <Link href="#" className="hover:text-gray-300">
            <FaLinkedinIn />
          </Link>
          <Link href="#" className="hover:text-gray-300">
            <FaInstagram />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
