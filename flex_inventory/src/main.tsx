import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./banner/Home";
import CreateReservation from "./CreateReservation";

import ReservationDisplay from "./DesplayReservaion";
import TraditionalTableDisplay from "./TraditionalTableDisplay";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create-reservation",
    element: <CreateReservation />,
  },
  {
    path: "/create-inbound",
    element: <CreateReservation />,
  },
  {
    path: "/display-reservation/:id",
    element: <ReservationDisplay />,
  },
  {
    path: "/traditional-reservation",
    element: <TraditionalTableDisplay />,
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root as HTMLElement).render(
  <RouterProvider router={router} />
);
