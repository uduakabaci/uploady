import { useState } from "react";
import HealthCard from "@/frontend/components/health-card";
import Button from "@/frontend/components/ui/button";
import Input from "@/frontend/components/ui/input";
import Select from "@/frontend/components/ui/select";
import { trpc } from "@/frontend/trpc/client";

const AUTH_TOKEN_STORAGE_KEY = "uploady-app.authToken";

function hasAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return Boolean(token && token.trim().length > 0);
}

export default function Page() {
  const [emailPreview, setEmailPreview] = useState("owner@uploady.app");
  const [storageTier, setStorageTier] = useState("standard");
  const tokenPresent = hasAuthToken();
  const healthQuery = trpc.health.status.useQuery();
  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: tokenPresent,
    retry: false,
  });

  return (
    <main className="flex flex-1 flex-col justify-center">
    </main>
  );
}
