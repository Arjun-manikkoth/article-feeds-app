import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInApi } from "../Api/userApi";
import toast from "react-hot-toast";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import { setUser } from "../Redux/Slices/UserSlice";

// SignIn schema validation
const signInSchema = z.object({
    loginId: z
        .string()
        .refine((value) => /^[6-9]\d{9}$/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
            message: "Must be a valid email or phone number",
        }),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            loginId: "",
            password: "",
        },
    });

    const { navigate, dispatch } = useAppHelpers();

    const onSubmit = async (data: SignInFormData) => {
        const status = await signInApi(data);

        if (status?.success) {
            dispatch(setUser({ id: status.data.id, loginId: data.loginId }));
            navigate(`/articles`);
        } else {
            toast.error(status?.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-center text-white mb-8">
                    Sign In to view Articles
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            Email or Phone no
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("loginId")}
                            className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                            aria-describedby="email-error"
                        />
                        {errors.loginId && (
                            <span
                                id="email-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.loginId.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                            aria-describedby="password-error"
                        />
                        {errors.password && (
                            <span
                                id="password-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-md hover:from-amber-600 hover:to-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-300">
                    Sign up with new account?{" "}
                    <a
                        href="/sign-up"
                        className="text-amber-400 hover:text-amber-300 transition-colors duration-200"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
