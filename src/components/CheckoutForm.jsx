import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email || !formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    return newErrors;
  };

  const handleSubmit = (payNow = false) => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In production, send the form data to backend or persist
    console.log("Attendee Info:", formData);

    if (payNow) {
      // Redirect to Mpesa payment (l'will integrate actual Mpesa later)
      alert("Redirecting to M-Pesa...");
      navigate("/payment-success"); // or payment gateway route
    } else {
      // Proceed without payment
      alert("Booking saved. Pay later.");
      navigate("/thank-you");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Attendee Information</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
          >
            Pay Now
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            Pay Later
          </button>
        </div>
      </form>
    </div>
  );
}
