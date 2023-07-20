import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppState } from "./context/index.jsx";
import { Toaster } from "react-hot-toast";
import "@fontsource/poppins";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppState>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
      <Toaster />
    </AppState>
  </BrowserRouter>
);
