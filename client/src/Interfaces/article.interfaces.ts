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

interface IUpdateArticle {
    articleName: string;
    description: string;
    category: string;
    images: FileList | File[];
}

export type { IArticle, IUpdateArticle };
