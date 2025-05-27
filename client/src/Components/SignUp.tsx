import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
import { signUpApi } from "../Api/userApi";
import { interests } from "../Constants/constant";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// SignUp schema validation
const signUpSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        phone: z
            .string()
            .refine(
                (val) => !val || /^[6-9]\d{9}$/.test(val),
                "Please enter a valid 10-digit phone number"
            ),
        interests: z.array(z.string()).min(1, "Select at least one interest"),
        dateOfBirth: z.string().min(1, "Date of birth is required"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            interests: [],
            dateOfBirth: "",
            password: "",
            confirmPassword: "",
        },
    });
    const { navigate } = useAppHelpers();
    const onSubmit = async (data: SignUpFormData) => {
        const status = await signUpApi(data);

        if (status?.success) {
            navigate("/sign-in");
            toast.success(status?.message);
        } else {
            toast.error(status?.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-center text-white mb-8">
                    Join Article Feeds
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                            aria-describedby="email-error"
                        />
                        {errors.email && (
                            <span
                                id="email-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            {...register("firstName")}
                            className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                            aria-describedby="firstName-error"
                        />
                        {errors.firstName && (
                            <span
                                id="firstName-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.firstName.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            {...register("lastName")}
                            className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                            aria-describedby="lastName-error"
                        />
                        {errors.lastName && (
                            <span
                                id="lastName-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.lastName.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            Phone Number (Optional)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            {...register("phone")}
                            className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                            aria-describedby="phone-error"
                        />
                        {errors.phone && (
                            <span
                                id="phone-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.phone.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="dateOfBirth"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            {...register("dateOfBirth")}
                            className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                            aria-describedby="dateOfBirth-error"
                        />
                        {errors.dateOfBirth && (
                            <span
                                id="dateOfBirth-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.dateOfBirth.message}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="interests"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            Choose Interests
                        </label>
                        <Controller
                            name="interests"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isMulti
                                    options={interests}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(selectedOptions) => {
                                        const values = selectedOptions
                                            ? selectedOptions.map((option) => option.value)
                                            : [];

                                        field.onChange(values);
                                    }}
                                    value={interests.filter((option) => {
                                        return field.value.includes(option.value);
                                    })}
                                />
                            )}
                        />
                        {errors.interests && (
                            <span
                                id="interests-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.interests.message}
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

                    <div className="mb-8">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-200 mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                            aria-describedby="confirmPassword-error"
                        />
                        {errors.confirmPassword && (
                            <span
                                id="confirmPassword-error"
                                className="text-amber-400 text-sm mt-2 block animate-pulse"
                            >
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-md hover:from-amber-600 hover:to-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-300">
                    Already have an account?{" "}
                    <Link
                        to="/sign-in"
                        className="text-amber-400 hover:text-amber-300 transition-colors duration-200"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
