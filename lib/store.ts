import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from './types';

// Helper functions to handle ID formatting
const formatAccountId = (id: string) => `id_${id}`;
const parseAccountId = (formattedId: string | null) => 
  formattedId ? formattedId.replace('id_', '') : null;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedAccount: null,
      selectedChat: null,
      setSelectedAccount: (account) => {
        if (account) {
          // Format the ID when storing
          const formattedAccount = {
            ...account,
            id: formatAccountId(account.id)
          };
          set({ selectedAccount: formattedAccount });
        } else {
          set({ selectedAccount: null });
        }
      },
      setSelectedChat: (chat) => set({ selectedChat: chat }),
      clearState: () => set({ selectedAccount: null, selectedChat: null }),
      // Helper to get the raw account ID for API calls
      getSelectedAccountRawId: () => {
        const state = get();
        return state.selectedAccount ? parseAccountId(state.selectedAccount.id) : null;
      }
    }),
    {
      name: 'app-storage',
    }
  )
);
