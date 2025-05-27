interface IServiceResponse {
    message: string;
    statusCode: number;
}

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

interface ISignInResponse extends IServiceResponse {
    data: null | { accessToken: string; refreshToken: string; id: string };
}

interface ISignUpResponse extends IServiceResponse {
    data: ISignUp | null;
}

export { ISignUp, ISignIn, ISignUpResponse, ISignInResponse };
