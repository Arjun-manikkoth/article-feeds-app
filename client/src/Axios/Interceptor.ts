import axios from "axios";
import { logoutApi, refreshTokenApi } from "../Api/userApi";
import { baseUrl } from "../Constants/constant";
import { store } from "../Redux/store";
import { clearUser } from "../Redux/Slices/UserSlice";

const instance = axios.create({
    baseURL: `${baseUrl}`,
    withCredentials: true, // Send cookies with every request
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response.status === 401 &&
            (error.response.data.message === "Refresh token invalid" ||
                error.response.data.message === "Refresh token missing" ||
                error.response.data.message === "Unauthorized! access token is invalid" ||
                error.response.data.message === "Refresh token expired")
        ) {
            //if access tokens are invalid or refresh tokens are missing or invalid clear cookies and logouts

            await logoutApi();
            store.dispatch(clearUser()); //clears user data from the store
        } else if (
            error.response.status === 401 &&
            (error.response.data.message === "Unauthorized! access token is expired" ||
                error.response.data.message === "Access token is missing") &&
            !originalRequest._retry
        ) {
            //if access token is expired make an api call to get new access token

            originalRequest._retry = true;

            try {
                await refreshTokenApi();

                return instance(originalRequest);
            } catch (refreshError) {
                await logoutApi();

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
