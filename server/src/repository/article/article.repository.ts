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
                article_name: data.article_name,
                description: data.description,
                category: data.category,
                images: data.images,
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
                            dislikeCount: { $size: "$dislikes" },
                            blockCount: { $size: "$blocks" },
                        },
                    },
                ])
                .exec();
        } catch (error: any) {
            console.log(error.message);
            throw new Error("failed to fetch articles related to user");
        }
    }

    async getArticleById(id: string): Promise<IArticle | null> {
        try {
            const result = await this.model
                .aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(id),
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
                            dislikeCount: { $size: "$dislikes" },
                            blockCount: { $size: "$blocks" },
                        },
                    },
                ])
                .exec();

            return result[0] || null;
        } catch (error: any) {
            console.log(error.message);
            throw new Error("failed to fetch article");
        }
    }
}
export default ArticleRepository;
