import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
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
  setHashParams,
  setPaymentUrl,
  setSlotTimes,
} from "../../../redux/features/application/applicationApiSlice";
import { socket } from "../../../Main";
import {
  useGetCaptchaTokenMutation,
  useUpdatePaymentStatusMutation,
} from "../../../redux/features/application/applicationApi";
import envConfig from "../../../configs/envConfig";

const DateTime = ({ data }) => {
  const specific_date = data?.slot_dates?.length
    ? data?.slot_dates[0] ?? "Not Available"
    : "Not Available"; // "2024-12-31";

  const user = useAppSelector((state) => state?.auth?.user);

  const timeSlot = data?.slot_times?.length
    ? data?.slot_times[0] ?? "Not Available"
    : "Not Available";
  const [has_params, setHasParams] = useState(data?.hash_params?.token ?? "");

  const timeSlotabortControllerRef = useRef(null);
  const payInvoiceAbortControllerRef = useRef(null);

  const dispatch = useAppDispatch();
  const phone = data?.info?.[0]?.phone;

  const [getCaptchaToken] = useGetCaptchaTokenMutation();
  const handleCaptchaToken = async () => {
    await getCaptchaToken({ phone, userId: user?._id });
  };

  const [message, setMessage] = useState({
    message: "",
    type: "",
  });

  const [generateSlotTime, { isLoading }] = useGenerateSlotTimeMutation();
  const [payInvoice, { isLoading: isPayLoading }] = usePayInvoiceMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  const handleGenerateSlotTime = async () => {
    const controller = new AbortController();
    timeSlotabortControllerRef.current = controller;

    const currentApplication = data?.info?.[0];
    const payload = getSlotPayload(data, specific_date);
    const result = await handleMultipleApiCall(
      generateSlotTime,
      payload,
      setMessage,
      controller.signal,
      1000
    );
    if (result.status === "OK") {
      if (result?.slot_times?.length) {
        const data = {
          center: currentApplication?.center?.id,
          ivac: currentApplication?.ivac?.id,
          visa_type: currentApplication?.visa_type?.id,
          slot_times: result?.slot_times,
        };
        socket.emit("sendSlotTime", data);
      }
      // if (result?.slot_times?.length) {
      //   dispatch(setSlotTimes({ slotTimes: result?.slot_times, phone }));
      // } else {
      //   const availableSlot = applications?.find((application) => {
      //     const availableInfo = application?.info[0];
      //     if (
      //       availableInfo?.center?.id === currentApplication?.center?.id &&
      //       availableInfo?.ivac?.id === currentApplication?.ivac?.id &&
      //       availableInfo?.visa_type?.id ===
      //         currentApplication?.visa_type?.id &&
      //       availableInfo?.slot_times?.length
      //     ) {
      //       return true;
      //     } else {
      //       false;
      //     }
      //   });
      //   dispatch(setSlotTimes({ slotTimes: availableSlot?.slot_times, phone }));
      // }
    }
  };

  const handlePayInvoice = async () => {
    const controller = new AbortController();
    payInvoiceAbortControllerRef.current = controller;
    const payload = getPayInvoicePayload({
      ...data,
      hash_params: data?.hash_params?.token,
    });
    const result = await handleMultipleApiCall(
      payInvoice,
      payload,
      setMessage,
      controller.signal,
      1000
    );
    console.log(result);

    if (result?.url) {
      dispatch(
        setPaymentUrl({
          url: result?.url + data?.selected_payment?.slug,
          phone,
        })
      );

      const successPayload = {
        resend: data?.resend ?? 0,
        otp: data?.otp,
        slot_dates: data?.slot_dates,
        slot_time: payload?.selected_slot,
        paymentStatus: {
          ...result,
          url: result?.url + data?.selected_payment?.slug,
        },
      };

      if (!envConfig?.isTesting) {
        await updatePaymentStatus({ phone, data: successPayload });
      }
    } else {
      dispatch(
        setHashParams({
          hash_params: {
            token: "",
            message: "Captcha not solved",
          },
          phone,
        })
      );
    }
  };

  const payInvoiceAbortHandlar = () => {
    if (payInvoiceAbortControllerRef.current) {
      payInvoiceAbortControllerRef.current.abort();
      payInvoiceAbortControllerRef.current = null;
      console.log("API call aborted");
    }
  };

  useEffect(() => {
    if (
      specific_date !== "Not Available" &&
      timeSlot !== "Not Available" &&
      data?.hash_params?.token &&
      !data?.paymentUrl
    ) {
      handlePayInvoice();
    } else if (
      specific_date !== "Not Available" &&
      timeSlot === "Not Available" &&
      data?.otp &&
      !data?.paymentUrl
    ) {
      handleGenerateSlotTime();
    }
  }, [specific_date, timeSlot, data]);

  useEffect(() => {
    socket.on("captcha-solved", (data) => {
      if (phone === data?.phone) {
        dispatch(
          setHashParams({
            hash_params: {
              token: data?.token,
              message: "Solved",
            },
            phone,
          })
        );
        setHasParams(data?.token);
      }
    });

    socket.on("captcha-received", (data) => {
      if (user?._id === data?.userId && phone === data?.phone) {
        dispatch(
          setHashParams({
            hash_params: {
              token: data?.token,
              message: "Captcha solved",
            },
            phone,
          })
        );
        setHasParams(data?.token);
      }
    });

    return () => {
      socket.off("captcha-solved");
      socket.off("captcha-received");
    };
  }, []);

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
        Slot Date:{" "}
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
        Slot Time:{" "}
        <span style={{ color: "blue" }}>
          {isLoading
            ? "Getting..."
            : timeSlot?.id
            ? `${timeSlot?.time_display} - ${timeSlot?.availableSlot}`
            : "Not Available" || "Not Available"}
        </span>
      </StyledTypography>

      {data?.hash_params?.message && (
        <StyledTypography
          onClick={handleCaptchaToken}
          sx={{
            lineHeight: "10px",
            color: data?.hash_params?.token ? "green" : "red",
          }}
        >
          {data?.hash_params?.message}
        </StyledTypography>
      )}

      <Box display={"flex"} gap={"5px"}>
        <Button
          disabled={
            specific_date === "Not Available" ||
            timeSlot === "Not Available" ||
            !data?.hash_params?.token ||
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
        <Button
          disabled={!payInvoiceAbortControllerRef?.current}
          onClick={payInvoiceAbortHandlar}
          variant="contained"
          color="error"
          size="small"
          sx={{
            textTransform: "none",
            fontSize: "10px",
            boxShadow: "none",
          }}
        >
          Force Stop
        </Button>
      </Box>
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
