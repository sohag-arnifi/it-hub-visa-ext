import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledTypography } from "..";
import {
  useGenerateSlotTimeMutation,
  usePayInvoiceMutation,
} from "../../../redux/features/appBaseApi/appBaseApiSlice";
import {
  getPayInvoicePayload,
  getSlotPayload,
} from "../../../utils/appPayload";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  setPaymentUrl,
  setSlotTimes,
} from "../../../redux/features/application/applicationApiSlice";
import { socket } from "../../../Main";
import { useGetCaptchaTokenMutation } from "../../../redux/features/application/applicationApi";

const DateTime = ({ data }) => {
  const specific_date = data?.slot_dates?.length
    ? data?.slot_dates[0] ?? "Not Available"
    : "Not Available"; // "2024-12-31";

  const timeSlot = data?.slot_times?.length
    ? data?.slot_times[0] ?? "Not Available"
    : "Not Available";
  const [has_params, setHasParams] = useState("");

  const { applications } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const phone = data?.info?.[0]?.phone;

  const [getCaptchaToken] = useGetCaptchaTokenMutation();
  const handleCaptchaToken = async () => {
    await getCaptchaToken({ phone });
  };

  const [message, setMessage] = useState({
    message: "",
    type: "",
  });

  const [generateSlotTime, { isLoading }] = useGenerateSlotTimeMutation();
  const [payInvoice, { isLoading: isPayLoading }] = usePayInvoiceMutation();

  const handleGenerateSlotTime = async () => {
    const currentApplication = data?.info?.[0];
    const payload = getSlotPayload(data, specific_date);
    const result = await handleMultipleApiCall(
      generateSlotTime,
      payload,
      setMessage
    );
    if (result.status === "OK") {
      if (result?.slot_times?.length) {
        dispatch(setSlotTimes({ slotTimes: result?.slot_times, phone }));
      } else {
        const availableSlot = applications?.find((application) => {
          const availableInfo = application?.info[0];
          if (
            availableInfo?.center?.id === currentApplication?.center?.id &&
            availableInfo?.ivac?.id === currentApplication?.ivac?.id &&
            availableInfo?.visa_type?.id ===
              currentApplication?.visa_type?.id &&
            availableInfo?.slot_times?.length
          ) {
            return true;
          } else {
            false;
          }
        });
        dispatch(setSlotTimes({ slotTimes: availableSlot?.slot_times, phone }));
      }
    }
  };

  const handlePayInvoice = async () => {
    const payload = getPayInvoicePayload({
      ...data,
      hash_params: data?.hash_params,
    });
    const result = await handleMultipleApiCall(payInvoice, payload, setMessage);
    if (result?.data?.url) {
      dispatch(setPaymentUrl({ url: result?.data?.url + "bkash", phone }));
    }
  };

  useEffect(() => {
    if (
      specific_date !== "Not Available" &&
      timeSlot !== "Not Available" &&
      data?.hash_params &&
      data?.hash_params !== "solving" &&
      !data?.paymentUrl
    ) {
      handlePayInvoice();
    } else if (
      specific_date !== "Not Available" &&
      timeSlot === "Not Available" &&
      !data?.paymentUrl
    ) {
      handleGenerateSlotTime();
    }
  }, [specific_date, timeSlot, data]);

  useEffect(() => {
    socket.on("captcha-solved", (data) => {
      if (phone === data?.phone) {
        setHasParams(data?.token);
        console.log("captcha-solved", data?.token);
      }
    });
  }, [socket]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <StyledTypography sx={{ lineHeight: "12px" }}>
        Select Date:{" "}
        <span
          style={{ color: specific_date === "Not Available" ? "red" : "green" }}
        >
          {specific_date}
        </span>
      </StyledTypography>
      <StyledTypography
        sx={{ lineHeight: "12px" }}
        onClick={handleGenerateSlotTime}
      >
        Select Time:{" "}
        <span style={{ color: "blue" }}>
          {isLoading
            ? "Getting..."
            : timeSlot?.id
            ? `${timeSlot?.time_display} - ${timeSlot?.availableSlot}`
            : "Not Available" || "Not Available"}
        </span>
      </StyledTypography>

      {!data?.hash_params ? (
        <StyledTypography
          onClick={handleCaptchaToken}
          sx={{ lineHeight: "10px", color: "red" }}
        >
          Captcha not solved
        </StyledTypography>
      ) : data?.hash_params === "solving" ? (
        <StyledTypography sx={{ lineHeight: "10px", color: "blue" }}>
          Captcha solving...
        </StyledTypography>
      ) : (
        <StyledTypography sx={{ lineHeight: "10px", color: "green" }}>
          Captcha solved
        </StyledTypography>
      )}

      <Button
        disabled={
          specific_date === "Not Available" ||
          timeSlot === "Not Available" ||
          !has_params ||
          isPayLoading
        }
        onClick={handlePayInvoice}
        variant="contained"
        color="error"
        size="small"
        sx={{
          textTransform: "none",
          fontSize: "10px",
          boxShadow: "none",
        }}
      >
        {isPayLoading ? "Booking..." : "Book Now"}
      </Button>
      <Typography
        sx={{
          fontSize: "10px",
          color: message?.type === "error" ? "red" : "green",
        }}
      >
        {message?.message}
      </Typography>
    </Box>
  );
};

export default DateTime;
