import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
    withCredentials: true,
});

const handleError = (error: any) => {
    if (error.response) {
        const status = error.response.status;
        const requestUrl = error.config?.url || "";

        const isAuthRequest =
            requestUrl.includes("/auth/login") ||
            requestUrl.includes("/auth/register");

        if (status === 401 && !isAuthRequest && typeof window !== "undefined") {
            window.location.href = "/auth/login";
        }
    }

    return Promise.reject(error);
};

apiClient.interceptors.response.use(
    (response) => response,
    (error) => handleError(error),
);

export default apiClient;