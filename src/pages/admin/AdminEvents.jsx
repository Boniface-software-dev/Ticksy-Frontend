import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../utils/axiosInstance";
import AdminSidebar from "../../components/AdminSidebar";
import { toast } from "react-toastify";

const TABS = [
  { key: "all", label: "All Events" },
  { key: "pending", label: "Pending Approval" },
];

export default function AdminEvents() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Redirect unauthorized or mismatched user
  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== id) {
      navigate("/unauthorized");
    }
  }, [user, id, navigate]);

  useEffect(() => {
    setLoading(true);
    const endpoint = tab === "pending" ? "/admin/pending" : "/events";
    API.get(endpoint)
      .then((res) => {
        setEvents(res.data || []);
        setError("");
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            "Could not load events. Is backend running?"
        );
      })
      .finally(() => setLoading(false));
  }, [tab]);

  const handleStatus = (eventId, status) => {
    API.patch(`/admin/${eventId}`, { status })
      .then(() => {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        toast.success(`Event marked as ${status}`);
      })
      .catch(() => toast.error("Failed to update event status."));
  };

  return (
    <div className="flex min-h-screen bg-[#f8f5ff]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#1a1240] mb-8">
            Manage Events
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2 rounded-full font-semibold border text-sm transition-all duration-200 ${
                  tab === t.key
                    ? "bg-[#9747ff] text-white border-[#9747ff] shadow-md"
                    : "bg-white text-[#1a1240] border-[#d4cbe7] hover:bg-[#ede7fa]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md mb-4 font-medium shadow">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl shadow-lg bg-white border border-[#e9e0fc]">
            <table className="w-full table-auto text-sm text-[#1a1240]">
              <thead className="bg-[#f3edff] border-b border-[#e5dcfb]">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Location</th>
                  <th className="text-left px-4 py-3">Start</th>
                  <th className="text-left px-4 py-3">End</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-[#9747ff] font-semibold"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-500 py-10 italic"
                    >
                      No events found.
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => (
                    <tr
                      key={ev.id}
                      className="border-b border-[#f0eafd] hover:bg-[#fbf9ff] transition"
                    >
                      <td className="px-4 py-3 font-semibold">{ev.title}</td>
                      <td className="px-4 py-3">{ev.category || "—"}</td>
                      <td className="px-4 py-3">{ev.location || "—"}</td>
                      <td className="px-4 py-3">
                        {ev.start_time
                          ? new Date(ev.start_time).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {ev.end_time
                          ? new Date(ev.end_time).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {tab === "pending" ? (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs rounded-full font-semibold">
                            Pending
                          </span>
                        ) : (
                          <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold">
                            Approved
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {tab === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatus(ev.id, "approved")}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatus(ev.id, "rejected")}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
