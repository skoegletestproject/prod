import React from "react";
import Footor from "./Footor";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const layoutContainerStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const layoutContentStyle = {
    flex: 1,
    padding: "20px", // Adjust padding as needed
  };

  const footorStyle = {
    backgroundColor: "#f8f9fa", // Adjust as needed
    textAlign: "center",
    padding: "10px 0",
    position: "relative",
    width: "100%",
  };

  return (
    <div style={layoutContainerStyle}>
      <Navbar />

      <main style={layoutContentStyle}>{children}</main>

      <Footor style={footorStyle} />
    </div>
  );
}
