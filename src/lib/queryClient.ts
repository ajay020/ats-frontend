import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 3,       // 3 min before refetch
            gcTime: 1000 * 60 * 10,          // 10 min in cache
            retry: (failureCount, error) => {
                // Never retry on 4xx errors — those are client mistakes
                const status = (error as { response?: { status: number } })?.response?.status;
                if (status && status >= 400 && status < 500) return false;
                return failureCount < 2;
            },
            refetchOnWindowFocus: false,
        },
        mutations: {
            onError: (error) => {
                console.error('Mutation error:', error);
            },
        },
    },
});

// Query key factory — keeps keys consistent across the app
export const queryKeys = {
    auth: {
        me: ['auth', 'me'] as const,
    },
    applications: {
        all: (query = {}) => ['applications', query] as const,
        detail: (id: string) => ['applications', id] as const,
        stats: ['applications', 'stats'] as const,
    },
} as const;