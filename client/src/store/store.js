import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./slices/booksSlice";
import eventsReducer from "./slices/eventsSlice";
import blogReducer from "./slices/blogSlice";
import mediaReducer from "./slices/mediaSlice";
import authReducer from "./slices/authSlice";
import formsReducer from "./slices/formsSlice";
import searchReducer from "./slices/searchSlice";

const store = configureStore({
  reducer: {
    books: booksReducer,
    events: eventsReducer,
    blog: blogReducer,
    media: mediaReducer,
    auth: authReducer,
    forms: formsReducer,
    search: searchReducer,
  },
});

export default store;
