"use client";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineInstagram,
  AiOutlineFacebook,
  AiOutlineGoogle,
} from "react-icons/ai";
import { useSession, signOut } from "next-auth/react";
import { useContext, useState } from "react";
import logo from "@/public/ajibestlogo.png";
import LayoutContext from "../generalcomponents/LayoutContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { openModal } = useContext(LayoutContext);

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  };
  const isUrl = (str) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageSrc = isUrl(session?.user?.image)
    ? session?.user?.image
    : `/uploads/${session?.user?.image}`;
  return (
    <div>
      <nav className="fixed w-full h-16 shadow-2xl bg-white dark:bg-slate-800 z-50">
        <div className="flex justify-between items-center h-full w-full px-4 2xl:px-16">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              width="60"
              height="60"
              className="cursor-pointer w-auto h-auto"
              priority
            />
          </Link>
          <div className="hidden sm:flex justify-center flex-1">
            <ul className="flex space-x-10">
              <Link href="/about">
                <li className="uppercase hover:border-b-2 hover:border-b-blue-800">
                  About Us
                </li>
              </Link>
              <Link href="/#services" scroll={true}>
                <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                  Services
                </li>
              </Link>
              <Link href="/#faq" scroll={true}>
                <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                  FAQs
                </li>
              </Link>
              <Link href="" onClick={openModal}>
                <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                  {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-lg"> */}
                  Payment Calculator
                  {/* </button> */}
                </li>
              </Link>
              <Link href="/contact">
                <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                  Contact Us
                </li>
              </Link>
            </ul>
          </div>
          <div className="hidden sm:flex space-x-6">
            {session ? (
              <>
                <ul className="flex justify-center space-x-10">
                  <Link href="/">
                    <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                      <button onClick={() => signOut()}>Sign out</button>
                    </li>
                  </Link>
                  <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                    <Link
                      href={
                        session.user.role === "Admin"
                          ? "/admin"
                          : "/userprofile"
                      }
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={
                        session.user.role === "Admin"
                          ? "/admin"
                          : "/userprofile"
                      }
                    >
                      <Image
                        src={`${imageSrc}`}
                        alt="Profile picture"
                        width={30}
                        height={30}
                        className="rounded-full cursor-pointer"
                        priority
                      />
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul className="flex space-x-10">
                  <div>
                    <Link href="/login">
                      <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                        Login
                      </li>
                    </Link>
                  </div>
                  <div>
                    <Link href="/signup">
                      <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                        Signup
                      </li>
                    </Link>
                  </div>
                </ul>
              </>
            )}
          </div>
          <div onClick={handleNav} className="sm:hidden cursor-pointer pl-24">
            <AiOutlineMenu size={25} />
          </div>
        </div>
        <div
          className={
            menuOpen
              ? "fixed left 0 top-0 w-[65%] sm:hidden h-screen bg-[#ecf0f3] p-10 ease-in duration-500"
              : "fixed left-[-100%] top-0 p-10 ease-in duration-500"
          }
        >
          <div className="flex w-full items-center justify-end">
            <div onClick={handleNav} className="sm:hidden cursor-pointer pl-24">
              <AiOutlineClose size={25} />
            </div>
          </div>
          <div className="flex-col py-4">
            <ul>
              <div>
                <Link href="/">
                  <li
                    onClick={() => setMenuOpen(false)}
                    className="py-4 cursor-pointer text-red-600 font-bold"
                  >
                    Home
                  </li>
                </Link>
              </div>
              <div>
                <Link href="/about">
                  <li
                    onClick={() => setMenuOpen(false)}
                    className="py-4 cursor-pointer text-red-600 font-bold"
                  >
                    About Us
                  </li>
                </Link>
              </div>
              <div>
                <Link href="/#services">
                  <li
                    onClick={() => setMenuOpen(false)}
                    className="py-4 cursor-pointer text-red-600 font-bold"
                  >
                    <span className="uppercase hover:hover:border-b-2 hover:border-b-blue-800 cursor-pointer">
                      Services
                    </span>
                    <ul className="absolute hidden group-hover:block bg-white shadow-lg mt-2 w-52">
                      <div>
                        <Link href="/userprofile">
                          <li
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2 hover:bg-gray-100"
                          >
                            Buy/Sell-House
                          </li>
                        </Link>
                      </div>
                      <div>
                        <Link href="/userprofile">
                          <li
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2 hover:bg-gray-100"
                          >
                            Rent-House/Farm
                          </li>
                        </Link>
                      </div>
                      <div>
                        <Link href="/userProfile">
                          <li
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2 hover:bg-gray-100"
                          >
                            Buy/Sell-Land
                          </li>
                        </Link>
                      </div>
                    </ul>
                  </li>
                </Link>
              </div>
              <div>
                <Link href="/contact">
                  <li
                    onClick={() => setMenuOpen(false)}
                    className="py-4 cursor-pointer text-red-600 font-bold"
                  >
                    Contact
                  </li>
                </Link>
              </div>
            </ul>
            <div className="flex-col py-4">
              {session ? (
                <>
                  <ul>
                    <Link href="/">
                      <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                        <button onClick={() => signOut()}>Sign out</button>
                      </li>
                    </Link>
                    <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                      <Link
                        href={
                          session.user.role === "Admin"
                            ? "/admin"
                            : "/userprofile"
                        }
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={
                          session.user.role === "Admin"
                            ? "/admin"
                            : "/userprofile"
                        }
                      >
                        <Image
                          src={`${imageSrc}`}
                          alt="Profile picture"
                          width={30}
                          height={30}
                          className="rounded-full cursor-pointer"
                          priority
                        />
                      </Link>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <ul className="flex flex-col space-y-6">
                    <div>
                      <Link href="/login">
                        <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                          Login
                        </li>
                      </Link>
                    </div>
                    <div>
                      <Link href="/signup">
                        <li className="uppercase hover:hover:border-b-2 hover:border-b-blue-800">
                          Signup
                        </li>
                      </Link>
                    </div>
                  </ul>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-around pt-10 items-center cursor-pointer">
            <Link href="https://www.instagram.com/barebykristen/?hl=en">
              <AiOutlineInstagram size={30} />
            </Link>
            <Link href="https://web.facebook.com/barebykristen/?_rdc=1&_rdr">
              <AiOutlineFacebook size={30} />
            </Link>
            <Link href="https://www.google.com/maps/place/BARE+by+Kristen/@40.894809,-73.976772,17z/data=!3m1!4b1!4m8!3m7!1s0x89c2f6fb1daad08d:0x5f51ba263038f799!8m2!3d40.894809!4d-73.976772!9m1!1b1!16s%2Fg%2F1yg6d443k?entry=ttu">
              <AiOutlineGoogle size={30} />
            </Link>
          </div>
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              width="100"
              height="100"
              className="cursor-pointer pt-10 w-auto h-auto"
              priority
            />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
