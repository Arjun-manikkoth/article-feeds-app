import { HTTP_STATUS } from "./../constants/status.code";
import { Request, Response } from "express";
import IUserService from "../services/user/user.service.interface";
import { AuthMessages, GeneralMessages, ProfileMessages } from "../constants/messages";
import { validateLoginId } from "../utils/regex.check";
import { mapKeys, snakeCase } from "lodash-es";
import { IEditProfile } from "../interfaces/user.interface";

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

    //verify email and password and sends token
    async signIn(req: Request, res: Response): Promise<void> {
        try {
            if ((!req.body.loginId && !validateLoginId(req.body.loginId)) || !req.body.password) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const response = await this.userService.authenticateUser(req.body);

            if (response.statusCode === HTTP_STATUS.OK && response.data) {
                res.status(HTTP_STATUS.OK)
                    .cookie("accessToken", response.data.accessToken, {
                        httpOnly: true,
                        secure: false,
                        // sameSite: "none",
                        maxAge: process.env.MAX_AGE_ACCESS_COOKIE
                            ? parseInt(process.env.MAX_AGE_ACCESS_COOKIE)
                            : 15 * 60 * 1000, // 15 minutes
                    })
                    .cookie("refreshToken", response.data.refreshToken, {
                        httpOnly: true,
                        secure: false,
                        // sameSite: "none",
                        maxAge: process.env.MAX_AGE_REFRESH_COOKIE
                            ? parseInt(process.env.MAX_AGE_REFRESH_COOKIE)
                            : 7 * 24 * 60 * 60 * 1000, // 7 days
                    })
                    .json({
                        success: true,
                        message: response.message,
                        data: { id: response.data.id },
                    });
            } else {
                switch (response.statusCode) {
                    case HTTP_STATUS.NOT_FOUND:
                        res.status(HTTP_STATUS.NOT_FOUND).json({
                            success: false,
                            message: response.message,
                            data: null,
                        });
                        break;
                    case HTTP_STATUS.UNAUTHORIZED:
                        res.status(HTTP_STATUS.UNAUTHORIZED).json({
                            success: false,
                            message: response.message,
                            data: null,
                        });
                        break;
                }
            }
        } catch (error: any) {
            console.log(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }

    //clears token and signs out
    async signOut(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: false,
                //  sameSite: "none",
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                // sameSite: "none",
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: AuthMessages.SIGN_OUT_SUCCESS,
                data: null,
            });
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const status = await this.userService.getUserData(req.params.id as string);

            if (status) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: ProfileMessages.PROFILE_FETCH_SUCCESS,
                    data: status,
                });
            } else {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: ProfileMessages.PROFILE_FETCH_FAILURE,
                    data: null,
                });
            }
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }

    //update profile
    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            if (
                !req.body.firstName ||
                !req.body.lastName ||
                req.body.preferences?.length <= 0 ||
                !req.params.id
            ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const status = await this.userService.editProfile(
                req.params.id,
                mapKeys(req.body, (value, key) => snakeCase(key)) as IEditProfile
            );

            if (status) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: ProfileMessages.UPDATE_PROFILE_SUCCESS,
                    data: status,
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: ProfileMessages.UPDATE_PROFILE_FAILURE,
                    data: null,
                });
            }
        } catch (error: any) {
            console.log(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body.currentPassword || !req.body.newPassword || !req.params.id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const response = await this.userService.changePassword(req.params.id as string, {
                password: req.body.currentPassword,
                newPassword: req.body.newPassword,
            });

            if (response.statusCode === HTTP_STATUS.OK) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: response.message,
                    data: null,
                });
            } else {
                res.status(response.statusCode).json({
                    success: false,
                    message: response.message,
                    data: null,
                });
            }
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }
}

export default UserController;
