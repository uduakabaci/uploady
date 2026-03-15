import Button from "@/frontend/components/ui/button";
import Input from "@/frontend/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <section className="mt-[20px] mb-[60px]">
        <h1 className="text-ui-0 text-2xl font-semibold">Settings</h1>
        <p className="text-ui-3 mt-1 text-sm">Update your workspace profile, notifications, and account preferences.</p>
      </section>

      <section className=" grid gap-4  md:grid-cols-2">
        <Input label="Workspace Name" defaultValue="uploady.app" />
        <Input label="Support Email" defaultValue="support@uploady.app" />
      </section>

      <section className="panel-dashed p-5 md:p-6">
        <h2 className="text-ui-0 text-lg font-semibold">Danger Zone</h2>
        <p className="text-ui-3 mt-1 text-sm">Archive your workspace and revoke all active sessions.</p>
        <div className="mt-4">
          <Button className="border-red-4 bg-red-4 text-ui-0 hover:border-red-3 hover:bg-red-3" variant="outline">
            Archive Workspace
          </Button>
        </div>
      </section>
    </div>
  );
}
