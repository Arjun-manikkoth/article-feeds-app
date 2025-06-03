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
const hash_password_1 = require("../../utils/hash.password");
const generate_tokens_1 = require("../../utils/generate.tokens");
const verify_token_1 = require("../../utils/verify.token");
const messages_1 = require("../../constants/messages");
const status_code_1 = require("../../constants/status.code");
const regex_check_1 = require("../../utils/regex.check");
const lodash_es_1 = require("lodash-es");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    //creates a new user document without duplicates
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = (yield this.userRepository.findUserByEmail(userData.email)) ||
                    (yield this.userRepository.findUserByPhone(userData.phone));
                if (!exists) {
                    const hashedPassword = yield (0, hash_password_1.hashPassword)(userData.password);
                    userData.password = hashedPassword;
                    yield this.userRepository.insertUser(userData);
                    return {
                        statusCode: status_code_1.HTTP_STATUS.CREATED,
                        message: messages_1.AuthMessages.SIGN_UP_SUCCESS,
                        data: null,
                    };
                }
                return {
                    statusCode: status_code_1.HTTP_STATUS.CONFLICT,
                    message: messages_1.AuthMessages.ACCOUNT_EXISTS,
                    data: null,
                };
            }
            catch (error) {
                console.log(error.message);
                throw new Error(error);
            }
        });
    }
    //verify credentials and generates tokens
    authenticateUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inputType = (0, regex_check_1.isEmail)(userData.loginId) ? "email" : "phone";
                let exists = inputType === "email"
                    ? yield this.userRepository.findUserByEmail(userData.loginId)
                    : yield this.userRepository.findUserByPhone(userData.loginId);
                if (!exists) {
                    return {
                        statusCode: status_code_1.HTTP_STATUS.NOT_FOUND,
                        message: messages_1.AuthMessages.ACCOUNT_DOES_NOT_EXISTS,
                        data: null,
                    };
                }
                const passwordStatus = yield (0, hash_password_1.comparePasswords)(userData.password, exists.password);
                if (!passwordStatus) {
                    return {
                        statusCode: status_code_1.HTTP_STATUS.UNAUTHORIZED,
                        message: messages_1.AuthMessages.INVALID_CREDENTIALS,
                        data: null,
                    };
                }
                const tokens = (0, generate_tokens_1.generateTokens)(exists._id.toString(), exists.email, "user");
                return {
                    statusCode: status_code_1.HTTP_STATUS.OK,
                    message: messages_1.AuthMessages.SIGN_IN_SUCCESS,
                    data: {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        id: exists._id.toString(),
                    },
                };
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to sign in");
            }
        });
    }
    refreshTokenCheck(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenStatus = yield (0, verify_token_1.verifyToken)(token);
                if (tokenStatus.id && tokenStatus.email && tokenStatus.role) {
                    const tokens = (0, generate_tokens_1.generateTokens)(tokenStatus.id, tokenStatus.email, tokenStatus.role);
                    return {
                        statusCode: status_code_1.HTTP_STATUS.OK,
                        accessToken: tokens.accessToken,
                        message: tokenStatus.message,
                    };
                }
                return {
                    statusCode: status_code_1.HTTP_STATUS.UNAUTHORIZED,
                    accessToken: null,
                    message: tokenStatus.message,
                };
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to create refresh token");
            }
        });
    }
    //fetch profile data associated with id
    getUserData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.userRepository.getUserDataWithId(id);
                if (!data) {
                    return null;
                }
                else {
                    return (0, lodash_es_1.mapKeys)(data.toObject(), (value, key) => (0, lodash_es_1.camelCase)(key));
                }
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to fetch profile data");
            }
        });
    }
    editProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.updateUserWithId(id, data);
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to update profile data");
            }
        });
    }
    //change password
    changePassword(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield this.userRepository.getUserDataWithId(id);
                if (!exists) {
                    return {
                        message: messages_1.ProfileMessages.PROFILE_FETCH_FAILURE,
                        statusCode: status_code_1.HTTP_STATUS.NOT_FOUND,
                        data: null,
                    };
                }
                const passwordStatus = yield (0, hash_password_1.comparePasswords)(data.password, exists.password);
                if (!passwordStatus) {
                    return {
                        message: messages_1.PasswordMessages.PASSWORD_INVALID,
                        statusCode: status_code_1.HTTP_STATUS.UNAUTHORIZED,
                        data: null,
                    };
                }
                const hashedPassword = yield (0, hash_password_1.hashPassword)(data.newPassword);
                const updateStatus = yield this.userRepository.updatePassword(id, hashedPassword);
                return updateStatus
                    ? {
                        message: messages_1.PasswordMessages.PASSWORD_UPDATE_SUCCESS,
                        statusCode: status_code_1.HTTP_STATUS.OK,
                        data: null,
                    }
                    : {
                        message: messages_1.PasswordMessages.PASSWORD_UPDATE_FAILURE,
                        statusCode: status_code_1.HTTP_STATUS.BAD_REQUEST,
                        data: null,
                    };
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to change password");
            }
        });
    }
}
exports.default = UserService;
