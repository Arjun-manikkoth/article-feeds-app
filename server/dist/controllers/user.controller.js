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
const status_code_1 = require("./../constants/status.code");
const messages_1 = require("../constants/messages");
const regex_check_1 = require("../utils/regex.check");
const lodash_es_1 = require("lodash-es");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    // handles user signup
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, email, phone, password, dateOfBirth, interests } = req.body;
                if (!firstName ||
                    !lastName ||
                    !email ||
                    !phone ||
                    !password ||
                    !dateOfBirth ||
                    interests.length <= 0) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const result = yield this.userService.createUser({
                    firstName,
                    lastName,
                    phone,
                    email,
                    password,
                    dateOfBirth: new Date(dateOfBirth),
                    interests,
                });
                if (result.statusCode === status_code_1.HTTP_STATUS.CREATED) {
                    res.status(status_code_1.HTTP_STATUS.CREATED).json({
                        success: true,
                        message: result.message,
                        data: null,
                    });
                }
                else if (result.statusCode === status_code_1.HTTP_STATUS.CONFLICT) {
                    res.status(status_code_1.HTTP_STATUS.CONFLICT).json({
                        success: false,
                        message: messages_1.AuthMessages.ACCOUNT_EXISTS,
                        data: null,
                    });
                }
                else {
                    res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: messages_1.GeneralMessages.INTERNAL_SERVER_ERROR,
                        data: null,
                    });
                }
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Something went wrong";
                res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.GeneralMessages.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    //verify email and password and sends token
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ((!req.body.loginId && !(0, regex_check_1.validateLoginId)(req.body.loginId)) || !req.body.password) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const response = yield this.userService.authenticateUser(req.body);
                if (response.statusCode === status_code_1.HTTP_STATUS.OK && response.data) {
                    res.status(status_code_1.HTTP_STATUS.OK)
                        .cookie("accessToken", response.data.accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: process.env.MAX_AGE_ACCESS_COOKIE
                            ? parseInt(process.env.MAX_AGE_ACCESS_COOKIE)
                            : 15 * 60 * 1000, // 15 minutes
                    })
                        .cookie("refreshToken", response.data.refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: process.env.MAX_AGE_REFRESH_COOKIE
                            ? parseInt(process.env.MAX_AGE_REFRESH_COOKIE)
                            : 7 * 24 * 60 * 60 * 1000, // 7 days
                    })
                        .json({
                        success: true,
                        message: response.message,
                        data: { id: response.data.id },
                    });
                }
                else {
                    switch (response.statusCode) {
                        case status_code_1.HTTP_STATUS.NOT_FOUND:
                            res.status(status_code_1.HTTP_STATUS.NOT_FOUND).json({
                                success: false,
                                message: response.message,
                                data: null,
                            });
                            break;
                        case status_code_1.HTTP_STATUS.UNAUTHORIZED:
                            res.status(status_code_1.HTTP_STATUS.UNAUTHORIZED).json({
                                success: false,
                                message: response.message,
                                data: null,
                            });
                            break;
                    }
                }
            }
            catch (error) {
                console.log(error.message);
                res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.GeneralMessages.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    //clears token and signs out
    signOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("accessToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.status(status_code_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: messages_1.AuthMessages.SIGN_OUT_SUCCESS,
                    data: null,
                });
            }
            catch (error) {
                console.error(error.message);
                res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.GeneralMessages.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    // Refresh token logic
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.refreshToken;
                if (!token) {
                    res.status(status_code_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: messages_1.TokenMessages.REFRESH_TOKEN_MISSING,
                        data: null,
                    });
                    return;
                }
                const response = yield this.userService.refreshTokenCheck(token);
                if (response.statusCode === status_code_1.HTTP_STATUS.OK) {
                    res.status(status_code_1.HTTP_STATUS.OK)
                        .cookie("accessToken", response.accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: process.env.MAX_AGE_ACCESS_COOKIE
                            ? parseInt(process.env.MAX_AGE_ACCESS_COOKIE)
                            : 15 * 60 * 1000, // 15 minutes
                    })
                        .json({
                        success: true,
                        message: messages_1.TokenMessages.ACCESS_TOKEN_SUCCESS,
                        data: null,
                    });
                }
                else {
                    res.status(status_code_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: response.message,
                        data: null,
                    });
                }
            }
            catch (error) {
                console.error(error.message);
                res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.GeneralMessages.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const status = yield this.userService.getUserData(req.params.id);
                if (status) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: messages_1.ProfileMessages.PROFILE_FETCH_SUCCESS,
                        data: status,
                    });
                }
                else {
                    res.status(status_code_1.HTTP_STATUS.NOT_FOUND).json({
                        success: false,
                        message: messages_1.ProfileMessages.PROFILE_FETCH_FAILURE,
                        data: null,
                    });
                }
            }
            catch (error) {
                console.error(error.message);
                res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.GeneralMessages.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    //update profile
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.body.firstName ||
                    !req.body.lastName ||
                    ((_a = req.body.preferences) === null || _a === void 0 ? void 0 : _a.length) <= 0 ||
                    !req.params.id) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const status = yield this.userService.editProfile(req.params.id, (0, lodash_es_1.mapKeys)(req.body, (value, key) => (0, lodash_es_1.snakeCase)(key)));
                if (status) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: messages_1.ProfileMessages.UPDATE_PROFILE_SUCCESS,
                        data: status,
                    });
                }
                else {
                    res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: messages_1.ProfileMessages.UPDATE_PROFILE_FAILURE,
                        data: null,
                    });
                }
            }
            catch (error) {
                console.log(error.message);
                res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.GeneralMessages.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.currentPassword || !req.body.newPassword || !req.params.id) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const response = yield this.userService.changePassword(req.params.id, {
                    password: req.body.currentPassword,
                    newPassword: req.body.newPassword,
                });
                if (response.statusCode === status_code_1.HTTP_STATUS.OK) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: response.message,
                        data: null,
                    });
                }
                else {
                    res.status(response.statusCode).json({
                        success: false,
                        message: response.message,
                        data: null,
                    });
                }
            }
            catch (error) {
                console.error(error.message);
                res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: messages_1.GeneralMessages.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
}
exports.default = UserController;
