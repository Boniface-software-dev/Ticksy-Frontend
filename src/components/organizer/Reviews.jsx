import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, setRatingFilter } from "../../features/organizer/reviewSlice";
import { setFilterOption } from "../../features/organizer/uiSlice";
import { FaStar } from "react-icons/fa";

function ReviewTab({ eventId }) {
  const dispatch = useDispatch();

  const reviews = useSelector((state) => state.reviews.sortedFilteredReviews[eventId] || []);
  const filterRating = useSelector((state) => state.reviews.ratingFilter[eventId]);
  const isLoading = useSelector((state) => state.reviews.fetchStatus) === "loading";
  console.log("Reviews:", reviews);
  useEffect(() => {
    dispatch(fetchReviews(eventId));
  }, [dispatch, eventId]);

  const handleFilterClick = (rating) => {
    if (filterRating === rating) {
      dispatch(setFilterOption({ section: "reviews", value: null }));
      dispatch(setRatingFilter({ eventId, rating: null }));
    } else {
      dispatch(setFilterOption({ section: "reviews", value: rating }));
      dispatch(setRatingFilter({ eventId, rating }));
    }
  };

  const getInitials = (review) => {
    const first = review.attendee?.first_name?.[0] || "";
    const last = review.attendee?.last_name?.[0] || "";
    return (first + last).toUpperCase();
   };

  return (
    <div className="p-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 text-black">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleFilterClick(star)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm 
              ${filterRating === star ? "bg-purple-300 text-white border-purple-300" : "border-gray-300 hover:bg-gray-100"}`}
          >
            <span>{star}</span>
            <FaStar className="text-purple-500" />
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews to display.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-lg border border-purple-500 p-4 flex gap-4">
              {/* Initials avatar */}
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold text-sm">
                {getInitials(review || "Anonymous User")}
              </div>

              <div className="flex-1">
                {/* Star rating */}
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 mr-0.5 ${
                        i < review.rating ? "text-purple-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Review content */}
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll placeholder */}
      {/* Add intersection observer or scroll tracking here if needed */}
    </div>
  );
}

export default ReviewTab;