import type { IChangePassword, IEditProfile, SignIn, SignUp } from "../Interfaces/userInterfaces";
import type { ICreateArticle, IUpdateArticle } from "../Interfaces/article.interfaces";
import axiosUser from "../Axios/Interceptor";
import { isAxiosError } from "axios";

const signUpApi = async (data: SignUp) => {
    try {
        const response = await axiosUser.post("/users/sign-up", data);

        return {
            success: true,
            message: response.data.message || "Sucessfully signed Up into Account",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to sign into account",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

const signInApi = async (data: SignIn) => {
    try {
        const response = await axiosUser.post("/users/sign-in", data);
        console.log(response);
        return {
            success: true,
            message: response.data.message || "Successfully signed into account",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to sign into account",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// user profile data
const fetchProfileApi = async (id: string) => {
    try {
        const response = await axiosUser.get(`/users/${id}`);

        return {
            success: true,
            message: response.data.message || "Profile fetched successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to fetch profile",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// updates user profile data
const updateProfileApi = async (id: string | null, data: IEditProfile) => {
    try {
        const response = await axiosUser.patch(`/users/${id}`, data);

        return {
            success: true,
            message: response.data.message || "Profile updated successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to update profile",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// updates user profile data
const updatePasswordApi = async (id: string | null, data: IChangePassword) => {
    try {
        const response = await axiosUser.patch(`/users/${id}/change-password`, data);

        return {
            success: true,
            message: response.data.message || "Password updated successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to update password",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// created an article
const createArticleApi = async (id: string | null, data: ICreateArticle) => {
    try {
        const formData = new FormData();
        formData.append("articleName", data.articleName);
        formData.append("description", data.description);
        formData.append("category", data.category);

        if (data.images) {
            Array.from(data.images).forEach((file) => {
                formData.append("images", file);
            });
        }

        const response = await axiosUser.post(`/users/${id}/articles`, formData);

        return {
            success: true,
            message: response.data.message || "Article created successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to create article",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};
//api logouts clears access and refresh tokens
const logoutApi = async () => {
    try {
        const response = await axiosUser.get("/users/sign-out");

        return {
            success: true,
            message: response.data.message,
            data: null,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to sign out",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// user articles data
const fetchMyArticlesApi = async (id: string) => {
    try {
        const response = await axiosUser.get(`/users/${id}/my-articles`);

        return {
            success: true,
            message: response.data.message || "Fetched my articles successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to fetch my articles",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// fetch article data with id
const fetchArticleByIdApi = async (userId: string, articleId: string) => {
    try {
        const response = await axiosUser.get(`/users/${userId}/articles/${articleId}`);

        return {
            success: true,
            message: response.data.message || "Fetched article successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to fetch articles",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// update article data with id
const updateArticleByIdApi = async (userId: string, articleId: string, data: IUpdateArticle) => {
    try {
        const formData = new FormData();
        formData.append("articleName", data.articleName);
        formData.append("description", data.description);
        formData.append("category", data.category);

        if (data.images) {
            Array.from(data.images).forEach((file) => {
                formData.append("images", file);
            });
        }

        const response = await axiosUser.patch(`/users/${userId}/articles/${articleId}`, formData);

        return {
            success: true,
            message: response.data.message || "Article updated successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to update articles",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// fetch articles based on preferrence
const fetchAllArticlesApi = async (id: string) => {
    try {
        const response = await axiosUser.get(`/users/${id}/articles`);

        return {
            success: true,
            message: response.data.message || "Fetched preferrenced articles successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to fetch preferrenced articles",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// block article
const blockArticleApi = async (userId: string, articleId: string) => {
    try {
        const response = await axiosUser.patch(`/users/${userId}/articles/${articleId}/block`);

        return {
            success: true,
            message: response.data.message || "Article blocked successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to block article",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// delete article
const deleteArticleApi = async (userId: string, articleId: string) => {
    try {
        const response = await axiosUser.delete(`/users/${userId}/articles/${articleId}`);

        return {
            success: true,
            message: response.data.message || "Article deleted successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to delete article",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// like article
const likeArticleApi = async (userId: string, articleId: string) => {
    try {
        const response = await axiosUser.patch(`/users/${userId}/articles/${articleId}/like`);

        return {
            success: true,
            message: response.data.message || "Article marked liked successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to mark article liked",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

// dislike article
const dislikeArticleApi = async (userId: string, articleId: string) => {
    try {
        const response = await axiosUser.patch(`/users/${userId}/articles/${articleId}/dislike`);

        return {
            success: true,
            message: response.data.message || "Article marked disliked successfully",
            data: response.data.data,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to mark article disliked",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

const refreshTokenApi = async () => {
    try {
        const response = await axiosUser.post("/users/refresh-token");
        return {
            success: true,
            message: response.data.message,
            data: null,
        };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.message);
            return {
                success: false,
                message: error.response?.data.message || "Failed to refresh token",
                data: error.response?.data.data,
            };
        } else {
            console.log("An unknown error occurred");
            return {
                success: false,
                message: "An unknown error occurred",
                data: null,
            };
        }
    }
};

export {
    signUpApi,
    signInApi,
    fetchProfileApi,
    updateProfileApi,
    updatePasswordApi,
    createArticleApi,
    logoutApi,
    fetchMyArticlesApi,
    fetchArticleByIdApi,
    fetchAllArticlesApi,
    blockArticleApi,
    deleteArticleApi,
    updateArticleByIdApi,
    likeArticleApi,
    dislikeArticleApi,
    refreshTokenApi,
};
