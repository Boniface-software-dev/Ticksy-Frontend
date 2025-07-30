import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";
import Footer from "../../components/Footer";
import { Calendar, Clock, MapPin } from "lucide-react";



export default function AttendeeUpcomingEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  useEffect(() => {
    axiosInstance
      .get("/profile/my-upcoming-events")
      .then((res) => {
        setUpcomingEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch upcoming events.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <AttendeeNavBar />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto p-4 flex gap-6">
          <AttendeeSideBar />
          <div className="flex-1">
            {/* Heading */}
            <h2 className="text-3xl font-bold mb-6 text-black">My Events</h2>

            {/* Tabs */}
            {/* <div className="mb-8">
              <div className="flex gap-6 border-b pb-2">
                <button className="text-lg font-semibold text-purple-600 border-b-2 border-purple-600 pb-1">
                  Upcoming Events
                </button>
                <Link
                  to ={``}
                  className="text-lg font-medium text-gray-500 hover:text-purple-600 transition"
                >
                  Past Events
                </Link>
              </div>
            </div> */}

            {/* Loading, Error, Empty */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && upcomingEvents.length === 0 && (
              <p className="text-gray-500">You have no upcoming events.</p>
            )}

            {/* Events List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow text-black"
                >
                  <img
                    src={event.image_url || "/placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Music, fashion and culture
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                    <Calendar size={16} className="text-purple-500" />
                    {new Date(event.start_time).toLocaleDateString()} –{" "}
                    {new Date(event.end_time).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                    <Clock size={16} className="text-purple-500" />
                    {new Date(event.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(event.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                    <MapPin size={16} className="text-purple-500" />
                    {event.location}
                  </p>

                  <Link
                    to={`/attendee/${userId}/upcoming-events/${event.id}`}
                    className="inline-block text-sm text-purple-600 border border-purple-600 px-3 py-1 rounded hover:bg-purple-600 hover:text-white transition"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}