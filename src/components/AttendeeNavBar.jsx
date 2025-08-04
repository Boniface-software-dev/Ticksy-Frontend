import React from "react";
import TicketLogo from "../assets/icons8-ticket-100.png";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";


function AttendeeNavBar() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md">
      <div className="flex gap-2 items-center">
        <img src={TicketLogo} className="w-12 h-12" alt="logo" />
        <h2 className="text-purple-600 dark:text-purple-400 font-extrabold text-3xl">Ticksy</h2>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/events" className="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
          Home
        </Link>

        {currentUser && (
          <div className="flex items-center gap-2">
            <Link to={`/${currentUser?.role}/${currentUser?.id}/profile`}>
              <Avatar />
            </Link>
            <Link
              to={`/${currentUser?.role}/${currentUser?.id}/profile`}
              className="text-black dark:text-white font-light px-1"
            >
              {currentUser?.first_name} {currentUser?.last_name}
            </Link>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default AttendeeNavBar;
