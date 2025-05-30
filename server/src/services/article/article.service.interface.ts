import { IAddArticle } from "../../interfaces/article.interface";
import { IGeneralResponse } from "../../interfaces/user.interface";
import { IArticle } from "../../models/article.model";

export default interface IArticleService {
    createArticle(id: string, data: IAddArticle): Promise<IGeneralResponse>;
    getArticles(id: string): Promise<IArticle[] | []>;
    getArticle(userId: string, articleId: string): Promise<IArticle | null>;
    fetchAllArticles(id: string): Promise<IArticle[] | []>;
    blockArticle(userId: string, articleId: string): Promise<boolean>;
    deleteArticle(articleId: string): Promise<boolean>;
    likeArticle(userId: string, articleId: string): Promise<IGeneralResponse>;
    updateArticle(articleId: string, data: IAddArticle): Promise<boolean>;
}
