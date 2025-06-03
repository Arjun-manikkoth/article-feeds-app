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
class ArticleController {
    constructor(articleService) {
        this.articleService = articleService;
    }
    addArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.articleName ||
                    !req.body.description ||
                    !req.body.category ||
                    !req.files ||
                    !req.params.id) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const response = yield this.articleService.createArticle(req.params.id, {
                    article_name: req.body.articleName,
                    description: req.body.description,
                    category: req.body.category,
                    images: req.files,
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
    getMyArticles(req, res) {
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
                const response = yield this.articleService.getArticles(req.params.id);
                if (response === null || response === void 0 ? void 0 : response.length) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: messages_1.ArticleMessages.ARTICLE_FETCHING_SUCCESS,
                        data: response,
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: messages_1.ArticleMessages.ARTICLE_FETCHING_FAILURE,
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
    getArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.articleId || !req.params.userId) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const response = yield this.articleService.getArticle(req.params.userId, req.params.articleId);
                if (response) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: messages_1.ArticleMessages.ARTICLE_FETCHING_SUCCESS,
                        data: response,
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: messages_1.ArticleMessages.ARTICLE_FETCHING_FAILURE,
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
    getAllArticles(req, res) {
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
                const response = yield this.articleService.fetchAllArticles(req.params.id);
                if (response.length) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: messages_1.ArticleMessages.ARTICLE_FETCHING_SUCCESS,
                        data: response,
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: messages_1.ArticleMessages.ARTICLE_FETCHING_FAILURE,
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
    blockArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.userId || !req.params.articleId) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const status = yield this.articleService.blockArticle(req.params.userId, req.params.articleId);
                if (status) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: messages_1.ArticleMessages.ARTICLE_BLOCKED,
                        data: null,
                    });
                }
                else {
                    res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: messages_1.ArticleMessages.ARTICLE_BLOCKING_FAILED,
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
    deleteArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.userId || !req.params.articleId) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const status = yield this.articleService.deleteArticle(req.params.articleId);
                if (status) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: messages_1.ArticleMessages.ARTICLE_DELETED,
                        data: null,
                    });
                }
                else {
                    res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: messages_1.ArticleMessages.ARTICLE_DELETION_FAILED,
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
    updateArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.articleId ||
                    !req.body.articleName ||
                    !req.body.description ||
                    !req.body.category) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const status = yield this.articleService.updateArticle(req.params.articleId, Object.assign(Object.assign({}, req.body), { images: req.files }));
                if (status) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: messages_1.ArticleMessages.ARTICLE_UPDATE_SUCCESS,
                        data: null,
                    });
                }
                else {
                    res.status(status_code_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: messages_1.ArticleMessages.ARTICLE_UPDATE_FAILURE,
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
    likeArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reactToArticle(req, res, "like");
        });
    }
    dislikeArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reactToArticle(req, res, "dislike");
        });
    }
    reactToArticle(req, res, reactionType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.userId || !req.params.articleId || !reactionType) {
                    res.status(status_code_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: messages_1.GeneralMessages.MISSING_REQUIRED_FIELDS,
                        data: null,
                    });
                    return;
                }
                const status = yield this.articleService.reactToArticle(req.params.userId, req.params.articleId, reactionType);
                if (status.statusCode === status_code_1.HTTP_STATUS.OK) {
                    res.status(status_code_1.HTTP_STATUS.OK).json({
                        success: true,
                        message: status.message,
                        data: null,
                    });
                }
                else {
                    res.status(status.statusCode).json({
                        success: false,
                        message: status.message,
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
exports.default = ArticleController;
