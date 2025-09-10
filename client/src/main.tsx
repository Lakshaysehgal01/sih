import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { DrawerProvider } from "./shared-drawer-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DrawerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DrawerProvider>
  </StrictMode>
);
