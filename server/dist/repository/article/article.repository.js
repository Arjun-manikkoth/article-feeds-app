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
const base_repository_1 = require("../base/base.repository");
const mongoose_1 = __importDefault(require("mongoose"));
class ArticleRepository extends base_repository_1.BaseRepository {
    constructor(model) {
        super(model);
    }
    //creates new article
    addArticle(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.create(Object.assign({ account_id: new mongoose_1.default.Types.ObjectId(id) }, data));
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to create document");
            }
        });
    }
    getArticlesByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model
                    .aggregate([
                    {
                        $match: {
                            account_id: new mongoose_1.default.Types.ObjectId(id),
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            account_id: 1,
                            article_name: 1,
                            description: 1,
                            category: 1,
                            images: 1,
                            likesCount: { $size: "$likes" },
                            dislikesCount: { $size: "$dislikes" },
                            blockCount: { $size: "$blocks" },
                        },
                    },
                ])
                    .exec();
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to fetch articles related to user");
            }
        });
    }
    getArticleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.findById(id);
                return result || null;
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to fetch article");
            }
        });
    }
    getAggregatedArticleById(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model
                    .aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(articleId),
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            account_id: 1,
                            article_name: 1,
                            description: 1,
                            category: 1,
                            images: 1,
                            likesCount: { $size: "$likes" },
                            dislikesCount: { $size: "$dislikes" },
                            blockCount: { $size: "$blocks" },
                            isLiked: { $in: [new mongoose_1.default.Types.ObjectId(userId), "$likes"] },
                            isDisliked: { $in: [new mongoose_1.default.Types.ObjectId(userId), "$dislikes"] },
                        },
                    },
                ])
                    .exec();
                return result[0] || null;
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to fetch aggregated article");
            }
        });
    }
    fetchPreferredArticle(id, preferences) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model
                    .aggregate([
                    {
                        $match: {
                            is_deleted: false,
                            category: { $in: preferences },
                            blocks: { $ne: new mongoose_1.default.Types.ObjectId(id) },
                        },
                    },
                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            account_id: 1,
                            article_name: 1,
                            description: 1,
                            category: 1,
                            images: 1,
                            likesCount: { $size: "$likes" },
                            dislikesCount: { $size: "$dislikes" },
                            blockCount: { $size: "$blocks" },
                        },
                    },
                ])
                    .exec();
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to fetch articles preferred by user");
            }
        });
    }
    updateArticleBlock(userId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield this.model.updateOne({ _id: articleId }, { $addToSet: { blocks: userId } });
                return status.modifiedCount > 0 ? true : false;
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to block article");
            }
        });
    }
    updateDeleteArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.update(articleId, { is_deleted: true });
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to delete article");
            }
        });
    }
    reactToArticle(userId, articleId, reaction, undoOther) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = {
                    $addToSet: {
                        [reaction === "like" ? "likes" : "dislikes"]: new mongoose_1.default.Types.ObjectId(userId),
                    },
                };
                if (undoOther) {
                    updateQuery.$pull = {
                        [reaction === "like" ? "dislikes" : "likes"]: new mongoose_1.default.Types.ObjectId(userId),
                    };
                }
                const status = yield this.model.updateOne({ _id: articleId }, updateQuery);
                return status.modifiedCount > 0;
            }
            catch (error) {
                console.log(error.message);
                throw new Error(`Failed to ${reaction} article`);
            }
        });
    }
    updateArticle(articleId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filteredData = {
                    article_name: data.article_name,
                    description: data.description,
                    category: data.category,
                };
                if (data.images.length > 0) {
                    filteredData.images = data.images;
                }
                return yield this.update(articleId, filteredData);
            }
            catch (error) {
                console.log(error.message);
                throw new Error("Failed to update article");
            }
        });
    }
}
exports.default = ArticleRepository;
