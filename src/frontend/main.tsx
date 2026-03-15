import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import Layout from "@/frontend/layouts/layout";
import { router } from "@/frontend/routes";
import TRPCProvider from "@/frontend/trpc/provider";

function start() {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  const root = createRoot(rootElement);
  root.render(
    <TRPCProvider>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </TRPCProvider>,
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
