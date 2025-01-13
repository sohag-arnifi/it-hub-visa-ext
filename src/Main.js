import { Add, Close } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import envConfig from "./configs/envConfig";
import { io } from "socket.io-client";
import App from "./App";

export const socket = io(envConfig.backendBaseUrl, {
  transports: ["websocket"],
});

const Main = () => {
  const [isOpen, setIsOpen] = useState(true);

  const userId = 101;

  useEffect(() => {
    socket.emit("user-online", userId);
    socket.on("message", (message) => {
      console.log("Received message:", message);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box sx={{ zIndex: 1000 }}>
      {isOpen && <App />}
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
  );
};

export default Main;
