import {
  alpha,
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  useAuthVerifyMutation,
  useCreateNewSessionMutation,
  useLoginOtpVerifyMutation,
  useMobileVerifyMutation,
} from "../../../redux/features/appBaseApi/appBaseApiSlice";
import {
  getMobileVerifyPayload,
  getOtpVerifyPayload,
  getPasswordVerifyPayload,
} from "../../../utils/appPayload";
import handleMultipleApiCall from "../../../utils/handleMultipleApiCall";
import { socket } from "../../../Main";
import { getLoginInfo } from "../../../utils/generateMessage";

const LoginContainer = ({ data, loggedInUser, setLoggedInUser }) => {
  const [loginOtp, setLoginOtp] = useState("");

  const [resMessage, setResMessage] = useState({
    message: loggedInUser ? "Successfully Login" : "Please login to continue!",
    type: loggedInUser ? "success" : "error",
  });

  const [mobileVerify, { isLoading: mobileLoading }] =
    useMobileVerifyMutation();

  const [authVerify, { isLoading: passwordLoading }] = useAuthVerifyMutation();

  const [loginOtpVerify, { isLoading: loginOtpLoading }] =
    useLoginOtpVerifyMutation();

  const [createNewSession, { isLoading: sessionLoading }] =
    useCreateNewSessionMutation();

  const mobileVerifyAbortControllerRef = useRef(null);
  const otpVerifyBtnRef = useRef(null);

  const handleMobileVerify = async () => {
    const controller = new AbortController();
    mobileVerifyAbortControllerRef.current = controller;
    const payload = getMobileVerifyPayload(data);
    const result = await handleMultipleApiCall(
      mobileVerify,
      payload,
      setResMessage,
      controller.signal,
      "mobile-verify"
    );

    if (result?.isRedirect) {
      if (result?.redirectPath === "/login-auth") {
        setResMessage({
          message: "Mobile number verified!",
          type: "success",
        });
        setTimeout(async () => {
          await handlePasswordVerify();
        }, 100);
      } else if (result?.redirectPath === "/registration") {
        setResMessage({
          message: "No Account Found!",
          type: "error",
        });
      }
    } else {
      setResMessage({
        message: "Something went wrong in Mobile number verification!",
        type: "error",
      });
    }
  };

  const handlePasswordVerify = async () => {
    const controller = new AbortController();
    mobileVerifyAbortControllerRef.current = controller;
    const payload = getPasswordVerifyPayload(data);
    const result = await handleMultipleApiCall(
      authVerify,
      payload,
      setResMessage,
      controller.signal,
      "auth-verify"
    );

    if (result?.isRedirect) {
      if (result?.redirectPath === "/login-otp") {
        setResMessage({
          message: "OTP sent successfully!",
          type: "success",
        });
      } else {
        setResMessage({
          message: "Password did not match!",
          type: "error",
        });
      }
    } else {
      setResMessage({
        message: "Password did not match!",
        type: "error",
      });
    }
  };

  const otpSubmitHandlar = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    mobileVerifyAbortControllerRef.current = controller;
    const payload = getOtpVerifyPayload(loginOtp);
    const result = await handleMultipleApiCall(
      loginOtpVerify,
      payload,
      setResMessage,
      controller.signal,
      "otp-verify"
    );

    if (result?.isRedirect) {
      if (result?.redirectPath === "/") {
        setResMessage({
          message: "Successfully Login!",
          type: "success",
        });
        await handleCreateNewSession();
      }
    }
  };

  const handleCreateNewSession = async () => {
    setResMessage({
      message: "Login successfully! Session creating..",
      type: "success",
    });
    const controller = new AbortController();
    mobileVerifyAbortControllerRef.current = controller;
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

  const handleForceStop = () => {
    if (mobileVerifyAbortControllerRef?.current) {
      mobileVerifyAbortControllerRef.current.abort();
      mobileVerifyAbortControllerRef.current = null;
      console.log("API call aborted");
    }
  };

  useEffect(() => {
    const handleLoginOtpVefiry = ({ otp, phone }) => {
      if (otp?.length === 6 && data?.phone === phone) {
        setLoginOtp(otp); // Set the OTP state
        setTimeout(async () => {
          otpVerifyBtnRef.current.click();
        }, 2000);
      }
    };

    // Listen for the "login-send-otp" event
    socket.on("login-send-otp", handleLoginOtpVefiry);

    // Cleanup function to remove the event listener
    return () => {
      socket.off("login-send-otp", handleLoginOtpVefiry);
    };
  }, [data?.phone]);

  return (
    <Box
      sx={{
        bgcolor: alpha("#C2FFC7", 0.3),
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
          <Typography
            sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}
          >
            Login Info
          </Typography>

          <Typography
            sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
          >
            Mobile: <span style={{ fontWeight: 600 }}>{data?.phone}</span>
          </Typography>
          <Typography
            sx={{ fontSize: "12px", fontWeight: 500, lineHeight: "16px" }}
          >
            Password: <span style={{ fontWeight: 600 }}>{data?.password}</span>
          </Typography>
        </Box>

        {loggedInUser && (
          <Box>
            <Avatar
              sx={{
                border: "2px solid green",
              }}
              src={loggedInUser}
              alt="user"
            />
          </Box>
        )}
      </Box>

      <Box sx={{ marginTop: "10px" }}>
        <Stack direction={"row"} spacing={1}>
          <Button
            onClick={handleMobileVerify}
            disabled={mobileLoading || passwordLoading}
            color="error"
            size={"small"}
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: 0,
              width: "100%",
            }}
          >
            {mobileLoading || passwordLoading
              ? "Verifying..."
              : "Verify Mobile"}
          </Button>

          <Button
            onClick={handleForceStop}
            disabled={!mobileVerifyAbortControllerRef?.current}
            color="error"
            size={"small"}
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "12px",
              boxShadow: 0,
              width: "100%",
            }}
          >
            Force Close
          </Button>
        </Stack>

        <Box
          sx={{ marginY: "12px" }}
          component={"form"}
          onSubmit={otpSubmitHandlar}
        >
          <Stack direction={"row"} spacing={1}>
            <TextField
              size="small"
              sx={{ bgcolor: "#FFF", width: "50%" }}
              name="login-otp"
              onChange={(e) => setLoginOtp(e.target?.value)}
              value={loginOtp}
              type="number"
              maxLength={6}
              minLength={6}
              required
            />
            <Button
              ref={otpVerifyBtnRef}
              disabled={loginOtpLoading || loginOtp?.length !== 6}
              type="submit"
              color="error"
              size={"small"}
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: "12px",
                boxShadow: 0,
                width: "50%",
              }}
            >
              {loginOtpLoading ? "Verifying..." : "Verify"}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ marginTop: "5px" }}>
          <Typography
            sx={{
              fontSize: "14px",
              padding: "3px",
              bgcolor:
                resMessage.type === "success"
                  ? alpha("#C2FFC7", 0.9)
                  : alpha("#F72C5B", 0.3),
              borderRadius: "3px",
              textAlign: "center",
              fontWeight: 600,
              color: resMessage?.type === "success" ? "green" : "red",
            }}
          >
            {resMessage?.message}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginContainer;
