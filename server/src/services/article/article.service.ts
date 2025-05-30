import mongoose from "mongoose";
import IArticleService from "./article.service.interface";
import IArticleRepository from "../../repository/article/article.repository.interface";
import { IAddArticle } from "../../interfaces/article.interface";
import { ProfileMessages, ArticleMessages } from "../../constants/messages";
import { HTTP_STATUS } from "../../constants/status.code";
import { IGeneralResponse } from "../../interfaces/user.interface";
import { uploadImages } from "../../utils/cloudinary";
import IUserRepository from "../../repository/user/user.repository.interface";
import { mapKeys, camelCase } from "lodash-es";
import { IArticle } from "../../models/article.model";

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

    //fetch all articles related to user
    async getArticles(id: string): Promise<IArticle[] | []> {
        try {
            const data = await this.articleRepository.getArticlesByUserId(id);
            if (data?.length) {
                return data.map((article) =>
                    mapKeys(article, (value, key) => camelCase(key))
                ) as IArticle[];
            } else return data;
        } catch (error: any) {
            console.log(error.messgage);
            throw new Error("Failed to fetch articles");
        }
    }
    //fetch article with article Id
    async getArticle(userId: string, articleId: string): Promise<IArticle | null> {
        try {
            const data = await this.articleRepository.getAggregatedArticleById(userId, articleId);

            if (data) {
                return mapKeys(data, (value, key) => camelCase(key)) as IArticle;
            } else return data;
        } catch (error: any) {
            console.log(error.messgage);
            throw new Error("Failed to fetch articles");
        }
    }

    //fetch all articles based on user preferrence
    async fetchAllArticles(id: string): Promise<IArticle[] | []> {
        try {
            const userData = await this.userRepository.getUserDataWithId(id);

            if (!userData) {
                return [];
            }

            const data = await this.articleRepository.fetchPreferredArticle(
                id,
                userData.preference
            );

            if (data?.length) {
                return data.map((article) =>
                    mapKeys(article, (value, key) => camelCase(key))
                ) as IArticle[];
            } else return data;
        } catch (error: any) {
            console.log(error.messgage);
            throw new Error("Failed to fetch articles");
        }
    }

    async blockArticle(userId: string, articleId: string): Promise<boolean> {
        try {
            return await this.articleRepository.updateArticleBlock(userId, articleId);
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to block article");
        }
    }

    async deleteArticle(articleId: string): Promise<boolean> {
        try {
            return await this.articleRepository.updateDeleteArticle(articleId);
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to delete article");
        }
    }

    async reactToArticle(
        userId: string,
        articleId: string,
        reactionType: "like" | "dislike"
    ): Promise<IGeneralResponse> {
        try {
            const data = await this.articleRepository.getArticleById(articleId);
            if (!data) {
                return {
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    message: ArticleMessages.ARTICLE_FETCHING_FAILURE,
                    data: null,
                };
            }

            const userObjectId = new mongoose.Types.ObjectId(userId);
            const isLiked = data?.likes?.includes(userObjectId) || false; //check whether the user has already liked
            const isDisliked = data?.dislikes?.includes(userObjectId) || false; //checks whether the user has already disliked

            if (
                (reactionType === "like" && isLiked) ||
                (reactionType === "dislike" && isDisliked)
            ) {
                return {
                    statusCode: HTTP_STATUS.CONFLICT,
                    message:
                        reactionType === "like"
                            ? ArticleMessages.ARTICLE_ALREADY_LIKED
                            : ArticleMessages.ARTICLE_ALREADY_DISLIKED,
                    data: null,
                };
            }

            await this.articleRepository.reactToArticle(
                userId,
                articleId,
                reactionType,
                reactionType === "like" ? isDisliked : isLiked
            );
            return {
                statusCode: HTTP_STATUS.OK,
                message:
                    reactionType === "like"
                        ? ArticleMessages.ARTICLE_LIKED
                        : ArticleMessages.ARTICLE_DISLIKED,
                data: null,
            };
        } catch (error: any) {
            console.log(error.message);
            throw new Error(`Failed to ${reactionType} article`);
        }
    }

    async updateArticle(articleId: string, data: IAddArticle): Promise<boolean> {
        try {
            let urls: string[] = [];
            if (data.images.length > 0) {
                urls = await uploadImages(data.images);
            }

            return await this.articleRepository.updateArticle(articleId, { ...data, images: urls });
        } catch (error: any) {
            console.log(error.message);
            throw new Error("Failed to update article");
        }
    }
}
export default ArticleService;
