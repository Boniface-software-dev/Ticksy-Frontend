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
      .then(() => {
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
    <div className="min-h-screen bg-[#f4f3fb] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-3xl font-bold text-[#1a1240] border-b border-[#9747ff] pb-2">
          Admin Profile
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl p-6 flex items-center gap-6">
          <div className="w-16 h-16 bg-[#9747ff] text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
            {admin?.first_name?.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-[#1a1240] text-lg">
              {admin.first_name} {admin.last_name}
            </div>
            <div className="text-sm text-gray-600">{admin.email}</div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1a1240]">
              Personal Information
            </h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-sm bg-[#9747ff] hover:bg-[#7a33d5] transition-all duration-200 text-white px-4 py-2 rounded-md shadow"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="text-sm bg-green-600 hover:bg-green-700 transition-all duration-200 text-white px-4 py-2 rounded-md shadow"
              >
                Save Changes
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            {["first_name", "last_name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-[#1a1240] font-medium capitalize">
                  {field.replace("_", " ")}
                </label>
                {editing ? (
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#9747ff] focus:border-[#9747ff] outline-none"
                  />
                ) : (
                  <p className="mt-1">
                    {admin[field] || (
                      <span className="italic text-gray-400">Not provided</span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            onClick={handleBack}
            className="w-full md:w-auto bg-[#9747ff] hover:bg-[#7a33d5] transition-all duration-200 text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 transition-all duration-200 text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
