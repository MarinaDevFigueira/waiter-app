import { LoginForm } from "@/pages/login/components/login-form/login-form";

export function LoginPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-secondary/30 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
      <div className="w-full h-full max-w-7xl max-h-[720px] flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
