import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../features/events/eventSlice";
import { fetchTicketsByEvent } from "../features/tickets/ticketsSlice";

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

  const handleQuantityChange = (ticketId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta),
    }));
  };

  const total = useMemo(() => {
    return tickets.reduce((sum, ticket) => {
      const qty = quantities[ticket.id] || 0;
      return sum + qty * ticket.price;
    }, 0);
  }, [quantities, tickets]);

  const handleCheckout = () => {
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    const selectedTickets = tickets
      .filter((ticket) => (quantities[ticket.id] || 0) > 0)
      .map((ticket) => ({
        ...ticket,
        quantity: quantities[ticket.id],
      }));

    if (selectedTickets.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    navigate("/checkout", {
      state: {
        tickets: selectedTickets,
        eventTitle: event.title,
        eventId: event.id,
        total,
      },
    });
  };

  if (status === "loading") return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!event) return <p className="text-center text-gray-600">Event not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 rounded-xl shadow-lg">
      <div>
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="w-full rounded-md mb-4" />
        )}
        <h1 className="text-3xl font-bold text-purple-800 mb-2">{event.title}</h1>
        <p className="text-gray-700 mb-2">{event.description}</p>
        <p className="text-sm text-gray-600 mb-1">📍 {event.location}</p>
        <p className="text-sm text-gray-600 mb-1">🗓 {new Date(event.start_time).toLocaleString()} – {new Date(event.end_time).toLocaleString()}</p>
        <p className="text-sm text-gray-600 mb-1">🎯 Category: {event.category}</p>
        <p className="text-sm text-gray-600 mb-1">🏷 Tags: {(event.tags || '').split(',').join(', ')}</p>
        <p className="text-sm text-gray-600 mb-1">👤 Organizer ID: {event.organizer_id}</p>
        <p className="text-sm text-gray-600">🎟️ Attendees: {event.attendee_count}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Tickets</h2>
        {tickets.length > 0 ? (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-purple-300 rounded p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-purple-800">{ticket.type}</p>
                  <p className="text-sm text-gray-600">KES {ticket.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 bg-purple-100 rounded"
                    onClick={() => handleQuantityChange(ticket.id, -1)}
                  >
                    -
                  </button>
                  <span>{quantities[ticket.id] || 0}</span>
                  <button
                    className="px-2 bg-purple-100 rounded"
                    onClick={() => handleQuantityChange(ticket.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tickets available.</p>
        )}

        <div className="mt-6">
          <p className="font-bold text-lg text-gray-800">Total: KES {total.toLocaleString()}</p>
          <button
            onClick={handleCheckout}
            className="mt-4 px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
