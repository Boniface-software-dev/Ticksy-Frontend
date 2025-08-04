import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganizerEvents } from "../../features/organizer/eventSlice";
import OrgSideBar from "../../components/OrgSideBar";
import axios from "../../utils/axiosInstance";
import { showToast } from "../../features/organizer/uiSlice";

export default function RejectedEvents() {
  const dispatch = useDispatch();
  const { rejectedEvents, loading, error } = useSelector((state) => state.organizer);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);


  useEffect(() => {
    dispatch(fetchOrganizerEvents());
  }, [dispatch]);

  const handleEventClick = (event) => {
    const [startDate, startTime] = event.start_time.split("T");
    const [endDate, endTime] = event.end_time.split("T");
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      start_date: startDate,
      start_time: startTime?.slice(0, 5) || "",
      end_date: endDate,
      end_time: endTime?.slice(0, 5) || "",
      category: event.category,
      tags: event.tags,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const startTimeISO = new Date(`${formData.start_date}T${formData.start_time}`).toISOString();
  const endTimeISO = new Date(`${formData.end_date}T${formData.end_time}`).toISOString();

  // Use FormData for multipart upload
  const multipartData = new FormData();
  multipartData.append("title", formData.title);
  multipartData.append("description", formData.description);
  multipartData.append("location", formData.location);
  multipartData.append("category", formData.category);
  multipartData.append("tags", formData.tags);
  multipartData.append("start_time", startTimeISO);
  multipartData.append("end_time", endTimeISO);

  if (imageFile) {
    multipartData.append("image", imageFile);
  }

  try {
    const token = localStorage.getItem("token");

    await axios.put(`/events/${selectedEvent.id}`, multipartData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch(showToast({ type: "success", message: "Event updated successfully!" }));
    setIsModalOpen(false);
    dispatch(fetchOrganizerEvents());
  } catch (error) {
    console.error("Error updating event:", error);
    dispatch(showToast({ type: "error", message: "Failed to update event." }));
  }
};


  const handleImageDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    setImageFile(file);
  }
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    setImageFile(file);
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64">
        <OrgSideBar />
      </div>

      <div className="flex-1 bg-white shadow-lg p-6 m-6 rounded-lg flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-black">Rejected Events</h2>

        {loading ? (
          <p className="text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : !rejectedEvents || rejectedEvents.length === 0 ? (
          <p className="text-gray-600">You have no rejected events.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rejectedEvents.map((event) => (
              <div
                key={event.id}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200 w-75 cursor-pointer"
                onClick={() => handleEventClick(event)}
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
                    <p>Location: {event.location}</p>
                    <p>Start time: {new Date(event.start_time).toLocaleString()}</p>
                    <p>End time: {new Date(event.end_time).toLocaleString()}</p>
                    <p>Category: {event.category}</p>
                    <p>Tags: {event.tags}</p>
                    <p>Description: {event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-40 z-50 flex items-center justify-center text-black">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4">Edit Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Title"
                required
              />
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Description"
              />
              <input
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Location"
              />

              {/* Date and Time Split */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <select
  name="category"
  required
  value={formData.category || ""}
  onChange={handleChange}
  className="w-full border px-3 py-2 rounded bg-white text-gray-600"
>
  <option value="">Select a category</option>
  <option value="Music & Entertainment">Music & Entertainment</option>
  <option value="Conferences & Seminars">Conferences & Seminars</option>
  <option value="Food & Drink">Food & Drink</option>
  <option value="Business & Networking">Business & Networking</option>
  <option value="Charity & Community">Charity & Community</option>
  <option value="Arts & Culture">Arts & Culture</option>
  <option value="Sports & Fitness">Sports & Fitness</option>
</select>
              <input
                name="tags"
                value={formData.tags || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Tags (comma-separated)"
              />
              {/* Image Upload */}
              <div
  onDrop={handleImageDrop}
  onDragOver={(e) => e.preventDefault()}
  className="w-full p-4 border-2 border-dashed rounded text-center text-gray-500 cursor-pointer"
>
  <p>Drag & drop image here, or click to select</p>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
    id="fileUpload"
  />
  <label htmlFor="fileUpload" className="block mt-2 text-blue-500 underline cursor-pointer">
    Browse files
  </label>
  {imageFile && <p className="mt-2 text-sm text-green-600">Selected: {imageFile.name}</p>}
</div>



              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}