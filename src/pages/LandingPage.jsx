import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import Navbar from "../components/Navbar";
import videoSrc from "../assets/4916768-hd_1920_1080_30fps.mp4";
import Footer from "../components/Footer";
import { FaTicketAlt, FaMobileAlt } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { AiOutlineCalendar } from "react-icons/ai";
import { HiOutlineSearchCircle } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
import { BsCalendarDate } from "react-icons/bs";
import { ArrowRight } from "react-feather";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  const [expandedItems, setExpandedItems] = useState({
    createEvent: false,
    buyWithoutSignup: false,
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
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play();
        });
      }
    }

    axios
      .get("/events")
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

      <section id="home" className="relative h-screen w-full overflow-hidden">

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#9747FF]/10 to-transparent z-20"></div>

        <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-6 h-full max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            Plan It. Book It. Live It.
          </h1>
          <p className="text-lg sm:text-xl font-medium mb-10 leading-relaxed">
            Your all in one platform to discover and host events
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-8">
            <Link
              to="/register"
              className="bg-black text-[#9747FF] px-8 py-3 rounded-lg font-semibold border border-[#9747FF] hover:bg-[#9747FF] hover:text-white transition"
            >
              Get Started
            </Link>
            <Link
              to="/events"
              className="bg-[#9747FF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7c3aed] transition"
            >
              Explore Events
            </Link>
          </div>

          <p className="text-sm text-white/80">
            Trusted by 1,000+ event organizers and 10K+ attendees across Kenya
          </p>
        </div>
      </section>

      <section id="features" className="bg-white py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-[#9747FF] mb-12">
            Our Core Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaTicketAlt />,
                title: "Easy Ticketing",
                desc: "Browse, select, and purchase event tickets with just a few clicks.",
              },
              {
                icon: <MdAnalytics />,
                title: "Real-time Insights",
                desc: "Organizers can view live ticket sales, revenue data, and event analytics.",
              },
              {
                icon: <RiSecurePaymentLine />,
                title: "Secure Auth",
                desc: "Users enjoy secure sign-up/login, and role-based access with full control.",
              },
              {
                icon: <AiOutlineCalendar />,
                title: "Calendar Integration",
                desc: "Save events directly to your Google Calendar and never miss a moment.",
              },
              {
                icon: <FaMobileAlt />,
                title: "Lipa na MPESA",
                desc: "Enjoy smooth and instant MPESA STK Push payments for all your bookings.",
              },
              {
                icon: <HiOutlineSearchCircle />,
                title: "Event Discovery",
                desc: "Find events effortlessly by category, location, or tags; tailored to your interests.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border-l-4 border-[#9747FF] shadow hover:shadow-md transition text-center text-black"
              >
                <div className="text-[#9747FF] text-4xl mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-extrabold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white text-black font-poppins">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-[#9747FF]">
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
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 flex flex-col overflow-hidden text-black"
                >
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="flex flex-col p-5 h-full">
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center mb-3">
                      by {event.organizer?.first_name} {event.organizer?.last_name}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiMapPin className="mr-2 text-[#9747FF]" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-6">
                      <BsCalendarDate className="mr-2 text-[#9747FF]" />
                      {new Date(event.start_time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>

                    <Link
                      to={`/events/${event.id}`}
                      className="mt-auto flex items-center justify-center gap-2 w-full bg-[#9747FF] text-white py-2 rounded-lg font-semibold hover:bg-[#7c3aed] transition duration-200 no-underline"
                    >
                      Book Now <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="bg-gray-50 py-20 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#9747FF] mb-4">How It Works</h2>
          <p className="text-lg text-gray-500 mb-16">Get started in just four easy steps</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-indigo-100 z-0"></div>
            {["Sign Up Your Way", "Discover or Host", "Book Instantly", "Attend & Enjoy"].map(
              (title, index) => (
                <div key={index} className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#9747FF] text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">
                    {[
                      "Join Ticksy as an event organizer or attendee.",
                      "Find events you love or host your own with custom ticket options.",
                      "Secure your spot fast with MPESA payments and instant ticket delivery.",
                      "Get reminders, show up, and enjoy your event then leave a review!",
                    ][index]}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

 <section id="faqs" className="bg-white py-20 px-5">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-semibold text-[#9747FF] mb-10 text-center md:text-left">
      FAQs: What Ticksy Users Ask Most
    </h2>

    <div className="flex flex-col md:flex-row gap-10 items-start md:items-stretch">
      <div className="md:w-1/2 flex justify-center md:justify-start">
        <img
          src="/undraw_faq_h01d.svg"
          alt="FAQ illustration"
          className="w-full h-auto max-w-md rounded-2xl shadow-lg md:sticky md:top-24"
        />
      </div>

      <div className="md:w-1/2 space-y-4 text-black">
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
              "No — to book a ticket, you must first sign in to your Ticksy account. This helps us securely manage your bookings and ensure instant confirmation.",
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
            className="border border-[#E5D9FB] rounded-xl p-5 bg-[#FCFAFF] shadow-sm hover:shadow-[0_2px_8px_rgba(151,71,255,0.15)] transition-all duration-300"
          >
            <button
              className="w-full flex justify-between items-center text-left group"
              onClick={() => toggleItem(item.id)}
            >
              <span className="font-medium text-neutral-900 text-base group-hover:text-[#9747FF] transition-colors">
                {item.question}
              </span>
              <span className="text-[#9747FF] text-xl font-bold">
                {expandedItems[item.id] ? "−" : "+"}
              </span>
            </button>
            {expandedItems[item.id] && (
              <p className="mt-3 text-neutral-600 text-sm leading-relaxed">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default LandingPage;