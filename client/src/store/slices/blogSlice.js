import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const fetchBlogPosts = createAsyncThunk(
  "blog/fetchPosts",
  async () => {
    return await apiService.getBlogPosts();
  }
);

export const fetchBlogPost = createAsyncThunk(
  "blog/fetchPost",
  async (slug) => {
    return await apiService.getBlogPost(slug);
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBlogPost.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      });
  },
});

export default blogSlice.reducer;
