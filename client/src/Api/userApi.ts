import axios from "axios";
import type { SignUp } from "../Interfaces/userInterfaces";

const signUpApi = async (data: SignUp) => {
    try {
        const response = await axios.post("/sign-up", data);

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
        const response = await axios.post("/sign-in", data);

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
