import { create } from "zustand"
import { Order, GetOrderHistoryResponse } from "./order.types"

interface OrderHistoryState {
    orders: Order[]
    meta: GetOrderHistoryResponse['meta'] | null

    // Actions
    setOrderHistory: (response: GetOrderHistoryResponse) => void
    reset: () => void
}

export const useOrderHistoryStore = create<OrderHistoryState>((set) => ({
    orders: [],
    meta: null,


    setOrderHistory: (response) => set({
        orders: response.data,
        meta: response.meta,
    }),


    reset: () => set({
        orders: [],
        meta: null
    }),
}))
