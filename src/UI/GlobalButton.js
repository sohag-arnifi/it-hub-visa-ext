import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const GlobalButton = ({ onClick, children, loading, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const baseStyle = {
    height: "40px",
    width: "150px",
    fontSize: "1rem",
    fontWeight: "semibold",
    borderRadius: "5px",
    backgroundColor: "#1565c0",
    color: "white",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.2 : 1,
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

export default GlobalButton;
