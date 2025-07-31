import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import RateEventModal from "../../components/RateEventModal";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaUserCircle, FaDownload, FaPenAlt } from "react-icons/fa";

export default function AttendeePastEventDetail() {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasAttended] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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
        setError(err.response?.data?.message || "Failed to load event details.");
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
        : date.toLocaleString("en-KE", {
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
    try {
      setIsGeneratingPDF(true);
      const receiptContent = `
        <div style="
          font-family: 'Courier New', monospace;
          width: 80mm;
          padding: 10px;
          font-size: 12px;
          line-height: 1.4;
        ">
          <div style="text-align: center; margin-bottom: 10px;">
            <div style="font-size: 16px; font-weight: bold;">TICKSY</div>
            <div style="font-size: 10px; color: #666;">Ticket Receipt</div>
          </div>

          <div style="border-bottom: 1px dashed #ccc; padding-bottom: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between;">
              <span><strong>Order:</strong> ${eventDetails.order?.order_id || 'N/A'}</span>
              <span>${formatDate(eventDetails.order?.created_at) || 'Date N/A'}</span>
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${eventDetails.event?.title || 'Event'}</div>
            <div>${formatDate(eventDetails.event?.start_time)}</div>
            <div>${eventDetails.event?.location || 'Location N/A'}</div>
          </div>

          <div style="border-bottom: 1px dashed #ccc; margin: 10px 0;"></div>

          <div style="margin-bottom: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">TICKETS</div>
            ${eventDetails.tickets?.map(ticket => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>${ticket.quantity}x ${ticket.type}</span>
                <span>Ksh.${ticket.price * ticket.quantity}</span>
              </div>
            `).join('')}
          </div>

          <div style="border-bottom: 1px dashed #ccc; margin: 10px 0;"></div>

          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>TOTAL</span>
              <span>Ksh.${eventDetails.total_amount || '0'}</span>
            </div>
            <div style="margin-top: 6px;">
              <div>Payment: MPESA</div>
              ${eventDetails.order?.mpesa_receipt ? `
                <div>Receipt: ${eventDetails.order.mpesa_receipt}</div>
              ` : ''}
            </div>
          </div>

          <div style="text-align: center; margin-top: 15px; font-size: 10px; color: #666;">
            <div>Thank you for your purchase!</div>
            <div>Present this receipt at the event</div>
          </div>
        </div>
      `;

      const hiddenDiv = document.createElement('div');
      hiddenDiv.style.position = 'absolute';
      hiddenDiv.style.left = '-9999px';
      hiddenDiv.innerHTML = receiptContent;
      document.body.appendChild(hiddenDiv);

      const canvas = await html2canvas(hiddenDiv, {
        scale: 1,
        width: 300,
        windowWidth: 300,
        logging: false
      });

      document.body.removeChild(hiddenDiv);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 120] 
      });

      pdf.addImage(canvas, 'PNG', 5, 5, 70, 0);
      pdf.save(`receipt-${eventDetails.order?.order_id || Date.now()}.pdf`);
      toast.success("Receipt downloaded!");
    } catch (err) {
      toast.error("Failed to generate receipt");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSubmitReview = async ({ rating, comment }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Thank you for your review!");

      const fakeReview = {
        id: Date.now(),
        rating,
        comment,
        attendee: { first_name: "You" },
        created_at: new Date().toISOString(),
      };

      setEventDetails((prev) => {
        const updated = [fakeReview, ...(prev.reviews || [])];
        const avg = updated.reduce((sum, r) => sum + r.rating, 0) / updated.length;
        return {
          ...prev,
          reviews: updated,
          averageRating: avg.toFixed(1),
        };
      });

      setShowModal(false);
      setHasReviewed(true);
    } catch {
      toast.error("Failed to submit review.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;
  if (!eventDetails) return <div className="p-6 text-center">Event not found</div>;

  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6 text-gray-800">
        <AttendeeSideBar />
        
        <div className="flex-1 space-y-6">
          {/* Event Details Card */}
          <div ref={pdfRef} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {eventDetails.event.title || "Event Details"}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isGeneratingPDF 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-white text-purple-600 border border-purple-600 hover:bg-purple-50 hover:shadow-sm"}
                  `}
                >
                  <FaDownload className="text-sm" />
                  {isGeneratingPDF ? "Generating..." : "Receipt"}
                </button>

                {hasAttended && !hasReviewed && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 
                    transition-all text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <FaPenAlt className="text-sm" />
                    Rate Event
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Date & Time</h2>
                  <p className="text-gray-600">
                    {formatDate(eventDetails.event.start_time)} - {formatDate(eventDetails.event.end_time)}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Location</h2>
                  <p className="text-gray-600">{eventDetails.event.location || "Not specified"}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Tickets</h2>
                <div className="space-y-2">
                  {eventDetails.tickets?.map((ticket) => (
                    <div key={ticket.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700 font-medium">#{ticket.id} • {ticket.type}</span>
                      <span className="text-purple-600 font-medium">Ksh {ticket.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Purchase Summary</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Ticket</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {eventDetails.tickets?.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">{ticket.type}</td>
                          <td className="py-3 px-4">Ksh {ticket.price}</td>
                          <td className="py-3 px-4">{ticket.quantity}</td>
                          <td className="py-3 px-4 font-medium">Ksh {ticket.price * ticket.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="py-3 px-4 font-medium text-right">Total:</td>
                        <td className="py-3 px-4 font-bold text-purple-600">Ksh {eventDetails.total_amount || "0"}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {eventDetails.event.description || "No description available"}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Event Reviews</h2>
              {eventDetails.averageRating > 0 && (
                <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
                  <span className="text-lg font-bold mr-2 text-purple-700">{eventDetails.averageRating}</span>
                  <div className="flex">{renderRatingStars(eventDetails.averageRating)}</div>
                </div>
              )}
            </div>

            {eventDetails.reviews?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-3">No reviews yet</p>
                {!hasReviewed && hasAttended && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 
                    transition-all text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <FaPenAlt className="text-sm" />
                    Be the first to review
                  </button>
                )}
              </div>
            ) : (
              <ul className="space-y-4">
                {eventDetails.reviews.map((review) => (
                  <li key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <FaUserCircle className="text-purple-500 text-2xl mt-1" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">
                            {review.attendee?.first_name || "Anonymous"}
                          </span>
                          <div className="flex">{renderRatingStars(review.rating)}</div>
                        </div>
                        <p className="text-gray-600 mt-1">{review.comment || "No comment provided"}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
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