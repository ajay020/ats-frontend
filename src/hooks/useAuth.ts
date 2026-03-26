import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { tokenStore } from '@/api/client';
import { queryKeys } from '@/lib/queryClient';
import type { User } from '@/types';

export const useAuth = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const { data: user, isLoading } = useQuery<User>({
        queryKey: queryKeys.auth.me,
        queryFn: authApi.getMe,
        // Only run if we have a refresh token — avoids pointless 401 on load
        enabled: !!tokenStore.getRefresh(),
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: ({ user }) => {
            qc.setQueryData(queryKeys.auth.me, user);
            navigate('/dashboard');
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: ({ user }) => {
            qc.setQueryData(queryKeys.auth.me, user);
            navigate('/dashboard');
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSettled: () => {
            qc.clear();
            navigate('/login');
        },
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation,
        register: registerMutation,
        logout: logoutMutation,
    };
};