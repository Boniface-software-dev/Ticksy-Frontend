import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

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
        setEvents(res.data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load events.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="font-poppins bg-[#F3F3F5] text-black min-h-screen scroll-smooth">
      <Navbar />

    {/* Hero Section */}
<section
  className="relative bg-cover bg-center px-6 flex items-center justify-center"
  style={{
    backgroundImage: "url('/piano.jpg')",
    minHeight: "100vh",
    backgroundColor: "#F3F3F5",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-[#9747FF] bg-opacity-80"></div>

  {/* Content */}
  <div className="relative z-10 text-center text-white max-w-2xl font-Poppins">
    <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
      Plan It. Book It. Live It.
    </h1>
    <p className="text-lg sm:text-xl font-medium mb-10 leading-relaxed">
      Find your vibe, brought to life by hosts who use Ticksy to make it happen.
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-5 mb-8">
      <Link
        to="/register"
        className="bg-white text-[#9747FF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Get Started Free
      </Link>
      <Link
        to="/events"
        className="bg-[#9747FF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8438e6] transition border border-white"
      >
        Explore Events
      </Link>
    </div>

    <p className="text-sm text-white/80">
      Trusted by 1,000+ event organizers and 10K+ attendees across Kenya
    </p>
  </div>
</section>


      <section id="features" className="py-16 px-4 bg-[#F3F3F5]">
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

      <section className="py-16 px-4 bg-white">
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

      <section id="how-it-works" className="bg-[#F3F3F5] py-20 px-6 font-poppins">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#9747FF] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-500 mb-16">
            Get started in just four easy steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-indigo-100 z-0"></div>
            {["Sign Up Your Way", "Discover or Host", "Book Instantly", "Attend & Enjoy"].map(
              (title, index) => (
                <div key={index} className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#9747FF] text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {
                      [
                        "Join Ticksy as an event organizer or attendee — quick, easy and free.",
                        "Find events you love — or host your own with custom ticket options.",
                        "Secure your spot fast with MPESA payments and instant ticket delivery.",
                        "Get reminders, show up, and enjoy your event — then leave a review!",
                      ][index]
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section id="faqs" className="bg-white py-20 px-5 font-poppins">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#9747FF] mb-10 text-center md:text-left">
            FAQs: What Ticksy Users Ask Most
          </h2>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/2">
              <img
                src="/Question.svg"
                alt="FAQ illustration"
                className="w-full h-auto rounded-xl shadow-md"
              />
            </div>
            <div className="md:w-1/2 space-y-4">
              {[
                {
                  id: "createEvent",
                  question: "How do I create an event on Ticksy?",
                  answer:
                    'Just sign in as an organizer, go to "Create Event," and fill out your event details including location, time, and ticket types. It only takes a few minutes.',
                },
                {
                  id: "buyWithoutSignup",
                  question: "Can I buy tickets without signing up?",
                  answer:
                    "No account? No problem. You can purchase tickets using just your phone number through MPESA and receive instant confirmation.",
                },
                {
                  id: "paymentMethods",
                  question: "What payment methods are supported?",
                  answer:
                    "Ticksy uses MPESA STK Push, allowing you to pay directly from your phone. You'll receive a prompt to enter your PIN and confirm instantly.",
                },
                {
                  id: "trackSales",
                  question: "How can organizers track sales?",
                  answer:
                    "Organizers can track sales in real-time through the Ticksy dashboard, which provides detailed analytics on ticket purchases, revenue, and attendee information.",
                },
                {
                  id: "pastTickets",
                  question: "Where do I find my past tickets?",
                  answer:
                    'All your past tickets are stored in the "My Tickets" section of your Ticksy account. You can access them anytime by logging in and navigating to this section.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-300 rounded-lg p-4 bg-white"
                >
                  <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="font-medium text-gray-800">
                      {item.question}
                    </span>
                    <span className="text-gray-600">
                      {expandedItems[item.id] ? "−" : "+"}
                    </span>
                  </button>
                  {expandedItems[item.id] && (
                    <p className="mt-2 text-gray-600 text-sm">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
