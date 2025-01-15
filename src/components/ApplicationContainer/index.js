import { Box, Paper, styled, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SendOtp from "./SendOtp";
import VerifyOtp from "./VerifyOtp";
import DateTime from "./DateTime";
import PayNow from "./PayNow";
import DownloadSlip from "./DownloadSlip";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setLastUpdate } from "../../redux/features/automation/automationSlice";

export const StyledTypography = styled(Typography)(() => ({
  fontSize: "12px",
  fontWeight: "bold",
  lineHeight: "14px",
}));

const ApplicationContainer = () => {
  const { applications } = useAppSelector((state) => state);
  const otpRefs = useRef(applications.map(() => React.createRef()));

  const { hitNow } = useAppSelector((state) => state?.automation);
  const dispatch = useAppDispatch();

  const sendOtpToAllApplications = () => {
    applications.forEach((_, index) => {
      otpRefs.current[index]?.current?.click();
    });
  };

  const totalProcessFiles = applications?.reduce(
    (acc, curr) => acc + curr?.info?.length,
    0
  );

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
            fontSize: "1.5rem",
            fontWeight: "bold",
            lineHeight: "18px",
          }}
        >
          Total process files:{" "}
          <span style={{ color: "blue" }}>{totalProcessFiles}</span>
        </Typography>
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
              <VerifyOtp data={item} otpRef={otpRefs.current[i]} />
              <DateTime data={item} otpRef={otpRefs.current[i]} />
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
