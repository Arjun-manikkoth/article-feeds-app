import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../Hooks/useAuth";
import { createArticleApi } from "../Api/userApi";
import toast from "react-hot-toast";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import { interests } from "../Constants/constant";

// Zod schema for file list validation
const filesSchema = z
    .custom<File[]>((files) => Array.isArray(files) || files instanceof FileList, {
        message: "Invalid file input",
    })
    .refine(
        (files) => {
            const fileArray = files instanceof FileList ? Array.from(files) : files;
            return fileArray.length === 2;
        },
        {
            message: "Exactly two images are required",
        }
    )
    .refine(
        (files) => {
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

const AddArticle: React.FC = () => {
    const { loginId } = useAuth();
    const [isLoading, setLoading] = useState(false);
    const { navigate } = useAppHelpers();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            articleName: "",
            description: "",
            category: "",
            images: [],
        },
    });
    const { id } = useAuth();

    const onSubmit = async (data: ArticleFormData) => {
        try {
            setLoading(true);

            const status = await createArticleApi(id, data);
            if (status.success) {
                reset();
                toast.success("Article created successfully");
                navigate("/my-articles");
            } else {
                toast.error("Failed to create article");
            }
        } catch (err: unknown) {
            toast.error("Failed to create article");
        } finally {
            setLoading(false);
        }
    };

    if (!loginId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-[128px]">
                <p className="text-white text-lg">Please sign in to create an article.</p>
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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6 pt-[128px] relative z-0">
            <div className="w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mt-6 mx-auto">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-8">
                        Create Article
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="articleName"
                                    className="block text-lg font-semibold text-gray-300 mb-2"
                                >
                                    Article Name
                                </label>
                                <input
                                    type="text"
                                    id="articleName"
                                    {...register("articleName")}
                                    placeholder="Enter article name"
                                    className="w-full p-4 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base placeholder-gray-400"
                                    aria-invalid={errors.articleName ? "true" : "false"}
                                    aria-describedby="articleName-error"
                                />
                                {errors.articleName && (
                                    <span
                                        id="articleName-error"
                                        className="text-amber-500 text-sm mt-2 block"
                                    >
                                        {errors.articleName.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-lg font-semibold text-gray-300 mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    {...register("description")}
                                    rows={6}
                                    placeholder="Describe your article"
                                    className="w-full p-4 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base placeholder-gray-400"
                                    aria-invalid={errors.description ? "true" : "false"}
                                    aria-describedby="description-error"
                                />
                                {errors.description && (
                                    <span
                                        id="description-error"
                                        className="text-amber-500 text-sm mt-2 block"
                                    >
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-lg font-semibold text-gray-300 mb-2"
                                >
                                    Category
                                </label>
                                <select
                                    id="category"
                                    {...register("category")}
                                    className="w-full p-4 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base"
                                    aria-invalid={errors.category ? "true" : "false"}
                                    aria-describedby="category-error"
                                >
                                    <option value="" disabled>
                                        Select an interest
                                    </option>
                                    {interests.map((interest) => (
                                        <option key={interest.value} value={interest.value}>
                                            {interest.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <span
                                        id="category-error"
                                        className="text-amber-500 text-sm mt-2 block"
                                    >
                                        {errors.category.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="images"
                                    className="block text-lg font-semibold text-gray-300 mb-2"
                                >
                                    Images (Select exactly two)
                                </label>
                                <input
                                    type="file"
                                    id="images"
                                    multiple
                                    accept="image/jpeg,image/png,image/gif"
                                    {...register("images")}
                                    className="w-full p-4 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:hover:bg-amber-700"
                                    aria-invalid={errors.images ? "true" : "false"}
                                    aria-describedby="images-error"
                                />
                                {errors.images && (
                                    <span
                                        id="images-error"
                                        className="text-amber-500 text-sm mt-2 block"
                                    >
                                        {String(errors.images.message)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-1/2 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-xl hover:from-amber-700 hover:to-amber-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-md text-base font-semibold"
                            >
                                {isSubmitting ? "Saving..." : "Create Article"}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="w-full sm:w-1/2 bg-gray-600 text-white p-4 rounded-xl hover:bg-gray-700 transition-all shadow-md text-base font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddArticle;
