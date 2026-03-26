import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/api/applications.api';
import { queryKeys } from '@/lib/queryClient';
import type { ApplicationsQuery } from '@/types';

export const useApplications = (query: ApplicationsQuery = {}) => {
    return useQuery({
        queryKey: queryKeys.applications.all(query),
        queryFn: () => applicationsApi.getAll(query),
    });
};

export const useApplication = (id: string) => {
    return useQuery({
        queryKey: queryKeys.applications.detail(id),
        queryFn: () => applicationsApi.getById(id),
        enabled: !!id,
    });
};

export const useApplicationStats = () => {
    return useQuery({
        queryKey: queryKeys.applications.stats,
        queryFn: applicationsApi.getStats,
    });
};

export const useUpdateStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
            applicationsApi.updateStatus(id, status, note),
        onSuccess: (updated) => {
            // Update the detail cache immediately
            qc.setQueryData(queryKeys.applications.detail(updated.id), updated);
            // Invalidate list + stats so they refetch
            void qc.invalidateQueries({ queryKey: ['applications'] });
        },
    });
};

export const useToggleFavorite = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => applicationsApi.toggleFavorite(id),
        onSuccess: (_result, id) => {
            void qc.invalidateQueries({ queryKey: queryKeys.applications.detail(id) });
            void qc.invalidateQueries({ queryKey: ['applications'] });
        },
    });
};

export const useDeleteApplication = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => applicationsApi.delete(id),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['applications'] });
        },
    });
};

export const useAddNote = (applicationId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { content: string; type: string }) =>
            applicationsApi.addNote(applicationId, data),
        onSuccess: () => {
            void qc.invalidateQueries({
                queryKey: queryKeys.applications.detail(applicationId),
            });
        },
    });
};