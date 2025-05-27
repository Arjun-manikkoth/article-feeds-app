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
}
export default ArticleRepository;
