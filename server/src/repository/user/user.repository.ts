import { ISignUp } from "../../interfaces/user.interface";
import { IUser } from "../../models/user.model";
import { BaseRepository } from "../base/base.repository";
import IUserRepository from "./user.repository.interface";
import { Model } from "mongoose";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor(model: Model<IUser>) {
        super(model);
    }

    //creates new user to db
    async insertUser(signUpData: ISignUp): Promise<void> {
        try {
            await this.create({
                first_name: signUpData.firstName,
                last_name: signUpData.lastName,
                email: signUpData.email,
                phone: signUpData.phone,
                password: signUpData.password,
                date_of_birth: signUpData.dateOfBirth,
                preference: signUpData.interests,
            } as IUser);
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to create document");
        }
    }

    //find user with email id
    async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await this.model.findOne({ email: email });
        } catch (error: any) {
            console.log(error.message);

            throw new Error("Failed to find account");
        }
    }
}
export default UserRepository;
