import { createBrowserRouter } from "react-router-dom";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import Store from "../models/store.model.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Role />,
  },
  {
    path: "/add",
    element: <User />,
  },
  {
    path: "/edit/:id",
    element: <Store />,
  },
]);

export default router;
