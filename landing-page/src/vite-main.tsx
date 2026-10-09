import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { WeddingLanding } from "./components/WeddingLanding";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WeddingLanding />
  </React.StrictMode>,
);
