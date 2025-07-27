import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../features/authentification/authSlice";
import { useSelector } from "react-redux";

export default function AttendeeSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation(); 
  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-full sm:w-64 bg-white rounded shadow text-black flex flex-col justify-between p-4 h-fit sm:h-[500px] sticky top-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">My Ticksy Account</h2>
        <nav className="space-y-2">
          <Link to={`/attendee/${currentUser?.id}/profile`}>
            <div
              className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                location.pathname === `/attendee/${currentUser?.id}/profile`
                  ? "bg-purple-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/parakeet-line/30/1A1A1A/user-male-circle.png"
                alt="user-male-circle"
              />
              <p>Profile</p>
            </div>
          </Link>

          <Link to={`/attendee/${currentUser.id}/upcoming-events`}>
            <div
              className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                location.pathname === `/attendee/${currentUser?.id}/upcoming-events`
                  ? "bg-purple-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/forma-thin-sharp/30/1A1A1A/baby-calendar.png"
                alt="baby-calendar"
              />
              <p>Events</p>
            </div>
          </Link>
        </nav>
      </div>

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