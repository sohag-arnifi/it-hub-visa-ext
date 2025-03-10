import { Box, Paper } from "@mui/material";
import React, { useState } from "react";
import { useAppSelector } from "./redux/store";
import Header from "./components/Header/Header";
import ManageApplications from "./components/ManageApplications";
import CompletedApplications from "./components/CompletedApplications";

const App = () => {
  const [isOpenManageApplication, setIsOpenManageApplication] = useState(true);
  const [isOpenCompletedApplication, setIsOpenCompletedApplication] =
    useState(false);
  const user = useAppSelector((state) => state?.auth?.user);

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
        overflowY: "auto",
      }}
    >
      <Box id={"captcha-container"}></Box>
      <Paper
        variant="outlined"
        sx={{ padding: "20px", height: "100%", border: "none" }}
      >
        <Header
          user={user}
          setIsOpenManageApplication={setIsOpenManageApplication}
          setIsOpenCompletedApplication={setIsOpenCompletedApplication}
        />

        {isOpenManageApplication ? (
          <ManageApplications />
        ) : isOpenCompletedApplication ? (
          <CompletedApplications />
        ) : null}
      </Paper>
    </Box>
  );
};

export default App;
