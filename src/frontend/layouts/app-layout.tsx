import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "@/frontend/components/sidebar";
import Button from "@/frontend/components/ui/button";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ui-8 text-ui-0">
      <div className="hidden w-72 lg:block">
        <Sidebar />
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="h-full flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          <div className="w-72 border-l border-ui-6">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ui-6 bg-ui-7 px-4 py-3 lg:hidden">
          <p className="text-ui-0 text-sm font-semibold uppercase tracking-[0.12em]">uploady.app</p>
          <Button variant="outline" size="sm" onClick={() => setSidebarOpen(true)}>
            Menu
          </Button>
        </header>

        <main className="w-full p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
