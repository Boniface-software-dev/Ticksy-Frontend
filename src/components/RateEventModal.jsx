import React, { useState } from "react";

export default function RateEventModal({ visible, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!visible) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Rate This Event</h2>

        {/* Stars */}
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment */}
        <textarea
          className="w-full border p-2 rounded mb-4"
          rows="4"
          placeholder="Write your thoughts (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
