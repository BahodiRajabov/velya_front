"use client";

import * as React from "react";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import GoogleIcon from "../public/google-logo.svg";

interface LoginButtonProps extends ButtonProps {
  text?: string;
  from?: string;
}

export function LoginButton({
  text = "Sign in with Google",
  className,
  from,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  // Create a Supabase client configured to use cookies
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (process.env.NEXT_PUBLIC_AUTH_GOOGLE !== "true") {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={async () => {
        setIsLoading(true);
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${location.origin}/api/auth/callback?from=${from}`,
          },
        });
      }}
      disabled={isLoading}
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="mr-2 animate-spin" />
      ) : (
        <Image
          src={GoogleIcon}
          alt="Google"
          width={20}
          height={20}
          className="mr-2"
        />
      )}
      {text}
    </Button>
  );
}
