"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { InstagramAccount } from "@/lib/types";
import { ArrowLeft, Save } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { selectedAccount } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [context, setContext] = useState("");
  const [maxTokens, setMaxTokens] = useState(256);
  const [account, setAccount] = useState<InstagramAccount | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchAccount = async () => {
      if (!selectedAccount) {
        // If no account is selected, redirect to dashboard
        router.push("/dashboard");
        return;
      }

      setAccount(selectedAccount);
      
      // Only set values if bot_config exists
      if (selectedAccount.bot_config) {
        if (selectedAccount.bot_config.instruction !== undefined) {
          setInstruction(selectedAccount.bot_config.instruction);
        }
        if (selectedAccount.bot_config.context !== undefined) {
          setContext(selectedAccount.bot_config.context);
        }
        if (selectedAccount.bot_config.max_tokens !== undefined) {
          setMaxTokens(selectedAccount.bot_config.max_tokens);
        }
      }
    };

    fetchAccount();
  }, [selectedAccount, router]);

  const handleSaveSettings = async () => {
    if (!account) return;

    try {
      setIsLoading(true);
      
      // Create the updated bot_config object
      const updatedBotConfig = {
        instruction,
        context,
        max_tokens: maxTokens
      };
      
      const { error } = await supabase
        .from("instagram_accounts")
        .update({
          bot_config: updatedBotConfig
        })
        .eq("id", account.id);

      if (error) {
        console.error("Error updating bot config:", error);
        toast.error("Failed to save settings");
        return;
      }

      // Update the selectedAccount in the store with the new bot_config
      const updatedAccount = {
        ...account,
        bot_config: updatedBotConfig
      };
      
      // Update the account in the store
      useAppStore.getState().setSelectedAccount(updatedAccount);
      
      // Update local state
      setAccount(updatedAccount);
      
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error updating bot config:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Toaster />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Bot Settings</h1>
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              {account.instagram_username}
            </h2>
            <p className="text-gray-500 text-sm">
              Configure your Instagram bot settings
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bot-active" className="text-base font-medium">
                  Activate Bot
                </Label>
                <p className="text-sm text-gray-500">
                  Enable automated responses for your Instagram account
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Bot Configuration</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="instruction" className="mb-1 block">
                    Bot Instructions
                  </Label>
                  <Textarea
                    id="instruction"
                    placeholder="Provide instructions on how the bot should respond to messages..."
                    rows={4}
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Give your bot specific guidelines on how to respond to messages
                  </p>
                </div>

                <div>
                  <Label htmlFor="context" className="mb-1 block">
                    Context
                  </Label>
                  <Textarea
                    id="context"
                    placeholder="Provide additional context for the bot..."
                    rows={4}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add additional information that helps the bot understand the context
                  </p>
                </div>

                <div>
                  <Label htmlFor="max-tokens" className="mb-1 block">
                    Max Tokens
                  </Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    min={1}
                    max={2048}
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="w-full max-w-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum length of the generated response
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
