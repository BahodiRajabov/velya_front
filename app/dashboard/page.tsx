"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InstagramAccountSelector } from "@/components/instagram-account-selector";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatArea } from "@/components/chat-area";
import { useAppStore } from "@/lib/store";


const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const { clearState } = useAppStore();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        clearState();
      }
    };
    getUser();
  }, [supabase, clearState]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearState();
    router.refresh();
  };

  const handleConnectInstagram = async () => {
    try {
      setIsConnecting(true);
      const response = await fetch(`http://localhost:8080/auth/instagram?profileId=${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Failed to initiate Instagram connection:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-16">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              {user && (
                <InstagramAccountSelector
                  profileId={user.id}
                  onConnectInstagram={handleConnectInstagram}
                  isConnecting={isConnecting}
                />
              )}
            </div>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {user ? (
          <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-sm border min-h-[calc(100vh-8rem)] flex">
              <ChatSidebar />
              <ChatArea currentUserId={user.id} />
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl font-bold mb-6">Sign in to continue</h1>
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 