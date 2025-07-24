import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Placeholder for now
  }, []);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white px-4 flex items-center justify-center"
        style={{
          backgroundImage: "url('/piano.jpg')",
          minHeight: "100vh",
        }}
      >
        {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

        <div className="relative text-center z-10 max-w-2xl">
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
      <section className="bg-[#1A1A1A] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#9747FF]">
            Our Core Features
          </h2>

          {/* Feature Grid */}
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
                className="bg-[#2A2A2A] p-8 rounded-lg border-l-4 border-[#9747FF]"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-[#E0E0E0]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
