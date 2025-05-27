import { IEditProfile, ISignUp } from "../../interfaces/user.interface";
import { IUser } from "../../models/user.model";
import { IBaseRepository } from "../base/base.repository.interface";

export default interface IUserRepository extends IBaseRepository<IUser> {
    insertUser(userData: ISignUp): Promise<void>;
    findUserByEmail(email: string): Promise<IUser | null>;
    findUserByPhone(phone: string): Promise<IUser | null>;
    getUserDataWithId(id: string): Promise<IUser | null>;
    updateUserWithId(id: string, data: IEditProfile): Promise<boolean>;
    updatePassword(id: string, password: string): Promise<boolean>;
}
