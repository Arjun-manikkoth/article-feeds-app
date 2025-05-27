import type { SignIn, SignUp } from "../Interfaces/userInterfaces";
import axiosUser from "../Axios/Interceptor";
import { isAxiosError } from "axios";

const signUpApi = async (data: SignUp) => {
    try {
        const response = await axiosUser.post("/users/sign-up", data);

        return {
            success: true,
            message: response.data.message || "Sucessfully signed Up into Account",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to sign into account",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

const signInApi = async (data: SignIn) => {
    try {
        const response = await axiosUser.post("/users/sign-in", data);
        console.log(response);
        return {
            success: true,
            message: response.data.message || "Successfully signed into account",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to sign into account",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// user profile data
const fetchProfileApi = async (id: string) => {
    try {
        const response = await axiosUser.get(`/users/${id}`);

        return {
            success: true,
            message: response.data.message || "Profile fetched successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to fetch profile",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

//api logouts clears access and refresh tokens
const logoutApi = async () => {
    try {
        const response = await axiosUser.get("/users/sign-out");

        return {
            success: true,
            message: response.data.message,
            data: null,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to sign out",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

export { signUpApi, signInApi, fetchProfileApi, logoutApi };
