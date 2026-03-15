import Button from "@/frontend/components/ui/button";

export default function SubscriptionPage() {
  return (
    <div className="space-y-4">
      <section className="panel-solid p-5 md:p-6">
        <h1 className="text-ui-0 text-2xl font-semibold">Subscription</h1>
        <p className="text-ui-3 mt-1 text-sm">
          Manage your plan, billing cycle, and usage limits for uploady.app.
        </p>
      </section>

      <section className="panel-dashed p-5 md:p-6">
        <p className="text-ui-0 text-lg font-semibold">Premium Starter Plan</p>
        <p className="text-ui-3 mt-1 text-sm">1 TB storage, priority support, and team sharing capabilities.</p>
        <div className="mt-4 flex gap-3">
          <Button variant="primary">Upgrade Plan</Button>
          <Button variant="outline">View Invoices</Button>
        </div>
      </section>
    </div>
  );
}
