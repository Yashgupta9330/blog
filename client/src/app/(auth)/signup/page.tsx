import { ModeToggle } from "@/components/toggle-theme";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex flex-col p-6 w-full max-w-lg"> {/* Increased width */}
        <div className="flex items-center justify-between md:justify-end mb-8">
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full space-y-6"> {/* Adjusting form width */}
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
