import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const submitPrayerRequest = createAsyncThunk(
  "forms/submitPrayerRequest",
  async (data, { rejectWithValue }) => {
    try {
      return await apiService.submitPrayerRequest(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitPastorApplication = createAsyncThunk(
  "forms/submitPastorApplication",
  async (data, { rejectWithValue }) => {
    try {
      return await apiService.submitPastorApplication(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitContactMessage = createAsyncThunk(
  "forms/submitContactMessage",
  async (data, { rejectWithValue }) => {
    try {
      return await apiService.submitContactMessage(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const subscribeNewsletter = createAsyncThunk(
  "forms/subscribeNewsletter",
  async (email, { rejectWithValue }) => {
    try {
      return await apiService.subscribeNewsletter(email);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const formsSlice = createSlice({
  name: "forms",
  initialState: {
    prayerRequest: { status: null, error: null },
    pastorApplication: { status: null, error: null },
    contactMessage: { status: null, error: null },
    newsletter: { status: null, error: null },
  },
  reducers: {
    resetFormStatus(state, action) {
      const formName = action.payload;
      if (state[formName]) {
        state[formName].status = null;
        state[formName].error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPrayerRequest.pending, (state) => {
        state.prayerRequest.status = "pending";
        state.prayerRequest.error = null;
      })
      .addCase(submitPrayerRequest.fulfilled, (state) => {
        state.prayerRequest.status = "success";
      })
      .addCase(submitPrayerRequest.rejected, (state, action) => {
        state.prayerRequest.status = "error";
        state.prayerRequest.error = action.payload;
      })
      .addCase(submitPastorApplication.pending, (state) => {
        state.pastorApplication.status = "pending";
        state.pastorApplication.error = null;
      })
      .addCase(submitPastorApplication.fulfilled, (state) => {
        state.pastorApplication.status = "success";
      })
      .addCase(submitPastorApplication.rejected, (state, action) => {
        state.pastorApplication.status = "error";
        state.pastorApplication.error = action.payload;
      })
      .addCase(submitContactMessage.pending, (state) => {
        state.contactMessage.status = "pending";
        state.contactMessage.error = null;
      })
      .addCase(submitContactMessage.fulfilled, (state) => {
        state.contactMessage.status = "success";
      })
      .addCase(submitContactMessage.rejected, (state, action) => {
        state.contactMessage.status = "error";
        state.contactMessage.error = action.payload;
      })
      .addCase(subscribeNewsletter.pending, (state) => {
        state.newsletter.status = "pending";
        state.newsletter.error = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.newsletter.status = "success";
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.newsletter.status = "error";
        state.newsletter.error = action.payload;
      });
  },
});

export const { resetFormStatus } = formsSlice.actions;
export default formsSlice.reducer;
