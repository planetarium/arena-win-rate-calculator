import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { initGA } from "./analytics";

import "./index.css";
import router from "./routes.tsx";

if (import.meta.env.PROD) {
  initGA();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
