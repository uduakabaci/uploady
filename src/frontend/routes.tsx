import { createBrowserRouter, Navigate } from "react-router";
import "@/frontend/styles/index.css";
import AppLayout from "@/frontend/layouts/app-layout";
import DashboardPage from "@/frontend/pages/dashboard";
import LoginPage from "@/frontend/pages/login";
import NotFoundPage from "@/frontend/pages/not-found";
import SettingsPage from "@/frontend/pages/settings";
import SubscriptionPage from "@/frontend/pages/subscription";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "subscription", element: <SubscriptionPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
