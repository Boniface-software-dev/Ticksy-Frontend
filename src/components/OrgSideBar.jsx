import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import Avatar from "./Avatar";
import Logo from "./Logo";

function OrgSideBar() {
  const user = useSelector((state) => state.auth.currentUser);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow">
        <Logo />
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl font-bold border text-black">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block fixed md:static top-0 left-0 h-screen w-2/3 md:w-1/6 bg-[#f3f3f5] z-50 shadow-md transition-all duration-300 text-gray-600 border-white`}
      >
        <nav className="h-full flex flex-col border-r shadow-sm">
          {/* Logo */}
          <div className="overflow-hidden p-4 hidden md:block">
            <Logo />
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-3 space-y-2 mt-4">
            <Link
              to={`/${user?.role}/${user?.id}/dashboard`}
              className={`flex items-center space-x-2 p-2 rounded transition ${
                currentPath === `/${user?.role}/${user?.id}/dashboard`
                  ? "bg-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <img
                width="25"
                height="25"
                src="https://img.icons8.com/external-nawicon-detailed-outline-nawicon/25/1A1A1A/external-stamp-law-and-justice-nawicon-detailed-outline-nawicon.png"
                alt="Upcoming Events"
              />
              <span>Upcoming Events</span>
            </Link>

            <Link
              to={`/${user?.role}/${user?.id}/pending-events`}
              className={`flex items-center space-x-2 p-2 rounded transition ${
                currentPath === `/${user?.role}/${user?.id}/pending-events`
                  ? "bg-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <img
                width="25"
                height="25"
                src="https://img.icons8.com/pulsar-line/30/1A1A1A/hourglass-sand-bottom.png"
                alt="Pending Events"
              />
              <span>Pending Events</span>
            </Link>

            <Link
              to={`/${user?.role}/${user?.id}/rejected-events`}
              className={`flex items-center space-x-2 p-2 rounded transition ${
                currentPath === `/${user?.role}/${user?.id}/rejected-events`
                  ? "bg-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <img
                width="25"
                height="25"
                src="https://img.icons8.com/ios/30/1A1A1A/error.png"
                alt="Rejected Events"
              />
              <span>Rejected Events</span>
            </Link>

            <Link
              to={`/${user?.role}/${user?.id}/event-history`}
              className={`flex items-center space-x-2 p-2 rounded transition ${
                currentPath === `/${user?.role}/${user?.id}/event-history`
                  ? "bg-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <img
                width="25"
                height="25"
                src="https://img.icons8.com/ios/30/1A1A1A/time-machine--v1.png"
                alt="Event History"
              />
              <span>Event History</span>
            </Link>
          </div>

          {/* Footer with Avatar */}
          <div className="border-t flex items-center p-3">
            <Avatar />
            <div className="ml-3 leading-4">
              <Link
                to={`/organizer/${user?.id}/profile`}
                className="font-semibold block"
              >
                {user?.first_name} {user?.last_name}
              </Link>
              <span className="text-xs text-gray-600 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default OrgSideBar;
