import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledTypography } from "..";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import { useManageQueueMutation } from "../../../redux/features/appBaseApi/appBaseApiSlice";
import { getSendOtpPayload } from "../../../utils/appPayload";
import { socket } from "../../../Main";
import envConfig from "../../../configs/envConfig";

const SendOtp = ({ data, otpRef }) => {
  const [message, setMessage] = useState({
    message: "",
    type: "",
  });
  const phone = data?.info?.[0]?.phone;
  const [manageQueue, { isLoading }] = useManageQueueMutation();

  const handleSendOtp = async (signal) => {
    const payload = getSendOtpPayload(data);
    const result = await handleMultipleApiCall(
      manageQueue,
      payload,
      setMessage,
      signal
    );

    if (result?.code === 200) {
      socket.emit("otp-send", { phone, isTesting: envConfig?.isTesting });
    }
  };

  useEffect(() => {
    if (otpRef) {
      otpRef.current = handleSendOtp;
    }
  }, [otpRef]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <StyledTypography>Send to - {phone}</StyledTypography>
      <Button
        disabled={isLoading}
        onClick={() => handleSendOtp()}
        variant="contained"
        color="error"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "10px",
          boxShadow: "none",
        }}
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>

      <Typography
        sx={{
          fontSize: "12px",
          color: message?.type === "success" ? "green" : "red",
        }}
      >
        {message?.message}
      </Typography>
    </Box>
  );
};

export default SendOtp;
