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
export type { IArticle };
