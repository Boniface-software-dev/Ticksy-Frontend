import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedItems, setExpandedItems] = useState({
    paymentMethods: false,
    trackSales: false,
    pastTickets: false,
  });

  const toggleItem = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

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

   {/* How It Works Section */}
      <section className="bg-[#F3F3F5] py-20 px-5 font-Poppins">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Sign up Your Way
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Join Ticksy as an event organizer or attendee
          </p>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Step 1 */}
            <div className="md:w-1/3 text-left md:text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                Discover or Host Events
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Find events you love, or set up your
                own with custom ticket types and details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="md:w-1/3 text-left md:text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                Book or Manage Tickets
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Buy tickets instantly with MPESA or
                track ticket sales in real-time as a host.
              </p>
            </div>

            {/* Step 3 */}
            <div className="md:w-1/3 text-left md:text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                Attend and Have Fun!
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Get event reminders, access your tickets
                easily, and leave reviews after attending.
              </p>
            </div>
          </div>
        </div>
      </section>

    {/* FAQ Section */}
      <section className="bg-[#F3F3F5] py-20 px-5 font-Poppins">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-10 text-center md:text-left">
          FAQs: What Ticksy Users Ask Most
        </h2>
        
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image on the left */}
          <div className="md:w-1/2">
            <img
              src="/Question.svg" 
              alt="FAQ illustration"
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>

          {/* FAQ Content on the right */}
          <div className="md:w-1/2 space-y-4">
            {/* Create Event */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleItem("createEvent")}
              >
                <span className="font-medium text-gray-800">
                  How do I create an event on Ticksy?
                </span>
                <span className="text-gray-600">
                  {expandedItems.createEvent ? "−" : "+"}
                </span>
              </button>
              {expandedItems.createEvent && (
                <p className="mt-2 text-gray-600 text-sm">
                  Just sign in as an organizer, go to "Create Event," and fill out your event details including location, time, and ticket types. It only takes a few minutes.
                </p>
              )}
            </div>

            {/* Buy Without Signup */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleItem("buyWithoutSignup")}
              >
                <span className="font-medium text-gray-800">
                  Can I buy tickets without signing up?
                </span>
                <span className="text-gray-600">
                  {expandedItems.buyWithoutSignup ? "−" : "+"}
                </span>
              </button>
              {expandedItems.buyWithoutSignup && (
                <p className="mt-2 text-gray-600 text-sm">
                  No account? No problem. You can purchase tickets using just your phone number through MPESA and receive instant confirmation.
                </p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleItem("paymentMethods")}
              >
                <span className="font-medium text-gray-800">
                  What payment methods are supported?
                </span>
                <span className="text-gray-600">
                  {expandedItems.paymentMethods ? "−" : "+"}
                </span>
              </button>
              {expandedItems.paymentMethods && (
                <p className="mt-2 text-gray-600 text-sm">
                  Ticksy uses MPESA STK Push, allowing you to pay directly from your phone. You'll receive a prompt to enter your PIN and confirm instantly.
                </p>
              )}
            </div>

            {/* Track Sales */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleItem("trackSales")}
              >
                <span className="font-medium text-gray-800">
                  How can organizers track sales?
                </span>
                <span className="text-gray-600">
                  {expandedItems.trackSales ? "−" : "+"}
                </span>
              </button>
              {expandedItems.trackSales && (
                <p className="mt-2 text-gray-600 text-sm">
                  Organizers can track sales in real-time through the Ticksy dashboard, which provides detailed analytics on ticket purchases, revenue, and attendee information.
                </p>
              )}
            </div>

            {/* Past Tickets */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleItem("pastTickets")}
              >
                <span className="font-medium text-gray-800">
                  Where do I find my past tickets?
                </span>
                <span className="text-gray-600">
                  {expandedItems.pastTickets ? "−" : "+"}
                </span>
              </button>
              {expandedItems.pastTickets && (
                <p className="mt-2 text-gray-600 text-sm">
                  All your past tickets are stored in the "My Tickets" section of your Ticksy account. You can access them anytime by logging in and navigating to this section.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};
export default LandingPage;
