import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import AttendeeNavBar from "../components/AttendeeNavBar";
import AttendeeSideBar from "../components/AttendeeSideBar";

export default function CheckoutForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth?.currentUser?.access_token);
  const currentUser = useSelector((state) => state.auth?.currentUser?.user);

  const { tickets = [], eventTitle = "", eventId = null, total = 0 } = location.state || {};

  const initialAttendees = tickets.flatMap((ticket) =>
    Array.from({ length: ticket.quantity }, (_, i) => ({
      ticket_id: ticket.id,
      ticket_type: ticket.type,
      first_name: i === 0 && ticket.quantity === 1 ? currentUser?.first_name || "" : "",
      last_name: i === 0 && ticket.quantity === 1 ? currentUser?.last_name || "" : "",
      email: i === 0 && ticket.quantity === 1 ? currentUser?.email || "" : "",
      phone: i === 0 && ticket.quantity === 1 ? currentUser?.phone || "" : "",
    }))
  );

  const [attendees, setAttendees] = useState(initialAttendees);

  useEffect(() => {
    if (!location.state) {
      navigate("/events");
    }
  }, [location.state, navigate]);

  const handleChange = (index, e) => {
    const updated = [...attendees];
    updated[index][e.target.name] = e.target.value;
    setAttendees(updated);
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("Please log in to continue.");
      return navigate("/login");
    }

    try {
      const payload = {
        event_id: eventId,
        attendees,
        pay_now: payNow,
      };

      const res = await axios.post(`${API}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

       navigate(`/order-confirmation/${res.data.orderId}`);

    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to create order. Please try again.");
    }
  };

 return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        <AttendeeSideBar />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Left Panel: Form */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Ticket Owner Details</h2>
            {attendees.map((attendee, index) => (
              <div key={index} className="mb-6">
                {attendees.length > 1 && (
                  <p className="font-semibold mb-2">Ticket {index + 1} ({attendee.ticket_type})</p>
                )}
                <div className="space-y-4">
                  <input
                    name="first_name"
                    value={attendee.first_name}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="First Name"
                    className="w-full border rounded p-2"
                  />
                  <input
                    name="last_name"
                    value={attendee.last_name}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Last Name"
                    className="w-full border rounded p-2"
                  />
                  <input
                    name="email"
                    value={attendee.email}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Email"
                    className="w-full border rounded p-2"
                  />
                  <input
                    name="phone"
                    value={attendee.phone}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Phone Number"
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel: Summary */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <p className="text-lg font-semibold mb-2">{eventTitle}</p>
            {tickets.map((ticket, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between">
                  <span>{ticket.type}</span>
                  <span>KES {(ticket.price * ticket.quantity).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500">Quantity: {ticket.quantity}</p>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-purple-600">KES {total.toLocaleString()}</span>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded hover:bg-purple-700"
            >
              Create Order
            </button>

            <p className="text-sm text-center mt-4 text-gray-600">
              You will receive an M-Pesa prompt to complete the payment
            </p>
          </div>
        </div>
      </div>
    </>
  );
}