import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../utils/axiosInstance";

export default function AdminUserProfile() {
  const { adminId, userId } = useParams();
  const user = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== adminId) {
      navigate("/unauthorized");
    }
  }, [user, adminId, navigate]);

  useEffect(() => {
    setLoading(true);
    API.get("/admin/users")
      .then((res) => {
        const selected = res.data.find((u) => u.id.toString() === userId);
        if (!selected) {
          setError("User not found.");
        } else {
          setUserData(selected);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user.");
        setLoading(false);
      });
  }, [userId]);

  const toggleStatus = () => {
    if (!userData) return;
    const newStatus = userData.status === "banned" ? "active" : "banned";
    setUpdating(true);
    API.patch(`/admin/users/${userId}/status`, { status: newStatus })
      .then(() => {
        setUserData({ ...userData, status: newStatus });
      })
      .finally(() => setUpdating(false));
  };

  const updateRole = (newRole) => {
    if (!userData || newRole === userData.role) return;
    setUpdating(true);
    API.patch(`/admin/users/${userId}/role`, { role: newRole })
      .then(() => {
        setUserData({ ...userData, role: newRole });
      })
      .finally(() => setUpdating(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading user profile...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">{error || "User not found."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f3fb] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-2xl font-semibold text-[#1a1240] underline">
          Manage User
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-3xl font-bold">
            {userData.first_name?.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-[#1a1240] text-lg">
              {userData.first_name} {userData.last_name}
            </div>
            <div className="text-sm text-gray-700">{userData.email}</div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="text-lg font-semibold text-[#1a1240] mb-4">
            User Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm text-gray-700">
            <div>
              <span className="font-medium text-[#1a1240]">First Name</span>
              <div>{userData.first_name}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Last Name</span>
              <div>{userData.last_name}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Email</span>
              <div>{userData.email}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Phone</span>
              <div>{userData.phone}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Role</span>
              <div className="capitalize">{userData.role}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Status</span>
              <div className="capitalize">{userData.status}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          {/* Toggle ban/unban */}
          <button
            onClick={toggleStatus}
            disabled={updating}
            className={`w-full md:w-auto ${
              userData.status === "banned"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white px-6 py-2 rounded-lg font-semibold`}
          >
            {userData.status === "banned" ? "Unban User" : "Ban User"}
          </button>

          {/* Role update dropdown */}
          <select
            disabled={updating}
            value={userData.role}
            onChange={(e) => updateRole(e.target.value)}
            className="w-full md:w-auto border border-gray-300 px-4 py-2 rounded-lg font-semibold text-[#1a1240]"
          >
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>

          {/* Back */}
          <button
            onClick={() => navigate(`/admin/${adminId}/users`)}
            className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Back to All Users
          </button>
        </div>
      </div>
    </div>
  );
}
