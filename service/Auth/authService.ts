import apiClient from "@/plugins/axios";

export const AuthService = {

    getProfile: async () => {
        try {
            const response = await apiClient.get('/auth/session');

            if (response.data) {
                // NextAuth handles session
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    login: async (credentials: any) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data?.token) {
            await AuthService.getProfile();
        }
        return response.data;
    },

    isAuthenticated: (): boolean => {
        return false;
    }
};
