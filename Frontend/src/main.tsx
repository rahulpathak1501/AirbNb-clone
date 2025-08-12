// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // if you're using Tailwind or global styles
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./context/AuthContext";
import "./style/theme.css";
import "./style/common.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
