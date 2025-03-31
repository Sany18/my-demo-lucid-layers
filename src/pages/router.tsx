import { createBrowserRouter } from "react-router-dom";

import App from "./App";

const BASE_PATH = "/luciad-map-demo/";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  }
], {
  basename: BASE_PATH,
});
