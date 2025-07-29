import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AttendeeNavBar from "../components/AttendeeNavBar";
import { FiSearch, FiMapPin, FiCalendar, FiTag } from "react-icons/fi";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    tag: ""
  });

  // Extract unique values for filters
  const locations = [...new Set(events.map(event => event.location))];
  const categories = [...new Set(events.map(event => event.category).filter(Boolean))];
  const tags = [...new Set(events.flatMap(event => 
    event.tags ? event.tags.split(',').map(tag => tag.trim()) : []
  ))].filter(Boolean);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Apply filters whenever search or filters change
  useEffect(() => {
    let results = events.filter(event => {
      // Search term filter
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Location filter
      const matchesLocation = 
        !filters.location || event.location === filters.location;
      
      // Category filter
      const matchesCategory = 
        !filters.category || event.category === filters.category;
      
      // Tag filter
      const matchesTag = 
        !filters.tag || 
        (event.tags && event.tags.split(',').map(t => t.trim()).includes(filters.tag));
      
      return matchesSearch && matchesLocation && matchesCategory && matchesTag;
    });
    
    setFilteredEvents(results);
  }, [searchTerm, filters, events]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading events...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AttendeeNavBar />
      
      {/* Header */}
      <div className="bg-[#9747FF] py-12 px-4">
        <h1 className="text-4xl font-bold text-center text-white">Upcoming Events</h1>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
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

            {/* Location Filter */}
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

            {/* Category Filter */}
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

            {/* Tag Filter */}
            <select
              name="tag"
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
              value={filters.tag}
              onChange={handleFilterChange}
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-700">
          Showing {filteredEvents.length} of {events.length} events
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((event) => (
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
                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h2>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FiMapPin className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FiCalendar className="mr-2" />
                      <span>{new Date(event.start_time).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
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
                    
                    <button className="w-full bg-[#9747FF] hover:bg-[#8747EE] text-white py-2 rounded-lg transition-colors duration-300">
                      View Details
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No events found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsList;