import { ISignUp } from "../../interfaces/user.interface";
import { ISignUpResponse } from "../../interfaces/user.interface";

export default interface IUserService {
    createUser(userData: ISignUp): Promise<ISignUpResponse>;
}
