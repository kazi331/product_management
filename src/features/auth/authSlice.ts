import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token:
      typeof window !== "undefined" ? localStorage.getItem("pm_token") : null,
  },
  reducers: {
    login: (state, { payload }) => {
      state.token = payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("pm_token", payload);
      }
    },
    logout: (state) => {
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("pm_token");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
