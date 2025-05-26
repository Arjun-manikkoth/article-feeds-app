import {
    ISignUp,
    ISignIn,
    ISignInResponse,
    ISignUpResponse,
} from "../../interfaces/user.interface";

export default interface IUserService {
    createUser(userData: ISignUp): Promise<ISignUpResponse>;
    authenticateUser(userData: ISignIn): Promise<ISignInResponse>;
}
