import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users2,
  BarChart3,
  Ticket,
  UserCircle,
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();
  const user = useSelector((state) => state.auth.currentUser);

  const isActive = (path) => location.pathname === path;

  const basePath = `/admin/${user?.id}`;

  return (
    <div className="w-[230px] min-h-screen flex flex-col bg-[#f6f4fa] border-r border-[#ece6fa]">
      {/* Logo */}
      <div className="flex items-center gap-3 font-bold text-[1.35rem] text-[#9747ff] px-6 pt-8 pb-6">
        <LayoutDashboard className="text-3xl" />
        Ticksy
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <Link
              to={`${basePath}/dashboard`}
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive(`${basePath}/dashboard`)
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <LayoutDashboard className="mr-3 w-5 h-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to={`${basePath}/users`}
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive(`${basePath}/users`)
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <Users2 className="mr-3 w-5 h-5" />
              Users
            </Link>
          </li>
          <li>
            <Link
              to={`${basePath}/events`}
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive(`${basePath}/events`)
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <Ticket className="mr-3 w-5 h-5" />
              Events
            </Link>
          </li>
          <li>
            <Link
              to={`${basePath}/analytics`}
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive(`${basePath}/analytics`)
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <BarChart3 className="mr-3 w-5 h-5" />
              Analytics
            </Link>
          </li>
          <li>
            <Link
              to={`${basePath}/profile`}
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive(`${basePath}/profile`)
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <UserCircle className="mr-3 w-5 h-5" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Info */}
      <div className="mt-auto mb-4 mx-3 flex items-center bg-[#f1eefb] rounded-lg px-4 py-3 gap-3">
        <span className="text-xl font-bold rounded-full bg-[#e4d9fa] text-[#c7bcf4] w-10 h-10 flex items-center justify-center">
          {user?.first_name?.[0] || "A"}
        </span>
        <div>
          <div className="font-semibold">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
        </div>
      </div>
    </div>
  );
}
