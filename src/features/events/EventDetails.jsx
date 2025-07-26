// src/features/events/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEventById } from "./eventSlice";
import { decreaseTicket, increaseTicket } from "./eventSlice";

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const event = useSelector((state) => state.events.selectedEvent);
  const status = useSelector((state) => state.events.status);
  const [individualCount, setIndividualCount] = useState(0);
  const [tableCount, setTableCount] = useState(0);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  if (status === "loading") return <p>Loading...</p>;
  if (!event) return <p>No event found.</p>;

  const total = individualCount * 3000 + tableCount * 60000;

  return (
    <div className="bg-[#f3f3f5] min-h-screen font-poppins text-black">
      <div className="max-w-7xl mx-auto py-10 px-5 md:px-10 grid md:grid-cols-2 gap-10">
        {/* Left Section - Image and Description */}
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
              {event.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-[#9747FF] rounded-full text-sm text-[#9747FF]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Title and Tickets */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <div className="text-sm text-gray-600 space-y-2 mb-6">
            <p>📅 {new Date(event.start_time).toLocaleDateString()}</p>
            <p>🕒 {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>📍 {event.location}</p>
          </div>

          <h2 className="text-2xl font-bold mb-4">Tickets</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Individual Ticket */}
            <div className="border border-[#9747FF] rounded-lg p-4">
              <h3 className="text-center font-semibold mb-2">Individual</h3>
              <p>Price: 3000</p>
              <p>Date: {new Date(event.start_time).toLocaleDateString()}</p>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setIndividualCount(Math.max(0, individualCount - 1))}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span>{individualCount}</span>
                <button
                  onClick={() => setIndividualCount(individualCount + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* Table Ticket */}
            <div className="border border-[#9747FF] rounded-lg p-4">
              <h3 className="text-center font-semibold mb-2">Table</h3>
              <p>Price: 60,000</p>
              <p>Date: {new Date(event.start_time).toLocaleDateString()}</p>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setTableCount(Math.max(0, tableCount - 1))}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span>{tableCount}</span>
                <button
                  onClick={() => setTableCount(tableCount + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>
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

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 text-xs text-gray-600 border-t text-center">
        Copyright © Ticksy 2025
      </footer>
    </div>
  );
};

export default EventDetails;
