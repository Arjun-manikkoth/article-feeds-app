"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = require("../base/base.repository");
class UserRepository extends base_repository_1.BaseRepository {
    constructor(model) {
        super(model);
    }
    //creates new user to db
    insertUser(signUpData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.create({
                    first_name: signUpData.firstName,
                    last_name: signUpData.lastName,
                    email: signUpData.email,
                    phone: signUpData.phone,
                    password: signUpData.password,
                    date_of_birth: signUpData.dateOfBirth,
                    preference: signUpData.interests,
                });
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to create document");
            }
        });
    }
    //find user with email id
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ email: email });
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to find account");
            }
        });
    }
    //find user with phone
    findUserByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ phone: phone });
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to find account");
            }
        });
    }
    //get user data with id
    getUserDataWithId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.findById(id);
                return data;
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to fetch profile data");
            }
        });
    }
    //update user profile
    updateUserWithId(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.update(id, data);
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to update profile data");
            }
        });
    }
    // updates document with new password
    updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.update(id, { password: password });
            }
            catch (error) {
                console.log(error.message);
                return false;
            }
        });
    }
}
exports.default = UserRepository;
