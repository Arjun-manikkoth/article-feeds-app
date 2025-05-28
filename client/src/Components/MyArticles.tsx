import React, { useState, useEffect } from "react";
import { useAuth } from "../Hooks/useAuth";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import toast from "react-hot-toast";
import { fetchMyArticlesApi } from "../Api/userApi";
import { FaHeart, FaThumbsDown, FaBan, FaPencilAlt, FaTrash } from "react-icons/fa";
import type { IArticle } from "../Interfaces/userInterfaces";

const MyArticles: React.FC = () => {
    const { loginId, id } = useAuth();
    const { navigate } = useAppHelpers();
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [isLoading, setLoading] = useState(false);

    // Fetch articles on mount
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

    // Handle delete article
    const handleDelete = async (articleId: string) => {
        try {
            // setLoading(true);
            // const response = await deleteArticleApi(articleId);
            // if (response.success) {
            //     setArticles(articles.filter((article) => article._id !== articleId));
            //     toast.success("Article deleted successfully");
            // } else {
            //     toast.error("Failed to delete article");
            // }
        } catch (err) {
            toast.error("Error deleting article");
        } finally {
            setLoading(false);
        }
    };

    if (!loginId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-[144px]">
                <p className="text-white text-lg">Please sign in to view your articles.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-[144px]">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8 pt-[14px]">
            <div className="max-w-full sm:max-w-5xl lg:max-w-7xl mx-auto mt-18 relative z-10">
                {articles.length === 0 ? (
                    <p className="text-gray-400 text-lg text-center">
                        You haven’t created any articles yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden hover:scale-105 transition-transform duration-300"
                            >
                                {/* Image */}
                                {article.images[0] ? (
                                    <img
                                        src={article.images[0]}
                                        alt={article.articleName}
                                        className="w-full h-48 sm:h-56 lg:h-64 object-cover aspect-video"
                                    />
                                ) : (
                                    <div className="w-full h-48 sm:h-56 lg:h-64 bg-gray-700 flex items-center justify-center">
                                        <p className="text-gray-400">No image</p>
                                    </div>
                                )}
                                {/* Content */}
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
                                        {article.articleName}
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-base mb-4 line-clamp-2">
                                        {article.description.length > 80
                                            ? `${article.description.slice(0, 80)}...`
                                            : article.description}
                                    </p>
                                    <div className="flex items-center mb-4">
                                        <span className="text-xs sm:text-sm bg-amber-600/20 text-amber-400 px-2 sm:px-3 py-1 rounded-full">
                                            {article.category[0] || "Uncategorized"}
                                        </span>
                                    </div>
                                    {/* Stats */}
                                    <div className="flex space-x-4 sm:space-x-6 text-gray-400 text-xs sm:text-sm mb-4">
                                        <div className="flex items-center">
                                            <FaHeart className="w-4 h-4 mr-1 text-amber-500" />
                                            <span>{article.likeCount} Likes</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaThumbsDown className="w-4 h-4 mr-1 text-amber-500" />
                                            <span>{article.dislikeCount} Dislikes</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaBan className="w-4 h-4 mr-1 text-amber-500" />
                                            <span>{article.blockCount} Blocks</span>
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 z-10">
                                        <button
                                            onClick={() => {
                                                console.log(
                                                    `Navigating to edit article ${article.id}`
                                                );
                                                navigate(`/edit-article/${article.id}`);
                                            }}
                                            className="flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-md min-w-[100px]"
                                            aria-label="Edit article"
                                        >
                                            <FaPencilAlt className="w-4 h-4 mr-2" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="flex items-center justify-center bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-md min-w-[100px]"
                                            aria-label="Delete article"
                                        >
                                            <FaTrash className="w-4 h-4 mr-2" />
                                            Delete
                                        </button>
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
