
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/events");
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading events...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Upcoming Events</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300">
            <Link to={`/events/${event.id}`}>
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                <p className="text-sm text-gray-600 mb-2 truncate">{event.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  <strong>Date:</strong> {new Date(event.start_time).toLocaleDateString()}
                </p>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                  View & Buy Ticket
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsList;
