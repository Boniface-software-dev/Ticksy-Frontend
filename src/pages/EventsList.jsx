import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiCalendar, FiTag } from "react-icons/fi";
import { useSelector } from "react-redux";
import AttendeeNavBar from "../components/AttendeeNavBar";
import GuestNavBar from "../components/GuestNavbar";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    category: ""
  });

  const currentUser = useSelector((state) => state.auth.currentUser);

  const locations = [...new Set(events.map(event => event.location))];
  const categories = [...new Set(events.map(event => event.category).filter(Boolean))];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        !filters.location || event.location === filters.location;

      const matchesCategory =
        !filters.category || event.category === filters.category;

      return matchesSearch && matchesLocation && matchesCategory;
    });

    setFilteredEvents(filtered);
  }, [searchTerm, filters, events]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser ? <AttendeeNavBar /> : <GuestNavBar />}

      {/* HERO SECTION */}
      <header className="w-full px-6 border-b bg-[#F5F0FF] pt-24">
  <div className="max-w-7xl mx-auto text-center py-12 flex flex-col items-center gap-y-4">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
      Find Your Next Experience
    </h1>
    <p className="text-base md:text-lg text-gray-700 max-w-2xl">
      Discover unforgettable events that match your interests
    </p>
  </div>
</header>


      {/* MAIN SECTION */}
      <main className="w-full px-6 py-10">
        {/* FILTER BAR */}
<section className="bg-white rounded-2xl shadow-md p-6 mb-10 max-w-7xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Search Input */}
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search events..."
        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Location Select */}
    <select
      name="location"
      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
      value={filters.location}
      onChange={handleFilterChange}
    >
      <option value="">All Locations</option>
      {locations.map(location => (
        <option key={location} value={location}>{location}</option>
      ))}
    </select>

    {/* Category Select */}
    <select
      name="category"
      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
      value={filters.category}
      onChange={handleFilterChange}
    >
      <option value="">All Categories</option>
      {categories.map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>

    {/* Tag Text Input */}
    <input
      type="text"
      name="tag"
      placeholder="Search by tag..."
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
      value={filters.tag}
      onChange={handleFilterChange}
    />
  </div>
</section>


        {/* COUNT */}
        <div className="max-w-7xl mx-auto mb-6 text-sm text-gray-600">
          Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events
        </div>

        {/* EVENT GRID */}
        <div className="max-w-7xl mx-auto">
          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/events/${event.id}`} className="block h-full">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                        {event.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FiMapPin className="mr-2" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <FiCalendar className="mr-2" />
                        <span>
                          {new Date(event.start_time).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>

                      {event.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {event.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center"
                            >
                              <FiTag className="mr-1" size={12} />
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <button className="w-full bg-[#9747FF] hover:bg-[#8038D0] text-white py-2 rounded-lg transition-colors duration-300">
                        View Details
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <h3 className="text-xl font-semibold">No events found</h3>
              <p className="mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EventsList;
