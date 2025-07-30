import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../utils/axiosInstance";
import AdminSidebar from "../../components/AdminPanel";

export default function AdminUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== id) {
      navigate("/unauthorized");
    }
  }, [user, id, navigate]);

  useEffect(() => {
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

  useEffect(() => {
    let results = users.filter((u) =>
      `${u.first_name} ${u.last_name} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (roleFilter !== "all") {
      results = results.filter((u) => u.role === roleFilter);
    }

    if (sort === "name") {
      results.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (sort === "created") {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFiltered(results);
  }, [users, search, roleFilter, sort]);

  const totalUsers = users.length;
  const totalAttendees = users.filter((u) => u.role === "attendee").length;
  const totalOrganizers = users.filter((u) => u.role === "organizer").length;

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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard label="Total Users" value={totalUsers} />
            <SummaryCard label="Attendees" value={totalAttendees} />
            <SummaryCard label="Organizers" value={totalOrganizers} />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center justify-between">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="border px-4 py-2 rounded w-full sm:w-1/3 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border px-4 py-2 rounded text-sm"
            >
              <option value="all">All Roles</option>
              <option value="attendee">Attendees</option>
              <option value="organizer">Organizers</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border px-4 py-2 rounded text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Date Created</option>
            </select>
          </div>

          {/* User Table */}
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
                {filtered.map((u) => (
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

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-[#ddd]">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-[#1a1240]">
        {value?.toLocaleString()}
      </div>
    </div>
  );
}
