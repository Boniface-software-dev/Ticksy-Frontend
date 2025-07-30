import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import axios from "../utils/axiosInstance";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { showToast } from "../features/organizer/uiSlice";
import { useDispatch } from "react-redux";

function OrgSideBar() {
  const user = useSelector((state) => state.auth.currentUser);
  const location = useLocation();
  const dispatch = useDispatch();
  const currentPath = location.pathname;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    category: "",
    tags: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("start_time", formData.start_time);
      data.append("end_time", formData.end_time);
      data.append("category", formData.category);
      data.append("tags", formData.tags);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await axios.post(
        `/events`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(showToast({ type: "success", message: res.data.message }));
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
        category: "",
        tags: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          type: "error",
          message:
            err.response?.data?.message || "Failed to create event.",
        })
      );
    }
  };

  return (
    <div className="h-full w-64 bg-[#f3f3f5] text-gray-600 relative">
      <nav className="h-full flex flex-col">
        <div className="overflow-hidden p-4">
          <Logo />
        </div>

        <div className="flex items-center px-3 py-4">
          <Avatar />
          <div className="ml-3 leading-4">
            <Link
              to={`/organizer/${user?.id}/profile`}
              className="font-semibold block"
            >
              {user?.first_name} {user?.last_name}
            </Link>
            <span className="text-xs text-gray-600 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col px-3 space-y-2 mt-2">
          {[
            {
              path: "dashboard",
              icon: "https://img.icons8.com/external-nawicon-detailed-outline-nawicon/25/1A1A1A/external-stamp-law-and-justice-nawicon-detailed-outline-nawicon.png",
              label: "Upcoming Events",
            },
            {
              path: "pending-events",
              icon: "https://img.icons8.com/pulsar-line/30/1A1A1A/hourglass-sand-bottom.png",
              label: "Pending Events",
            },
            {
              path: "rejected-events",
              icon: "https://img.icons8.com/ios/30/1A1A1A/error.png",
              label: "Rejected Events",
            },
            {
              path: "event-history",
              icon: "https://img.icons8.com/ios/30/1A1A1A/time-machine--v1.png",
              label: "Event History",
            },
          ].map(({ path, icon, label }) => (
            <Link
              key={path}
              to={`/${user?.role}/${user?.id}/${path}`}
              className={`flex items-center space-x-2 p-2 rounded transition ${
                currentPath === `/${user?.role}/${user?.id}/${path}`
                  ? "bg-white text-black shadow text-base"
                  : "hover:bg-gray-100"
              }`}
            >
              <img src={icon} alt={label} width="25" height="25" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Create Event Button */}
        <div className="p-4">
          <button
            className="w-full py-2 px-4 mt-8 bg-purple-500 text-white rounded hover:purple-600 hover:scale-110 transition"
            onClick={() => setShowModal(true)}
          >
            Create New Event
          </button>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-xl relative">
            <h2 className="text-xl font-semibold mb-4 text-purple-500">Create New Event</h2>
            <form className="space-y-4" onSubmit={handleCreateEvent}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="datetime-local"
                name="start_time"
                required
                value={formData.start_time}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="datetime-local"
                name="end_time"
                required
                value={formData.end_time}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
             <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
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
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 hover:scale-90 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-400 text-white rounded hover:bg-purple-600 hover:scale-110 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrgSideBar;
