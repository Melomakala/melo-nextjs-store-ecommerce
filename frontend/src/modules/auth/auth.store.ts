import { create } from "zustand"

interface AuthStore {
    token: string;
    setToken: (token: string) => void;
    removeToken: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: "",
    setToken: (token: string) => set({ token }),
    removeToken: () => set({ token: "" }),
}));

export const getAccessToken = () => useAuthStore.getState().token;
export const setAccessToken = (token: string) => useAuthStore.getState().setToken(token);
export const removeAccessToken = () => useAuthStore.getState().removeToken();