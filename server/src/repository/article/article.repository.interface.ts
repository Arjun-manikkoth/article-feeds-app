import { IUpdatedArticle } from "../../interfaces/article.interface";
import { IArticle } from "../../models/article.model";
import { IBaseRepository } from "../base/base.repository.interface";

export default interface IArticleRepository extends IBaseRepository<IArticle> {
    addArticle(id: string, data: IUpdatedArticle): Promise<void>;
    getArticlesByUserId(id: string): Promise<IArticle[] | []>;
}
