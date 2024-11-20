export type UserSignInData = {
    name: string;
    password: string;
    projectCode: string;
    ip: string
}

export type UserSignUpData = {
    name: string,
    username: string,
    email: string,
    mobile: string,
    password: string,
    roles: string[],
    projectCode: string
}

export type UserOtpVerify = {
    otp: string,
    name: string,
    verify: boolean,
    forgotPassword: boolean,
    projectCode: string,
    ip: string
}

export type UserResendOtp = {
    name: string
}

export type UserForgotPassword = {
    name: string
}

export type UserResetPassword = {
    name: string,
    password: string
}

export type CheckUserData = {
    username?: string;
    email?: string;
    mobile?: string;
}

export type GoogleSignData = {
    googleUid: string;
    name: string;
    email: string;
    profileImage?: string;
    roles: string[];
    projectCode: string;
    ip: string;
}

export type CompleteProfileInput = {
    email: string;
    username: string;
    ip: string;
    projectCode: string;
}