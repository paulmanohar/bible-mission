import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApiService } from "../../services/api";

export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await adminApiService.adminLogin(username, password);
      localStorage.setItem("bm_admin_token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminBooks = createAsyncThunk(
  "admin/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApiService.adminGetBooks();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminEvents = createAsyncThunk(
  "admin/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApiService.adminGetEvents();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminBlogPosts = createAsyncThunk(
  "admin/fetchBlogPosts",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApiService.adminGetBlogPosts();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminPodcasts = createAsyncThunk(
  "admin/fetchPodcasts",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApiService.adminGetPodcasts();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminLivestreams = createAsyncThunk(
  "admin/fetchLivestreams",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApiService.adminGetLivestreams();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

function loadInitialState() {
  const token = localStorage.getItem("bm_admin_token");
  return {
    user: null,
    token: token || null,
    isAuthenticated: false,
    items: {
      books: [],
      events: [],
      blogPosts: [],
      podcasts: [],
      livestreams: [],
    },
    loading: false,
    error: null,
  };
}

const adminSlice = createSlice({
  name: "admin",
  initialState: loadInitialState(),
  reducers: {
    adminLogout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.items = { books: [], events: [], blogPosts: [], podcasts: [], livestreams: [] };
      localStorage.removeItem("bm_admin_token");
    },
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items.books = action.payload;
      })
      .addCase(fetchAdminBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items.events = action.payload;
      })
      .addCase(fetchAdminEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items.blogPosts = action.payload;
      })
      .addCase(fetchAdminBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminPodcasts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPodcasts.fulfilled, (state, action) => {
        state.loading = false;
        state.items.podcasts = action.payload;
      })
      .addCase(fetchAdminPodcasts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminLivestreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminLivestreams.fulfilled, (state, action) => {
        state.loading = false;
        state.items.livestreams = action.payload;
      })
      .addCase(fetchAdminLivestreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
