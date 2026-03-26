import { apiClient, tokenStore } from './client';
import type { LoginResponse, User, ApiResponse } from '@/types';

export const authApi = {
    register: async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<LoginResponse> => {
        const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', data);
        const { user, tokens } = res.data.data!;
        tokenStore.setAccess(tokens.accessToken);
        tokenStore.setRefresh(tokens.refreshToken);
        return { user, tokens };
    },

    login: async (data: { email: string; password: string }): Promise<LoginResponse> => {
        const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
        const { user, tokens } = res.data.data!;
        tokenStore.setAccess(tokens.accessToken);
        tokenStore.setRefresh(tokens.refreshToken);
        return { user, tokens };
    },

    logout: async (): Promise<void> => {
        const refreshToken = tokenStore.getRefresh();
        if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken }).catch(() => { });
        }
        tokenStore.clearAll();
    },

    getMe: async (): Promise<User> => {
        const res = await apiClient.get<ApiResponse<User>>('/auth/me');
        return res.data.data!;
    },

    changePassword: async (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }): Promise<void> => {
        await apiClient.patch('/auth/change-password', data);
    },
};