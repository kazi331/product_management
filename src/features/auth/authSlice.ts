import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    token:
      typeof window !== "undefined" ? localStorage.getItem("pm_token") : null,
  },
  reducers: {
    login: (state, { payload }) => {
      state.isAuthenticated = true;
      state.token = payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("pm_token", payload);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("pm_token");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
