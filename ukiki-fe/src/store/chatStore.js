// chatStore.js
import { create } from 'zustand';

const useChatStore = create((set) => ({
  isChatOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setChatOpen: (value) => set({ isChatOpen: value }),
}));

export default useChatStore;
