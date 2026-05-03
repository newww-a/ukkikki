// src/stores/travelPlanStore.js
import create from 'zustand';

const useTravelPlanStore = create((set) => ({
  selectedCard: null,
  voteStarted: false,
  setSelectedCard: (card) => set({ selectedCard: card }),
  setVoteStarted: (vote) => set({ voteStarted: vote }),
}));

export default useTravelPlanStore;
