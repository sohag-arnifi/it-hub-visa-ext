import {
  alpha,
  Box,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Field } from "formik";
import React from "react";

const FormRadioField = ({ name, label, options, inline }) => {
  return (
    <Box
      width={"100%"}
      display={"flex"}
      alignItems={inline ?? false ? "center" : "start"}
      justifyContent={"start"}
      flexDirection={inline ?? false ? "row" : "column"}
      flexWrap={"wrap"}
      gap="2rem"
    >
      <Typography
        variant="body1"
        sx={{
          color: alpha("#1F1D1A", 0.7),
          fontWeight: 500,
          // width: inline ?? false ? "150px" : "100%",
        }}
      >
        {label ?? label}
      </Typography>

      <Box>
        <Field name={name}>
          {({ field, meta }) => (
            <>
              <RadioGroup row {...field} onChange={field.onChange}>
                {options.map((item, i) => (
                  <FormControlLabel
                    key={i}
                    value={item.value}
                    control={<Radio />}
                    label={
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                ))}
              </RadioGroup>
              <FormHelperText error>
                {meta.touched && meta.error}
              </FormHelperText>
            </>
          )}
        </Field>
      </Box>
    </Box>
  );
};

export default FormRadioField;
