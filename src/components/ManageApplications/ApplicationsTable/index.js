import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import { useAppSelector } from "../../../redux/store";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import envConfig from "../../../configs/envConfig";

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

const ApplicationsTable = ({
  data,
  isLoading,
  setOpenUpdateModal,
  setUpdatedValues,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [deletedInfo, setDeletedInfo] = useState({});
  const [isCopyed, setIsCopied] = useState({
    status: false,
    id: "",
  });

  const [isSmsLinkCopied, setIsSmsLinkCopied] = useState({
    status: false,
    id: "",
  });

  const { companyId } = useAppSelector((state) => state?.auth?.user);
  const isDuePending = companyId?.currentBalance <= 0;

  const [auth, setAuth] = useState("");

  const [deleteApplication, { isLoading: deleteLoading }] =
    useDeleteApplicationMutation();

  const handleDeleteApplication = async () => {
    try {
      const response = await deleteApplication(deletedInfo).unwrap();
      if (response?.success) {
        setOpenModal(false);
        setDeletedInfo({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyCMD = (data, index) => {
    const applicationOpenUrl = `https://payment.ivacbd.com/?applicationId=${data?._id}&auth=${auth}`;
    // const applicationOpenUrl = `${envConfig.appBaseUrl}/?applicationId=${data?._id}&auth=${auth}`;

    // Define the path to the extension (update this path as needed)
    const extensionPath = "C:\\ext\\it-hub";
    // const extensionPath = "D:\\It-Hub\\chorom-ext";

    // Define the CMD script
    //   const comment = `
    // @echo off

    // REM Define the URL to open
    // set "URL=${applicationOpenUrl}"

    // REM Define the path to the temporary user data directory
    // set "TEMP_PROFILE_DIR=%TEMP%\\ChromeTempProfile${index}"

    // REM Define the path to the extension
    // set "EXTENSION_PATH=${extensionPath}"

    // REM Ensure the temporary directory exists
    // if not exist "%TEMP_PROFILE_DIR%" mkdir "%TEMP_PROFILE_DIR%"

    // REM Open Chrome with the temporary user data directory and load the extension
    // start "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --user-data-dir="%TEMP_PROFILE_DIR%" --load-extension="%EXTENSION_PATH%" --new-window "%URL%" --window-size=500,800

    // REM Close the CMD prompt after opening Chrome
    // exit
    // `;

    const command = `
  @echo off

REM Define the URL to open
set "URL=${applicationOpenUrl}"

REM Define the path to the temporary user data directory
set "TEMP_PROFILE_DIR=%TEMP%\\ChromeTempProfile${index}"

REM Define the path to the extension
set "EXTENSION_PATH=${extensionPath}"

REM Define the path to Chrome executable
set "CHROME_PATH=C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

REM Ensure the temporary directory exists
if not exist "%TEMP_PROFILE_DIR%" mkdir "%TEMP_PROFILE_DIR%"

REM Check if Chrome executable exists
if exist "%CHROME_PATH%" (
    REM Open Chrome with the temporary user data directory and load the extension
    start "" "%CHROME_PATH%" --user-data-dir="%TEMP_PROFILE_DIR%" --load-extension="%EXTENSION_PATH%" --new-window "%URL%" --window-size=500,800
) else (
    echo Chrome executable not found at "%CHROME_PATH%"
    pause
)

REM Close the CMD prompt after opening Chrome
exit
  `;

    // Copy the CMD script to the clipboard
    navigator.clipboard
      .writeText(command)
      .then(() => {
        setIsCopied({
          status: true,
          id: data?._id,
        });
      })
      .catch((error) => {
        console.error("Failed to copy CMD script:", error);
      });
  };

  const handleCopySMSLink = (data, index) => {
    const baseUrl = envConfig?.backendBaseUrl;
    const smsLink = `${baseUrl}/api/v1/messages/${data?.phone}?msg=`;

    navigator.clipboard
      .writeText(smsLink)
      .then(() => {
        setIsSmsLinkCopied({
          status: true,
          id: data?._id,
        });
      })
      .catch((error) => {
        console.error("Failed to copy CMD script:", error);
      });
  };

  useEffect(() => {
    if (isCopyed?.id && isCopyed?.status) {
      setTimeout(() => {
        setIsCopied({
          status: false,
          id: "",
        });
      }, 3000);
    }
  }, [isCopyed]);

  useEffect(() => {
    if (isSmsLinkCopied?.id && isSmsLinkCopied?.status) {
      setTimeout(() => {
        setIsSmsLinkCopied({
          status: false,
          id: "",
        });
      }, 3000);
    }
  }, [isSmsLinkCopied]);

  useEffect(() => {
    if (!auth) {
      chrome.storage.local.get(["logData"], (result) => {
        const token = result.logData?.token;
        if (token) {
          setAuth(token);
        }
      });
    }
  }, []);

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
                sx={{ minWidth: "1200px", overflow: "hidden" }}
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
                      const isCopySMSLink = isSmsLinkCopied?.id === row?._id;
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

                            {row?.accountNumber && row?.pinNumber && (
                              <>
                                <StyledTypo>
                                  Account: {row?.accountNumber}
                                </StyledTypo>
                                <StyledTypo>Pin: {row?.pinNumber}</StyledTypo>
                              </>
                            )}
                            <StyledTypo>
                              Payment: {row?.info?.length * 824}tk
                            </StyledTypo>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                backgroundColor: `#FDF3E6 !important`,
                                color: `#EE9322 !important`,
                                textAlign: "center",
                                padding: "10px 12px",
                                borderRadius: "4px",
                                fontSize: "14px",
                                fontWeight: 500,
                                lineHeight: "21px",
                              }}
                            >
                              On going
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{}}>
                            {isDuePending ? (
                              <Box
                                sx={{
                                  width: "150px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: "red",
                                    fontWeight: 600,
                                    lineHeight: "16px",
                                  }}
                                >
                                  No actions available due to outstanding dues.
                                </Typography>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  width: "200px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "5px",
                                  width: "100%",
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{ width: "100%" }}
                                >
                                  <Button
                                    onClick={() => {
                                      setUpdatedValues(row);
                                      setOpenUpdateModal(true);
                                    }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                      textTransform: "none",
                                      width: "100%",
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setDeletedInfo(row);
                                      setOpenModal(true);
                                    }}
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    sx={{
                                      textTransform: "none",
                                      width: "100%",
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{ width: "100%" }}
                                >
                                  <Button
                                    onClick={() => handleCopyCMD(row, i)}
                                    startIcon={
                                      isCMDCopyed ? (
                                        <CheckCircleOutlineRounded />
                                      ) : (
                                        <InsertLinkRounded
                                          sx={{ rotate: "-45deg" }}
                                        />
                                      )
                                    }
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      textTransform: "none",
                                      width: "100%",
                                      bgcolor: isCMDCopyed ? "#5CB338" : "#000",
                                      fontWeight: isCMDCopyed ? 600 : 500,
                                      color: "#FFF",
                                      "&:hover": {
                                        bgcolor: isCMDCopyed
                                          ? "#5CB338"
                                          : "#000",
                                        color: "#FFF",
                                      },
                                    }}
                                  >
                                    {isCMDCopyed ? "Copied" : "CMD Link"}
                                  </Button>

                                  <Button
                                    onClick={() => handleCopySMSLink(row, i)}
                                    startIcon={
                                      isCopySMSLink ? (
                                        <CheckCircleOutlineRounded />
                                      ) : (
                                        <ContentCopyRoundedIcon />
                                      )
                                    }
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      textTransform: "none",
                                      width: "100%",
                                      bgcolor: isCopySMSLink
                                        ? "#5CB338"
                                        : "#000",
                                      fontWeight: isCopySMSLink ? 600 : 500,
                                      color: "#FFF",
                                      "&:hover": {
                                        bgcolor: isCopySMSLink
                                          ? "#5CB338"
                                          : "#000",
                                        color: "#FFF",
                                      },
                                    }}
                                  >
                                    {isCopySMSLink ? "Copied" : "SMS App"}
                                  </Button>
                                </Stack>
                              </Box>
                            )}
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

      <Modal
        open={openModal}
        onClose={() => {
          setDeletedInfo({});
          setOpenModal(false);
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to delete this application?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Button
              disabled={deleteLoading}
              size="small"
              onClick={() => {
                setOpenModal(false);
                setDeletedInfo({});
              }}
              variant="contained"
              color="error"
              sx={{
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={deleteLoading}
              size="small"
              onClick={handleDeleteApplication}
              variant="contained"
              sx={{
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ApplicationsTable;
