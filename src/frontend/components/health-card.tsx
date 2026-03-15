import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/router";
import type { HealthPayload } from "@/shared/types";

type HealthCardProps = {
  result: HealthPayload | undefined;
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

export default function HealthCard({ result, error, isLoading }: HealthCardProps) {
  return (
    <section className="panel-solid p-5 md:p-6">
      <h2 className="text-lg font-semibold tracking-tight">API Health</h2>
      <p className="muted-copy mt-1 text-sm">Current status of the Bun backend service.</p>

      {isLoading ? <p className="muted-copy mt-4 text-sm">Checking API health...</p> : null}

      {error ? (
        <div className="mt-4 border border-red-2 bg-red-1 px-3 py-2 text-sm text-red-4">
          <p className="font-medium">{error.message}</p>
          <p className="mt-1 text-xs text-red-3">{error.data?.code ?? "TRPC_ERROR"}</p>
        </div>
      ) : null}

      {result ? (
        <dl className="mt-4 grid gap-3 text-sm">
          <div className="flex items-center justify-between border border-[#90e0ef] bg-[#f5fdff] px-3 py-2">
            <dt className="muted-copy">Status</dt>
            <dd className="font-medium text-[#0f6f2f]">{result.status}</dd>
          </div>
          <div className="flex items-center justify-between border border-[#90e0ef] bg-[#f5fdff] px-3 py-2">
            <dt className="muted-copy">Service</dt>
            <dd className="font-medium text-[#0b223b]">{result.service}</dd>
          </div>
          <div className="flex items-center justify-between border border-[#90e0ef] bg-[#f5fdff] px-3 py-2">
            <dt className="muted-copy">Timestamp</dt>
            <dd className="font-medium text-[#0b223b]">{new Date(result.timestamp).toLocaleString()}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
