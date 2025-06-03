interface IArticle {
    id: string;
    accountId: string;
    articleName: string;
    description: string;
    category: string;
    images: string[];
    likesCount: number;
    dislikesCount: number;
    blocksCount: number;
}
export interface ICreateArticle {
    articleName: string;
    description: string;
    category: string;
    images: File[];
}

interface IArticleDetails extends IArticle {
    isLiked: boolean;
    isDisliked: boolean;
}

interface IUpdateArticle {
    articleName: string;
    description: string;
    category: string;
    images: FileList | File[];
}

export type { IArticle, IUpdateArticle, IArticleDetails };
