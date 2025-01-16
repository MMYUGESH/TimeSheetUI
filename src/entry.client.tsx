import React from "react";
import reactDom from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

reactDom.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
