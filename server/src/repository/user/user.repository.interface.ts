import { ISignUp } from "../../interfaces/user.interface";
import { IUser } from "../../models/user.model";
import { IBaseRepository } from "../base/base.repository.interface";

export default interface IUserRepository extends IBaseRepository<IUser> {
    insertUser(userData: ISignUp): Promise<void>;
    findUserByEmail(email: string): Promise<IUser | null>;
}
