import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, checkoutTickets } from "../features/events/eventSlice";
import { fetchTicketsByEvent } from "../features/tickets/ticketsSlice";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const event = useSelector((state) => state.events.selectedEvent);
  const status = useSelector((state) => state.events.status);
  const error = useSelector((state) => state.events.error);
  const token = useSelector((state) => state.auth?.token);
  const tickets = useSelector((state) => state.tickets?.items || []);

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
      dispatch(fetchTicketsByEvent(id));
    }
  }, [dispatch, id]);

  const handleChange = (ticketId, delta) => {
    setQuantities((prev) => {
      const current = prev[ticketId] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [ticketId]: updated };
    });
  };

  const totalPrice = useMemo(() => {
    return tickets.reduce((sum, ticket) => {
      const qty = quantities[ticket.id] || 0;
      return sum + ticket.price * qty;
    }, 0);
  }, [tickets, quantities]);

  const handleCheckout = () => {
    if (!token) {
      alert("You must be logged in to buy tickets.");
      navigate("/login");
      return;
    }

    const selectedTickets = tickets
      .map((t) => ({ ...t, quantity: quantities[t.id] || 0 }))
      .filter((t) => t.quantity > 0);

    dispatch(checkoutTickets({ eventId: id, tickets: selectedTickets }));
  };

  if (status === "loading") return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!event) return <p className="text-center text-gray-600">Event not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <img
          src={event.image_url || "/event-placeholder.jpg"}
          alt={event.title}
          className="w-full rounded-xl shadow"
        />
        <h2 className="text-lg font-semibold mt-4 mb-2 text-purple-700">Description</h2>
        <p className="text-gray-700">{event.description}</p>
        <div className="mt-4">
          <h3 className="font-semibold text-purple-700 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {event.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm border border-purple-300 text-purple-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="md:w-1/2 bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-black mb-4">{event.title}</h1>

        <div className="text-gray-600 mb-4 space-y-2">
          <p className="flex items-center gap-2">
            <Calendar size={18} className="text-purple-600" />
            {new Date(event.date).toDateString()}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={18} className="text-purple-600" />
            {event.time || "6:00pm - 9:00pm"}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={18} className="text-purple-600" />
            {event.location}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Tickets</h2>
          <div className="grid grid-cols-2 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-purple-300 rounded-lg p-4 text-center"
              >
                <h3 className="font-semibold text-purple-700">{ticket.type}</h3>
                <p className="text-gray-700">Price: {ticket.price.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">
                  Date: {new Date(ticket.date).toLocaleDateString()}
                </p>

                <div className="flex justify-center items-center gap-2 mt-2">
                  <button
                    className="px-2 py-1 rounded-full border border-purple-400 text-purple-700"
                    onClick={() => handleChange(ticket.id, -1)}
                  >
                    –
                  </button>
                  <span>{quantities[ticket.id] || 0}</span>
                  <button
                    className="px-2 py-1 rounded-full border border-purple-400 text-purple-700"
                    onClick={() => handleChange(ticket.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-bold text-gray-800">Total: {totalPrice.toLocaleString()}</p>
          <button
            onClick={handleCheckout}
            className="bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
