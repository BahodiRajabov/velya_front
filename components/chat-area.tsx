"use client";

import { useEffect, useState } from "react";
import { Send, Image, User, Calendar, Phone, Tag, UserCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from "@supabase/ssr";
import { useAppStore } from "@/lib/store";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  currentUserId: string;
}

export function ChatArea({ currentUserId }: Props) {
  const { selectedChat } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [showCustomerPanel, setShowCustomerPanel] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Extract fetchMessages outside useEffect so it can be called from button click
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      // Only set isLoading to true on initial load, not on refresh
      if (!isRefreshing) {
        setIsLoading(true);
      }
      
      const { data, error } = await supabase
        .from("instagram_messages")
        .select(`
          id,
          chat_id,
          instagram_message_id,
          sender_id,
          recipient_id,
          type,
          message_type,
          message_timestamp,
          metadata
        `)
        .eq("chat_id", selectedChat.id)
        .order("message_timestamp", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat, supabase]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const messageText = messageInput.trim();
    setMessageInput(""); // Clear input immediately for better UX
    
    try {
      // Send message using human agent endpoint
      const response = await fetch('https://autosms.mindell.ai/messages/human-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: selectedChat.id,
          recipientPsid: selectedChat.participant_sid,
          message: messageText
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Get the response data
      const responseData = await response.json();
      console.log("Message sent successfully:", responseData);
      
      // Create a new message object with the actual message_id from the response
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        chat_id: selectedChat.id,
        instagram_message_id: responseData.result?.message_id || `local-${Date.now()}`,
        sender_id: currentUserId,
        recipient_id: responseData.result?.recipient_id || selectedChat.participant_sid,
        type: 'outgoing',
        message_type: 'text',
        message_timestamp: Date.now(),
        metadata: {
          text: messageText
        }
      };
      
      // Add the new message to the messages array
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      // Restore the message input if sending failed
      setMessageInput(messageText);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white h-full">
        {/* Chat Header */}
        <div className="px-6 py-3 border-b bg-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Instagram Account Avatar with Fallback */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border border-gray-200">
              {selectedChat.metadata?.participantProfile?.profile_pic ? (
                <img
                  src={selectedChat.metadata.participantProfile.profile_pic}
                  alt={selectedChat.metadata?.participantProfile?.name || ""}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">
                  {selectedChat.metadata?.participantProfile?.name || selectedChat.metadata?.participantProfile?.username || selectedChat.participant_sid}
                </p>
                {selectedChat.metadata.customer && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Customer
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                @{selectedChat.metadata?.participantProfile?.username || selectedChat.participant_sid}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center"
              title="Refresh messages"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {/* Toggle Customer Panel Button */} 
            {selectedChat.metadata.customer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomerPanel(!showCustomerPanel)}
              >
                <User className="w-4 h-4 mr-2" />
                {showCustomerPanel ? 'Hide Details' : 'Show Details'}
              </Button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 h-full">
          <div className="h-full flex flex-col">
            <div className="p-6 space-y-4">
              {isLoading ? (
                <div className="text-center text-gray-500 py-4">Loading messages...</div>
              ) : isRefreshing ? (
                <div className="text-center text-gray-500 py-4">Refreshing messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No messages yet</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    // Consider a message outgoing if it's from the current user or explicitly marked as outgoing
                    const isOutgoing = message.sender_id === currentUserId || message.type === "outgoing" || message.type === "human_agent";
                    return (
                      <div key={message.id} className={`flex flex-col ${isOutgoing ? "items-end" : "items-start"}`}>
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2 max-w-[70%] relative shadow-sm",
                            isOutgoing
                              ? "bg-blue-500 text-white rounded-tr-none"
                              : "bg-white border border-gray-100 rounded-tl-none"
                          )}
                        >
                          {message.message_type === "text" && <p>{message.metadata.text}</p>}
                          {(message.message_type === "image" || message.message_type === "video") && message.metadata.attachments && (
                            <div className="space-y-2">
                              {message.metadata.attachments.map((attachment: any, index: number) => (
                                <div key={index}>
                                  {message.message_type === "image" && (
                                    <img
                                      src={attachment.url}
                                      alt="Shared media"
                                      className="rounded-lg max-w-full"
                                    />
                                  )}
                                  {message.message_type === "video" && (
                                    <video
                                      src={attachment.url}
                                      controls
                                      className="rounded-lg max-w-full"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Reaction display */}
                          {message.metadata.reaction && (
                            <div 
                              className={`absolute ${isOutgoing ? '-left-6' : '-right-6'} -bottom-2 bg-white rounded-full p-1 shadow-sm border border-gray-100`}
                            >
                              <span className="text-sm">{message.metadata.reaction.emoji}</span>
                            </div>
                          )}
                        </div>
                        {/* Read status for outgoing messages */}
                        {isOutgoing && message.metadata.isRead && (
                          <div className="text-xs text-gray-500 mt-1">
                            Read {new Date(message.metadata.readTimestamp).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Image className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
              />
            </div>
            <Button
              size="icon"
              className="rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Info Panel - Right Side */}
      {selectedChat.metadata.customer && showCustomerPanel && (
        <div className="w-80 border-l bg-white overflow-y-auto">
          <div className="p-6">
            {/* Customer Profile Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
                {selectedChat.metadata?.participantProfile?.profile_pic ? (
                  <img
                    src={selectedChat.metadata.participantProfile.profile_pic}
                    alt={selectedChat.metadata?.participantProfile?.name || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Customer Profile</h3>
                {selectedChat.metadata.last_updated && (
                  <p className="text-xs text-gray-500">
                    Updated {new Date(selectedChat.metadata.last_updated).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Customer Details Sections */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium">{selectedChat.metadata?.participantProfile?.name || "Not provided"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="text-sm font-medium">@{selectedChat.metadata?.participantProfile?.username || selectedChat.participant_sid}</p>
                  </div>
                  {selectedChat.metadata?.participantProfile?.follower_count !== undefined && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Followers</p>
                      <p className="text-sm font-medium">{selectedChat.metadata.participantProfile.follower_count}</p>
                    </div>
                  )}
                  {selectedChat.metadata?.participantProfile?.is_verified_user !== undefined && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Verified</p>
                      <p className="text-sm font-medium">{selectedChat.metadata.participantProfile.is_verified_user ? "Yes" : "No"}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Interests */}
              {selectedChat.metadata.customer.interests && selectedChat.metadata.customer.interests.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <h4 className="text-sm font-medium text-gray-500">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChat.metadata.customer.interests.map((interest: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-2.5 py-1 bg-white text-blue-700 rounded-full text-xs font-medium border border-blue-100"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Stats */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Activity</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">First Contact</p>
                    <p className="font-medium">
                      {new Date(selectedChat.last_interaction).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Total Messages</p>
                    <p className="font-medium">{messages.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
