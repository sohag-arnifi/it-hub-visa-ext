import { Box, Paper, styled, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SendOtp from "./SendOtp";
import VerifyOtp from "./VerifyOtp";
import DateTime from "./DateTime";
import PayNow from "./PayNow";
import DownloadSlip from "./DownloadSlip";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setLastUpdate } from "../../redux/features/automation/automationSlice";
import CaptchaSolver from "./CaptchaSolver";

export const StyledTypography = styled(Typography)(() => ({
  fontSize: "12px",
  fontWeight: "bold",
  lineHeight: "14px",
}));

const ApplicationContainer = () => {
  const applications = useAppSelector((state) => state?.applications);
  const otpRefs = useRef(applications.map(() => React.createRef()));

  const { hitNow, apiCallRunning, otpSend } = useAppSelector(
    (state) => state?.automation
  );
  const dispatch = useAppDispatch();

  const sendOtpToAllApplications = () => {
    if (!apiCallRunning && !otpSend) {
      applications.forEach((_, index) => {
        setTimeout(() => {
          otpRefs.current[index]?.current?.click();
        }, index * 1000);
      });
    }
  };

  useEffect(() => {
    if (hitNow) {
      dispatch(setLastUpdate({ hitNow: false }));
      sendOtpToAllApplications();
    }
  }, [hitNow]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        paddingBottom: "2rem",
      }}
    >
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: "bold",
          lineHeight: "18px",
        }}
      >
        Process Applications -{" "}
        <span style={{ color: "blue" }}>{applications?.length}</span>
      </Typography>

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
              <SendOtp
                data={item}
                otpRef={otpRefs.current[i]}
                applications={applications}
                index={i}
              />
              <VerifyOtp data={item} otpRef={otpRefs.current[i]} />
              <DateTime data={item} otpRef={otpRefs.current[i]} />
              <CaptchaSolver data={item} />
              <PayNow data={item} otpRef={otpRefs.current[i]} />
              <DownloadSlip />
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ApplicationContainer;
