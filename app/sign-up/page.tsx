import { auth } from "@/auth";
import { LoginButton } from "@/components/login-button";
import { LoginForm } from "@/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { redirectedFrom?: string };
}) {
  const cookieStore = cookies();
  const user = await auth({ cookieStore });
  
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeftIcon className="mr-1 w-5 h-5" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Sign up with email</h1>
          <p className="mt-2 text-gray-600">
            Create an account to get started
          </p>
        </div>
        <LoginForm
          action="sign-up"
          toastText="Verification email sent! Please check your inbox."
          redirectedFrom={searchParams.redirectedFrom}
        />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <LoginButton text="Continue with Google" className="w-full" />
      </div>
    </div>
  );
} 