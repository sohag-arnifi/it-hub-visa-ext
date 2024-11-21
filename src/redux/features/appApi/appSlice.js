import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  csrfToken: "csrfToken",
  userSlugData: [],
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setCsrfToken: (state, { payload }) => {
      state.csrfToken = payload;
    },
    setUserSlugData: (state, { payload }) => {
      state.userSlugData = payload;
      state.visaFiles = payload?.visaFiles?.map((item) => item) ?? [];
    },
  },
});

export const { setCsrfToken, setUserSlugData } = appSlice.actions;
export default appSlice.reducer;
