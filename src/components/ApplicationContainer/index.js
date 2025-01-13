import { Box, Button, Paper, styled, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import SendOtp from "./SendOtp";
import VerifyOtp from "./VerifyOtp";
import DateTime from "./DateTime";
import PayNow from "./PayNow";
import DownloadSlip from "./DownloadSlip";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAppSelector } from "../../redux/store";

export const StyledTypography = styled(Typography)(() => ({
  fontSize: "12px",
  fontWeight: "bold",
  lineHeight: "14px",
}));

const ApplicationContainer = () => {
  const { applications } = useAppSelector((state) => state);
  const otpRefs = useRef(applications.map(() => React.createRef()));
  const abortControllers = useRef([]);

  const [appStart, setAppStart] = useState(false);

  const sendOtpToAllApplications = () => {
    if (appStart) {
      abortControllers.current.forEach((controller) => controller.abort());
      abortControllers.current = [];
      setAppStart(false);
    } else {
      // Start API calls
      setAppStart(true);
      applications.forEach((_, index) => {
        const controller = new AbortController();
        abortControllers.current.push(controller);
        otpRefs.current[index]?.current(controller.signal);
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <Box
        sx={{
          paddingY: "1rem",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: "bold",
            lineHeight: "18px",
          }}
        >
          Total Applications:{" "}
          <span style={{ color: "blue" }}>{applications?.length}</span>
        </Typography>
        <Button
          onClick={sendOtpToAllApplications}
          variant="contained"
          color={appStart ? "error" : "success"}
          sx={{ textTransform: "none", boxShadow: "none" }}
          endIcon={<RestartAltIcon />}
        >
          {appStart ? "Stop Now!" : "Start Now!"}
        </Button>
      </Box>

      {applications?.map((item, i) => {
        const ivac = item?.info[0]?.ivac;
        const type = item?.info[0]?.visa_type;
        return (
          <Paper key={i} variant="outlined" sx={{ padding: "1rem" }}>
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Box sx={{ display: "flex", gap: "5px" }}>
                <StyledTypography>{i + 1}.</StyledTypography>
                <Box>
                  <Box>
                    <StyledTypography>{ivac?.ivac_name}</StyledTypography>
                    <StyledTypography>{type?.type_name}</StyledTypography>
                  </Box>
                  <Box sx={{ marginTop: "5px" }}>
                    {item?.info?.map((info, i) => (
                      <Box key={i} sx={{ display: "flex", gap: "5px" }}>
                        <StyledTypography>{i + 1}.</StyledTypography>
                        <StyledTypography>{info?.web_id},</StyledTypography>
                        <StyledTypography>{info?.name}</StyledTypography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <SendOtp data={item} otpRef={otpRefs.current[i]} />
              <VerifyOtp data={item} />
              <DateTime data={item} />
              <PayNow data={item} />
              <DownloadSlip />
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ApplicationContainer;
