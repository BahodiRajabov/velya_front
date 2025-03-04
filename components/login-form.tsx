"use client";

import * as React from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  action: "sign-in" | "sign-up";
  toastText: string;
  redirectedFrom?: string;
}

export function LoginForm({
  className,
  action = "sign-in",
  toastText,
  redirectedFrom,
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [formState, setFormState] = React.useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const signIn = async () => {
    const { email, password } = formState;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      toast.success(toastText);
    }
    return error;
  };

  const signUp = async () => {
    const { email, password } = formState;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (!error) {
      toast.success(toastText);
    }
    return error;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const error = action === "sign-in" ? await signIn() : await signUp();

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    setIsLoading(false);
    if (action === "sign-in") {
      router.refresh();
      if (redirectedFrom) {
        router.push(redirectedFrom);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div {...props}>
      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formState.email}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              value={formState.password}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>
        </fieldset>

        <div className="mt-4 flex flex-col text-center">
          <Button disabled={isLoading} className="mb-2">
            {isLoading && <LoaderCircle className="mr-2 animate-spin" />}
            {action === "sign-in" ? "Sign In" : "Sign Up"}
          </Button>
          <p className="text-sm text-gray-600">
            {action === "sign-in" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href={`/sign-up${redirectedFrom ? `?redirectedFrom=${redirectedFrom}` : ""}`}
                  className="font-medium text-primary hover:underline"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href={`/sign-in${redirectedFrom ? `?redirectedFrom=${redirectedFrom}` : ""}`}
                  className="font-medium text-primary hover:underline"
                >
                  Sign In
                </Link>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
} 