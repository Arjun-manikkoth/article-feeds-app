import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { interests } from "../Constants/constant";
import { useAuth } from "../Hooks/useAuth";
import { z } from "zod";
import type { IUser } from "../Interfaces/userInterfaces";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
    dateOfBirth: z.string().refine(
        (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date < new Date();
        },
        { message: "Invalid date of birth" }
    ),
    preference: z.array(z.string()).min(1, "Select at least one preference"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
    const { loginId } = useAuth();
    const [user, setUser] = useState<IUser | null>(null);
    const [isEditing, setEditing] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            preference: [],
        },
    });

    useEffect(() => {
        if (!loginId) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            // try {
            //     setLoading(true);
            //     // const response = await axios.get<{ data: IUser }>("/api/users/profile", {
            //     //     headers: { Authorization: `Bearer ${token}` },
            //     // });
            //     // const userData = response.data.data;
            //     // setUser(userData);
            //     // reset({
            //     //     firstName: userData.first_name,
            //     //     lastName: userData.last_name,
            //     //     dateOfBirth: new Date(userData.date_of_birth).toISOString().split("T")[0],
            //     //     preference: userData.preference ? userData.preference.split(",") : [],
            //     // });
            // } catch (err: unknown) {
            //     setError(err.response?.data?.message || "Failed to load profile");
            // } finally {
            //     setLoading(false);
            // }
        };

        fetchProfile();
    }, [loginId, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            // const token = localStorage.getItem("accessToken");
            // if (!token) {
            //     throw new Error("No access token found");
            // }
            // const updatedData = {
            //     first_name: data.firstName,
            //     last_name: data.lastName,
            //     date_of_birth: new Date(data.dateOfBirth).toISOString(),
            //     preference: data.preference.join(","),
            // };
            // await axios.patch("/api/users/profile", updatedData, {
            //     headers: { Authorization: `Bearer ${token}` },
            // });
            // setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
            // setEditing(false);
            // alert("Profile updated successfully");
        } catch (err: unknown) {
            console.log(err);
            //alert(err.response?.data?.message || "Failed to update profile");
        }
    };

    if (!loginId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <p className="text-white text-lg">Please sign in to view your profile.</p>
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <p className="text-amber-400 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 sm:p-8 border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
                    Your Profile
                </h2>
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-4">
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
                                aria-invalid={errors.firstName ? "true" : "false"}
                                aria-describedby="firstName-error"
                            />
                            {errors.firstName && (
                                <span
                                    id="firstName-error"
                                    className="text-amber-400 text-sm mt-2 block"
                                >
                                    {errors.firstName.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
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
                                aria-invalid={errors.lastName ? "true" : "false"}
                                aria-describedby="lastName-error"
                            />
                            {errors.lastName && (
                                <span
                                    id="lastName-error"
                                    className="text-amber-400 text-sm mt-2 block"
                                >
                                    {errors.lastName.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={user?.email || ""}
                                readOnly
                                className="w-full p-3 bg-gray-700/50 text-gray-400 border border-gray-600 rounded-md cursor-not-allowed"
                                aria-describedby="email-info"
                            />
                            <span id="email-info" className="text-gray-400 text-sm mt-2 block">
                                Email cannot be edited.
                            </span>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={user?.phone || ""}
                                readOnly
                                className="w-full p-3 bg-gray-700/50 text-gray-400 border border-gray-600 rounded-md cursor-not-allowed"
                                aria-describedby="phone-info"
                            />
                            <span id="phone-info" className="text-gray-400 text-sm mt-2 block">
                                Phone cannot be edited.
                            </span>
                        </div>

                        <div className="mb-4">
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
                                aria-invalid={errors.dateOfBirth ? "true" : "false"}
                                aria-describedby="dateOfBirth-error"
                            />
                            {errors.dateOfBirth && (
                                <span
                                    id="dateOfBirth-error"
                                    className="text-amber-400 text-sm mt-2 block"
                                >
                                    {errors.dateOfBirth.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="preference"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Preferences
                            </label>
                            <Controller
                                name="preference"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        options={interests}
                                        value={interests.filter((option) =>
                                            field.value.includes(option.value)
                                        )}
                                        onChange={(selected) =>
                                            field.onChange(
                                                selected
                                                    ? selected.map((option) => option.value)
                                                    : []
                                            )
                                        }
                                        className="text-gray-900"
                                        classNamePrefix="select"
                                    />
                                )}
                            />
                            {errors.preference && (
                                <span
                                    id="preference-error"
                                    className="text-amber-400 text-sm mt-2 block"
                                >
                                    {errors.preference.message}
                                </span>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-md hover:from-amber-600 hover:to-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    reset();
                                }}
                                className="flex-1 bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-200">First Name</p>
                            <p className="text-white">{user?.firstName}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-200">Last Name</p>
                            <p className="text-white">{user?.lastName}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-200">Email</p>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-200">Phone</p>
                            <p className="text-gray-400">{user?.phone}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-200">Date of Birth</p>
                            <p className="text-white">
                                {user?.dateOfBirth
                                    ? new Date(user.dateOfBirth).toLocaleDateString()
                                    : "Not set"}
                            </p>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-200">Preferences</p>
                            <p className="text-white">
                                {user?.preference ? user.preference.split(",").join(", ") : "None"}
                            </p>
                        </div>
                        <button
                            onClick={() => setEditing(true)}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
