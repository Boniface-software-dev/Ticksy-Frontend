import React from "react";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";
import { Outlet } from "react-router-dom";

export default function AttendeeDashboardLayout() {
  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-4 flex gap-6">
        <AttendeeSideBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
}
