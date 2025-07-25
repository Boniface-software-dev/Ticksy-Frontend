import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/authentification/authSlice";
import { useNavigate } from "react-router-dom";

export default function OrgProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow text-black">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Personal Information</h3>
        <p><span className="font-semibold">First Name: </span>{user?.first_name}</p>
        <p><span className="font-semibold">Last Name: </span>{user?.last_name}</p>
        <p><span className="font-semibold">Email: </span>{user?.email}</p>
        <p><span className="font-semibold">Phone Number: </span>{user?.phone || "N/A"}</p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
