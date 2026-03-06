import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async () => {
    return await apiService.getEvents();
  }
);

export const fetchEvent = createAsyncThunk(
  "events/fetchEvent",
  async (id) => {
    return await apiService.getEvent(id);
  }
);

export const submitEvent = createAsyncThunk(
  "events/submitEvent",
  async (data) => {
    return await apiService.submitEvent(data);
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    items: [],
    currentEvent: null,
    loading: false,
    error: null,
    submitStatus: null,
  },
  reducers: {
    clearSubmitStatus(state) {
      state.submitStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })
      .addCase(submitEvent.pending, (state) => {
        state.submitStatus = "pending";
      })
      .addCase(submitEvent.fulfilled, (state) => {
        state.submitStatus = "success";
      })
      .addCase(submitEvent.rejected, (state) => {
        state.submitStatus = "error";
      });
  },
});

export const { clearSubmitStatus } = eventsSlice.actions;
export default eventsSlice.reducer;
