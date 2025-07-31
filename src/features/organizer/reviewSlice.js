import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";


export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (eventId, thunkAPI) => {
    try {
      const data = await (await axios.get(`/events/${eventId}/reviews`)).data;
      return { eventId, reviews: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const initialState = {
  reviewsByEvent: {},           
  sortedFilteredReviews: {},    
  ratingFilter: {},             
  sortOrder: {},                

  fetchStatus: "idle",
  error: null,
};


const applySortAndFilter = (reviews, rating, sort) => {
  let result = [...reviews];

  if (rating) {
    result = result.filter((r) => r.rating === rating);
  }

  switch (sort) {
    case "oldest":
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case "rating-desc":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "rating-asc":
      result.sort((a, b) => a.rating - b.rating);
      break;
    default: // "latest"
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return result;
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setRatingFilter: (state, action) => {
      const { eventId, rating } = action.payload;
      state.ratingFilter[eventId] = rating;

      const raw = state.reviewsByEvent[eventId] || [];
      const sort = state.sortOrder[eventId] || "latest";
      state.sortedFilteredReviews[eventId] = applySortAndFilter(raw, rating, sort);
    },

    setSortOrder: (state, action) => {
      const { eventId, sort } = action.payload;
      state.sortOrder[eventId] = sort;

      const raw = state.reviewsByEvent[eventId] || [];
      const rating = state.ratingFilter[eventId] || null;
      state.sortedFilteredReviews[eventId] = applySortAndFilter(raw, rating, sort);
    },

    clearReviews: (state) => {
      state.reviewsByEvent = {};
      state.sortedFilteredReviews = {};
      state.ratingFilter = {};
      state.sortOrder = {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        const { eventId, reviews } = action.payload;

        state.fetchStatus = "succeeded";
        state.reviewsByEvent[eventId] = reviews;
        state.ratingFilter[eventId] = null;
        state.sortOrder[eventId] = "latest";
        state.sortedFilteredReviews[eventId] = applySortAndFilter(reviews, null, "latest");
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setRatingFilter, setSortOrder, clearReviews } = reviewSlice.actions;

export default reviewSlice.reducer;
