import { createSlice } from "@reduxjs/toolkit";

const automationSlice = createSlice({
  name: "automation",
  initialState: {
    isAutomationOn: localStorage.getItem("isAutomationOn")
      ? JSON.parse(localStorage.getItem("isAutomationOn"))
      : false,
    lastUpdate: localStorage.getItem("lastUpdate")
      ? JSON.parse(localStorage.getItem("lastUpdate"))
      : null,
    hitNow: false,
    apiCallRunning: false,
    otpSend: false,
  },

  reducers: {
    setStartAutomation: (state, action) => {
      state.isAutomationOn = action.payload;
      localStorage.setItem("isAutomationOn", action.payload ?? false);
      return state;
    },

    setLastUpdate: (state, action) => {
      state.hitNow = action?.payload?.hitNow;
      if (action?.payload?.lastUpdate) {
        state.lastUpdate = action?.payload?.lastUpdate;
        localStorage.setItem(
          "lastUpdate",
          JSON.stringify(action?.payload?.lastUpdate)
        );
      }
      return state;
    },

    setStopAutomation: (state, action) => {
      state.apiCallRunning = action?.payload?.apiCallRunning;
      state.otpSend = action?.payload?.otpSend;
      return state;
    },
  },
});

export const { setStartAutomation, setLastUpdate, setStopAutomation } =
  automationSlice.actions;
export default automationSlice.reducer;
