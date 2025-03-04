import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <button className="btn btn-ghost">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
      </Link>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Authentication Error</h1>
          <p className="text-sm text-base-content/60">
            There was a problem with the authentication process. Please try again.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link href="/sign-in">
            <button className="btn btn-primary w-full">
              Back to Sign In
            </button>
          </Link>
          <Link href="/">
            <button className="btn btn-outline w-full">
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 