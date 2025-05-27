import IArticleService from "./article.service.interface";
import IArticleRepository from "../../repository/article/article.repository.interface";
import { IAddArticle } from "../../interfaces/article.interface";
import { ProfileMessages, ArticleMessages } from "../../constants/messages";
import { HTTP_STATUS } from "../../constants/status.code";
import { IGeneralResponse } from "../../interfaces/user.interface";
import { uploadImages } from "../../utils/cloudinary";
import IUserRepository from "../../repository/user/user.repository.interface";

class ArticleService implements IArticleService {
    constructor(
        private articleRepository: IArticleRepository,
        private userRepository: IUserRepository
    ) {}

    //creates new article
    async createArticle(id: string, data: IAddArticle): Promise<IGeneralResponse> {
        try {
            const exists = await this.userRepository.getUserDataWithId(id);

            if (!exists) {
                return {
                    message: ProfileMessages.PROFILE_FETCH_FAILURE,
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    data: null,
                };
            }
            console.log(data, "data at services");

            const urls = await uploadImages(data.images);

            await this.articleRepository.addArticle(id, { ...data, images: urls });

            return {
                statusCode: HTTP_STATUS.CREATED,
                message: ArticleMessages.ARTICLE_CREATION_SUCCESS,
                data: null,
            };
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to create article");
        }
    }
}
export default ArticleService;
