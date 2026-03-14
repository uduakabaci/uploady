export default function NotFoundPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-300">The route does not exist. Return to the home page to continue.</p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
        >
          Go home
        </a>
      </div>
    </main>
  );
}
