import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, fetchTicketsByEvent, checkoutTickets } from "../features/events/eventSlice";

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const event = useSelector((state) => state.events.selectedEvent);
  const status = useSelector((state) => state.events.status);
  const error = useSelector((state) => state.events.error);
  const token = useSelector((state) => state.auth?.token);
  const tickets = useSelector((state) => state.tickets?.items || []);

  // Fetch event and tickets
  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
      dispatch(fetchTicketsByEvent(id));
    }
  }, [dispatch, id]);

  // Calculate total price safely
  const totalPrice = useMemo(() => {
    if (!tickets || tickets.length === 0) return 0;
    return tickets.reduce((sum, ticket) => sum + ticket.price, 0);
  }, [tickets]);

  const handleCheckout = () => {
    if (!token) {
      alert("You must be logged in to buy tickets.");
      navigate("/login");
      return;
    }

    dispatch(checkoutTickets({ eventId: id, tickets }));
  };

  if (status === "loading") return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!event) return <p className="text-center text-gray-600">Event not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-2">{event.description}</p>
      <p className="mb-2 text-gray-700">Location: {event.location}</p>
      <p className="mb-2 text-gray-700">Date: {new Date(event.date).toLocaleDateString()}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Available Tickets</h2>
        {tickets.length > 0 ? (
          <ul className="space-y-2">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="bg-gray-100 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span>{ticket.type}</span>
                  <span>${ticket.price}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tickets available.</p>
        )}
      </div>

      <div className="mt-6">
        <p className="font-bold text-lg">Total: ${totalPrice.toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buy Tickets
        </button>
      </div>
    </div>
  );
}
