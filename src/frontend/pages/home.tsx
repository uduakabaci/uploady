import { useState } from "react";
import HealthCard from "../components/health-card";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import { trpc } from "../trpc/client";

const AUTH_TOKEN_STORAGE_KEY = "uploady-app.authToken";

function hasAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return Boolean(token && token.trim().length > 0);
}

export default function HomePage() {
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
      <header className="panel-dashed mb-6 p-5 md:p-6">
        <p className="eyebrow-tag inline-flex px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]">
          uploady.app
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Flat frontend system is ready</h1>
        <p className="muted-copy mt-3 max-w-2xl text-sm md:text-base">
          API requests now run through tRPC at <code>/trpc</code> with zod-validated inputs.
        </p>
        <p className="muted-copy mt-2 max-w-2xl text-xs">
          Protected procedures require <code>Authorization: Bearer &lt;jwt&gt;</code>. Local dev token key is
          <code> uploady-app.authToken</code>.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="outline">Outline Action</Button>
        </div>
      </header>

      <section className="panel-solid mb-4 grid gap-4 p-5 md:grid-cols-2 md:p-6">
        <Input
          label="Magic Link Email"
          value={emailPreview}
          onChange={event => setEmailPreview(event.target.value)}
          placeholder="name@company.com"
          hint="Used as the login identifier for magic links"
        />
        <Select
          label="Default Storage Tier"
          value={storageTier}
          onChange={event => setStorageTier(event.target.value)}
          hint="Example select component with sharp corners"
          options={[
            { value: "standard", label: "Standard" },
            { value: "archive", label: "Archive" },
            { value: "infrequent", label: "Infrequent Access" },
          ]}
        />
      </section>

      <HealthCard
        result={healthQuery.data}
        error={healthQuery.error ?? null}
        isLoading={healthQuery.isLoading}
      />

      <section className="panel-dashed mt-4 p-5 text-sm md:p-6">
        <h2 className="text-lg font-semibold tracking-tight">auth.me</h2>
        {!tokenPresent ? <p className="muted-copy mt-2">No bearer token found in local storage.</p> : null}
        {tokenPresent && meQuery.isLoading ? <p className="muted-copy mt-2">Verifying token...</p> : null}
        {tokenPresent && meQuery.error ? (
          <p className="mt-2 text-[#7d1a34]">{meQuery.error.message}</p>
        ) : null}
        {tokenPresent && meQuery.data ? (
          <p className="mt-2 text-[#0f6f2f]">Authenticated as user: {meQuery.data.id}</p>
        ) : null}
      </section>
    </main>
  );
}
