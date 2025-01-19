import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { StyledTypography } from "..";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import { useManageQueueMutation } from "../../../redux/features/appBaseApi/appBaseApiSlice";
import { getSendOtpPayload } from "../../../utils/appPayload";
import { socket } from "../../../Main";
import envConfig from "../../../configs/envConfig";
import { useAppDispatch } from "../../../redux/store";
import { setApplicatonOtp } from "../../../redux/features/application/applicationApiSlice";
import { setStopAutomation } from "../../../redux/features/automation/automationSlice";

const SendOtp = ({ data, otpRef, applications, index }) => {
  const [message, setMessage] = useState({
    message: "",
    type: "",
  });
  const phone = data?.info?.[0]?.phone;
  const [manageQueue, { isLoading }] = useManageQueueMutation();
  const dispatch = useAppDispatch();

  const handleSendOtp = async () => {
    dispatch(setStopAutomation({ apiCallRunning: true, otpSend: false }));
    if (!isLoading) {
      const payload = getSendOtpPayload(data);
      const result = await handleMultipleApiCall(
        manageQueue,
        payload,
        setMessage
      );
      if (result?.code === 200) {
        dispatch(
          setApplicatonOtp({
            otp: "",
            phone,
            resend: data?.resend ? data?.resend + 1 : 1,
          })
        );
        socket.emit("otp-send", { phone, isTesting: envConfig?.isTesting });
        dispatch(setStopAutomation({ apiCallRunning: false, otpSend: true }));
      } else {
        if (index === applications.length - 1) {
          dispatch(
            setStopAutomation({ apiCallRunning: false, otpSend: false })
          );
        }
      }
    }
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
      <StyledTypography>Send to - {phone}</StyledTypography>
      <Button
        ref={otpRef}
        disabled={isLoading}
        onClick={handleSendOtp}
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
