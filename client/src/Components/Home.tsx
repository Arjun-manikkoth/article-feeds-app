import React, { useEffect, useState } from "react";
import { fetchAllArticlesApi, blockArticleApi } from "../Api/userApi";
import { useAuth } from "../Hooks/useAuth";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import toast from "react-hot-toast";
import { FaHeart, FaThumbsDown, FaBan } from "react-icons/fa";
import type { IArticle } from "../Interfaces/article.interfaces";

const Home: React.FC = () => {
    const { id: userId } = useAuth();
    const { navigate } = useAppHelpers();
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                if (userId) {
                    const response = await fetchAllArticlesApi(userId);
                    if (response.success) {
                        setArticles(response.data);
                    } else {
                        toast.error("Failed to load feed");
                    }
                }
            } catch (err: any) {
                toast.error("Error loading feed");
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchArticles();
    }, [userId]);

    const blockArticle = async (articleId: string) => {
        try {
            if (userId && articleId) {
                const status = await blockArticleApi(userId, articleId);

                if (status.success) {
                    toast.success("We will not show that article again");
                    setArticles((prev) => prev.filter((article) => article.id !== articleId));
                } else {
                    toast.error("Failed to block article");
                }
            }
        } catch (err: any) {
            toast.error("Error blocking article");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-[128px]">
                <p className="text-white text-lg">Loading feed...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 px-4 sm:px-6 lg:px-8 pt-[140px] pb-10">
            <div className="max-w-6xl mx-auto">
                {articles.length === 0 ? (
                    <p className="text-gray-400 text-base sm:text-lg text-center font-medium">
                        No articles match your preferences yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl border border-amber-600/30 overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                            >
                                <div
                                    className="relative w-full h-60"
                                    onClick={() => navigate(`/view-article/${article.id}`)}
                                >
                                    {article.images[0] ? (
                                        <img
                                            src={article.images[0]}
                                            alt={article.articleName}
                                            className="w-full h-full object-cover rounded-t-xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-t-xl">
                                            <p className="text-gray-400 text-sm">No image</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 space-y-4">
                                    <h3 className="text-base font-semibold text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text">
                                        {article.articleName}
                                    </h3>
                                    <p className="text-gray-300 text-sm line-clamp-2">
                                        {article.description.length > 80
                                            ? `${article.description.slice(0, 80)}...`
                                            : article.description}
                                    </p>
                                    <span className="text-xs bg-amber-600/20 text-amber-400 px-2 py-1 rounded-full inline-block">
                                        {article.category[0] || "Uncategorized"}
                                    </span>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <FaHeart className="text-amber-500" />
                                            {article.likesCount} Likes
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaThumbsDown className="text-amber-500" />
                                            {article.dislikesCount} Dislikes
                                        </div>
                                        <div
                                            className="flex items-center gap-1"
                                            onClick={() => blockArticle(article.id)}
                                        >
                                            <FaBan className="text-amber-500" />
                                            Not interested
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
