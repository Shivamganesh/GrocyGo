import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';
interface authStore {
  user: Record<string, any> | null;
  setUser: (user: any) => void;
  setUserProfileImage: (image: string | null) => void;
  currentOrder: Record<string, any> | null;
  setCurrentOrder: (order: any) => void;
  logout: () => void;
}

export const useAuthStore = create<authStore>()(
  persist(
    (set, get) => ({
      user: null,
      currentOrder: null,
      setCurrentOrder: order => set({currentOrder: order}),
      setUser: data => set({user: data}),
      setUserProfileImage: image =>
        set(state => ({
          user: state.user ? {...state.user, profileImage: image} : null,
        })),
      logout: () => set({user: null, currentOrder: null}), // Clears everything including profile image
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
