import { create } from "zustand";

interface WalletStore {
    balance: number;
    setBalance: (balance: number) => void;
    clearBalance: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
    balance: 0,
    setBalance: (balance: number) => set({ balance }),
    clearBalance: () => set({ balance: 0 }),
}));