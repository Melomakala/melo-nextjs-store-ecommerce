import { CustomError } from "../../common/utils/CustomError";
import * as walletModel from "./wallet.models";
import { fromCents } from "../../common/utils/formatcent";

export const getWalletService = async (user_id: string) => {
    const wallet = await walletModel.getWalletModel(user_id);
    if (!wallet) {
        throw new CustomError("Wallet not found", 404);
    }
    wallet.balance = fromCents(wallet.balance);
    return wallet;
}