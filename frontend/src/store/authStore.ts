import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { JWTPayload } from '../types'
import { decodeJWT } from '../utils/jwt'

interface AuthState {
  token: string | null
  user: JWTPayload | null
  setToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token, user: decodeJWT(token) }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: 'fm_auth' },
  ),
)
