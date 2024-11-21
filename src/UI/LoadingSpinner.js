import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: "5px solid #e0e0e0",
          borderTop: "5px solid #1976d2",
          borderRight: "5px solid #1976d2",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
