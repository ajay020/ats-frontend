import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
} from 'axios';

const BASE_URL = '/api'; // proxied to backend via Vite

// Token storage — access token in memory (XSS safe), refresh in localStorage
let accessToken: string | null = null;

export const tokenStore = {
    getAccess: (): string | null => accessToken,
    setAccess: (token: string): void => { accessToken = token; },
    clearAccess: (): void => { accessToken = null; },
    getRefresh: (): string | null => localStorage.getItem('refreshToken'),
    setRefresh: (token: string): void => localStorage.setItem('refreshToken', token),
    clearRefresh: (): void => localStorage.removeItem('refreshToken'),
    clearAll: (): void => {
        accessToken = null;
        localStorage.removeItem('refreshToken');
    },
};

export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

// ── Request interceptor — attach access token ─────────────────────────────────
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenStore.getAccess();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ── Response interceptor — silent token refresh on 401 ───────────────────────
let isRefreshing = false;
let refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null): void => {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (token) resolve(token);
        else reject(error);
    });
    refreshQueue = [];
};

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Only attempt refresh on 401, and only once per request
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Don't refresh on the auth endpoints themselves
        const isAuthEndpoint = originalRequest.url?.includes('/auth/');
        if (isAuthEndpoint) return Promise.reject(error);

        if (isRefreshing) {
            // Queue requests that arrive while a refresh is in-flight
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = tokenStore.getRefresh();
        if (!refreshToken) {
            tokenStore.clearAll();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        try {
            const response = await apiClient.post<{
                data: { accessToken: string; refreshToken: string };
            }>(`/auth/refresh`, { refreshToken });

            const { accessToken: newAccess, refreshToken: newRefresh } = response.data.data;
            tokenStore.setAccess(newAccess);
            tokenStore.setRefresh(newRefresh);

            processQueue(null, newAccess);
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            tokenStore.clearAll();
            // window.location.href = '/login';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);