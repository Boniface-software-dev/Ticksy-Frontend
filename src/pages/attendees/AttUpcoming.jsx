import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import AttendeeNavBar from "../../components/AttendeeNavBar";
import AttendeeSideBar from "../../components/AttendeeSideBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

export default function AttendeeUpcomingDetailsl() {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await axiosInstance.get(`/profile/my-upcoming-events/${eventId}`);
        setEventDetails(eventRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch event details");
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

  const handleDownloadPDF = async () => {
    try {
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

  if (loading) {
    return (
      <>
        <AttendeeNavBar />
        <div className="max-w-7xl mx-auto p-4 text-black">Loading event details...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AttendeeNavBar />
        <div className="max-w-7xl mx-auto p-4 text-red-600">{error}</div>
      </>
    );
  }

  if (!eventDetails) {
    return (
      <>
        <AttendeeNavBar />
        <div className="max-w-7xl mx-auto p-4 text-black">No event details available.</div>
      </>
    );
  }

  return (
    <>
      <AttendeeNavBar />
      <div className="max-w-7xl mx-auto p-4 flex gap-6 text-black">
        <AttendeeSideBar />
        <div className="flex-1">
          <div ref={pdfRef} className="bg-white p-6 rounded-lg shadow-md mb-6 border border-purple-100">
            <h1 className="text-2xl font-bold text-purple-700 mb-6">
              {eventDetails.event.title}
            </h1>

            <div className="space-y-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-purple-700 mb-2">Date & Time</h2>
                <p className="text-gray-700">
                  {formatDate(eventDetails.event.start_time)} - {formatDate(eventDetails.event.end_time)}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-purple-700 mb-2">Location</h2>
                <p className="text-gray-700">{eventDetails.event.location}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-purple-700 mb-2">Your Tickets</h2>
                <div className="space-y-1">
                  {eventDetails.tickets?.map((ticket) => (
                    <p key={ticket.id} className="text-gray-700">
                      Ticket #{ticket.id} • {ticket.type}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-purple-700 mb-2">Purchase Details</h2>
                <table className="w-full text-sm mb-2 border border-gray-200">
                  <thead className="bg-purple-50 border-b">
                    <tr>
                      <th className="text-left py-2 px-2 font-semibold">Ticket</th>
                      <th className="text-left py-2 px-2 font-semibold">Price</th>
                      <th className="text-left py-2 px-2 font-semibold">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventDetails.tickets?.map((ticket) => (
                      <tr key={ticket.id}>
                        <td className="py-2 px-2">{ticket.type}</td>
                        <td className="py-2 px-2">Ksh. {ticket.price}</td>
                        <td className="py-2 px-2">{ticket.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="font-semibold text-lg mt-2">
                  Total: Ksh. {eventDetails.total_amount}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-purple-700 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {eventDetails.event.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50 transition-colors ${
                isGeneratingPDF ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isGeneratingPDF ? "Generating PDF..." : "Download Receipt"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
