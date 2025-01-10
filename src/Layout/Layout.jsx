import React, { useEffect, useState } from "react";
import Footor from "./Footor";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [minHeight, setMinHeight] = useState("550px");

  useEffect(() => {
    const updateMinHeight = () => {
      if (window.innerWidth <= 580) {
        setMinHeight("auto");
      } else {
        setMinHeight("580px");
      }
    };

    updateMinHeight();
    window.addEventListener("resize", updateMinHeight);

    return () => window.removeEventListener("resize", updateMinHeight);
  }, []);

  return (
    <>
      <Navbar />

      <main style={{ minHeight }}>{children}</main>
      
      <Footor />
    </>
  );
}
