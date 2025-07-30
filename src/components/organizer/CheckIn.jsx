import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendees,
  checkInAttendee,
  undoCheckInAttendee,
} from "../../features/organizer/attendeeSlice";

export default function CheckInTab({ eventId }) {
  const dispatch = useDispatch();

  const rawAttendees = useSelector(
    (state) => state.attendees.attendeesByEvent[eventId] || []
  );

  const loadingEventId = useSelector((state) => state.attendees.loadingEventId);
  const error = useSelector((state) => state.attendees.error);

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const observer = useRef(null);

  const filteredAttendees = rawAttendees.filter(
    (a) =>
      a.attendee_first_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.attendee_last_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.ticket_code?.toLowerCase().includes(search.toLowerCase())
  );

  const checkedInCount = rawAttendees.filter((a) => a.checked_in).length;

  const lastItemRef = useCallback(
    (node) => {
      if (loadingEventId === eventId) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredAttendees.length) {
          setVisibleCount((prev) => prev + 20);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingEventId, visibleCount, eventId, filteredAttendees.length]
  );

  useEffect(() => {
    dispatch(fetchAttendees(eventId));
  }, [dispatch, eventId]);

  const handleCheckInToggle = (attendee) => {
    if (attendee.checked_in) {
      dispatch(undoCheckInAttendee({ eventId, attendeeId: attendee.id }));
    } else {
      dispatch(checkInAttendee({ eventId, attendeeId: attendee.id, passId: attendee.id }));
    }
  };

  return (
    <div className="p-4 text-black">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">Check-In Summary</h2>
          <p className="text-sm text-gray-600">
            {checkedInCount} of {rawAttendees.length} attendees checked in
          </p>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-purple-500 px-2 py-1 rounded text-sm"
        />
      </div>

      {loadingEventId === eventId && rawAttendees.length === 0 ? (
        <p className="text-gray-500">Loading attendees...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : filteredAttendees.length === 0 ? (
        <p className="text-gray-500">No attendees found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border-t border-b">First Name</th>
              <th className="p-2 border-t border-b">Last Name</th>
              <th className="p-2 border-t border-b">Ticket Type</th>
              <th className="p-2 border-t border-b">Ticket Code</th>
              <th className="p-2 border-t border-b">Checked In</th>
              <th className="p-2 border-t border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.slice(0, visibleCount).map((a, idx) => (
              <tr
                key={a.ticket_code}
                ref={idx === visibleCount - 1 ? lastItemRef : null}
                className="hover:bg-gray-50"
              >
                <td className="p-2 border-t border-b">{a.attendee_first_name}</td>
                <td className="p-2 border-t border-b">{a.attendee_last_name}</td>
                <td className="p-2 border-t border-b">{a.ticket_type}</td>
                <td className="p-2 border-t border-b">{a.ticket_code}</td>
                <td className={`p-2 border-t border-b border-black ${a.checked_in ? "text-green-700" : "text-red-500"}`}>
                {a.checked_in ? "Yes" : "No"}
                </td>
                <td className="p-2 border-t border-b">
                  <button
                    onClick={() => handleCheckInToggle(a)}
                    className={`px-2 py-1 rounded text-sm ${
                      a.checked_in ? "text-red-500 hover:bg-red-400 hover:text-white hover:scale-90 transition" : "text-purple-400 hover:bg-purple-400 hover:text-white hover:scale-110 transition"
                    }`}
                  >
                    {a.checked_in ? "Undo" : "Check In"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}