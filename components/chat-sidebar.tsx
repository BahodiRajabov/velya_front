"use client";

import { useEffect, useState } from "react";
import { Search, Users, Clock, Star, Bot } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useAppStore } from "@/lib/store";
import { InstagramChat } from "@/lib/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Custom minimalistic switch component
function MinimalisticSwitch({ 
  checked, 
  onChange,
  disabled
}: { 
  checked: boolean;
  onChange: (e: React.MouseEvent) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-green-100" : "bg-gray-100",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <span 
        className={cn(
          "absolute inline-block h-4 w-4 rounded-full transform transition-transform duration-200 ease-in-out shadow-sm",
          checked ? "translate-x-5 bg-green-500" : "translate-x-1 bg-gray-400"
        )}
      />
    </button>
  );
}

// Avatar component with initials
function Avatar({ username }: { username: string }) {
  // Get initials from username (maximum 2 characters)
  const getInitials = (name: string) => {
    if (!name) return "?";
    const nameParts = name.split(/[^a-zA-Z0-9]/); // Split by non-alphanumeric
    const filteredParts = nameParts.filter(part => part.length > 0);
    
    if (filteredParts.length === 0) return name.substring(0, 2).toUpperCase();
    if (filteredParts.length === 1) return filteredParts[0].substring(0, 2).toUpperCase();
    
    return (filteredParts[0][0] + filteredParts[1][0]).toUpperCase();
  };
  
  // Generate a consistent color based on username
  const getColorFromUsername = (username: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-red-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
    ];
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  const initials = getInitials(username);
  const bgColor = getColorFromUsername(username);
  
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
      <div className={`w-full h-full flex items-center justify-center text-white font-medium ${bgColor}`}>
        {initials}
      </div>
    </div>
  );
}

// Chat item component
function ChatItem({ chat, isSelected, onClick }: { 
  chat: InstagramChat; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const [isBotActive, setIsBotActive] = useState(chat.bot_active || false);
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Extract profile data with fallbacks
  const username = chat.metadata?.participantProfile?.username || chat.participant_sid;
  const displayName = chat.metadata?.participantProfile?.name || username;
  
  const toggleBotActive = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the chat selection
    
    try {
      setIsUpdating(true);
      const newStatus = !isBotActive;
      
      const { error } = await supabase
        .from("instagram_chats")
        .update({ bot_active: newStatus })
        .eq("id", chat.id);
        
      if (error) throw error;
      
      setIsBotActive(newStatus);
      toast.success(`Bot ${newStatus ? 'activated' : 'deactivated'} for chat with ${username}`);
    } catch (error) {
      console.error("Error updating bot status:", error);
      toast.error("Failed to update bot status");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 flex items-center gap-3 cursor-pointer transition-colors relative",
        isSelected ? "bg-white" : "hover:bg-gray-50" 
      )}
    >
      <div className="relative">
        <Avatar username={username} />
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
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-blue-600 truncate">
            @{username}
            {chat.metadata.customer && (
              <span className="text-xs text-gray-500 ml-1">• Customer</span>
            )}
          </p>
          <div className="flex items-center gap-1.5">
            <Bot className={cn(
              "w-3.5 h-3.5", 
              isBotActive ? "text-green-500" : "text-gray-300"
            )} />
            <MinimalisticSwitch 
              checked={isBotActive} 
              disabled={isUpdating}
              onChange={toggleBotActive}
            />
          </div>
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
            metadata,
            bot_active
          `
          )
          .eq("instagram_account_id", selectedAccount.id)
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
      <div className="w-80 border-r flex items-center justify-center text-gray-500 p-4 text-center">
        <p>Select an Instagram account to view conversations</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-r flex flex-col h-full">
      {/* Search and Filters - Sticky */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0",
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
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0",
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
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0",
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
      <div className="overflow-y-auto bg-gray-50 flex-1">
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
