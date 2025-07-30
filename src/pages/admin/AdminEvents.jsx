import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../utils/axiosInstance";
import AdminSidebar from "../../components/AdminPanel";
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin" || user.id.toString() !== id) {
      navigate("/unauthorized");
    }
  }, [user, id, navigate]);

  const fetchEvents = () => {
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
  };

  useEffect(() => {
    fetchEvents();
  }, [tab]);

  const handleStatus = (eventId, status) => {
    API.patch(`/admin/${eventId}`, { status })
      .then(() => {
        toast.success(`Event marked as ${status}`);
        setSelectedEvent(null);
        fetchEvents();
      })
      .catch(() => toast.error("Failed to update event status."));
  };

  return (
    <div className="flex min-h-screen bg-[#f8f5ff]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 relative overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#1a1240] mb-8">
            Manage Events
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setSelectedEvent(null);
                }}
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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <span className="text-[#9747ff] font-semibold">
                        Loading...
                      </span>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 italic text-gray-500"
                    >
                      No events found.
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => (
                    <tr
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className="cursor-pointer hover:bg-[#f9f6ff] transition border-b border-[#f1e9ff]"
                    >
                      <td className="px-4 py-3 font-semibold">{ev.title}</td>
                      <td className="px-4 py-3">{ev.category}</td>
                      <td className="px-4 py-3">{ev.location}</td>
                      <td className="px-4 py-3">
                        {new Date(ev.start_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(ev.end_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {tab === "pending" ? (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs rounded-full font-semibold">
                            Pending
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full font-semibold">
                            Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Side Panel Event View */}
          {selectedEvent && (
            <div className="fixed top-0 right-0 w-full md:w-[500px] h-full bg-white border-l border-[#e4dafd] shadow-2xl z-50 overflow-y-auto p-6">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 font-bold text-xl"
              >
                ×
              </button>

              <h2 className="text-xl font-bold text-[#1a1240] mb-2">
                {selectedEvent.title}
              </h2>
              <img
                src={selectedEvent.image_url}
                alt="event"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                {selectedEvent.description}
              </p>

              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Category:</strong> {selectedEvent.category}
                </p>
                <p>
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(selectedEvent.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(selectedEvent.end_time).toLocaleString()}
                </p>
                <p>
                  <strong>Tags:</strong> {selectedEvent.tags}
                </p>
                <p>
                  <strong>Organizer:</strong>{" "}
                  {selectedEvent.organizer?.first_name}{" "}
                  {selectedEvent.organizer?.last_name}
                </p>
              </div>

              {/* Buttons for pending event */}
              {tab === "pending" && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleStatus(selectedEvent.id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(selectedEvent.id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
