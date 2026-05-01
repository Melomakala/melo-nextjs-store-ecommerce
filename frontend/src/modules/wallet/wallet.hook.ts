import * as walletServices from "./wallet.services";
import { useWalletStore } from "./wallet.store";
import { TopupWalletData } from "./wallet.types";

export const useWallet = () => {
    const { setBalance } = useWalletStore();
    const handleGetWallet = async () => {
        try {
            const wallet = await walletServices.getWalletService();
            setBalance(wallet.balance);
            return wallet;
        } catch (error: any) {
            throw Error(error?.response?.data?.message || "Failed to get wallet");
        }
    }
    return { handleGetWallet };
}

export const useTopupWallet = () => {
    const handleTopupWallet = async (data: TopupWalletData) => {
        try {
            const walletTopup = await walletServices.topupWalletService(data);
            return walletTopup;
        } catch (error: any) {
            throw Error(error?.response?.data?.message || "Failed to topup wallet");
        }
    }
    return { handleTopupWallet };
}