import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiService.login(credentials);
      localStorage.setItem("bm_token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await apiService.register(formData);
      localStorage.setItem("bm_token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.getProfile();
    } catch (err) {
      localStorage.removeItem("bm_token");
      return rejectWithValue(err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      return await apiService.updateProfile(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      return await apiService.changePassword(currentPassword, newPassword);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await apiService.forgotPassword(email);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      return await apiService.resetPassword(token, newPassword);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

function loadInitialState() {
  const token = localStorage.getItem("bm_token");
  return {
    user: null,
    token: token || null,
    loading: false,
    error: null,
    isAuthenticated: false,
    profileLoading: false,
    profileError: null,
    profileSuccess: false,
    passwordSuccess: false,
    forgotPasswordSuccess: false,
    resetPasswordSuccess: false,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("bm_token");
    },
    clearAuthError(state) {
      state.error = null;
      state.profileError = null;
    },
    clearProfileSuccess(state) {
      state.profileSuccess = false;
      state.passwordSuccess = false;
    },
    clearForgotPasswordSuccess(state) {
      state.forgotPasswordSuccess = false;
    },
    clearResetPasswordSuccess(state) {
      state.resetPasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
        state.profileSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.profileSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
        state.passwordSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.profileLoading = false;
        state.passwordSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, clearProfileSuccess, clearForgotPasswordSuccess, clearResetPasswordSuccess } = authSlice.actions;
export default authSlice.reducer;
