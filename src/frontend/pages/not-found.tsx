import Button from "@/frontend/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="panel-solid w-full max-w-xl p-8 text-center">
        <p className="text-ui-6 text-sm uppercase tracking-[0.2em]">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="text-ui-6 mt-2 text-sm">The route does not exist. Return to the home page to continue.</p>
        <div className="mt-6 inline-flex">
          <a href="/">
            <Button variant="primary">Go home</Button>
          </a>
        </div>
      </div>
    </main>
  );
}
