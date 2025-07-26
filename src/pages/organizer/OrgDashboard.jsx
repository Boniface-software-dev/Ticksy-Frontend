import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrganizerDashboard = () => {
  const { token, user } = useSelector((state) => state.auth);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    category: "",
    start_time: "",
    end_time: "",
    image_url: "",
    description: "",
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://ticksy-backend.onrender.com/organizer/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch {
      toast.error("Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  useEffect(() => {
    let result = events;

    if (filter === "upcoming") {
      result = result.filter((e) => new Date(e.start_time) > new Date());
    } else if (filter === "pending") {
      result = result.filter((e) => e.status === "pending");
    } else if (filter === "rejected") {
      result = result.filter((e) => e.status === "rejected");
    } else if (filter === "history") {
      result = result.filter((e) => new Date(e.end_time) < new Date());
    }

    if (searchTerm) {
      result = result.filter(
        (e) =>
          (e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.location?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (dateFilter.start) {
      result = result.filter((e) => new Date(e.start_time) >= new Date(dateFilter.start));
    }
    if (dateFilter.end) {
      result = result.filter((e) => new Date(e.end_time) <= new Date(dateFilter.end));
    }

    result.sort((a, b) =>
      sortOrder === "asc"
        ? (a.ticket_sales || 0) - (b.ticket_sales || 0)
        : (b.ticket_sales || 0) - (a.ticket_sales || 0)
    );

    setFilteredEvents(result);
    setCurrentPage(1);
  }, [events, filter, searchTerm, dateFilter, sortOrder]);

  const handleChange = (e) => {
    setNewEvent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://ticksy-backend.onrender.com/organizer/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error();
      toast.success("Event created successfully!");
      setNewEvent({
        title: "",
        location: "",
        category: "",
        start_time: "",
        end_time: "",
        image_url: "",
        description: "",
      });
      setShowModal(false);
      fetchEvents();
    } catch {
      toast.error("Failed to create event. Check your input and try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`https://ticksy-backend.onrender.com/organizer/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Event deleted.");
      fetchEvents();
    } catch {
      toast.error("Failed to delete event.");
    }
  };

  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const dynamicHeading = {
    upcoming: "Upcoming Events",
    pending: "Pending Events",
    rejected: "Rejected Events",
    history: "Past Events",
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex min-h-screen bg-gradient-to-r from-[#f4efff] to-[#fdfcff] font-poppins">
        <aside className="w-64 bg-white shadow-md p-5 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-700 mb-6">Ticksy</h1>
            {["upcoming", "pending", "rejected", "history"].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`w-full text-left py-2 px-4 mb-2 rounded-md transition ${
                  filter === key
                    ? "bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-purple-100"
                }`}
              >
                {dynamicHeading[key]}{" "}
                <span className="ml-2 text-xs text-purple-600 font-semibold">
                  ({events.filter((e) => {
                    if (key === "upcoming") return new Date(e.start_time) > new Date();
                    if (key === "pending") return e.status === "pending";
                    if (key === "rejected") return e.status === "rejected";
                    if (key === "history") return new Date(e.end_time) < new Date();
                    return true;
                  }).length})
                </span>
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-700 mt-10">
            <p className="font-semibold">{user?.first_name || "Organizer"}</p>
            <p className="text-xs text-gray-500">Organizer</p>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#4c1d95]">
                {dynamicHeading[filter]}{" "}
                <span className="text-sm bg-purple-100 text-purple-700 rounded-full px-2 py-1 ml-2">
                  {filteredEvents.length}
                </span>
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <input
                  type="date"
                  value={dateFilter.start}
                  onChange={(e) => setDateFilter((prev) => ({ ...prev, start: e.target.value }))}
                  className="border border-gray-300 bg-gray-100 text-gray-700 px-3 py-2 rounded"
                />
                <input
                  type="date"
                  value={dateFilter.end}
                  onChange={(e) => setDateFilter((prev) => ({ ...prev, end: e.target.value }))}
                  className="border border-gray-300 bg-gray-100 text-gray-700 px-3 py-2 rounded"
                />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-gray-300 bg-gray-100 text-gray-700 px-3 py-2 rounded"
                >
                  <option value="desc">Sort by Sales ↓</option>
                  <option value="asc">Sort by Sales ↑</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg shadow"
            >
              + New Event
            </button>
          </div>

          {/* Event Cards */}
          {currentEvents.length === 0 ? (
            <p className="text-center text-gray-400">No events found.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg relative"
                  >
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="h-44 w-full object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-[#1e1b4b]">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(event.start_time).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full uppercase ${
                          event.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : event.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {event.status}
                      </span>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>🎟 Tickets Sold: {event.ticket_sales || 0}</p>
                        <p>💰 Revenue: KES {event.revenue || 0}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="absolute top-2 right-3 text-red-500 hover:text-red-700 text-lg"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-purple-700 text-white"
                        : "bg-gray-200 hover:bg-purple-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Modal remains same (already in your last version) */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-[#1f1b2e] text-white p-8 rounded-xl w-full max-w-2xl relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-6 text-purple-300">Create New Event</h2>
                <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="title" placeholder="Title" value={newEvent.title} onChange={handleChange} required className="bg-[#2e2844] p-2 rounded border border-gray-600" />
                  <input name="location" placeholder="Location" value={newEvent.location} onChange={handleChange} required className="bg-[#2e2844] p-2 rounded border border-gray-600" />
                  <input name="category" placeholder="Category" value={newEvent.category} onChange={handleChange} required className="bg-[#2e2844] p-2 rounded border border-gray-600" />
                  <input type="datetime-local" name="start_time" value={newEvent.start_time} onChange={handleChange} required className="bg-[#2e2844] p-2 rounded border border-gray-600" />
                  <input type="datetime-local" name="end_time" value={newEvent.end_time} onChange={handleChange} required className="bg-[#2e2844] p-2 rounded border border-gray-600" />
                  <input name="image_url" placeholder="Image URL" value={newEvent.image_url} onChange={handleChange} required className="bg-[#2e2844] p-2 rounded border border-gray-600" />
                  <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleChange} required rows={3} className="bg-[#2e2844] p-2 rounded border border-gray-600 md:col-span-2" />
                  <button type="submit" className="bg-purple-700 hover:bg-purple-800 col-span-2 py-2 rounded text-white font-semibold mt-2">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default OrganizerDashboard;
