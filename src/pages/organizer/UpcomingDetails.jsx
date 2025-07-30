import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEventDetails } from "../../features/organizer/eventSlice";
import { fetchAttendees } from "../../features/organizer/attendeeSlice";
import OrgSideBar from "../../components/OrgSideBar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AttendeeList from "../../components/organizer/AttendeeList";
import CheckInTab from "../../components/organizer/CheckIn";
import axios from "../../utils/axiosInstance";
import { showToast, setModalState } from "../../features/organizer/uiSlice"


export default function UpcomingDetails() {
  const [activeTab, setActiveTab] = useState("attendees");
  const dispatch = useDispatch();
  const { id } = useParams();
  const token = useSelector((state) => state.auth.currentUser.access_token);

  console.log("Event ID:", id);

  const [loading, setLoading] = useState(false);
  const showModal = useSelector((state) => state.ui.modals.showTicketForm);
  const [formData, setFormData] = useState({
    type: "",
    price: "",
    quantity: "",
  });

  const event = useSelector((state) => state.events.currentEventDetails);
  const attendees = useSelector((state) => state.attendees.attendeesByEvent[id] || []);
  const checkIns = useSelector((state) => state.attendees.checkIns);

  useEffect(() => {
  dispatch(fetchEventDetails(id));
  dispatch(fetchAttendees(id));
}, [dispatch, id]);

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading event details...</p>
      </div>
    );
  }

  const tickets = event.tickets || [];

  // ---- Calculate metrics
  const totalTickets = tickets.reduce((acc, t) => acc + (t.quantity || 0), 0);
  const totalSold = tickets.reduce((acc, t) => acc + (t.sold || 0), 0);
  const totalUnsold = totalTickets - totalSold;
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.sold || 0) * (t.price || 0), 0);
  const salesPercent = totalTickets > 0 ? Math.round((totalSold / totalTickets) * 100) : 0;

  const totalCheckedIn = attendees.filter((a) => checkIns[a.id] === true).length;


  const attendancePercent = totalSold > 0 ? Math.round((totalCheckedIn / totalSold) * 100) : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/events/${id}/tickets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      dispatch(showToast({ show: true, type: "success", message: "Ticket created!" }));
      dispatch(setModalState({ modal: "showTicketForm", value: false }));
      setFormData({ type: "", price: "", quantity: "" });
    } catch (err) {
      dispatch(
        showToast({
          show: true,
          type: "error",
          message:
            err.response?.data?.message || "Failed to create ticket.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () =>
    dispatch(setModalState({ modal: "showTicketForm", value: false }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64">
        <OrgSideBar />
      </div>

      <div className="flex-1 bg-white shadow-lg p-6 m-6 rounded-lg flex flex-col space-y-8">
        {/* Event Details */}
        
        <div className="flex gap-6">
          <div className="w-1/4 bg-gray-50 p-4 rounded-lg shadow h-[490px] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Event Details</h2>
            {event ? (
              <>
                {event.image_url && (
                  <div className="h-54 w-full overflow-hidden bg-gray-200 mb-2">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
                <p className="text-2xl font-semibold pb-2 text-gray-700">{event.title}</p>
                <p className="text-sm text-gray-700">Location: {event.location}</p>
                <p className="text-sm text-gray-700">
                  Start: {new Date(event.start_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  End: {new Date(event.end_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">Category: {event.category}</p>
                <p className="text-sm text-gray-700">
                  Tags: {Array.isArray(event.tags) ? event.tags.join(", ") : event.tags || "N/A"}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">Loading event...</p>
            )}
          </div>

          {/* Ticket Columns */}
          <div className=" p-4 border border-gray-300 rounded-2xl flex-1 grid grid-cols-3 gap-4 text-black">
            {/* Ticket Sales Column */}
            <div className="space-y-4">
              <h2 className="text-md font-semibold mb-2">Sales</h2>
              {tickets.map((ticket) => {
                const { id, type, price = 0, quantity = 0, sold = 0 } = ticket;
                const remaining = quantity - sold;
                const percent = quantity > 0 ? Math.round((sold / quantity) * 100) : 0;

                return (
                  <div
                    key={`sales-${id}`}
                    className="bg-white border border-gray-300 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="text-sm space-y-1 leading-4">
                      <h3 className="font-semibold pb-1">{type} Tickets</h3>
                      <p>Price: KES {price}</p>
                      <p>Sold: {sold}</p>
                      <p>Remaining: {remaining}</p>
                      <p>Total: {quantity}</p>
                      <p>Revenue: KES {(sold * price).toLocaleString()}</p>
                    </div>
                    <div className="w-20 h-20">
                      <CircularProgressbar
                        value={percent}
                        text={`${percent}%`}
                        styles={buildStyles({
                          textSize: "20px",
                          pathColor: "#bf80ff",
                          textColor: "#9747ff",
                          trailColor: "#eeeeee",
                        })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Attendance Column */}
            <div className="space-y-4">
              <h2 className="text-md font-semibold mb-2">Attendance</h2>
              {tickets.map((ticket) => {
                const filtered = attendees.filter(
                  (a) => a.ticket_type === ticket.type && checkIns[a.id]
                );
                const percent = ticket.sold > 0 ? Math.round((filtered.length / ticket.sold) * 100) : 0;

                return (
                  <div
                    key={`att-${ticket.id}`}
                    className="bg-white border border-gray-300 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="text-sm space-y-1">
                      <h3 className="font-semibold pb-1">{ticket.type} Attendance</h3>
                      <p>Checked-in: {filtered.length}</p>
                      <p>Total Sold: {ticket.sold}</p>
                      <p>Attendance Rate: {percent}%</p>
                    </div>
                    <div className="w-20 h-20">
                      <CircularProgressbar
                        value={percent}
                        text={`${percent}%`}
                        styles={buildStyles({
                          textSize: "20px",
                          pathColor: "#bf80ff",
                          textColor: "#9747ff",
                          trailColor: "#eeeeee",
                        })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Column */}
            <div className="space-y-4">
              <h2 className="text-md font-semibold mb-2">Total</h2>

              {/* Total Sales Card */}
              <div className="bg-white p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                <div className="text-sm space-y-1">
                  <h3 className="font-semibold text-lg">Total Ticket Sales</h3>
                  <p>Total: {totalTickets}</p>
                  <p>Sold: {totalSold}</p>
                  <p>Unsold: {totalUnsold}</p>
                  <p>Revenue: KES {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-20 h-20">
                  <CircularProgressbar
                    value={salesPercent}
                    text={`${salesPercent}%`}
                    styles={buildStyles({
                      textSize: "20px",
                      pathColor: "#bf80ff",
                      textColor: "#9747ff",
                      trailColor: "#eeeeee",
                    })}
                  />
                </div>
              </div>

              {/* Total Attendance Card */}
              <div className="bg-white border border-gray-300 p-4 rounded-lg flex justify-between items-center">
                <div className="text-sm space-y-1">
                  <h3 className="font-semibold text-lg">Total Attendance</h3>
                  <p>Checked-in: {totalCheckedIn}</p>
                  <p>Total Sold: {totalSold}</p>
                  <p>Attendance Rate: {attendancePercent}%</p>
                </div>
                <div className="w-20 h-20">
                  <CircularProgressbar
                    value={attendancePercent}
                    text={`${attendancePercent}%`}
                    styles={buildStyles({
                      textSize: "20px",
                      pathColor: "#bf80ff",
                      textColor: "#9747ff",
                      trailColor: "#eeeeee",
                    })}
                  />
                </div>
              </div>
              <button
        onClick={() =>
          dispatch(setModalState({ modal: "showTicketForm", value: true }))
        }
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Create Ticket
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 text-black backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Create Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price (Ksh)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border border-gray-300 rounded-md p-2">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab("attendees")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "attendees"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-purple-600"
              }`}
            >
              Attendee List
            </button>
            <button
              onClick={() => setActiveTab("checkin")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "checkin"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-purple-600"
              }`}
            >
              Check In
            </button>
            <div className="px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
              Reviews
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-b-md mt-2">
            {activeTab === "attendees" && <AttendeeList eventId={id} />}

            {activeTab === "checkin" && <CheckInTab eventId={id} />}
          </div>
        </div>
      </div>
    </div>
  );
}
