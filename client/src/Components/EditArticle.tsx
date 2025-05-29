import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchArticleByIdApi, updateArticleByIdApi } from "../Api/userApi";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import { interests } from "../Constants/constant";
import { useAuth } from "../Hooks/useAuth";

const filesSchema = z
    .custom<File[] | FileList>(
        (files) => {
            if (files.length === 0) {
                return true;
            }
            return files === undefined || Array.isArray(files) || files instanceof FileList;
        },
        {
            message: "Invalid file input",
        }
    )
    .refine(
        (files) => {
            if (files.length === 0) {
                return true;
            }

            const fileArray = files instanceof FileList ? Array.from(files) : files;
            return fileArray.length === 2;
        },
        {
            message: "Exactly two images are required",
        }
    )
    .refine(
        (files) => {
            if (files.length === 0) {
                return true;
            }
            const fileArray = files instanceof FileList ? Array.from(files) : files;
            return fileArray.every((file) =>
                ["image/jpeg", "image/png", "image/gif"].includes(file.type)
            );
        },
        {
            message: "Only JPEG, PNG, or GIF files are allowed",
        }
    )
    .refine(
        (files) => {
            if (files.length === 0) {
                return true;
            }
            const fileArray = files instanceof FileList ? Array.from(files) : files;
            return fileArray.every((file) => file.size <= 5 * 1024 * 1024);
        },
        {
            message: "Each file must be less than 5MB",
        }
    );

const articleSchema = z.object({
    articleName: z.string().min(1, "Article name is required").trim(),
    description: z.string().min(1, "Description is required").trim(),
    category: z.string(),
    images: filesSchema,
});

type ArticleFormData = z.infer<typeof articleSchema>;

const EditArticle: React.FC = () => {
    const { id: articleId } = useParams();
    const { navigate } = useAppHelpers();
    const [isLoading, setLoading] = useState(true);
    const [existingImages, setExistingImages] = useState<string[]>([]); // image URLs from backend

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
    });
    const { id: userId } = useAuth();
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (userId && articleId) {
                    const data = await fetchArticleByIdApi(userId, articleId);
                    if (data.success) {
                        const article = data.data;
                        console.log(article, "article");
                        setValue("articleName", article.articleName);
                        setValue("description", article.description);
                        setValue("category", article.category.toString());
                        setExistingImages(article.images);
                    } else {
                        toast.error("Failed to load article");
                        navigate("/my-articles");
                    }
                }
            } catch {
                toast.error("Error fetching article");
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [articleId, setValue, navigate]);

    const onSubmit = async (formData: ArticleFormData) => {
        try {
            if (userId && articleId) {
                setLoading(true);

                const result = await updateArticleByIdApi(userId, articleId, formData);

                if (result.success) {
                    toast.success("Article updated successfully");
                    navigate("/my-articles");
                } else {
                    toast.error("Failed to update article");
                }
            }
        } catch {
            toast.error("Error updating article");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900 pt-[128px]">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-[128px]">
            <div className="w-full max-w-2xl bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-8">
                    Edit Article
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div>
                        <label className="text-gray-300 font-semibold block mb-2">
                            Article Name
                        </label>
                        <input
                            type="text"
                            {...register("articleName")}
                            className="w-full p-4 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl"
                        />
                        {errors.articleName && (
                            <p className="text-amber-500 text-sm">{errors.articleName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-300 font-semibold block mb-2">
                            Description
                        </label>
                        <textarea
                            rows={5}
                            {...register("description")}
                            className="w-full p-4 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl"
                        />
                        {errors.description && (
                            <p className="text-amber-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-300 font-semibold block mb-2">Category</label>
                        <select
                            {...register("category")}
                            className="w-full p-4 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl"
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {interests.map((interest) => (
                                <option key={interest.value} value={interest.value}>
                                    {interest.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-amber-500 text-sm">{errors.category.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-300 font-semibold block mb-2">
                            Existing Images
                        </label>
                        <div className="flex space-x-4">
                            {existingImages.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Article image ${idx + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg border"
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-300 font-semibold block mb-2">
                            Upload New Images (Optional)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/gif"
                            {...register("images")}
                            className="w-full p-4 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl"
                        />
                        {errors.images && (
                            <p className="text-amber-500 text-sm">
                                {String(errors.images.message)}
                            </p>
                        )}
                    </div>

                    <div className="flex space-x-4 mt-6">
                        <button
                            type="submit"
                            className="w-1/2 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-xl"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Article"}
                        </button>
                        <button
                            type="button"
                            className="w-1/2 bg-gray-600 text-white p-4 rounded-xl"
                            onClick={() => navigate("/my-articles")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditArticle;
