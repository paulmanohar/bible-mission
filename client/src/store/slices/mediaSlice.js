import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const fetchPodcasts = createAsyncThunk(
  "media/fetchPodcasts",
  async () => {
    return await apiService.getPodcasts();
  }
);

export const fetchLivestreams = createAsyncThunk(
  "media/fetchLivestreams",
  async () => {
    return await apiService.getLivestreams();
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    podcasts: [],
    livestreams: [],
    podcastsLoading: false,
    streamsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPodcasts.pending, (state) => {
        state.podcastsLoading = true;
      })
      .addCase(fetchPodcasts.fulfilled, (state, action) => {
        state.podcastsLoading = false;
        state.podcasts = action.payload;
      })
      .addCase(fetchPodcasts.rejected, (state, action) => {
        state.podcastsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLivestreams.pending, (state) => {
        state.streamsLoading = true;
      })
      .addCase(fetchLivestreams.fulfilled, (state, action) => {
        state.streamsLoading = false;
        state.livestreams = action.payload;
      })
      .addCase(fetchLivestreams.rejected, (state, action) => {
        state.streamsLoading = false;
        state.error = action.error.message;
      });
  },
});

export default mediaSlice.reducer;
