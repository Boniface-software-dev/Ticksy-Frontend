import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";

export default function AttendeePastEventDetail() {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/profile/my-past-events/${eventId}`)
      .then((res) => {
        setEventDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch event details.");
        setLoading(false);
      });
  }, [eventId]);

  const handleDownloadPDF = () => {
    // Replace this with actual PDF download logic
    alert("Download PDF clicked!");
  };

  const handleRateEvent = () => {
    // Replace this with rating modal / navigation
    alert("Rate Event clicked!");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!eventDetails) return null;

  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-4 flex gap-6">
        <AttendeeSideBar />
        <div className="flex-1 text-black">
          <h2 className="text-2xl font-bold mb-4">{eventDetails.title}</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Your Tickets</h3>
            {eventDetails.tickets.map((ticket) => (
              <div key={ticket.id} className="mb-2">
                <p className="text-sm">ID: {ticket.id}</p>
                <p className="text-sm">Type: {ticket.ticket_type}</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Purchase Details</h3>
            <table className="w-full text-left border">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Ticket</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Qty</th>
                </tr>
              </thead>
              <tbody>
                {eventDetails.ticket_summary.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">{item.ticket_type}</td>
                    <td className="p-2">Ksh.{item.price}</td>
                    <td className="p-2">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 font-semibold">
              Total: Ksh.{eventDetails.total_price}
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Download PDF
            </button>
            <button
              onClick={handleRateEvent}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Rate Event
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Event Reviews</h3>
            {eventDetails.reviews.length > 0 ? (
              eventDetails.reviews.map((review, index) => (
                <div key={index} className="mb-4 border-b pb-2">
                  <p className="text-yellow-500">{"★".repeat(review.rating)}</p>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
