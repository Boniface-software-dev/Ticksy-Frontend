import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import AttendeeNavBar from "../components/AttendeeNavBar";
import toast from "react-hot-toast";

export default function CheckoutForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth?.currentUser?.access_token);
  const currentUser = useSelector((state) => state.auth?.currentUser?.user);
  const user =useSelector((state) => state.auth.currentUser);
  let toastId = null;
  let intervalId = null;

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
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const formatPhoneNumber = (phone) => {
    if (phone.startsWith("7") && phone.length === 9) {
      return `254${phone}`;
    }
    return null;
  };

  const handleSubmit = async () => {
  if (!token) return navigate("/login");

  const formattedPhone = formatPhoneNumber(mpesaPhone);
  if (!formattedPhone) {
    return toast.error("Please enter a valid phone number (7XXXXXXXX format)");
  }

  if (tickets.length === 0) {
    return toast.error("You must select at least one ticket.");
  }

  const groupedByTicket = tickets.map((ticket) => {
    const relatedAttendees = attendees.filter(
      (att) => att.ticket_id === ticket.id
    );

    return {
      ticket_id: ticket.id,
      quantity: ticket.quantity,
      attendees: relatedAttendees,
    };
  });

  try {
    setIsSubmitting(true);

    const res = await axios.post(`/orders`, {
      tickets: groupedByTicket,
      phone: formattedPhone, 
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { checkoutRequestID } = res.data;

    toast.loading("Confirming Payment", { id: toastId });
    intervalId = setInterval(() => checkPayment(checkoutRequestID), 12500);
  } catch (err) {
    toast.error("Failed to process order/payment", { id: toastId });
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};


  const checkPayment = async (checkoutId) => {
    try {
      const res = await fetch(`https://ticksy-backend.onrender.com/payments/check/${checkoutId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();

      if (data.data?.ResultCode === "0") {
        toast.dismiss(toastId);
        toast.success("Payment successful", { id: toastId });
        clearInterval(intervalId);
        navigate(`/attendee/${user?.id}/profile`);
        toast("Check your upcoming events.")
      } else {
        if (data.data?.ResultCode !== "1032") return;
        toast.dismiss(toastId);
        toast.error("Payment failed or cancelled", { id: toastId });
        clearInterval(intervalId);
      }
    } catch (err) {
      console.log(err)
      clearInterval(intervalId);
      toast.dismiss(toastId);
      toast.error("Payment check failed");
    }
  };

  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Left Panel */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Ticket Owner Details</h2>
            {attendees.map((attendee, index) => (
              <div key={index} className="mb-6">
                {attendees.length > 1 && (
                  <p className="font-semibold mb-2">Ticket {index + 1} ({attendee.ticket_type})</p>
                )}
                <div className="space-y-4">
                  <input name="first_name" value={attendee.first_name} onChange={(e) => handleChange(index, e)} placeholder="First Name" className="w-full border rounded p-2" />
                  <input name="last_name" value={attendee.last_name} onChange={(e) => handleChange(index, e)} placeholder="Last Name" className="w-full border rounded p-2" />
                  <input name="email" value={attendee.email} onChange={(e) => handleChange(index, e)} placeholder="Email" className="w-full border rounded p-2" />
                  <input name="phone" value={attendee.phone} onChange={(e) => handleChange(index, e)} placeholder="Phone Number" className="w-full border rounded p-2" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel */}
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
            <div className="mt-4">
              <label className="block font-medium text-sm text-gray-700 mb-2">M-Pesa Phone Number</label>
              <div className="flex items-center">
                <span className="px-3 py-2 border border-r-0 rounded-l bg-gray-100 text-gray-600">+254</span>
                <input
                  type="text"
                  maxLength="9"
                  pattern="[7][0-9]{8}"
                  placeholder="7XXXXXXXX"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  className="w-full border rounded-r p-2 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Create Order & Pay"}
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