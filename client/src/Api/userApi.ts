import type { SignUp } from "../Interfaces/userInterfaces";
import axiosUser from "../Axios/Interceptor";

const signUpApi = async (data: SignUp) => {
    try {
        const response = await axiosUser.post("/sign-up", data);

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

const signInApi = async (data: SignUp) => {
    try {
        const response = await axiosUser.post("/sign-in", data);

        return {
            success: true,
            message: response.data.message || "Sucessfully signed Into Account",
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

export { signUpApi, signInApi };
