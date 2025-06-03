import {
    ISignUp,
    ISignIn,
    ISignInResponse,
    ISignUpResponse,
    IEditProfile,
    IPasswordChange,
    IGeneralResponse,
    IRefreshTokenResponse,
} from "../../interfaces/user.interface";
import { IUser } from "../../models/user.model";

export default interface IUserService {
    createUser(userData: ISignUp): Promise<ISignUpResponse>;
    authenticateUser(userData: ISignIn): Promise<ISignInResponse>;
    getUserData(id: string): Promise<Partial<IUser> | null>;
    editProfile(id: string, data: IEditProfile): Promise<boolean>;
    refreshTokenCheck(token: string): Promise<IRefreshTokenResponse>;
    changePassword(id: string, data: IPasswordChange): Promise<IGeneralResponse>;
}
