import { Request, Response } from "express";
import IUserService from "../services/user/user.service.interface";
import { HTTP_STATUS } from "../constants/status.code";
import { AuthMessages, GeneralMessages } from "../constants/messages";

class UserController {
    constructor(private userService: IUserService) {}

    // handles user signup
    async signUp(req: Request, res: Response): Promise<void> {
        try {
            const { firstName, lastName, email, phone, password, dateOfBirth, interests } =
                req.body;

            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !password ||
                !dateOfBirth ||
                interests.length <= 0
            ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const result = await this.userService.createUser({
                firstName,
                lastName,
                phone,
                email,
                password,
                dateOfBirth: new Date(dateOfBirth),
                interests,
            });

            if (result.statusCode === HTTP_STATUS.CREATED) {
                res.status(HTTP_STATUS.CREATED).json({
                    success: true,
                    message: result.message,
                    data: null,
                });
            } else if (result.statusCode === HTTP_STATUS.CONFLICT) {
                res.status(HTTP_STATUS.CONFLICT).json({
                    success: false,
                    message: AuthMessages.ACCOUNT_EXISTS,
                    data: null,
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: GeneralMessages.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }
}

export default UserController;
