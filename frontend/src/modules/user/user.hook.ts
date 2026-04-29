import * as userServices from "./user.services";
import { useUserStore } from "./user.store";

export const useProfile = () => {
    const { setUser, clearUser } = useUserStore();
    const handleGetProfile = async () => {
        try {
            const response = await userServices.getProfileService();
            setUser(response);
            return response;
        } catch (error: any) {
            clearUser();
            throw Error(error?.response?.data?.message || "Failed to get profile");
        }
    }
    return { handleGetProfile }
}