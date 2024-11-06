import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import logo from "../../../public/ajibestlogo.png";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-800 text-blue-700 dark:text-white py-8">
      <div className="container mx-auto">
        <div className="pl-10 sm:pl-0 flex flex-wrap justify-between items-start md:flex-nowrap">
          <div className="w-full md:w-auto mb-6 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-2">Useful Links</h3>
            <ul>
              <li>
                <Link href="/login" className="hover:underline">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  Sell Property
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  Listings
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-auto mb-6 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-2">About</h3>
            <ul>
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#howitworks" className="hover:underline">
                  How it Works
                </Link>
              </li>
              {/* <li>
                <Link href="/#testimonies" className="hover:underline">
                  Testimonies
                </Link>
              </li> */}
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-auto mb-6 md:mb-0 md:mr-8">
            <h3 className="font-bold text-lg mb-2">Useful Links</h3>
            <ul>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-auto flex flex-col items-start sm:items-center">
            <Link href="/">
              <Image
                src={logo}
                width="100"
                height="100"
                alt="Company Logo"
                className="mb-2 w-auto h-auto"
              />
            </Link>
            <p className="text-left sm:text-center">
              No. 12 Golden Plaza,
              <br />
              Opp. El-Kanemi College
              <br />
              Maiduguri, Borno State
            </p>
            <p className="text-center">
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
              © {currentYear} A.A. Ajibest Land Vendors Ltd. All rights
              reserved.
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
      </div>
    </footer>
  );
};

export default Footer;
