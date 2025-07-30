import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../utils/axiosInstance";
import AdminSidebar from "../../components/AdminPanel";

export default function AdminUsers() {
  const { id } = useParams(); // admin id
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== id) {
      navigate("/unauthorized");
    }
  }, [user, id, navigate]);

  useEffect(() => {
    setLoading(true);
    setError("");
    API.get("/admin/users")
      .then((res) => {
        setUsers(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load users.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="text-lg text-[#9747ff] animate-pulse font-medium">
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="text-lg text-red-500 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf8ff]">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10">
        <div className="max-w-6xl mx-auto bg-[#f8f4ff] border border-[#e3d7fb] rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-[#1a1240] mb-6">
            👥 All Users
          </h1>

          <div className="overflow-x-auto rounded-xl border border-[#e5dbf9]">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#e0c8f9] text-[#1a1240] uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eafd]">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => navigate(`/admin/${id}/users/${u.id}`)}
                    className="hover:bg-[#fdfbff] transition cursor-pointer"
                  >
                    <td className="px-4 py-3">{u.id}</td>
                    <td className="px-4 py-3">
                      {u.first_name} {u.last_name}
                    </td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.phone}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          u.status === "banned"
                            ? "bg-red-100 text-red-700 border-red-300"
                            : u.status === "active"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : u.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
