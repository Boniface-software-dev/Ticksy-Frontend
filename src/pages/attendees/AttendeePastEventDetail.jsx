import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import RateEventModal from "../../components/RateEventModal";

export default function AttendeePastEventDetail() {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, reviewRes] = await Promise.all([
          axiosInstance.get(`/profile/my-past-events/${eventId}`),
          axiosInstance.get(`/events/${eventId}/reviews`),
        ]);

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user?.id;

        const alreadyReviewed = reviewRes.data.some(
          (r) => r.attendee?.id === userId
        );

        setEventDetails({
          ...eventRes.data,
          reviews: reviewRes.data,
        });

        setHasReviewed(alreadyReviewed);
      } catch {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`event_${eventDetails.id || "details"}.pdf`);
    } catch {
      alert("PDF generation failed.");
    }
  };

  const handleSubmitReview = async ({ rating, comment }) => {
    try {
      await axiosInstance.post(`/events/${eventId}/reviews`, {
        rating,
        comment,
      });

      alert("Review submitted!");
      setShowModal(false);
      setHasReviewed(true);

      const updatedReviews = await axiosInstance.get(`/events/${eventId}/reviews`);
      setEventDetails((prev) => ({
        ...prev,
        reviews: updatedReviews.data,
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!eventDetails) return null;

  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-4 flex gap-6 text-black">
        <AttendeeSideBar />
        <div className="flex-1">
          <div
            ref={pdfRef}
            className="bg-white p-4 rounded shadow mb-6"
            style={{ backgroundColor: "#ffffff", color: "#000000" }}
          >
            <h2 className="text-2xl font-bold mb-4">{eventDetails.title}</h2>
            <img
              src={eventDetails.image_url}
              alt={eventDetails.title}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <p className="text-gray-600 mb-2">
              {new Date(eventDetails.start_time).toLocaleString()} –{" "}
              {new Date(eventDetails.end_time).toLocaleString()}
            </p>
            <p className="mb-2">{eventDetails.location}</p>
            <p className="mb-4">{eventDetails.description}</p>

            {eventDetails.ticket_summary?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Tickets</h3>
                <table className="w-full text-left border">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">Type</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventDetails.ticket_summary.map((item, i) => (
                      <tr key={i}>
                        <td className="p-2">{item.ticket_type}</td>
                        <td className="p-2">Ksh.{item.price}</td>
                        <td className="p-2">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="font-semibold">Total: Ksh.{eventDetails.total_price}</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>

            {!hasReviewed && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Rate & Review
              </button>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Reviews</h3>
            {eventDetails.reviews?.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {eventDetails.reviews.map((review) => (
                  <li key={review.id} className="border p-3 rounded">
                    <p className="font-semibold">
                      {review.attendee?.first_name} {review.attendee?.last_name}
                    </p>
                    <p className="text-yellow-600">Rating: {review.rating}/5</p>
                    <p>{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <RateEventModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}
