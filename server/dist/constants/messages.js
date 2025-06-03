"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenMessages = exports.TokenMessages = exports.GeneralMessages = exports.PasswordMessages = exports.ArticleMessages = exports.ProfileMessages = exports.AuthMessages = void 0;
exports.AuthMessages = {
    ACCOUNT_EXISTS: "Account already exists",
    ACCOUNT_DOES_NOT_EXISTS: "Account doesnot exist",
    SIGN_UP_SUCCESS: "Account created successfully",
    SIGN_IN_SUCCESS: "Signed in successfully",
    INVALID_CREDENTIALS: "Invalid credentials",
    SIGN_OUT_SUCCESS: "Signed out successfully",
};
exports.ProfileMessages = {
    PROFILE_FETCH_SUCCESS: "Fetched profile successfully",
    PROFILE_FETCH_FAILURE: "Failed to fetch profile details",
    UPDATE_PROFILE_SUCCESS: "Updated profile successfully",
    UPDATE_PROFILE_FAILURE: "Failed to update profile details",
};
exports.ArticleMessages = {
    ARTICLE_CREATION_SUCCESS: "Created article successfully",
    ARTICLE_CREATION_FAILURE: "Failed to create article",
    ARTICLE_UPDATE_SUCCESS: "Update article successfully",
    ARTICLE_UPDATE_FAILURE: "Failed to update article",
    ARTICLE_FETCHING_SUCCESS: "Fetched articles successfully",
    ARTICLE_FETCHING_FAILURE: "Failed to fetch article",
    ARTICLE_BLOCKED: "Article blocked successfully",
    ARTICLE_BLOCKING_FAILED: "Failed to block article",
    ARTICLE_DELETED: "Article deleted successfully",
    ARTICLE_DELETION_FAILED: "Failed to delete article",
    ARTICLE_LIKED: "Article liked successfully",
    ARTICLE_DISLIKED: "Article disliked successfully",
    ARTICLE_ALREADY_LIKED: "Article already liked article",
    ARTICLE_LIKING_FAILED: "Article liking failed",
    ARTICLE_ALREADY_DISLIKED: "Article already disliked article",
    ARTICLE_DISLIKING_FAILED: "Article disliking failed",
};
exports.PasswordMessages = {
    PASSWORD_VERIFY_SUCCESS: "Password verified successfully",
    PASSWORD_INVALID: "Invalid current password",
    PASSWORD_UPDATE_SUCCESS: "Password changed successfully",
    PASSWORD_UPDATE_FAILURE: "Failed to update password",
};
exports.GeneralMessages = {
    MISSING_REQUIRED_FIELDS: "Some fields are missing or invalid",
    INTERNAL_SERVER_ERROR: "Internal server error",
};
exports.TokenMessages = {
    REFRESH_TOKEN_MISSING: "Refresh token missing",
    ACCESS_TOKEN_SUCCESS: "Access token sent successfully",
};
exports.AccessTokenMessages = {
    ACCESS_TOKEN_MISSING: "Access token is missing",
    ACCESS_TOKEN_EXPIRED: "Unauthorized! access token is expired",
    ACCESS_TOKEN_INVALID: "Unauthorized! access token is invalid",
    ACCESS_TOKEN_VERIFICATION_FAILED: "Unauthorized! token verification failed",
};
