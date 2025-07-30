import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  
  modals: {
    showCreateEventModal: false,
    showTicketForm: false,
    showDeleteConfirm: false,
  },

  activeEventTabs: {}, 

  toast: {
    show: false,
    type: "success", 
    message: "",
  },

  
  sortOptions: {
    upcoming: "latest",  
    history: "oldest",
    reviews: "newest",
  },

  filterOptions: {
    reviews: null, 
  },

  
  loading: {
    checkinTab: false,
    attendeesTab: false,
    reviewsTab: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    
    setModalState: (state, action) => {
      const { modal, value } = action.payload;
      if (modal in state.modals) {
        state.modals[modal] = value;
      }
    },

    setActiveEventTab: (state, action) => {
      const { eventId, tab } = action.payload;
      state.activeEventTabs[eventId] = tab;
    },

    showToast: (state, action) => {
      const { type, message } = action.payload;
      state.toast = {
        show: true,
        type,
        message,
      };
    },

    hideToast: (state) => {
      state.toast.show = false;
      state.toast.message = "";
    },

    setSortOption: (state, action) => {
      const { section, value } = action.payload;
      state.sortOptions[section] = value;
    },

    setFilterOption: (state, action) => {
      const { section, value } = action.payload;
      state.filterOptions[section] = value;
    },

    setLoadingState: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
  },
});

export const {
  setModalState,
  setActiveEventTab,
  showToast,
  hideToast,
  setSortOption,
  setFilterOption,
  setLoadingState,
} = uiSlice.actions;

export default uiSlice.reducer;
