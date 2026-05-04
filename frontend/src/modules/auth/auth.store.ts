import { create } from "zustand"
import { refreshService } from "./auth.services";

interface AuthStore {
    token: string;
    setToken: (token: string) => void;
    removeToken: () => void;
    isInitialized: boolean;
    setIsInitialized: (isInitialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    token: "",
    setToken: (token: string) => set({ token }),
    removeToken: () => set({ token: "" }),
    isInitialized: false,
    setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
}));