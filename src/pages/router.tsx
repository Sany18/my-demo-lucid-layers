import { createBrowserRouter } from "react-router-dom";
import luciadria_development from "../assets/luciad/license/luciadria_development.txt";

import App from "./App";

const BASE_PATH = "/luciad-map-demo/";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/assets/luciad/license/luciadria_development.txt",
    element: luciadria_development,
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  }
], {
  basename: BASE_PATH,
});
