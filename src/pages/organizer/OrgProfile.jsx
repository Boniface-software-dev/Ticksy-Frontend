import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/authentification/authSlice";
import { useNavigate, Link } from "react-router-dom";

import Logo from "../../components/Logo";
import Avatar from "../../components/Avatar";

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
      <Logo />
      <div className="max-w-4xl mx-auto p-4">
        <Link
          to={`/${user?.role}/${user?.id}/dashboard`}
          className="text-blue-500 mb-4 inline-block"
        >
          Back to Dashboard
        </Link>

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
          <h3 className="text-xl font-semibold mb-4 border-b-1 pb-2">Personal Information</h3>
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
            className="text-amber-500 border border-amber-500 px-4 py-2 rounded hover:bg-amber-500 hover:text-white transition"
          >
            Logout
          </button>
          <button className="px-4 py-2 rounded text-red-400 border border-red-400 hover:bg-red-400 hover:text-white transition">
            Deactivate Account
          </button>
          <button className="px-4 py-2 rounded text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition">
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}



