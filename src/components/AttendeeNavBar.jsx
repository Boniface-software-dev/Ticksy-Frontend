import React from "react";
import TicketLogo from '../assets/icons8-ticket-100.png';
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

function AttendeeNavBar() {
    const currentUser = useSelector((state) => state.auth.currentUser);

    return (
        <div className="flex justify-between items-center p-4">
            <div className="flex gap-1 items-center">
                <img src={TicketLogo} className="w-12 h-12" />
                <h2 className="text-purple-600 font-extrabold text-4xl">Ticksy</h2>
            </div>
            <div className="flex gap-10 mx-4">
                <div>
                <a href="/events" className="text-purple-500 hover:text-purple-600 cursor-pointer">Home</a>
                </div>
                {currentUser && (
                    
                  <div className="flex">
    <Link to={`/${currentUser?.role}/${currentUser?.id}/profile`}>
    <Avatar />
    </Link>
    <a href={`/${currentUser?.role}/${currentUser?.id}/profile`} className="text-black font-extralight px-1 py-1">
      {currentUser?.first_name} {currentUser?.last_name}
    </a>
  </div>


                )}
            </div>
        </div>
    );
}

export default AttendeeNavBar;
