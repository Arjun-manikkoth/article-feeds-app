interface ISignUp {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    dateOfBirth: Date;
    interests: string[];
}

interface IServiceResponse {
    message: string;
    statusCode: number;
}

interface ISignUpResponse extends IServiceResponse {
    data: ISignUp | null;
}

export { ISignUp, ISignUpResponse };
