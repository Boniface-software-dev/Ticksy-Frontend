import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../utils/axiosInstance";
import { logout } from "../../features/authentification/authSlice";

export default function AdminProfile() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setForm({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
          phone: res.data.phone,
        });
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    API.put("/profile/me", form)
      .then((res) => {
        setAdmin({ ...admin, ...form });
        setEditing(false);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to update profile.");
      });
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
        {/* Header */}
        <div className="text-2xl font-semibold text-[#1a1240] underline">
          My Profile
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-3xl font-bold">
            {admin?.first_name?.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-[#1a1240] text-lg">
              {admin.first_name} {admin.last_name}
            </div>
            <div className="text-sm text-gray-700">{admin.email}</div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1a1240]">
              Personal Information
            </h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded-md flex items-center gap-1"
              >
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md flex items-center gap-1"
              >
                <span>Save</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-700">
            {["first_name", "last_name", "email", "phone"].map((field) => (
              <div key={field}>
                <span className="font-medium text-[#1a1240] capitalize">
                  {field.replace("_", " ")}
                </span>
                {editing ? (
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="mt-1">
                    {admin[field] || (
                      <span className="italic text-gray-400">Not provided</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
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
