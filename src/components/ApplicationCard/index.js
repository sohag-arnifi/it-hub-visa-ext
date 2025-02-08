import { Box, Paper } from "@mui/material";
import React from "react";
import Header from "./Header";
import LoginContainer from "./LoginContainer";
import InfoSession from "./InfoSession";
import PayOtp from "./PayOtp";
import Booking from "./Booking";

const data = {
  _id: "67a66fff1a5375a9a39332c2",
  _token: "",
  resend: 0,
  center: 2,
  ivac: 21,
  visaType: 13,
  phone: "01750016164",
  password: "password24@",
  info: [
    {
      name: "shohag roy",
      web_id: "BGDRV0070825",
      _id: "67a66fff1a5375a9a39332c3",
    },
  ],
  visit_purpose: "Medical Treatment",
  hash_params: "",
  selected_payment: {
    name: "Bkash",
    slug: "bkash",
    grand_total: 10.2912621,
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
  },
  createdAt: "2025-02-07T20:41:35.330Z",
  slot_dates: ["2025-02-09"],
};

const ApplicationCard = () => {
  return (
    <Box sx={{ paddingY: "5px" }}>
      <Paper
        variant="outlined"
        sx={{
          padding: "10px",
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Header data={data} />
        <LoginContainer data={data} />
        <InfoSession data={data} />
        <PayOtp data={data} />
        <Booking data={data} />
      </Paper>
    </Box>
  );
};

export default ApplicationCard;
