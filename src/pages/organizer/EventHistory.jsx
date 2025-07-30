import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OrgSideBar from "../../components/OrgSideBar";
import { fetchOrganizerEvents } from "../../features/organizer/eventSlice";

export default function EventHistory() {
  const dispatch = useDispatch();
  const { history , loading, error } = useSelector((state) => state.organizer);
  //const user = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    dispatch(fetchOrganizerEvents());
  }, [dispatch]);

  console.log("Our events:", history);

  const now = Date.now();

  const upcomingEvents = history?.filter((event) => {
    const eventTime = Date.parse(event.start_time);
    return eventTime < now;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
    
      <div className="w-64">
        <OrgSideBar />
      </div>

      <div className="flex-1 bg-white shadow-lg p-6 m-6 rounded-lg flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-black">Upcoming Events</h2>

        {loading ? (
          <p className="text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : !upcomingEvents || upcomingEvents.length === 0 ? (
          <p className="text-gray-600">You have no past events.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                to={`${event.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200 w-54"
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
                  <div className="flex justify-end">
                  <span className="text-sm text-gray-600 mt-1 underline">
                    View details
                  </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
