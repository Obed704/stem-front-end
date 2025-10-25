import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({
  bgColor = "bg-black/70", // background color
  textColor = "text-white", // link text color
  hoverColor = "text-yellow-400", // link hover color
  backdrop = true, // backdrop blur effect
  fixed = true, // fixed or absolute positioning
  navLinksProp = null, // optional custom navLinks
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Default nav links
  const defaultLinks = [
    { name: "Home", link: "/" },
    { name: "Our Project", link: "/ourProjects" },
    { name: "Donate", link: "/donate" },
    { name: "Champions", link: "/champions" },
    { name: "Resources", link: "/resources" },
    { name: "FTC", link: "/ftc" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  const navLinks = navLinksProp || defaultLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        fixed ? "fixed" : "absolute"
      } top-0 left-0 w-full flex justify-between items-center px-8 py-3 z-50 transition-all duration-300 ${
        scrolled ? `${bgColor} ${backdrop ? "backdrop-blur-md" : ""}` : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link
        to="/"
        className={`text-2xl font-bold flex items-center gap-1 transition-transform duration-300 hover:scale-105 ${textColor}`}
      >
        <span className="text-blue-400">STEM</span>
        <span className="text-yellow-400">Inspires</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex gap-6 items-center">
        {navLinks.map(({ name, link }) => (
          <Link
            key={name}
            to={link}
            className={`relative group transition-colors duration-300 pb-2 ${textColor} hover:${hoverColor}`}
          >
            {name}
            <span
              className={`absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full`}
            ></span>
          </Link>
        ))}
      </div>

      {/* Hamburger Menu */}
      <div
        className="lg:hidden flex flex-col gap-1 cursor-pointer z-50 mb-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`w-6 h-0.5 transition-all duration-300 ${textColor}`}>__</span>
        <span className={`w-6 h-0.5 transition-all duration-300 ${textColor}`}>__</span>
        <span className={`w-6 h-0.5 transition-all duration-300 ${textColor}`}>__</span>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-95 flex flex-col items-center justify-center gap-8 text-2xl lg:hidden transform transition-transform duration-300 ${
          menuOpen ? "translate-y-0 overflow-y-auto" : "-translate-y-full"
        }`}
      >
        {navLinks.map(({ name, link }) => (
          <Link
            key={name}
            to={link}
            className={`relative group transition ${textColor} hover:${hoverColor}`}
            onClick={() => setMenuOpen(false)}
          >
            {name}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
