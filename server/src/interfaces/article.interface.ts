interface IAddArticle {
    article_name: string;
    description: string;
    category: string;
    images: Express.Multer.File[];
}

interface IUpdatedArticle {
    article_name: string;
    description: string;
    category: string;
    images: string[];
}

export { IAddArticle, IUpdatedArticle };
