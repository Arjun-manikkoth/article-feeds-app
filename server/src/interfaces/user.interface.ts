interface ISignUp {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    dateOfBirth: Date;
    interests: string[];
}

interface ISignIn {
    loginId: string;
    password: string;
}

interface IPasswordChange {
    password: string;
    newPassword: string;
}

interface IVerifyTokenResponse {
    id: string | null;
    email: string | null;
    role: string | null;
    message: string;
}

interface IEditProfile {
    first_name: string;
    last_name: string;
    preference: string[];
}

interface IServiceResponse {
    message: string;
    statusCode: number;
}

interface IRefreshTokenResponse extends IServiceResponse {
    accessToken: null | string;
}

interface ISignInResponse extends IServiceResponse {
    data: null | { accessToken: string; refreshToken: string; id: string };
}

interface ISignUpResponse extends IServiceResponse {
    data: ISignUp | null;
}
interface IGeneralResponse extends IServiceResponse {
    data: null;
}

export {
    ISignUp,
    ISignIn,
    ISignUpResponse,
    ISignInResponse,
    IEditProfile,
    IPasswordChange,
    IGeneralResponse,
    IVerifyTokenResponse,
    IRefreshTokenResponse,
};
