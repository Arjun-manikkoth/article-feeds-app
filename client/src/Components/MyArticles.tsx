import React, { useState, useEffect } from "react";
import { useAuth } from "../Hooks/useAuth";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import toast from "react-hot-toast";
import { fetchMyArticlesApi } from "../Api/userApi";
import { FaHeart, FaThumbsDown, FaBan, FaPencilAlt, FaTrash } from "react-icons/fa";

interface Article {
    id: string;
    authorId: string;
    articleName: string;
    description: string;
    category: string[];
    images: string[];
    likesCount: number;
    dislikesCount: number;
    blocksCount: number;
}

const MyArticles: React.FC = () => {
    const { loginId, id } = useAuth();
    const { navigate } = useAppHelpers();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                if (id) {
                    const response = await fetchMyArticlesApi(id);
                    if (response.success) {
                        setArticles(response.data);
                    } else {
                        toast.error("Failed to load articles");
                    }
                }
            } catch (err) {
                toast.error("Error loading articles");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchArticles();
        }
    }, [id]);

    const handleDelete = async (articleId: string) => {
        try {
            //     setLoading(true);
            //     const response = await deleteArticleApi(articleId);
            //     if (response.success) {
            //         setArticles(articles.filter((article) => article._id !== articleId));
            //         toast.success("Article deleted successfully");
            //     } else {
            //         toast.error("Failed to delete article");
            //     }
        } catch (err) {
            toast.error("Error deleting article");
        } finally {
            setLoading(false);
        }
    };

    if (!loginId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 mx-4 sm:mx-6 lg:mx-8 pt-[144px]">
                <p className="text-white text-lg sm:text-xl font-medium">
                    Please sign in to view your articles.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-[128px]">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 px-4 sm:px-6 lg:px-8 pt-[140px] pb-10">
            <div className="max-w-6xl mx-auto">
                {articles.length === 0 ? (
                    <p className="text-gray-400 text-base sm:text-lg text-center font-medium">
                        You haven’t created any articles yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {articles.map((article) => (
                            <div
                                onClick={() => {
                                    navigate(`/view-article/${article.id}`);
                                }}
                                key={article.id}
                                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl border border-amber-600/30 overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                            >
                                {/* Image with overlay buttons */}
                                <div className="relative w-full h-60">
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

                                    {/* Floating buttons */}
                                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                                        <button
                                            onClick={() => navigate(`/edit-article/${article.id}`)}
                                            className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-yellow-600/40 text-yellow-300 transition"
                                            title="Edit"
                                        >
                                            <FaPencilAlt className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-red-600/40 text-red-400 transition"
                                            title="Delete"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Article content */}
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
                                            {article.likesCount}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaThumbsDown className="text-amber-500" />
                                            {article.dislikesCount}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaBan className="text-amber-500" />
                                            {article.blocksCount}
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

export default MyArticles;
