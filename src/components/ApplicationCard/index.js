import { Box, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "./Header";
import LoginContainer from "./LoginContainer";
import InfoSession from "./InfoSession";
import PayOtp from "./PayOtp";
import GlobalLoader from "../GlobalLoader";
import { useGetProcessApplicationQuery } from "../../redux/features/application/applicationApi";

const ApplicationCard = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  const [loggedInUser, setLoggedInUser] = useState(() => {
    const localUser = localStorage.getItem("userImg");
    return localUser ? localUser : "";
  });
  const applicationId = params.get("applicationId");

  const { data, isLoading } = useGetProcessApplicationQuery(
    {
      id: applicationId,
    },
    {
      skip: !applicationId,
    }
  );

  return (
    <Box sx={{ paddingY: "5px" }}>
      <Paper
        variant="outlined"
        sx={{
          padding: "10px",
          width: "475px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {!applicationId ? (
          <Box
            sx={{
              width: "100%",
              height: "95vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1rem",
                color: "red",
              }}
            >
              Application ID not found!
            </Typography>
          </Box>
        ) : (
          <Box>
            {isLoading ? (
              <Box sx={{ width: "100%" }}>
                <GlobalLoader height="95vh" />
              </Box>
            ) : data?.data?._id ? (
              <Box>
                <Header data={data?.data} />
                {loggedInUser ? (
                  <>
                    <InfoSession
                      data={data?.data}
                      loggedInUser={loggedInUser}
                    />
                    <PayOtp data={data?.data} />
                  </>
                ) : (
                  <LoginContainer
                    data={data?.data}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "95vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "red",
                  }}
                >
                  Something went wrong!
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ApplicationCard;
