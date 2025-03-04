import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SignInPage({
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
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm
          action="sign-in"
          toastText="Successfully signed in!"
          redirectedFrom={searchParams.redirectedFrom}
        />
      </div>
    </div>
  );
} 