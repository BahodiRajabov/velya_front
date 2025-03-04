"use client";

import { useEffect, useState } from "react";
import { Instagram, ChevronDown, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createBrowserClient } from "@supabase/ssr";
import { useAppStore } from "@/lib/store";
import { InstagramAccount } from "@/lib/types";

interface Props {
  profileId: string;
  onConnectInstagram: () => void;
  isConnecting: boolean;
}

function AccountItem({
  account,
  isSelected,
  onClick,
}: {
  account: InstagramAccount;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <DropdownMenuItem
      className="px-4 py-3 focus:bg-gray-50 cursor-pointer"
      onSelect={onClick}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
            {!imageError && account.metadata.profile_picture_url ? (
              <img
                src={account.metadata.profile_picture_url}
                alt={account.instagram_username}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <UserCircle className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-500"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">@{account.instagram_username}</p>
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-gray-500 font-medium px-1.5 py-0.5 bg-gray-100 rounded-full">
              {account.metadata.account_type}
            </span>
            <span className="block w-1 h-1 rounded-full bg-gray-300"></span>
            <p className="text-xs text-gray-500">{account.metadata.followers_count} followers</p>
          </div>
        </div>
      </div>
    </DropdownMenuItem>
  );
}

export function InstagramAccountSelector({ profileId, onConnectInstagram, isConnecting }: Props) {
  const { selectedAccount, setSelectedAccount } = useAppStore();
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [triggerImageError, setTriggerImageError] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from("instagram_accounts")
          .select("*")
          .eq("profile_id", profileId)
          .eq("status", "active");

        if (error) throw error;

        setAccounts(data || []);
        // Select first account by default if none selected
        if (data && data.length > 0 && !selectedAccount) {
          setSelectedAccount(data[0]);
        }
      } catch (error) {
        console.error("Error fetching Instagram accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (profileId) {
      fetchAccounts();
    }
  }, [profileId, selectedAccount, setSelectedAccount, supabase]);

  if (isLoading) {
    return (
      <Button variant="ghost" className="font-medium text-base gap-2 hover:bg-gray-50 px-3 h-9">
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="font-medium text-base gap-2 hover:bg-gray-50 px-3 h-9">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border bg-white flex items-center justify-center">
              {selectedAccount && selectedAccount.metadata.profile_picture_url && !triggerImageError ? (
                <img
                  src={selectedAccount.metadata.profile_picture_url}
                  alt={selectedAccount.instagram_username}
                  className="w-full h-full object-cover"
                  onError={() => setTriggerImageError(true)}
                />
              ) : (
                <UserCircle className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <span>{selectedAccount ? `@${selectedAccount.instagram_username}` : "Select Account"}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 bg-white shadow-lg border rounded-xl">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Switch Account</h3>
        </div>
        <div className="py-2">
          {accounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              isSelected={selectedAccount?.id === account.id}
              onClick={() => setSelectedAccount(account)}
            />
          ))}
        </div>
        <div className="border-t">
          <DropdownMenuItem
            className="px-4 py-3 focus:bg-gray-50"
            onSelect={(e) => {
              e.preventDefault();
              onConnectInstagram();
            }}
          >
            <div className="flex items-center gap-2 text-blue-600 w-full">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                {isConnecting ? (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Instagram className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-medium">
                {isConnecting ? "Connecting..." : "Connect New Account"}
              </span>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 