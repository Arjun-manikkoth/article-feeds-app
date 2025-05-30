import { IArticle } from "../../models/article.model";
import { IUpdatedArticle } from "../../interfaces/article.interface";
import { BaseRepository } from "../base/base.repository";
import IArticleRepository from "./article.repository.interface";
import mongoose, { Model } from "mongoose";

class ArticleRepository extends BaseRepository<IArticle> implements IArticleRepository {
    constructor(model: Model<IArticle>) {
        super(model);
    }

    //creates new article
    async addArticle(id: string, data: IUpdatedArticle): Promise<void> {
        try {
            await this.create({
                account_id: new mongoose.Types.ObjectId(id),
                ...data,
            } as IArticle);
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to create document");
        }
    }

    async getArticlesByUserId(id: string): Promise<IArticle[] | []> {
        try {
            return await this.model
                .aggregate([
                    {
                        $match: {
                            account_id: new mongoose.Types.ObjectId(id),
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
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to fetch articles related to user");
        }
    }

    async getArticleById(id: string): Promise<IArticle | null> {
        try {
            const result = await this.findById(id);

            return result || null;
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to fetch article");
        }
    }

    async getAggregatedArticleById(userId: string, articleId: string): Promise<IArticle | null> {
        try {
            const result = await this.model
                .aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(articleId),
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
                            isLiked: { $in: [new mongoose.Types.ObjectId(userId), "$likes"] },
                            isDisliked: { $in: [new mongoose.Types.ObjectId(userId), "$dislikes"] },
                        },
                    },
                ])
                .exec();

            return result[0] || null;
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to fetch aggregated article");
        }
    }

    async fetchPreferredArticle(id: string, preferences: string[]): Promise<IArticle[] | []> {
        try {
            return await this.model
                .aggregate([
                    {
                        $match: {
                            is_deleted: false,
                            category: { $in: preferences },
                            blocks: { $ne: new mongoose.Types.ObjectId(id) },
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
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to fetch articles preferred by user");
        }
    }

    async updateArticleBlock(userId: string, articleId: string): Promise<boolean> {
        try {
            const status = await this.model.updateOne(
                { _id: articleId },
                { $addToSet: { blocks: userId } }
            );
            return status.modifiedCount > 0 ? true : false;
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to block article");
        }
    }

    async updateDeleteArticle(articleId: string): Promise<boolean> {
        try {
            return await this.update(articleId, { is_deleted: true });
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to delete article");
        }
    }

    async reactToArticle(
        userId: string,
        articleId: string,
        reaction: "like" | "dislike",
        undoOther: boolean
    ): Promise<boolean> {
        try {
            const updateQuery: any = {
                $addToSet: {
                    [reaction === "like" ? "likes" : "dislikes"]: new mongoose.Types.ObjectId(
                        userId
                    ),
                },
            };

            if (undoOther) {
                updateQuery.$pull = {
                    [reaction === "like" ? "dislikes" : "likes"]: new mongoose.Types.ObjectId(
                        userId
                    ),
                };
            }

            const status = await this.model.updateOne({ _id: articleId }, updateQuery);
            return status.modifiedCount > 0;
        } catch (error: any) {
            console.log(error.message);
            throw new Error(`Failed to ${reaction} article`);
        }
    }

    async updateArticle(articleId: string, data: IUpdatedArticle): Promise<boolean> {
        try {
            let filteredData: {
                article_name: string;
                description: string;
                category: string;
                images?: string[];
            } = {
                article_name: data.article_name,
                description: data.description,
                category: data.category,
            };

            if (data.images.length > 0) {
                filteredData.images = data.images;
            }
            return await this.update(articleId, filteredData);
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to update article");
        }
    }
}
export default ArticleRepository;
