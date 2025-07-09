import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";

import App from "../App";
import { routeGenerator } from "../libs/routesGenerator";
import { AdminRoutes } from "./admin.routes";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import GuestRoute from "../components/layout/GuestRoute";

const routes = [
  {
    path: "/",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute role="admin">
        <App />
      </ProtectedRoute>
    ),
    children: routeGenerator(AdminRoutes),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

export default router;
