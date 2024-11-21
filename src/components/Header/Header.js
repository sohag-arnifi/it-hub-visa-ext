import React from "react";
// import Logo from "";

const Header = ({ username }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        padding: "3%",
        height: "10vh",
        width: "100%",
      }}
    >
      <h3 style={{ fontSize: "1.4rem", fontWeight: "semibold" }}>IT-Hub.com</h3>
      <h3 style={{ fontSize: "1.2rem", fontWeight: "normal" }}>{username}</h3>
    </div>
  );
};

export default Header;
