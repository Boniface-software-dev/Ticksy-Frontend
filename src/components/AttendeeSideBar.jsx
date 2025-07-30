import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../features/authentification/authSlice";

export default function AttendeeSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [eventsOpen, setEventsOpen] = useState(true); 

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full sm:w-64 bg-white rounded shadow text-black flex flex-col justify-between p-4 h-fit sm:h-[500px] sticky top-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">My Ticksy Account</h2>
        <nav className="space-y-2">

          {/* Profile Link */}
          <Link to={`/attendee/${currentUser?.id}/profile`}>
            <div className={`flex items-center gap-2 p-2 rounded cursor-pointer ${isActive(`/attendee/${currentUser?.id}/profile`) ? "bg-purple-200" : "hover:bg-gray-100"}`}>
              <img src="https://img.icons8.com/parakeet-line/30/1A1A1A/user-male-circle.png" />
              <p>Profile</p>
            </div>
          </Link>

          {/* Events Parent */}
          <div className="cursor-pointer" onClick={() => setEventsOpen(!eventsOpen)}>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
              <img src="https://img.icons8.com/forma-thin-sharp/30/1A1A1A/baby-calendar.png" />
              <p>Events</p>
              <span className="ml-auto text-xs text-gray-500">{eventsOpen ? "▾" : "▸"}</span>
            </div>
          </div>

          {/* Events Sub-links */}
          {eventsOpen && (
            <div className="ml-6 space-y-1">
              <Link to={`/attendee/${currentUser?.id}/upcoming-events`}>
                <div className={`p-2 rounded text-sm cursor-pointer ${isActive(`/attendee/${currentUser?.id}/upcoming-events`) ? "bg-purple-100" : "hover:bg-gray-100"}`}>
                  Upcoming Events
                </div>
              </Link>

              <Link to={`/attendee/${currentUser?.id}/past-events`}>
                <div className={`p-2 rounded text-sm cursor-pointer ${isActive(`/attendee/${currentUser?.id}/past-events`) ? "bg-purple-100" : "hover:bg-gray-100"}`}>
                  Past Events
                </div>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full mt-6 text-amber-500 border border-amber-500 px-4 py-2 rounded hover:bg-amber-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
