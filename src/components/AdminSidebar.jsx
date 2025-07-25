import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Helper to highlight active nav
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-[230px] min-h-screen flex flex-col bg-[#f6f4fa] border-r border-[#ece6fa]">
      {/* Logo and App Name */}
      <div className="flex items-center gap-3 font-bold text-[1.35rem] text-[#9747ff] px-6 pt-8 pb-6">
        <span className="text-3xl">🧾</span>
        Ticksy
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive("/admin/dashboard")
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <span className="mr-3">🏠</span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive("/admin/users")
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <span className="mr-3">👥</span>
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/events"
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive("/admin/events")
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <span className="mr-3">🎟️</span>
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/admin/analytics"
              className={`flex items-center px-8 py-3 rounded-l-lg text-base font-medium transition
                ${
                  isActive("/admin/analytics")
                    ? "bg-[#ede7fa] text-[#9747ff] font-semibold"
                    : "text-[#373758] hover:bg-[#f2eafd]"
                }`}
            >
              <span className="mr-3">📊</span>
              Analytics
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Info */}
      <div className="mt-auto mb-4 mx-3 flex items-center bg-[#f1eefb] rounded-lg px-4 py-3 gap-3">
        <span className="text-xl font-bold rounded-full bg-[#e4d9fa] text-[#c7bcf4] w-10 h-10 flex items-center justify-center">
          {user?.first_name ? user.first_name[0] : "U"}
        </span>
        <div>
          <div className="font-semibold">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="text-xs text-gray-400">
            {user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
