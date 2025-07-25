import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../redux/eventsSlice";
import { useParams } from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events.selectedEvent);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [id, dispatch]);

  if (!event) return <p className="text-center text-lg mt-10">Loading...</p>;

  return (
    <div className="p-6 md:flex gap-6 bg-[#F8F8FF] min-h-screen">
      <img src={event.image_url} alt={event.title} className="w-full md:w-1/3 rounded-md" />
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-4">
          <span role="img" aria-label="clock">🕒</span> {event.date} | {event.time}
        </p>
        <p className="text-gray-600 mb-4">
          <span role="img" aria-label="location">📍</span> {event.location}
        </p>
        <h2 className="text-xl font-semibold mb-2">Tickets</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
          {event.tickets?.map((ticket, index) => (
            <div key={index} className="border p-4 rounded-md">
              <p><strong>{ticket.type}</strong></p>
              <p>Price: {ticket.price}</p>
              <p>Date: {ticket.date}</p>
            </div>
          ))}
        </div>
        <button className="bg-purple-400 text-white px-6 py-2 rounded hover:bg-purple-600">Checkout</button>
      </div>
    </div>
  );
};

export default EventDetails;
