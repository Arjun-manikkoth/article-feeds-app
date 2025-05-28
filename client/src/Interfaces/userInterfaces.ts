import { IUser } from "./userInterfaces";
interface SignUp {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    interests: string[];
    dateOfBirth: string;
    password: string;
    confirmPassword: string;
}

interface SignIn {
    loginId: string;
    password: string;
}

export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    preference: string[];
}

export interface IEditProfile {
    firstName: string;
    lastName: string;
    preference: string[];
}

export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}

export interface IArticle {
    id: string;
    articleName: string;
    description: string;
    category: string;
    images: string[];
    likeCount: number;
    dislikeCount: number;
    blockCount: number;
}

export type { SignUp, SignIn, IUser, IArticle };
