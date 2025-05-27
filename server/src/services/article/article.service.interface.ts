import { IAddArticle } from "../../interfaces/article.interface";
import { IGeneralResponse } from "../../interfaces/user.interface";

export default interface IArticleService {
    createArticle(id: string, data: IAddArticle): Promise<IGeneralResponse>;
}
