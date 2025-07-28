import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchEventById } from "../features/events/eventSlice";
import Footer from "../components/Footer";

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const event = useSelector((state) => state.events.selectedEvent);
  const status = useSelector((state) => state.events.status);

  const [tickets, setTickets] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  // Fetch event details
  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  // Fetch ticket types for the event
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/events/${id}/tickets`);
        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    fetchTickets();
  }, [id]);

  const handleIncrement = (ticketId) => {
    const current = selectedQuantities[ticketId] || 0;
    const ticket = tickets.find((t) => t.id === ticketId);
    const remaining = ticket.quantity - ticket.sold;

    if (current < remaining) {
      setSelectedQuantities((prev) => ({
        ...prev,
        [ticketId]: current + 1,
      }));
    }
  };

  const handleDecrement = (ticketId) => {
    const current = selectedQuantities[ticketId] || 0;
    if (current > 0) {
      setSelectedQuantities((prev) => ({
        ...prev,
        [ticketId]: current - 1,
      }));
    }
  };

  const calculateTotal = () => {
    return tickets.reduce((total, ticket) => {
      const quantity = selectedQuantities[ticket.id] || 0;
      return total + ticket.price * quantity;
    }, 0);
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div className="bg-[#f3f3f5] min-h-screen font-poppins text-black">
      <div className="max-w-7xl mx-auto py-10 px-5 md:px-10 grid md:grid-cols-2 gap-10">
        {/* LEFT SECTION */}
        <div>
          <img
            src={event.image_url}
            alt={event.title}
            className="rounded-lg w-full object-cover"
          />
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {event.description ||
                "Join us for a wonderful experience filled with music, food, and fun!"}
            </p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <div className="flex gap-3 flex-wrap">
              {Array.isArray(event.tags) ? (
                event.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 border border-[#9747FF] rounded-full text-sm text-[#9747FF]"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No tags</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <div className="text-sm text-gray-600 space-y-2 mb-6">
            <p>📅 {new Date(event.start_time).toLocaleDateString()}</p>
            <p>
              🕒{" "}
              {new Date(event.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(event.end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>📍 {event.location}</p>
          </div>

          {/* Tickets */}
          <h2 className="text-2xl font-bold mb-4">Tickets</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {tickets.map((ticket) => {
              const remaining = ticket.quantity - ticket.sold;
              const selected = selectedQuantities[ticket.id] || 0;

              return (
                <div key={ticket.id} className="border border-[#9747FF] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{ticket.type}</h3>
                    <span className="text-sm text-gray-500">{remaining} left</span>
                  </div>
                  <p>Price: {ticket.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleDecrement(ticket.id)}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span>{selected}</span>
                    <button
                      onClick={() => handleIncrement(ticket.id)}
                      className="px-2 py-1 border rounded"
                      disabled={selected >= remaining}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border rounded-lg px-4 py-3 text-lg font-semibold">
              Total <span className="float-right">{calculateTotal().toLocaleString()}</span>
            </div>
            <button className="bg-[#9747FF] text-white px-6 py-3 rounded-lg font-medium">
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
