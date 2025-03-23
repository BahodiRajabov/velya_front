export interface InstagramAccount {
  id: string;
  profile_id: string;
  user_app_scoped_id: string;
  instagram_username: string;
  access_token: string;
  token_expires_at: string;
  status: string;
  metadata: {
    name: string;
    account_type: string;
    profile_picture_url: string;
    followers_count: number;
  };
  bot_active?: boolean;
  bot_config?: {
    instruction?: string;
    context?: string;
    max_tokens?: number;
    [key: string]: any;
  };
}

export interface InstagramChat {
  id: string;
  instagram_account_id: string;
  participant_sid: string;
  state: Record<string, any>;
  usage: Record<string, any>;
  last_interaction: string;
  status: string;
  bot_active: boolean;
  metadata: {
    name?: string;
    profile_picture_url?: string;
    customer?: any;
    last_updated?: string;
    participantProfile?: {
      id: string;
      name?: string;
      username?: string;
      profile_pic?: string;
      follower_count?: number;
      is_verified_user?: boolean;
      is_business_follow_user?: boolean;
      is_user_follow_business?: boolean;
    };
    [key: string]: any;
  };
}

export interface Message {
  id: string;
  chat_id: string;
  instagram_message_id: string;
  sender_id: string;
  recipient_id: string;
  type: string;
  message_type: string;
  message_timestamp: number;
  metadata: {
    text?: string;
    media_url?: string;
    [key: string]: any;
  };
}

export interface AppState {
  selectedAccount: InstagramAccount | null;
  selectedChat: InstagramChat | null;
  setSelectedAccount: (account: InstagramAccount | null) => void;
  setSelectedChat: (chat: InstagramChat | null) => void;
  clearState: () => void;
}
