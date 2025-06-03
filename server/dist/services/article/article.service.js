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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messages_1 = require("../../constants/messages");
const status_code_1 = require("../../constants/status.code");
const cloudinary_1 = require("../../utils/cloudinary");
const lodash_es_1 = require("lodash-es");
class ArticleService {
    constructor(articleRepository, userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }
    //creates new article
    createArticle(id, data) {
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
                const urls = yield (0, cloudinary_1.uploadImages)(data.images);
                yield this.articleRepository.addArticle(id, Object.assign(Object.assign({}, data), { images: urls }));
                return {
                    statusCode: status_code_1.HTTP_STATUS.CREATED,
                    message: messages_1.ArticleMessages.ARTICLE_CREATION_SUCCESS,
                    data: null,
                };
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to create article");
            }
        });
    }
    //fetch all articles related to user
    getArticles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.articleRepository.getArticlesByUserId(id);
                if (data === null || data === void 0 ? void 0 : data.length) {
                    return data.map((article) => (0, lodash_es_1.mapKeys)(article, (value, key) => (0, lodash_es_1.camelCase)(key)));
                }
                else
                    return data;
            }
            catch (error) {
                console.log(error.messgage);
                throw new Error("Failed to fetch articles");
            }
        });
    }
    //fetch article with article Id
    getArticle(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.articleRepository.getAggregatedArticleById(userId, articleId);
                if (data) {
                    return (0, lodash_es_1.mapKeys)(data, (value, key) => (0, lodash_es_1.camelCase)(key));
                }
                else
                    return data;
            }
            catch (error) {
                console.log(error.messgage);
                throw new Error("Failed to fetch articles");
            }
        });
    }
    //fetch all articles based on user preferrence
    fetchAllArticles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.userRepository.getUserDataWithId(id);
                if (!userData) {
                    return [];
                }
                const data = yield this.articleRepository.fetchPreferredArticle(id, userData.preference);
                if (data === null || data === void 0 ? void 0 : data.length) {
                    return data.map((article) => (0, lodash_es_1.mapKeys)(article, (value, key) => (0, lodash_es_1.camelCase)(key)));
                }
                else
                    return data;
            }
            catch (error) {
                console.log(error.messgage);
                throw new Error("Failed to fetch articles");
            }
        });
    }
    blockArticle(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.articleRepository.updateArticleBlock(userId, articleId);
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to block article");
            }
        });
    }
    deleteArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.articleRepository.updateDeleteArticle(articleId);
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to delete article");
            }
        });
    }
    reactToArticle(userId, articleId, reactionType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const data = yield this.articleRepository.getArticleById(articleId);
                if (!data) {
                    return {
                        statusCode: status_code_1.HTTP_STATUS.NOT_FOUND,
                        message: messages_1.ArticleMessages.ARTICLE_FETCHING_FAILURE,
                        data: null,
                    };
                }
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                const isLiked = ((_a = data === null || data === void 0 ? void 0 : data.likes) === null || _a === void 0 ? void 0 : _a.includes(userObjectId)) || false; //check whether the user has already liked
                const isDisliked = ((_b = data === null || data === void 0 ? void 0 : data.dislikes) === null || _b === void 0 ? void 0 : _b.includes(userObjectId)) || false; //checks whether the user has already disliked
                if ((reactionType === "like" && isLiked) ||
                    (reactionType === "dislike" && isDisliked)) {
                    return {
                        statusCode: status_code_1.HTTP_STATUS.CONFLICT,
                        message: reactionType === "like"
                            ? messages_1.ArticleMessages.ARTICLE_ALREADY_LIKED
                            : messages_1.ArticleMessages.ARTICLE_ALREADY_DISLIKED,
                        data: null,
                    };
                }
                yield this.articleRepository.reactToArticle(userId, articleId, reactionType, reactionType === "like" ? isDisliked : isLiked);
                return {
                    statusCode: status_code_1.HTTP_STATUS.OK,
                    message: reactionType === "like"
                        ? messages_1.ArticleMessages.ARTICLE_LIKED
                        : messages_1.ArticleMessages.ARTICLE_DISLIKED,
                    data: null,
                };
            }
            catch (error) {
                console.log(error.message);
                throw new Error(`Failed to ${reactionType} article`);
            }
        });
    }
    updateArticle(articleId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let urls = [];
                if (data.images.length > 0) {
                    urls = yield (0, cloudinary_1.uploadImages)(data.images);
                }
                return yield this.articleRepository.updateArticle(articleId, Object.assign(Object.assign({}, data), { images: urls }));
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to update article");
            }
        });
    }
}
exports.default = ArticleService;
