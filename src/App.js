import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { useGetApplicationsQuery } from "./redux/features/application/applicationApi";
import ApplicationContainer from "./components/ApplicationContainer";
import GlobalLoader from "./components/GlobalLoader";
import TimerContainer from "./components/TimerContainer";

const App = () => {
  const { isLoading } = useGetApplicationsQuery({});

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        bgcolor: "#FFF",
        zIndex: 1000,
      }}
    >
      <Paper variant="outlined" sx={{ padding: "20px", height: "100%" }}>
        <Box
          sx={{
            borderBottom: "1px solid #E0E0E0",
            // paddingY: "0.5rem",
          }}
        >
          <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "blue" }}>
            It-Hub
          </Typography>
        </Box>
        <TimerContainer />
        {isLoading ? <GlobalLoader /> : <ApplicationContainer />}
      </Paper>
    </Box>
  );
};

export default App;
