import { Box, Paper } from "@mui/material";
import React, { useState } from "react";
import { useGetApplicationsQuery } from "./redux/features/application/applicationApi";
import ApplicationContainer from "./components/ApplicationContainer";
import GlobalLoader from "./components/GlobalLoader";
import TimerContainer from "./components/TimerContainer";
import { useAppSelector } from "./redux/store";
import Header from "./components/Header/Header";
import ManageApplications from "./components/ManageApplications";

const App = () => {
  const [isOpenManageApplication, setIsOpenManageApplication] = useState(false);
  const { isLoading } = useGetApplicationsQuery({});
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
      <Paper
        variant="outlined"
        sx={{ padding: "20px", height: "100%", border: "none" }}
      >
        <Header
          user={user}
          setIsOpenManageApplication={setIsOpenManageApplication}
        />

        {isLoading ? (
          <GlobalLoader />
        ) : isOpenManageApplication ? (
          <ManageApplications />
        ) : (
          <>
            <TimerContainer />
            <ApplicationContainer />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default App;
