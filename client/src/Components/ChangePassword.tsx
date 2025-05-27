import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../Hooks/useAuth";
import { logoutApi, updatePasswordApi } from "../Api/userApi";
import toast from "react-hot-toast";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import { clearUser } from "../Redux/Slices/UserSlice";

const passwordSchema = z
    .object({
        currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
        newPassword: z.string().min(8, "New password must be at least 8 characters"),
        confirmNewPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePassword: React.FC = () => {
    const { id, loginId } = useAuth();
    const [isLoading, setLoading] = useState(false);
    const { navigate, dispatch } = useAppHelpers();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const onSubmit = async (data: PasswordFormData) => {
        try {
            setLoading(true);
            const status = await updatePasswordApi(id, {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            if (status.success) {
                reset();
                toast.success("Password updated successfully, Kindly login with new password");
                setTimeout(async () => {
                    const logoutStatus = await logoutApi();
                    navigate("/sign-in");
                    dispatch(clearUser());
                    if (!logoutStatus.success) {
                        toast.error("Failed to logout at this moment");
                    }
                }, 3000);
            } else {
                toast.error(status.message || "Failed to update password");
            }
        } catch (err: unknown) {
            console.log(err);
            toast.error("Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    if (!loginId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <p className="text-white text-lg">Please sign in to change your password.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700/50">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                        Change Password
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="currentPassword"
                                    className="block text-base font-medium text-gray-400 mb-1"
                                >
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    {...register("currentPassword")}
                                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition-colors text-base"
                                    aria-invalid={errors.currentPassword ? "true" : "false"}
                                    aria-describedby="currentPassword-error"
                                />
                                {errors.currentPassword && (
                                    <span
                                        id="currentPassword-error"
                                        className="text-amber-600 text-sm mt-1 block"
                                    >
                                        {errors.currentPassword.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-base font-medium text-gray-400 mb-1"
                                >
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    {...register("newPassword")}
                                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition-colors text-base"
                                    aria-invalid={errors.newPassword ? "true" : "false"}
                                    aria-describedby="newPassword-error"
                                />
                                {errors.newPassword && (
                                    <span
                                        id="newPassword-error"
                                        className="text-amber-600 text-sm mt-1 block"
                                    >
                                        {errors.newPassword.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmNewPassword"
                                    className="block text-base font-medium text-gray-400 mb-1"
                                >
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmNewPassword"
                                    {...register("confirmNewPassword")}
                                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition-colors text-base"
                                    aria-invalid={errors.confirmNewPassword ? "true" : "false"}
                                    aria-describedby="confirmNewPassword-error"
                                />
                                {errors.confirmNewPassword && (
                                    <span
                                        id="confirmNewPassword-error"
                                        className="text-amber-600 text-sm mt-1 block"
                                    >
                                        {errors.confirmNewPassword.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-1/2 bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-base font-medium"
                            >
                                {isSubmitting ? "Saving..." : "Change Password"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    navigate("/articles");
                                }}
                                className="w-full sm:w-1/2 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors text-base font-medium"
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

export default ChangePassword;
