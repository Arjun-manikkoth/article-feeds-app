import IUserService from "./user.service.interface";
import {
    ISignUp,
    ISignIn,
    ISignInResponse,
    ISignUpResponse,
    IEditProfile,
    IPasswordChange,
    IGeneralResponse,
} from "../../interfaces/user.interface";
import { IUser } from "../../models/user.model";
import IUserRepository from "../../repository/user/user.repository.interface";
import { hashPassword, comparePasswords } from "../../utils/hash.password";
import { generateTokens } from "../../utils/generate.tokens";
import { AuthMessages, PasswordMessages, ProfileMessages } from "../../constants/messages";
import { HTTP_STATUS } from "../../constants/status.code";
import { isEmail } from "../../utils/regex.check";
import { camelCase, mapKeys } from "lodash-es";

class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}

    //creates a new user document without duplicates
    async createUser(userData: ISignUp): Promise<ISignUpResponse> {
        try {
            const exists =
                (await this.userRepository.findUserByEmail(userData.email)) ||
                (await this.userRepository.findUserByPhone(userData.phone));

            if (!exists) {
                const hashedPassword = await hashPassword(userData.password);
                userData.password = hashedPassword;

                await this.userRepository.insertUser(userData);

                return {
                    statusCode: HTTP_STATUS.CREATED,
                    message: AuthMessages.SIGN_UP_SUCCESS,
                    data: null,
                };
            }
            return {
                statusCode: HTTP_STATUS.CONFLICT,
                message: AuthMessages.ACCOUNT_EXISTS,
                data: null,
            };
        } catch (error: any) {
            console.log(error.message);

            throw new Error(error);
        }
    }

    //verify credentials and generates tokens
    async authenticateUser(userData: ISignIn): Promise<ISignInResponse> {
        try {
            const inputType: "email" | "phone" = isEmail(userData.loginId) ? "email" : "phone";

            let exists =
                inputType === "email"
                    ? await this.userRepository.findUserByEmail(userData.loginId)
                    : await this.userRepository.findUserByPhone(userData.loginId);

            if (!exists) {
                return {
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    message: AuthMessages.ACCOUNT_DOES_NOT_EXISTS,
                    data: null,
                };
            }

            const passwordStatus = await comparePasswords(userData.password, exists.password);

            if (!passwordStatus) {
                return {
                    statusCode: HTTP_STATUS.UNAUTHORIZED,
                    message: AuthMessages.INVALID_CREDENTIALS,
                    data: null,
                };
            }

            const tokens = generateTokens(exists._id.toString(), exists.email, "user");

            return {
                statusCode: HTTP_STATUS.OK,
                message: AuthMessages.SIGN_IN_SUCCESS,
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    id: exists._id.toString(),
                },
            };
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to sign in");
        }
    }

    //fetch profile data associated with id
    async getUserData(id: string): Promise<Partial<IUser> | null> {
        try {
            const data = await this.userRepository.getUserDataWithId(id);
            if (!data) {
                return null;
            } else {
                return mapKeys(data.toObject(), (value, key) => camelCase(key));
            }
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to fetch profile data");
        }
    }

    async editProfile(id: string, data: IEditProfile): Promise<boolean> {
        try {
            return await this.userRepository.updateUserWithId(id, data);
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to update profile data");
        }
    }

    //change password
    async changePassword(id: string, data: IPasswordChange): Promise<IGeneralResponse> {
        try {
            const exists = await this.userRepository.getUserDataWithId(id);

            if (!exists) {
                return {
                    message: ProfileMessages.PROFILE_FETCH_FAILURE,
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    data: null,
                };
            }
            const passwordStatus = await comparePasswords(data.password, exists.password);

            if (!passwordStatus) {
                return {
                    message: PasswordMessages.PASSWORD_INVALID,
                    statusCode: HTTP_STATUS.UNAUTHORIZED,
                    data: null,
                };
            }

            const hashedPassword = await hashPassword(data.newPassword);

            const updateStatus = await this.userRepository.updatePassword(id, hashedPassword);

            return updateStatus
                ? {
                      message: PasswordMessages.PASSWORD_UPDATE_SUCCESS,
                      statusCode: HTTP_STATUS.OK,
                      data: null,
                  }
                : {
                      message: PasswordMessages.PASSWORD_UPDATE_FAILURE,
                      statusCode: HTTP_STATUS.BAD_REQUEST,
                      data: null,
                  };
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to change password");
        }
    }
}
export default UserService;
