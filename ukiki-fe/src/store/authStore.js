import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: false,
      userRole: null,
      isAuthenticated: false,
      setUser: (user, role = null) =>
        set({ user, userRole: role, isAuthenticated: Boolean(user) }),
      logout: () =>
        set({ user: false, userRole: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-store', // 로컬 스토리지에 저장될 key 이름
      // getStorage: () => localStorage, // 기본값이 localStorage입니다.
    },
  ),
);

export default useAuthStore;
