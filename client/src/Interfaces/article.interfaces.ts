interface IArticle {
    _id: string;
    authorId: string;
    articleName: string;
    description: string;
    category: string[];
    images: string[];
    likes: string[];
    dislikes: string[];
    blocks: string[];
}

export type { IArticle };
