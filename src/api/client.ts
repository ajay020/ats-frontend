import { useAuthStore } from '@/stores/auth.store';
import axios, {
    type AxiosInstance,
} from 'axios';

const BASE_URL = '/api'; // proxied to backend via Vite

export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

// Request Interceptor: Attach Token automatically
apiClient.interceptors.request.use(
    (config) => {
        // We get the token from localStorage (Professional Tip: use Zustand/Redux later)
        const token = useAuthStore.getState().token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global Errors (like 401)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("Response error: ", error)
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and we haven't tried to refresh yet
        // if (error.response?.status === 401 && !originalRequest._retry) {
        //     originalRequest._retry = true;

        //     try {
        //         // Logically call your /auth/refresh endpoint here
        //         // If successful, save new token and retry originalRequest
        //         // For now, let's just logout if unauthorized
        //         // console.error('Session expired. Redirecting to login...');
        //         // localStorage.removeItem('accessToken');
        //         // window.location.href = '/login';
        //     } catch (refreshError) {
        //         return Promise.reject(refreshError);
        //     }
        // }

        return Promise.reject(error);
    }
);