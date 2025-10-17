import { createSlice } from "@reduxjs/toolkit";

export const sideBarSlice = createSlice({
  name: "sideBar",
  initialState: {
    isOpen: true,
  },
  reducers: {
    toggleSideBar: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeSideBar: (state) => {
      state.isOpen = false;
    },
    openSideBar: (state) => {
      state.isOpen = true;
    },
  },
});

export const { toggleSideBar, closeSideBar, openSideBar } =
  sideBarSlice.actions;
export default sideBarSlice.reducer;
