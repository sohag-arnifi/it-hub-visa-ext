import { createSlice } from "@reduxjs/toolkit";

const applicationApiSlice = createSlice({
  name: "applicationApi",
  initialState: [],
  reducers: {
    setApplications: (state, action) => {
      state = action.payload;
      return state;
    },

    setApplicatonOtp: (state, action) => {
      const { otp, phone } = action.payload;

      const index = state.findIndex(
        (application) => application?.info?.[0]?.phone === phone
      );

      const application = state[index];
      const updatedInfo = application.info.map((info) => {
        return {
          ...info,
          otp,
        };
      });

      state[index].info = updatedInfo;
      state[index].otp = otp;
      return state;
    },

    setSlotDates: (state, action) => {
      const { slotDates, phone } = action.payload;
      const index = state.findIndex(
        (application) => application?.info?.[0]?.phone === phone
      );

      const application = state[index];
      const updatedInfo = application.info.map((info) => {
        return {
          ...info,
          slot_dates: slotDates,
        };
      });

      state[index].info = updatedInfo;
      state[index].slot_dates = slotDates;
      return state;
    },

    setSlotTimes: (state, action) => {
      const { slotTimes, phone } = action.payload;
      const index = state.findIndex(
        (application) => application?.info?.[0]?.phone === phone
      );

      const application = state[index];
      const updatedInfo = application.info.map((info) => {
        return {
          ...info,
          slot_times: slotTimes,
        };
      });

      state[index].info = updatedInfo;
      state[index].slot_times = slotTimes;
      return state;
    },

    setPaymentUrl: (state, action) => {
      const { url, phone } = action.payload;
      const index = state.findIndex(
        (application) => application?.info?.[0]?.phone === phone
      );

      state[index].paymentUrl = url;
      return state;
    },
  },
});

export const {
  setApplications,
  setSlotDates,
  setApplicatonOtp,
  setSlotTimes,
  setPaymentUrl,
} = applicationApiSlice.actions;
export default applicationApiSlice.reducer;
