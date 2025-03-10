import { Box, Button, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import InputField from "../ManageApplications/Modal/InputField";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const [initialValues, setInitialValues] = useState({
    username: "",
    password: "",
  });

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = async (values) => {
    try {
      const response = await login(values).unwrap();
      console.log(response);
      chrome.storage.local.set(
        {
          loggedIn: true,
          logData: response?.data,
        },
        () => {
          setInitialValues({
            username: "",
            password: "",
          });
          window.location.reload();
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          border: { xs: "none", md: "1px solid rgba(0, 0, 0, 0.12)" },
          borderRadius: "8px",
          width: { xs: "100%", md: "400px" },
          padding: "2rem",
          boxShadow: { xs: "none", md: "0 0 10px 0 rgba(0, 0, 0, 0.2)" },
        }}
      >
        <Box
          sx={{
            paddingTop: { xs: "50px", md: "0px" },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: "28px",
              //   color: theme.colorConstants.darkBlue,
            }}
          >
            It-Hub
          </Typography>

          <Typography
            variant="body1"
            sx={{
              paddingY: "20px",
              fontWeight: 500,
            }}
          >
            Login to your account
          </Typography>
        </Box>

        <Box marginTop="20px">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <Form>
                <Box marginTop={"20px"}>
                  <InputField
                    name="username"
                    label="Enter Username"
                    type="text"
                    placeholder="eg. shohag"
                  />
                </Box>

                <Box marginTop={"20px"}>
                  <InputField
                    name="password"
                    label="Enter Password"
                    type="password"
                    placeholder="********"
                  />

                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: "right",
                        fontSize: "14px",
                        marginTop: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Forgot password ?
                    </Typography>
                  </Box>

                  {isError && (
                    <Box>
                      <Typography sx={{ fontSize: "12px", color: "red" }}>
                        {error?.data?.message}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ marginY: "50px" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        width: "150px",
                        height: "40px",
                      }}
                    >
                      {isLoading ? "Loading..." : "Login"}
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
