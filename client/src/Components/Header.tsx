import React, { useState } from "react";
import { logoutApi } from "../Api/userApi";
import toast from "react-hot-toast";
import { clearUser } from "../Redux/Slices/UserSlice";
import { useAppHelpers } from "../Hooks/useAppHelpers";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isArticlesOpen, setArticlesOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);

    const { dispatch, navigate } = useAppHelpers();

    const handleLogout = async () => {
        const status = await logoutApi();
        if (!status.success) {
            toast.error(status.message);
        }
        dispatch(clearUser());
        navigate("/sign-in");
    };

    return (
        <header className="bg-gray-900 text-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-600">BlogSpot</div>
                <button
                    className="sm:hidden text-gray-200 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md p-2"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label="Toggle navigation"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 12M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
                <nav
                    className={`${
                        isMobileMenuOpen ? "block" : "hidden"
                    } sm:flex sm:items-center sm:space-x-4 absolute sm:static top-[64px] left-0 w-full sm:w-auto bg-gray-900 sm:bg-transparent p-4 sm:p-0 z-50`}
                    id="mobile-menu"
                >
                    <div className="relative">
                        <button
                            onClick={() => {
                                setArticlesOpen(!isArticlesOpen);
                                setProfileOpen(false);
                            }}
                            className="flex items-center w-full sm:w-auto px-4 py-2 text-gray-200 hover:text-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 text-left"
                            aria-expanded={isArticlesOpen}
                            aria-controls="articles-menu"
                        >
                            Articles
                            <svg
                                className="w-4 h-4 inline-block ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </button>
                        {isArticlesOpen && (
                            <div
                                id="articles-menu"
                                className="relative sm:absolute right-0 mt-2 w-full sm:w-48 max-w-[calc(100vw-2rem)] bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700"
                            >
                                <Link
                                    to="/articles"
                                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-amber-300 sm:rounded-b-md"
                                    onClick={() => {
                                        setArticlesOpen(false);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/my-articles"
                                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-amber-300 sm:rounded-t-md"
                                    onClick={() => {
                                        setArticlesOpen(false);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    My Articles
                                </Link>
                                <Link
                                    to="/add-article"
                                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-amber-300 sm:rounded-b-md"
                                    onClick={() => {
                                        setArticlesOpen(false);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Create Article
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="relative mt-4 sm:mt-0">
                        <button
                            onClick={() => {
                                setProfileOpen(!isProfileOpen);
                                setArticlesOpen(false);
                            }}
                            className="flex items-center w-full sm:w-auto px-4 py-2 text-gray-200 hover:text-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200 text-left"
                            aria-expanded={isProfileOpen}
                            aria-controls="profile-menu"
                        >
                            Profile
                            <svg
                                className="w-4 h-4 inline-block ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </button>
                        {isProfileOpen && (
                            <div
                                id="profile-menu"
                                className="relative sm:absolute right-0 mt-2 w-full sm:w-48 max-w-[calc(100vw-2rem)] bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700"
                            >
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-amber-300 sm:rounded-t-md"
                                    onClick={() => {
                                        setProfileOpen(false);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/change-password"
                                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-amber-300 sm:rounded-b-md"
                                    onClick={() => {
                                        setProfileOpen(false);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Change Password
                                </Link>
                                <p
                                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-amber-300 sm:rounded-b-md"
                                    onClick={() => handleLogout()}
                                >
                                    Logout
                                </p>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
