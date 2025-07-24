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
          backgroundImage: "url('/piano.jpg')", // ✅ No backticks, direct string
          minHeight: "100vh",
        }}
      >
        {/* Temporarily remove overlay for debugging */}
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
    </div>
  );
};

export default LandingPage;
