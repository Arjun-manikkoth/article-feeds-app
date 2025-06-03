import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeart, FaThumbsDown, FaBan } from "react-icons/fa";
import { fetchArticleByIdApi } from "../Api/userApi";
import { useAuth } from "../Hooks/useAuth";
import { blockArticleApi, likeArticleApi, dislikeArticleApi } from "../Api/userApi";
import type { IArticleDetails } from "../Interfaces/article.interfaces";
import { useAppHelpers } from "../Hooks/useAppHelpers";

const ArticleDetails: React.FC = () => {
    const { id: articleId } = useParams<{ id: string }>();
    const { id: userId } = useAuth();
    const [article, setArticle] = useState<IArticleDetails | null>(null);
    const [isLoading, setLoading] = useState(false);
    const { navigate } = useAppHelpers();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (userId && articleId) {
                    const response = await fetchArticleByIdApi(userId, articleId);
                    if (response.success) {
                        setArticle(response.data);
                    } else {
                        toast.error("Article not found");
                    }
                }
            } catch (error: any) {
                toast.error("Error fetching article");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [articleId]);

    const blockArticle = async (articleId: string) => {
        try {
            if (!userId || !articleId) return;

            const response = await blockArticleApi(userId, articleId);
            if (response.success) {
                toast.success("Article blocked");
                setArticle(null);
                setTimeout(() => {
                    navigate("/articles");
                }, 2000);
            } else {
                toast.error("Failed to block article");
            }
        } catch (err: any) {
            toast.error("Error blocking article");
        }
    };

    const likeArticle = async (articleId: string) => {
        try {
            if (userId && articleId) {
                const status = await likeArticleApi(userId, articleId);

                if (status.success) {
                    setArticle((prev) => {
                        if (!prev) return prev;
                        toast.success("You have reacted");
                        if (article?.isDisliked) {
                            return {
                                ...prev,
                                likesCount: prev.likesCount + 1,
                                isLiked: true,
                                isDisliked: false,
                                dislikesCount: prev.dislikesCount - 1,
                            };
                        } else {
                            return {
                                ...prev,
                                likesCount: prev.likesCount + 1,
                                isLiked: true,
                            };
                        }
                    });
                }
            }
        } catch (err: any) {
            toast.error("Error liking article");
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center pt-[128px] bg-gray-950 text-white">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center pt-[128px] bg-gray-950 text-white">
                <p className="text-lg">No article found.</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-950 text-white px-4 sm:px-6 lg:px-8 pt-[120px] pb-10">
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden">
                {article.images[0] && (
                    <img
                        src={article.images[0]}
                        alt={article.articleName}
                        className="w-full h-64 object-cover"
                    />
                )}
                <div className="p-6 space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text">
                        {article.articleName}
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base">{article.description}</p>
                    <span className="text-sm bg-amber-600/20 text-amber-400 px-3 py-1 rounded-full inline-block">
                        {article.category[0] || "Uncategorized"}
                    </span>
                    <div className="flex gap-6 text-sm text-gray-400 pt-4">
                        <div
                            className="flex items-center gap-1"
                            onClick={() => likeArticle(article.id)}
                        >
                            <FaHeart className="text-amber-500" />
                            {article.likesCount} Likes
                        </div>
                        <div
                            className="flex items-center gap-1"
                            onClick={() => dislikeArticle(article.id)}
                        >
                            <FaThumbsDown className="text-amber-500" />
                            {article.dislikesCount} Dislikes
                        </div>
                        <div
                            className="flex items-center gap-1"
                            onClick={() => blockArticle(article.id)}
                        >
                            <FaBan className="text-amber-500" />
                            Not Interested
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetails;
