import { createBrowserRouter } from "react-router";
import "./styles/index.css";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/not-found";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "*", element: <NotFoundPage /> },
]);
