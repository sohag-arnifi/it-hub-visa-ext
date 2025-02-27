import { Add, Close } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import envConfig from "./configs/envConfig";
import { io } from "socket.io-client";
import App from "./App";
import { useGetLoginUserQuery } from "./redux/features/auth/authApi";
import GlobalLoader from "./components/GlobalLoader";
import LoginPage from "./components/Login";
import ApplicationCard from "./components/ApplicationCard";

export const socket = io(envConfig.backendBaseUrl, {
  transports: ["websocket"],
});

const Main = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { data, isLoading } = useGetLoginUserQuery({});

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const applicationId = params.get("applicationId");

  useEffect(() => {
    if (data?.data?._id) {
      socket.emit("user-online", data?.data?._id);
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  if (isLoading) {
    return <GlobalLoader height="70vh" />;
  }

  return (
    <Box sx={{ zIndex: 1000 }}>
      {applicationId ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            bgcolor: "#FFF",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <ApplicationCard />
        </Box>
      ) : (
        <Box>
          {isOpen && (
            <>
              {data?.data?._id && data?.data?.companyId?._id ? (
                <App />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "100vh",
                    width: "100vw",
                    bgcolor: "#EDE7F6",
                    position: "fixed",
                    top: "0px",
                    left: "0px",
                  }}
                >
                  <LoginPage />
                </Box>
              )}
            </>
          )}
          <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
            <IconButton
              onClick={() => setIsOpen(!isOpen)}
              sx={{
                bgcolor: "#FFF",
                color: "black",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            >
              {isOpen ? <Close /> : <Add />}
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Main;
