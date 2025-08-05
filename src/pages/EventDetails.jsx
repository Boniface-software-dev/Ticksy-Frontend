import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../features/events/eventSlice";
import { fetchTicketsByEvent } from "../features/tickets/ticketsSlice";
import { toast } from "react-toastify";

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const event = useSelector((state) => state.events.selectedEvent);
  const status = useSelector((state) => state.events.status);
  const error = useSelector((state) => state.events.error);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.access_token;

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
    const selectedTickets = tickets
      .filter((ticket) => (quantities[ticket.id] || 0) > 0)
      .map((ticket) => ({
        ...ticket,
        quantity: quantities[ticket.id],
      }));

    if (selectedTickets.length === 0) {
      toast.error("Please select at least one ticket.");
      return;
    }

    navigate("/checkout", {
      state: {
        tickets: selectedTickets,
        eventTitle: event?.title,
        eventId: event?.id,
        total,
      },
    });
  };

  if (status === "loading") return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (status === "succeeded" && !event)
    return <p className="text-center text-gray-600">Event not found.</p>;

  if (!event) return null;

  // Convert tags string to array if it exists
  const eventTags = event?.tags ? event.tags.split(',') : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={event?.image_url} 
                alt={event?.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold mb-4">{event?.title}</h1>

              <div className="space-y-3 mb-6">
                <p className="text-gray-700">{event?.description}</p>
                <p className="text-gray-600">📍 {event?.location}</p>
                <p className="text-gray-600">
                  🗓 {event?.start_time ? new Date(event.start_time).toLocaleString() : ''} –{' '}
                  {event?.end_time ? new Date(event.end_time).toLocaleString() : ''}
                </p>
                {event?.category && <p className="text-gray-600">Category: {event.category}</p>}
                <p className="text-gray-600">Attendees: {event?.attendee_count || 0}</p>
              </div>

              {eventTags.length > 0 && (
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {eventTags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-xl font-semibold mb-4 text-black">Tickets</h3>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{ticket.type} Ticket</h4>
                      <span className="text-lg font-semibold">
                        KES {ticket.price?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(ticket.id, -1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">
                          {quantities[ticket.id] || 0}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(ticket.id, 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    Total: KES {total.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}