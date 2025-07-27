import React from "react";
import { useSelector } from "react-redux";

export default function Avatar({ size = 40 }) {
  const user = useSelector((state) => state.auth.currentUser);
  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase();

  const avatarSize = `${size}px`;

  return (
    <div
      className="rounded-full bg-purple-600 text-white font-medium flex items-center justify-center"
      style={{ width: avatarSize, height: avatarSize, fontSize: size * 0.4 }}
      title={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
    >
      {initials || "U"}
    </div>
  );
}