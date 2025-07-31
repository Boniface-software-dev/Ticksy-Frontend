import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import TicketLogo from "../assets/icons8-ticket-100.png";

const Navbar = () => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = ["home", "features", "how-it-works", "faqs"];
      let current = "";

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            current = id;
            break;
          }
        }
      }

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (id) =>
    `font-semibold transition-colors duration-200 ${
      active === id
        ? "!text-[#9747FF] !font-bold border-b-2 !border-[#9747FF] pb-1"
        : "text-gray-600 hover:text-[#9747FF]"
    }`;

  return (
    <nav className="bg-white shadow-sm py-4 px-6 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <img src={TicketLogo} alt="Ticksy Logo" className="w-8 h-8" /> {/* ✅ Updated logo */}
          <span className="text-2xl font-extrabold text-[#9747FF] tracking-tight">
            Ticksy
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#home" className={linkClass("home")}>
            Home
          </a>
          <a href="#features" className={linkClass("features")}>
            Features
          </a>
          <a href="#how-it-works" className={linkClass("how-it-works")}>
            How It Works
          </a>
          <a href="#faqs" className={linkClass("faqs")}>
            FAQs
          </a>
          <Link
            to="/login"
            className="text-[#9747FF] hover:text-[#8038D0] font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#9747FF] text-white px-4 py-2 rounded-md hover:bg-[#8038D0] transition-colors font-medium"
          >
            Register »
          </Link>
        </div>

        <button className="md:hidden text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
