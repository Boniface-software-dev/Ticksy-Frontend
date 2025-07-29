import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";

export default function AttendeePastEvents() {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    axiosInstance
      .get("/profile/my-past-events")
      .then((res) => {
        setPastEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch past events.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-4 flex gap-6">
        <AttendeeSideBar />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            My Past Events
          </h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && pastEvents.length === 0 && (
            <p className="text-gray-500">
              You have not attended any events yet.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-4 rounded shadow text-black"
              >
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {new Date(event.start_time).toLocaleDateString()} –{" "}
                  {new Date(event.end_time).toLocaleDateString()}
                </p>
                <p className="mb-2">{event.location}</p>

                <Link
                  to={`/attendee/${userId}/past-events/${event.id}`}
                  className="inline-block mt-2 text-purple-600 border border-purple-600 px-3 py-1 rounded hover:bg-purple-600 hover:text-white transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
