import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            fontFamily: "monospace",
            colorBgLayout: "#1e2a3a", // Changed to a soothing dark blue
            colorPrimary: "#4a90e2", // Adjusted primary color to complement the dark theme
          },
        },
        token: {
          colorText: "#e0e0e0", // Lighter text color for better contrast
          colorBgContainer: "#2c3e50", // Dark, soothing container background
          borderRadius: 8,
          fontFamily: "monospace",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
