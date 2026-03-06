import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({ query, language } = {}) => {
    return await apiService.getBooks(query, language);
  }
);

export const fetchBook = createAsyncThunk(
  "books/fetchBook",
  async (id) => {
    return await apiService.getBook(id);
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    items: [],
    currentBook: null,
    loading: false,
    error: null,
    searchQuery: "",
    activeLanguage: "all",
  },
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setActiveLanguage(state, action) {
      state.activeLanguage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.currentBook = action.payload;
      });
  },
});

export const { setSearchQuery, setActiveLanguage } = booksSlice.actions;
export default booksSlice.reducer;
