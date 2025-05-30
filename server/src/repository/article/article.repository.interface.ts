import { IUpdatedArticle } from "../../interfaces/article.interface";
import { IArticle } from "../../models/article.model";
import { IBaseRepository } from "../base/base.repository.interface";

export default interface IArticleRepository extends IBaseRepository<IArticle> {
    addArticle(id: string, data: IUpdatedArticle): Promise<void>;
    getArticlesByUserId(id: string): Promise<IArticle[] | []>;
    getAggregatedArticleById(userId: string, articleId: string): Promise<IArticle | null>;
    getArticleById(id: string): Promise<IArticle | null>;
    fetchPreferredArticle(id: string, preferences: string[]): Promise<IArticle[] | []>;
    updateArticleBlock(userId: string, articleId: string): Promise<boolean>;
    updateDeleteArticle(articleId: string): Promise<boolean>;
    likeArticle(userId: string, articleId: string, disliked: boolean): Promise<boolean>;
    updateArticle(articleId: string, data: IUpdatedArticle): Promise<boolean>;
}
