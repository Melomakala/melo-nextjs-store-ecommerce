import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IdempotencyKeyStore {
    key: string | null;
    createKey: () => string;
    clearKey: () => void;
}

export const useIdempotencyKeyStore = create<IdempotencyKeyStore>()(persist(
    (set, get) => ({
        key: null,
        createKey: () => {
            const existsKey = get().key;
            if (existsKey) {
                return existsKey;
            }
            const newKey = crypto.randomUUID();
            set({ key: newKey });
            return newKey;
        },
        clearKey: () => {
            set({ key: null });
        }
    }),
    {
        name: "idempotency-key",
    }
));