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
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unknown error occurred");
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

const fetchProfileApi = async (id: string | null, data: SignIn) => {
    try {
        const response = await axiosUser.post(`/users/profile/${id}`, data);

        return {
            success: true,
            message: response.data.message || "Failed to fetch profile",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unknown error occurred");
        }
    }
};

export { signUpApi, signInApi, fetchProfileApi };
