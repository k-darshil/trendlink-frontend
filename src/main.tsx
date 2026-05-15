/**
 * main.tsx
 * --------
 * The entry point of the React application.
 * This is the first file that runs when the browser loads the app.
 * It mounts the <App /> component into the <div id="root"> in index.html.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Global styles including Tailwind CSS

// Find the <div id="root"> element in index.html and mount React inside it
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode helps catch common mistakes during development
  // It runs some checks twice — this is normal and only happens in dev mode
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
