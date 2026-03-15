// import Input from ""
import Input from "@/frontend/components/ui/input"
import Button from "@/frontend/components/ui/button"

export default function Page() {
  return (
    <main className="flex items-center h-[90vh]">
      <div className="mx-auto w-full max-w-[500px]">
        <div className="mb-[20px]">
          <h2 className="text-2xl">
            Login
          </h2>
          <p className="text-ui-4">
            Enter your email to receive a magic link to login.
          </p>
        </div>

        <div className="grid gap-y-[10px]">
          <Input label="Email" placeholder="eg. hello@uploady.app" />
          <Button variant="primary">
            Login
          </Button>

        </div>
      </div>
    </main>
  );
}
