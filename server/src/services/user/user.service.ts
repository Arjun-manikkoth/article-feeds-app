import IUserService from "./user.service.interface";
import { ISignUp, ISignUpResponse } from "../../interfaces/user.interface";
import IUserRepository from "../../repository/user/user.repository.interface";
import { hashPassword } from "../../utils/hash.password";
import { AuthMessages } from "../../constants/messages";
import { HTTP_STATUS } from "../../constants/status.code";

class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}

    //creates a new user document without duplicates
    async createUser(userData: ISignUp): Promise<ISignUpResponse> {
        try {
            console.log(userData, "data at services");
            const exists = await this.userRepository.findUserByEmail(userData.email);

            if (!exists) {
                const hashedPassword = await hashPassword(userData.password);
                userData.password = hashedPassword;

                await this.userRepository.insertUser(userData);

                return {
                    statusCode: HTTP_STATUS.CREATED,
                    message: AuthMessages.SIGN_UP_SUCCESS,
                    data: null,
                };
            } else {
                return {
                    statusCode: HTTP_STATUS.CONFLICT,
                    message: AuthMessages.ACCOUNT_EXISTS,
                    data: null,
                };
            }
        } catch (error: any) {
            console.log(error.message);

            throw new Error(error);
        }
    }
}
export default UserService;
