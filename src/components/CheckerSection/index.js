import React, { useState } from "react";
import LoadingSpinner from "../../UI/LoadingSpinner";
import {
  useCheckStepSessionMutation,
  useCheckWebSessionMutation,
} from "../../redux/features/appApi/appApi";

const CheckerButton = ({
  onClick,
  children,
  loading,
  activeStep,
  disabled,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const baseStyle = {
    height: "50px",
    width: "60px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "10px",
    backgroundColor: activeStep >= children ? "#4379F2" : "#A6AEBF",
    color: "white",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 0.3s, transform 0.1s",
  };

  const hoverStyle = isHovered
    ? { backgroundColor: "#1565c0", opacity: 0.8 }
    : {};

  const activeStyle = isActive
    ? { backgroundColor: "#0d47a1", transform: "scale(0.98)" }
    : {};

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...hoverStyle,
        ...activeStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
};

const CheckerSection = ({ checkerFile }) => {
  const [loadingStep, setLoadingStep] = useState(null);
  const [checkStep, setCheckStep] = useState(0);
  const checkSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const webFile = checkerFile?.info[0]?.web_id;

  const [checkWebSession, { isLoading: webSessionLoading }] =
    useCheckWebSessionMutation();

  const [checkStepSession, { isLoading: stepSessionLoading }] =
    useCheckStepSessionMutation();

  const getCheckerData = async (step) => {
    setLoadingStep(step);

    try {
      let response;
      if (step === 1) {
        response = await checkWebSession(webFile).unwrap();
      } else {
        response = await checkStepSession(step).unwrap();
      }

      if (response === false) {
        setCheckStep(step);
      } else {
        setLoadingStep(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        {checkSteps?.map((step) => {
          return (
            <CheckerButton
              onClick={() => getCheckerData(step)}
              disabled={webSessionLoading || stepSessionLoading}
              loading={
                loadingStep === step &&
                (webSessionLoading || stepSessionLoading)
              }
              key={step}
              activeStep={checkStep}
            >
              {step}
            </CheckerButton>
          );
        })}
      </div>
    </div>
  );
};

export default CheckerSection;
