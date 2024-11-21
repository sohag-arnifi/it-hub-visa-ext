import React, { useState } from "react";

const SlugButton = ({ onClick, children, active }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const baseStyle = {
    padding: "10px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "10px",
    backgroundColor: active ? "#4379F2" : "#A6AEBF",
    color: "white",
    border: "none",
    cursor: "pointer",
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
      {children}
    </button>
  );
};

export default SlugButton;
