"use client";

import { useEffect, useState } from "react";
import { Search, Users, Clock, Star, Settings, ChevronDown, UserCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useAppStore } from "@/lib/store";
import { InstagramChat } from "@/lib/types";
import { cn } from "@/lib/utils";
// Chat item component with image error handling
function ChatItem({ chat, isSelected, onClick }: { 
  chat: InstagramChat; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  
  // Extract profile data with fallbacks
  const profilePic = chat.metadata?.participantProfile?.profile_pic || null;
  const username = chat.metadata?.participantProfile?.username || chat.participant_sid;
  const displayName = chat.metadata?.participantProfile?.name || username;
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 flex items-center gap-3 hover:bg-white cursor-pointer transition-colors",
        isSelected ? "bg-white shadow-sm" : ""
      )}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
          {profilePic && !imageError ? (
            <img
              src={profilePic}
              alt={username}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <UserCircle className="w-7 h-7 text-gray-400" />
          )}
        </div>
        {chat.metadata.customer && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">
            {displayName}
          </p>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {new Date(chat.last_interaction).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-blue-600">
            @{username}
          </p>
          {chat.metadata.customer && (
            <span className="text-xs text-gray-500">• Customer</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatSidebar() {
  const {
    selectedAccount,
    selectedChat,
    setSelectedChat,
    getSelectedAccountRawId,
  } = useAppStore();
  const [chats, setChats] = useState<InstagramChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<'all' | 'customers' | 'recent'>('all');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchChats = async () => {
      if (!selectedAccount?.id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("instagram_chats")
          .select(
            `
            id,
            instagram_account_id,
            participant_sid,
            state,
            usage,
            last_interaction,
            status,
            metadata
          `
          )
          .eq("instagram_account_id", getSelectedAccountRawId())
          .eq("status", "active")
          .order("last_interaction", { ascending: false });

        if (error) throw error;
        setChats(data || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [selectedAccount?.id, supabase]);

  const filteredChats = chats.filter((chat) => {
    const participantId = chat.participant_sid.toLowerCase();
    const name = (chat.metadata.name || "").toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = participantId.includes(searchLower) || 
                         name.includes(searchLower);
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'customers':
        return !!chat.metadata.customer;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(chat.last_interaction) > oneWeekAgo;
      default:
        return true;
    }
  });

  if (!selectedAccount) {
    return (
      <div className="w-[380px] border-r flex flex-col items-center justify-center text-gray-500 p-4 text-center">
        <p>Select an Instagram account to view conversations</p>
      </div>
    );
  }

  return (
    <div className="w-[380px] border-r flex flex-col bg-gray-50">
      {/* Search and Filters */}
      <div className="p-4 border-b bg-white space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === 'all' 
                ? "bg-blue-100 text-blue-700" 
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Users className="w-4 h-4" />
            All
          </button>
          <button
            onClick={() => setFilter('customers')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === 'customers' 
                ? "bg-blue-100 text-blue-700" 
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Star className="w-4 h-4" />
            Customers
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === 'recent' 
                ? "bg-blue-100 text-blue-700" 
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Clock className="w-4 h-4" />
            Recent
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Loading conversations...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <ChatItem 
                key={chat.id}
                chat={chat}
                isSelected={selectedChat?.id === chat.id}
                onClick={() => setSelectedChat(chat)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
