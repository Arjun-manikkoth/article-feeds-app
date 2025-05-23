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

export type { SignUp, SignIn };
