import { HTTP_STATUS } from "./../constants/status.code";
import { Request, Response } from "express";
import { ArticleMessages, GeneralMessages } from "../constants/messages";
import IArticleService from "../services/article/article.service.interface";

class ArticleController {
    constructor(private articleService: IArticleService) {}

    async addArticle(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body, "req.body");
            if (
                !req.body.articleName ||
                !req.body.description ||
                !req.body.category ||
                !req.files ||
                !req.params.id
            ) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const response = await this.articleService.createArticle(req.params.id as string, {
                article_name: req.body.articleName,
                description: req.body.description,
                category: req.body.category,
                images: req.files as Express.Multer.File[],
            });

            if (response.statusCode === HTTP_STATUS.OK) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: response.message,
                    data: null,
                });
            } else {
                res.status(response.statusCode).json({
                    success: false,
                    message: response.message,
                    data: null,
                });
            }
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }
    async getMyArticles(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const response = await this.articleService.getArticles(req.params.id as string);

            if (response?.length) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: ArticleMessages.ARTICLE_FETCHING_SUCCESS,
                    data: response,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: ArticleMessages.ARTICLE_FETCHING_FAILURE,
                    data: null,
                });
            }
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }

    async getArticle(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.articleId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const response = await this.articleService.getArticle(req.params.articleId as string);

            if (response) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: ArticleMessages.ARTICLE_FETCHING_SUCCESS,
                    data: response,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: ArticleMessages.ARTICLE_FETCHING_FAILURE,
                    data: null,
                });
            }
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }
    async getAllArticles(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const response = await this.articleService.fetchAllArticles(req.params.id as string);

            if (response.length) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: ArticleMessages.ARTICLE_FETCHING_SUCCESS,
                    data: response,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: ArticleMessages.ARTICLE_FETCHING_FAILURE,
                    data: null,
                });
            }
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }

    async blockArticle(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.userId || !req.params.articleId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const status = await this.articleService.blockArticle(
                req.params.userId as string,
                req.params.articleId as string
            );

            if (status) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: ArticleMessages.ARTICLE_BLOCKED,
                    data: null,
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: ArticleMessages.ARTICLE_BLOCKING_FAILED,
                    data: null,
                });
            }
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }

    async deleteArticle(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.userId || !req.params.articleId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: GeneralMessages.MISSING_REQUIRED_FIELDS,
                    data: null,
                });
                return;
            }

            const status = await this.articleService.deleteArticle(req.params.articleId as string);

            if (status) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: ArticleMessages.ARTICLE_DELETED,
                    data: null,
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: ArticleMessages.ARTICLE_DELETION_FAILED,
                    data: null,
                });
            }
        } catch (error: any) {
            console.error(error.message);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: GeneralMessages.INTERNAL_SERVER_ERROR,
                data: null,
            });
        }
    }
}

export default ArticleController;
