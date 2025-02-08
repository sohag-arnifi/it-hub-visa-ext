import { Box, Button, styled, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
// const { wrapper } = require("axios-cookiejar-support");
// const tough = require("tough-cookie");

// const cookieJar = new tough.CookieJar();
// const client = wrapper(axios.create({ jar: cookieJar }));

// Cookie Manager Class
class CookieManager {
  constructor() {
    this.cookies = {};
  }

  // Parse cookies from "Set-Cookie" header
  parseSetCookieHeader(setCookieHeader) {
    if (!setCookieHeader) return;

    setCookieHeader.forEach((cookie) => {
      const [cookieString] = cookie.split(";");
      const [name, value] = cookieString.split("=");
      this.cookies[name] = value;
    });
  }

  // Get a cookie by name
  getCookie(name) {
    return this.cookies[name];
  }

  // Get all cookies as a string (for sending in requests)
  getCookieString() {
    return Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  // Clear all cookies
  clearCookies() {
    this.cookies = {};
  }
}

// Create a global instance of CookieManager
const cookieManager = new CookieManager();

const axiosInstance = axios.create({
  withCredentials: true, // Ensure cookies are sent and received
});

// Add request interceptor to attach cookies
axiosInstance.interceptors.request.use((config) => {
  const cookieString = cookieManager.getCookieString();
  if (cookieString) {
    config.headers.Cookie = cookieString;
  }
  return config;
});

// Add response interceptor to store cookies
axiosInstance.interceptors.response.use((response) => {
  const setCookieHeader = response.headers["set-cookie"];
  cookieManager.parseSetCookieHeader(setCookieHeader);
  return response;
});

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
    setLoginLoading(true);
    try {
      const response = await axiosInstance.get("https://payment.ivacbd.com", {
        headers: {
          "x-requested-with": "XMLHttpRequest",
          "content-type": "application/json",
        },
        withCredentials: true,
      });

      const sessionCookie = cookieManager.getCookie("XSRF-TOKEN");
      console.log("Session Cookie:", sessionCookie);

      // Extract cookies from response headers

      // const response = await axios.get("https://payment.ivacbd.com", {
      //   headers: {
      //     "x-requested-with": "XMLHttpRequest",
      //     "content-type": "application/json",
      //   },
      //   withCredentials: true,
      // });

      // // Log HTML content
      // console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoginLoading(false);
    }
  };

  const openNewWindowWithDefaultData = () => {
    const currentUrl = window.location.href;

    // Open a new window with the same URL and specified dimensions
    const newWindow = window.open(currentUrl, "_blank", "width=500,height=800");

    if (newWindow) {
      newWindow.onload = () => {
        // Clear existing session data
        newWindow.localStorage.clear();
        newWindow.sessionStorage.clear();
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.split("=");
          newWindow.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // Set default user data
        const defaultUser = {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
        };

        newWindow.localStorage.setItem("user", JSON.stringify(defaultUser)); // Store user object in localStorage
        newWindow.sessionStorage.setItem("token", "abc123"); // Store a session token
        newWindow.document.cookie = "theme=dark; path=/"; // Set a cookie for theme preference

        // Log the default data to verify
        console.log("Default user:", newWindow.localStorage.getItem("user"));
        console.log(
          "Session token:",
          newWindow.sessionStorage.getItem("token")
        );
        console.log("Theme cookie:", newWindow.document.cookie);
      };
    } else {
      alert("Please allow pop-ups for this site.");
    }
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
