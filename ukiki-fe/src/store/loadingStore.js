import { create } from 'zustand';

export const useLoadingStore = create((set) => ({
  loading: false, // 기본 로딩 상태
  setLoading: (isLoading) => set({ loading: isLoading }), // 로딩 상태 변경 함수
}));
