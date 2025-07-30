import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm() {
  const navigate = useNavigate();
  const tickets = useSelector((state) => state.tickets.items || []);
  const token = useSelector((state) => state.auth?.token);

  const selectedTicket = tickets[0]; // Assuming only one ticket type is purchased at a time
  const quantity = selectedTicket?.quantity || 1;

  const [attendees, setAttendees] = useState(
    Array.from({ length: quantity }, () => ({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    }))
  );

  const [payNow, setPayNow] = useState(true);

  const totalAmount = selectedTicket?.price * quantity || 0;

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
        ticket_id: selectedTicket.id,
        quantity: quantity,
        attendees: attendees,
      };

      const res = await axios.post("http://localhost:5000/api/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");
      navigate("/thank-you");
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Failed to process order.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Attendee Details</h2>

      <div className="space-y-6">
        {attendees.map((attendee, index) => (
          <div key={index} className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Ticket {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="first_name" value={attendee.first_name} onChange={(e) => handleChange(index, e)} placeholder="First Name" className="border p-2 rounded" />
              <input name="last_name" value={attendee.last_name} onChange={(e) => handleChange(index, e)} placeholder="Last Name" className="border p-2 rounded" />
              <input name="email" value={attendee.email} onChange={(e) => handleChange(index, e)} placeholder="Email" className="border p-2 rounded" />
              <input name="phone" value={attendee.phone} onChange={(e) => handleChange(index, e)} placeholder="Phone (M-Pesa)" className="border p-2 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: <span className="text-purple-700">KES {totalAmount?.toLocaleString()}</span></p>
        <div className="space-x-4">
          <button onClick={() => { setPayNow(false); handleSubmit(); }} className="bg-gray-300 px-4 py-2 rounded">
            Pay Later
          </button>
          <button onClick={() => { setPayNow(true); handleSubmit(); }} className="bg-purple-600 text-white px-4 py-2 rounded">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
