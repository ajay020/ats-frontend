import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthLoading: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem("token"),
    isAuthLoading: true,

    setAuth: (user, token) => {
        localStorage.setItem("token", token);

        set({ user, token, isAuthLoading: false });
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
    },

    setLoading: (loading) => {
        set({ isAuthLoading: loading })
    }
}));