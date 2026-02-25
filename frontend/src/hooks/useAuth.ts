import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { token, user, setToken, clearAuth } = useAuthStore()
  return { token, user, setToken, isAdmin: user?.role === 'admin', logout: clearAuth }
}
