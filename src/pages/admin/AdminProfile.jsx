import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/axios";
import { logout } from "../../features/authentification/authSlice";

export default function AdminProfile() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚫 Redirect if not same user or not admin
  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== id) {
      navigate("/unauthorized");
    }
  }, [user, id, navigate]);

  useEffect(() => {
    setLoading(true);
    API.get("/profile/me")
      .then((res) => {
        setAdmin(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load profile.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleBack = () => {
    navigate(`/admin/${id}/dashboard`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f3fb] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header Section */}
        <div className="text-2xl font-semibold text-[#1a1240] underline">
          My Profile
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold">
            {admin?.first_name?.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-[#1a1240] text-lg">
              {admin.first_name} {admin.last_name}
            </div>
            <div className="text-sm text-gray-500">{admin.email}</div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1a1240]">
              Personal Information
            </h2>
            <button className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded-md flex items-center gap-1">
              <span>Edit</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
            <div>
              <span className="font-medium text-[#1a1240]">First Name</span>
              <div>{admin.first_name}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Last Name</span>
              <div>{admin.last_name}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Date of Birth</span>
              <div>{admin.dob || "Not provided"}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Email Address</span>
              <div>{admin.email}</div>
            </div>
            <div>
              <span className="font-medium text-[#1a1240]">Phone Number</span>
              <div>{admin.phone}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <button
            onClick={handleBack}
            className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
