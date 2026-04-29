import { create } from "zustand";
import { user } from "./user.type";

type UserStore = {
    user: user | null;
    setUser: (user: user) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));