import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const rootEl = document.getElementById("root");

window.addEventListener('error', (e) => {
  if (rootEl) rootEl.innerHTML = `<div style="color:red;padding:20px;"><h1>Error</h1><pre>${e.error?.stack || e.message}</pre></div>`;
});
window.addEventListener('unhandledrejection', (e) => {
  if (rootEl) rootEl.innerHTML = `<div style="color:red;padding:20px;"><h1>Promise Error</h1><pre>${e.reason?.stack || e.reason}</pre></div>`;
});

if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}
