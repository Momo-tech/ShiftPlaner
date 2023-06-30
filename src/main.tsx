import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colors: {
          "yellow-green-crayola": [
            "#d4ded9",
            "#a9bdb4",
            "#7e9b8e",
            "#698b7b",
            "#537a69",
            "#3e6a56",
            "#285943",
            "#183528",
            "#142d22",
            "#040907",
          ],
        },
        primaryShade: 6,
        primaryColor: "yellow-green-crayola",
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
