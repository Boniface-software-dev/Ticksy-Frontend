import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import RateEventModal from "../../components/RateEventModal";
import {
  FaStar,
  FaRegStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";

export default function AttendeePastEventDetail() {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasAttended] = useState(true); // defaulted to true for past events
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

        const avgRating =
          reviewRes.data.length > 0
            ? reviewRes.data.reduce((sum, review) => sum + review.rating, 0) /
              reviewRes.data.length
            : 0;

        setEventDetails({
          ...eventRes.data,
          reviews: reviewRes.data,
          averageRating: avgRating.toFixed(1),
        });

        setHasReviewed(alreadyReviewed);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load event details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Invalid date"
        : date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
    } catch {
      return "Invalid date";
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

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

      alert("Review submitted successfully!");
      setShowModal(false);
      setHasReviewed(true);

      const reviewRes = await axiosInstance.get(
        `/events/${eventId}/reviews`
      );
      const avgRating =
        reviewRes.data.length > 0
          ? reviewRes.data.reduce((sum, r) => sum + r.rating, 0) /
            reviewRes.data.length
          : 0;

      setEventDetails((prev) => ({
        ...prev,
        reviews: reviewRes.data,
        averageRating: avgRating.toFixed(1),
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;
  if (!eventDetails) return <div className="p-6 text-center">Event not found</div>;
 console.log("Event", eventDetails)
  return (
  <>
    <AttendeeNavBar />
    <div className="max-w-7xl mx-auto p-4 flex gap-6 text-black">
      <AttendeeSideBar />
      <div className="flex-1">
        <div
          ref={pdfRef}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
          style={{ backgroundColor: "#ffffff", color: "#000000" }}
        >
          <img
            src={eventDetails.event.image_url || "/default-event.jpg"}
            alt={eventDetails.event.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
            onError={(e) => {
              e.target.src = "/default-event.jpg";
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <FaCalendarAlt className="text-blue-500 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-700">Date & Time</h3>
                  <p className="text-gray-600">
                    {formatDate(eventDetails.event.start_time)} -{" "}
                    {formatDate(eventDetails.event.end_time)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FaMapMarkerAlt className="text-red-500 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600">
                    {eventDetails.event.location || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <FaTicketAlt className="text-purple-500 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-700">Your Tickets</h3>
                  {eventDetails.tickets?.length > 0 ? (
                    <ul className="list-disc pl-5 text-gray-600">
                      {eventDetails.tickets.map((ticket, i) => (
                        <li key={i}>
                          {ticket.quantity} × {ticket.type || "Ticket"} (
                          Ksh.{ticket.price || "0"})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No ticket info</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-gray-700">Total Paid</h3>
                <p className="text-xl font-bold text-blue-600">
                  Ksh.{eventDetails.total_amount || "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {eventDetails.event.description || "No description available"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>

          {hasAttended && !hasReviewed && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              <FaStar className="w-4 h-4" />
              Rate & Review
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Reviews</h3>
            {eventDetails.averageRating > 0 && (
              <div className="flex items-center">
                <span className="text-3xl font-bold mr-2">
                  {eventDetails.averageRating}
                </span>
                <div className="flex flex-col">
                  <div className="flex">
                    {renderRatingStars(eventDetails.averageRating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {eventDetails.reviews?.length || 0} reviews
                  </span>
                </div>
              </div>
            )}
          </div>

          {eventDetails.reviews?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-lg">
              No reviews yet. Be the first to review!
            </div>
          ) : (
            <div className="space-y-6">
              {eventDetails.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        {review.attendee?.first_name || "Anonymous"}{" "}
                        {review.attendee?.last_name || ""}
                      </p>
                      <p className="text-sm text-gray-500">
                        {review.created_at
                          ? formatDate(review.created_at)
                          : "Date not available"}
                      </p>
                    </div>
                    <div className="flex">
                      {renderRatingStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 whitespace-pre-line">
                    {review.comment || "No comment provided"}
                  </p>
                </div>
              ))}
            </div>
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