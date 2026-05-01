import * as walletServices from "./wallet.services";
import { useWalletStore } from "./wallet.store";

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