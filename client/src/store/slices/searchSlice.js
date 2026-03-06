import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const performSearch = createAsyncThunk(
  "search/performSearch",
  async (params) => {
    return await apiService.globalSearch(params);
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    total: 0,
    facets: {
      types: {},
      categories: {},
      authors: {},
      tags: {},
    },
    activeFilters: {
      types: [],
      categories: [],
      tags: [],
      author: "",
    },
    sortBy: "relevant",
    page: 1,
    loading: false,
    error: null,
    hasSearched: false,
  },
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    setActiveTypes(state, action) {
      state.activeFilters.types = action.payload;
      state.page = 1;
    },
    toggleType(state, action) {
      const type = action.payload;
      const idx = state.activeFilters.types.indexOf(type);
      if (idx >= 0) {
        state.activeFilters.types.splice(idx, 1);
      } else {
        state.activeFilters.types.push(type);
      }
      state.page = 1;
    },
    toggleCategory(state, action) {
      const cat = action.payload;
      const idx = state.activeFilters.categories.indexOf(cat);
      if (idx >= 0) {
        state.activeFilters.categories.splice(idx, 1);
      } else {
        state.activeFilters.categories.push(cat);
      }
      state.page = 1;
    },
    toggleTag(state, action) {
      const tag = action.payload;
      const idx = state.activeFilters.tags.indexOf(tag);
      if (idx >= 0) {
        state.activeFilters.tags.splice(idx, 1);
      } else {
        state.activeFilters.tags.push(tag);
      }
      state.page = 1;
    },
    setAuthorFilter(state, action) {
      state.activeFilters.author = action.payload;
      state.page = 1;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    clearAllFilters(state) {
      state.activeFilters = { types: [], categories: [], tags: [], author: "" };
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.total = action.payload.total;
        state.facets = action.payload.facets;
        state.hasSearched = true;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSearchQuery,
  setActiveTypes,
  toggleType,
  toggleCategory,
  toggleTag,
  setAuthorFilter,
  setSortBy,
  setPage,
  clearAllFilters,
} = searchSlice.actions;

export default searchSlice.reducer;
