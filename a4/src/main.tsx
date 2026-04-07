import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";

// start the whole app here
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* handle page changes without reloading */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
