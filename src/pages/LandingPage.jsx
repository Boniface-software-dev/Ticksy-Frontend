import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://ticksy-backend.onrender.com/events")
      .then((res) => {
        setEvents(res.data.slice(0, 4)); // Limit to 4 events
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load events.");
        setLoading(false);
      });
  }, []);
  return (
    <div className="font-poppins bg-[#F3F3F5] text-black min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center px-4 flex items-center justify-center"
        style={{
          backgroundImage: "url('/piano.jpg')",
          minHeight: "100vh",
        }}
      >
        {/* Optional: Add overlay back if needed */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

        <div className="relative text-center z-10 max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-4">
            Plan it. Book it. Live it
          </h1>
          <p className="text-xl mb-8">
            Your all-in-one platform to discover and host events
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/events"
              className="bg-[#9747FF] text-white px-8 py-3 rounded-lg font-medium"
            >
              Explore Events
            </Link>
            <Link
              to="/create-event"
              className="border-2 border-[#9747FF] text-white px-8 py-3 rounded-lg font-medium"
            >
              Create an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#9747FF]">
            Our Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Ticketing",
                desc:
                  "Browse, select, and purchase event tickets with just a few clicks.",
              },
              {
                title: "Real-time Insights",
                desc:
                  "Organizers can view live ticket sales, revenue data, and event analytics.",
              },
              {
                title: "Secure Auth",
                desc:
                  "Users enjoy secure sign-up/login, and role based access with full control.",
              },
              {
                title: "Calendar Integration",
                desc:
                  "Save events directly to your Google Calendar and never miss a moment.",
              },
              {
                title: "Lipa na MPESA",
                desc:
                  "Enjoy smooth and instant MPESA STK Push payments for all your bookings.",
              },
              {
                title: "Event Discovery",
                desc:
                  "Find events effortlessly by category, location, or tags; tailored to your interests.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-lg border-l-4 border-[#9747FF] shadow"
              >
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

               {/* Upcoming Events */}
        {/* Events Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#9747FF]">
            Featured Events
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading events...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      By {event.organizer?.first_name}{" "}
                      {event.organizer?.last_name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      📍 {event.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      🗓️{" "}
                      {new Date(event.start_time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};



export default LandingPage;
