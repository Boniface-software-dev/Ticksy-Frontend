// src/features/events/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEventById, increaseTicket, decreaseTicket } from "../features/events/eventSlice";
import Footer from "../components/Footer";

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const event = useSelector((state) => state.events.selectedEvent);
  const status = useSelector((state) => state.events.status);


  const [tickets, setTickets] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const calculateTotal = () => {
    return tickets.reduce((total, ticket) => {
      const quantity = selectedQuantities[ticket.id] || 0;
      return total + ticket.price * quantity;
    }, 0);
  };

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  if (status === "loading") return <p>Loading...</p>;
  if (!event) return <p>No event found.</p>;

  const total = individualCount * 3000 + tableCount * 60000;

  return (
    <div className="bg-[#f3f3f5] min-h-screen font-poppins text-black">
      <div className="max-w-7xl mx-auto py-10 px-5 md:px-10 grid md:grid-cols-2 gap-10">
        {/* Left Section */}
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
                "Join us for an unforgettable dinner experience featuring global cuisine, music, and networking opportunities."}
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
                <span className="text-sm text-gray-500">No tags available</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
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
            <div className="flex ">
             
              <img width="20" height="20" src="https://img.icons8.com/ios/30/marker--v1.png" alt="marker--v1"/>
              <p>{event.location}</p>
              </div>
          </div>
{/*
          Tickets Section
*/}
          <h2 className="text-2xl font-bold mb-4">Tickets</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {tickets.map((ticket) => {
              const remaining = ticket.quantity - ticket.sold;
              return (
                <div
                  key={ticket.id}
                  className="border border-[#9747FF] rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{ticket.type}</h3>
                    <span className="text-sm text-gray-500">
                      {remaining} remaining
                    </span>
                  </div>
                  <p>price:{ticket.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleDecrement(ticket.id)}
                      className="px-2 py-1 border rounded"
                    >                      
                      -
                    </button>
                    <span>{selectedQuantities[ticket.id] || 0}</span>
                    <button
                      onClick={() => handleIncrement(ticket.id)}
                      className="px-2 py-1 border rounded"
                      disabled={selectedQuantities[ticket.id] >= remaining}
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
              Total <span className="float-right">{total}</span>
            </div>
            <button className="bg-[#9747FF] text-white px-6 py-3 rounded-lg font-medium">
              Checkout
            </button>
          </div>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default EventDetails;
