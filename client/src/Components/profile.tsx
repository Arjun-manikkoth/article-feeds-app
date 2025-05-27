import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { interests } from "../Constants/constant";
import { useAuth } from "../Hooks/useAuth";
import { z } from "zod";
import type { IUser } from "../Interfaces/userInterfaces";
import { fetchProfileApi, updateProfileApi } from "../Api/userApi";
import toast from "react-hot-toast";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
    preference: z.array(z.string()).min(1, "Select at least one preference"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
    const { id, loginId } = useAuth();
    const [user, setUser] = useState<IUser | null>(null);
    const [isEditing, setEditing] = useState(false);
    const [isLoading, setLoading] = useState(true);

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
            preference: [],
        },
    });

    useEffect(() => {
        if (!loginId) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                if (id) {
                    const status = await fetchProfileApi(id);

                    if (status.success) {
                        setUser(status.data);
                        reset(status.data);
                    }
                }
            } catch (err: unknown) {
                toast.error("Unexpected error occured");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [loginId, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const status = await updateProfileApi(id, data);

            if (status.success) {
                setUser((prev) => (prev ? { ...prev, ...data } : null));
                setEditing(false);
                toast.success("Profile updated successfully");
            } else {
                toast.error(status.message);
            }
        } catch (err: unknown) {
            toast.error("Failed to update profile");
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

    return (
        <div className="min-h-screen h-full bg-gray-900 pt-16 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-700/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 mb-8">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-amber-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold mx-auto sm:mx-0">
                            {user?.firstName?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="text-center sm:text-left mt-4 sm:mt-0 sm:pl-2">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p className="text-gray-400 text-base sm:text-lg mt-1">{user?.email}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-base font-medium text-gray-400 mb-2"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        {...register("firstName")}
                                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition-colors text-base"
                                        aria-invalid={errors.firstName ? "true" : "false"}
                                        aria-describedby="firstName-error"
                                    />
                                    {errors.firstName && (
                                        <span
                                            id="firstName-error"
                                            className="text-amber-600 text-sm mt-2 block"
                                        >
                                            {errors.firstName.message}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-base font-medium text-gray-400 mb-2"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        {...register("lastName")}
                                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition-colors text-base"
                                        aria-invalid={errors.lastName ? "true" : "false"}
                                        aria-describedby="lastName-error"
                                    />
                                    {errors.lastName && (
                                        <span
                                            id="lastName-error"
                                            className="text-amber-600 text-sm mt-2 block"
                                        >
                                            {errors.lastName.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-base font-medium text-gray-400 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={user?.email || ""}
                                    readOnly
                                    className="w-full p-3 bg-gray-700 text-gray-400 border border-gray-600 rounded-lg cursor-not-allowed text-base"
                                    aria-describedby="email-info"
                                />
                                <span id="email-info" className="text-gray-500 text-sm mt-2 block">
                                    Email cannot be edited.
                                </span>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-base font-medium text-gray-400 mb-2"
                                >
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={user?.phone || ""}
                                    readOnly
                                    className="w-full p-3 bg-gray-700 text-gray-400 border border-gray-600 rounded-lg cursor-not-allowed text-base"
                                    aria-describedby="phone-info"
                                />
                                <span id="phone-info" className="text-gray-500 text-sm mt-2 block">
                                    Phone cannot be edited.
                                </span>
                            </div>

                            <div>
                                <label
                                    htmlFor="dateOfBirth"
                                    className="block text-base font-medium text-gray-400 mb-2"
                                >
                                    Date of birth
                                </label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    readOnly
                                    value={
                                        user?.dateOfBirth &&
                                        !isNaN(new Date(user.dateOfBirth).getTime())
                                            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                                            : ""
                                    }
                                    className="w-full p-3 bg-gray-700 text-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 transition-colors text-base"
                                    aria-describedby="dateOfBirth-info"
                                />

                                <span id="phone-info" className="text-gray-500 text-sm mt-2 block">
                                    Date of birth cannot be edited.
                                </span>
                            </div>

                            <div>
                                <label
                                    htmlFor="preference"
                                    className="block text-base font-medium text-gray-400 mb-2"
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
                                            classNamePrefix="select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    backgroundColor: "#374151",
                                                    borderColor: "#4b5563",
                                                    color: "white",
                                                    borderRadius: "0.5rem",
                                                    padding: "0.5rem",
                                                    fontSize: "1rem",
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: "#1f2937",
                                                    color: "white",
                                                    maxHeight: "200px",
                                                    overflowY: "auto",
                                                    zIndex: 20,
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isSelected
                                                        ? "#d97706"
                                                        : state.isFocused
                                                        ? "#374151"
                                                        : "#1f2937",
                                                    color: "white",
                                                    fontSize: "1rem",
                                                }),
                                                multiValue: (base) => ({
                                                    ...base,
                                                    backgroundColor: "#d97706",
                                                    color: "white",
                                                }),
                                                multiValueLabel: (base) => ({
                                                    ...base,
                                                    color: "white",
                                                    fontSize: "1rem",
                                                }),
                                                multiValueRemove: (base) => ({
                                                    ...base,
                                                    color: "white",
                                                    ":hover": {
                                                        backgroundColor: "#b45309",
                                                        color: "white",
                                                    },
                                                }),
                                            }}
                                        />
                                    )}
                                />
                                {errors.preference && (
                                    <span
                                        id="preference-error"
                                        className="text-amber-600 text-sm mt-2 block"
                                    >
                                        {errors.preference.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-1/2 bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-base font-medium"
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        reset();
                                    }}
                                    className="w-full sm:w-1/2 bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors text-base font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-700">
                                    <p className="text-base text-gray-400">First Name</p>
                                    <p className="text-white text-lg sm:text-xl">
                                        {user?.firstName || "Not set"}
                                    </p>
                                </div>
                                <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-700">
                                    <p className="text-base text-gray-400">Last Name</p>
                                    <p className="text-white text-lg sm:text-xl">
                                        {user?.lastName || "Not set"}
                                    </p>
                                </div>
                                <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-700">
                                    <p className="text-base text-gray-400">Email</p>
                                    <p className="text-gray-400 text-lg sm:text-xl">
                                        {user?.email || "Not set"}
                                    </p>
                                </div>
                                <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-700">
                                    <p className="text-base text-gray-400">Phone</p>
                                    <p className="text-gray-400 text-lg sm:text-xl">
                                        {user?.phone || "Not set"}
                                    </p>
                                </div>
                                <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-700">
                                    <p className="text-base text-gray-400">Date of Birth</p>
                                    <p className="text-gray-400 text-lg sm:text-xl">
                                        {user?.dateOfBirth
                                            ? new Date(user.dateOfBirth).toLocaleDateString()
                                            : "Not set"}
                                    </p>
                                </div>
                                <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-700">
                                    <p className="text-base text-gray-400">Preferences</p>
                                    <p className="text-white text-lg sm:text-xl">
                                        {user?.preference ? user.preference.join(", ") : "None"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditing(true)}
                                className="w-full bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 transition-colors text-base font-medium"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
