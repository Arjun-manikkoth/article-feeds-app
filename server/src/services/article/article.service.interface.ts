import { IAddArticle } from "../../interfaces/article.interface";
import { IGeneralResponse } from "../../interfaces/user.interface";
import { IArticle } from "../../models/article.model";

export default interface IArticleService {
    createArticle(id: string, data: IAddArticle): Promise<IGeneralResponse>;
    getArticles(id: string): Promise<IArticle[] | []>;
    getArticle(id: string): Promise<IArticle | null>;
}
