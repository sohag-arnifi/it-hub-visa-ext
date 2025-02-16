import { Box, Button, styled, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const StyledLabel = styled(Typography)(() => ({
  fontSize: "12px",
}));

const StyledValue = styled(Typography)(() => ({
  fontSize: "12px",
  fontWeight: "bold",
}));

const ApplicantLogin = ({ data }) => {
  const [loginLoading, setLoginLoading] = useState(false);
  const loginHandler = async () => {
    // setLoginLoading(true);
    // try {
    //   const response = await axiosInstance.get("https://payment.ivacbd.com", {
    //     headers: {
    //       "x-requested-with": "XMLHttpRequest",
    //       "content-type": "application/json",
    //     },
    //     withCredentials: true,
    //   });
    //   const sessionCookie = cookieManager.getCookie("XSRF-TOKEN");
    //   console.log("Session Cookie:", sessionCookie);
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setLoginLoading(false);
    // }
  };

  const openNewWindowWithDefaultData = () => {
    chrome.runtime.sendMessage(
      {
        action: "openIncognitoWindow",
        url: `https://payment.ivacbd.com/?applicationId=${data?._id}`,
      },
      (response) => {
        if (response?.success) {
          console.log("Incognito window opened successfully.");
        } else {
          console.error("Failed to open incognito window.");
        }
      }
    );
  };

  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          <StyledLabel>Mobile:</StyledLabel>
          <StyledValue>{data?.phone}</StyledValue>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          <StyledLabel>Password:</StyledLabel>
          <StyledValue>{data?.password}</StyledValue>
        </Box>
        <Button
          disabled={loginLoading}
          variant="contained"
          color="error"
          size="small"
          onClick={loginHandler}
          sx={{
            textTransform: "none",
            fontSize: "10px",
            boxShadow: "none",
            marginY: "5px",
          }}
        >
          {loginLoading ? "Logging in..." : "Login"}
        </Button>

        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={openNewWindowWithDefaultData}
          sx={{
            textTransform: "none",
            fontSize: "10px",
            boxShadow: "none",
            marginY: "10px",
          }}
        >
          {"Open new"}
        </Button>
      </Box>
    </Box>
  );
};

export default ApplicantLogin;
