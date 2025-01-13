import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { StyledTypography } from "..";

const PayNow = ({ data }) => {
  const payNowHandler = () => {
    window.open(data?.paymentUrl, "_blank");
  };

  const paymentLinkCopyHandler = () => {
    navigator.clipboard.writeText(data?.paymentUrl);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <StyledTypography>
        Payment Methode <span>BKASH</span>
      </StyledTypography>
      <Box sx={{ display: "flex", gap: "5px" }}>
        <Button
          onClick={payNowHandler}
          disabled={!data?.paymentUrl}
          variant="contained"
          color="success"
          size="small"
          sx={{
            textTransform: "none",
            fontSize: "10px",
            boxShadow: "none",
          }}
        >
          Pay Now
        </Button>

        <Button
          onClick={paymentLinkCopyHandler}
          disabled={!data?.paymentUrl}
          variant="contained"
          color="error"
          size="small"
          sx={{
            textTransform: "none",
            fontSize: "10px",
            boxShadow: "none",
          }}
        >
          Copy Link
        </Button>
      </Box>
      <Typography
        sx={{
          fontSize: "10px",
          color: "green",
        }}
      >
        {data?.paymentUrl ? "Payment Link Available" : ""}
      </Typography>
    </Box>
  );
};

export default PayNow;
