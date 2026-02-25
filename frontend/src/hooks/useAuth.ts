import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    const { token, user, clearAuth } = useAuthStore();

    return {
        token,
        user,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!token && !!user,
        logout: clearAuth,
    };
};
