import React from "react";
import TicksyLogo from "../assets/icons8-ticket-100.png"; 

function Logo() {
  return (
    <div className="flex items-center gap-1 p-4">
      <img src={TicksyLogo} alt="Logo" className="w-10 h-10" />
      <span className="text-4xl font-extrabold text-purple-600">Ticksy</span>
    </div>
  );
}

export default Logo;