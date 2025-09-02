import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GlobalStateProvider } from "./context/globalState";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <GlobalStateProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalStateProvider>
    </ThemeProvider>
  </React.StrictMode>
);
