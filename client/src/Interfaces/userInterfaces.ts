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

export type { SignUp, SignIn };
