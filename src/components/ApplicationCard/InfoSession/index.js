import { alpha, Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  useApplicationInfoSubmitMutation,
  useCreateNewSessionMutation,
  useLogOutMutation,
  useOverviewInfoSubmitMutation,
  usePersonalInfoSubmitMutation,
} from "../../../redux/features/appBaseApi/appBaseApiSlice";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import {
  getApplicationInfoSubmitPayload,
  getOverviewInfoSubmitPayload,
  getPersonalInfoSubmitPayload,
} from "../../../utils/appPayload";
import { getLoginInfo, setCSRFToken } from "../../../utils/generateMessage";
import AutoTimer from "./AutoTimer";
import { getPaymentMethod } from "../../../constanse";
import { socket } from "../../../Main";

const InfoSession = ({ data, loggedInUser, otpSendRef, setLoggedInUser }) => {
  const [createNewSession, { isLoading: sessionLoading }] =
    useCreateNewSessionMutation();
  const [paymentOtp, setPaymentOtp] = useState("");

  const [logout, { isLoading: logoutLoading }] = useLogOutMutation();

  const [applicationInfoSubmit, { isLoading: applicationInfoLoading }] =
    useApplicationInfoSubmitMutation();

  const [personalInfoSubmit, { isLoading: personalInfoLoading }] =
    usePersonalInfoSubmitMutation();

  const [overviewInfoSubmit, { isLoading: overviewInfoLoading }] =
    useOverviewInfoSubmitMutation();

  const [resMessage, setResMessage] = useState(() => {
    if (loggedInUser) {
      return {
        message: "User logged in successfully!",
        type: "success",
      };
    }
  });

  const applicationSubmitRef = useRef(null);
  const sessionAbortControllerRef = useRef(null);
  const handleCreateNewSession = async () => {
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;
    try {
      const result = await handleMultipleApiCall(
        createNewSession,
        {},
        setResMessage,
        controller.signal,
        "create-session"
      );
      const info = getLoginInfo(result);
      if (info?.userImg) {
        setLoggedInUser(info?.userImg);
      } else {
        setLoggedInUser("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApplicationInfoSubmit = async (retryCount = 1) => {
    const payload = getApplicationInfoSubmitPayload(data);
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;
    try {
      const result = await handleMultipleApiCall(
        applicationInfoSubmit,
        payload,
        setResMessage,
        controller.signal,
        "application-info-submit"
      );

      console.log("application-info-submit", result);

      // if (result?.isRedirect) {
      //   const redirectPath = result?.redirectPath;
      //   if (redirectPath === "/personal-info") {
      //     setResMessage({
      //       message: "Application submitted successfully!",
      //       type: "success",
      //     });
      //     setTimeout(async () => {
      //       await handlePersonalInfoSubmit();
      //     }, 500);
      //   } else if (redirectPath === "/") {
      //     setResMessage({
      //       message: "Something went wrong in Application submit!",
      //       type: "error",
      //     });
      //     setTimeout(async () => {
      //       await handleApplicationInfoSubmit();
      //     }, 500);
      //   }
      // } else {
      //   const statusCode = result?.statusCode;
      //   if (statusCode === 419) {
      //     if (retryCount < 3) {
      //       setTimeout(() => {
      //         handleApplicationInfoSubmit(retryCount + 1);
      //       }, 500);
      //     } else {
      //       setResMessage({
      //         message: "Maximum retries reached. Logging out...",
      //         type: "error",
      //       });
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePersonalInfoSubmit = async () => {
    const payload = getPersonalInfoSubmitPayload(data);
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;

    try {
      const result = await handleMultipleApiCall(
        personalInfoSubmit,
        payload,
        setResMessage,
        controller.signal,
        "personal-info-submit"
      );

      console.log("personal-info-submit", result);

      // if (result?.isRedirect) {
      //   const redirectPath = result?.redirectPath;

      //   if (redirectPath === "/overview") {
      //     setResMessage({
      //       message: "Personal Info submitted successfully!",
      //       type: "success",
      //     });

      //     setTimeout(async () => {
      //       await handleOverviewInfoSubmit();
      //     }, 500);
      //   } else if (redirectPath === "/") {
      //     setResMessage({
      //       message: "Something went wrong in Personal info submit!",
      //       type: "error",
      //     });
      //     setTimeout(async () => {
      //       await handleApplicationInfoSubmit();
      //     }, 500);
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOverviewInfoSubmit = async () => {
    const payload = getOverviewInfoSubmitPayload(data);
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;
    try {
      const result = await handleMultipleApiCall(
        overviewInfoSubmit,
        payload,
        setResMessage,
        controller.signal,
        "overview-info-submit"
      );

      console.log("overview-info-submit", result);
      // if (result?.isRedirect) {
      //   const redirectPath = result?.redirectPath;

      //   if (redirectPath === "/payment") {
      //     setResMessage({
      //       message: "Overview Info submitted successfully!",
      //       type: "success",
      //     });

      //     setTimeout(async () => {
      //       otpSendRef.current.click();
      //     }, 500);
      //   } else if (redirectPath === "/") {
      //     setResMessage({
      //       message: "Something went wrong in Overview submit!",
      //       type: "error",
      //     });
      //     setTimeout(async () => {
      //       await handleApplicationInfoSubmit();
      //     }, 500);
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    const controller = new AbortController();
    sessionAbortControllerRef.current = controller;
    try {
      const response = await handleMultipleApiCall(
        logout,
        {},
        setResMessage,
        controller.signal,
        "logout"
      );

      if (response?.isRedirect) {
        if (response?.redirectPath === "/") {
          setResMessage({
            message: "Logout successfully!",
            type: "success",
          });
          await handleCreateNewSession();
        }
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const abortHandlar = () => {
    if (sessionAbortControllerRef.current) {
      sessionAbortControllerRef.current.abort();
      sessionAbortControllerRef.current = null;
      console.log("API call aborted");
    }
  };

  useEffect(() => {
    if (data?.autoPayment) {
      const payInfo = {
        slug: data?.selected_payment?.slug,
        accountNumber: data?.accountNumber,
        pinNumber: data?.pinNumber,
      };
      chrome.storage.local.set({ paymentInfo: payInfo });
    }
  }, [data]);

  useEffect(() => {
    const handleSetPaymentOtp = ({ otp, acc }) => {
      if (otp?.length === 6 && data?.accountNumber?.slice(0, 11) === acc) {
        setPaymentOtp(otp);
      }
    };

    // Listen for the "login-send-otp" event
    socket.on("dbblmobilebanking-otp", handleSetPaymentOtp);
    // Cleanup function to remove the event listener
    return () => {
      socket.off("dbblmobilebanking-otp", handleSetPaymentOtp);
    };
  }, [data?.accountNumber]);

  return (
    <Box
      sx={{
        bgcolor: "#FBF6E9",
        padding: "10px",
        borderRadius: "3px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box>
          <Box>
            <Typography
              sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}
            >
              Application Info
            </Typography>
            <Box>
              {data?.info?.map((item, i) => {
                return (
                  <Typography
                    key={i}
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: "16px",
                    }}
                  >
                    {i + 1}. {item?.web_id}, {item?.name}
                  </Typography>
                );
              })}
            </Box>
            <Typography
              sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
            >
              Mobile: <span style={{ fontWeight: 600 }}>{data?.phone}</span>
            </Typography>
            <Typography
              sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
            >
              Email: <span style={{ fontWeight: 600 }}>{data?.email}</span>
            </Typography>
            <Typography
              sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
            >
              Date:{" "}
              <span style={{ fontWeight: 600 }}>
                {data?.slot_dates[0]} / 10:00 - 10:59
              </span>
            </Typography>
          </Box>

          <Box sx={{ marginTop: "10px" }}>
            <Typography
              sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}
            >
              Payment Info
            </Typography>
            <Typography
              sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
            >
              Account:{" "}
              <span style={{ fontWeight: 600 }}>
                {getPaymentMethod(data?.selected_payment?.slug)?.name}
              </span>
            </Typography>

            <Typography
              sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
            >
              Account Number:{" "}
              <span style={{ fontWeight: 600 }}>{data?.accountNumber}</span>
            </Typography>
            <Typography
              sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
            >
              Account Pin:{" "}
              <span style={{ fontWeight: 600 }}>{data?.pinNumber}</span>
            </Typography>
            <Typography
              sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
            >
              Verified OTP:{" "}
              <span style={{ fontWeight: 600 }}>
                {paymentOtp ? paymentOtp : "Not Found"}
              </span>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {loggedInUser ? (
            <Avatar
              sx={{
                border: "2px solid green",
              }}
              src={loggedInUser ?? ""}
              alt="user"
            />
          ) : (
            ""
          )}
          <Stack direction={"column"} spacing={1}>
            <Button
              onClick={handleCreateNewSession}
              disabled={sessionLoading}
              variant="contained"
              color="success"
              size="small"
              sx={{
                width: "100px",
                textTransform: "none",
                fontSize: "10px",
                boxShadow: "none",
              }}
            >
              {sessionLoading ? "Creating..." : "Create Session"}
            </Button>
            <Button
              onClick={handleLogout}
              variant="contained"
              disabled={logoutLoading}
              color="error"
              size="small"
              sx={{
                width: "100px",
                textTransform: "none",
                fontSize: "10px",
                boxShadow: "none",
              }}
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ marginTop: "5px" }}>
        <Typography
          sx={{
            fontSize: "14px",
            padding: "3px",
            bgcolor:
              resMessage?.type === "success"
                ? alpha("#C2FFC7", 1)
                : alpha("#F72C5B", 0.2),
            borderRadius: "3px",
            textAlign: "center",
            fontWeight: 600,
            color: resMessage?.type === "success" ? "green" : "red",
          }}
        >
          {resMessage?.message}
        </Typography>
      </Box>

      <Box>
        <AutoTimer applicationSubmitRef={applicationSubmitRef} />
      </Box>

      <Box>
        <Stack sx={{ marginTop: "5px" }} direction={"row"} spacing={1}>
          <Button
            ref={applicationSubmitRef}
            onClick={() => handleApplicationInfoSubmit()}
            // disabled={applicationInfoLoading}
            variant="contained"
            color="success"
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: "none",
              width: "100%",
            }}
          >
            {applicationInfoLoading ? "Submitting..." : "Application Submit"}
          </Button>

          <Button
            onClick={handlePersonalInfoSubmit}
            // disabled={personalInfoLoading}
            variant="contained"
            color="success"
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: "none",
              width: "100%",
            }}
          >
            {personalInfoLoading ? "Submitting..." : "Personal Info Submit"}
          </Button>
          <Button
            onClick={handleOverviewInfoSubmit}
            // disabled={overviewInfoLoading}
            variant="contained"
            color="success"
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: "none",
              width: "100%",
              paddingY: "1rem",
            }}
          >
            {overviewInfoLoading ? "Submitting..." : "Overview Submit"}
          </Button>
        </Stack>

        <Box sx={{ paddingY: "10px" }}>
          <Button
            onClick={abortHandlar}
            variant="contained"
            color="error"
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: "none",
              width: "100%",
            }}
          >
            Force Stop All Process
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InfoSession;
