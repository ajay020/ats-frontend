import { apiClient } from './client';
import type {
    ApiResponse,
    ApplicationDetail,
    ApplicationSummary,
    ApplicationStats,
    ApplicationsQuery,
    PaginationMeta,
    Note,
    Contact,
} from '@/types';

export const applicationsApi = {
    getAll: async (
        query: ApplicationsQuery = {},
    ): Promise<{ data: ApplicationSummary[]; meta: PaginationMeta }> => {
        const params = Object.fromEntries(
            Object.entries(query).filter(([, v]) => v !== undefined && v !== ''),
        );
        const res = await apiClient.get<ApiResponse<ApplicationSummary[]>>(
            '/applications',
            { params },
        );
        return { data: res.data.data!, meta: res.data.meta! };
    },

    getById: async (id: string): Promise<ApplicationDetail> => {
        const res = await apiClient.get<ApiResponse<ApplicationDetail>>(
            `/applications/${id}`,
        );
        return res.data.data!;
    },

    getStats: async (): Promise<ApplicationStats> => {
        const res = await apiClient.get<ApiResponse<ApplicationStats>>(
            '/applications/stats',
        );
        return res.data.data!;
    },

    create: async (data: unknown): Promise<ApplicationDetail> => {
        const res = await apiClient.post<ApiResponse<ApplicationDetail>>(
            '/applications',
            data,
        );
        return res.data.data!;
    },

    update: async (id: string, data: unknown): Promise<ApplicationDetail> => {
        const res = await apiClient.patch<ApiResponse<ApplicationDetail>>(
            `/applications/${id}`,
            data,
        );
        return res.data.data!;
    },

    updateStatus: async (
        id: string,
        status: string,
        note?: string,
    ): Promise<ApplicationDetail> => {
        const res = await apiClient.patch<ApiResponse<ApplicationDetail>>(
            `/applications/${id}/status`,
            { status, note },
        );
        return res.data.data!;
    },

    toggleFavorite: async (id: string): Promise<{ isFavorite: boolean }> => {
        const res = await apiClient.patch<ApiResponse<{ isFavorite: boolean }>>(
            `/applications/${id}/favorite`,
        );
        return res.data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/applications/${id}`);
    },

    addNote: async (
        id: string,
        data: { content: string; type: string; isPrivate?: boolean },
    ): Promise<Note> => {
        const res = await apiClient.post<ApiResponse<Note>>(
            `/applications/${id}/notes`,
            data,
        );
        return res.data.data!;
    },

    deleteNote: async (id: string, noteId: string): Promise<void> => {
        await apiClient.delete(`/applications/${id}/notes/${noteId}`);
    },

    addContact: async (id: string, data: unknown): Promise<Contact> => {
        const res = await apiClient.post<ApiResponse<Contact>>(
            `/applications/${id}/contacts`,
            data,
        );
        return res.data.data!;
    },

    deleteContact: async (id: string, contactId: string): Promise<void> => {
        await apiClient.delete(`/applications/${id}/contacts/${contactId}`);
    },
};