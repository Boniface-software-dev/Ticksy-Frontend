import React from "react";
import TicketLogo from "../assets/icons8-ticket-100.png";
import { useNavigate } from "react-router-dom";

function GuestNavBar() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={TicketLogo} alt="Ticksy Logo" className="w-8 h-8" />
          <span className="text-2xl font-extrabold text-[#9747FF] tracking-tight">
            Ticksy
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <a
            href="/login"
            className="text-gray-700 hover:text-[#9747FF] font-medium text-sm transition"
          >
            Login
          </a>
          <button
            onClick={handleRegister}
            className="bg-[#9747FF] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#8038D0] transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}

export default GuestNavBar;
