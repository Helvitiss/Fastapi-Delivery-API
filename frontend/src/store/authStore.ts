import { create } from 'zustand';
import { getIsAdminFromToken } from '../lib/auth';
import type { UserRead } from '../types/api';

interface AuthState {
  token: string | null;
  user: UserRead | null;
  setToken: (token: string | null) => void;
  setUser: (user: UserRead | null) => void;
  logout: () => void;
}

const initialToken = localStorage.getItem('token');
const initialUser: UserRead | null = initialToken
  ? { id: 0, phone_number: '', is_admin: getIsAdminFromToken(initialToken) }
  : null;

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: initialUser,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      set({ token, user: { id: 0, phone_number: '', is_admin: getIsAdminFromToken(token) } });
      return;
    }

    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
