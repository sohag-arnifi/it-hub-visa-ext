import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { StyledTypography } from "../../ApplicationContainer";
import {
  getCenter,
  getIVAC,
  getPaymentMethod,
  getVisaType,
} from "../../../constanse";
import GlobalLoader from "../../GlobalLoader";
import { useDeleteApplicationMutation } from "../../../redux/features/application/applicationApi";
import {
  InsertLinkRounded,
  CheckCircleOutlineRounded,
} from "@mui/icons-material";

const StyledTypo = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "18px",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "none",
  padding: "1rem",
  borderRadius: "5px",
};

const CompletedTable = ({ data, isLoading }) => {
  return (
    <Box>
      <Box sx={{ marginTop: "2rem" }}>
        {isLoading ? (
          <GlobalLoader height="40vh" />
        ) : (
          <Box
            sx={{
              padding: "20px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              bgcolor: "#FFF",
              borderRadius: "6px",
              boxShadow:
                "0px 0px 1px 0px rgba(40, 41, 61, 0.08), 0px 0.5px 2px 0px rgba(96, 97, 112, 0.16)",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "none",
              }}
            >
              <Table
                sx={{ minWidth: "800px", overflow: "hidden" }}
                aria-label="simple table"
              >
                <TableHead
                  sx={{
                    borderRadius: "0.25rem",
                    background: "#F7F5F2",
                    padding: {
                      sm: "1rem 1.3125rem 1rem 1.25rem",
                      xs: "0.75rem 2rem 0.75rem 1rem",
                    },
                  }}
                >
                  <TableRow
                    sx={{
                      "& th": {
                        color: "#0B0B29",
                        fontSize: { sm: "0.875rem", xs: "0.75rem" },
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: { sm: "1.3125rem", xs: "1.125rem" },
                      },
                    }}
                  >
                    <TableCell>Application Info</TableCell>
                    <TableCell>Web File</TableCell>
                    <TableCell>File Info</TableCell>
                    <TableCell>Payment Info</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    "& tr> th,td": {
                      color: "#0B0B29",
                      fontFamily: "Inter",
                      fontSize: { sm: "0.875rem", xs: "0.75rem" },
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: { sm: "1.3125rem", xs: "1.125rem" },
                      borderBottomColor: "rgba(0, 0, 0, 0.10) !important",
                    },
                  }}
                >
                  {!data?.length ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box
                          sx={{
                            width: "100%",
                            height: "250px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "20px", fontWeight: 600 }}
                          >
                            No Application found!
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.map((row, i) => {
                      const isCMDCopyed = isCopyed?.id === row?._id;
                      return (
                        <TableRow
                          key={i}
                          sx={{
                            height: "100%",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            color: "red",
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                            "& *": {
                              fontSize: "14px",
                              fontWeight: 500,
                            },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <StyledTypo>
                              {getCenter(row?.center)?.c_name}
                            </StyledTypo>
                            <StyledTypo>
                              {getIVAC(row?.ivac)?.ivac_name}
                            </StyledTypo>
                            <StyledTypo>
                              {getVisaType(row?.visaType)?.type_name}
                            </StyledTypo>
                          </TableCell>
                          <TableCell>
                            {row?.info?.map((info, i) => {
                              return (
                                <StyledTypo key={i}>
                                  {i + 1}. {info?.name}, {info?.web_id}
                                </StyledTypo>
                              );
                            })}
                          </TableCell>
                          <TableCell>
                            <StyledTypo>Mobile: {row?.phone}</StyledTypo>
                            <StyledTypo>Password: {row?.password}</StyledTypo>
                            <StyledTypo>Email: {row?.email}</StyledTypo>
                          </TableCell>
                          <TableCell>
                            <StyledTypo>
                              {getPaymentMethod(row?.paymentMethod)?.name}
                            </StyledTypo>
                            <StyledTypo>
                              Payment: {row?.info?.length * 824}tk
                            </StyledTypo>
                            <StyledTypo>
                              Agent Payment: {row?.paymentAmount}tk
                            </StyledTypo>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                backgroundColor: `#DFFAF2 !important`,
                                color: `#12825F !important`,
                                textAlign: "center",
                                padding: "10px 12px",
                                borderRadius: "4px",
                                fontSize: "14px",
                                fontWeight: 500,
                                lineHeight: "21px",
                              }}
                            >
                              Completed
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "red",
                              }}
                            >
                              Download Link not found.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CompletedTable;
