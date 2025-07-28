import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/authentification/authSlice";
import { useNavigate, Link } from "react-router-dom";

import Logo from "../../components/Logo";
import Avatar from "../../components/Avatar";
import AttendeeSideBar from "../../components/AttendeeSideBar";
import AttendeeNavBar from "../../components/AttendeeNavBar";

export default function AdminProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <AttendeeNavBar />

      <div className="max-w-7xl mx-auto p-4 flex gap-6">

        <AttendeeSideBar />  

        {/* Main Content */}
        <div className="flex-1">

          <h2 className="text-3xl font-semibold mb-4 text-black">My Profile</h2>

          <div className="bg-white rounded shadow text-black p-6 mb-6 flex gap-6 items-center">
            <Avatar size={100} />
            <div className="break-words">
              <h3 className="text-xl font-medium mb-1">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-gray-600 break-all">{user?.email}</p>
            </div>
          </div>

          <div className="bg-white rounded shadow text-black p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm">First Name</p>
                <p className="break-words">{user?.first_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Name</p>
                <p className="break-words">{user?.last_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Role</p>
                <p className="capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="break-all">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="break-words">{user?.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow text-black p-6 flex flex-wrap gap-4 justify-between">
            <button
              onClick={handleLogout}
              className="text-green-700 border border-green-700 px-4 py-2 rounded hover:bg-green-600 hover:text-white transition"
            >
              Upgrade Account
            </button>
            <button className="px-4 py-2 rounded text-red-400 border border-red-400 hover:bg-red-400 hover:text-white transition">
              Deactivate Account
            </button>
            <button className="px-4 py-2 rounded text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
