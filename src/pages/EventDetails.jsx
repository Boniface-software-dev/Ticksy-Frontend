import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, checkoutTickets } from "../features/events/eventSlice";
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

  // Local state to track quantities
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
      dispatch(fetchTicketsByEvent(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (tickets.length) {
      const initial = {};
      tickets.forEach((t) => {
        initial[t.id] = 0;
      });
      setQuantities(initial);
    }
  }, [tickets]);

  const handleQtyChange = (ticketId, delta) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      updated[ticketId] = Math.max(0, (updated[ticketId] || 0) + delta);
      return updated;
    });
  };

  const totalPrice = useMemo(() => {
    return tickets.reduce((sum, ticket) => {
      const qty = quantities[ticket.id] || 0;
      return sum + qty * ticket.price;
    }, 0);
  }, [tickets, quantities]);

  const handleCheckout = () => {
    if (!token) {
      alert("You must be logged in to buy tickets.");
      navigate("/login");
      return;
    }

    const selectedTickets = tickets
      .filter((t) => quantities[t.id] > 0)
      .map((t) => ({ ...t, quantity: quantities[t.id] }));

    dispatch(checkoutTickets({ eventId: id, tickets: selectedTickets }));
  };

  if (status === "loading") return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!event) return <p className="text-center text-gray-600">Event not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: Poster & Description */}
      <div>
        <img
          src={event.image || "/placeholder.jpg"}
          alt={event.title}
          className="rounded shadow-lg w-full object-cover"
        />
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-purple-700">Description</h2>
          <p className="text-gray-800">{event.description}</p>
        </div>
      </div>

      {/* Right: Info + Tickets */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2 text-purple-900">{event.title}</h1>
        <p className="text-sm text-gray-600 mb-1">
          📅{" "}
          {event.date
            ? new Date(event.date).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "TBD"}
        </p>
        <p className="text-sm text-gray-600 mb-4">📍 {event.location}</p>

        <h2 className="text-xl font-semibold text-purple-800 mb-2">Tickets</h2>
        {tickets.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-purple-300 rounded-lg p-4 text-center"
              >
                <h3 className="font-medium text-purple-700 mb-1">{ticket.type}</h3>
                <p className="text-gray-800">Price: {ticket.price.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">
                  Date:{" "}
                  {ticket.date
                    ? new Date(ticket.date).toLocaleDateString()
                    : "TBD"}
                </p>
                <div className="flex justify-center items-center mt-3 gap-3">
                  <button
                    onClick={() => handleQtyChange(ticket.id, -1)}
                    className="px-2 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                  >
                    –
                  </button>
                  <span>{quantities[ticket.id] || 0}</span>
                  <button
                    onClick={() => handleQtyChange(ticket.id, 1)}
                    className="px-2 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No tickets available.</p>
        )}

        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-lg font-semibold text-gray-800">
            Total: {totalPrice.toLocaleString()}
          </span>
          <button
            onClick={handleCheckout}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
