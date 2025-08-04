import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendees } from "../../features/organizer/attendeeSlice";

export default function AttendeeList({ eventId }) {
  const dispatch = useDispatch();

  const rawAttendees = useSelector(
    (state) => state.attendees.attendeesByEvent[eventId]
  );

  const attendees = Array.isArray(rawAttendees) ? rawAttendees : [];

  const loadingEventId = useSelector((state) => state.attendees.loadingEventId);
  const error = useSelector((state) => state.attendees.error);

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const observer = useRef(null);

  const filteredAttendees = attendees.filter(
    (a) =>
      `${a.attendee_first_name} ${a.attendee_last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      a.attendee_email?.toLowerCase().includes(search.toLowerCase()) ||
      a.attendee_phone?.toLowerCase().includes(search.toLowerCase()) ||
      a.ticket_type?.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleFrontendExport = () => {
    if (!attendees.length) return;

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Ticket Type'];
    const rows = attendees.map(a => [
      a.attendee_first_name,
      a.attendee_last_name,
      a.attendee_email,
      a.attendee_phone,
      a.ticket_type || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 text-black">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Gmail Button */}
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${attendees.map(a => a.attendee_email).join(',')}&su=Event+Update&body=Dear+Attendees%2C`}
            target="_blank"
            title="Email All Attendees"
            rel="noopener noreferrer"
            className="p-1 border border-purple-500 rounded hover:bg-purple-300 hover:scale-110 transition"
          >
            <img width="30" height="30" src="https://img.icons8.com/fluency/30/gmail-new.png" alt="gmail-new" className="cursor-pointer" />
          </a>

          <span className="text-gray-600 text-sm">
            Total: {attendees.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-purple-500 px-2 py-1 rounded text-sm"
          />
          <button
            onClick={handleFrontendExport}
            className="text-purple-500 border border-purple-500 px-3 py-1 rounded text-sm hover:bg-purple-400 hover:text-white transition"
          >
            Download CSV
          </button>
        </div>
      </div>

      {loadingEventId === eventId && attendees.length === 0 ? (
        <p className="text-gray-500">Loading attendees...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : filteredAttendees.length === 0 ? (
        <p className="text-gray-500">No attendees found.</p>
      ) : (
        <table className="w-full text-sm border-separate border-spacing-0 border-gray-500">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border-y-2">First Name</th>
              <th className="p-2 border-y-2">Last Name</th>
              <th className="p-2 border-y-2">Email</th>
              <th className="p-2 border-y-2">Phone</th>
              <th className="p-2 border-y-2">Ticket Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.slice(0, visibleCount).map((a, idx) => (
              <tr
                key={a.ticket_code || `${a.attendee_email}-${idx}`}
                ref={idx === visibleCount - 1 ? lastItemRef : null}
                className="hover:bg-gray-50"
              >
                <td className="p-2 border-b">{a.attendee_first_name}</td>
                <td className="p-2 border-b">{a.attendee_last_name}</td>
                <td className="p-2 border-b">{a.attendee_email}</td>
                <td className="p-2 border-b">{a.attendee_phone}</td>
                <td className="p-2 border-b">{a.ticket_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}