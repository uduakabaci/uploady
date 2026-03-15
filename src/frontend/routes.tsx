import { createBrowserRouter } from "react-router";
import "@/frontend/styles/index.css";
import HomePage from "@/frontend/pages/home";
import LoginPage from "@/frontend/pages/login";
import NotFoundPage from "@/frontend/pages/not-found";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
