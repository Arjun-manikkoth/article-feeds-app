import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { IVerifyTokenResponse } from "../interfaces/user.interface";

const verifyToken = async (token: string): Promise<IVerifyTokenResponse> => {
    try {
        // Await the token verification and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;

        return {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            message: "Refresh token valid",
        };
    } catch (error: any) {
        // Handle different types of errors

        if (error.name === "TokenExpiredError") {
            return {
                id: null,
                email: null,
                role: null,
                message: "Refresh token expired",
            };
        } else if (error.name === "JsonWebTokenError") {
            return {
                id: null,
                email: null,
                role: null,
                message: "Refresh token invalid",
            };
        } else {
            return {
                id: null,
                email: null,
                role: null,
                message: "Refresh token verification failed",
            };
        }
    }
};
export { verifyToken };
