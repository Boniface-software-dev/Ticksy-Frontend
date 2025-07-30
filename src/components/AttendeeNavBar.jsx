import React from "react";
import TicketLogo from "../assets/icons8-ticket-100.png";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

function AttendeeNavBar() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={TicketLogo} className="w-8 h-8" />
          <h2 className="text-purple-600 font-bold text-xl">Ticksy</h2>
        </div>
        <div className="flex items-center gap-6">
          <a href="/events" className="text-gray-700 hover:text-purple-600 text-sm font-medium transition">Home</a>
          {currentUser && (
            <Link
              to={`/${currentUser?.role}/${currentUser?.id}/profile`}
              className="flex items-center gap-2 hover:text-purple-600 transition"
            >
              <Avatar />
              <span className="text-sm text-gray-700">{currentUser?.first_name} {currentUser?.last_name}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendeeNavBar;