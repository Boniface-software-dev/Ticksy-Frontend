import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OrgSideBar from "../../components/OrgSideBar";
import { fetchOrganizerEvents } from "../../features/organizer/eventSlice";

export default function PendingEvents() {
  const dispatch = useDispatch();
  const { pendingEvents , loading, error } = useSelector((state) => state.organizer);
  //const user = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    dispatch(fetchOrganizerEvents());
  }, [dispatch]);

  console.log("Our events:", pendingEvents);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64">
        <OrgSideBar />
      </div>
      <div className="flex-1 bg-white shadow-lg p-6 m-6 rounded-lg flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-black">Pending Events</h2>

        {loading ? (
          <p className="text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : !pendingEvents || pendingEvents.length === 0 ? (
          <p className="text-gray-600">You have no pending events.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingEvents.map((event) => (
              <div
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200 w-75"
              >
                <div className="h-54 w-full overflow-hidden bg-gray-200">
                  <img
                    src={event.image_url || "/placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                  <div className="text-gray-600">
                    <p><span>Location: </span>{event.location}</p>
                    <p><span>Start time: </span>{new Date(event.start_time).toLocaleString()}</p>
                    <p><span>End time: </span>{new Date(event.end_time).toLocaleString()}</p>
                    <p><span>Category: </span>{event.category}</p>
                    <p><span>Tags: </span>{event.tags}</p>
                    <p>Description: {event.description}</p>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}