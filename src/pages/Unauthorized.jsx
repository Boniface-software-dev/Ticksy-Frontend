import React from "react";
import DangerIcon from "../assets/icons8-danger-100.png"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const user = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();

  const onClick = (e) => {
    e.preventDefault();
    if (user?.role === "attendee") {
      navigate("/events");
    } else if (user?.role) {
      navigate(`/${user.role}/${user.id}/dashboard`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center">
        <img src={DangerIcon} alt="Access Denied" className="w-20 h-20" />
        <h2 className="text-red-500 text-2xl mt-2">Access Denied</h2>
      </div>
      <button
        onClick={onClick}
        className="text-purple-600 hover:bg-purple-500 hover:text-white p-2 rounded border"
      >
        Back To Safety
      </button>
    </div>
  );
}