interface IArticleBase {
    article_name: string;
    description: string;
    category: string;
}

interface IAddArticle extends IArticleBase {
    images: Express.Multer.File[];
}

interface IUpdatedArticle extends IArticleBase {
    images: string[];
}

export { IAddArticle, IUpdatedArticle };
